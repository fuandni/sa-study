'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const w={};vm.runInNewContext(fs.readFileSync('focus/data/questions.js','utf8'),{window:w});vm.runInNewContext(fs.readFileSync('focus/data/applied.js','utf8'),{window:w});
const basic=w.SAFocusData.questions,applied=w.SAFocusAppliedQuestions;
assert.equal(basic.length,290);
assert.equal(applied.length,36);
assert.equal(new Set([...basic,...applied].map(q=>q.id)).size,326);
for(const domain of Object.keys(w.SAFocusData.meta)){
 assert.equal(applied.filter(q=>q.domain===domain).length,6,domain);
}
for(const q of applied){
 assert.equal(q.level,'standard',q.id);
 assert.equal(q.variant,'applied',q.id);
 assert.equal(q.choices.length,4,q.id);
 assert.equal(new Set(q.choices).size,4,q.id);
 assert.equal(q.choices.filter(c=>c===q.answer).length,1,q.id);
 assert.ok(q.stem.length>=24,q.id);
 assert.ok(q.explanation.length>=25,q.id);
 assert.ok(q.concept.length>=2,q.id);
 assert.ok(w.SAFocusData.concepts[q.domain].some(row=>row[0]===q.concept),q.id);
 assert.ok(!basic.some(b=>b.stem===q.stem),q.id);
}
for(const name of ['index','theory','architecture','performance','modeling','lifecycle','database']){
 const html=fs.readFileSync('focus/'+name+'.html','utf8');
 assert.ok(html.includes('data/applied.js'),name+' missing applied bundle');
 assert.ok(html.indexOf('data/applied.js')<html.indexOf('assets/focus.js'),name+' load order');
}
const ui=fs.readFileSync('focus/assets/focus.js','utf8');
assert.ok(ui.includes('弱点優先・安定概念をスキップ（推奨）'));
assert.ok(ui.includes("level==='standard'"));
assert.ok(ui.includes("level==='all'"));
console.log('PASS: 36 independently worded applied reasoning problems; 326 total; six domains; default applied and optional foundational practice');
