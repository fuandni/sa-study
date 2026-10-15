const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const qs=[...JSON.parse(fs.readFileSync('a1/data/a1_questions.json','utf8')),...JSON.parse(fs.readFileSync('am2/data/am2_questions.json','utf8'))];
const w={};
vm.runInNewContext(fs.readFileSync('assets/js/taxonomy.js','utf8'),{window:w});
const classified=w.SATaxonomy.classifyAll(qs);
assert.equal(classified.length,550);
assert.equal(new Set(classified.map(q=>q.id)).size,550);
assert.equal(new Set(classified.map(q=>q.category)).size,11); // 10 categories + 未分類
assert.equal(new Set(classified.filter(q=>q.category!=='未分類').map(q=>q.category+'|'+q.subdomain)).size,31);
assert.equal(classified.filter(q=>q.classification_status==='正規化').length,400);
assert.equal(classified.filter(q=>q.classification_status==='暫定（OCR本文）').length,60);
assert.equal(classified.filter(q=>q.classification_status==='未分類（画像確認待ち）').length,90);
for(let i=0;i<qs.length;i++){
 assert.equal(classified[i].id,qs[i].id);
 assert.equal(classified[i].answer,qs[i].answer);
 assert.equal(classified[i].original_category,qs[i].category??null);
 assert.equal(classified[i].original_subdomain,qs[i].subdomain??null);
 assert.equal(qs[i].category,classified[i].original_category);
}
assert.ok(classified.filter(q=>q.category==='未分類').every(q=>q.id.startsWith('A1-201')));
assert.equal(classified.filter(q=>q.category==='未分類'&&q.section==='午前II').length,0);
vm.runInNewContext(fs.readFileSync('assets/js/priority.js','utf8'),{window:w});
const P=w.SAPriority;P.configure(classified);
const sample=classified.find(q=>q.id==='A1-2024-Q01');
assert.ok(Number.isFinite(P.findFreq(sample)));
const old=classified.find(q=>q.id==='A1-2015-Q01');
assert.equal(P.findFreq(old),0,'No huge fallback frequency for unclassified questions');
const agg=()=>({tries:1,correct:0,flagged:false});
const groups=P.groupRows(classified,agg,{questions:{}});
assert.ok(groups.length>20);
assert.ok(groups.every(g=>g.freq>=0&&g.priority>=0));
assert.ok(!groups.some(g=>g.subdomain==='未分類（画像問題）'));
console.log('PASS: 550 IDs preserved, taxonomy 10/31, classified 400+60, 90 disclosed; priority fallback removed');
