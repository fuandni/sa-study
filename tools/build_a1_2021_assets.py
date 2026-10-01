from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"_tmp_a1_2021_render"
OUT=ROOT/"a1"/"assets"
OUT.mkdir(parents=True,exist_ok=True)

spec={
    "2021_q05_availability.png": ("page-05.jpg",(105,255,930,1130)),
    "2021_q16_flowchart.png": ("page-10.jpg",(385,690,685,1165)),
    "2021_q19_network.png": ("page-12.jpg",(150,280,930,845)),
    "2021_q26_ppm.png": ("page-15.jpg",(365,230,700,535)),
}
for name,(src,box) in spec.items():
    im=Image.open(SRC/src).convert("RGB")
    crop=im.crop(box)
    crop.save(OUT/name,optimize=True)
    print(name,crop.size)
