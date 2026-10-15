const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const qs=[...JSON.parse(fs.readFileSync('a1/data/a1_questions.json','utf8')),...JSON.parse(fs.readFileSync('am2/data/am2_questions.json','utf8'))];
const w={};
vm.runInNewContext(fs.readFileSync('assets/js/taxonomy.js','utf8'),{window:w});
const classified=w.SATaxonomy.classifyAll(qs);
assert.equal(classified.length,550);
assert.equal(new Set(classified.map(q=>q.id)).size,550);
assert.equal(new Set(classified.map(q=>q.category)).size,10);
assert.equal(new Set(classified.filter(q=>q.category!=='未分類').map(q=>q.category+'|'+q.subdomain)).size,31);
assert.equal(classified.filter(q=>q.classification_status==='正規化').length,400);
assert.equal(classified.filter(q=>q.classification_status==='暫定（OCR本文）').length,60);
assert.equal(classified.filter(q=>q.classification_status==='暫定（外部論点索引）').length,90);
assert.equal(classified.filter(q=>q.classification_status==='未分類（要確認）').length,0);
for(let i=0;i<qs.length;i++){
 assert.equal(classified[i].id,qs[i].id);
 assert.equal(classified[i].answer,qs[i].answer);
 assert.equal(classified[i].original_category,qs[i].category??null);
 assert.equal(classified[i].original_subdomain,qs[i].subdomain??null);
 assert.equal(qs[i].category,classified[i].original_category);
}
assert.ok(classified.every(q=>q.category!=='未分類'));
const legacy=classified.filter(q=>q.classification_status==='暫定（外部論点索引）');
assert.equal(legacy.length,90);
const ocrPending=classified.filter(q=>q.classification_status==='暫定（OCR本文）');
assert.equal(ocrPending.length,60);
assert.ok(ocrPending.every(q=>q.audit_status==='source_page_question_options_visually_checked_2026-10-15'));
assert.ok(ocrPending.every(q=>q.content_review_status==='公式PDFで設問・選択肢を照合済み'));
assert.ok(ocrPending.every(q=>q.content_review_source_url?.includes('github.com/fuandni/sa-study/blob/main/sources/')));
assert.ok(ocrPending.every(q=>q.content_review_source_url.endsWith('#page='+q.source_page)));
assert.equal(ocrPending.filter(q=>q.year===2015).length,25);
assert.equal(ocrPending.filter(q=>q.year===2016).length,25);
assert.equal(ocrPending.filter(q=>q.year===2017).length,10);
assert.equal(classified.filter(q=>q.content_review_status&&q.classification_status!=='暫定（OCR本文）').length,0);
for(const q of ocrPending){
 assert.equal(q.source_file.startsWith(String(q.year)),true,'year mismatch '+q.id);
 assert.equal(new Set(Object.keys(q.choices)).size,4,q.id);
 assert.equal(q.source_image_required===true,Boolean(q.source_image_crop),q.id);
}
const fix2016=Object.fromEntries([5,8,9,21].map(n=>[n,ocrPending.find(q=>q.id==='SA-2016-AM2-Q'+String(n).padStart(2,'0'))]));
assert.ok(fix2016[5].question_text.includes('ボトムアップアプローチに関する'));
assert.ok(fix2016[5].choices['イ'].includes('論理データモデル'));
assert.ok(fix2016[8].choices['イ'].includes('利用者ニーズ'));
assert.ok(fix2016[9].question_text.includes('コーディング規則'));
assert.ok(fix2016[21].question_text.includes('データベース状態'));
assert.equal(ocrPending.find(q=>q.id==='SA-2015-AM2-Q23').subdomain,'暗号・認証');
assert.equal(ocrPending.filter(q=>q.source_image_required).length,9);

