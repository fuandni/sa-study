from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"_tmp_a1_2019_render"
OUT=ROOT/"a1"/"assets"
OUT.mkdir(parents=True,exist_ok=True)

spec={
    "2019_q06_jobs.png": ("page-05.jpg",(130,240,930,480)),
    "2019_q19_arrow.png": ("page-11.jpg",(130,250,920,650)),
}
for name,(src,box) in spec.items():
    im=Image.open(SRC/src).convert("RGB")
    crop=im.crop(box)
    crop.save(OUT/name,optimize=True)
    print(name,crop.size)
