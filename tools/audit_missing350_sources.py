#!/usr/bin/env python3
"""Read-only audit of 350 questions without image assets against their source PDF pages.
Never guesses that an illustration is absent: page-level findings require manual review.
"""
from __future__ import annotations
import argparse
import csv
import json
import re
from collections import Counter
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
CUE = re.compile(r"(?:次|下|右|左|上|以下)の(?:図|表)|表に示す|図に示す|図中|表中|【図|【表|図のとおり|表のとおり|グラフ|回路図|模式図")
FIELDS = ["id","year","section","question_no","source_file","source_page","pdf_exists","page_valid","page_text_chars","page_image_count","page_drawing_count","page_table_count","question_cue","choice_cue","pdf_layout","assessment","page_preview"]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="audit_outputs/missing350")
    args = parser.parse_args()
    out = ROOT / args.output
    pages = out / "pages"
    pages.mkdir(parents=True, exist_ok=True)
    data = []
    for section, path in [("午前I","a1/data/a1_questions.json"),("午前II","am2/data/am2_questions.json")]:
        data.extend(json.loads((ROOT / path).read_text(encoding="utf-8")))
    missing = [q for q in data if not q.get("asset_path")]
    if len(data)!=550 or len(missing)>350:
        raise SystemExit(f"unexpected dataset: all={len(data)} missing={len(missing)}")
    docs = {}
    rows = []
    try:
        for q in missing:
            src = q.get("source_file") or ""
            page_no = q.get("source_page")
            file = ROOT / "sources" / src
            row = {k:"" for k in FIELDS}
            row.update(id=q["id"],year=q["year"],section=q["section"],question_no=q["question_no"],source_file=src,source_page=page_no,pdf_exists=int(file.is_file()))
            row["question_cue"]=int(bool(CUE.search(q.get("question_text") or "")))
            row["choice_cue"]=int(bool(CUE.search(" ".join(str(s) for s in (q.get("choices") or {}).values()))))
            if not file.is_file() or not isinstance(page_no,int):
                row["assessment"]="SOURCE_MISSING_OR_PAGE_UNKNOWN"
            else:
                if src not in docs: docs[src]=fitz.open(file)
                doc=docs[src]
                if not (1 <= page_no <= len(doc)):
                    row["assessment"]="INVALID_PAGE"
                else:
                    page=doc[page_no-1]
                    txt=page.get_text("text")
                    image_count=len(page.get_images(full=True))
                    drawing_count=len(page.get_drawings())
                    try:
                        table_count=len(page.find_tables().tables)
                    except Exception:
                        table_count=0
                    row.update(page_valid=1,page_text_chars=len(txt),page_image_count=image_count,page_drawing_count=drawing_count,page_table_count=table_count)
                    # Scanned page background images do not tell us if a specific question has a diagram.
                    row["pdf_layout"]="RASTER_PAGE" if image_count and len(txt)<50 else "TEXT_OR_MIXED_PAGE"
                    row["assessment"]="REVIEW_SOURCE_PAGE"
                    preview = f"{q['year']}_{'a1' if q['section']=='午前I' else 'am2'}_p{page_no:02d}.png"
                    target=pages/preview
                    if not target.exists():
                        pix=page.get_pixmap(matrix=fitz.Matrix(1.45,1.45),alpha=False)
                        pix.save(target)
                    row["page_preview"]=f"pages/{preview}"
            rows.append(row)
    finally:
        for doc in docs.values(): doc.close()
    with (out/"missing350_audit.csv").open("w",encoding="utf-8-sig",newline="") as f:
        writer=csv.DictWriter(f,fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    stats={
        "total_questions":len(data),
        "no_asset_questions":len(rows),
        "status_counts":dict(Counter(r["assessment"] for r in rows)),
        "source_page_render_count":len(list(pages.glob("*.png"))),
        "text_cue_questions":sum(bool(r["question_cue"] or r["choice_cue"]) for r in rows),
        "disclaimer":"Page previews must be inspected question-by-question. Raster scan and non-empty PDF page do not prove a figure belongs to a question; automatic classification as 'no image necessary' is intentionally prohibited."
    }
    (out/"summary.json").write_text(json.dumps(stats,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    (out/"README.md").write_text(
        "# 画像未登録350問：公式PDF照合一次監査\n\n"
        "全350問を元PDFのページに結び付け、対応ページをPNGで再描画しています。"
        "表は質問IDごとの確認台帳で、画像を必要としないと自動判定したものではありません。\n\n"
        "1. missing350_audit.csv の source_file / source_page / page_preview を参照。\n"
        "2. ページ画像で該当する設問領域を目視確認し、図表・数式・選択肢の欠落を照合。\n"
        "3. 欠落が見つかった設問のみ、別途個別画像を生成しレビュー。\n\n"
        "このプログラムは既存問題データ、回答、画像、学習履歴を変更しません。\n",
        encoding="utf-8")
    print(json.dumps(stats,ensure_ascii=False,indent=2))
    if stats["status_counts"].get("SOURCE_MISSING_OR_PAGE_UNKNOWN") or stats["status_counts"].get("INVALID_PAGE"):
        raise SystemExit("Source PDF or page metadata missing: review the audit artifact")

if __name__=="__main__":
    main()
