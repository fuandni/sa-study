(function(){
'use strict';
function ensureAnswers(s){
 if(!s.answers || typeof s.answers!=='object' || Array.isArray(s.answers))s.answers={};
 return s.answers;
}
function record(s,id,choice,correct,elapsed){
 const answers=ensureAnswers(s);
 const previous=answers[id];
 answers[id]={choice,correct:!!correct,elapsed_ms:Math.max(0,Math.round(Number(elapsed)||0)),
   answered_at:new Date().toISOString()};
 s.answeredCount=Object.keys(answers).length;
 s.correctCount=Object.values(answers).filter(a=>a.correct).length;
 return {changed:!!previous,answer:answers[id]};
}
function answer(s,id){return ensureAnswers(s)[id]||null}
function counts(s){
 const a=Object.values(ensureAnswers(s));
 return {answered:a.length,correct:a.filter(x=>x.correct).length};
}
function breakdown(questions,answers={}){
 const m=new Map();
 for(const q of questions){
   const k=q.year+'|'+q.section;
   if(!m.has(k))m.set(k,{year:q.year,section:q.section,total:0,answered:0,correct:0});
   const row=m.get(k);row.total++;
   const a=answers[q.id];
   if(a && a.choice!=null){row.answered++;if(a.correct)row.correct++}
 }
 return [...m.values()].sort((a,b)=>a.year-b.year||(['午前I','午前II'].indexOf(a.section)-['午前I','午前II'].indexOf(b.section)));
}
function latestByYear(questions,progress){
 const answers={};
 for(const q of questions){
   const attempts=progress?.questions?.[q.id]?.attempts||[];
   if(attempts.length)answers[q.id]=attempts[attempts.length-1];
 }
 return breakdown(questions,answers);
}
window.SAExam={ensureAnswers,record,answer,counts,breakdown,latestByYear};
})();