assert.ok(ocrPending.every(q=>q.classification_source_url?.startsWith('https://github.com/fuandni/sa-study/blob/main/sources/')));
assert.ok(ocrPending.every(q=>q.classification_source_url.endsWith('.pdf')));
assert.ok(legacy.every(q=>q.classification_source_url?.startsWith('https://www.nw-siken.com/')));
assert.ok(legacy.every(q=>typeof q.topic==='string'&&q.topic.length>0),'every legacy image question has a short topic summary');
assert.ok(legacy.every(q=>q.topic_status==='外部論点の短い要約'));
const reviewed=legacy.filter(q=>q.topic_review_status==='公式PDFで設問主題を照合済み');
assert.equal(reviewed.length,90,'all 90 historical AM1 topics were compared visually to source PDF pages');
for(const year of [2015,2016,2017]){
 const rows=reviewed.filter(q=>q.year===year);
 assert.equal(rows.length,30,year+' must have all 30 topics visually reviewed');
 for(let n=1;n<=30;n++){
  const id='A1-'+year+'-Q'+String(n).padStart(2,'0');
  const q=rows.find(q=>q.id===id);
  assert.ok(q,id+' was not verified');
  assert.equal(q.topic_review_status,'公式PDFで設問主題を照合済み');
  assert.ok(q.topic_review_source_url.includes('ipa.go.jp/shiken/'));
  assert.ok(q.topic_review_source_url.endsWith('#page='+q.source_page));
 }
}
assert.equal(classified.filter(q=>q.classification_status==='暫定（OCR本文）'&&q.topic_review_status).length,0,
 'AM2 OCR-draft questions must not be incorrectly treated as visually reviewed');
assert.equal(classified.find(q=>q.id==='A1-2015-Q23').topic_review_status,'公式PDFで設問主題を照合済み');
assert.equal(classified.find(q=>q.id==='A1-2016-Q06').topic_review_status,'公式PDFで設問主題を照合済み');
assert.equal(classified.find(q=>q.id==='A1-2017-Q11').topic_review_status,'公式PDFで設問主題を照合済み');
assert.ok(legacy.every(q=>q.original_topic===null));
assert.equal(classified.find(q=>q.id==='A1-2015-Q01').topic,'集合と包含関係');
assert.equal(classified.find(q=>q.id==='A1-2016-Q01').topic,'数値計算の二分法');
assert.equal(classified.find(q=>q.id==='A1-2017-Q01').topic,'相関係数');
assert.ok(qs.find(q=>q.id==='A1-2015-Q01').question_text.includes('画像で参照'),'question text stays untouched');

assert.equal(classified.find(q=>q.id==='A1-2015-Q30').subdomain,'法務・知的財産');
assert.equal(classified.find(q=>q.id==='A1-2016-Q03').subdomain,'アルゴリズム');
assert.equal(classified.find(q=>q.id==='A1-2017-Q12').subdomain,'攻撃・防御');
assert.equal(classified.find(q=>q.id==='A1-2017-Q30').subdomain,'法務・知的財産');
vm.runInNewContext(fs.readFileSync('assets/js/priority.js','utf8'),{window:w});
const P=w.SAPriority;P.configure(classified);
const sample=classified.find(q=>q.id==='A1-2024-Q01');
assert.ok(Number.isFinite(P.findFreq(sample)));
const older=classified.find(q=>q.id==='A1-2015-Q01');
assert.ok(P.findFreq(older)>0,'Legacy question uses the same normalized class frequency as the recent 6-year sample');
assert.equal(P.findFreq({...older,subdomain:'unknown'}),0,'Unknown topics must not fall back to a broad category frequency');
const agg=()=>({tries:1,correct:0,flagged:false});
const groups=P.groupRows(classified,agg,{questions:{}});
assert.ok(groups.length>20);
assert.ok(groups.every(g=>g.freq>=0&&g.priority>=0));
assert.ok(!groups.some(g=>g.subdomain==='未分類（画像問題）'));
console.log('PASS: 550 IDs preserved, taxonomy 10/31, classified 400+60+90 with provenance, 0 unknown; priority fallback removed');
