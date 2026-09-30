(function(){
const PROGRESS_KEY='sa_progress_v2', SESSION_KEY='sa_session_v2', RECENT_KEY='sa_recent_sessions_v2';
const cfg=()=>window.SA_APP_CONFIG;
function empty(){return {schema_version:2,questions:{},updated_at:null}}
function load(){
  let p; try{p=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'null')}catch(e){}
  if(!p||typeof p!=='object') p=empty();
  if(!p.questions) p.questions={};
  migrateLegacy(p); return p;
}
function save(p){p.schema_version=2;p.updated_at=new Date().toISOString();localStorage.setItem(PROGRESS_KEY,JSON.stringify(p))}
function migrateLegacy(p){
  let changed=false;
  for(const q of (window.SA_AM2_QUESTIONS||[])){
    const oldKey='sa_'+q.id; const raw=localStorage.getItem(oldKey);
    if(!raw) continue;
    let old; try{old=JSON.parse(raw)}catch(e){continue}
    if(!p.questions[q.id]) p.questions[q.id]={attempts:[],legacy:null,flagged:false};
    const rec=p.questions[q.id];
    if(!rec.legacy){
      rec.legacy={tries:Number(old.tries||0),correct:Number(old.correct||0),wrong:Number(old.wrong||0),migrated_at:new Date().toISOString()};
      changed=true;
    }
  }
  if(changed) save(p);
}
function rec(p,id){if(!p.questions[id])p.questions[id]={attempts:[],legacy:null,flagged:false};if(!p.questions[id].attempts)p.questions[id].attempts=[];return p.questions[id]}
function aggregate(p,id){
  const r=p.questions[id]||{}, a=r.attempts||[], l=r.legacy||{};
  const tries=Number(l.tries||0)+a.length;
  const correct=Number(l.correct||0)+a.filter(x=>x.correct).length;
  return {tries,correct,wrong:tries-correct,rate:tries?correct/tries:null,
    last_answered:a.length?a[a.length-1].ts:(l.migrated_at||null),flagged:!!r.flagged,
    recent:a.slice(-5)};
}
function answer(p,id,choice,correct,elapsed){
  const r=rec(p,id);r.attempts.push({ts:new Date().toISOString(),choice,correct:!!correct,elapsed_ms:Math.max(0,Math.round(elapsed||0))});
  const max=cfg().am2.max_attempts_per_question||50;if(r.attempts.length>max)r.attempts=r.attempts.slice(-max);save(p);
}
function toggleFlag(p,id){const r=rec(p,id);r.flagged=!r.flagged;save(p);return r.flagged}
function exportAll(p){
 const blob=new Blob([JSON.stringify({format:'sa-progress',version:2,exported_at:new Date().toISOString(),progress:p,recent:loadRecent()},null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sa_progress_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);
}
function importAll(obj){
 if(!obj||obj.format!=='sa-progress'||!obj.progress||!obj.progress.questions)throw new Error('対応していない履歴ファイルです');
 obj.progress.schema_version=2;save(obj.progress);if(Array.isArray(obj.recent))localStorage.setItem(RECENT_KEY,JSON.stringify(obj.recent));return obj.progress;
}
function saveSession(s){localStorage.setItem(SESSION_KEY,JSON.stringify(s))}
function loadSession(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch(e){return null}}
function clearSession(){localStorage.removeItem(SESSION_KEY)}
function loadRecent(){try{return JSON.parse(localStorage.getItem(RECENT_KEY)||'[]')}catch(e){return []}}
function addRecent(s){let a=loadRecent();a.unshift(s);a=a.slice(0,cfg().am2.recent_sessions_limit||20);localStorage.setItem(RECENT_KEY,JSON.stringify(a))}
window.SAStorage={load,save,aggregate,answer,toggleFlag,exportAll,importAll,saveSession,loadSession,clearSession,loadRecent,addRecent};
})();