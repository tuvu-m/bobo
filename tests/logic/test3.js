// Kiểm tra quầy dạng lưới tự do: chạy script game trong Node với DOM giả.
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[2], 'utf8');
const stub = new Proxy(function () {}, {
  get: (t, p) => p === Symbol.toPrimitive ? () => 0 : p === 'length' ? 0 : p === Symbol.iterator ? [][Symbol.iterator] : stub,
  apply: () => stub, construct: () => stub, set: () => true,
});
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m) } else console.log('ok  ', m) };
function run(save, test) {
  const store = save ? { tiemtra3: save } : {};
  const ctx = {
    console, Math, JSON, Date, Object, Array, Set, Map, Promise, String, Number, Symbol, Proxy, Error,
    setTimeout: () => 0, clearTimeout: () => {}, requestAnimationFrame: () => 0, performance: { now: () => 0 }, devicePixelRatio: 2,
    btoa: s => Buffer.from(s, 'binary').toString('base64'), atob: s => Buffer.from(s, 'base64').toString('binary'), unescape, escape, encodeURIComponent, decodeURIComponent,
    document: { querySelector: () => stub, querySelectorAll: () => [], createElement: () => stub, body: stub, addEventListener: () => {} },
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v) } },
    Image: function () { return {} }, navigator: stub, addEventListener: () => {}, ok,
  };
  ctx.window = ctx; vm.createContext(ctx); vm.runInContext(src + '\n;' + test, ctx); return ctx;
}
const VALID = `const valid=g=>{const seen=new Set();for(const o of g){if(seen.has(o.id))return 'trùng '+o.id;seen.add(o.id);const [w,h]=fpOf(o.id);if(o.c<0||o.r<0||o.c+w>COLS||o.r+h>ROWS)return 'ra ngoài '+o.id}
  const m=Array.from({length:ROWS},()=>Array(COLS).fill(0));for(const o of g){const [w,h]=fpOf(o.id);for(let r=o.r;r<o.r+h;r++)for(let c=o.c;c<o.c+w;c++){if(m[r][c])return 'chồng '+o.id;m[r][c]=1}}return ''};`;

// 1. save mới
run(null, VALID + `
  renderPrep();const ids=S.grid.map(o=>o.id);
  ok(['seal','sugar','ice','trash','hongtra','suadac','s_duongden','den','trang'].every(k=>ids.includes(k))&&!['work','M','L'].some(k=>ids.includes(k)),'save mới: quầy có máy, dụng cụ, trà, sữa, siro, topping; không còn bàn pha và chồng ly');
  ok(!valid(S.grid),'không món nào chồng lên nhau hay ra ngoài quầy '+valid(S.grid));
  ok(S.layout===undefined,'không còn quầy chia khu cũ');
  /* quầy người mới 6×6: dụng cụ và máy ở 2 hàng cuối; nới quầy +2 hàng: đồ dời xuống 2 hàng */
  {const at=id=>{const o=S.grid.find(o=>o.id===id);return o?o.c+','+o.r:'-'};
   ok(S.qrows===6&&ROWS===6&&at('seal')==='4,4'&&at('trash')==='2,4'&&at('hongtra')==='0,0','save mới: quầy 6×6, máy và dụng cụ ở đáy');
   S.money=100000;const pos0=S.grid.map(o=>o.id+'@'+o.c+','+(o.r+2)).sort().join();growCounter();
   ok(S.qrows===8&&ROWS===8&&S.grid.map(o=>o.id+'@'+o.c+','+o.r).sort().join()===pos0&&S.money===20000,'nới quầy 80k: thêm 2 hàng phía trên, đồ dời xuống giữ chỗ so với đáy');
   growCounter();ok(S.qrows===8,'thiếu tiền: không nới được');
   S.money=1e7;growCounter();growCounter();ok(S.qrows===12&&at('seal')==='4,10','nới tới 6×12, máy vẫn ở đáy');growCounter();ok(S.qrows===12,'tối đa 6×12');}
  ok(JSON.stringify(fpOf('hongtra'))==='[1,2]'&&JSON.stringify(fpOf('den'))==='[2,2]'&&JSON.stringify(fpOf('seal'))==='[2,2]','kích thước: trà 1×2, topping 2×2, máy 2×2');
  {const sl=S.grid.find(o=>o.id==='seal'),n0=S.grid.length,st0=(S.stored||[]).length;storeObj(sl);ok(S.grid.includes(sl)&&S.grid.length===n0&&(S.stored||[]).length===st0,'không cất được máy đóng gói vào kho');}
  const h=S.grid.find(o=>o.id==='hongtra'),s=S.grid.find(o=>o.id==='suadac');
  // dời tới chỗ trống
  let p=dropPlan(h,2,0);ok(p&&p.ok&&!p.swap,'dời bình trà tới chỗ trống: được');applyPlan(h,p);ok(h.c===2&&h.r===0,'bình trà đã sang cột 3');
  // đổi chỗ với món cùng cỡ
  p=dropPlan(h,s.c,s.r);ok(p.ok&&p.swap===s,'thả bình trà lên hũ sữa: đổi chỗ');const sc=s.c;applyPlan(h,p);ok(s.c===2&&h.c===sc,'hai món đã đổi chỗ');
  // không đặt chồng lên máy đóng gói
  const w=S.grid.find(o=>o.id==='seal');p=dropPlan(h,w.c,w.r);ok(p&&!p.ok,'thả bình trà lên máy đóng gói: không được');
  // dời máy đóng gói
  {const d=S.grid.find(o=>o.id==='den');p=dropPlan(w,d.c+1,d.r);ok(p&&!p.ok,'máy đè lên hai khay topping một lúc: không được');}
  const ss=S.grid.find(o=>o.id==='s_duongden');storeObj(ss);
  p=dropPlan(w,4,0);ok(p&&p.ok,'máy dời lên hàng trên cùng (chỗ trống): được');applyPlan(w,p);placeFixed(S.grid);ok(SEAL.y<CH,'vị trí máy cập nhật theo lưới');
  ok(!valid(S.grid),'sau khi dời vẫn hợp lệ');
  // cất và bày lại từ kho
  ok(S.stored.includes('s_duongden')&&!S.grid.some(o=>o.id==='s_duongden'),'cất siro vào kho');
  renderPrep();ok(!S.grid.some(o=>o.id==='s_duongden'),'món đã cất không tự lên lại quầy');
  placeAt('s_duongden',5*CW+CW/2,2*CH+CH);ok(S.grid.some(o=>o.id==='s_duongden'&&o.c===5),'bày siro từ kho vào chỗ trống');
  const n0=S.grid.length;placeAt('s_duongden',0,0);ok(S.grid.length===n0,'bày đè lên chỗ đã có món khác cỡ/không hợp lệ: không đổi');
  const sel=S.grid.find(o=>o.id==='sugar');storeObj(sel);ok(S.grid.some(o=>o.id==='sugar'),'không cất được dụng cụ, máy');
  // hết hàng thì gỡ, nhập lại thì về chỗ cũ
  const d=S.grid.find(o=>o.id==='den'),dc=[d.c,d.r];S.stock.den=[];renderPrep();ok(!S.grid.some(o=>o.id==='den'),'hết topping thì gỡ khỏi quầy');
  S.stock.den=[{q:5,e:S.day+3}];renderPrep();const d2=S.grid.find(o=>o.id==='den');ok(d2&&d2.c===dc[0]&&d2.r===dc[1],'nhập lại thì topping về đúng chỗ cũ');
  // chạm máy đóng gói để giao
  startDay();spawn();{const o=target().items[0];Object.assign(o,{size:'M',bs:['hongtra','suadac'],ss:[],ts:[],fs:[],sugar:0,ice:0})}takeCup('M');cup.pours=[{k:'hongtra',amt:.36},{k:'suadac',amt:.36}];cup.fill=.72;trySeal();ok(!!sealing&&sealing.fx===SEAL.x+SEAL.w/2&&sealing.fy<0,'đóng gói: ly từ khung ly to rơi xuống máy');
  const o=hitObj(SEAL.x+SEAL.w/2,SEAL.y+SEAL.h/2);ok(o&&o.id==='seal','chạm vào máy đóng gói trúng đúng máy');
  // ngày bán khẩn cấp: thay bình trà bằng trà mạn
  D=null;startDay(true);const g=LAYG();ok(g.some(o=>o.id==='traman')&&!g.some(o=>o.id==='hongtra'),'ngày khẩn cấp: quầy chỉ có bình trà mạn');ok(!valid(g),'quầy khẩn cấp vẫn hợp lệ');
`);

