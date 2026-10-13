const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');

const dom=new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>',{
 url:'https://example.test/sa/',runScripts:'outside-only'
});
const w=dom.window, doc=w.document;
const mk=(year,section,no)=>{
 const id=(section==='午前I'?'A1-'+year+'-Q':'SA-'+year+'-AM2-Q')+String(no).padStart(2,'0');
 return {id,year,section,question_no:no,question_text:'テスト問題'+no,
   choices:{'ア':'正解','イ':'誤答','ウ':'候補','エ':'候補'},answer:'ア',
   topic:'テスト',category:'設計・実装',subdomain:'単体試験',source_page:3,asset_path:null,asset_type:null};
};
w.SA_APP_CONFIG={title:'SAテスト',exam:'システムアーキテクト',
 a1:{choice_keys:['ア','イ','ウ','エ'],asset_base:'a1/',source_base:'sources/',max_attempts_per_question:50},
 am2:{choice_keys:['ア','イ','ウ','エ'],asset_base:'am2/',source_base:'sources/',max_attempts_per_question:50},
 common:{max_attempts_per_question:50,recent_sessions_limit:20,weak_threshold_percent:60},
 links:{morning_distribution:'#',pm_reference:'#',source_index:'#'}};
w.SA_A1_QUESTIONS=Array.from({length:30},(_,i)=>mk(2015,'午前I',i+1));
w.SA_AM2_QUESTIONS=Array.from({length:25},(_,i)=>mk(2015,'午前II',i+1));
w.SAValidator={run:()=>({ok:true,errors:[],question_count:55,a1_count:30,am2_count:25})};
for(const src of ['assets/js/storage.js','assets/js/session_results.js','assets/js/app.js']){
 w.eval(fs.readFileSync(src,'utf8')+'\n//# sourceURL='+src);
}
const click=(q)=>{const el=doc.querySelector(q);assert.ok(el,'missing '+q);el.click()};
const session=()=>w.SAStorage.loadSession();
const wrong=()=>click('[data-choice="イ"]');
const right=()=>click('[data-choice="ア"]');
const flagged=()=>click('#flag');
const label=()=>doc.querySelector('#feedback').textContent;
const keys=['ア','イ','ウ','エ'];
const plain=x=>JSON.parse(JSON.stringify(x));
function startAM2(){
 w.SAApp.setup();
 const sections=[...doc.querySelectorAll('input[name="section"]')];
 sections.find(x=>x.value==='午前I').checked=false;
 assert.equal(doc.querySelector('#count').value,'all','all should be default');
 click('#go');
 assert.equal(session().questionIds.length,25);
}
startAM2();
assert.equal(doc.querySelector('.sessionprogress').textContent.includes('0 / 25'),true);
wrong();
assert.equal(doc.querySelector('[data-choice="イ"]').classList.contains('wrong'),true);
assert.equal(doc.querySelector('[data-choice="ア"]').classList.contains('correct'),true);
assert.match(label(),/不正解/);
assert.equal(session().answeredCount,1);
// flag must not clear the response or make the answer count change
flagged();
assert.equal(session().answeredCount,1);
assert.equal(doc.querySelector('[data-choice="イ"]').classList.contains('wrong'),true);
click('#next');
click('#prev');
assert.equal(doc.querySelector('[data-choice="イ"]').classList.contains('wrong'),true);
assert.equal(doc.querySelector('[data-choice="イ"]').getAttribute('aria-pressed'),'true');
// choose again, same question now counts as one answered
right();
assert.equal(session().answeredCount,1);
assert.equal(session().correctCount,1);
assert.equal(doc.querySelector('[data-choice="イ"]').classList.contains('wrong'),false);
assert.equal(doc.querySelector('[data-choice="ア"]').classList.contains('correct'),true);
assert.equal(doc.querySelector('[data-choice="ア"]').getAttribute('aria-pressed'),'true');
w.SAApp.home();
click('#resume');
assert.equal(doc.querySelector('[data-choice="ア"]').classList.contains('correct'),true);
assert.equal(session().answeredCount,1);
assert.equal(w.SAStorage.aggregate(w.SAStorage.load(),session().questionIds[0]).tries,0,
 'global history must commit only after session ends');
for(let i=1;i<25;i++){
 click('#next');
 wrong();
 right();
 assert.equal(session().answeredCount,i+1);
}
assert.equal(session().correctCount,25);
click('#next');
const recent=w.SAStorage.loadRecent();
assert.equal(recent[0].total,25);
assert.equal(recent[0].answered,25);
assert.equal(recent[0].correct,25);
assert.deepEqual(plain(recent[0].breakdown.map(r=>[r.year,r.section,r.total,r.answered,r.correct])),[[2015,'午前II',25,25,25]]);
assert.match(doc.querySelector('.resultbig').textContent,/25\s*\/\s*25/);
assert.ok(doc.querySelector('.table-scroll').textContent.includes('午前II'));
assert.equal(w.SAStorage.loadSession(),null);
const saved=w.SAStorage.load();
const relevant=w.SA_AM2_QUESTIONS.map(q=>w.SAStorage.aggregate(saved,q.id));
assert.ok(relevant.every(x=>x.tries===1&&x.correct===1),'no duplicate attempts');
assert.equal(relevant.reduce((s,x)=>s+x.tries,0),25);
w.SAApp.stats();
assert.match(doc.querySelector('main').textContent,/年度 × 午前I・午前II/);
const rows=w.SAExam.latestByYear([...w.SA_A1_QUESTIONS,...w.SA_AM2_QUESTIONS],saved);
assert.deepEqual(plain(rows.map(x=>[x.section,x.total,x.answered,x.correct])),[
 ['午前I',30,0,0],['午前II',25,25,25]
]);
// Completing a 30-question session does not alter previous 25-question results.
w.SAApp.setup();
doc.querySelectorAll('input[name="section"]').forEach(x=>x.checked=x.value==='午前I');
click('#go');
assert.equal(session().questionIds.length,30);
right();click('#end');
const latest=w.SAStorage.loadRecent()[0];
assert.equal(latest.total,30);
assert.equal(latest.answered,1);
assert.equal(latest.correct,1);
assert.equal(w.SAStorage.loadRecent()[1].correct,25);
const latestMatrix=w.SAExam.latestByYear([...w.SA_A1_QUESTIONS,...w.SA_AM2_QUESTIONS],w.SAStorage.load());
assert.equal(latestMatrix.find(x=>x.section==='午前I').answered,1);
assert.equal(latestMatrix.find(x=>x.section==='午前II').correct,25);
// Idempotent commit: writing the same session a second time cannot add a duplicate.
const one=w.SAStorage.loadRecent()[0],qid=w.SA_A1_QUESTIONS[0].id;
const testSession={id:one.id,answers:{[qid]:{choice:'ア',correct:true,elapsed_ms:100,answered_at:new Date().toISOString()}}};
const n0=w.SAStorage.aggregate(w.SAStorage.load(),qid).tries;
w.SAStorage.commitSession(w.SAStorage.load(),testSession);
const n1=w.SAStorage.aggregate(w.SAStorage.load(),qid).tries;
assert.equal(n1,n0);
console.log('PASS: navigation, flag, revising answers, resume, per-question scoring, 25/25, 30 question denominator, history, yearly matrix');
