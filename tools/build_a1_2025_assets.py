from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
src=ROOT/"_tmp_a1_2025_render"
out=ROOT/"a1"/"assets"
out.mkdir(parents=True,exist_ok=True)

crops={
    "2025_q03_stack.png":("page-05.jpg",(250,230,710,480)),
    "2025_q04_cpu_table.png":("page-05.jpg",(300,750,800,930)),
    "2025_q07_timing.png":("page-07.jpg",(170,390,900,680)),
    "2025_q15_osi.png":("page-11.jpg",(180,625,900,930)),
    "2025_q25_contract.png":("page-15.jpg",(130,310,970,575)),
}
for name,(page,box) in crops.items():
    im=Image.open(src/page)
    im.crop(box).save(out/name)
    print(name,(out/name).stat().st_size)
