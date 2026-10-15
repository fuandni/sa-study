#!/usr/bin/env python3
"""Render legacy AM2 pages from saved original source PDFs for visual review.
Temporary audit branch only. Do not alter question records.
"""
from pathlib import Path
import fitz
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SPEC={
  2015:("2015h27a_sa_am2_qs.pdf", range(3,14)),
  2016:("2016h28a_sa_am2_qs.pdf", range(3,14)),
  2017:("2017h29a_sa_am2_qs.pdf", range(9,16)),
}
for year,(filename,pages) in SPEC.items():
    source=ROOT/"sources"/filename
    out=ROOT/"audit_previews"/f"{year}_am2"
    out.mkdir(parents=True,exist_ok=True)
    with fitz.open(source) as doc:
        for page_number in pages:
            page=doc[page_number-1]
            pix=page.get_pixmap(matrix=fitz.Matrix(2.25,2.25),colorspace=fitz.csRGB,alpha=False)
            name=out/f"page_{page_number:02d}.jpg"
            Image.frombytes("RGB",(pix.width,pix.height),pix.samples).save(name,"JPEG",quality=87,optimize=True)
            print(name.relative_to(ROOT),pix.width,pix.height)
