(function(){
const C=window.SA_APP_CONFIG,Q=[...(window.SA_A1_QUESTIONS||[]),...(window.SA_AM2_QUESTIONS||[])],S=window.SAStorage;
let progress=S.load(), session=null, questionStart=0, answered=false;
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const threshold=()=>C.common?.weak_threshold_percent??C.am2?.weak_threshold_percent??60;
const sectionCfg=q=>q.section==='午前I'?(C.a1||C.am2):C.am2;
const choicesFor=q=>sectionCfg(q)?.choice_keys||['ア','イ','ウ','エ'];
const cats=(sections=[])=>{let d=[...new Set(Q.filter(q=>!sections.length||sections.includes(q.section)).map(q=>q.category).filter(Boolean))];let o=C.category_order||[];return [...o.filter(x=>d.includes(x)),...d.filter(x=>!o.includes(x)).sort()]};
const subs=(cat='',sections=[])=>[...new Set(Q.filter(q=>(!sections.length||sections.includes(q.section))&&(!cat||q.category===cat)).map(q=>q.subdomain).filter(Boolean))].sort();
function agg(id){return S.aggregate(progress,id)}
function allStats(list=Q){let a=list.map(q=>agg(q.id));let exp=a.filter(x=>x.tries>0).length, tries=a.reduce((n,x)=>n+x.tries,0), cor=a.reduce((n,x)=>n+x.correct,0);return {exp,tries,cor,rate:tries?cor/tries:null}}
function fmtPct(v){return v==null?'—':Math.round(v*100)+'%'}
function nav(active){return `<header><div><h1>${esc(C.title)}</h1><div class="sub">${esc(C.exam)} / データとUIを分離した拡張版</div></div><nav>
<button class="${active==='home'?'on':''}" data-nav="home">ホーム</button><button class="${active==='practice'?'on':''}" data-nav="setup">演習</button><button class="${active==='stats'?'on':''}" data-nav="stats">成績</button>
<a href="${C.links.morning_distribution||'morning_distribution.html'}">午前配分</a><a href="morning_status.html">整備状況</a><a href="${C.links.pm_reference}">午後I・II</a><a href="${C.links.source_index}">原資料</a><a href="sync_settings.html">同期</a></nav></header>`}
function bindNav(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>({home,setup,stats}[b.dataset.nav]||home)())}
function home(){
 const st=allStats(), recent=S.loadRecent(), active=S.loadSession();
 app.innerHTML=nav('home')+`<main>
 <section class="cards"><div class="metric"><b>${Q.length}</b><span>演習収録（午前I ${Q.filter(q=>q.section==='午前I').length} / 午前II ${Q.filter(q=>q.section==='午前II').length}）</span></div><div class="metric"><b>${st.exp}</b><span>回答経験</span></div><div class="metric"><b>${st.cor}</b><span>累積正解</span></div><div class="metric"><b>${fmtPct(st.rate)}</b><span>累積正答率</span></div></section>
 ${active&&active.questionIds?.length?`<section class="panel"><h2>途中の演習</h2><p>${esc(active.label||'演習')}　${Math.min(active.index+1,active.questionIds.length)} / ${active.questionIds.length}</p><button class="primary" id="resume">続きから再開</button><button id="discard">このセッションを終了</button></section>`:''}
 <section class="panel"><h2>すぐ始める</h2><div class="quick"><button class="primary" data-quick="random10">全範囲から10問</button><button data-quick="a1_30">午前I ランダム30問</button><button data-quick="am2_25">午前II ランダム25問</button><button data-quick="wrong">誤答経験あり</button><button data-quick="unanswered">未回答</button><button data-quick="weak">正答率${threshold()}%以下</button><button data-quick="flagged">要復習フラグ</button></div></section>
 <section class="panel"><h2>分野から解く</h2><div class="chips">${cats().map(c=>`<button data-cat="${esc(c)}">${esc(c)} <small>${Q.filter(q=>q.category===c).length}問</small></button>`).join('')}</div></section>
 <section class="panel"><h2>最近の演習</h2>${recent.length?`<table><thead><tr><th>日時</th><th>範囲</th><th>回答</th><th>正解</th></tr></thead><tbody>${recent.slice(0,8).map(r=>`<tr><td>${new Date(r.ended_at).toLocaleString()}</td><td>${esc(r.label)}</td><td>${r.answered}/${r.total}</td><td>${r.correct}</td></tr>`).join('')}</tbody></table>`:'<p class="muted">まだ演習履歴はありません。</p>'}</section>
 <section class="panel slim"><div id="health"></div><a href="docs/EXTENDING.md">拡張方法</a> · <a href="docs/DATA_MODEL.md">データモデル</a></section>
 </main>`;
 bindNav();
 if($('#resume'))$('#resume').onclick=()=>resumeSession();
 if($('#discard'))$('#discard').onclick=()=>{S.clearSession();home()};
 document.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>quick(b.dataset.quick));
 document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>start({categories:[b.dataset.cat],count:'all',mode:'all',order:'random',label:b.dataset.cat}));
 const v=window.SAValidator.run();$('#health').innerHTML=v.ok?`<span class="good">構造検証 OK：${v.question_count}問（午前I ${v.a1_count||0} / 午前II ${v.am2_count||0}）</span>`:`<span class="bad">構造エラー ${v.errors.length}件</span>`;
}
function setup(pref={}){
 const years=[...new Set(Q.map(q=>q.year))].sort();
 app.innerHTML=nav('practice')+`<main><section class="panel"><h2>演習条件</h2>
 <div class="formrow"><label>科目</label><div class="checks"><label><input type="checkbox" name="section" value="午前I" checked> 午前I</label><label><input type="checkbox" name="section" value="午前II" checked> 午前II</label></div></div>
 <div class="formrow"><label>年度</label><div class="checks">${years.map(y=>`<label><input type="checkbox" name="year" value="${y}" checked> ${y}</label>`).join('')}</div></div>
 <div class="formrow"><label>カテゴリ</label><select id="category"><option value="">全カテゴリ</option>${cats().map(c=>`<option>${esc(c)}</option>`).join('')}</select></div>
 <div class="formrow"><label>細分類</label><select id="subdomain"><option value="">全細分類</option>${subs().map(c=>`<option>${esc(c)}</option>`).join('')}</select></div>
 <div class="formrow"><label>対象</label><select id="mode"><option value="all">全問</option><option value="wrong">誤答経験あり</option><option value="unanswered">未回答のみ</option><option value="weak">正答率${threshold()}%以下</option><option value="flagged">要復習フラグ</option></select></div>
 <div class="formrow"><label>問題数</label><select id="count"><option value="10">10問</option><option value="25">25問</option><option value="30">30問</option><option value="all">該当する全問</option></select></div>
 <div class="formrow"><label>順序</label><select id="order"><option value="random">ランダム</option><option value="fixed">年度・問番号順</option></select></div>
 <button class="primary" id="go">演習開始</button></section></main>`;
 bindNav();
 if(pref.category)$('#category').value=pref.category;
 const selectedSections=()=>[...document.querySelectorAll('input[name=section]:checked')].map(x=>x.value);
 const refreshCategories=()=>{const cur=$('#category').value;$('#category').innerHTML='<option value="">全カテゴリ</option>'+cats(selectedSections()).map(c=>`<option>${esc(c)}</option>`).join('');if([...$('#category').options].some(o=>o.value===cur))$('#category').value=cur;refreshSubs()};
 const refreshSubs=()=>{const cur=$('#subdomain').value;$('#subdomain').innerHTML='<option value="">全細分類</option>'+subs($('#category').value,selectedSections()).map(c=>`<option>${esc(c)}</option>`).join('');if([...$('#subdomain').options].some(o=>o.value===cur))$('#subdomain').value=cur};
 $('#category').onchange=refreshSubs;document.querySelectorAll('input[name=section]').forEach(x=>x.onchange=refreshCategories);refreshCategories();
 $('#go').onclick=()=>{let ys=[...document.querySelectorAll('input[name=year]:checked')].map(x=>Number(x.value));start({sections:selectedSections(),years:ys,categories:$('#category').value?[$('#category').value]:[],subdomains:$('#subdomain').value?[$('#subdomain').value]:[],mode:$('#mode').value,count:$('#count').value,order:$('#order').value})};
}
function filter(opts){
 let a=Q.filter(q=>(!opts.sections?.length||opts.sections.includes(q.section))&&(!opts.years?.length||opts.years.includes(q.year))&&(!opts.categories?.length||opts.categories.includes(q.category))&&(!opts.subdomains?.length||opts.subdomains.includes(q.subdomain)));
 if(opts.mode==='wrong')a=a.filter(q=>agg(q.id).wrong>0);
 if(opts.mode==='unanswered')a=a.filter(q=>agg(q.id).tries===0);
 if(opts.mode==='weak')a=a.filter(q=>agg(q.id).tries>0 && agg(q.id).rate<=threshold()/100);
 if(opts.mode==='flagged')a=a.filter(q=>agg(q.id).flagged);
 if(opts.order==='random')a=[...a].sort(()=>Math.random()-.5);else a=[...a].sort((x,y)=>x.year-y.year||x.question_no-y.question_no);
 let n=opts.count==='all'?a.length:Number(opts.count||a.length);return a.slice(0,n);
}
function quick(kind){
 let opts={years:[],categories:[],order:'random',count:'all',mode:'all'};
 if(kind==='random10'){opts.count=10;opts.label='全範囲ランダム10問'}
 if(kind==='a1_30'){opts.sections=['午前I'];opts.count=30;opts.label='午前I ランダム30問'}
 if(kind==='am2_25'){opts.sections=['午前II'];opts.count=25;opts.label='午前II ランダム25問'}
 if(kind==='wrong'){opts.mode='wrong';opts.label='誤答経験あり'}
 if(kind==='unanswered'){opts.mode='unanswered';opts.label='未回答'}
 if(kind==='weak'){opts.mode='weak';opts.label='弱点'}
 if(kind==='flagged'){opts.mode='flagged';opts.label='要復習'}
 start(opts);
}
function start(opts){
 let list=filter(opts); if(!list.length){alert('条件に該当する問題がありません。');return}
 session={schema_version:2,id:'s_'+Date.now(),questionIds:list.map(q=>q.id),index:0,started_at:new Date().toISOString(),answeredCount:0,correctCount:0,label:opts.label||describe(opts),options:opts};S.saveSession(session);practice();
}
function describe(o){let p=[];if(o.sections?.length&&o.sections.length<2)p.push(o.sections.join('/'));if(o.years?.length&&o.years.length<[...new Set(Q.map(q=>q.year))].length)p.push(o.years.join('/'));if(o.categories?.length)p.push(o.categories.join('/'));if(o.subdomains?.length)p.push(o.subdomains.join('/'));if(o.mode&&o.mode!=='all')p.push(o.mode);p.push(o.count==='all'?'全問':o.count+'問');return p.join('・')}
function resumeSession(){session=S.loadSession();if(!session||!session.questionIds?.length){home();return}practice()}
function current(){return Q.find(q=>q.id===session.questionIds[session.index])}
function practice(){
 if(!session)session=S.loadSession();if(!session){setup();return}
 let q=current(); if(!q){finish();return}
 answered=false;questionStart=performance.now();const a=agg(q.id), qc=sectionCfg(q), asset=q.asset_path?qc.asset_base+q.asset_path:null, src=q.source_file?qc.source_base+q.source_file+(q.source_page?'#page='+q.source_page:''):'';
 app.innerHTML=nav('practice')+`<main><section class="sessionbar"><span>${session.index+1} / ${session.questionIds.length}</span><b>${esc(session.label)}</b><button id="end">途中終了</button></section>
 <section class="question"><div class="qmeta">${q.year}年度　${esc(q.section)} 問${q.question_no}　${esc(q.category||'')}${q.subdomain?' / '+esc(q.subdomain):''}　<span>${esc(q.topic||'')}</span></div>
 <div class="qtext">${q.question_text}</div>${asset?`<img class="qasset" src="${asset}" alt="${esc(q.asset_type||'図表')}">`:''}
 <div class="choices">${choicesFor(q).map((k,i)=>`<button data-choice="${k}"><kbd>${i+1}</kbd><b>${k}</b><span>${q.choices[k]}</span></button>`).join('')}</div>
 <div class="qfoot"><button id="flag">${a.flagged?'★ 要復習を解除':'☆ 要復習にする'}</button>${src?`<a target="_blank" href="${src}">原本 p.${q.source_page||''}</a>`:''}<span>履歴 ${a.tries}回 / ${fmtPct(a.rate)}</span></div><div id="feedback"></div></section>
 <section class="pager"><button id="prev" ${session.index===0?'disabled':''}>← 前</button><button id="next">${session.index===session.questionIds.length-1?'終了':'次 →'}</button></section></main>`;
 bindNav(); $('#end').onclick=()=>finish(true);$('#flag').onclick=()=>{S.toggleFlag(progress,q.id);practice()};
 $('#prev').onclick=()=>{if(session.index>0){session.index--;S.saveSession(session);practice()}};
 $('#next').onclick=()=>{if(session.index>=session.questionIds.length-1)finish();else{session.index++;S.saveSession(session);practice()}};
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>answer(b.dataset.choice));
}
function answer(choice){
 if(answered)return;answered=true;let q=current(),ok=choice===q.answer,elapsed=performance.now()-questionStart;
 S.answer(progress,q.id,choice,ok,elapsed);progress=S.load();session.answeredCount=(session.answeredCount||0)+1;if(ok)session.correctCount=(session.correctCount||0)+1;S.saveSession(session);
 document.querySelectorAll('[data-choice]').forEach(b=>{b.disabled=true;if(b.dataset.choice===q.answer)b.classList.add('correct');if(b.dataset.choice===choice&&!ok)b.classList.add('wrong')});
 $('#feedback').innerHTML=`<div class="feedback ${ok?'goodbox':'badbox'}"><b>${ok?'正解':'不正解'}</b>　あなた：${choice} / 正解：${q.answer}<span>回答時間 ${(elapsed/1000).toFixed(1)}秒</span></div>`;
}
function finish(interrupted=false){
 if(!session){home();return}
 let summary={id:session.id,label:session.label,total:session.questionIds.length,answered:session.answeredCount||0,correct:session.correctCount||0,started_at:session.started_at,ended_at:new Date().toISOString(),interrupted:!!interrupted};
 S.addRecent(summary);S.clearSession();session=null;
 app.innerHTML=nav('practice')+`<main><section class="panel center"><h2>${interrupted?'演習を終了':'セッション完了'}</h2><div class="resultbig">${summary.correct} / ${summary.answered}</div><p>回答 ${summary.answered}問 / 出題 ${summary.total}問</p><button class="primary" id="again">条件を選んで続ける</button><button id="homebtn">ホーム</button></section></main>`;
 bindNav();$('#again').onclick=setup;$('#homebtn').onclick=home;
}
function stats(){
 const overall=allStats(), groups=(field)=>[...new Set(Q.map(q=>q[field]))].sort().map(v=>{let z=Q.filter(q=>q[field]===v),s=allStats(z);return {v,n:z.length,...s}});
 app.innerHTML=nav('stats')+`<main><section class="cards"><div class="metric"><b>${overall.exp}/${Q.length}</b><span>回答経験</span></div><div class="metric"><b>${overall.tries}</b><span>累積回答</span></div><div class="metric"><b>${overall.cor}</b><span>累積正解</span></div><div class="metric"><b>${fmtPct(overall.rate)}</b><span>正答率</span></div></section>
 <section class="panel"><h2>科目別</h2>${table(groups('section'))}</section><section class="panel"><h2>年度別</h2>${table(groups('year'))}</section><section class="panel"><h2>カテゴリ別</h2>${table(groups('category'))}</section><section class="panel"><h2>細分類別</h2>${table(groups('subdomain'))}</section>
 <section class="panel"><h2>履歴のバックアップ</h2><button id="export">JSONを書き出す</button><label class="filebtn">JSONを読み込む<input id="import" type="file" accept=".json,application/json"></label><p class="muted">分類やUIを変更しても、問題IDが同じなら履歴を引き継げます。</p></section></main>`;
 bindNav();$('#export').onclick=()=>S.exportAll(progress);$('#import').onchange=async e=>{try{let obj=JSON.parse(await e.target.files[0].text());progress=S.importAll(obj);alert('履歴を読み込みました。');stats()}catch(err){alert(err.message)}};
}
function table(rows){return `<table><thead><tr><th>区分</th><th>収録</th><th>回答経験</th><th>累積回答</th><th>正答率</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.v)}</td><td>${r.n}</td><td>${r.exp}</td><td>${r.tries}</td><td>${fmtPct(r.rate)}</td></tr>`).join('')}</tbody></table>`}
window.addEventListener('keydown',e=>{
 if(!session)return;
 if(['1','2','3','4'].includes(e.key)&&!answered){let q=current(),k=choicesFor(q)[Number(e.key)-1];answer(k)}
 else if(e.key==='ArrowRight'){if(session.index<session.questionIds.length-1){session.index++;S.saveSession(session);practice()}}
 else if(e.key==='ArrowLeft'){if(session.index>0){session.index--;S.saveSession(session);practice()}}
});
window.addEventListener('sa-sync-completed',()=>{progress=S.load();if(!session)home()});
window.SAApp={home,setup,stats};home();
})();