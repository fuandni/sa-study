#!/usr/bin/env python3
"""Generate auditable Japanese OCR drafts of 2017 AM1 PDF pages; do not change data."""
from pathlib import Path
import subprocess, json, csv
import fitz
root=Path(__file__).resolve().parents[1]
pdf=root/"sources/2017h29a_koudo_am1_qs.pdf"
out=root/"audit_outputs/2017_a1_ocr"
out.mkdir(parents=True,exist_ok=True)
questions=json.loads((root/"a1/data/a1_questions.json").read_text("utf-8"))
qs=[q for q in questions if q["year"]==2017]
assert len(qs)==30
rows=[]
with fitz.open(pdf) as doc:
 for n in sorted(set(q["source_page"] for q in qs)):
  p=doc[n-1]
  image=out/f"page_{n:02d}.png"
  p.get_pixmap(matrix=fitz.Matrix(2.7,2.7),alpha=False).save(image)
  txt=subprocess.run(["tesseract",str(image),"stdout","-l","jpn+eng","--psm","3"],capture_output=True,text=True,check=True).stdout
  (out/f"page_{n:02d}.txt").write_text(txt,"utf-8")
  rows.append({"page":n,"questions":",".join(q["id"] for q in qs if q["source_page"]==n),"characters":len(txt),"ocr_file":f"page_{n:02d}.txt"})
with (out/"index.csv").open("w",newline="",encoding="utf-8-sig") as f:
 w=csv.DictWriter(f,fieldnames=["page","questions","characters","ocr_file"]);w.writeheader();w.writerows(rows)
(out/"README.md").write_text("2017年度午前Ⅰ 問1〜30の原本ページOCR下書き。未校正のため、この段階では問題データへ反映しない。画像と原文を必ず照合すること。\n","utf-8")
print(json.dumps(rows,ensure_ascii=False))
