const assert=require('node:assert/strict'),fs=require('node:fs');
const {JSDOM}=require('jsdom');
const dom=new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>',{
 url:'https://example.test/sa/',runScripts:'outside-only'
});
const w=dom.window,doc=w.document;
const mk=(year,section,i)=>({
 id:(section==='午前I'?'A1-'+year+'-Q':'SA-'+year+'-AM2-Q')+String(i).padStart(2,'0'),
 year,section,question_no:i,question_text:'問'+i,answer:'ア',
 choices:{ア:'A',イ:'B',ウ:'C',エ:'D'},category:'テスト',subdomain:'テスト'
});
const years=[2019,2021,2022,2023];
w.SA_A1_QUESTIONS=years.flatMap(y=>Array.from({length:30},(_,i)=>mk(y,'午前I',i+1)));
w.SA_AM2_QUESTIONS=years.flatMap(y=>Array.from({length:25},(_,i)=>mk(y,'午前II',i+1)));
w.SA_APP_CONFIG={title:'SA',exam:'SA',a1:{choice_keys:['ア','イ','ウ','エ'],asset_base:'a1/',source_base:'sources/'},
 am2:{choice_keys:['ア','イ','ウ','エ'],asset_base:'am2/',source_base:'sources/',max_attempts_per_question:50,recent_sessions_limit:100},
 common:{max_attempts_per_question:50,recent_sessions_limit:100,weak_threshold_percent:60},
 links:{morning_distribution:'#',pm_reference:'#',source_index:'#'}};
w.SAValidator={run:()=>({ok:true,errors:[],question_count:220,a1_count:120,am2_count:100})};
for(const p of ['assets/js/storage.js','assets/js/session_results.js','assets/js/review.js','assets/js/year_analysis.js','assets/js/sync.js','assets/js/app.js'])w.eval(fs.readFileSync(p,'utf8'));
const S=w.SAStorage,click=sel=>{const x=doc.querySelector(sel);assert.ok(x,'missing '+sel);x.click()};
const date=n=>new Date(Date.UTC(2026,9,12,12,0,n)).toISOString();
function fullYear(id,year,correct,n){
 return {id,label:'午前II・'+year+'・全問',total:25,answered:25,correct,ended_at:date(n),
  breakdown:[{year,section:'午前II',total:25,answered:25,correct}]};
}
const combined={id:'combined',label:'午前II・2019/2021・全問',total:50,answered:50,correct:36,
 ended_at:date(10),breakdown:[
 {year:2019,section:'午前II',total:25,answered:25,correct:19},
 {year:2021,section:'午前II',total:25,answered:25,correct:17}]};
S.addRecent(combined);
S.addRecent(fullYear('rerun',2019,20,30));
S.addRecent({id:'partial',label:'2021・途中',total:25,answered:3,correct:2,ended_at:date(40),
 breakdown:[{year:2021,section:'午前II',total:25,answered:3,correct:2}]});
S.addRecent({id:'bad66',label:'午前II・2022/2023・旧形式',total:50,answered:66,correct:45,ended_at:date(50),
 breakdown:[{year:2022,section:'午前II',total:25,answered:33,correct:23},{year:2023,section:'午前II',total:25,answered:33,correct:22}]});
const p=S.load(),q=w.SA_AM2_QUESTIONS.find(x=>x.year===2019);
S.toggleFlag(p,q.id);
const matrix=()=>w.SAYearAnalysis.build([...w.SA_A1_QUESTIONS,...w.SA_AM2_QUESTIONS],S.loadRecent(),S.load());
let rows=matrix();
const year=(y,s='午前II')=>w.SAYearAnalysis.yearRow(rows,y,s);
assert.equal(year(2019).latestFull.correct,20,'last completed exam wins');
assert.equal(year(2019).history.length,2);
assert.equal(year(2019).flagged,1);
assert.equal(year(2021).latestFull.correct,17);
assert.equal(year(2021).latestPartial.answered,3,'partial must not overwrite full score');
assert.equal(year(2022).latestFull,null,'66/50 is excluded');
assert.equal(year(2022).invalidCount,1);
assert.equal(year(2023).invalidCount,1);
assert.equal(year(2019,'午前I').latestFull,null);
w.SAApp.setup();
click('[data-year-pair="2019,2021"]');
assert.match(doc.querySelector('#selection-preview').textContent,/2019 \/ 2021年度/);
assert.match(doc.querySelector('#selection-preview').textContent,/110問/);
assert.deepEqual([...doc.querySelectorAll('input[name=year]:checked')].map(x=>Number(x.value)),[2019,2021]);
click('#all-years');
assert.equal(doc.querySelectorAll('input[name=year]:checked').length,4);
w.SAApp.stats();
assert.match(doc.querySelector('main').textContent,/全年度の成績比較/);
assert.equal(doc.querySelectorAll('.year-matrix tbody tr').length,4);
assert.match(doc.querySelector('.year-matrix').textContent,/20 \/ 25/);
assert.match(doc.querySelector('.year-matrix').textContent,/旧集計に不整合/);
click('[data-year-detail="2019|午前II"]');
assert.match(doc.querySelector('.year-detail-title').textContent,/2019年度・午前II/);
assert.equal(doc.querySelectorAll('[data-year-session]').length,2);
assert.match(doc.querySelector('main').textContent,/20 \/ 25/);
click('#year-flag-practice');
let active=S.loadSession();
assert.equal(active.questionIds.length,1);
assert.equal(active.questionIds[0],q.id);
click('#end');
w.SAApp.stats();
click('[data-year-detail="2022|午前II"]');
assert.match(doc.querySelector('.invalid-panel').textContent,/旧集計/);
assert.equal(doc.querySelectorAll('[data-year-session]').length,0);
click('#back-stats');
click('[data-year-detail="2021|午前II"]');
assert.equal(doc.querySelectorAll('[data-year-session]').length,2);
assert.match(doc.querySelector('main').textContent,/部分演習/);
click('#back-stats');
click('[data-year-detail="2019|午前I"]');
click('#year-all-practice');
active=S.loadSession();
assert.equal(active.questionIds.length,30);
assert.ok(active.questionIds.every(id=>id.startsWith('A1-2019-')));
click('#end');
// Archiving beyond prior 20-session cap preserves detail and remains bounded to 100.
for(let n=0;n<60;n++){
 S.addRecent({id:'extra_'+n,label:'sample',total:25,answered:0,correct:0,ended_at:date(n+61),breakdown:[]});
}
assert.ok(S.loadRecent().length>=60,'history longer than 20 retained');
assert.equal(w.SASync.mergeRecent(S.loadRecent(),[]).length,S.loadRecent().length);
console.log('PASS: year score matrix, most recent complete, separate partial, corrupt 66/50 exclusion, flag repractice, year drilldown, 60+ saved sessions');
