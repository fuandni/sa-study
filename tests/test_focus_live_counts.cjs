'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {JSDOM}=require('jsdom');
const sourceNames=['focus/data/questions.js','focus/data/applied.js','focus/data/applied_extra.js','focus/data/scenario_cases.js','focus/data/numeric.js','focus/assets/focus.js'];
const baseline={theory:10,architecture:10,performance:8,modeling:12,lifecycle:8,database:10};
function run(domain){
  const w=new JSDOM('<!doctype html><html><body data-domain="'+domain+'"><div id="focus-app"></div></body></html>',{url:'https://example.test/sa/focus/'+(domain||'index')+'.html',runScripts:'outside-only'}).window;
  for(const file of sourceNames)w.eval(fs.readFileSync(file,'utf8'));
  return w;
}
let allIds=[];
for(const [domain,n] of Object.entries(baseline)){
 const w=run(domain),a=w.SAFocusApp,extra=w.SAFocusAppliedExtra;
 const cases=w.SAFocusScenarioCases.filter(q=>q.domain===domain).length;
 const applied=6+extra.filter(q=>q.domain===domain).length+cases;
 assert.equal(applied,10+(cases?4:0),domain);
 assert.equal(a.listFor('all','','standard').length,applied,domain+' applied');
 assert.equal(a.listFor('all','','basic').length,n,domain+' basic');
 assert.equal(a.listFor('all','','all').length,n+applied,domain+' regular');
 assert.equal(a.listFor('all','','legacy').length,n*5,domain+' archived');
 assert.equal(a.listFor('all','','smart').length,n,domain+' one per concept');
 const text=w.document.querySelector('.hero').textContent;
 assert.ok(text.includes('応用判断'+applied+'問'),domain+' header applied');
 assert.ok(text.includes('基本確認'+n+'問'),domain+' header basic');
 assert.ok(text.includes('回答済み 0 / '+(n+applied)+'問'),domain+' header progress');
 assert.ok(w.document.querySelector('#preview').textContent.includes('候補'+n+'問'),domain+' preview');
 w.document.querySelector('#level').value='all';
 w.document.querySelector('#level').dispatchEvent(new w.Event('change'));
 assert.ok(w.document.querySelector('#preview').textContent.includes('候補'+(n+applied)+'問'),domain+' regular preview');
 for(const q of extra.filter(x=>x.domain===domain)){
  allIds.push(q.id);
  assert.equal(new Set(q.choices).size,4,q.id);
  assert.ok(q.choices.includes(q.answer),q.id);
  assert.ok(q.explanation.length>=15,q.id);
  assert.ok(q.stem.length>=20,q.id);
  assert.ok(w.SAFocusData.concepts[domain].some(c=>c[0]===q.concept),q.id);
 }
 const html=fs.readFileSync('focus/'+domain+'.html','utf8');
 assert.ok(html.indexOf('data/applied_extra.js')<html.indexOf('assets/focus.js'),domain);
 assert.ok(html.includes('focus.js?v=20261016-home'),domain);
}
assert.equal(new Set(allIds).size,24);
let home=run('');
const homeText=home.document.querySelector('.hero').textContent;
assert.ok(homeText.includes('通常演習130問'),homeText);
assert.ok(homeText.includes('応用72問'),homeText);
assert.ok(homeText.includes('基本確認58問'),homeText);
const cards=[...home.document.querySelectorAll('.tile')];
assert.equal(cards.length,6);
for(const card of cards){assert.match(card.textContent,/応用(?:10|14)問・基本確認(?:8|10|12)問/);}
const all=home.SAFocusAppliedExtra;
assert.equal(all.length,24);
assert.ok(fs.readFileSync('focus/index.html','utf8').includes('applied_extra.js'));
assert.ok(fs.readFileSync('focus/index.html','utf8').includes('scenario_cases.js'));
console.log('PASS: 24 new applied questions, 72 total applied, 130 regular, per-domain UI and candidate counts consistent, archived 290 unchanged');
