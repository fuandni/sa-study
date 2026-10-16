(function(){
"use strict";
const GROUPS=[["class","クラス図・多重度"],["activity","アクティビティ図"],["usecase","ユースケース図"],["sequence","シーケンス図"],["state","ステートマシン図"]];
const Q=[
["C01","class","多重度：0件以上","顧客1人につき注文は0件以上存在できる。図の注文側の「?」に入る多重度はどれか。",["1","0..1","0..*","1..*"],2,"一人の顧客が注文をしない場合もあるため、注文側は0..*。顧客側の1は、各注文が必ず一人の顧客に属することを表す。"],
["C02","class","多重度：1件以上","社員は必ず一つの部門に属し、各部門には少なくとも一人の社員が属する。社員側の「?」はどれか。",["0..1","1..*","0..*","1"],1,"部門1件に対して社員が一人以上なので社員側は1..*。逆に社員1人が属する部門は一つなので部門側は1。"],
["C03","class","多重度：任意の1件","社員には会社貸与PCを0台または1台割り当てる。各PCは一人の社員だけに割り当てる。PC側の「?」はどれか。",["0..*","1..*","1","0..1"],3,"0台でもよく、最大1台なので0..1。0..*では上限がなく、1は貸与必須を意味する。"],
["C04","class","多重度：少なくとも1行","各注文には必ず一つ以上の注文明細が含まれ、明細は必ず一つの注文に属する。明細側の「?」はどれか。",["1..*","0..*","1","0..1"],0,"1..*は最小1件・最大上限なし。0..*は明細が0件の注文を許してしまう。"],
["C05","class","コンポジション","図で全体側に描かれた黒いひし形は何を表すか。",["共有集約","コンポジション（強い集約）","汎化","依存"],1,"黒塗りひし形はコンポジションを表し、全体と部分の強い所有関係を示す。白抜きひし形の共有集約と区別する。"],
["C06","class","共有集約","図でチーム側に付いた白抜きひし形はどの関連を示すか。",["実現","コンポジション","共有集約","汎化"],2,"白抜きひし形は共有集約、黒塗りひし形はコンポジション。共有集約の詳細な所有・寿命の意味はモデルで明示する必要がある。"],
["C07","class","汎化・継承","図で白抜き三角矢印が指すクラスの役割はどれか。",["サブクラス","スーパークラス","インスタンス","関連クラス"],1,"白抜き三角の先は汎化先、つまりスーパークラス。子クラスから親クラスへ矢印が向く。"],
["C08","class","可視性","図のクラスで「protected（自身と派生クラスからのアクセス）」を表す記号はどれか。",["+","-","#","~"],2,"UMLの可視性は + がpublic、- がprivate、# がprotected、~ がpackage。メンバ名の前に付く。"],
["C09","class","属性と操作","クラス図の区画で、操作（メソッド）を表しているものはどれか。",["- stock : int","+ reserve(qty : int) : bool","OrderService","stock : intだけ"],1,"クラス図は通常、クラス名・属性・操作の区画に分かれる。括弧の付いたreserve(qty : int) : boolは操作を示す。"],
["C10","class","多重度：3クラスの関連","図の注文と注文明細の関係で、注文が必ず1件以上の明細を持つなら「?」に入る値はどれか。",["0..1","1","0..*","1..*"],3,"注文に含まれる明細の最小数が1なので1..*。注文明細から見た注文は1。明細から商品への関連も別に読む。"],
["A01","activity","分岐とガード","図のひし形「在庫あり？」は、UMLアクティビティ図で主に何を表すか。",["開始点","分岐ノード","並行処理の分岐","終了点"],1,"ひし形は条件による分岐や合流を表す。角括弧のガードに従い、通常は条件を満たす経路が選択される。"],
["A02","activity","フォークとジョイン","図中の太い横棒から2本に分かれる部分の意味として適切なのはどれか。",["必ず片方だけ実行する","処理を並行して進める","例外終了する","オブジェクトを生成する"],1,"フォークは一つの制御フローから並行する複数のフローを開始する。ジョインは並行フローを同期する。"],
["A03","activity","分岐条件","図で「決済OK」だけが成り立つ場合、次に実行するアクションはどれか。",["通知を送る","取引を取消す","支払を確認する","終了する"],0,"分岐からのガード[決済OK]の線をたどると『通知を送る』へ進む。別のガードは成立しない。"],
["A04","activity","スイムレーン","図のスイムレーン（区画）の目的として最も適切なのはどれか。",["活動を担当する主体・役割を区別する","必ず処理を並列化する","クラスの属性を記述する","時間軸の秒数を表す"],0,"アクティビティ図のパーティション（スイムレーン）は、アクションの責任を負う役割や部門などを分けて示す。"],
["U01","usecase","アクターと境界","図でシステムの外側に描かれた棒人間が表すものはどれか。",["システム内部のクラス","外部のアクター","データストア","制御フロー"],1,"アクターは対象システムと相互作用する外部の役割。人だけでなく他システムもアクターになり得る。"],
["U02","usecase","«include»","図の«include»関係について、適切な説明はどれか。",["基本ユースケースに含まれる共通の振る舞いを示す","例外時のみ任意で呼び出すことを必ず示す","親子クラス間の継承を示す","画面遷移の時刻を示す"],0,"«include»は基本ユースケースの振る舞いから含まれるユースケースを利用する関係。破線矢印は含まれる側へ向く。"],
["U03","usecase","«extend»","図の«extend»について適切なのはどれか。",["基本ユースケースから必ず呼び出される共通処理","拡張条件に応じて基本ユースケースの振る舞いを追加する","クラスの多重度を示す","操作の戻り値を示す"],1,"«extend»は基本ユースケースへの条件付きの拡張を示す。破線矢印は拡張する側から基本側を向く。"],
["U04","usecase","システム境界","図でシステム境界の内側にある楕円「予約する」は何を表すか。",["利用者（アクター）","ユースケース（利用者に提供する振る舞い）","実装クラスの属性","物理データベース"],1,"楕円はユースケース。システム境界内に対象システムが提供する機能を置き、外部のアクターを関連線で結ぶ。"],
["S01","sequence","メッセージの順序","図で画面が認証APIへ認証要求を送り、APIがDBへ照会する。時系列として適切なのはどれか。",["DB照会→認証要求→結果","認証要求→DB照会→結果","結果→DB照会→認証要求","3つは必ず同時"],1,"シーケンス図は上から下へ時間が進む。図では認証要求、DB照会、照会結果、画面への応答の順。"],
["S02","sequence","戻りメッセージ","図の破線矢印『結果』が表すものはどれか。",["同期呼出し要求","戻りメッセージ（応答）","汎化","集約"],1,"シーケンス図の破線矢印は通常、呼出しからの応答・戻りメッセージを示す。実線の呼出し矢印と区別する。"],
["S03","sequence","alt複合フラグメント","図のaltと二つのガードについて、適切なのはどれか。",["両方の経路を必ず同時実行","条件に応じた分岐を示す","処理を無条件に繰り返す","クラス間の継承を示す"],1,"altは条件分岐を表す複合フラグメント。[認証OK]と[その他]などのガードによって分岐先を決める。"],
["S04","sequence","loop複合フラグメント","図でloop [リトライ回数＜3]が意味するものはどれか。",["最大3回など条件に従い繰返す","必ず別スレッドで並行実行","システムを終了する","クラスの多重度を表す"],0,"loopフラグメントは条件や反復回数による繰返し。シーケンス図でもループの振る舞いを表現できる。"],
["T01","state","初期擬似状態","図の黒い小さな丸が表すものはどれか。",["終了状態","初期擬似状態","履歴状態","状態内アクション"],1,"黒い塗りつぶし丸は初期擬似状態で、状態機械が開始するときに進む経路を示す。"],
["T02","state","ガード条件","遷移ラベル『承認 [与信OK] / 通知』で、角括弧の部分の役割はどれか。",["遷移の発生条件（ガード）","状態名","操作の可視性","オブジェクトの多重度"],0,"一般に『トリガー [ガード] / 効果』の形で書く。[与信OK]は遷移が成立する条件を示す。"],
["T03","state","遷移可能性","図の状態遷移だけが定義されている。直接の遷移として許可されていないものはどれか。",["申請中→承認済","申請中→却下","承認済→発送済","却下→発送済"],3,"矢印がある遷移だけが図に定義されている。却下から発送済への直接の矢印はない。"],
["T04","state","終了状態","図の二重丸（内側が黒い丸）が表すものはどれか。",["初期擬似状態","終了状態（final state）","共有集約","同期バー"],1,"ステートマシン図の二重丸（黒丸を外円で囲む形）は終了状態を表す。初期状態の黒丸と区別する。"]
].map(v=>({id:v[0],group:v[1],concept:v[2],stem:v[3],choices:v[4],answer:v[5],explanation:v[6]}));
const $=s=>document.querySelector(s),root=$("#app"),KEY="sa_uml_progress_v1",SESSION="sa_uml_session_v1";
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store=(key,obj)=>{try{localStorage.setItem(key,JSON.stringify(obj))}catch(e){}};
const load=(key,def)=>{try{return JSON.parse(localStorage.getItem(key))||def}catch(e){return def}};
let progress=load(KEY,{}),session=load(SESSION,null);
if(!progress||typeof progress!=="object")progress={};
if(session&&(!Array.isArray(session.ids)||session.ids.some(id=>!Q.some(q=>q.id===id))))session=null;
function S(tag,a,b){return "<"+tag+" "+a+">"+(b||"")+"</"+tag+">"}
function txt(x,y,v,size=17,anchor="middle",fill="#192d49"){return '<text x="'+x+'" y="'+y+'" fill="'+fill+'" font-size="'+size+'" text-anchor="'+anchor+'" dominant-baseline="middle">'+esc(v)+'</text>'}
function box(x,y,w,h,label,fill="#f4f8ff"){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="9" fill="'+fill+'" stroke="#52729a" stroke-width="2"/>'+txt(x+w/2,y+h/2,label)}
function ln(x1,y1,x2,y2,arrow=false,dash=false){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#335b88" stroke-width="2.7"'+(dash?' stroke-dasharray="7 5"':'')+(arrow?' marker-end="url(#arr)"':'')+'/>'}
function ellipse(x,y,rx,ry,v){return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="#f1f7ff" stroke="#52729a" stroke-width="2.2"/>'+txt(x,y,v,17)}
function circle(x,y,r,fill="#253c5c"){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="#253c5c" stroke-width="2"/>'}
function diamond(x,y,v){return '<polygon points="'+x+','+(y-34)+' '+(x+52)+','+y+' '+x+','+(y+34)+' '+(x-52)+','+y+'" fill="#fff9e9" stroke="#92713d" stroke-width="2"/>'+txt(x,y,v,14)}
function classBox(x,y,w,title,lines=[]){let h=70+lines.length*29;let z='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="#f4f8ff" stroke="#52729a" stroke-width="2"/><line x1="'+x+'" y1="'+(y+43)+'" x2="'+(x+w)+'" y2="'+(y+43)+'" stroke="#52729a"/>'+txt(x+w/2,y+25,title,19);lines.forEach((t,i)=>z+=txt(x+16,y+60+i*29,t,16,"start"));return z}
function actor(x,y,label){return circle(x,y,12,"white")+ln(x,y+13,x,y+70)+ln(x-25,y+32,x+25,y+32)+ln(x,y+70,x-21,y+100)+ln(x,y+70,x+21,y+100)+txt(x,y+125,label,17)}
function svg(inner){return '<figure class="diagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 390" role="img" aria-label="UMLの設問図"><defs><marker id="arr" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="#335b88"/></marker></defs><rect x="0" y="0" width="760" height="390" fill="#fff"/>'+inner+'</svg><figcaption>解答の前に図と問題文を照合しましょう</figcaption></figure>'}
function diagram(q,solved){
const id=q.id;let z="";
if(["C01","C02","C03","C04"].includes(id)){
 const cfg={C01:["顧客","注文","1","0..*"],C02:["部門","社員","1","1..*"],C03:["社員","貸与PC","1","0..1"],C04:["注文","注文明細","1","1..*"]}[id];
 z=classBox(75,145,205,cfg[0])+classBox(480,145,205,cfg[1])+ln(280,182,480,182)+txt(310,160,cfg[2],18)+txt(445,160,solved?cfg[3]:"?",22)+txt(380,280,"関連端の多重度を判断する",16);
}
else if(id==="C05"||id==="C06"){
 z=classBox(65,145,220,id==="C05"?"注文":"チーム")+classBox(485,145,220,id==="C05"?"注文明細":"メンバー")+ln(332,181,485,181);
 z+='<polygon points="286,181 309,167 332,181 309,195" stroke="#335b88" stroke-width="2" fill="'+(id==="C05"?"#335b88":"white")+'"/>';
 z+=txt(380,275,solved?(id==="C05"?"コンポジション":"共有集約"):"ひし形の意味は？",18);
}
else if(id==="C07"){
 z=classBox(75,145,225,"利用者")+classBox(485,145,205,"有料会員")+ln(326,181,485,181);
 z+='<polygon points="300,181 326,166 326,196" fill="white" stroke="#335b88" stroke-width="2"/>'+txt(380,272,solved?"白三角の先＝親クラス":"白三角の向きに注目",17);
}
else if(id==="C08"||id==="C09"){
 z=classBox(225,50,310,"OrderService",["- stock : int","+ reserve(qty : int) : bool","# validate() : bool"]);
 if(solved) z+='<rect x="229" y="'+(id==="C08"?150:121)+'" width="302" height="28" fill="none" stroke="#168451" stroke-width="3" rx="5"/>';
 z+=txt(380,286,id==="C08"?"＋、－、＃ の意味は？":"属性と操作の区画を区別",18);
}
else if(id==="C10"){
 z=classBox(30,145,180,"注文")+classBox(290,145,180,"注文明細")+classBox(550,145,180,"商品");
 z+=ln(210,182,290,182)+txt(225,160,"1")+txt(270,160,solved?"1..*":"?",20);
 z+=ln(470,182,550,182)+txt(490,160,"0..*")+txt(530,160,"1");
 z+=txt(380,280,"各関連端の数を読む",16);
}
else if(id[0]==="A"){
 if(id==="A01"||id==="A03"){
 z=circle(120,90,11)+ln(120,102,120,145,true)+box(55,145,130,58,id==="A01"?"受注する":"支払を確認")+ln(185,174,280,174,true)+diamond(350,174,id==="A01"?"在庫あり？":"決済OK？");
 z+=ln(402,174,495,174,true)+box(495,145,196,58,id==="A01"?"出荷する":"通知を送る")+txt(445,152,id==="A01"?"[あり]":"[決済OK]",14);
 z+=ln(350,208,350,280,true)+box(285,280,130,58,id==="A01"?"取消す":"取引を取消す")+txt(390,245,id==="A01"?"[なし]":"[その他]",14);
 }
 if(id==="A02"){
 z=circle(130,60,12)+ln(130,72,130,105,true)+box(65,105,130,58,"受付")+ln(130,163,130,195,true);
 z+='<rect x="130" y="195" width="430" height="10" fill="#263d60"/>'+ln(225,205,225,235,true)+ln(460,205,460,235,true)+box(150,235,150,58,"在庫照会")+box(385,235,150,58,"与信確認");
 z+='<rect x="130" y="318" width="430" height="10" fill="#263d60"/>'+ln(225,293,225,318,true)+ln(460,293,460,318,true);
 }
 if(id==="A04"){
 z+='<rect x="70" y="60" width="620" height="260" fill="#fff" stroke="#56759b" stroke-width="2"/><rect x="70" y="60" width="310" height="260" fill="#eaf4ff"/>';
 z+=ln(380,60,380,320)+txt(225,88,"申請者",18)+txt(535,88,"承認者",18)+box(143,140,170,62,"申請する")+ln(313,171,447,171,true)+box(447,140,170,62,"審査する");
 z+=txt(380,285,"担当する役割で処理を区画",17);
 }
}
else if(id[0]==="U"){
 z+='<rect x="255" y="55" width="435" height="280" rx="7" fill="#f7faff" stroke="#55719a" stroke-width="2"/>'+txt(475,78,id==="U04"?"予約システム":"注文管理システム",18);
 z+=actor(130,130,id==="U04"?"顧客":"利用者");
 if(id==="U01"||id==="U04"){z+=ellipse(467,160,128,40,id==="U04"?"予約する":"注文を登録")+ln(155,170,339,160);z+=ellipse(467,270,120,35,"履歴を照会")+ln(155,170,350,270);if(solved)z+=txt(480,365,id==="U01"?"境界の外＝アクター":"楕円＝ユースケース",17);}
 if(id==="U02"||id==="U03"){
 z+=ellipse(406,150,99,37,id==="U02"?"注文する":"注文する")+ellipse(570,265,96,36,id==="U02"?"認証する":"クーポン適用")+ln(155,170,305,150);
 if(id==="U02"){z+=ln(447,181,528,233,true,true)+txt(502,196,"«include»",15);}
 else{z+=ln(535,237,441,178,true,true)+txt(514,190,"«extend»",15);}
 if(solved)z+=txt(500,355,id==="U02"?"基本から含まれる側へ":"拡張側から基本へ",16);
 }
}
else if(id[0]==="S"){
 const heads=id==="S01"?["画面","認証API","DB"]:["利用者画面","サーバ","DB"];
 const xs=[130,380,630];
 xs.forEach((x,i)=>{z+=box(x-90,38,180,47,heads[i]);z+=ln(x,85,x,347,false,true)});
 if(id==="S01"){z+=ln(130,122,380,122,true)+txt(255,104,"1. 認証要求",15)+ln(380,183,630,183,true)+txt(505,165,"2. DB照会",15)+ln(630,241,380,241,true,true)+txt(505,223,"3. 照会結果",15)+ln(380,300,130,300,true,true)+txt(255,282,"4. 認証結果",15);}
 if(id==="S02"){z+=ln(130,145,380,145,true)+txt(255,123,"要求",16)+ln(380,250,130,250,true,true)+txt(255,227,"結果",16);if(solved)z+=txt(380,363,"破線＝戻りメッセージ",15);}
 if(id==="S03"){z+='<rect x="105" y="110" width="550" height="226" fill="#f7fbff" fill-opacity=".7" stroke="#385f93" stroke-width="2"/>'+box(105,110,72,31,"alt");z+=txt(215,155,"[認証OK]",16,"start")+ln(130,182,380,182,true)+txt(255,168,"遷移",15)+ln(105,220,655,220,false,true)+txt(215,251,"[その他]",16,"start")+ln(380,288,130,288,true,true)+txt(255,274,"エラー",15);}
 if(id==="S04"){z+='<rect x="105" y="110" width="550" height="210" fill="#f7fbff" fill-opacity=".7" stroke="#385f93" stroke-width="2"/>'+box(105,110,85,31,"loop");z+=txt(315,150,"[リトライ回数 < 3]",16)+ln(130,210,380,210,true)+txt(255,187,"API再試行",15);}
}
else if(id[0]==="T"){
 if(id==="T01"){z+=circle(130,188,15)+ln(146,188,285,188,true)+box(285,151,185,74,"申請中")+ln(470,188,590,188,true)+box(590,151,115,74,"審査中");}
 if(id==="T02"){z+=box(45,163,190,75,"申請中")+ln(235,200,525,200,true)+box(525,163,190,75,"承認済")+txt(380,161,"承認 [与信OK] / 通知",17);}
 if(id==="T03"){
 z+=box(45,135,170,65,"申請中")+box(325,62,170,65,"承認済")+box(325,260,170,65,"却下")+box(570,62,165,65,"発送済");
 z+=ln(215,150,325,96,true)+txt(266,104,"承認",14)+ln(215,188,325,289,true)+txt(263,255,"否認",14)+ln(495,95,570,95,true)+txt(533,70,"発送",14);
 }
 if(id==="T04"){z+=circle(95,190,13)+ln(110,190,252,190,true)+box(252,150,180,80,"処理中")+ln(432,190,615,190,true)+circle(635,190,19,"white")+circle(635,190,12);if(solved)z+=txt(635,252,"終了状態",17);}
}
const solvedNotes={
 A01:"ひし形の先でガード条件に応じた経路へ分岐する",
 A02:"横棒で並行開始し、下の横棒で合流・同期する",
 A03:"[決済OK] が成立すると右の『通知を送る』へ進む",
 A04:"処理の位置で申請者と承認者の担当を読み取る",
 S01:"時間は上から下へ進み、要求から照会、結果へ進む",
 S03:"alt は条件に応じて片方の経路を実行する",
 S04:"loop の条件を満たす間、API再試行が繰り返される",
 T01:"黒い小丸から出る矢印が初期状態への遷移を示す",
 T02:"[与信OK] は承認遷移のガード（成立条件）",
 T03:"『却下』から『発送済』へ向かう直接の矢印はない"
};
if(solved&&solvedNotes[id]){
 z+='<rect x="58" y="350" width="644" height="31" rx="7" fill="#e7f6ed" stroke="#97ceb0"/>'+txt(380,366,solvedNotes[id],15);
}
return svg(z);
}
const VISUAL_OPTIONS=new Set(["C01","C02","C03","C04","C10"]);
function choiceFigure(q,choiceIndex){
 if(!VISUAL_OPTIONS.has(q.id))return "";
 const v=q.choices[choiceIndex];
 const cfg={
  C01:["顧客","注文"],C02:["部門","社員"],C03:["社員","貸与PC"],
  C04:["注文","注文明細"],C10:["注文","注文明細"]
 }[q.id];
 const w=550,mid=275;
 const a='<rect x="12" y="23" width="145" height="83" rx="2" fill="#f1f7ff" stroke="#40628b" stroke-width="2"/>';
 const b='<rect x="393" y="23" width="145" height="83" rx="2" fill="#f1f7ff" stroke="#40628b" stroke-width="2"/>';
 const c='<line x1="157" y1="64" x2="393" y2="64" stroke="#355779" stroke-width="2"/>';
 return '<span class="choice-figure"><svg viewBox="0 0 '+w+' 128" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(cfg[0]+'と'+cfg[1]+'の関連。'+cfg[1]+'側の多重度は'+v)+'">'+a+b+c+
 '<text x="84" y="70" text-anchor="middle" fill="#233851" font-size="22">'+esc(cfg[0])+'</text>'+
 '<text x="465" y="70" text-anchor="middle" fill="#233851" font-size="22">'+esc(cfg[1])+'</text>'+
 '<text x="178" y="52" text-anchor="start" fill="#233851" font-size="21">1</text>'+
 '<text x="374" y="52" text-anchor="end" fill="#154e98" font-size="23" font-weight="bold">'+esc(v)+'</text>'+
 '</svg></span>';
}
function hist(q){return Array.isArray(progress[q.id])?progress[q.id]:[]}
function saveSession(){if(session)store(SESSION,session);else try{localStorage.removeItem(SESSION)}catch(e){}}
function shuffle(a){let out=[...a];for(let i=out.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function header(title,sub){return '<section class="hero"><h1>'+esc(title)+'</h1><p class="muted">'+esc(sub)+'</p></section>'}
function home(){
 let done=Q.filter(q=>hist(q).length).length,wrongs=Q.filter(q=>hist(q).some(x=>!x.correct)).length;
 let tiles=GROUPS.map(([k,v])=>{let group=Q.filter(q=>q.group===k),passed=group.filter(q=>hist(q).length&&hist(q).at(-1).correct).length;return '<button class="tile" data-group="'+k+'"><b>'+esc(v)+'</b><small>'+group.length+'問／直近正解 '+passed+'問</small></button>'}).join("");
 root.innerHTML=header("UML集中演習","過去問で重要な5種類・全26問。図を読む→解答→完成図で確認。独立した演習履歴に保存します。")+
 '<section class="card"><div class="statistics"><div class="stat">収録<strong>26問</strong></div><div class="stat">回答経験<strong>'+done+'/26問</strong></div><div class="stat">誤答経験<strong>'+wrongs+'問</strong></div></div>'+
 '<div class="fields"><label>分野<select id="group"><option value="all">全5種類</option>'+GROUPS.map(([k,v])=>'<option value="'+k+'">'+esc(v)+'</option>').join('')+'</select></label>'+
 '<label>問題の種類<select id="kind"><option value="all">全問題</option><option value="unseen">未回答だけ</option><option value="wrong">誤答経験あり</option></select></label>'+
 '<label>出題数<select id="count"><option value="10">10問</option><option value="26">該当全問</option></select></label></div>'+
 '<p id="countHint" class="note"></p><button class="primary" id="start">演習開始</button>'+
 (session?'<button id="resume" style="margin-left:.5rem">途中から再開（'+(session.index+1)+'/'+session.ids.length+'問）</button>':'')+'</section>'+
 '<section class="card"><h2>分野から始める</h2><div class="tiles">'+tiles+'</div></section>'+
 '<p class="note">公式試験問題を転載したものではなく、出題テーマを踏まえて作成した独自問題です。DFD・ER図はUMLではないため別扱いにしています。</p>';
 const update=()=>{let n=selectIds().length;$("#countHint").textContent="今回の候補："+n+"問";$("#start").disabled=!n};
 function selectIds(){return Q.filter(q=>($("#group").value==="all"||q.group===$("#group").value)&&($("#kind").value==="all"||($("#kind").value==="unseen"?!hist(q).length:hist(q).some(x=>!x.correct)))).map(q=>q.id)}
 ["group","kind","count"].forEach(id=>$("#"+id).addEventListener("change",update));
 $("#start").onclick=()=>begin(selectIds(),$("#count").value);
 if(session)$("#resume").onclick=renderQ;
 document.querySelectorAll("[data-group]").forEach(b=>b.onclick=()=>begin(Q.filter(q=>q.group===b.dataset.group).map(q=>q.id),"26"));
 update();
}
function begin(ids,count){
 const list=shuffle(ids).slice(0,count==="10"?10:ids.length);
 if(!list.length)return;
 if(session&&!confirm("途中の演習を破棄して新しく始めますか？"))return;
 session={ids:list,index:0,answers:{},started:new Date().toISOString()};saveSession();renderQ();
}
function renderQ(){
 if(!session){home();return}
 const q=Q.find(x=>x.id===session.ids[session.index]);if(!q){home();return}
 const answer=session.answers[q.id],name=GROUPS.find(g=>g[0]===q.group)[1];
 if(!session.orders)session.orders={};
 if(!session.orders[q.id])session.orders[q.id]=shuffle([0,1,2,3]);
 const ord=session.orders[q.id];saveSession();
 root.innerHTML='<section class="card"><div class="question-meta"><strong>問'+(session.index+1)+' / '+session.ids.length+'　'+esc(name)+'</strong><span class="pill">'+q.id+'</span></div>'+
 '<div class="pbar"><div style="width:'+((session.index+1)/session.ids.length*100)+'%"></div></div><h2>'+esc(q.concept)+'</h2><p class="stem">'+esc(q.stem)+'</p>'+diagram(q,false)+
 '<div class="answers">'+ord.map((i,k)=>'<button data-choice="'+i+'" '+(answer?'disabled':'')+' class="'+(answer?(i===q.answer?'correct':i===answer.selected?'wrong':''):'')+'"><kbd>'+("1234"[k])+'</kbd><span class="option-content"><span>'+esc(q.choices[i])+'</span>'+choiceFigure(q,i)+'</span></button>').join('')+'</div>'+
 '<div id="feedback"></div><div class="controls"><button id="prev" '+(session.index===0?'disabled':'')+'>← 前へ</button><button id="home">途中保存して戻る</button><button class="primary" id="next">'+(session.index===session.ids.length-1?'結果を見る':'次へ →')+'</button></div></section>';
 if(answer)feedback(q,answer);
 document.querySelectorAll("[data-choice]").forEach(b=>b.onclick=()=>choose(q,Number(b.dataset.choice)));
 $("#prev").onclick=()=>{if(session.index>0){session.index--;saveSession();renderQ()}};
 $("#home").onclick=()=>{saveSession();home()};
 $("#next").onclick=()=>{if(session.index===session.ids.length-1)finish();else{session.index++;saveSession();renderQ()}};
 window.scrollTo(0,0);
}
function choose(q,i){if(session.answers[q.id])return;session.answers[q.id]={selected:i,correct:i===q.answer,ts:new Date().toISOString()};saveSession();renderQ()}
function feedback(q,a){$("#feedback").innerHTML='<div class="feedback '+(a.correct?"correct":"wrong")+'"><strong>'+(a.correct?"正解":"不正解")+'：'+esc(q.choices[q.answer])+'</strong><p>'+esc(q.explanation)+'</p><h3>完成図・確認図</h3>'+diagram(q,true)+'</div>'}
function finish(){
 if(!session)return;
 let correct=0;const lines=[];
 for(const id of session.ids){
  let q=Q.find(q=>q.id===id),a=session.answers[id];
  if(a){correct+=a.correct?1:0;let h=hist(q);h.push({correct:a.correct,ts:a.ts});progress[id]=h.slice(-30)}
  lines.push('<div class="result-row">'+(a?(a.correct?'○':'×'):'—')+'　'+esc(q.concept)+'　<span class="muted">'+esc(q.id)+'</span></div>');
 }
 store(KEY,progress);let total=session.ids.length,answered=Object.keys(session.answers).length;session=null;saveSession();
 root.innerHTML=header("演習結果",correct+" / "+total+"問 正解（回答済み"+answered+"問）")+
 '<section class="card"><h2>今回の出題</h2>'+lines.join('')+'<div class="controls"><button class="primary" id="return">UML集中演習のホームへ</button></div></section>';
 $("#return").onclick=home;window.scrollTo(0,0);
}
document.addEventListener("keydown",e=>{
 if(!session||!$("#app .answers")||/INPUT|SELECT|TEXTAREA/.test((e.target&&e.target.tagName)||""))return;
 if(/^[1-4]$/.test(e.key)){let b=document.querySelectorAll("[data-choice]")[Number(e.key)-1];if(b&&!b.disabled)b.click()}
 else if(e.key==="ArrowRight")$("#next").click();
 else if(e.key==="ArrowLeft"&&session.index>0)$("#prev").click();
});
if(Q.length!==26||new Set(Q.map(q=>q.id)).size!==26||Q.some(q=>q.choices.length!==4||q.answer<0||q.answer>3))throw Error("UML question validation failed");
home();
})();