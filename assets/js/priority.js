(function(){
const F=window.SA_MORNING_FREQUENCY||{};
function sectionKey(q){return q.section==='午前I'?'a1':'am2'}
function sectionLabel(k){return k==='a1'?'午前I':'午前II'}
function findFreq(q){
  const part=F[sectionKey(q)]||{};
  const hit=(part.subdomains||[]).find(x=>x.name===q.subdomain);
  if(hit)return Number(hit.avg||0);
  const hit2=(part.categories||part.domains||[]).find(x=>x.name===q.category);
  return hit2?Number(hit2.avg||0):0;
}
function smoothedError(stat){
  const tries=Number(stat?.tries||0), correct=Number(stat?.correct||0);
  return 1-((correct+1)/(tries+2));
}
function questionScore(q,stat){
  const f=findFreq(q), e=smoothedError(stat);
  return f*e*(stat?.flagged?1.25:1);
}
function groupRows(questions,aggregate){
  const m=new Map();
  for(const q of questions){
    const k=sectionKey(q)+'|'+(q.subdomain||q.category||'未分類');
    if(!m.has(k))m.set(k,{section:sectionLabel(sectionKey(q)),subdomain:q.subdomain||q.category||'未分類',questions:[],freq:findFreq(q)});
    m.get(k).questions.push(q);
  }
  const rows=[];
  for(const g of m.values()){
    let tries=0,correct=0,experienced=0;
    for(const q of g.questions){
      const s=aggregate(q.id);tries+=s.tries;correct+=s.correct;if(s.tries>0)experienced++;
    }
    const rate=tries?correct/tries:null;
    const error=1-((correct+1)/(tries+2));
    rows.push({...g,count:g.questions.length,experienced,tries,correct,rate,priority:g.freq*error});
  }
  return rows.sort((a,b)=>b.priority-a.priority||b.freq-a.freq||a.subdomain.localeCompare(b.subdomain,'ja'));
}
window.SAPriority={findFreq,smoothedError,questionScore,groupRows};
})();