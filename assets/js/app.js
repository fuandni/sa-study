(function(){
const C=window.SA_APP_CONFIG,Q=window.SATaxonomy?SATaxonomy.classifyAll([...(window.SA_A1_QUESTIONS||[]),...(window.SA_AM2_QUESTIONS||[])]):[...(window.SA_A1_QUESTIONS||[]),...(window.SA_AM2_QUESTIONS||[])],S=window.SAStorage,R=window.SAReview;
let progress=S.load(), session=null, questionStart=0;
if(window.SAPriority)SAPriority.configure(Q);
const E=window.SAExam, AUDIT113=window.SA_AUDIT_DIFF_113||null;
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const threshold=()=>C.common?.weak_threshold_percent??C.am2?.weak_threshold_percent??60;
const sectionCfg=q=>q.section==='午前I'?(C.a1||C.am2):C.am2;
const choicesFor=q=>sectionCfg(q)?.choice_keys||['ア','イ','ウ','エ'];
const cats=(sections=[])=>{let d=[...new Set(Q.filter(q=>!sections.length||sections.includes(q.section)).map(q=>q.category).filter(Boolean))];let o=window.SATaxonomy?.order||C.category_order||[];return [...o.filter(x=>d.includes(x)),...d.filter(x=>!o.includes(x)).sort()]};
const subs=(cat='',sections=[])=>[...new Set(Q.filter(q=>(!sections.length||sections.includes(q.section))&&(!cat||q.category===cat)).map(q=>q.subdomain).filter(Boolean))].sort();
function renderQuestionImage(q,src){
 if(!src)return '';
 if(q.figure_repair_mode==='manual_crop'||q.figure_repair_mode==='full_page_fallback'){
   const whole=q.figure_repair_mode==='full_page_fallback';
   const note=whole?'公式問題冊子の該当ページ全体を表示（問'+q.question_no+'を参照）':'公式問題冊子から図表を再切出し';
   return `<figure class="figure-repaired"><a href="${src}" target="_blank" rel="noopener noreferrer" title="図表を拡大"><img src="${src}" alt="${esc(note)}" loading="lazy"></a><figcaption>${esc(note)} — 画像を開いて拡大できます</figcaption></figure>`;
 }
 const c=q.source_image_crop;
 const alt=esc(q.asset_type||'図表');
 if(!c)return `<img class="qasset" src="${src}" alt="${alt}">`;
 const vals=[c.x,c.y,c.w,c.h,c.aspect];
 if(vals.some(v=>!Number.isFinite(v))||c.w<=0||c.h<=0||c.aspect<=0)return `<img class="qasset" src="${src}" alt="${alt}">`;
 const w=(100/c.w).toFixed(5),left=(-100*c.x/c.w).toFixed(5),top=(-100*c.y/c.h).toFixed(5);
 return `<div class="qsource-crop" style="position:relative;width:880px;max-width:100%;margin:16px auto;aspect-ratio:${c.aspect};overflow:hidden;border:1px solid #aaa;background:white"><img src="${src}" alt="${alt}" style="position:absolute;width:${w}%;left:${left}%;top:${top}%;max-width:none;max-height:none;height:auto;margin:0;border:0;display:block"></div>`;
}
function agg(id){return S.aggregate(progress,id)}
function allStats(list=Q){let a=list.map(q=>agg(q.id));let exp=a.filter(x=>x.tries>0).length, tries=a.reduce((n,x)=>n+x.tries,0), cor=a.reduce((n,x)=>n+x.correct,0);return {exp,tries,cor,rate:tries?cor/tries:null}}
function fmtPct(v){return v==null?'—':Math.round(v*100)+'%'}
function categorySource(q){
 const link=q.classification_source_url?'<a href="'+esc(q.classification_source_url)+'" target="_blank" rel="noopener noreferrer" title="分類・論点の参照元">分類元</a>':'';
 const checked=q.topic_review_status&&q.topic_review_source_url?'　<a href="'+esc(q.topic_review_source_url)+'" target="_blank" rel="noopener noreferrer" title="公式問題冊子の設問主題と照合済み。正解・選択肢・図表の完全校正ではありません">主題照合済（公式PDF）</a>':'';
 const content=q.content_review_status&&q.content_review_source_url?'　<a href="'+esc(q.content_review_source_url)+'" target="_blank" rel="noopener noreferrer" title="問題冊子の設問本文・選択肢・必要図表の参照を照合済み。正解キーの独立検証と句読点・空白までの逐語校正ではありません">本文・選択肢照合済（公式PDF）</a>':'';
 return link+checked+content;
}

function nav(active){return `<header><div><h1>${esc(C.title)}</h1><div class="sub">${esc(C.exam)} / データとUIを分離した拡張版</div></div><nav>
<button class="${active==='home'?'on':''}" data-nav="home">ホーム</button><button class="${active==='practice'?'on':''}" data-nav="setup">演習</button>${AUDIT113?'<button class="'+(active==='audit113'?'on':'')+'" data-nav="audit113">差分113問</button>':''}<button class="${active==='stats'?'on':''}" data-nav="stats">成績</button>
<a href="${C.links.morning_distribution||'morning_distribution.html'}">午前配分</a><a href="morning_status.html">整備状況</a><a href="${C.links.pm_reference}">午後I・II</a><a href="${C.links.source_index}">原資料</a><a href="sync_settings.html">同期</a></nav></header>`}
function bindNav(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>({home,setup,stats,audit113}[b.dataset.nav]||home)())}
function home(){
 const st=allStats(), recent=S.loadRecent(), active=S.loadSession();
 app.innerHTML=nav('home')+`<main>
 <section class="cards"><div class="metric"><b>${Q.length}</b><span>演習収録（午前I ${Q.filter(q=>q.section==='午前I').length} / 午前II ${Q.filter(q=>q.section==='午前II').length}）</span></div><div class="metric"><b>${st.exp}</b><span>回答経験</span></div><div class="metric"><b>${st.cor}</b><span>累積正解</span></div><div class="metric"><b>${fmtPct(st.rate)}</b><span>累積正答率</span></div></section>
 ${active&&active.questionIds?.length?`<section class="panel"><h2>途中の演習</h2><p>${esc(active.label||'演習')}　${Math.min(active.index+1,active.questionIds.length)} / ${active.questionIds.length}</p><button class="primary" id="resume">続きから再開</button><button id="discard">このセッションを終了</button></section>`:''}
 <section class="panel"><h2>すぐ始める</h2><div class="quick"><button class="primary" data-quick="random10">全範囲から10問</button><button data-quick="priority10">頻出×弱点 10問</button><button data-quick="a1_30">午前I ランダム30問</button><button data-quick="am2_25">午前II ランダム25問</button><button data-quick="wrong">誤答経験あり</button><button data-quick="unanswered">未回答</button><button data-quick="weak">正答率${threshold()}%以下</button><button data-quick="flagged">要復習フラグ</button></div></section>
 ${AUDIT113?'<section class="panel"><h2>データ差分の再確認</h2><p>2026-10-15に原本JSONと旧配布用JSで差があった113問を、まとめて演習できます。誤答113問という意味ではありません。</p><button class="primary" id="audit113-home">差分113問の専用メニューを開く</button></section>':''}
 <section class="panel"><h2>分野から解く</h2><div class="chips">${cats().map(c=>`<button data-cat="${esc(c)}">${esc(c)} <small>${Q.filter(q=>q.category===c).length}問</small></button>`).join('')}</div></section>
 <section class="panel"><h2>最近の演習</h2>${recent.length?`<div class="table-scroll"><table><thead><tr><th>日時</th><th>範囲</th><th>回答</th><th>正解</th><th>結果</th></tr></thead><tbody>${recent.slice(0,8).map(r=>`<tr><td>${new Date(r.ended_at).toLocaleString()}</td><td>${esc(r.label)}</td><td>${r.answered}/${r.total}</td><td>${r.correct}</td><td><button data-past-result="${esc(r.id)}">結果を見る</button></td></tr>`).join('')}</tbody></table></div>`:'<p class="muted">まだ演習履歴はありません。</p>'}</section>
 <section class="panel slim"><div id="health"></div></section>
 </main>`;
 bindNav();
 if($('#resume'))$('#resume').onclick=()=>resumeSession();
 if($('#discard'))$('#discard').onclick=()=>{S.clearSession();home()};
 document.querySelectorAll('[data-quick]').forEach(b=>b.onclick=()=>quick(b.dataset.quick));
 if($('#audit113-home'))$('#audit113-home').onclick=audit113;
 document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>start({categories:[b.dataset.cat],count:'all',mode:'all',order:'random',label:b.dataset.cat}));
 document.querySelectorAll('[data-past-result]').forEach(b=>b.onclick=()=>{const r=S.loadRecent().find(x=>x.id===b.dataset.pastResult);if(r)showResult(r)});
 const v=window.SAValidator.run();$('#health').innerHTML=v.ok?`<span class="good">構造検証 OK：${v.question_count}問（午前I ${v.a1_count||0} / 午前II ${v.am2_count||0}）</span>`:`<span class="bad">構造エラー ${v.errors.length}件</span>`;
}
// Immutable ID snapshot of canonical-JSON vs checked-in-JS differences found on 2026-10-15.
// Keep the original 113 IDs even if later edits change the wording or figure metadata.
function audit113Questions(){
 const ids=new Set(AUDIT113?.ids||[]);
 return Q.filter(q=>ids.has(q.id)).sort((a,b)=>a.year-b.year||
   (a.section==='午前I'?0:1)-(b.section==='午前I'?0:1)||a.question_no-b.question_no);
}
function audit113(){
 if(!AUDIT113){home();return}
 const list=audit113Questions();
 const valid=AUDIT113.ids.length===113&&new Set(AUDIT113.ids).size===113&&
   list.length===113&&list.filter(q=>q.section==='午前I').length===49&&
   list.filter(q=>q.section==='午前II').length===64;
 const exp=list.filter(q=>agg(q.id).tries>0).length;
 const wrong=list.filter(q=>agg(q.id).wrong>0).length;
 const notyet=list.filter(q=>agg(q.id).tries===0).length;
 const flagged=list.filter(q=>agg(q.id).flagged).length;
 app.innerHTML=nav('audit113')+`<main>
 <section class="panel"><h2>データ差分113問・確認演習</h2>
 <p>2026-10-15に原本JSONと、修正前のGitHub配布用JavaScriptで全フィールドを比較した際の差分です。
 内容・OCR文字起こしだけでなく図表の表示情報だけが変わった問題も含みます。
 <strong>「113問の正解が誤っていた」という意味ではありません。</strong></p>
 <section class="cards"><div class="metric"><b>${list.length}</b><span>対象（午前I 49 / 午前II 64）</span></div><div class="metric"><b>${exp}</b><span>回答経験あり</span></div><div class="metric"><b>${notyet}</b><span>未回答</span></div><div class="metric"><b>${wrong}</b><span>誤答経験あり</span></div></section>
 ${!valid?'<p class="bad">差分113問のID構成が一致しません。出題を停止しました。</p>':''}
 <div class="quick">
 <button class="primary" data-audit113-kind="all" ${valid?'':'disabled'}>113問すべて（年度・問番号順）</button>
 <button data-audit113-kind="a1" ${valid?'':'disabled'}>午前Iのみ 49問</button>
 <button data-audit113-kind="am2" ${valid?'':'disabled'}>午前IIのみ 64問</button>
 <button data-audit113-kind="random10" ${valid?'':'disabled'}>113問からランダム10問</button>
 <button data-audit113-kind="unanswered" ${valid&&notyet?'':'disabled'}>未回答 ${notyet}問</button>
 <button data-audit113-kind="wrong" ${valid&&wrong?'':'disabled'}>誤答経験あり ${wrong}問</button>
 <button data-audit113-kind="flagged" ${valid&&flagged?'':'disabled'}>★ 要復習 ${flagged}問</button>
 </div>
 <p class="muted">通常の演習と同じく途中保存・再開、結果表示、誤答復習、回答履歴を利用できます。出題対象の113問以外は含みません。</p>
 </section></main>`;
 bindNav();
 document.querySelectorAll('[data-audit113-kind]').forEach(b=>b.onclick=()=>{
   if(!valid)return;
   const kind=b.dataset.audit113Kind;
   let chosen=list,label='データ差分113問';
   if(kind==='a1'){chosen=list.filter(q=>q.section==='午前I');label+='・午前I 49問'}
   if(kind==='am2'){chosen=list.filter(q=>q.section==='午前II');label+='・午前II 64問'}
   if(kind==='random10'){chosen=[...list].sort(()=>Math.random()-.5).slice(0,10);label+='・ランダム10問'}
   if(kind==='unanswered'){chosen=list.filter(q=>agg(q.id).tries===0);label+='・未回答'}
   if(kind==='wrong'){chosen=list.filter(q=>agg(q.id).wrong>0);label+='・誤答経験あり'}
   if(kind==='flagged'){chosen=list.filter(q=>agg(q.id).flagged);label+='・要復習'}
   startIds(chosen.map(q=>q.id),label,{scope:'audit-diff-113',kind,count:chosen.length});
 });
}
function setup(pref={}){
 const years=[...new Set(Q.map(q=>q.year))].sort();
 const pairs=[];for(let i=0;i<years.length;i+=2)pairs.push(years.slice(i,i+2));
 app.innerHTML=nav('practice')+`<main><section class="panel"><h2>演習条件</h2>
 <div class="formrow"><label>科目</label><div class="checks"><label><input type="checkbox" name="section" value="午前I" checked> 午前I</label><label><input type="checkbox" name="section" value="午前II" checked> 午前II</label></div></div>
 <div class="formrow"><label>年度</label><div class="checks">${years.map(y=>`<label><input type="checkbox" name="year" value="${y}" checked> ${y}</label>`).join('')}</div></div>
 <div class="formrow"><label>2年度セット</label><div class="quick">${pairs.map(ys=>`<button type="button" data-year-pair="${ys.join(',')}">${ys.join('/')}</button>`).join('')}<button type="button" id="all-years">全年度</button></div></div>
 <div class="formrow"><label>カテゴリ</label><select id="category"><option value="">全カテゴリ</option>${cats().map(c=>`<option>${esc(c)}</option>`).join('')}</select></div>
 <div class="formrow"><label>細分類</label><select id="subdomain"><option value="">全細分類</option>${subs().map(c=>`<option>${esc(c)}</option>`).join('')}</select></div>
 <div class="formrow"><label>対象</label><select id="mode"><option value="all">全問</option><option value="wrong">誤答経験あり</option><option value="unanswered">未回答のみ</option><option value="weak">正答率${threshold()}%以下</option><option value="flagged">要復習フラグ</option></select></div>
 <div class="formrow"><label>問題数</label><select id="count"><option value="10">10問</option><option value="25">25問</option><option value="30">30問</option><option value="all" selected>該当する全問</option></select></div>
 <div class="formrow"><label>順序</label><select id="order"><option value="random">ランダム</option><option value="priority">学習優先度順</option><option value="fixed" selected>年度・問番号順</option></select></div>
 <div id="selection-preview" class="panel selection-preview" role="status" aria-live="polite"></div>
 <button class="primary" id="go">演習開始</button></section></main>`;
 bindNav();
 if(pref.category)$('#category').value=pref.category;
 const selectedSections=()=>[...document.querySelectorAll('input[name=section]:checked')].map(x=>x.value);
 const refreshCategories=()=>{const cur=$('#category').value;$('#category').innerHTML='<option value="">全カテゴリ</option>'+cats(selectedSections()).map(c=>`<option>${esc(c)}</option>`).join('');if([...$('#category').options].some(o=>o.value===cur))$('#category').value=cur;refreshSubs()};
 const refreshSubs=()=>{const cur=$('#subdomain').value;$('#subdomain').innerHTML='<option value="">全細分類</option>'+subs($('#category').value,selectedSections()).map(c=>`<option>${esc(c)}</option>`).join('');if([...$('#subdomain').options].some(o=>o.value===cur))$('#subdomain').value=cur};
 $('#category').onchange=refreshSubs;document.querySelectorAll('input[name=section]').forEach(x=>x.onchange=refreshCategories);refreshCategories();
 const readOpts=()=>({
   sections:selectedSections(),
   years:[...document.querySelectorAll('input[name="year"]:checked')].map(x=>Number(x.value)),
   categories:$('#category').value?[$('#category').value]:[],
   subdomains:$('#subdomain').value?[$('#subdomain').value]:[],
   mode:$('#mode').value,count:$('#count').value,order:$('#order').value
 });
 const preview=()=>{
   const o=readOpts();
   const n=o.years.length&&o.sections.length?filter(o).length:0;
   const y=o.years.length?o.years.join(' / '):'未選択';
   const sect=o.sections.length?o.sections.join('・'):'未選択';
   $('#selection-preview').textContent=`出題予定：${sect} / ${y}年度 / ${n}問`;
   $('#go').disabled=!n;
   document.querySelectorAll('[data-year-pair]').forEach(btn=>{
     const set=btn.dataset.yearPair.split(',').map(Number);
     btn.classList.toggle('primary',o.years.length===set.length&&set.every(y=>o.years.includes(y)));
   });
 };
 document.querySelectorAll('[data-year-pair]').forEach(btn=>btn.onclick=()=>{
   const ys=btn.dataset.yearPair.split(',').map(Number);
   document.querySelectorAll('input[name="year"]').forEach(box=>{box.checked=ys.includes(Number(box.value))});
   preview();
 });
 $('#all-years').onclick=()=>{document.querySelectorAll('input[name="year"]').forEach(box=>{box.checked=true});preview()};
 document.querySelectorAll('input[name="year"],input[name="section"],select').forEach(el=>el.addEventListener('change',preview));
 $('#go').onclick=()=>{
   const opts=readOpts();
   if(!opts.years.length||!opts.sections.length){alert('年度と科目をそれぞれ1つ以上選択してください');return}
   const expected=filter(opts).length;
   if(!expected){alert('演習対象が0問です。選択条件を確認してください。');return}
   start(opts);
 };
 preview();
}
function filter(opts){
 let a=Q.filter(q=>(!opts.sections?.length||opts.sections.includes(q.section))&&(!opts.years?.length||opts.years.includes(q.year))&&(!opts.categories?.length||opts.categories.includes(q.category))&&(!opts.subdomains?.length||opts.subdomains.includes(q.subdomain)));
 if(opts.mode==='wrong')a=a.filter(q=>agg(q.id).wrong>0);
 if(opts.mode==='unanswered')a=a.filter(q=>agg(q.id).tries===0);
 if(opts.mode==='weak')a=a.filter(q=>agg(q.id).tries>0 && agg(q.id).rate<=threshold()/100);
 if(opts.mode==='flagged')a=a.filter(q=>agg(q.id).flagged);
 if(opts.order==='random')a=[...a].sort(()=>Math.random()-.5);else if(opts.order==='priority'&&window.SAPriority)a=[...a].sort((x,y)=>SAPriority.questionScore(y,agg(y.id))-SAPriority.questionScore(x,agg(x.id)));else a=[...a].sort((x,y)=>x.year-y.year||x.question_no-y.question_no);
 let n=opts.count==='all'?a.length:Number(opts.count||a.length);return a.slice(0,n);
}
function quick(kind){
 let opts={years:[],categories:[],order:'random',count:'all',mode:'all'};
 if(kind==='random10'){opts.count=10;opts.label='全範囲ランダム10問'}
 if(kind==='priority10'){opts.count=10;opts.order='priority';opts.label='頻出×弱点 10問'}
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
 return startIds(list.map(q=>q.id),opts.label||describe(opts),opts);
}
function startIds(ids,label,opts={}){
 const eligible=new Set(Q.map(q=>q.id)), uniq=[...new Set(ids)].filter(id=>eligible.has(id));
 if(!uniq.length){alert('演習対象の問題がありません。');return}
 const pending=S.loadSession();
 if(pending?.questionIds?.length&&!confirm('途中の演習があります。破棄して新しい演習を始めますか？'))return;
 session={schema_version:2,id:'s_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),
  questionIds:uniq,index:0,started_at:new Date().toISOString(),answers:{},answeredCount:0,correctCount:0,label,options:opts};
 S.saveSession(session);practice();
}
function describe(o){let p=[];if(o.sections?.length&&o.sections.length<2)p.push(o.sections.join('/'));if(o.years?.length&&o.years.length<[...new Set(Q.map(q=>q.year))].length)p.push(o.years.join('/'));if(o.categories?.length)p.push(o.categories.join('/'));if(o.subdomains?.length)p.push(o.subdomains.join('/'));if(o.mode&&o.mode!=='all')p.push(o.mode);p.push(o.count==='all'?'全問':o.count+'問');return p.join('・')}
function resumeSession(){session=S.loadSession();if(!session||!session.questionIds?.length){home();return}practice()}
function current(){return Q.find(q=>q.id===session.questionIds[session.index])}
function practice(){
 if(!session)session=S.loadSession();if(!session){setup();return}
 let q=current(); if(!q){finish();return}
 questionStart=performance.now();const a=agg(q.id), qc=sectionCfg(q), asset=(q.asset_type==='source_page'&&!q.source_image_required)?null:(q.asset_path?qc.asset_base+q.asset_path:null), src=q.source_file?qc.source_base+q.source_file+(q.source_page?'#page='+q.source_page:''):'';
 app.innerHTML=nav('practice')+`<main><section class="sessionbar"><span>${session.index+1} / ${session.questionIds.length}</span><b>${esc(session.label)}</b><button id="end">途中終了</button></section>
 <section class="question"><div class="sessionprogress">この試験：回答 ${E.counts(session).answered} / ${session.questionIds.length}問、正解 ${E.counts(session).correct}問</div><div class="qmeta">${q.year}年度　${esc(q.section)} 問${q.question_no}　${esc(q.category||'')}${q.subdomain?' / '+esc(q.subdomain):''}${q.classification_status?.startsWith('暫定')?'（分類暫定）':''}　<span>${q.topic_status?'（論点要約） ':''}${esc(q.topic||'')}</span>　${categorySource(q)}</div>
 <div class="qtext">${q.question_text}</div>${asset&&q.asset_type==='source_page'&&!q.source_image_crop?`<p class="source-target"><strong>回答対象：問${q.question_no}</strong>（画像内にほかの設問もあります。問${q.question_no}だけを見て解答してください）</p>`:''}${renderQuestionImage(q,asset)}
 <p class="muted answer-hint">選択後も回答を変更できます。採点には最後の選択を使用します。</p><div class="choices">${choicesFor(q).map((k,i)=>`<button data-choice="${k}"><kbd>${i+1}</kbd><b>${k}</b><span>${q.choices[k]}</span></button>`).join('')}</div>
 <div class="qfoot"><button id="flag">${a.flagged?'★ 要復習を解除':'☆ 要復習にする'}</button>${src?`<a target="_blank" href="${src}">原本 p.${q.source_page||''}</a>`:''}<span>履歴 ${a.tries}回 / ${fmtPct(a.rate)}</span></div><div id="feedback"></div></section>
 <section class="pager"><button id="prev" ${session.index===0?'disabled':''}>← 前</button><button id="next">${session.index===session.questionIds.length-1?'終了':'次 →'}</button></section></main>`;
 bindNav(); $('#end').onclick=()=>finish(true);$('#flag').onclick=()=>{const flagged=S.toggleFlag(progress,q.id);$('#flag').textContent=flagged?'★ 要復習を解除':'☆ 要復習にする'};
 $('#prev').onclick=()=>{if(session.index>0){session.index--;S.saveSession(session);practice()}};
 $('#next').onclick=()=>{if(session.index>=session.questionIds.length-1)finish();else{session.index++;S.saveSession(session);practice()}};
 document.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>answer(b.dataset.choice));
 renderAnswerState(q);
}
function renderAnswerState(q){
 const a=E.answer(session,q.id);
 document.querySelectorAll('[data-choice]').forEach(b=>{
  const k=b.dataset.choice;
  b.disabled=false;
  b.classList.toggle('correct',!!a&&k===q.answer);
  b.classList.toggle('wrong',!!a&&k===a.choice&&!a.correct);
  b.classList.toggle('selected',!!a&&k===a.choice);
  b.setAttribute('aria-pressed',String(!!a&&k===a.choice));
 });
 $('#feedback').innerHTML=a?`<div class="feedback ${a.correct?'goodbox':'badbox'}"><b>${a.correct?'正解':'不正解'}</b>　あなた：${esc(a.choice)} / 正解：${esc(q.answer)}<span>最後の回答が採点対象</span></div>`:'';
}
function answer(choice){
 let q=current(),ok=choice===q.answer,elapsed=performance.now()-questionStart;
 E.record(session,q.id,choice,ok,elapsed);
 S.saveSession(session);
 renderAnswerState(q);
 const progressLabel=document.querySelector('.sessionprogress');
 if(progressLabel)progressLabel.textContent=`この試験：回答 ${E.counts(session).answered} / ${session.questionIds.length}問、正解 ${E.counts(session).correct}問`;
}
function finish(interrupted=false){
 if(!session){home();return}
 const questions=session.questionIds.map(id=>Q.find(q=>q.id===id)).filter(Boolean);
 const result=E.counts(session);
 const rows=E.breakdown(questions,session.answers||{});
 const summary={id:session.id,label:session.label,total:session.questionIds.length,
  answered:result.answered,correct:result.correct,breakdown:rows,
  questionIds:[...session.questionIds],answers:JSON.parse(JSON.stringify(session.answers||{})),
  started_at:session.started_at,ended_at:new Date().toISOString(),interrupted:!!interrupted};
 // Commit latest choice once per question; the complete session snapshot is saved separately for review.
 progress=S.commitSession(S.load(),session);
 S.addRecent(summary);S.clearSession();session=null;
 showResult(summary);
}
function reportRows(summary){
 return R.rows(summary.questionIds||[],summary.answers||{},Q,progress);
}
function reviewListHtml(summary,filter){
 const rows=R.filterRows(reportRows(summary),filter);
 if(!rows.length)return '<p class="muted">この条件の設問はありません。フィルターを切り替えてください。</p>';
 const groups=R.groups(rows);
 return groups.map((g,i)=>`<details class="review-group" ${groups.length<=4||i===0?'open':''}><summary><b>${g.year}年度・${esc(g.section)}</b>　${g.items.length}問</summary>
 <div class="review-grid">${g.items.map(item=>`<button type="button" class="review-tile ${item.status}" data-review-id="${esc(item.id)}" title="${esc(item.question.topic||'')}">
 <span>問${item.no}</span><small>${item.status==='correct'?'正解':item.status==='wrong'?'不正解':'未回答'}${item.flagged?' ★':''}</small></button>`).join('')}</div></details>`).join('');
}
let resultOrigin=null;
function showResult(summary,filter=null,origin=undefined){
 if(origin!==undefined)resultOrigin=origin;
 else if(filter===null)resultOrigin=null;
 const hasDetail=Array.isArray(summary.questionIds)&&summary.questionIds.length>0;
 const rows=hasDetail?reportRows(summary):[];
 const all=R.counts(rows), initial=all.firstCorrect;
 const picked=filter||((all.wrong>0)?'wrong':all.unanswered>0?'unanswered':'all');
 const firstTotal=all.firstCorrect+all.firstWrong;
 app.innerHTML=nav('practice')+`<main><section class="panel result-panel">
 <h2>${summary.interrupted?'途中終了した演習':'演習結果'}：${esc(summary.label||'')}</h2>
 <div class="result-summary"><div><div class="resultbig">${summary.correct} / ${summary.total}</div><p>最終正答率：${fmtPct(summary.total?summary.correct/summary.total:null)}</p></div>
 <div><b>${summary.answered} / ${summary.total}</b><p>回答済み</p></div>
 ${hasDetail?`<div><b>${initial} / ${summary.total}</b><p>初回正答数（解き直す前）</p></div>`:''}</div>
 ${summary.answered>summary.total||summary.correct>summary.answered||summary.correct>summary.total?
   '<p class="invalid-panel">この記録には旧版の重複加算による可能性がある集計不整合があります。年度別の成績比較から除外します。</p>':''}
 <p class="muted">未回答は分母に含め、0点として計算。試験終了後の見直しで得点は変わりません。</p>
 <h3>年度・科目別の結果</h3>${yearScoreTable(summary.breakdown||[])}
 </section>
 <section class="panel"><h2>設問ごとの見直し</h2>
 ${hasDetail?`<div class="result-filters">
 ${[['wrong','不正解'],['unanswered','未回答'],['initialwrong','初回不正解'],['flagged','要復習'],['all','すべて']].map(([value,label])=>`<button type="button" data-result-filter="${value}" ${value===picked?'class="primary"':''}>${label}（${R.filterRows(rows,value).length}）</button>`).join('')}</div>
 <div id="result-review-list">${reviewListHtml(summary,picked)}</div>`
 :'<p class="muted">この演習は詳細履歴の保存開始前に終了しているため、当時の回答選択は復元できません。集計結果は表示できます。</p>'}
 </section>
 <section class="panel result-actions">${resultOrigin?`<button id="year-history-back">← ${resultOrigin.year}年度・${esc(resultOrigin.section)}の履歴</button>`:'' }<button id="homebtn">ホーム</button><button class="primary" id="setupbtn">別の演習を始める</button><button id="statsbtn">全年度の成績</button></section></main>`;
 bindNav();$('#homebtn').onclick=home;$('#setupbtn').onclick=()=>setup();$('#statsbtn').onclick=stats;
 if($('#year-history-back'))$('#year-history-back').onclick=()=>showYearDetail(resultOrigin.year,resultOrigin.section);
 document.querySelectorAll('[data-result-filter]').forEach(b=>b.onclick=()=>showResult(summary,b.dataset.resultFilter));
 document.querySelectorAll('[data-review-id]').forEach(b=>b.onclick=()=>showReviewQuestion(summary,b.dataset.reviewId,picked));
}
function showReviewQuestion(summary,id,filter='all'){
 const rows=R.filterRows(reportRows(summary),filter), pos=rows.findIndex(x=>x.id===id);
 const row=rows[pos];if(!row){showResult(summary,filter);return}
 const q=row.question,a=row.answer,conf=sectionCfg(q);
 const asset=(q.asset_type==='source_page'&&!q.source_image_required)?null:(q.asset_path?conf.asset_base+q.asset_path:null);
 const src=q.source_file?conf.source_base+q.source_file+(q.source_page?'#page='+q.source_page:''):'';
 const correct=esc(q.answer), picked=a?esc(a.choice):'未回答';
 const initial=a?(a.first_choice??a.choice):'未回答';
 const verdict=row.status==='correct'?'正解':row.status==='wrong'?'不正解':'未回答';
 app.innerHTML=nav('practice')+`<main><section class="sessionbar">
 <button id="back-results">← 結果一覧へ戻る</button><b>${esc(summary.label||'')} / 見直し ${pos+1} / ${rows.length}</b></section>
 <section class="question"><div class="qmeta">${q.year}年度　${esc(q.section)} 問${q.question_no}　${esc(q.category||'')}${q.subdomain?' / '+esc(q.subdomain):''}　${q.topic_status?'（論点要約） ':''}${esc(q.topic||'')}　${categorySource(q)}</div>
 <div class="qtext">${q.question_text}</div>
 ${asset&&q.asset_type==='source_page'&&!q.source_image_crop?`<p class="source-target"><strong>回答対象：問${q.question_no}</strong>（画像内のほかの設問と間違えないでください）</p>`:''}
 ${renderQuestionImage(q,asset)}
 <div class="choices">${choicesFor(q).map((k,i)=>`<div class="review-choice ${k===q.answer?'correct':''} ${a&&k===a.choice&&!a.correct?'wrong':''} ${a&&k===a.choice?'selected':''}">
 <kbd>${i+1}</kbd><b>${k}</b><span>${q.choices[k]}</span></div>`).join('')}</div>
 <div class="feedback ${row.status==='correct'?'goodbox':row.status==='wrong'?'badbox':'neutralbox'}"><b>${verdict}</b>　最終回答：${picked} ／ 正解：${correct}</div>
 <p>初回回答：${esc(initial)}　${a?.revision_count>0?`（変更${a.revision_count}回）`:''}</p>
 <div class="qfoot"><button id="review-flag">${row.flagged?'★ 要復習を解除':'☆ 要復習にする'}</button>
 ${src?`<a href="${src}" target="_blank">原本 p.${q.source_page||''}</a>`:''}</div></section>
 <section class="pager"><button id="review-prev" ${pos===0?'disabled':''}>← 前の設問</button>
 <button id="review-next" ${pos===rows.length-1?'disabled':''}>次の設問 →</button></section></main>`;
 bindNav();
 $('#back-results').onclick=()=>showResult(summary,filter);
 $('#review-flag').onclick=()=>{const flagged=S.toggleFlag(progress,q.id);$('#review-flag').textContent=flagged?'★ 要復習を解除':'☆ 要復習にする'};
 $('#review-prev').onclick=()=>{if(pos>0)showReviewQuestion(summary,rows[pos-1].id,filter)};
 $('#review-next').onclick=()=>{if(pos+1<rows.length)showReviewQuestion(summary,rows[pos+1].id,filter)};
}
function yearScoreTable(rows){
 if(!rows.length)return '<p class="muted">該当する結果はありません。</p>';
 return `<div class="table-scroll"><table><thead><tr><th>年度</th><th>区分</th><th>正解 / 全問</th><th>回答済み</th><th>正解率</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.year}</td><td>${esc(r.section)}</td><td>${r.correct} / ${r.total}</td><td>${r.answered} / ${r.total}</td><td>${fmtPct(r.correct/r.total)}</td></tr>`).join('')}</tbody></table></div>`;
}

function yearData(){return window.SAYearAnalysis.build(Q,S.loadRecent(),progress)}
function matrixCell(row){
 const f=row.latestFull,p=row.latestPartial;
 const score=f?`<b>${f.correct} / ${row.total}（${fmtPct(f.correct/row.total)}）</b>`:'<b>完答記録なし</b>';
 const latest=p&&!f?`<small>部分演習：${p.answered} / ${row.total}問回答</small>`:'';
 const flag=row.flagged?`<small class="flagged-note">★ 要復習 ${row.flagged}問</small>`:'';
 const warn=row.invalidCount?`<small class="invalid-note">旧集計に不整合 ${row.invalidCount}件</small>`:'';
 return `<button class="year-cell" data-year-detail="${row.year}|${esc(row.section)}">${score}${latest}${flag}${warn}<small>詳細を見る →</small></button>`;
}
function yearMatrix(rows){
 const years=[...new Set(rows.map(x=>x.year))].sort((a,b)=>b-a);
 return `<div class="table-scroll"><table class="year-matrix"><thead><tr><th>年度</th><th>午前I（30問）</th><th>午前II（25問）</th></tr></thead><tbody>${years.map(y=>`<tr><th>${y}</th><td>${matrixCell(window.SAYearAnalysis.yearRow(rows,y,'午前I'))}</td><td>${matrixCell(window.SAYearAnalysis.yearRow(rows,y,'午前II'))}</td></tr>`).join('')}</tbody></table></div>`;
}
function bindYearButtons(){
 document.querySelectorAll('[data-year-detail]').forEach(btn=>btn.onclick=()=>{
  const [year,section]=btn.dataset.yearDetail.split('|');
  showYearDetail(Number(year),section);
 });
}
function showYearDetail(year,section){
 const row=window.SAYearAnalysis.yearRow(yearData(),year,section);
 if(!row){stats();return}
 const f=row.latestFull;
 const title=year+'年度・'+section;
 const list=row.history;
 app.innerHTML=nav('stats')+`<main><section class="panel">
 <button id="back-stats">← 全年度一覧へ</button><h2 class="year-detail-title">${esc(title)}</h2>
 <div class="year-detail-metrics">
 <div><strong>${f?`${f.correct} / ${row.total}`:'—'}</strong><span>直近の完答得点</span></div>
 <div><strong>${list.filter(x=>x.complete).length}</strong><span>完答した回数</span></div>
 <div><strong>${row.flagged}</strong><span>★ 要復習</span></div>
 </div>
 <p class="muted">複数年度をまとめた演習も、${esc(title)}の部分だけを抽出して表示。25問または30問をすべて回答した記録だけを「完答」として比較します。</p>
 ${row.invalidCount?`<p class="invalid-panel">旧集計で回答数が出題数を超えるなどの不整合を${row.invalidCount}件検出。該当記録は成績比較から除外しています。</p>`:''}
 <div class="result-actions"><button class="primary" id="year-all-practice">${esc(title)}を全問解く（${row.total}問）</button>
 <button id="year-flag-practice" ${row.flagged?'':'disabled'}>★ 要復習だけ解く（${row.flagged}問）</button></div>
 </section>
 <section class="panel"><h2>受験履歴・得点推移</h2>
 ${list.length?`<div class="table-scroll"><table><thead><tr><th>日時</th><th>正解 / 出題</th><th>回答済み</th><th>状態</th><th>見直し</th></tr></thead><tbody>
 ${list.map(s=>`<tr><td>${s.ended_at?new Date(s.ended_at).toLocaleString():'—'}</td>
 <td>${s.correct} / ${s.total}（${fmtPct(s.total?s.correct/s.total:null)}）</td>
 <td>${s.answered} / ${s.total}</td><td>${s.complete?'完答':'部分演習'}</td>
 <td><button data-year-session="${esc(s.id)}">結果を見る</button></td></tr>`).join('')}</tbody></table></div>`
 :'<p class="muted">この年度・科目の成績記録はまだありません。</p>'}
 </section></main>`;
 bindNav();
 $('#back-stats').onclick=stats;
 $('#year-all-practice').onclick=()=>startIds(row.questionIds,title+'・全問',{years:[year],sections:[section],mode:'all',count:'all',order:'fixed'});
 $('#year-flag-practice').onclick=()=>startIds(row.questionIds.filter(id=>agg(id).flagged),title+'・要復習',{years:[year],sections:[section],mode:'flagged',count:'all',order:'fixed'});
 document.querySelectorAll('[data-year-session]').forEach(btn=>btn.onclick=()=>{
  const history=S.loadRecent().find(s=>s.id===btn.dataset.yearSession);
  if(history)showResult(history,null,{year,section});
 });
}
function stats(){
 progress=S.load();
 const overall=allStats(), groups=(field,section='')=>[...new Set(Q.filter(q=>!section||q.section===section).map(q=>q[field]))].sort().map(v=>{let z=Q.filter(q=>(!section||q.section===section)&&q[field]===v),s=allStats(z);return {section,v,n:z.length,...s,...historyStats(z)}});
 const years=yearData();
 const completeCount=years.filter(x=>x.latestFull).length,flagged=Q.filter(q=>agg(q.id).flagged).length;
 app.innerHTML=nav('stats')+`<main>
 <section class="panel"><h2>全年度の成績比較</h2>
 <p>午前I・午前IIの<strong>直近の完答結果</strong>を表示。年度を開くと、以前の試験の点数も比較できます。</p>
 <div class="year-summary"><span>完答済み：${completeCount} / ${years.length}区分</span><span>★ 要復習：${flagged}問</span></div>
 ${yearMatrix(years)}</section>
 <section class="panel"><h2>要復習の確認</h2>
 <p>知識が足りない問題は、あなたが付けた★を基準に抽出するわ。正答率による自動的な習熟度判定はしません。</p>
 <button class="primary" id="all-flagged-practice" ${flagged?'':'disabled'}>★ 要復習${flagged}問を演習する</button></section>
 <details class="panel secondary-stats"><summary>累積回答・ジャンル別などの参考集計を表示</summary>
 <section class="cards"><div class="metric"><b>${overall.exp}/${Q.length}</b><span>回答経験</span></div><div class="metric"><b>${overall.tries}</b><span>累積回答</span></div><div class="metric"><b>${overall.cor}</b><span>累積正解</span></div><div class="metric"><b>${fmtPct(overall.rate)}</b><span>累積回答の正答率</span></div></section>
 <h3>各問の最新回答（受験結果とは別集計）</h3>${yearScoreTable(E.latestByYear(Q,progress))}
 <h3>科目別</h3>${table(groups('section'))}
 <h3>年度別</h3>${table(groups('year'))}
 <h3>分類データの整備状況</h3>${taxonomyCoverage()}
 <h3>カテゴリ別（統一分類）</h3><p class="muted">各問題の初回・最新回答を比較。元の分類名がない問題も学習用分類で集計します。再回答を含む累積正答率とは異なります。</p>${taxonomyTable(['午前I','午前II'].flatMap(section=>groups('category',section)))}
 <h3>細分類別（統一分類）</h3><p class="muted">5問未満の分類は標本数が少ないため「参考値」と表示します。</p>${taxonomyTable(['午前I','午前II'].flatMap(section=>groups('subdomain',section)))}
 <h3>学習優先度（参考）</h3>${window.SAPriority?priorityTable(SAPriority.groupRows(Q,agg,progress)):'<p class="muted">優先度データを読み込めません。</p>'}
 </details>
 <section class="panel"><h2>履歴のバックアップ</h2>
 <button id="export">JSONを書き出す</button><label class="filebtn">JSONを読み込む<input id="import" type="file" accept=".json,application/json"></label>
 <p class="muted">旧形式の演習で設問別回答が保存されていない場合、点数は表示できても回答選択は復元できません。</p></section></main>`;
 bindNav();bindYearButtons();
 $('#all-flagged-practice').onclick=()=>startIds(Q.filter(q=>agg(q.id).flagged).sort((a,b)=>a.year-b.year||a.question_no-b.question_no).map(q=>q.id),'★ 要復習・全年度',{mode:'flagged',count:'all',order:'fixed'});
 $('#export').onclick=()=>S.exportAll(progress);
 $('#import').onchange=async e=>{try{let obj=JSON.parse(await e.target.files[0].text());progress=S.importAll(obj);alert('履歴を読み込みました。');stats()}catch(err){alert(err.message)}};
}
function taxonomyCoverage(){
 const items=[['正規化','元の細分類を共通分類に統合'],['暫定（OCR本文）','OCR問題文をもとに暫定分類'],['暫定（外部論点索引）','外部の論点一覧をもとに暫定分類'],['未分類（要確認）','分類根拠の確認待ち']];
 const counts={};for(const q of Q)counts[q.classification_status]=(counts[q.classification_status]||0)+1;
 const officialTopicCount=Q.filter(q=>q.topic_review_status==='公式PDFで設問主題を照合済み').length;
 const officialContentCount=Q.filter(q=>q.content_review_status==='公式PDFで設問・選択肢を照合済み').length;
 return '<p class="muted">分類は学習用の独自分類です。<strong>午前Ⅰ・旧年度の主題照合：'+officialTopicCount+' / 90問、午前Ⅱ・旧年度の本文・選択肢照合：'+officialContentCount+' / 60問</strong>。正解キーの独立照合や全項目の逐語校正とは別です。分類そのものの暫定状態も維持しています。</p>'+
 '<div class="table-scroll"><table><thead><tr><th>分類の状態</th><th>問題数</th><th>根拠</th></tr></thead><tbody>'+items.map(([k,desc])=>'<tr><td>'+esc(k)+'</td><td>'+(counts[k]||0)+'</td><td>'+esc(desc)+'</td></tr>').join('')+'</tbody></table></div>';
}
function historyStats(list){
 let first=0,latest=0,answered=0,improved=0;
 for(const q of list){
  const a=(progress.questions?.[q.id]?.attempts||[]).filter(x=>typeof x.correct==='boolean').slice().sort((x,y)=>String(x.ts||'').localeCompare(String(y.ts||'')));
  if(!a.length)continue;
  answered++;if(a[0].correct)first++;if(a[a.length-1].correct)latest++;
  if(!a[0].correct&&a[a.length-1].correct)improved++;
 }
 return {answered,first,latest,improved,firstRate:answered?first/answered:null,latestRate:answered?latest/answered:null};
}
function taxonomyTable(rows){
 return '<div class="table-scroll"><table class="taxonomy-table"><thead><tr><th>科目</th><th>分類</th><th>問題数</th><th>初回正答率</th><th>最新正答率</th><th>改善</th><th>注記</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.section||'—')+'</td><td>'+esc(r.v??'未分類')+'</td><td>'+r.n+'</td><td>'+fmtPct(r.firstRate)+' ('+r.first+'/'+r.answered+')</td><td>'+fmtPct(r.latestRate)+' ('+r.latest+'/'+r.answered+')</td><td>'+r.improved+'問</td><td>'+(r.v==='未分類'||String(r.v).startsWith('未分類')?'画像確認待ち':r.n<5?'参考値（5問未満）':'')+'</td></tr>').join('')+'</tbody></table></div>';
}
function priorityTable(rows){return '<p class="muted">2019・2021〜2025年度の同じ統一細分類の平均出題数/回 × 初回誤答率の平滑推定で計算します。分類未設定の問題はランキング対象外です。</p><table><thead><tr><th>科目</th><th>細分類</th><th>平均出題/回</th><th>回答経験</th><th>正答率</th><th>優先度</th></tr></thead><tbody>'+rows.slice(0,20).map(r=>'<tr><td>'+esc(r.section)+'</td><td>'+esc(r.subdomain)+'</td><td>'+r.freq.toFixed(2)+'</td><td>'+r.experienced+'/'+r.count+'</td><td>'+fmtPct(r.rate)+'</td><td>'+r.priority.toFixed(2)+'</td></tr>').join('')+'</tbody></table>'}
function table(rows){return `<table><thead><tr><th>区分</th><th>収録</th><th>回答経験</th><th>累積回答</th><th>正答率</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.v)}</td><td>${r.n}</td><td>${r.exp}</td><td>${r.tries}</td><td>${fmtPct(r.rate)}</td></tr>`).join('')}</tbody></table>`}
window.addEventListener('keydown',e=>{
 if(!session)return;
 if(['1','2','3','4'].includes(e.key)&&!e.target?.closest?.('input,textarea,select')){let q=current(),k=choicesFor(q)[Number(e.key)-1];answer(k)}
 else if(e.key==='ArrowRight'){if(session.index<session.questionIds.length-1){session.index++;S.saveSession(session);practice()}}
 else if(e.key==='ArrowLeft'){if(session.index>0){session.index--;S.saveSession(session);practice()}}
});
window.addEventListener('sa-sync-completed',()=>{progress=S.load();if(!session&&document.querySelector('#health'))home()});
window.SAApp={home,setup,stats,audit113};home();
})();