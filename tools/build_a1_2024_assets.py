from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
src=ROOT/"_tmp_a1_2024_render"
out=ROOT/"a1"/"assets"
out.mkdir(parents=True,exist_ok=True)

crops={
    "2024_q03_tree.png":("page-05.jpg",(240,430,900,1100)),
    "2024_q06_resource_table.png":("page-07.jpg",(280,330,690,610)),
    "2024_q07_logic.png":("page-07.jpg",(180,720,980,1270)),
    "2024_q17_gompertz.png":("page-11.jpg",(170,240,900,790)),
    "2024_q18_evm.png":("page-12.jpg",(250,280,870,610)),
    "2024_q19_choice_table.png":("page-13.jpg",(130,730,870,1040)),
    "2024_q29_pl_table.png":("page-17.jpg",(330,650,700,930)),
}
for name,(page,box) in crops.items():
    im=Image.open(src/page)
    im.crop(box).save(out/name)
    print(name,(out/name).stat().st_size)
