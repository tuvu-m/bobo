// Topping tuỳ thích + quy mô 6 nhân viên: giả lập trọn một ngày.
const fs=require('fs'),vm=require('vm');const src=fs.readFileSync(process.argv[2],'utf8');
const stub=new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?()=>0:p==='length'?0:p===Symbol.iterator?[][Symbol.iterator]:stub,apply:()=>stub,construct:()=>stub,set:()=>true});
let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('FAIL',m)}else console.log('ok  ',m)};
const M=Object.create(Math);const store={};
const ctx={console,Math:M,JSON,Date,Object,Array,Set,Map,Promise,String,Number,Symbol,Proxy,Error,setTimeout:(f)=>{f();return 0},clearTimeout:()=>{},requestAnimationFrame:()=>0,performance:{now:()=>0},devicePixelRatio:2,btoa:s=>s,atob:s=>s,unescape,escape,encodeURIComponent,decodeURIComponent,
document:{querySelector:()=>stub,querySelectorAll:()=>[],createElement:()=>stub,body:stub,addEventListener:()=>{}},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v)}},Image:function(){return{}},navigator:stub,addEventListener:()=>{},ok,M};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src+`;toast=()=>{};
(function(){
  // 1. hạng tự nhiên tối đa A, không ngẫu nhiên
  ok(gradeOf(2.79)==='C'&&gradeOf(2.8)==='B'&&gradeOf(3.3)==='A'&&gradeOf(3.9)==='A','hạng tự nhiên: 2,8 B · 3,3 A · cao hơn nữa vẫn A');
  {const r1={id:-99,name:'x',bs:['hongtra','suadac'],ss:[],ts:[],fs:[]},r2={...r1};inspect(r1);inspect(r2);ok(r1.mult===r2.mult&&r1.grade===r2.grade,'kiểm định 2 lần cùng tổ hợp: cùng hệ số, cùng hạng (không ngẫu nhiên)')}
  // 2. sổ công thức: kiểm định xong nhớ điểm từng cặp
  S.book={};const r={id:S.ruid++,name:'T',bs:['hongtra','suadac'],ss:[],ts:[],fs:[],status:'pending',ready:S.day,price:null,on:false,until:null};S.recipes.push(r);inspect(r);
  ok(S.book[pk('hongtra','suadac')]===pairScore('hongtra','suadac')&&Object.keys(S.book).length===1,'kiểm định Hồng trà + Sữa đặc: sổ nhớ cặp đó ('+S.book[pk('hongtra','suadac')]+')');
  const sy=S.syrups[0]||'s_duongden',g=bookGuess(['hongtra','suadac',sy]);ok(g.unk===2&&g.P.length===3&&g.lo!==g.hi,'ghép thêm '+sy+': 2 cặp chưa biết, hạng dự kiến là một khoảng '+g.lo+'–'+g.hi);
  learnPairs(['hongtra','suadac',sy]);const g2=bookGuess(['hongtra','suadac',sy]);ok(g2.unk===0,'biết hết các cặp: hạng dự kiến '+g2.lo+'–'+g2.hi+(g2.fail?' (trượt)':''));
  {const ci=comboInfo(['hongtra','suadac',sy]),m=multOf(ci.avg,3),G=['C','B','A','S','SS','SSS'],ix=x=>G.indexOf(x);ok(g2.fail||(ix(g2.lo)<=ix(gradeOf(m,3))&&ix(gradeOf(m,3))<=ix(g2.hi)),'hạng thật nằm trong khoảng dự kiến')}
  const bad=Object.entries(PAIRS_TEST={}).length;let kk=null;outer:for(const a of Object.keys(BASES))for(const b of [...Object.keys(SYRUPS)]){if(pairScore(a,b)<=-3){kk=[a,b];break outer}}
  if(kk){S.book[pk(...kk)]=pairScore(...kk);ok(bookGuess(kk).fail,'cặp đã biết kỵ vị (−3): báo trước sẽ không đạt ('+kk.join('+')+')')}
  // 3. save cũ: món hạng S/SS cũ về A (tự nhiên tối đa A), có túi đồ siêu hiếm
  const o=JSON.parse(JSON.stringify(S));delete o.bookV2;delete o.gems;const rr=o.recipes.find(x=>x.id===r.id);rr.mult=3.6;rr.grade='SS';const m2=migrate(o);
  ok(m2.recipes.find(x=>x.id===r.id).grade==='A'&&Array.isArray(m2.gems),'save cũ: món SS cũ về hạng A, có túi đồ siêu hiếm');
  // 3b. đồ siêu hiếm: gắn vào món hạng A thì lên S/SS/SSS, giá trị món tăng; một đồ chỉ gắn một món
  {r.status='ok';r.grade='A';r.mult=3.4;const r2={...JSON.parse(JSON.stringify(r)),id:S.ruid++,name:'T2'};S.recipes.push(r2);S.gems=[{id:1,k:'lavang'},{id:2,k:'kimtuyen'}];
   const v0=recValue(r);r.gem=1;ok(gradeShown(r)==='SS'&&recValue(r)>v0,'gắn Lá vàng 24K: hạng SS, giá trị món '+v0+' → '+recValue(r));
   r2.gem=1;ok(gradeShown(r2)==='SS','món thứ hai cũng trỏ tới đồ đó');S.recipes.forEach(x=>{if(x.gem===1)x.gem=null});r2.gem=1;ok(!gemOf(r)&&gradeShown(r)==='A'&&gradeShown(r2)==='SS','gắn sang món khác thì món cũ về A (một đồ chỉ một món)');
   r2.grade='B';ok(gradeShown(r2)==='B'&&!gemOf(r2),'món không phải hạng A thì đồ không có tác dụng');S.recipes=S.recipes.filter(x=>x!==r2);r.gem=null}
  // 3d. rắc đồ: đơn món có đồ thì ghi o.gem; quên rắc thì −2★ và review nhắc; nhân viên tự rắc
  {D=null;startDay();D.next=1e9;D.queue=[];r.status='ok';r.grade='A';r.on=true;S.gems=[{id:7,k:'lavang'}];r.gem=7;['hongtra','suadac'].forEach(k=>S.stock[k]=[{q:99,e:99}]);
   const o=makeOrder(r);ok(o.gem==='lavang','khách gọi món có Lá vàng: đơn ghi đồ cần rắc');
   const mk=()=>{spawn('thuong');const c=D.queue.at(-1);c.items=[{...o}];c.o=c.items[0];c.price=priceOf(c.o);c.p=c.max=999;return c};
   const full=(it)=>Object.assign(newCup(it.size),{pours:it.bs.map(k=>({k,amt:TARGET/it.bs.length})),fill:TARGET,syrups:[...(it.ss||[])],tops:[...it.ts],foams:[...(it.fs||[])],sugar:it.sugar?SUGAR[it.sugar]:0,ice:it.ice?ICE[it.ice][1]:0});
   let c=mk(),cp=full(c.items[0]);serveCup(c,0,cp,null);let rv=S.reviews.at(-1);ok(c.res[0].s===3&&/quên lá vàng/.test(c.res[0].notes.join())&&/lá vàng/.test(rv.t),'quên rắc: 3★, review: “'+rv.t+'”');
   c=mk();cp=full(c.items[0]);cp.gem='lavang';serveCup(c,0,cp,null);ok(c.res[0].s===5,'có rắc: 5★');
   const L=checks(c.items[0]);ok(L.some(x=>x[6]&&/Lá vàng/.test(x[0])),'phiếu có bước rắc Lá vàng (chạm được)');
   r.gem=null;D=null}
  // 3c. đi chợ: đồ siêu hiếm mỗi loại một cái (tối đa 6), đồ hot −30%, phiếu −15%, hàng hiếm
  {D=null;S.gems=[];S.rare=null;const K={},T={};let gemDup=0;
   for(let i=0;i<400;i++){S.money=1e9;if(S.staff.length<2)S.staff=[genStaff(),genStaff()];S.staff.forEach(x=>x.mood=90);startDay();D.queue=[];D.spawned=D.total;endDay();
     if(S.mkt){K[S.mkt.kind]=(K[S.mkt.kind]||0)+1;if(S.mkt.kind==='gem'){if(S.gems.some(g=>g.k===S.mkt.k))gemDup++;S.gemId=(S.gemId||0)+1;S.gems.push({id:S.gemId,k:S.mkt.k});T[GEMS[S.mkt.k].g]=(T[GEMS[S.mkt.k].g]||0)+1}}}
   ok(K.gem===6&&!gemDup&&S.gems.length===6,'400 ngày: thấy đủ 6 đồ siêu hiếm, không trùng ('+JSON.stringify(T)+'), sau đó không ra nữa');
   ok(K.hot>5&&K.coupon>30&&K.rare>10,'đi chợ còn ra: đồ hot giảm giá '+K.hot+', phiếu giảm giá '+K.coupon+', hàng hiếm '+K.rare);
   const k=S.drinks[0],c0=ITEM(k).cost;S.mkt={kind:'hot',k,d:S.day};ok(buyCost(k)===r1k(c0*.7),'đồ hot: giá nhập −30% ('+c0+' → '+buyCost(k)+')');
   S.mkt={kind:'coupon',d:S.day};ok(buyCost(k)===r1k(c0*.85),'phiếu giảm giá: −15% mọi món');S.mkt={kind:'coupon',d:S.day-1};ok(buyCost(k)===c0,'phiếu hôm qua: hết hiệu lực');S.mkt=null}
  // 4. thanh tra trả tiền ly đúng; đạt thì có bằng
  D=null;S.shop=0;S.five=300;S.life={sales:20e6,tips:0};S.money=5e6;S.loanCash=0;S.examDay=null;S.licDue=null;S.certs=[];S.examIn=0;['hongtra','suadac'].forEach(k=>S.stock[k]=[{q:99,e:99}]);syncLayout();
  r.on=true;r.status='ok';r.grade='A';startExam();ok(D&&D.exam,'mời thanh tra');examSpawn();const c=D.queue[0],o0=c.items[0],pr=priceOf(o0),m0=S.money;
  examServed(c,0,5,[]);ok(S.money===m0+pr&&S.examIn===pr&&D.exam.ok===1&&c.items.length===2,'ly đúng: thanh tra trả '+pr+'đ, gọi ly tiếp');
  D.exam.end='pass';examFinish();ok(S.shop===1&&(S.certs||[]).includes(1),'đạt: lên Ki-ốt nhỏ, có bằng cấp 2');
  S.recipes=S.recipes.filter(x=>x!==r);
})();`,ctx);console.log(fails?fails+' FAILED':'ALL PASSED');
