#!/usr/bin/env python3
import os, json, hmac\nimport oracledb
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from datetime import datetime, timezone
from pathlib import Path

HOST=os.environ.get("SA_SYNC_HOST","127.0.0.1")
PORT=int(os.environ.get("SA_SYNC_PORT","8787"))
TOKEN=os.environ.get("SA_SYNC_TOKEN","")
DB=Path(os.environ.get("SA_SYNC_DB","/var/lib/sa-sync/progress.db"))
MAX_BODY=int(os.environ.get("SA_SYNC_MAX_BODY","5242880"))

if not TOKEN:
    raise SystemExit("SA_SYNC_TOKEN is required")
DB.parent.mkdir(parents=True,exist_ok=True)

def conn():
    return oracledb.connect(user=ORACLE_USER,password=ORACLE_PASSWORD,dsn=ORACLE_DSN)

def lob_text(value):
    if value is None:
        return None
    if hasattr(value,"read"):
        return value.read()
    return value

def now():
    return datetime.now(timezone.utc).isoformat()

class Handler(BaseHTTPRequestHandler):
    server_version="SAProgressSync/1.0"
    def log_message(self,fmt,*args):
        print("%s - %s" % (self.address_string(),fmt%args),flush=True)
    def _json(self,status,obj):
        raw=json.dumps(obj,ensure_ascii=False,separators=(",",":")).encode()
        self.send_response(status)
        self.send_header("Content-Type","application/json; charset=utf-8")
        self.send_header("Content-Length",str(len(raw)))
        self.send_header("Cache-Control","no-store")
        self.end_headers();self.wfile.write(raw)
    def _auth(self):
        auth=self.headers.get("Authorization","")
        supplied=auth[7:] if auth.startswith("Bearer ") else ""
        return bool(supplied) and hmac.compare_digest(supplied,TOKEN)
    def do_GET(self):
        if self.path=="/health":
            return self._json(200,{"ok":True,"service":"sa-sync"})
        if self.path!="/v1/progress":
            return self._json(404,{"error":"not_found"})
        if not self._auth():
            return self._json(401,{"error":"unauthorized"})
        with conn() as c:
            row=c.execute("SELECT body,updated_at,revision FROM state WHERE id=1").fetchone()
        if not row:
            return self._json(200,{"payload":None,"revision":0,"updated_at":None})
        try: payload=json.loads(row[0])
        except Exception: payload=None
        return self._json(200,{"payload":payload,"revision":row[2],"updated_at":row[1]})
    def do_PUT(self):
        if self.path!="/v1/progress":
            return self._json(404,{"error":"not_found"})
        if not self._auth():
            return self._json(401,{"error":"unauthorized"})
        try: n=int(self.headers.get("Content-Length","0"))
        except ValueError: n=0
        if n<=0 or n>MAX_BODY:
            return self._json(413,{"error":"invalid_body_size"})
        try:
            payload=json.loads(self.rfile.read(n))
        except Exception:
            return self._json(400,{"error":"invalid_json"})
        if not isinstance(payload,dict) or payload.get("format")!="sa-progress" or not isinstance(payload.get("progress"),dict):
            return self._json(400,{"error":"invalid_payload"})
        body=json.dumps(payload,ensure_ascii=False,separators=(",",":"))
        ts=now()
        with conn() as c:
            old=c.execute("SELECT revision FROM state WHERE id=1").fetchone()
            rev=(old[0] if old else 0)+1
            c.execute("INSERT INTO state(id,body,updated_at,revision) VALUES(1,?,?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body,updated_at=excluded.updated_at,revision=excluded.revision",(body,ts,rev))
            c.commit()
        return self._json(200,{"ok":True,"revision":rev,"updated_at":ts})
    def do_OPTIONS(self):
        self.send_response(204);self.end_headers()

if __name__=="__main__":
    with conn(): pass
    print(f"SA sync listening on http://{HOST}:{PORT}",flush=True)
    ThreadingHTTPServer((HOST,PORT),Handler).serve_forever()
