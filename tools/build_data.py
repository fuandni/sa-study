from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]
cfg = json.loads((ROOT/'data/app_config.json').read_text(encoding='utf-8'))
q = json.loads((ROOT/'am2/data/am2_questions_75.json').read_text(encoding='utf-8'))
(ROOT/'data/app_config.js').write_text(
    'window.SA_APP_CONFIG = '+json.dumps(cfg, ensure_ascii=False)+';\n', encoding='utf-8')
(ROOT/'data/am2_questions.js').write_text(
    'window.SA_AM2_QUESTIONS = '+json.dumps(q, ensure_ascii=False)+';\n', encoding='utf-8')
print(f'generated: {len(q)} questions')
