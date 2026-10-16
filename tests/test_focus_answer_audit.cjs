'use strict';
// Independent numerical regression tests for high-risk applied questions.
// Preserve stable question IDs: a corrected answer must not discard practice history.
const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const window={};vm.runInNewContext(fs.readFileSync('focus/data/applied.js','utf8'),{window});vm.runInNewContext(fs.readFileSync('focus/data/applied_extra.js','utf8'),{window});
const questions=[...window.SAFocusAppliedQuestions,...window.SAFocusAppliedExtra];
const byId=new Map(questions.map(q=>[q.id,q]));
assert.equal(questions.length,60);
assert.equal(byId.size,60);
function expect(id,answer){
const q=byId.get(id);assert.ok(q,id+' missing');
assert.equal(q.answer,answer,id+' incorrect answer');
assert.ok(q.choices.includes(answer),id+' answer missing from choices');
}
function approx(a,b){assert.ok(Math.abs(a-b)<1e-10);}
const zX=(70-60)/5,zY=(80-70)/10;
expect('advanced-theory-06',zX>zY?'Xの方が高い':zX<zY?'Yの方が高い':'XとYは等しい');
expect('advanced-theory-04',String(0.5*1+0.25*2+0.125*3+0.125*3)+'ビット');
expect('advanced-theory-05',String(1/(10-8))+'分');
expect('advanced-architecture-01',String(.9*5+.1*105)+'ns');
expect('advanced-architecture-03',String(5+20-1));
expect('advanced-architecture-05',String(2*2)+'TB');
expect('advanced-performance-01',String(1/((1-0.8)+0.8/4))+'倍');
expect('advanced-performance-02',String(1e9*2/(2e9))+'秒');
expect('advanced-performance-05',String(Math.round((2.2-.6)/(2.2-.2)*100))+'%');
expect('advanced-performance-06',String(80*.25)+'件');
expect('advanced2-theory-04','−0.6');
expect('advanced2-architecture-01',String(4+10-1)+'クロック');
expect('advanced2-architecture-02',String(Math.round(.8*2+.2*102))+'ns');
expect('advanced2-architecture-03',String(64/4));
expect('advanced2-performance-01',String(1/.2)+'倍');
expect('advanced2-performance-02',String(5e8*1.25/(2.5e9))+'秒');
expect('advanced2-performance-04',String(Math.round((1.1-.4)/(1.1-.1)*100))+'%');
for(const q of questions){assert.equal(new Set(q.choices).size,4,q.id);assert.ok(q.explanation.length>20,q.id)}
console.log('PASS: 60 applied question invariants and independent numeric regression checks');
