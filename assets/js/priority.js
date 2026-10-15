/* 統一細分類による頻度：直近6実施回の実問題数から計算。粗い分野頻度の代用は禁止。 */
(function(){
'use strict';
const YEARS=new Set([2019,2021,2022,2023,2024,2025]);
let frequency=new Map();
const key=q=>q.section+'|'+q.subdomain;
function configure(questions){
 frequency=new Map();
 for(const q of questions){
  if(!YEARS.has(q.year)||q.category==='未分類')continue;
  const k=key(q);frequency.set(k,(frequency.get(k)||0)+1/6);
 }
}
function findFreq(q){return frequency.get(key(q))||0}
function smoothedError(stat){
 const tries=Number(stat?.tries||0),correct=Number(stat?.correct||0);
 return (Math.max(0,tries-correct)+2)/(tries+4);
}
function questionScore(q,stat){
 return findFreq(q)*smoothedError(stat)*(stat?.flagged?1.25:1);
}
function groupRows(questions,aggregate,progress){
 const groups=new Map();
 for(const q of questions){
  if(q.category==='未分類')continue;
  const k=key(q);
  if(!groups.has(k))groups.set(k,{section:q.section,subdomain:q.subdomain,questions:[],freq:findFreq(q)});
  groups.get(k).questions.push(q);
 }
 const rows=[];
 for(const g of groups.values()){
  let tries=0,correct=0,experienced=0,firstWrong=0,firstN=0;
  for(const q of g.questions){
   const st=aggregate(q.id);tries+=st.tries;correct+=st.correct;if(st.tries>0)experienced++;
   const a=(progress?.questions?.[q.id]?.attempts||[]).filter(x=>typeof x.correct==='boolean').slice()
     .sort((x,y)=>String(x.ts||'').localeCompare(String(y.ts||'')));
   if(a.length){firstN++;if(!a[0].correct)firstWrong++}
  }
  const rate=firstN?(firstN-firstWrong)/firstN:null;
  const error=(firstWrong+2)/(firstN+4);
  rows.push({...g,count:g.questions.length,experienced,tries,correct,rate,priority:g.freq*error});
 }
 return rows.sort((a,b)=>b.priority-a.priority||b.freq-a.freq||a.subdomain.localeCompare(b.subdomain,'ja'));
}
window.SAPriority={configure,findFreq,smoothedError,questionScore,groupRows};
})();
