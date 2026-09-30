from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"_tmp_2021_render"
OUT=ROOT/"am2"/"assets"
OUT.mkdir(parents=True,exist_ok=True)

spec={
    "2021_q07_flowchart.png": ("page-05.jpg",(270,690,820,1120)),
    "2021_q12_models.png": ("page-07.jpg",(80,650,1010,1160)),
    "2021_q24_tables.png": ("page-13.jpg",(130,250,930,550)),
}
for name,(src,box) in spec.items():
    im=Image.open(SRC/src).convert("RGB")
    crop=im.crop(box)
    crop.save(OUT/name,optimize=True)
    print(name,crop.size)
