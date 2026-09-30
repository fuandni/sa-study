from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"_tmp_2022_render"
OUT=ROOT/"am2"/"assets"
OUT.mkdir(parents=True,exist_ok=True)

spec={
    "2022_q05_strategy.png": ("page-05.jpg",(135,245,890,665)),
    "2022_q24_schedule_waitgraph.png": ("page-14.jpg",(95,455,930,1200)),
    "2022_q25_network.png": ("page-15.jpg",(175,285,900,415)),
}
for name,(src,box) in spec.items():
    im=Image.open(SRC/src).convert("RGB")
    crop=im.crop(box)
    crop.save(OUT/name,optimize=True)
    print(name,crop.size)
