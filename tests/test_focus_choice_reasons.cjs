'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
const paths=[
 'focus/data/questions.js',
 'focus/data/applied.js',
 'focus/data/applied_extra.js',
 'focus/data/scenario_cases.js',
 'focus/data/numeric.js',
 'focus/data/choice_reasons.js',
 'focus/assets/focus.js'
];
const w={};for(const p of paths.slice(0,6))vm.runInNewContext(fs.readFileSync(p,'utf8'),{window:w});
const all=[...w.SAFocusAppliedQuestions,...w.SAFocusAppliedExtra,...w.SAFocusScenarioCases];
const target=all.filter(q=>!q.concept.startsWith('UML'));
const b=w.SAFocusChoiceReasons;
assert.equal(all.length,72);
assert.equal(target.length,66);
assert.equal(Object.keys(b.wrong).length,66);
for(const q of target){
 const entry=b.wrong[q.id],right=q.choices.indexOf(q.answer);
 assert.ok(entry,'missing per-option evidence: '+q.id);
 assert.equal(q.choices.length,4,q.id);
 assert.ok(right>=0,'answer missing: '+q.id);
 for(let i=0;i<4;i++){
  if(i===right)continue;
  const reason=Array.isArray(entry)?entry[i-1]:entry[i];
  assert.ok(typeof reason==='string'&&reason.length>=14,q.id+' missing wrong choice '+i);
 }
 assert.ok(q.explanation.length>=15,q.id+' correct proof missing');
}
for(const id of Object.keys(b.wrong))assert.ok(target.some(q=>q.id===id),'unknown/non-target question id '+id);
for(const references of Object.values(b.sources)){
 assert.ok(Array.isArray(references));
 for(const ref of references)assert.match(ref.url,/^https:\/\/[^/\s]+\/.+/);
}
const pages=['index','theory','architecture','performance','modeling','lifecycle','database'];
for(const name of pages){
 const html=fs.readFileSync('focus/'+name+'.html','utf8');
 const a=html.indexOf('data/choice_reasons.js'),f=html.indexOf('assets/focus.js');
 assert.ok(a!==-1&&f>a,name+' has correct source load order');
}
// Render a question in the real app with an existing unfinished session, then choose a wrong answer.
const q=target.find(x=>x.id==='advanced-theory-05');
const dom=new JSDOM('<!doctype html><html><body data-domain="theory"><div id="focus-app"></div></body></html>',{
 url:'https://example.test/home/focus/theory.html',runScripts:'outside-only'
});
const browser=dom.window;
browser.localStorage.setItem('sa_focus_session_v1',JSON.stringify({
 domain:'theory',ids:[q.id],index:0,answers:{},started:'2026-10-17',seed:20261017
}));
for(const file of paths)browser.eval(fs.readFileSync(file,'utf8'));
assert.ok(browser.document.querySelector('#resume'));
browser.document.querySelector('#resume').click();
const wrong=[...browser.document.querySelectorAll('[data-answer]')].find(btn=>btn.textContent.slice(1)!==q.answer);
assert.ok(wrong,'wrong button expected');
const selected=wrong.textContent.slice(1);
wrong.click();
const explanation=browser.document.querySelector('#explain').textContent;
assert.ok(explanation.includes('この選択肢が違う理由'),explanation);
const wrongIndex=q.choices.indexOf(selected);
assert.ok(explanation.includes(b.wrong[q.id][wrongIndex-1]));
assert.ok(explanation.includes(q.explanation));
assert.ok(browser.document.querySelector('.choice-reasons[open]'));
assert.equal(browser.document.querySelectorAll('.choice-reasons li').length,4);
assert.equal(browser.localStorage.getItem('sa_focus_progress_v1'),null,'do not finalize progress before end');
console.log('PASS: 66 non-UML applied questions have full four-choice evidence, shuffled option selection and safe persisted session');
