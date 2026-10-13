const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const d=new JSDOM('<!doctype html><div id="app"></div>',{url:'https://example.test/sa/',runScripts:'outside-only'});
const w=d.window,doc=w.document;
function q(year,section,no){
 const id=(section==='午前I'?'A1-':'SA-')+year+(section==='午前I'?'-Q':'-AM2-Q')+String(no).padStart(2,'0');
 return {id,year,section,question_no:no,question_text:'問題'+no,
  choices:{ア:'A',イ:'B',ウ:'C',エ:'D'},answer:'ア',category:'テスト',subdomain:'分類'};
}
const years=[2015,2016,2017];
w.SA_A1_QUESTIONS=years.flatMap(y=>Array.from({length:30},(_,i)=>q(y,'午前I',i+1)));
w.SA_AM2_QUESTIONS=years.flatMap(y=>Array.from({length:25},(_,i)=>q(y,'午前II',i+1)));
w.SA_APP_CONFIG={title:'テスト',exam:'SA',
 a1:{choice_keys:['ア','イ','ウ','エ'],asset_base:'a1/',source_base:'sources/',max_attempts_per_question:50},
 am2:{choice_keys:['ア','イ','ウ','エ'],asset_base:'am2/',source_base:'sources/',max_attempts_per_question:50},
 common:{max_attempts_per_question:50,recent_sessions_limit:20,weak_threshold_percent:60},
 links:{morning_distribution:'#',pm_reference:'#',source_index:'#'}};
w.SAValidator={run:()=>({ok:true,question_count:165,a1_count:90,am2_count:75,errors:[]})};
for(const p of ['assets/js/storage.js','assets/js/session_results.js','assets/js/review.js','assets/js/app.js'])w.eval(fs.readFileSync(p,'utf8'));
const click=sel=>{const x=doc.querySelector(sel);assert.ok(x,'missing '+sel);x.click();};
const current=()=>w.SAStorage.loadSession();
function start(sections){
 w.SAApp.setup();
 doc.querySelectorAll('[name="section"]').forEach(x=>x.checked=sections.includes(x.value));
 doc.querySelectorAll('[name="year"]').forEach(x=>x.checked=[2015,2016].includes(Number(x.value)));
 assert.equal(doc.querySelector('#count').value,'all');
 assert.equal(doc.querySelector('#order').value,'fixed');
 click('#go');
}
start(['午前II']);
assert.equal(current().questionIds.length,50);
const firstId=current().questionIds[0];
click('[data-choice="イ"]');click('#flag');
for(let i=0;i<25;i++)click('#next');
assert.match(doc.querySelector('.qmeta').textContent,/2016年度/);
click('[data-choice="ア"]');
assert.equal(current().answeredCount,2);
click('#end');
const r=w.SAStorage.loadRecent()[0];
assert.equal(r.total,50);
assert.equal(r.answered,2);
assert.equal(r.correct,1);
assert.equal(r.breakdown.length,2);
assert.deepEqual(JSON.parse(JSON.stringify(r.breakdown.map(x=>[x.year,x.total,x.answered,x.correct]))),[[2015,25,1,0],[2016,25,1,1]]);
assert.equal(r.questionIds.length,50);
assert.equal(Object.keys(r.answers).length,2);
assert.equal(doc.querySelectorAll('.review-tile').length,1,'default wrong only');
assert.match(doc.querySelector('#result-review-list').textContent,/2015年度/);
click('[data-result-filter="all"]');
assert.equal(doc.querySelectorAll('.review-tile').length,50);
assert.equal(doc.querySelectorAll('.review-group').length,2);
click('[data-result-filter="flagged"]');
assert.equal(doc.querySelectorAll('.review-tile').length,1);
click('[data-review-id]');
assert.match(doc.querySelector('main').textContent,/2015年度/);
assert.match(doc.querySelector('.feedback').textContent,/あなた|最終回答：イ/);
w.dispatchEvent(new w.Event('sa-sync-completed'));
assert.ok(doc.querySelector('#back-results'),'sync should keep review question');
click('#back-results');
assert.ok(doc.querySelector('.result-panel'));
w.SAApp.home();
click('[data-past-result]');
assert.ok(doc.querySelector('.result-panel'));
assert.equal(doc.querySelector('#result-review-list').querySelectorAll('.review-tile').length,1);
// 30 * 2 years: 60 question denominator.
start(['午前I']);
assert.equal(current().questionIds.length,60);
click('[data-choice="ア"]');click('#end');
let r2=w.SAStorage.loadRecent()[0];
assert.equal(r2.total,60);
assert.equal(r2.answered,1);
assert.equal(r2.breakdown.length,2);
assert.equal(r2.breakdown[0].total,30);
assert.equal(r2.breakdown[1].total,30);
// Morning I and II together across two years: 110 questions / 4 groups.
start(['午前I','午前II']);
assert.equal(current().questionIds.length,110);
click('#end');
let r3=w.SAStorage.loadRecent()[0];
assert.equal(r3.total,110);
assert.equal(r3.breakdown.length,4);
assert.deepEqual(JSON.parse(JSON.stringify(r3.breakdown.map(x=>x.total))),[30,25,30,25]);
click('[data-result-filter="all"]');
assert.equal(doc.querySelectorAll('.review-tile').length,110);
assert.equal(doc.querySelectorAll('.review-group').length,4);
assert.ok(doc.querySelectorAll('.review-group[open]').length>0);
assert.ok(w.SAStorage.loadRecent().length>=3);
console.log('PASS: multi-year 50/60/110, per-year/section score groups, review filters/drilldown, flag preservation, cloud sync stays in place');
