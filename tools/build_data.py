from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]
cfg = json.loads((ROOT/'data/app_config.json').read_text(encoding='utf-8'))
am2 = json.loads((ROOT/'am2/data/am2_questions.json').read_text(encoding='utf-8'))
a1_path = ROOT/'a1/data/a1_questions.json'
a1 = json.loads(a1_path.read_text(encoding='utf-8')) if a1_path.exists() else []

(ROOT/'data/app_config.js').write_text(
    'window.SA_APP_CONFIG = '+json.dumps(cfg, ensure_ascii=False)+';\n', encoding='utf-8')
(ROOT/'data/am2_questions.js').write_text(
    'window.SA_AM2_QUESTIONS = '+json.dumps(am2, ensure_ascii=False)+';\n', encoding='utf-8')
(ROOT/'data/a1_questions.js').write_text(
    'window.SA_A1_QUESTIONS = '+json.dumps(a1, ensure_ascii=False)+';\n', encoding='utf-8')
print(f'generated: A1={len(a1)} AM2={len(am2)} total={len(a1)+len(am2)}')
