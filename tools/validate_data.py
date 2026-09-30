from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1]
cfg=json.loads((ROOT/'data/app_config.json').read_text(encoding='utf-8'))
qs=json.loads((ROOT/'am2/data/am2_questions.json').read_text(encoding='utf-8'))
errors=[]; warnings=[]
ids=[q.get('id') for q in qs]
if len(ids)!=len(set(ids)): errors.append('duplicate question IDs')
exp=cfg['am2']['expected_question_count']
if len(qs)!=exp: errors.append(f'question count: {len(qs)} != expected {exp}')
keys=set(cfg['am2']['choice_keys'])
for q in qs:
    ident=q.get('id','(no id)')
    if set(q.get('choices',{})) != keys: errors.append(f'{ident}: choices must be {sorted(keys)}')
    if q.get('answer') not in keys: errors.append(f'{ident}: invalid answer')
    if not q.get('question_text'): errors.append(f'{ident}: empty question_text')
    asset=q.get('asset_path')
    if asset and not (ROOT/'am2'/asset).exists(): errors.append(f'{ident}: missing asset {asset}')
    src=q.get('source_file')
    if src and not (ROOT/'sources'/src).exists(): errors.append(f'{ident}: missing source {src}')
years={}
for q in qs: years[q['year']]=years.get(q['year'],0)+1
for y in cfg['am2']['years']:
    n=years.get(y,0); target=cfg['am2']['expected_per_year']
    if n!=target: errors.append(f'{y}: {n} questions != expected {target}')
print('questions:',len(qs))
print('years:',years)
print('errors:',len(errors))
for e in errors: print('ERROR',e)
for w in warnings: print('WARN',w)
sys.exit(1 if errors else 0)
