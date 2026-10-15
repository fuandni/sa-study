#!/usr/bin/env python3
"""Render only remaining legacy AM1 pages to preview images for MANUAL review."""
from pathlib import Path
import fitz
from PIL import Image

BASE=Path(__file__).resolve().parents[1]
OUTPUT=BASE/"audit_previews"/"am1"
PAGES={
    2015:[12,14,15],
    2016:[5,8,9,10,15,16],
    2017:[7],
}
FILES={
    2015:"2015h27a_koudo_am1_qs.pdf",
    2016:"2016h28a_koudo_am1_qs.pdf",
    2017:"2017h29a_koudo_am1_qs.pdf",
}
def main():
    OUTPUT.mkdir(parents=True,exist_ok=True)
    for year,pages in PAGES.items():
        with fitz.open(BASE/"sources"/FILES[year]) as pdf:
            for num in pages:
                page=pdf[num-1]
                pix=page.get_pixmap(matrix=fitz.Matrix(2.1,2.1),alpha=False, colorspace=fitz.csRGB)
                fn=OUTPUT/f"{year}_p{num:02d}.jpg"
                Image.frombytes("RGB",(pix.width,pix.height),pix.samples).save(
                    fn, "JPEG", quality=84, optimize=True
                )
                print(fn.relative_to(BASE), pix.width, pix.height)
if __name__=="__main__":
    main()
