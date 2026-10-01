(function(){
function run(){
 const c=window.SA_APP_CONFIG, e=[], w=[], ids=new Set();
 if(!c)e.push('config missing');
 function group(q,conf,label){
   const years={}, keys=conf?.choice_keys||['ア','イ','ウ','エ'];
   for(const x of q){
     if(ids.has(x.id))e.push('ID重複: '+x.id);ids.add(x.id);
     years[x.year]=(years[x.year]||0)+1;
     const ks=Object.keys(x.choices||{});
     if(ks.length!==keys.length||keys.some(k=>!ks.includes(k)))e.push(x.id+': 選択肢構造');
     if(!keys.includes(x.answer))e.push(x.id+': 正解値');
     if(!x.question_text)e.push(x.id+': 問題文なし');
     if(x.asset_type&&!x.asset_path)e.push(x.id+': asset_type はあるが asset_path なし');
   }
   if(conf?.expected_question_count!=null&&q.length!==conf.expected_question_count)e.push(label+' 問題数 '+q.length+' / 期待 '+conf.expected_question_count);
   for(const y of conf?.years||[])if(years[y]!==conf.expected_per_year)e.push(label+' '+y+'年度 '+(years[y]||0)+'問 / 期待 '+conf.expected_per_year);
   return years;
 }
 const a1=window.SA_A1_QUESTIONS||[], am2=window.SA_AM2_QUESTIONS||[];
 const a1years=group(a1,c?.a1,'午前I'),am2years=group(am2,c?.am2,'午前II');
 return {ok:!e.length,errors:e,warnings:w,question_count:a1.length+am2.length,a1_count:a1.length,am2_count:am2.length,a1years,am2years};
}
window.SAValidator={run};
})();