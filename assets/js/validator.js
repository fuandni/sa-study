(function(){
function run(){
 const q=window.SA_AM2_QUESTIONS||[], c=window.SA_APP_CONFIG, e=[], w=[], ids=new Set(), years={};
 if(!c)e.push('config missing');
 for(const x of q){
  if(ids.has(x.id))e.push('ID重複: '+x.id);ids.add(x.id);
  years[x.year]=(years[x.year]||0)+1;
  const ks=Object.keys(x.choices||{}), expected=(c?.am2?.choice_keys||['ア','イ','ウ','エ']);
  if(ks.length!==expected.length||expected.some(k=>!ks.includes(k)))e.push(x.id+': 選択肢構造');
  if(!expected.includes(x.answer))e.push(x.id+': 正解値');
  if(!x.question_text)e.push(x.id+': 問題文なし');
  if(x.asset_type&&!x.asset_path)e.push(x.id+': asset_type はあるが asset_path なし');
 }
 if(c?.am2?.expected_question_count && q.length!==c.am2.expected_question_count)e.push('問題数 '+q.length+' / 期待 '+c.am2.expected_question_count);
 for(const y of c?.am2?.years||[])if(years[y]!==c.am2.expected_per_year)e.push(y+'年度 '+(years[y]||0)+'問 / 期待 '+c.am2.expected_per_year);
 return {ok:!e.length,errors:e,warnings:w,question_count:q.length,years};
}
window.SAValidator={run};
})();