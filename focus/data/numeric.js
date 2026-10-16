/* Generated exercises: fresh numeric parameters per session; no fixed correct-position memory. */
(function(root){
'use strict';
function rand(seed){let s=seed>>>0;return ()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296);}
function make(seed,domain,count=10,concept=''){
 const rng=rand(seed),int=(a,b)=>a+Math.floor(rng()*(b-a+1));let out=[];
 const fns=[
 {domain:'performance',concept:'CPI',fn:()=>{const f=int(1,5),n=int(2,12),c=int(1,4);return {stem:`クロック周波数${f}GHzのCPUで${n}億命令を平均CPI=${c}で実行する。停止を無視した実行時間は何秒か。`,v:n*c/(10*f),unit:'秒',why:`${n}億命令×${c}÷(${f}×10億サイクル/秒)`}}},
 {domain:'performance',concept:'アムダールの法則',fn:()=>{const rate=int(2,9)/10,n=[2,4,5,10][int(0,3)];return {stem:`処理の${rate*100}%を理想的に並列化できる。プロセッサ${n}台での高速化率は何倍か（小数第2位まで）。`,v:1/(1-rate+rate/n),unit:'倍',why:`1÷(1−${rate}＋${rate}÷${n})`}}},
 {domain:'architecture',concept:'キャッシュヒット率',fn:()=>{const hit=int(1,8),miss=hit+int(8,30)*5,p=int(5,9)/10;return {stem:`ヒット時${hit}ns、ミス時の総所要時間${miss}ns、ヒット率${Math.round(p*100)}%。平均アクセス時間は何nsか（小数第2位まで）。`,v:p*hit+(1-p)*miss,unit:'ns',why:`${p}×${hit}＋(1−${p})×${miss}`}}},
 {domain:'architecture',concept:'パイプライン処理',fn:()=>{const d=int(3,9),n=int(5,35);return {stem:`${d}段の理想パイプラインで${n}命令を停止なく処理する。各段1クロックのとき完了まで何クロックか。`,v:d+n-1,unit:'クロック',why:`段数${d}＋命令数${n}−1`}}},
 {domain:'theory',concept:'M/M/1待ち行列',fn:()=>{const diff=int(1,6),arrival=int(2,14);return {stem:`M/M/1待ち行列で到着率${arrival}件/分、サービス率${arrival+diff}件/分。系内平均滞在時間（待ち＋サービス）は何分か（小数第2位まで）。`,v:1/diff,unit:'分',why:`1÷(サービス率−到着率)＝1÷${diff}`}}},
 {domain:'performance',concept:'平均応答時間',fn:()=>{const hit=int(1,8)/10,miss=hit+int(4,14)/10,p=int(4,9)/10;return {stem:`キャッシュヒット時${hit.toFixed(1)}秒、ミス時${miss.toFixed(1)}秒、ヒット率${Math.round(p*100)}%。平均応答時間は何秒か（小数第2位まで）。`,v:p*hit+(1-p)*miss,unit:'秒',why:`${p}×${hit.toFixed(1)}＋(1−${p})×${miss.toFixed(1)}`}}}
 {domain:'performance',concept:'CPI',fn:()=>{const f=int(2,6),mult=int(1,8),c=int(1,5),n=mult*f,t=mult*c/10;return {stem:`CPUの周波数は${f}GHz、命令数は${n}億、実行時間は${t.toFixed(1)}秒だった。停止時間を無視すると平均CPIはいくつか。`,v:c,unit:'',why:`${t.toFixed(1)}秒×${f}×10億÷(${n}億命令)`}}},
 {domain:'architecture',concept:'キャッシュヒット率',fn:()=>{const hit=int(1,9),delta=int(4,22)*5,miss=hit+delta,p=int(4,9)/10,avg=hit+(1-p)*delta;return {stem:`ヒット時${hit}ns、ミス時の総アクセス時間${miss}ns、平均アクセス時間${Number(avg.toFixed(2))}nsだった。ヒット率は何%か。`,v:p*100,unit:'%',why:`(${miss}−${Number(avg.toFixed(2))})÷(${miss}−${hit})×100`}}},
 {domain:'architecture',concept:'パイプライン処理',fn:()=>{const d=int(3,9),n=int(6,35),total=d+n-1;return {stem:`停止のない理想パイプラインで${n}命令が${total}クロックで完了した。各段1クロックなら段数はいくつか。`,v:d,unit:'段',why:`完了クロック数${total}−命令数${n}＋1`}}},
 {domain:'theory',concept:'M/M/1待ち行列',fn:()=>{const diff=[1,2,4,5][int(0,3)],arrival=int(4,16),w=1/diff;return {stem:`M/M/1で到着率${arrival}件/分、系内平均滞在時間${w.toFixed(2)}分のとき、サービス率は何件/分か。`,v:arrival+diff,unit:'件/分',why:`サービス率＝到着率${arrival}＋1÷平均滞在時間${w.toFixed(2)}`}}},
 {domain:'performance',concept:'平均応答時間',fn:()=>{const hit=int(1,7)/10,delta=int(4,15)/10,miss=hit+delta,p=int(4,9)/10,avg=hit+(1-p)*delta;return {stem:`ヒット時${hit.toFixed(1)}秒、ミス時${miss.toFixed(1)}秒、平均応答時間${Number(avg.toFixed(2))}秒だった。ヒット率は何%か。`,v:p*100,unit:'%',why:`(ミス時${miss.toFixed(1)}−平均${Number(avg.toFixed(2))})÷(ミス時−ヒット時)×100`}}}
 ];
 let templates=fns.filter(x=>(!domain||x.domain===domain)&&(!concept||x.concept===concept));
 if(!templates.length)return out;
 const start=int(0,templates.length-1);
 for(let i=0;i<count;i++){
  const t=templates[(i+start)%templates.length],x=t.fn(),value=Number(x.v.toFixed(2)),fmt=n=>Number(n.toFixed(2)).toString()+x.unit;
  let vals=[value],step=x.unit==='クロック'?1:(value<.5?.1:value<3?.25:1);
  for(const mul of [-2,-1,1,2,3,4]){const v=Number((value+mul*step).toFixed(2));if(v>0&&!vals.includes(v))vals.push(v);if(vals.length===4)break}
  if(vals.length<4)throw Error('Insufficient numeric distractors');
  const q={id:'generated-'+seed+'-'+i,domain:t.domain,concept:t.concept,variant:'generated',level:'generated',stem:x.stem,answer:fmt(value),choices:vals.map(fmt),explanation:x.why+'＝'+fmt(value)+'。数値条件から求める。'};
  out.push(q);
 }
 return out;
}
root.SAFocusNumeric={make};
})(typeof window!=='undefined'?window:globalThis);
