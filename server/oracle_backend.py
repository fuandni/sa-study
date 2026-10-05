import os
import oracledb

ORACLE_USER = os.environ.get("ORACLE_USER", "")
ORACLE_PASSWORD = os.environ.get("ORACLE_PASSWORD", "")
ORACLE_DSN = os.environ.get("ORACLE_DSN", "")

if not ORACLE_USER:
    raise RuntimeError("ORACLE_USER is required")
if not ORACLE_PASSWORD:
    raise RuntimeError("ORACLE_PASSWORD is required")
if not ORACLE_DSN:
    raise RuntimeError("ORACLE_DSN is required")


class _OneRowResult:
    def __init__(self, row):
        self._row = row

    def fetchone(self):
        return self._row


class OracleCompatConnection:
    def __init__(self):
        self._con = oracledb.connect(
            user=ORACLE_USER,
            password=ORACLE_PASSWORD,
            dsn=ORACLE_DSN,
        )

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        try:
            if exc_type is None:
                self._con.commit()
            else:
                self._con.rollback()
        finally:
            self._con.close()

    def commit(self):
        self._con.commit()

    def rollback(self):
        self._con.rollback()

    def close(self):
        self._con.close()

    def execute(self, sql, params=None):
        compact = " ".join(sql.split()).lower()

        if compact.startswith(
            "select body,updated_at,revision from state where id=1"
        ):
            cur = self._con.cursor()
            cur.execute(
                "SELECT body, updated_at, revision FROM state WHERE id=1"
            )
            row = cur.fetchone()
            if row and hasattr(row[0], "read"):
                row = (row[0].read(), row[1], row[2])
            return _OneRowResult(row)

        if compact.startswith("select revision from state where id=1"):
            cur = self._con.cursor()
            cur.execute(
                "SELECT revision FROM state WHERE id=1 FOR UPDATE"
            )
            return cur

        if "on conflict(id) do update" in compact:
            body, updated_at, revision = params
            cur = self._con.cursor()
            cur.setinputsizes(body=oracledb.DB_TYPE_CLOB)
            cur.execute(
                """
                UPDATE state
                   SET body = :body,
                       updated_at = :updated_at,
                       revision = :revision
                 WHERE id = 1
                """,
                body=body,
                updated_at=updated_at,
                revision=revision,
            )
            if cur.rowcount == 0:
                cur.execute(
                    """
                    INSERT INTO state (id, body, updated_at, revision)
                    VALUES (1, :body, :updated_at, :revision)
                    """,
                    body=body,
                    updated_at=updated_at,
                    revision=revision,
                )
            return cur

        cur = self._con.cursor()
        if params is None:
            cur.execute(sql)
        else:
            cur.execute(sql, params)
        return cur


def conn():
    return OracleCompatConnection()
