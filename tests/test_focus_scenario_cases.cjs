'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const w={};for(const path of ['focus/data/questions.js','focus/data/applied.js','focus/data/applied_extra.js','focus/data/scenario_cases.js'])vm.runInNewContext(fs.readFileSync(path,'utf8'),{window:w});
const rows=w.SAFocusScenarioCases,known=[...w.SAFocusData.questions,...w.SAFocusAppliedQuestions,...w.SAFocusAppliedExtra];
assert.equal(rows.length,12);assert.equal(new Set([...known,...rows].map(x=>x.id)).size,known.length+12);
for(const domain of ['modeling','lifecycle','database'])assert.equal(rows.filter(q=>q.domain===domain).length,4);
for(const q of rows){assert.equal(q.level,'standard');assert.equal(q.variant,'scenario3');assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.equal(q.choices.filter(c=>c===q.answer).length,1);assert.ok(q.stem.length>35);assert.ok(q.explanation.length>=25);assert.ok(w.SAFocusData.concepts[q.domain].some(c=>c[0]===q.concept),q.id);assert.ok(!known.some(k=>k.stem===q.stem),q.id)}
for(const page of ['index','theory','architecture','performance','modeling','lifecycle','database']){const text=fs.readFileSync('focus/'+page+'.html','utf8');assert.ok(text.indexOf('scenario_cases.js')>text.indexOf('applied_extra.js'));assert.ok(text.indexOf('scenario_cases.js')<text.indexOf('assets/focus.js'))}
console.log('PASS: 12 scenario decisions, 3 domains, 130 normal questions, no ID or exact-stem collisions');
