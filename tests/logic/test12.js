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
(function(){S.recipes.forEach(r=>{if(r.id===1)r.mult=2.6});const R=Math.random;
  const open=()=>{S.day=8;S.evDay=8;S.ev='binhthuong';S.trend={w:1,ids:['s_me','luctra']};['hongtra','suadac','s_duongden'].forEach(k=>S.stock[k]=[{q:99,e:99}]);syncLayout();startDay(),S.q=null;D.next=1e9;D.evPlan=[];D.queue=[];D.walk=[]};
  const cust=(type)=>{spawn(type);const c=D.queue.at(-1);Object.assign(c.items[0],{bs:['hongtra','suadac'],size:'M',ts:[],ss:[],fs:[],sugar:0,ice:0,disc:0,sk:null});c.items.length=1;c.o=c.items[0];c.price=priceOf(c.o);c.p=c.max=999;c.ratio=1;return c};
  const make=(skin)=>{takeCup('M');if(skin)wrapCup(skin);cup.pours=[{k:'hongtra',amt:.36},{k:'suadac',amt:.36}];cup.fill=TARGET;cup.used.hongtra=cup.used.suadac=1;trySeal();for(let i=0;i<40&&sealing;i++){now+=.05;tickDay(.05)}};
  const sk=Object.keys(CUPSKIN).find(inSeason);
  ok(!!sk,'tháng này có ly theo mùa: '+(sk&&CUPSKIN[sk].n));
  ok(Object.keys(CUPSKIN).every(id=>CUPSKIN[id].mo.length&&CUPSKIN[id].up>0),'mỗi ly mùa có tháng và tiền ly');
  const months=new Set(Object.values(CUPSKIN).flatMap(k=>k.mo));ok(months.size===12,'tháng nào cũng có ít nhất một ly mùa');
  open();ok(!seasonCups().length&&!S.grid.some(o=>CUPSKIN[o.id]),'chưa mua giấy bọc: quầy không có xấp giấy');
  S.owned.push(sk);D=null;syncLayout();ok(seasonCups().join()===sk&&S.grid.some(o=>o.id===sk)&&objKind(sk)==='sleeve','đã mua và đang mùa: xấp giấy bọc '+CUPSKIN[sk].sh+' lên quầy');
  const off=Object.keys(CUPSKIN).find(id=>!inSeason(id));S.owned.push(off);ok(!seasonCups().includes(off),'mua rồi nhưng chưa tới mùa ('+CUPSKIN[off].n+'): chưa hiện');
  // giao bằng ly mùa: khách trả thêm
  open();M.random=()=>.9;let c=cust('thuong');const m0=S.money,r0=D.rev;M.random=()=>.3;make(sk);M.random=R;
  ok(D.stars.at(-1)===5&&D.rev-r0===c.price+CUPSKIN[sk].up,'ly mùa: khách trả '+c.price+' + '+CUPSKIN[sk].up+' tiền ly (thu '+(D.rev-r0)+')');
  open();M.random=()=>.9;c=cust('thuong');const r1=D.rev;make(null);M.random=R;ok(D.rev-r1===c.price,'ly thường: không cộng tiền ly');
  // học sinh, xe ôm chê ly mắc
  open();M.random=()=>.9;c=cust('xeom');M.random=()=>.3;make(sk);M.random=R;ok(D.stars.at(-1)===4&&S.reviews.at(-1),'chú xe ôm nhận ly mùa: trừ 1★ (chê ly mắc)');
  // phiếu hiện tiền ly
  open();c=cust('thuong');takeCup('M');wrapCup(sk);ok(cupUp(cup)===CUPSKIN[sk].up&&cup.skin===sk,'chạm giấy bọc: ly được bọc, tính thêm '+fk(cupUp(cup)));wrapCup(sk);ok(!cup.skin&&!cupUp(cup),'chạm lần nữa: tháo giấy bọc');
  useTool('trash');wrapCup(sk);ok(/Chạm ly/.test(toasts.at(-1)),'chưa có ly mà chạm giấy bọc: nhắc lấy ly');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
