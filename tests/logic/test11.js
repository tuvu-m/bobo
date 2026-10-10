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
(function(){S.day=6;S.evDay=6;S.ev='binhthuong';['hongtra','suadac','s_duongden'].forEach(k=>S.stock[k]=[{q:30,e:99}]);syncLayout();startDay();D.next=1e9;D.evPlan=[];D.queue=[];
  spawn('thuong');const c=D.queue.at(-1);Object.assign(c.items[0],{bs:['hongtra','suadac'],size:'M',ts:[],ss:[],fs:[],sugar:0,ice:0});c.o=c.items[0];c.p=c.max=999;
  const pour=(k,sec)=>{startPour(k);for(let t=0;t<sec;t+=.05){now+=.05;tickDay(.05)}stopPour()};
  const t0=qty('hongtra'),m0=qty('suadac');takeCup('M');
  for(let i=0;i<6;i++)pour('hongtra',.15);for(let i=0;i<4;i++)pour('suadac',.1);
  ok(t0-qty('hongtra')===1&&m0-qty('suadac')===1,'một ly: bấm trà 6 lần, sữa 4 lần vẫn chỉ tốn 1 phần trà, 1 phần sữa');
  useTool('trash');takeCup('M');pour('hongtra',.3);pour('suadac',.2);
  ok(t0-qty('hongtra')===2&&m0-qty('suadac')===2,'bỏ ly làm ly khác: tốn thêm 1 phần mỗi loại (trà còn '+qty('hongtra')+')');
  useTool('trash');takeCup('M');startPour('hongtra');stopPour();ok(t0-qty('hongtra')===2,'chạm nhanh mà nước chưa chảy: chưa tính phần');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
