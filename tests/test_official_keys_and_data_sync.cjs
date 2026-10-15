'use strict';
/* Regression guard: production JS is built from canonical question JSON.
   Legacy AM2 official keys below were transcribed separately from IPA PDFs.
   Never silently treat OCR or old deployed JS as the independent answer source.
*/
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
const load=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
function getBundle(file,globalName){
 const code=fs.readFileSync(path.join(ROOT,file),'utf8').trim();
 const prefix='window.'+globalName+' = ';
 assert.ok(code.startsWith(prefix),'JS does not define '+globalName);
 assert.ok(code.endsWith(';'),'JS bundle missing closing semicolon');
 return JSON.parse(code.slice(prefix.length,-1));
}
const config=[
 ['午前I','a1/data/a1_questions.json','data/a1_questions.js','SA_A1_QUESTIONS',300],
 ['午前II','am2/data/am2_questions.json','data/am2_questions.js','SA_AM2_QUESTIONS',250]
];
const all=[];
for(const [section,jsonPath,jsPath,globalName,count] of config){
 const canonical=load(jsonPath);
 const live=getBundle(jsPath,globalName);
 assert.equal(canonical.length,count,section+' wrong source count');
 assert.equal(live.length,count,section+' wrong production count');
 assert.deepEqual(live,canonical,section+': source JSON and production JS differ. Run python3 tools/build_data.py and commit BOTH!');
 for(const q of canonical){
  assert.equal(q.section,section);
  assert.ok(typeof q.question_text==='string'&&q.question_text.length);
  assert.deepEqual(Object.keys(q.choices).sort(),['ア','イ','ウ','エ']);
  assert.ok(Object.hasOwn(q.choices,q.answer),q.id+' missing answer choice');
  all.push(q);
 }
}
assert.equal(new Set(all.map(q=>q.id)).size,550);
const official=load('data/official_answer_keys_2015_2017_am2.json');
assert.equal(Object.keys(official.years).length,3);
let officialCompared=0;
for(const [year,source] of Object.entries(official.years)){
 assert.ok(source.source_url.startsWith('https://www.ipa.go.jp/shiken/mondai-kaiotu/'));
 assert.ok(source.source_url.endsWith(year+'h'+({2015:'27',2016:'28',2017:'29'}[year])+'a_sa_am2_ans.pdf'),year+' wrong official key URL');
 const yearQs=all.filter(q=>q.section==='午前II'&&q.year===Number(year));
 assert.equal(yearQs.length,25,year+' must contain 25 AM2 questions');
 assert.equal(Object.keys(source.answers).length,25);
 for(let number=1;number<=25;number++){
  const q=yearQs.find(q=>q.question_no===number);
  const officialAnswer=source.answers[String(number)];
  assert.ok(['ア','イ','ウ','エ'].includes(officialAnswer),'invalid IPA answer '+year+' Q'+number);
  assert.equal(q.answer,officialAnswer,year+' AM2 Q'+number+' disagrees with independent official IPA PDF');
  officialCompared++;
 }
}
assert.equal(officialCompared,75);
const target=all.filter(q=>q.section==='午前II'&&(q.year===2015||q.year===2016||(q.year===2017&&q.question_no>=16)));
assert.equal(target.length,60);
assert.ok(target.every(q=>q.audit_status==='source_page_question_options_visually_checked_2026-10-15'));
assert.equal(target.filter(q=>q.source_image_required).length,9);
for(const q of target){
 assert.ok(q.source_page>=3);
 assert.ok(q.source_file.endsWith('_sa_am2_qs.pdf'));
 if(q.source_image_required)assert.ok(q.source_image_crop,'important diagram crop missing: '+q.id);
 const entries=[q.question_text,...Object.values(q.choices)];
 for(const t of entries){
  assert.ok(!/[ァ-ヶ] [ァ-ヶ]/.test(t),'OCR mid-word whitespace in '+q.id);
  assert.equal((t.match(/“/g)||[]).length,(t.match(/”/g)||[]).length,'unpaired smart quote in '+q.id);
 }
 assert.ok(!q.question_text.includes('原文テキストは未構造化'),q.id+' stale image-only stub');
}
assert.equal(all.find(q=>q.id==='SA-2015-AM2-Q23').answer,'エ');
assert.ok(all.find(q=>q.id==='SA-2016-AM2-Q15').question_text.includes('“環境物品等”'));
assert.ok(!all.find(q=>q.id==='A1-2017-Q01').question_text.includes('原文テキストは未構造化'));
console.log('PASS: canonical 550 questions == deployed JS payloads; official IPA answer keys 75/75; visual AM2 questions 60/60 with 9 diagram refs; no old transcription placeholders.');
