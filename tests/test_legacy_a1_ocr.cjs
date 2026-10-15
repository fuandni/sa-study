const assert=require('node:assert/strict');
const fs=require('node:fs');
const crypto=require('node:crypto');
const qs=JSON.parse(fs.readFileSync('a1/data/a1_questions.json','utf8'));
const seen=new Set();
let totalPages=0;
for(const year of [2015,2016,2017]){
  const items=qs.filter(q=>q.year===year);
  assert.equal(items.length,30);
  const text=fs.readFileSync('source_ocr/'+year+'_a1_unreviewed.txt','utf8');
  assert.match(text,/# OCR DRAFT ONLY.*NOT VERIFIED/);
  assert.match(text,/# Human verification/);
  const source='sources/'+items[0].source_file;
  const hash=crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex');
  assert.ok(text.includes('# source_sha256='+hash),year+' source PDF must match its OCR draft');
  const pages=[...text.matchAll(/===== PDF PAGE (\d+) \| ([^\n]+?) \| (ocr_unreviewed|embedded) =====/g)];
  assert.equal(pages.length,new Set(items.map(q=>q.source_page)).size);
  totalPages+=pages.length;
  for(const [,p,ids,mode] of pages){
    assert.ok(mode==='ocr_unreviewed'||mode==='embedded');
    for(const id of ids.split(',')){
      assert.ok(!seen.has(id),'duplicate OCR mapping: '+id);
      const q=items.find(x=>x.id===id);
      assert.ok(q,'unexpected OCR ID '+id);
      assert.equal(q.source_page,+p,'PDF page mapping changed '+id);
      seen.add(id);
    }
  }
}
assert.equal(totalPages,39,'Only 39 original source PDF pages required');
assert.equal(seen.size,90,'Every original AM1 image question has page-level OCR draft');
console.log('PASS: all 90 AM1 IDs mapped to 39 OCR draft pages with PDF SHA-256; text remains unverified');
