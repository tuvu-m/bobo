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
  const sk=Object.keys(CUPSKIN).find(inSeason);
  const open=(own=true)=>{S.day=8;S.evDay=8;S.ev='binhthuong';S.trend={w:1,ids:['s_me','luctra']};['hongtra','suadac','s_duongden'].forEach(k=>S.stock[k]=[{q:99,e:99}]);
    S.owned=S.owned.filter(x=>!CUPSKIN[x]);if(own)S.owned.push(sk);D=null;syncLayout();startDay(),S.q=null;D.next=1e9;D.evPlan=[];D.queue=[];D.walk=[];S.staff=[]};
  const cust=(type,rv)=>{M.random=()=>rv;spawn(type);M.random=R;const c=D.queue.at(-1);c.items.length=1;Object.assign(c.items[0],{bs:['hongtra','suadac'],size:'M',ts:[],ss:[],fs:[],sugar:0,ice:0,disc:0});c.o=c.items[0];c.price=priceOf(c.o);c.p=c.max=999;c.ratio=1;return c};
  const make=(skin)=>{takeCup('M');if(skin)wrapCup(skin);cup.pours=[{k:'hongtra',amt:.36},{k:'suadac',amt:.36}];cup.fill=TARGET;cup.used.hongtra=cup.used.suadac=1;trySeal();for(let i=0;i<40&&sealing;i++){now+=.05;tickDay(.05)}};
  open();ok(onCounter(sk),'xấp giấy '+CUPSKIN[sk].sh+' đang bày trên quầy');
  let c=cust('thuong',.1);const o=c.items[0];
  ok(o.sk===sk,'khách thường (xác suất 30%) gọi ly bọc giấy');
  ok(priceOf(o)-priceOf({...o,sk:null})===CUPSKIN[sk].up&&c.price===priceOf(o),'giá order đã gồm tiền giấy bọc '+fk(CUPSKIN[sk].up));
  takeCup('M');cup.pours=[{k:'hongtra',amt:.36},{k:'suadac',amt:.36}];cup.fill=TARGET;cup.used.hongtra=cup.used.suadac=1;
  ok(checks(o).some(x=>x[0]===CUPSKIN[sk].sh&&!x[1]),'phiếu có mục "'+CUPSKIN[sk].sh+'" chưa làm');
  ok(orderNeeds().has(sk),'xấp giấy bọc được viền cam trên quầy');
  const m=cupMiss(o);ok(m&&!m.fatal&&/giấy bọc/.test(m.msg),'chưa bọc: máy báo còn thiếu giấy bọc (bọc thêm là giao được)');
  trySeal();ok(!sealing&&/giấy bọc/.test(toasts.at(-1)),'chạm máy đóng gói khi chưa bọc: máy từ chối');
  wrapCup(sk);ok(checks(o).find(x=>x[0]===CUPSKIN[sk].sh)[1]&&!cupMiss(o)&&!orderNeeds().has(sk),'bọc xong: mục giấy bọc xong, hết viền cam');
  const r0=D.rev;trySeal();for(let i=0;i<40&&sealing;i++){now+=.05;tickDay(.05)}
  ok(D.stars.at(-1)===5&&D.rev-r0===c.price,'giao ly bọc giấy khách gọi: 5★, trả đúng giá order '+fk(c.price)+' (không cộng tiền ly 2 lần), thu '+fk(D.rev-r0));
  // khách không gọi mà mình tự bọc: vẫn cộng tiền ly như cũ
  open();c=cust('thuong',.9);ok(!c.items[0].sk,'khách thường (rand .9): không gọi ly bọc giấy');const r1=D.rev;{const R0=M.random;M.random=()=>.3;make(sk);M.random=R0}ok(D.rev-r1===c.price+CUPSKIN[sk].up,'tự bọc cho khách không gọi (rand .3): trả thêm tiền ly (một nửa khách chịu trả)');
  // học sinh, xe ôm không gọi; hot girl sống ảo rất thích
  open();ok(!cust('xeom',0).items[0].sk,'chú xe ôm không gọi ly bọc giấy');
  open();if(TYPES.hocsinh){ok(!cust('hocsinh',0).items[0].sk,'học sinh không gọi ly bọc giấy')}
  open();ok(cust('songao',.7).items[0].sk===sk,'hot girl sống ảo (75%) gọi ly bọc giấy');
  // chưa mua giấy bọc: không ai gọi
  open(false);ok(!onCounter(sk)&&!cust('songao',0).items[0].sk,'chưa có giấy bọc trên quầy: khách không gọi');
  // nhân viên pha chế tự bọc giấy
  open();S.staff=[Object.assign(genStaff(),{role:'barista',trait:'chamchi',skill:5,spd:3,mood:90})];c=cust('thuong',.1);const r2=D.rev;
  M.random=()=>.5;let st0=null;for(let i=0;i<400&&D.queue.includes(c);i++){now+=.05;tickDay(.05);const w=S.staff[0].w;if(w&&!st0)st0=w.steps.join(',')}M.random=R;
  ok(st0&&/boc,goi$/.test(st0),'nhân viên có bước bọc giấy trước khi đóng gói ('+st0+')');
  ok(!D.queue.includes(c)&&D.stars.at(-1)===5&&D.rev-r2===c.price,'nhân viên giao ly bọc giấy: 5★, đúng giá');
  ok(ASTEP_L.boc==='bọc giấy','thẻ order hiện "bọc giấy" khi nhân viên đang bọc');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
