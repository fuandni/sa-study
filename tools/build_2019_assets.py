from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
src=ROOT/"_tmp_2019_render"
out=ROOT/"am2"/"assets"
out.mkdir(parents=True,exist_ok=True)

crops={
    "2019_q01_dfd.png":("page-03.jpg",(120,250,950,1120)),
    "2019_q18_cpu.png":("page-10.jpg",(230,220,900,420)),
    "2019_q22_network.png":("page-11.jpg",(220,960,880,1085)),
}
for name,(page,box) in crops.items():
    im=Image.open(src/page)
    im.crop(box).save(out/name)
    print(name, (out/name).stat().st_size)
