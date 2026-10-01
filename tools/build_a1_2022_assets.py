from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
src=ROOT/"_tmp_a1_2022_render"
out=ROOT/"a1"/"assets"
out.mkdir(parents=True,exist_ok=True)

crops={
    "2022_q08_normal_forms.png":("page-05.jpg",(150,850,740,1320)),
    "2022_q16_flowchart.png":("page-09.jpg",(280,230,760,790)),
    "2022_q18_evm_table.png":("page-10.jpg",(300,300,760,580)),
    "2022_q19_schedule_table.png":("page-10.jpg",(110,760,880,1160)),
}
for name,(page,box) in crops.items():
    im=Image.open(src/page)
    im.crop(box).save(out/name)
    print(name,(out/name).stat().st_size)
