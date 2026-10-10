// Giảm độ khó: giới hạn món theo cấp tiệm, mở tab dần, bày quầy theo thực đơn, nhập đủ hàng, thực đơn dạng lưới.
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[2], 'utf8');
const stub = new Proxy(function () {}, { get: (t, p) => p === Symbol.toPrimitive ? () => 0 : p === 'length' ? 0 : p === Symbol.iterator ? [][Symbol.iterator] : stub, apply: () => stub, construct: () => stub, set: () => true });
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m) } else console.log('ok  ', m) };
const M = Object.create(Math), store = {}, toasts = [];
const ctx = { console, Math: M, JSON, Date, Object, Array, Set, Map, Promise, String, Number, Symbol, Proxy, Error, setTimeout: (f) => { f(); return 0 }, clearTimeout: () => {}, requestAnimationFrame: () => 0, performance: { now: () => 0 }, devicePixelRatio: 2,
  btoa: s => s, atob: s => s, unescape, escape, encodeURIComponent, decodeURIComponent,
  document: { querySelector: sel => sel !== '#tbody' ? stub : new Proxy(function () {}, { get: (t, p) => p === 'addEventListener' ? (ev, f) => { if (ev === 'click') ctx.prepClick = f } : stub[p], apply: () => stub, set: () => true }), querySelectorAll: () => [], createElement: () => stub, body: stub, addEventListener: () => {} },
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v) } }, Image: function () { return {} }, navigator: stub, addEventListener: () => {}, ok, M, toasts };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(src + `;toast=m=>toasts.push(m);renderPrep=()=>{};
(function(){const R=Math.random;
  const stock=()=>['hongtra','suadac','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:S.day+3}]);
  const open=(day=12)=>{S.day=day;S.evDay=day;S.ev='binhthuong';stock();syncLayout();startDay();D.next=1e9;D.evPlan=[];D.queue=[];D.walk=[]};
  const cust=(type='thuong',o={})=>{spawn(type);const c=D.queue.at(-1);Object.assign(c.items[0],{bs:['hongtra','suadac'],size:'M',ts:[],ss:[],fs:[],sugar:0,ice:0,disc:0},o);c.items.length=1;c.o=c.items[0];c.price=priceOf(c.o);c.p=c.max=999;c.ratio=1;return c};
  const close=()=>{D.queue=[];D.walk=[];D.pend=[];D.spawned=D.total;D.ev=null;endDay()};
  // 1. màn nhân viên: nhân viên tự pha thì vẫn ở màn quán
  open();S.staff=[Object.assign(genStaff(),{role:'barista',skill:5,spd:4,mood:90})];cust();for(let i=0;i<20&&!S.staff[0].w;i++){now+=.05;tickDay(.05)}
  syncMode();ok(!cup&&!MK&&!!S.staff[0].w,'nhân viên tự pha ly riêng: vẫn ở màn quán (vuốt mèo được)');
  cust();takeCup('M');PV=true;syncMode();ok(MK&&cup.cid===D.queue[1].id,'chạm ly: sang màn pha ly của khách kế tiếp');
  PV=false;syncMode();ok(!MK&&!!cup,'chạm "← Quán": về màn quán, vẫn giữ ly');
  PV=true;syncMode();ok(MK,'chạm thẻ "Ly của bạn": vào pha tiếp');
  S.staff=[];cup=null;syncMode();takeCup('M');PV=true;syncMode();ok(MK,'không có nhân viên: chạm ly là sang màn pha');cup=null;syncMode();ok(!MK&&!PV,'giao xong: về màn quán');
  // 2. nâng cấp dụng cụ
  S.up={};const d0=sealDur();S.money=2e6;buyUpgrade('seal');ok(upLv('seal')===1&&Math.abs(sealDur()/d0-.78)<.01,'máy đóng gói nhanh cấp 1: nhanh hơn 22%');buyUpgrade('seal');ok(upLv('seal')===2,'cấp 2');buyUpgrade('seal');ok(upLv('seal')===2,'tối đa 2 cấp');
  const m0=S.money;buyUpgrade('auto');ok(upLv('auto')===1&&m0-S.money===200000&&(S.spentCat.dungcu||0)>=200000,'mua bình rót tự ngắt 200k, ghi vào mục Nâng cấp dụng cụ');
  open();cust();takeCup('M');startPour('hongtra');for(let i=0;i<60;i++){now+=.05;tickDay(.05)}ok(Math.abs(cup.fill-TARGET)<.001&&!cup.spill,'bình rót tự ngắt: giữ bình lâu vẫn dừng đúng vạch ('+Math.round(cup.fill/TARGET*100)+'%)');
  startPour('suadac');for(let i=0;i<20;i++){now+=.05;tickDay(.05)}stopPour();ok(cup.pours.some(p=>p.k==='suadac'&&p.amt>0)&&!cupMiss(curOrder()),'vẫn thêm được loại thứ hai một chút, ly đạt');
  useTool('trash');close();
  S.up.fridge=0;open(S.day);S.stock.hongtra=[{q:5,e:S.day}];close();ok(!qty('hongtra'),'không tủ lạnh: hàng hết hạn thì bỏ');
  S.money=2e6;buyUpgrade('fridge');open(S.day);S.stock.hongtra=[{q:5,e:S.day}];close();ok(qty('hongtra')===5&&/hạn 1 ngày|hết hạn tối nay/.test(lotInfo('hongtra')),'có tủ lạnh: hàng để thêm được 1 ngày ('+lotInfo('hongtra').replace(/<[^>]+>/g,'')+')');
  const keep=S.stock.hongtra;open(S.day);S.stock.hongtra=keep;close();ok(!qty('hongtra'),'qua hạn thêm 1 ngày nữa thì bỏ');
  // 3. nhiệm vụ trong ngày
  S.q=null;S.day++;prepDay();ok(S.q&&S.q.d===S.day&&S.q.list.length===2&&S.q.list.every(q=>q.n>0&&q.rw>=20000),'mỗi sáng 2 nhiệm vụ: '+S.q.list.map(qText).join(' | '));
  S.q={d:S.day,list:[{k:'cups',n:3,p:0,done:0,rw:30000},{k:'noleave',n:1,p:0,done:0,rw:40000,five:1}]};open(S.day);S.q.d=S.day;
  const mq=S.money,ev0=D.evIn||0;for(let i=0;i<3;i++){const c=cust();settle(c,5,null,[])}
  ok(S.q.list[0].done&&S.money-mq>=30000&&(D.evIn||0)-ev0===30000,'bán đủ 3 ly: xong nhiệm vụ, +30k ghi vào thu sự kiện');
  const f0=S.five;close();ok(S.q.list[1].done&&S.five===f0+1,'không ai bỏ về: xong cuối ngày, thêm 1 review 5★');
  S.q={d:S.day,list:[{k:'top',arg:'den',n:2,p:0,done:0,rw:20000},{k:'combo',n:3,p:0,done:0,rw:20000}]};open(S.day);S.q.d=S.day;
  settle(cust('thuong',{ts:['trang']}),5,null,[]);ok(S.q.list[0].p===0,'topping khác không tính');settle(cust('thuong',{ts:['den']}),5,null,[]);settle(cust('thuong',{ts:['den']}),5,null,[]);ok(S.q.list[0].done&&S.q.list[1].done,'2 ly có TC đen và combo 3 ly 5★: xong cả hai');
  close();ok(S.ledger.at(-1).ev>=40000,'tiền thưởng nằm trong sổ ngày đó');
  // 4. tiệm đối thủ
  S.rival=null;S.rivalLast=0;S.day=20;S.rvDay=0;M.random=()=>.1;rivalTick();M.random=R;ok(S.rival&&S.rival.start===20&&/mở đối diện/.test(S.notice.at(-1).t),'ngày 20: tiệm đối thủ mở ('+S.rival.name+' 😊'+Math.round(S.rival.t*100)+'%)');
  const n0=(()=>{const r=S.rival;S.rival=null;const x=dayRaw();S.rival=r;return x})(),n1=dayRaw();ok(n1<n0,'có đối thủ: khách giảm ('+n0+' → '+n1+')');
  for(let d=0;d<4;d++){open(S.day);for(let i=0;i<4;i++)settle(cust(),5,null,[]);close()}
  ok(!S.rival&&S.rivalLast>0&&S.buzz>=8,'thắng 4 ngày (mọi khách 5★, 100% hài lòng): đối thủ dẹp tiệm, +8 khách hôm sau');
  {S.rival={name:'X',t:.85,start:S.day,w:0,l:0,n:0};const t0=rvTarget(S.rival);S.rival.n=3;ok(rvTarget(S.rival)>t0,'đối thủ mạnh dần mỗi ngày đấu ('+Math.round(t0*100)+'% → '+Math.round(rvTarget(S.rival)*100)+'%)');S.rival.tac='kol';ok(rvTarget(S.rival)>t0+.03,'chiêu KOL: điểm họ cao hơn');S.rival=null}
  {S.rival={name:'X',t:.85,start:S.day,w:0,l:0,n:0,tac:'giam',tacDay:S.day};const n0=(()=>{const r=S.rival;S.rival=null;open(S.day);const x=D.total;close();S.rival=r;return x})();open(S.day);const n1=D.total;close();ok(n1<n0||n0<=4,'chiêu giảm giá: hôm đó mất bớt khách ('+n0+' → '+n1+')');S.rival=null}
  S.rival=null;S.rivalLast=0;S.day=40;S.rvDay=0;S.buzz=0;M.random=()=>.1;rivalTick();M.random=R;for(let d=0;d<4;d++){open(S.day);for(let i=0;i<4;i++)settle(cust(),2,null,[]);close()}
  ok(!S.rival&&S.rvPen>=S.day,'thua 4 ngày: đối thủ ở lại, khách giảm 10% thêm 7 ngày');
  S.rival=null;S.rivalLast=S.day;S.rvDay=0;M.random=()=>.1;rivalTick();M.random=R;ok(!S.rival,'vừa xong một đối thủ: 14 ngày sau mới có đối thủ mới');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
