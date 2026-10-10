// Topping tuỳ thích + quy mô 6 nhân viên: giả lập trọn một ngày.
const fs=require('fs'),vm=require('vm');const src=fs.readFileSync(process.argv[2],'utf8');
const stub=new Proxy(function(){},{get:(t,p)=>p===Symbol.toPrimitive?()=>0:p==='length'?0:p===Symbol.iterator?[][Symbol.iterator]:stub,apply:()=>stub,construct:()=>stub,set:()=>true});
let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('FAIL',m)}else console.log('ok  ',m)};
const M=Object.create(Math);const store={};
const ctx={console,Math:M,JSON,Date,Object,Array,Set,Map,Promise,String,Number,Symbol,Proxy,Error,setTimeout:(f)=>{f();return 0},clearTimeout:()=>{},requestAnimationFrame:()=>0,performance:{now:()=>0},devicePixelRatio:2,btoa:s=>s,atob:s=>s,unescape,escape,encodeURIComponent,decodeURIComponent,
document:{querySelector:()=>stub,querySelectorAll:()=>[],createElement:()=>stub,body:stub,addEventListener:()=>{}},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v)}},Image:function(){return{}},navigator:stub,addEventListener:()=>{},ok,M};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src+`;toast=()=>{};
(function(){const R=Math.random;
  // 1. topping: tối đa 2/ly (tiệm cấp 3 trở lên: 3); chỉ gọi topping đang bày và còn hàng
  S.day=10;const avgTop=()=>{startDay();let s=0,mx=0,bad=0;for(let i=0;i<2000;i++){const o=makeOrder();s+=o.ts.length;mx=Math.max(mx,o.ts.length);if(o.ts.some(k=>!onCounter(k)||!qty(k)))bad++}return{a:s/2000,mx,bad}};
  const two=avgTop();
  /* túi bốc thăm: tỉ lệ 0/1/2 topping đúng như bốc độc lập kiểu cũ, chỉ xếp lại thứ tự cho đơn dễ/khó xen kẽ */
  {startDay();const seq=[],exp=[0,0,0];for(let i=0;i<4000;i++){const o=makeOrder();seq.push(o.ts.length);const ids=recIds(recById(o.r)),P=topDist(S.tops.filter(k=>onCounter(k)&&qty(k)>0).map(k=>topP(k,ids)));P.forEach((v,n)=>exp[Math.min(n,2)]+=v/4000)}
   const got=[0,1,2].map(n=>seq.filter(x=>x===n).length/seq.length);
   ok(got.every((g,n)=>Math.abs(g-exp[n])<.02),'tỉ lệ đơn 0/1/2 topping giữ như cũ: '+got.map(x=>Math.round(x*100)+'%').join('/')+' (kiểu cũ '+exp.map(x=>Math.round(x*100)+'%').join('/')+')');
   let zz=0,tt=0;for(let i=1;i<seq.length;i++){if(!seq[i]&&!seq[i-1])zz++;if(seq[i]===2&&seq[i-1]===2)tt++}
   const ez=exp[0]*exp[0]*seq.length,et=exp[2]*exp[2]*seq.length;
   ok(zz<ez*.3,'đơn không topping ít khi liền nhau: '+zz+' lần (bốc ngẫu nhiên thuần khoảng '+Math.round(ez)+')');
   ok(tt<et*.3+3,'đơn 2 topping ít khi liền nhau: '+tt+' lần (bốc ngẫu nhiên thuần khoảng '+Math.round(et)+')')}
  S.qrows=12;S.grid.forEach(o=>o.r+=6);  S.tops=Object.keys(TOPS);S.tops.forEach(k=>S.stock[k]=[{q:99,e:99}]);S.grid=S.grid.filter(o=>objKind(o.id)!=='top');syncLayout();
  const nOn=S.tops.filter(onCounter).length,all=avgTop();
  ok(two.a>.5&&two.a<1.2,'quầy có 2 loại topping: trung bình '+two.a.toFixed(2)+' topping/ly');
  ok(all.a>1.85&&all.a<=2&&all.mx===2,'quầy có '+nOn+' loại topping, tiệm cấp 1: trung bình '+all.a.toFixed(2)+', nhiều nhất '+all.mx+' topping/ly');
  S.shop=2;const big=avgTop();ok(big.a>2.6&&big.a<2.99&&big.mx===3,'tiệm cấp 3: trung bình '+big.a.toFixed(2)+', nhiều nhất '+big.mx+' topping/ly');S.shop=0;
  ok(!two.bad&&!all.bad,'chỉ gọi topping đang bày trên quầy và còn hàng');
  S.tops.slice(0,3).forEach(k=>S.stock[k]=[]);ok(avgTop().bad===0,'topping hết hàng thì không ai gọi');
  // 2. tối đa 6 nhân viên
  S.shop=0;S.five=0;S.life=null;ok(staffMax()===2,'tiệm mới (Xe đẩy): tối đa 2 nhân viên');
  {D=null;const T=[];toast=m=>T.push(String(m));S.money=0;S.loanCash=0;S.examDay=null;S.licDue=null;S.freeUp=null;S.stock.hongtra=[{q:99,e:99}];syncLayout();
  S.five=199;S.life={sales:20e6,tips:0};ok(!shopReady(S),'chưa đủ 200 review 5★: chưa mời thanh tra được');
  S.five=200;ok(shopReady(S)&&S.shop===0,'đủ 200 review + 10 triệu doanh thu: đủ điều kiện nhưng không tự lên cấp');
  const on0=S.recipes.filter(r=>r.on);S.recipes.forEach(r=>r.on=false);ok(!examDish(1),'chưa có món hạng B trở lên đang bán: chưa mời được');
  const rA={id:S.ruid++,name:'Món A',bs:['hongtra'],ss:[],ts:[],fs:[],status:'ok',mult:3.4,grade:'A',price:30000,on:true,until:null};S.recipes.push(rA);ok(examDish(1)===rA&&examDish(4)===rA,'có món hạng A đang bán: đủ cho mọi cấp');
  startExam();ok(!D&&/Thiếu 2 triệu/.test(T.at(-1)),'thiếu tiền phí: chưa mời được ('+T.at(-1)+')');
  S.money=5e6;startExam();ok(D&&D.exam&&D.exam.n===3&&working().length===0&&D.exam.dish===rA,'mời thanh tra: kiểm tra 3 ly, không nhân viên, ly cuối là món hạng A');
  D.exam.end='pass';D.exam.ok=3;examFinish();ok(!D&&S.shop===1&&S.money===3e6&&menuCap()===10&&staffMax()===3&&(S.spentCat||{}).nangcap===2e6,'đạt: trả 2 triệu, lên Ki-ốt nhỏ, 3 nhân viên, 10 món');
  S.five=50000;S.life={sales:120e6,tips:0};S.money=1e9;startExam();ok(!D&&/Mai mời lại/.test(T.at(-1)),'cùng ngày không mời lại được');
  S.examDay=null;startExam();D.exam.end='fail';D.exam.why='hết giờ';examFinish();ok(S.shop===1&&S.examDay===S.day&&S.notice.some(n=>n.bad&&/Chưa đạt .hết giờ/.test(n.t)),'trượt: giữ cấp, không mất tiền, mai mời lại');
  S.examDay=null;startExam();D.exam.end='pass';examFinish();ok(S.shop===2&&!shopReady(S),'doanh thu 120 triệu: lên được Tiệm mặt tiền, chưa đủ cho cấp 4');
  // giấy phép (save cũ): trượt thì xuống 1 cấp, lên lại cấp đó miễn phí
  S.licDue={lv:2,by:S.day};S.examDay=null;startExam();ok(!D,'đang chờ kiểm tra giấy phép: chưa cho thi lên cấp');
  startExam('lic');ok(D&&D.exam.kind==='lic'&&D.exam.n===5,'kiểm tra giấy phép Tiệm mặt tiền: 5 ly');D.exam.end='fail';D.exam.why='hết giờ';examFinish();
  ok(S.shop===1&&S.freeUp===2&&!S.licDue&&upFee(2)===0&&upFee(3)===SHOP[3].fee,'trượt giấy phép: xuống Ki-ốt nhỏ, lên lại Tiệm mặt tiền miễn phí');
  S.money=0;S.examDay=null;startExam();ok(D&&D.exam.lv===2,'không có tiền vẫn thi lại được (miễn phí)');D.exam.end='pass';examFinish();ok(S.shop===2&&S.money===0&&!S.freeUp,'thi lại đạt: lên lại, không trừ tiền');
  S.money=1e9;S.life={sales:3e9,tips:0};for(let k=0;k<6;k++){S.examDay=null;startExam();if(D){D.exam.end='pass';examFinish()}}ok(S.shop===4&&staffMax()===8&&!shopReady(S),'đủ hết: mỗi lần một cấp, lên tới Chuỗi flagship, 8 nhân viên');
  S.recipes=S.recipes.filter(r=>r!==rA);on0.forEach(r=>r.on=true);toast=()=>{}}
  S.life=null;S.shop=0;S.staff=[];S.day=30;S.ratings=Array(40).fill({s:4.5,w:1});const sv=S.staff;S.staff=[genStaff(),genStaff()];S.staff.forEach(x=>x.role='barista');startDay();ok(D.total<=dayCap()&&dayCap()<=39&&D.log.some(l=>/phải đi tiệm khác/.test(l)),'tiệm cấp 1 đông khách: tối đa 30 khách (cuối tuần 39), báo khách bị mất');D=null;
  // 3. số khách theo số Pha chế
  const hire=n=>{S.shop=SHOP.length-1;S.staff=[];for(let i=0;i<n;i++){const s=genStaff();Object.assign(s,{role:'barista',trait:'chamchi',spd:3,skill:3,mood:90,name:'NV'+i});S.staff.push(s)}};
  S.ratings=Array(40).fill({s:4.3,w:1});
  const tot=(n,day)=>{hire(n);S.day=day;let s=0;for(let i=0;i<200;i++){S.evDay=0;startDay();s+=D.total}D=null;return Math.round(s/200)};
  const t0=tot(0,15),t1=tot(1,15),t6=tot(6,15),t6b=tot(6,30);
  ok(t6>t1&&t1>t0&&t6b>=t6-5,'nhiều nhân viên thì đón nhiều khách hơn (khách/ngày, 4.3★): ngày 15: 0 NV '+t0+', 1 NV '+t1+', 6 NV '+t6+' · ngày 30, 6 NV: '+t6b);
  // 4. giả lập trọn một ngày với 6 Pha chế (không lỗi pha), đếm số ly
  const day=(dayN)=>{hire(6);S.day=dayN;S.recipes.forEach(r=>{if(r.id===1)r.price=20000});
    ['hongtra','suadac',...Object.keys(TOPS)].forEach(k=>S.stock[k]=[{q:99999,e:999}]);S.tops=Object.keys(TOPS);syncLayout();
    M.random=()=>.15+R()*.85;S.evDay=dayN;S.ev="binhthuong";startDay();D.evPlan=[];let t=0,stuck=0;
    while(D&&t<3000){now+=.05;t+=.05;
      if(D.pend.length){if(D.pend[0]&&D.pend[0].t0!=null){if(D.pend[0].pick==null)pendPick(D.pend[0],D.pend[0].kind==='close'?'all':D.pend[0].kind==='tam'?'no':D.pend[0].kind==='coin'?'sap':'q0')}else {const p=D.pend.shift();p.c.dec=false;tkKey='';settle(p.c,p.s,p.kind==='bargain'?p.offer:0,p.notes)}}
      if(D.ev)resolveEvent(false);if(D.chase)chaseEnd(true);
      if(cup&&cup.broken){useTool('trash');stuck++}
      tickDay(.05)}
    M.random=R;const L=S.ledger[S.ledger.length-1];return{cups:L.sales.reduce((a,x)=>a+x.n,0),served:L.served,total:L.total,min:t/60}};
  const d15=day(15),d30=day(30);
  ok(d15.cups>=120&&d15.min<=7,'ngày 15, 6 Pha chế: '+d15.cups+' ly ('+d15.served+'/'+d15.total+' khách, '+d15.min.toFixed(1)+' phút chơi)');
  ok(d30.cups>=250&&d30.min<=7,'ngày 30, 6 Pha chế: '+d30.cups+' ly ('+d30.served+'/'+d30.total+' khách, '+d30.min.toFixed(1)+' phút chơi)');
  ok(d30.served/d30.total>.85,'đội 6 người phục vụ kịp hơn 85% khách (phần còn lại chủ yếu là kẻ quỵt)');
})();`,ctx);
console.log(fails?fails+' FAILED':'ALL PASSED');process.exit(fails?1:0);
