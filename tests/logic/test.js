// Chạy script game trong Node với DOM giả, rồi kiểm tra logic topping-addon.
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[2], 'utf8');

const stub = new Proxy(function () {}, {
  get: (t, p) => p === Symbol.toPrimitive ? () => 0 : p === 'length' ? 0 : p === Symbol.iterator ? [][Symbol.iterator] : stub,
  apply: () => stub, construct: () => stub, set: () => true,
});
function makeStore(init) { const m = { ...init }; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v) }, _m: m } }

function run(saveJson, test) {
  const ctx = {
    console, Math, JSON, Date, Object, Array, Set, Map, Promise, String, Number, Symbol, Proxy, Error,
    setTimeout: () => 0, clearTimeout: () => {}, requestAnimationFrame: () => 0,
    performance: { now: () => 0 }, devicePixelRatio: 2, btoa: s => Buffer.from(s, 'binary').toString('base64'),
    atob: s => Buffer.from(s, 'base64').toString('binary'), unescape, escape, encodeURIComponent, decodeURIComponent,
    document: { querySelector: () => stub, querySelectorAll: () => [], createElement: () => stub, body: stub, addEventListener: () => {} },
    localStorage: makeStore(saveJson ? { tiemtra3: saveJson } : {}),
    Image: function () { return {} }, navigator: stub, addEventListener: () => {},
  };
  ctx.window = ctx; ctx.ok = ok;
  vm.createContext(ctx);
  vm.runInContext(src + '\n;' + test, ctx);
  return ctx;
}

let fails = 0;
var ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m) } else console.log('ok  ', m) };
globalThis.ok = ok;

// 1) Save mới: không có topping trong công thức, khách chọn topping từ quầy, giá cộng thêm
run(null, `
  ok(S.addon===1,'save mới có cờ addon');
  ok(S.recipes.every(r=>r.ts.length===0),'công thức mặc định không có topping');
  startDay();
  let withTop=0,two=0,bad=0,priceOk=true;
  for(let i=0;i<2000;i++){const o=makeOrder();if(o.ts.length)withTop++;if(o.ts.length>1)two++;
    if(o.ts.some(k=>!onCounter(k)))bad++;
    const r=recById(o.r);const exp=r.price+(o.size==='L'?5000:0)+o.ts.reduce((a,k)=>a+topPrice(k),0);if(priceOf(o)!==exp)priceOk=false}
  ok(withTop>900&&withTop<1500,'ngày 1, quầy có 2 topping: khoảng 60% đơn có topping ('+withTop+'/2000)');
  ok(two>0,'có thể gọi nhiều topping ('+two+' đơn có 2 topping)');
  ok(bad===0,'chỉ gọi topping đang bày trên quầy');
  ok(priceOk,'giá đơn = giá món + size + tiền topping');
  ok(topPrice('den')===5000&&topPrice('mochi')===14000,'giá topping: TC đen 5k, mochi 14k');
  S.day=5;let n2=0,n0=0;for(let i=0;i<2000;i++){const o=makeOrder();if(o.ts.length===2)n2++;if(!o.ts.length)n0++}
  ok(n2>0&&n0>400,'ngày 5: có đơn 2 topping ('+n2+') và đơn không topping ('+n0+')');
  S.stock.den=[];S.stock.trang=[];let any=0;for(let i=0;i<300;i++)if(makeOrder().ts.length)any++;
  ok(any===0,'hết hàng topping thì khách không gọi');
  const lab0=labHTML();ok(!lab0.includes('data-lt'),'xưởng chế món không còn hàng Topping');
  ok(thucdonHTML().includes('Giá topping')&&thucdonHTML().includes('data-tpd'),'tab Thực đơn có bảng giá topping (chỉnh được)');
  tab='quay';ok(quayHTML().includes('khoBox')&&quayHTML().includes('Kho'),'tab Quầy luôn có ô Kho');
  ok(quayHTML().includes('1 đồ trên quầy không món nào dùng'),'chỉ đường đen bị tính là đồ thừa, topping thì không');
`);

// 2) Save cũ có công thức chứa topping → bỏ topping, giảm giá, đổi tên tự đặt
const old = JSON.parse(run(null, 'globalThis.__S=JSON.stringify(S)').__S);
delete old.addon;
old.recipes.push({ id: 7, name: 'Hồng trà sữa đặc trân châu đen', bs: ['hongtra', 'suadac'], ss: [], ts: ['den'], fs: [], status: 'ok', mult: 2.9, grade: 'B', price: 25000, on: true, until: null });
old.recipes.push({ id: 8, name: 'Món ruột của tui', bs: ['hongtra'], ss: ['s_duongden'], ts: ['den', 'trang'], fs: [], status: 'ok', mult: 3, grade: 'A', price: 30000, on: true, until: null });
old.ruid = 9;
run(JSON.stringify(old), `
  const a=recById(7),b=recById(8);
  ok(S.addon===1,'save cũ được chuyển (addon=1)');
  ok(a.ts.length===0&&b.ts.length===0,'công thức cũ đã bỏ topping');
  ok(a.name==='Hồng trà sữa đặc','tên tự đặt được đổi lại: '+a.name);
  ok(b.name==='Món ruột của tui','tên người chơi tự đặt giữ nguyên');
  ok(a.price===17000,'giá giảm theo tỉ lệ vốn 5.5k/8k: 25k → '+a.price);
  ok(b.price===14000,'giá giảm theo tỉ lệ vốn 4.5k/10k: 30k → '+b.price);
  ok(S.notice.some(n=>/Topping giờ là món thêm/.test(n.t)),'có thông báo cho người chơi');
  const again=migrate(JSON.parse(JSON.stringify(S)));ok(again.recipes.find(r=>r.id===7).price===17000,'chạy migrate lần 2 không đổi gì');
`);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
