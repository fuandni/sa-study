'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const window={};vm.runInNewContext(fs.readFileSync('focus/data/numeric.js','utf8'),{window});
const G=window.SAFocusNumeric;assert.ok(G);
const groups={theory:['M/M/1待ち行列'],architecture:['キャッシュヒット率','パイプライン処理'],performance:['CPI','アムダールの法則','平均応答時間']};
for(const [domain,concepts] of Object.entries(groups)){
 let seen=new Set();
 for(let seed=1;seed<=120;seed++){
  const a=G.make(seed,domain,20),again=G.make(seed,domain,20);
  assert.equal(a.length,20);
  assert.equal(JSON.stringify(a),JSON.stringify(again),'Deterministic regeneration matters for resumed sessions');
  for(const q of a){
   assert.equal(q.domain,domain);assert.ok(concepts.includes(q.concept));
   assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);
   assert.ok(q.choices.includes(q.answer));assert.ok(q.explanation.includes(q.answer));
   assert.ok(!q.choices.some(v=>v.includes('NaN')||v.includes('Infinity')));
   seen.add(q.stem);
  }
 }
 assert.ok(seen.size>60,domain+' does not diversify enough');
 for(const concept of concepts){const filtered=G.make(456,domain,10,concept);assert.equal(filtered.length,10);assert.ok(filtered.every(q=>q.concept===concept),domain+':'+concept+' filter broken');}
 assert.equal(G.make(456,domain,10,'does-not-exist').length,0);
}
assert.equal(G.make(123,'lifecycle',10).length,0);
for(const page of ['index','theory','architecture','performance','modeling','lifecycle','database']){
 const text=fs.readFileSync('focus/'+page+'.html','utf8');assert.ok(text.includes('data/numeric.js'));assert.ok(text.indexOf('data/numeric.js')<text.indexOf('assets/focus.js'));
}
console.log('PASS randomized calculation generators: 7200 instances, reproducibility, choices, variations, and page loads');