// 2. save cũ có quầy chia khu -> chuyển sang lưới, giữ thứ tự
const old = JSON.parse(run(null, `globalThis.__S=JSON.stringify(S)`).__S);
delete old.grid; delete old.qrows; old.day = 5; old.layout = { tea: ['suadac', 'hongtra', null, null, null, null, null, null], syrup: ['s_duongden', null, null, null, null, null, null, null, null], top: [null, 'den', 'trang', null, null, null, null, null], foam: [], cup: ['L', 'M'], tool: ['trash', 'ice', 'sugar'] };
run(JSON.stringify(old), VALID + `
  renderPrep();const at=id=>{const o=S.grid.find(o=>o.id===id);return o?o.c+','+o.r:'-'};
  ok(!valid(S.grid),'chuyển save cũ: lưới hợp lệ');
  ok(at('suadac')==='0,0'&&at('hongtra')==='1,0','hàng trà giữ thứ tự cũ');
  ok(at('den')==='2,2'&&at('trang')==='4,2','khay topping giữ thứ tự cũ');
  ok(at('trash')==='0,10'&&at('ice')==='1,10'&&at('sugar')==='2,10'&&at('L')==='-'&&at('M')==='-'&&at('work')==='-','dụng cụ giữ thứ tự cũ ở hàng dưới cùng, không còn chồng ly và bàn pha');
  ok(at('seal')==='4,10','máy đóng gói ở góc dưới phải (gần ngón cái)');
  ok(S.layout===undefined,'bỏ dữ liệu quầy cũ');
`);
const old2 = JSON.parse(run(null, `globalThis.__S=JSON.stringify(S)`).__S);
delete old2.g6;delete old2.qrows;old2.day=5;old2.grid=[{id:'work',c:2,r:2},{id:'seal',c:5,r:2},{id:'M',c:0,r:2},{id:'L',c:1,r:2},{id:'hongtra',c:0,r:0},{id:'suadac',c:1,r:0},{id:'sugar',c:5,r:6},{id:'ice',c:6,r:6},{id:'trash',c:7,r:6}];
run(JSON.stringify(old2), VALID + `
  renderPrep();const at=id=>{const o=S.grid.find(o=>o.id===id);return o?o.c+','+o.r:'-'};
  ok(at('work')==='-'&&at('M')==='-'&&at('L')==='-','save có lưới 8×10 cũ: tự bỏ bàn pha và chồng ly');
  ok(at('hongtra')==='0,0'&&at('suadac')==='1,0'&&at('seal')==='4,10'&&at('trash')==='2,10','chuyển sang lưới 6×12, giữ thứ tự từng loại đồ');ok(!valid(S.grid),'lưới vẫn hợp lệ');ok(S.g6===1,'chỉ chuyển một lần');
`);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
