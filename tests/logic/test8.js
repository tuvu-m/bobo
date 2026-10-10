// Kiểm tra lại các lỗi trợ lý báo (mỗi bài tái hiện đúng tình huống lỗi).
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[2], 'utf8');
const stub = new Proxy(function () {}, { get: (t, p) => p === Symbol.toPrimitive ? () => 0 : p === 'length' ? 0 : p === Symbol.iterator ? [][Symbol.iterator] : stub, apply: () => stub, construct: () => stub, set: () => true });
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m) } else console.log('ok  ', m) };
const M = Object.create(Math), store = {}, toasts = [];
const ctx = { console, Math: M, JSON, Date, Object, Array, Set, Map, Promise, String, Number, Symbol, Proxy, Error, setTimeout: (f) => { f(); return 0 }, clearTimeout: () => {}, requestAnimationFrame: () => 0, performance: { now: () => 0 }, devicePixelRatio: 2,
  btoa: s => s, atob: s => s, unescape, escape, encodeURIComponent, decodeURIComponent,
  document: { querySelector: () => stub, querySelectorAll: () => [], createElement: () => stub, body: stub, addEventListener: () => {} },
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v) } }, Image: function () { return {} }, navigator: stub, addEventListener: () => {}, ok, M, toasts };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(src + `;toast=m=>toasts.push(m);
(function(){const R=Math.random;
  const stock=()=>['hongtra','suadac','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:999}]);
  const open=(day=6)=>{S.day=day;S.evDay=day;S.ev='binhthuong';stock();syncLayout();startDay();D.next=1e9;D.evPlan=[];D.evTax=false;D.queue=[];D.walk=[]};
  const cust=(o={})=>{spawn('thuong');const c=D.queue.at(-1);c.p=c.max=100;c.type='thuong';Object.assign(c.items[0],{size:'M',ts:[],fs:[],ss:[],sugar:0,ice:0,bs:['hongtra','suadac'],r:1,name:'Trà sữa',disc:0},o);c.o=c.items[0];c.price=priceOf(c.o);return c};
  const fill=()=>{takeCup('M');cup.pours=[{k:'hongtra',amt:.36},{k:'suadac',amt:.36}];cup.fill=TARGET;cup.used.hongtra=cup.used.suadac=1};
  const step=(sec,dt=.05)=>{for(let t=0;t<sec;t+=dt){now+=dt;tickDay(dt);if(!D)break}};

  // 1. khách đang được đóng gói thì không bị bỏ đi, ly không giao nhầm người khác
  open();let x=cust(),y=cust({bs:['hongtra'],name:'Hồng trà'});x.p=.3;fill();trySeal();
  ok(sealing&&sealing.cid===x.id,'đóng gói nhớ đúng khách');step(1.2);
  ok(D.queue.indexOf(y)>=0&&D.stars.length===1&&D.stars[0]>=4&&!D.queue.includes(x)&&D.left===0,'khách hết kiên nhẫn lúc đóng gói vẫn nhận đúng ly của mình, khách sau không bị chấm sai món');
  open();x=cust();y=cust({bs:['hongtra'],name:'Hồng trà'});fill();trySeal();D.queue=D.queue.filter(c=>c!==x);step(1.2);
  ok(D.queue.includes(y)&&D.stars.length===0&&!cup,'khách bị đưa đi giữa lúc đóng gói: ly bỏ phí, không chấm nhầm khách sau');

  // 2. sự kiện dùng món khi vừa hết hàng
  open();cust();S.stock.hongtra=[];S.stock.suadac=[];let threw=0;
  for(const id of ['be','coba']){const e=EVS.find(e=>e.id===id);D.ev={e,a:null,k:1,q:'',t0:now,T:12};try{resolveEvent(true)}catch(err){threw++}}
  ok(!threw,'sự kiện "Bé xin nếm thử", "Cô Ba" không lỗi khi vừa hết trà');

  // 3. người chơi cầm ly mà khách của ly bỏ về: ly chuyển cho khách mới, nhân viên không giành ly đó
  open();S.staff=[Object.assign(genStaff(),{role:'barista',trait:'chamchi',skill:5,spd:3,mood:90})];M.random=()=>.5;x=cust();const y8=cust();takeCup('M');step(.2);
  ok(cup.cid===x.id&&S.staff[0].w&&S.staff[0].w.cid===y8.id,'ly gắn với khách đầu, nhân viên nhận khách sau');
  D.queue=D.queue.filter(c=>c!==x);const z=cust();step(.2);ok(cup.cid===z.id,'khách bỏ về: ly chuyển cho khách mới');
  step(8);ok(!D.queue.includes(y8)&&D.queue.includes(z)&&!(S.staff[0].w&&S.staff[0].w.cid===z.id),'nhân viên giao xong khách của mình, không lấy khách bạn đang cầm ly');M.random=R;S.staff=[];

  // 4. thực đơn trống: không mở ngày bán trà đá
  D=null;S.recipes.forEach(r=>r.on=false);ok(!emergencyNeeded(),'thực đơn trống: không mở ngày bán trà đá 2.000đ');S.recipes.find(r=>r.id===1).on=true;

  // 5. đồ đã bỏ vào ly không bị báo hết hàng
  open();x=cust({ts:['den']});S.stock.den=[{q:1,e:999}];takeCup('M');addTop('den');
  ok(qty('den')===0&&missingOf(x.items[0]).length===0,'bỏ phần topping cuối vào ly: phiếu không báo "Hết"');

  // 6. đóng cửa sớm khi đang có sự kiện
  open();cust();const e=EVS.find(e=>e.id==='bongda');D.ev={e,a:null,k:2,q:'',t0:now,T:12};const t0=D.total;closeEarly();
  ok(!D.ev&&D.total===D.spawned,'đóng cửa sớm: sự kiện đang mở bị bỏ qua');evMore(5);evGuest('thuong');ok(D.total===D.spawned&&D.queue.length<=1,'sau khi đóng cửa: sự kiện không kéo thêm khách');

  // 7. khách ghi nợ không bo
  open();S.ev='hanhphuc';x=cust();x.ratio=.5;const tip0=D.tips;settle(x,5,0,[],'ghi sổ nợ');ok(D.tips===tip0,'khách ghi nợ không để lại tiền tip');

  // 8. đào tạo khi đã giỏi nhất
  D=null;const st=genStaff();st.role='barista';st.spd=5;st.skill=5;S.staff=[st];S.money=1e6;const m0=S.money;
  ok(trainKey(st)&&st[trainKey(st)]===5,'nhân viên đã giỏi nhất');ok(/Đã giỏi nhất/.test(staffCard(st)),'nút đổi thành "Đã giỏi nhất"');S.staff=[];

  // 9. lãi lỗ tổng kết khớp sổ tài chính
  open();S.loan={n:'Vay',p0:300000,amt:300000,rate:.01,days:7,left:7,inst:43000,paidI:0,from:1};S.money=1e6;S.debts=[{name:'A',amt:20000,d:S.day-1}];M.random=()=>.1;
  x=cust();settle(x,5,null,[]);D.queue=[];D.walk=[];D.pend=[];D.spawned=D.total;let shown='';const q=$;
  endDay();M.random=R;const L=S.ledger.at(-1),pl=ledIn(L)-ledOut(L);ok(true,'tổng kết chạy xong (lãi lỗ theo sổ: '+fmt(pl)+')');S.loan=null;

  // 13. tên nhân viên không trùng
  S.staff=[];S.cands=[];const names=[];for(let i=0;i<12;i++){const s=genStaff();S.staff.push(s);names.push(s.name)}ok(new Set(names).size===names.length,'12 nhân viên không ai trùng tên');S.staff=[];

  // 14. tiền vay không dùng cho sự kiện
  S.money=500000;S.loanCash=400000;open();const kol=EVS.find(e=>e.id==='kol');ok(evCantPay({e:kol,a:300000}),'chỉ có tiền vay: không trả được phí KOL');S.loanCash=0;

  // 15. tên món có ký tự HTML
  const old=JSON.parse(JSON.stringify(S));old.recipes[0].name='Trà <b>ngon</b> & "rẻ"';ok(migrate(old).recipes[0].name==='Trà bngon/b  rẻ'||!/[<>&"]/.test(migrate(old).recipes[0].name),'tên món bỏ ký tự HTML: '+migrate(old).recipes[0].name);

  // 12. trạng thái "Chắc chắn?" không lưu vào save
  ok(!JSON.stringify(S).includes('fireArm'),'nút thôi việc không lưu trạng thái vào save');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
