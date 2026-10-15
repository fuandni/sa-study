#!/usr/bin/env python3
"""Create source-verifiable OCR drafts for image-only 2015–2017 AM1 PDFs.

These are NOT audited question text. Never modify question records, answers,
original PDFs, review flags or the taxonomy from OCR output alone.
"""
import csv
import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
QUESTIONS = json.loads((ROOT / "a1/data/a1_questions.json").read_text("utf-8"))
OUTPUT = ROOT / "source_ocr"
YEARS = (2015, 2016, 2017)


def get_text(page):
    text = page.get_text("text", sort=True).strip()
    if len(text) >= 200:
        return text, "embedded"
    with tempfile.NamedTemporaryFile(suffix=".png") as img:
        page.get_pixmap(matrix=fitz.Matrix(2.2, 2.2), alpha=False).save(img.name)
        proc = subprocess.run(
            ["tesseract", img.name, "stdout", "-l", "jpn+eng", "--psm", "3"],
            check=True, capture_output=True, text=True
        )
    return proc.stdout.strip(), "ocr_unreviewed"


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    rows = []
    for year in YEARS:
        questions = [q for q in QUESTIONS if q["year"] == year]
        if len(questions) != 30:
            raise ValueError(f"{year}: expected 30 AM1 questions, got {len(questions)}")
        path = ROOT / "sources" / questions[0]["source_file"]
        if not path.is_file():
            raise FileNotFoundError(path)
        pdf_sha256 = hashlib.sha256(path.read_bytes()).hexdigest()
        pages = sorted({q["source_page"] for q in questions})
        chunks = [
            f"# OCR DRAFT ONLY — {year} AM1 (NOT VERIFIED)",
            f"# original_source={path.relative_to(ROOT)}",
            f"# source_sha256={pdf_sha256}",
            "# Page numbers are from the original PDF; questions are indexed only by source_page.",
            "# Human verification of wording, diagrams, options, and matching remains necessary.",
        ]
        with fitz.open(path) as pdf:
            for page_num in pages:
                page = pdf[page_num - 1]
                text, method = get_text(page)
                qids = [q["id"] for q in questions if q["source_page"] == page_num]
                chunks.extend([
                    "",
                    f"===== PDF PAGE {page_num} | {','.join(qids)} | {method} =====",
                    text,
                ])
                rows.append({
                    "year": year, "pdf_page": page_num,
                    "question_ids": ",".join(qids), "chars": len(text),
                    "method": method, "pdf_sha256": pdf_sha256
                })
        target = OUTPUT / f"{year}_a1_unreviewed.txt"
        target.write_text("\n".join(chunks) + "\n", encoding="utf-8")
        print(f"{target.relative_to(ROOT)}: {len(pages)} pages, "
              f"{sum(x['chars'] for x in rows if x['year'] == year)} chars")
    with (OUTPUT / "legacy_a1_ocr_index.csv").open(
        "w", newline="", encoding="utf-8"
    ) as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    assert set(YEARS) == {r["year"] for r in rows}


if __name__ == "__main__":
    main()
