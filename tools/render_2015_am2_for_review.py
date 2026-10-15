#!/usr/bin/env python3
"""Render saved 2015 AM2 official source PDF to JPG for human visual audit.
Never modify exam question data, answers, or verified flags here.
"""
from pathlib import Path
import fitz
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"sources/2015h27a_sa_am2_qs.pdf"
OUT=ROOT/"audit_previews/2015_am2"
OUT.mkdir(parents=True,exist_ok=True)
with fitz.open(SRC) as doc:
    for page_number in range(3,14):
        page=doc[page_number-1]
        pix=page.get_pixmap(matrix=fitz.Matrix(2.25,2.25),colorspace=fitz.csRGB,alpha=False)
        name=OUT/f"page_{page_number:02d}.jpg"
        Image.frombytes("RGB",(pix.width,pix.height),pix.samples).save(name,"JPEG",quality=87,optimize=True)
        print(name.relative_to(ROOT),pix.width,pix.height)
