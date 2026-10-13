(function(){
'use strict';
// Pure review selector. Each question belongs to one year/section, regardless of session size/order.
function rows(ids=[],answers={},questions=[],progress={}){
 const byId=new Map(questions.map(q=>[q.id,q]));
 return ids.map(id=>{
  const q=byId.get(id);
  if(!q)return null;
  const a=answers?.[id]||null;
  const flag=!!progress?.questions?.[id]?.flagged;
  return {id,year:q.year,section:q.section,no:q.question_no,question:q,
   answer:a,status:a?.choice!=null?(a.correct?'correct':'wrong'):'unanswered',
   flagged:flag,
   firstCorrect:a?.choice!=null?(typeof a.first_correct==='boolean'?a.first_correct:!!a.correct):null,
   revised:(a?.revision_count||0)>0};
 }).filter(Boolean).sort((a,b)=>a.year-b.year ||
   (a.section==='午前I'?0:1)-(b.section==='午前I'?0:1) || a.no-b.no);
}
function filterRows(list,filter){
 if(filter==='wrong')return list.filter(x=>x.status==='wrong');
 if(filter==='unanswered')return list.filter(x=>x.status==='unanswered');
 if(filter==='flagged')return list.filter(x=>x.flagged);
 if(filter==='initialwrong')return list.filter(x=>x.firstCorrect===false);
 return list;
}
function groups(list){
 const m=new Map();
 for(const row of list){
  const key=row.year+'|'+row.section;
  if(!m.has(key))m.set(key,{key,year:row.year,section:row.section,items:[]});
  m.get(key).items.push(row);
 }
 return [...m.values()];
}
function counts(list){return {total:list.length,correct:list.filter(x=>x.status==='correct').length,
 wrong:list.filter(x=>x.status==='wrong').length,
 unanswered:list.filter(x=>x.status==='unanswered').length,
 flagged:list.filter(x=>x.flagged).length,
 firstCorrect:list.filter(x=>x.firstCorrect===true).length,
 firstWrong:list.filter(x=>x.firstCorrect===false).length};
}
window.SAReview={rows,filterRows,groups,counts};
})();
