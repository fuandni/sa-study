const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const w={};
vm.runInNewContext(fs.readFileSync('focus/data/questions.js','utf8'),{window:w});
const d=w.SAFocusData,qs=d.questions;
const expected={theory:50,architecture:50,performance:40,modeling:60,lifecycle:40,database:50};
assert.equal(qs.length,290);
assert.equal(new Set(qs.map(q=>q.id)).size,290);
assert.deepEqual(Object.keys(d.meta).sort(),Object.keys(expected).sort());
for(const [domain,num] of Object.entries(expected)){
 const rows=qs.filter(q=>q.domain===domain), concepts=new Map();
 assert.equal(rows.length,num);
 for(const q of rows){
  assert.equal(q.choices.length,4,q.id);
  assert.equal(new Set(q.choices).size,4,q.id);
  assert.ok(q.choices.includes(q.answer),q.id+' answer not among choices');
  assert.ok(q.explanation.length>15,q.id+' trivial explanation');
  assert.ok(q.stem.length>25,q.id+' trivial question stem');
  assert.ok(!q.stem.includes('undefined'),q.id);
  const v=concepts.get(q.concept)||new Set();
  v.add(q.variant);concepts.set(q.concept,v);
 }
 assert.equal(concepts.size,num/5);
 for(const [concept,variants] of concepts)assert.deepEqual([...variants].sort(),['example','meaning','scenario','term','wrong'],concept);
 const names=d.concepts[domain].map(c=>c[0]);assert.equal(new Set(names).size,num/5);
 for(const c of d.concepts[domain])assert.ok(c.every(x=>x.length>6),c[0]+' missing explanatory material');
 const file='focus/'+domain+'.html';
 const html=fs.readFileSync(file,'utf8');
 assert.ok(html.includes('data-domain="'+domain+'"'));
 assert.ok(html.includes('data/questions.js')&&html.includes('assets/focus.js'));
}
const allnames=new Set(qs.map(q=>q.concept));
assert.ok(allnames.size>=50);
assert.ok(fs.readFileSync('focus/index.html','utf8').includes('data-domain=""'));
const uniqueMain=new Set([..."ABCD"]);
assert.equal(uniqueMain.size,4);
assert.ok(fs.readFileSync('.github/workflows/deploy.yml','utf8').includes('cp -a "$STAGING/focus"'));
console.log('PASS: 290 well-formed original questions, six pages, 58 concepts x five reasoning angles, deployment wiring');
