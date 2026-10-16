'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {JSDOM}=require('jsdom');
const files=['focus/data/questions.js','focus/data/applied.js','focus/data/applied_extra.js','focus/data/numeric.js','focus/assets/focus.js'];
function page(domain){
 const w=new JSDOM('<!doctype html><html><body data-domain="'+domain+'"><div id="focus-app"></div></body></html>',{url:'https://example.test/sa/focus/'+domain+'.html',runScripts:'outside-only'}).window;
 for(const file of files)w.eval(fs.readFileSync(file,'utf8'));
 return w;
}
function change(w,id,value){let e=w.document.getElementById(id);assert.ok(e,id+' not found');e.value=value;e.dispatchEvent(new w.Event('change',{bubbles:true}));}
function click(w,selector){const e=w.document.querySelector(selector);assert.ok(e,selector+' not found');assert.ok(!e.disabled,selector+' disabled');e.click();}
const w=page('performance');
change(w,'level','numeric');
change(w,'concept','CPI');
assert.match(w.document.querySelector('#preview').textContent,/10問/);
click(w,'#begin');
const original=w.document.querySelector('.stem').textContent;
assert.match(original,/CPI/);
click(w,'[data-answer="0"]');
click(w,'#stop');
assert.match(w.document.body.textContent,/途中の演習/);
click(w,'#resume');
assert.equal(w.document.querySelector('.stem').textContent,original);
for(let i=0;i<10;i++){
 if(!w.document.querySelector('.feedback'))click(w,'[data-answer="0"]');
 click(w,'#next');
}
assert.match(w.document.body.textContent,/演習結果/);
const progress=JSON.parse(w.localStorage.getItem('sa_focus_progress_v1'));
assert.equal(progress['numeric:performance:CPI'].length,10);
assert.equal(new Set(progress['numeric:performance:CPI'].map(x=>x.id)).size,10);
assert.equal(w.localStorage.getItem('sa_focus_session_v1'),null);
click(w,'#return');
change(w,'level','numeric');
change(w,'concept','スループット');
assert.match(w.document.querySelector('#preview').textContent,/0問/);
assert.ok(w.document.querySelector('#begin').disabled);
const model=page('modeling');change(model,'level','numeric');
assert.match(model.document.querySelector('#preview').textContent,/0問/);
assert.ok(model.document.querySelector('#begin').disabled);
console.log('PASS numeric UI: concept-specific generation, 10-question session, save/resume, separate tracking, disabled unsupported topics');
