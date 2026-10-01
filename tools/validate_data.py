from pathlib import Path
import json, sys
ROOT=Path(__file__).resolve().parents[1]
cfg=json.loads((ROOT/'data/app_config.json').read_text(encoding='utf-8'))
errors=[]; warnings=[]

def validate_group(name, path, section, conf):
    qs=json.loads(path.read_text(encoding='utf-8')) if path.exists() else []
    ids=[q.get('id') for q in qs]
    if len(ids)!=len(set(ids)): errors.append(f'{name}: duplicate question IDs')
    exp=conf.get('expected_question_count')
    if exp is not None and len(qs)!=exp: errors.append(f'{name}: question count {len(qs)} != expected {exp}')
    keys=set(conf.get('choice_keys',['ア','イ','ウ','エ']))
    years={}
    for q in qs:
        ident=q.get('id','(no id)')
        if q.get('section')!=section: errors.append(f'{ident}: section must be {section}')
        years[q.get('year')]=years.get(q.get('year'),0)+1
        if set(q.get('choices',{})) != keys: errors.append(f'{ident}: choices must be {sorted(keys)}')
        if q.get('answer') not in keys: errors.append(f'{ident}: invalid answer')
        if not q.get('question_text'): errors.append(f'{ident}: empty question_text')
        asset=q.get('asset_path')
        base='a1' if section=='午前I' else 'am2'
        if asset and not (ROOT/base/asset).exists(): errors.append(f'{ident}: missing asset {asset}')
        src=q.get('source_file')
        if src and not (ROOT/'sources'/src).exists(): errors.append(f'{ident}: missing source {src}')
    for y in conf.get('years',[]):
        n=years.get(y,0); target=conf.get('expected_per_year')
        if target is not None and n!=target: errors.append(f'{name} {y}: {n} questions != expected {target}')
    return qs,years

a1,a1years=validate_group('A1',ROOT/'a1/data/a1_questions.json','午前I',cfg.get('a1',{}))
am2,am2years=validate_group('AM2',ROOT/'am2/data/am2_questions.json','午前II',cfg.get('am2',{}))
all_ids=[q.get('id') for q in a1+am2]
if len(all_ids)!=len(set(all_ids)): errors.append('cross-section duplicate question IDs')
print('A1:',len(a1),a1years)
print('AM2:',len(am2),am2years)
print('TOTAL:',len(a1)+len(am2))
print('errors:',len(errors))
for e in errors: print('ERROR',e)
for w in warnings: print('WARN',w)
sys.exit(1 if errors else 0)
