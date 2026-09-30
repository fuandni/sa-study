(function(){
const CONFIG_KEY='sa_sync_config_v1';
let syncing=false,timer=null,last={state:'idle',message:'未同期',at:null};
function cfg(){try{return {...{enabled:false,endpoint:'/sa-sync/v1/progress',token:''},...JSON.parse(localStorage.getItem(CONFIG_KEY)||'{}')}}catch(e){return {enabled:false,endpoint:'/sa-sync/v1/progress',token:''}}}
function saveConfig(v){const n={...cfg(),...v};localStorage.setItem(CONFIG_KEY,JSON.stringify(n));window.dispatchEvent(new CustomEvent('sa-sync-config-changed',{detail:n}));return n}
function status(){return {...last,config:{...cfg(),token:cfg().token?'***':''}}}
function attemptKey(a){return a.id||[a.ts,a.choice,a.correct?1:0,a.elapsed_ms||0].join('|')}
function mergeAttempts(a=[],b=[]){
 const m=new Map();for(const x of [...a,...b])m.set(attemptKey(x),x);
 return [...m.values()].sort((x,y)=>String(x.ts||'').localeCompare(String(y.ts||''))).slice(-(window.SA_APP_CONFIG?.am2?.max_attempts_per_question||50));
}
function betterLegacy(a,b){if(!a)return b||null;if(!b)return a;return Number(b.tries||0)>Number(a.tries||0)?b:a}
function mergeRecord(a={},b={}){
 const out={...a,...b};
 out.attempts=mergeAttempts(a.attempts,b.attempts);
 out.legacy=betterLegacy(a.legacy,b.legacy);
 const ta=a.flag_updated_at||'',tb=b.flag_updated_at||'';
 if(ta||tb){
   const useB=tb>ta;out.flagged=useB?!!b.flagged:!!a.flagged;out.flag_updated_at=useB?tb:ta;
 }else out.flagged=!!(a.flagged||b.flagged);
 return out;
}
function mergeProgress(a,b){
 const out={schema_version:2,questions:{},updated_at:[a?.updated_at||'',b?.updated_at||''].sort().pop()||null};
 const ids=new Set([...Object.keys(a?.questions||{}),...Object.keys(b?.questions||{})]);
 for(const id of ids)out.questions[id]=mergeRecord(a?.questions?.[id],b?.questions?.[id]);
 return out;
}
function mergeRecent(a=[],b=[]){
 const m=new Map();
 for(const x of [...a,...b]){const k=x.id||[x.ended_at,x.label,x.total].join('|');if(!m.has(k)||String(x.ended_at||'')>String(m.get(k).ended_at||''))m.set(k,x)}
 return [...m.values()].sort((x,y)=>String(y.ended_at||'').localeCompare(String(x.ended_at||''))).slice(0,window.SA_APP_CONFIG?.am2?.recent_sessions_limit||20);
}
function packageLocal(){
 return {format:'sa-progress',version:2,exported_at:new Date().toISOString(),progress:window.SAStorage.load(),recent:window.SAStorage.loadRecent()};
}
async function request(method,body){
 const c=cfg();if(!c.token)throw new Error('同期トークンが未設定です');
 const headers={'Authorization':'Bearer '+c.token};if(body)headers['Content-Type']='application/json';
 const res=await fetch(c.endpoint,{method,headers,body:body?JSON.stringify(body):undefined,cache:'no-store'});
 if(!res.ok){let t='';try{t=await res.text()}catch(e){};throw new Error('同期サーバー '+res.status+(t?': '+t.slice(0,120):''))}
 return res.status===204?null:await res.json();
}
async function syncNow(){
 const c=cfg();if(!c.enabled)throw new Error('端末間同期が無効です');if(syncing)return status();
 syncing=true;last={state:'syncing',message:'同期中',at:last.at};window.dispatchEvent(new CustomEvent('sa-sync-status',{detail:status()}));
 try{
   const local=packageLocal();
   let remote=null;try{remote=await request('GET')}catch(e){throw e}
   const rpayload=remote&&remote.payload&&remote.payload.format==='sa-progress'?remote.payload:null;
   const merged={format:'sa-progress',version:2,exported_at:new Date().toISOString(),
     progress:mergeProgress(local.progress,rpayload?.progress||{schema_version:2,questions:{}}),
     recent:mergeRecent(local.recent,rpayload?.recent||[])};
   window.SAStorage.importAll(merged,true);
   await request('PUT',merged);
   last={state:'ok',message:'同期済み',at:new Date().toISOString()};
   window.dispatchEvent(new CustomEvent('sa-sync-completed',{detail:status()}));
   return status();
 }catch(e){
   last={state:'error',message:e.message||String(e),at:new Date().toISOString()};
   window.dispatchEvent(new CustomEvent('sa-sync-error',{detail:status()}));
   throw e;
 }finally{
   syncing=false;window.dispatchEvent(new CustomEvent('sa-sync-status',{detail:status()}));
 }
}
function schedule(){
 const c=cfg();if(!c.enabled||!c.token||syncing)return;
 clearTimeout(timer);timer=setTimeout(()=>syncNow().catch(()=>{}),1600);
}
window.addEventListener('sa-progress-changed',schedule);
window.addEventListener('online',()=>{if(cfg().enabled)schedule()});
window.addEventListener('load',()=>{const c=cfg();if(c.enabled&&c.token)setTimeout(()=>syncNow().catch(()=>{}),2200)});
window.SASync={cfg,saveConfig,status,syncNow,mergeProgress,mergeRecent};
})();