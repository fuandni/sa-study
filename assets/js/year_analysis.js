(function(){
'use strict';
function safeNumber(v){return typeof v==='number' && Number.isInteger(v) && v>=0}
function plausible(summary,row){
 if(!summary||!row)return false;
 if(![summary.total,summary.answered,summary.correct,row.total,row.answered,row.correct].every(safeNumber))return false;
 if(summary.answered>summary.total || summary.correct>summary.answered || row.answered>row.total || row.correct>row.answered)return false;
 if(row.total>summary.total || row.answered>summary.answered || row.correct>summary.correct)return false;
 return true;
}
function build(questions,recent,progress={}){
 const out=new Map();
 for(const q of questions){
  const key=q.year+'|'+q.section;
  if(!out.has(key))out.set(key,{key,year:q.year,section:q.section,total:0,questionIds:[],flagged:0,history:[],latestFull:null,latestPartial:null,invalidCount:0});
  const row=out.get(key);row.total++;row.questionIds.push(q.id);
  if(progress.questions?.[q.id]?.flagged)row.flagged++;
 }
 for(const s of recent||[]){
  for(const r of Array.isArray(s.breakdown)?s.breakdown:[]){
   const key=r.year+'|'+r.section,row=out.get(key);
   if(!row)continue;
   if(!plausible(s,r) || r.total>row.total){row.invalidCount++;continue}
   const complete=r.total===row.total && r.answered===row.total;
   const record={id:s.id,ended_at:s.ended_at||'',label:s.label||'',total:r.total,answered:r.answered,correct:r.correct,complete,interrupted:!!s.interrupted,hasDetail:Array.isArray(s.questionIds)&&s.questionIds.length>0};
   row.history.push(record);
  }
 }
 for(const row of out.values()){
  row.history.sort((a,b)=>String(b.ended_at).localeCompare(String(a.ended_at)));
  row.latestFull=row.history.find(r=>r.complete)||null;
  row.latestPartial=row.history.find(r=>!r.complete)||null;
 }
 return [...out.values()].sort((a,b)=>a.year-b.year||(['午前I','午前II'].indexOf(a.section)-['午前I','午前II'].indexOf(b.section)));
}
function yearRow(rows,year,section){return rows.find(x=>x.year===year&&x.section===section)||null}
window.SAYearAnalysis={build,yearRow,plausible};
})();
