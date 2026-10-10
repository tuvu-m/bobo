// Giá topping tự đặt: giá vào đơn, khách ít/nhiều gọi theo giá, chê đắt, nút − + ở tab Thực đơn.
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
  S.day=10;S.tops=['den','trang'];['hongtra','suadac','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:99}]);syncBasics();syncLayout();
  const b=topBase('den');ok(topPrice('den')===b&&b===5000,'chưa đặt: giá theo gợi ý ('+b+')');
  const p0=topP('den',['hongtra']);S.tp={den:10000};const p1=topP('den',['hongtra']);S.tp={den:3000};const p2=topP('den',['hongtra']);
  ok(p1<p0*.5&&p2>p0,'giá gấp đôi: khách ít gọi hẳn ('+p0.toFixed(2)+' → '+p1.toFixed(2)+'); giá rẻ: gọi nhiều hơn ('+p2.toFixed(2)+')');
  S.tp={den:8000};const r=S.recipes.find(x=>x.status==='ok'&&x.id>0);const o={r:r.id,size:'M',ts:['den'],bs:r.bs};ok(priceOf(o)===r.price+8000,'giá topping vào tiền đơn ('+priceOf(o)+')');
  S.tp={den:30000};ok(ratioOf(o)>ratioOf({...o,ts:[]}),'topping quá đắt: khách thấy món đắt hơn (tỉ lệ '+ratioOf(o).toFixed(2)+')');
  // đếm topping trung bình mỗi ly theo giá
  const avg=()=>topAvg(['den','trang'].map(k=>topP(k,['hongtra'])));S.tp={};const a0=avg();S.tp={den:15000,trang:15000};const a1=avg();S.tp={den:2000,trang:2000};const a2=avg();
  ok(a1<a0*.6&&a2>a0,'trung bình topping/ly: gợi ý '+a0.toFixed(2)+', đắt '+a1.toFixed(2)+', rẻ '+a2.toFixed(2));
  // nút − + ở tab Thực đơn
  S.tp={};const btn=v=>({target:{closest:()=>({dataset:{tpd:v},disabled:false})}});
  window.prepClick(btn('den:1000'));ok(S.tp.den===6000,'bấm + : giá TC đen 6k');
  window.prepClick(btn('den:-1000'));ok(!('den' in S.tp)&&topPrice('den')===5000,'bấm − về đúng giá gợi ý: bỏ giá tự đặt');
  for(let i=0;i<40;i++)window.prepClick(btn('den:1000'));ok(topPrice('den')===30000,'giá tối đa 30k');
  ok(/data-tpd="den:1000"/.test(tpRow('den'))&&/rất ít gọi/.test(tpRow('den')),'dòng giá topping có nút và mức khách gọi');
  S.tp={};
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
