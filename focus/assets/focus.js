(function(){
'use strict';
const D=window.SAFocusData,KEY='sa_focus_progress_v1',SESSION='sa_focus_session_v1';
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const root=$('#focus-app'),domain=document.body.dataset.domain||'',basic=D.questions,applied=window.SAFocusAppliedQuestions||[],all=[...basic,...applied];
let progress,session;
try{progress=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){progress={}}
if(!progress||typeof progress!=='object')progress={};
try{session=JSON.parse(localStorage.getItem(SESSION)||'null')}catch(e){session=null}
if(!session||!Array.isArray(session.ids)||!session.ids.every(id=>all.some(q=>q.id===id)))session=null;
const save=()=>localStorage.setItem(KEY,JSON.stringify(progress));
const saveSession=()=>session?localStorage.setItem(SESSION,JSON.stringify(session)):localStorage.removeItem(SESSION);
function title(){return domain?D.meta[domain][0]:'弱点集中演習'}
function stats(list){let done=0,wrong=0,changes=0;const concepts=new Map();for(const q of list){const rec=progress[q.id]||[];if(rec.length){done++;if(rec[rec.length-1].correct===false)wrong++;if(rec.some((v,i)=>i>0&&v.correct!==rec[i-1].correct))changes++}let k=q.concept;if(!concepts.has(k))concepts.set(k,[]);concepts.get(k).push(...rec)}return {done,wrong,changes,concepts}}
function header(){return '<header><a href="../index.html">既存550問へ戻る</a><a href="index.html">弱点克服ホーム</a>'+Object.entries(D.meta).map(([k,v])=>'<a class="'+(domain===k?'active':'')+'" href="'+k+'.html">'+esc(v[0])+'</a>').join('')+'</header>'}
function home(){
let body='<section class="hero"><h1>弱点集中演習</h1><p>6分野・'+all.length+'問。応用判断'+applied.length+'問を推奨し、基本識別290問は補助教材として残します。公式試験の過去問ではなく新作練習問題です。</p></section>';
body+='<section class="grid">'+Object.entries(D.meta).map(([k,v])=>{const set=all.filter(q=>q.domain===k),st=stats(set);return '<a class="tile" href="'+k+'.html"><h2>'+esc(v[0])+'</h2><b>'+set.length+'問</b><span>応用'+set.filter(q=>q.level==='standard').length+'問・基本'+v[1]+'問／回答済み '+st.done+'</span></a>'}).join('')+'</section>';
return body;
}
function listFor(kind,concept,level='standard'){
let list=all.filter(q=>(!domain||q.domain===domain)&&(level==='all'||(level==='standard'?q.level==='standard':q.level!=='standard')));
if(concept)list=list.filter(q=>q.concept===concept);
if(kind==='unseen')list=list.filter(q=>!(progress[q.id]||[]).length);
if(kind==='wrong')list=list.filter(q=>(progress[q.id]||[]).some(a=>!a.correct));
if(kind==='unstable')list=list.filter(q=>{let r=progress[q.id]||[];return r.filter(a=>!a.correct).length>=2||r.some((a,i)=>i>0&&a.correct!==r[i-1].correct)});
return list;
}
function dashboard(){
const pool=all.filter(q=>q.domain===domain),st=stats(pool),basicCount=pool.filter(q=>q.level!=='standard').length,appliedCount=pool.length-basicCount;
let main='<section class="hero"><h1>'+esc(title())+'</h1><p>応用判断'+appliedCount+'問／基本識別'+basicCount+'問。応用問題は数値計算・条件比較・誤った推論の検出などを中心に作り、基本問題は用語の確認用に残しました。</p><p>回答済み '+st.done+' / '+pool.length+'問｜直近不正解 '+st.wrong+'問｜正誤変化を経験 '+st.changes+'問</p></section>';
main+='<section class="panel"><h2>出題条件</h2><label>難度 <select id="level"><option value="standard">応用判断（推奨）</option><option value="basic">基本識別</option><option value="all">全問題</option></select></label><label>対象 <select id="kind"><option value="all">全問</option><option value="unseen">未回答</option><option value="wrong">誤答経験</option><option value="unstable">不安定（2回以上誤答・正誤反転）</option></select></label><label>概念 <select id="concept"><option value="">全概念</option>'+D.concepts[domain].map(x=>'<option value="'+esc(x[0])+'">'+esc(x[0])+'</option>').join('')+'</select></label><label>問題数 <select id="size"><option value="10">10問</option><option value="20">20問</option><option value="all">該当全問</option></select></label><label>出題順 <select id="order"><option value="mixed">混合テスト</option><option value="focus">概念集中</option></select></label><p id="preview"></p><button class="primary" id="begin">演習開始</button></section>';
main+='<section class="panel"><h2>概念別の記録</h2><div class="concepts">'+D.concepts[domain].map(x=>{const qs=pool.filter(q=>q.concept===x[0]);let s=stats(qs);return '<button data-concept="'+esc(x[0])+'"><b>'+esc(x[0])+'</b><small>回答済み '+s.done+'/'+qs.length+'・直近不正解 '+s.wrong+'</small></button>'}).join('')+'</div></section>';
root.innerHTML=header()+main;
const update=()=>{const list=listFor($('#kind').value,$('#concept').value,$('#level').value);const n=$('#size').value==='all'?list.length:Math.min(list.length,Number($('#size').value));$('#preview').textContent='今回の出題：'+n+'問（候補'+list.length+'問）';$('#begin').disabled=n===0};
for(const el of document.querySelectorAll('select'))el.addEventListener('change',update);update();
$('#begin').onclick=()=>start($('#kind').value,$('#concept').value,$('#size').value,$('#order').value,$('#level').value);
document.querySelectorAll('[data-concept]').forEach(btn=>btn.onclick=()=>{ $('#concept').value=btn.dataset.concept;$('#order').value='focus';if($('#level').value==='standard'&&!listFor('all',btn.dataset.concept,'standard').length)$('#level').value='all';update();window.scrollTo(0,0)});
}
function start(kind,concept,size,order,level='standard'){
let list=listFor(kind,concept,level),ordered=[...list];
if(order==='mixed'){ordered=D.randomize(ordered,Date.now())}else{ordered.sort((a,b)=>a.concept.localeCompare(b.concept,'ja')||a.variant.localeCompare(b.variant))}
if(size!=='all')ordered=ordered.slice(0,Number(size));
if(!ordered.length)return;
if(session&&!confirm('途中の演習を破棄して開始しますか？'))return;
session={domain,ids:ordered.map(q=>q.id),index:0,answers:{},started:new Date().toISOString(),seed:Date.now()};saveSession();renderQuestion();
}
function renderQuestion(){
const q=all.find(q=>q.id===session.ids[session.index]);if(!q){finish();return}
const existing=session.answers[q.id],options=D.randomize([...q.choices],hash(q.id+session.seed));
root.innerHTML=header()+'<section class="panel"><p class="muted">'+esc(title())+'　'+(session.index+1)+' / '+session.ids.length+'問　｜　'+esc(q.concept)+'</p><h2 class="stem">'+esc(q.stem).replace(/\n/g,'<br>')+'</h2><div class="answers">'+options.map((a,i)=>'<button data-answer="'+i+'" class="'+(existing&&existing.selected===a?'chosen':'')+'"><kbd>'+('ABCD'[i])+'</kbd>'+esc(a)+'</button>').join('')+'</div><div id="explain"></div><div class="controls"><button id="prev" '+(session.index===0?'disabled':'')+'>前へ</button><button id="next">'+(session.index===session.ids.length-1?'結果を見る':'次へ')+'</button><button id="stop">途中保存して戻る</button></div></section>';
document.querySelectorAll('[data-answer]').forEach(btn=>btn.onclick=()=>{const selected=options[Number(btn.dataset.answer)];session.answers[q.id]={selected,correct:selected===q.answer};saveSession();showFeedback(q,selected)});
if(existing)showFeedback(q,existing.selected);
$('#prev').onclick=()=>{if(session.index>0){session.index--;saveSession();renderQuestion()}};
$('#next').onclick=()=>{if(session.index===session.ids.length-1)finish();else{session.index++;saveSession();renderQuestion()}};
$('#stop').onclick=()=>{saveSession();renderHome()};
}
function hash(x){let h=2166136261;for(const c of x){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0}
function showFeedback(q,chosen){
document.querySelectorAll('[data-answer]').forEach(btn=>{const actual=btn.textContent.slice(1);btn.classList.toggle('chosen',actual===chosen);btn.classList.toggle('correct',actual===q.answer);btn.classList.toggle('wrong',actual===chosen&&chosen!==q.answer)});
$('#explain').innerHTML='<div class="feedback"><b>'+(chosen===q.answer?'正解':'不正解')+'</b><p>正解：'+esc(q.answer)+'</p><p>'+esc(q.explanation)+'</p></div>';
}
function finish(){
const done=session;let count=0;for(const id of done.ids){const a=done.answers[id];if(a){const p=progress[id]||[];p.push({correct:!!a.correct,ts:new Date().toISOString()});progress[id]=p.slice(-30);count+=a.correct?1:0}}save();session=null;saveSession();
root.innerHTML=header()+'<section class="hero"><h1>演習結果</h1><p>正解 '+count+' / '+done.ids.length+'問　回答済み '+Object.keys(done.answers).length+'問</p><button class="primary" id="return">この分野に戻る</button></section><section class="panel"><h2>今回の問題</h2><div class="result">'+done.ids.map(id=>{const q=all.find(x=>x.id===id);const answer=done.answers[id];return '<p><strong>'+esc(q.concept)+'</strong>　'+(answer?(answer.correct?'○':'×'):'未回答')+'　'+esc(q.stem.split('\n')[0])+'</p>'}).join('')+'</div></section>';
$('#return').onclick=renderHome;
}
function renderHome(){
if(session&&session.domain===domain){root.innerHTML=header()+'<section class="hero"><h1>途中の演習</h1><p>'+(session.index+1)+' / '+session.ids.length+'問</p><button class="primary" id="resume">続きから再開</button> <button id="discard">破棄して分野へ戻る</button></section>';$('#resume').onclick=renderQuestion;$('#discard').onclick=()=>{session=null;saveSession();renderHome()};return}
if(!domain){root.innerHTML=header()+home();return}dashboard();
}
window.SAFocusApp={renderHome,start,listFor,hash};
renderHome();
})();