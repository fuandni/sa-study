from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
src=ROOT/"_tmp_a1_2023_render"
out=ROOT/"a1"/"assets"
out.mkdir(parents=True,exist_ok=True)

crops={
    "2023_q02_normal.png":("page-03.jpg",(120,600,900,1150)),
    "2023_q06_hash.png":("page-05.jpg",(140,210,930,890)),
    "2023_q07_nand.png":("page-05.jpg",(250,930,880,1290)),
    "2023_q09_uml.png":("page-06.jpg",(180,690,900,1210)),
    "2023_q19_work_model.png":("page-11.jpg",(130,450,930,690)),
}
for name,(page,box) in crops.items():
    im=Image.open(src/page)
    im.crop(box).save(out/name)
    print(name,(out/name).stat().st_size)
