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
(function(){const R0=Math.random;
  const open=()=>{S.day=20;S.evDay=20;S.ev='binhthuong';S.shop=2;S.money=5e6;['hongtra','suadac'].forEach(k=>S.stock[k]=[{q:999,e:99}]);syncBasics();S.recipes.forEach(r=>r.on=r.status==='ok'&&r.basic);syncLayout();S.staff=[];startDay();D.next=1e9;D.evPlan=[];D.queue=[];D.walk=[];D.pend=[];ASK_P=1};
  const cust=type=>{M.random=()=>.9;spawn(type);M.random=R0;const c=D.queue.at(-1);c.p=c.max=999;return c};
  const forget=(c,r=.01)=>{let k=0;M.random=()=>k++?R0():r;lostMaybe(c);M.random=R0;return D.pend.at(-1)};
  const tick=s=>{for(let i=0;i<s*20;i++){now+=.05;tickDay(.05)}};
  // học sinh nghèo: 5–10k
  open();let c=cust('hocsinh');let p=forget(c);ok(p&&p.kind==='lost'&&p.v>=5000&&p.v<=10000,'học sinh để quên '+p.item+' trị giá '+fk(p.v)+' (5–10k)');
  ok(renderTicket0.toString().length&&(tkKey='',renderTicket0(),true),'thẻ để quên đồ hiện được');
  let m0=S.money;pendPick(p,'im');ok(S.money-m0===p.v&&/Ỉm/.test(toasts.at(-1)),'không có cảnh sát, ỉm được '+fk(p.v)+': '+toasts.at(-1));
  // trả lại: review 5★
  open();c=cust('thuong');p=forget(c);const f0=S.five,n0=S.reviews.length;pendPick(p,'tra');
  ok(S.five===f0+1&&S.reviews.length===n0+1&&S.reviews.at(-1).s===5,'trả lại: khách viết review 5★: “'+S.reviews.at(-1).t+'”');
  // có cảnh sát chìm trong quán: chắc chắn bị tóm, phạt 50%
  open();const cop=cust('chim');c=cust('hocsinh');p=forget(c);m0=S.money;pendPick(p,'im');
  ok(S.money===m0-r1k(p.v*.5)&&cop.revealed&&/Cảnh sát chìm/.test(toasts.at(-1)),'có cảnh sát chìm: bị tóm, trả lại đồ, phạt '+fk(m0-S.money)+': '+toasts.at(-1));
  // đại gia: tiền triệu, chục triệu; dễ lộ hơn
  open();c=cust('sop');const vs=[];for(let i=0;i<30;i++){D.lostN=0;D.pend=[];vs.push(forget(c).v)}ok(Math.max(...vs)<=Math.max(5000,r1k(dayRev()*2))&&Math.min(...vs)>=Math.min(1e6,r1k(dayRev()*2)),'đồ của đại gia tối đa 2 ngày doanh thu ('+fk(dayRev()*2)+'): '+fk(Math.min(...vs))+' – '+fk(Math.max(...vs)));
  D.pend=[];D.lostN=0;p=forget(c);m0=S.money;M.random=()=>.5;pendPick(p,'im');M.random=R0;ok(S.money<m0&&/camera/.test(toasts.at(-1)),'đại gia (60% lộ dù không có cảnh sát): '+toasts.at(-1));
  D.pend=[];D.lostN=0;p=forget(c);m0=S.money;M.random=()=>.9;pendPick(p,'im');M.random=R0;ok(S.money-m0===p.v,'đại gia, may không lộ: +'+fk(p.v));
  D.pend=[];D.lostN=0;p=forget(c);m0=S.money;pendPick(p,'tra');ok(S.money-m0===r1k(p.v*.1)&&/thưởng/.test(toasts.at(-1)),'trả lại cho đại gia: được thưởng 10%: '+toasts.at(-1));
  // học sinh: không bao giờ lộ nếu không có cảnh sát
  open();c=cust('hocsinh');let lo=0;for(let i=0;i<50;i++){D.pend=[];D.lostN=0;const q=forget(c);M.random=()=>.001;const mm=S.money;pendPick(q,'im');M.random=R0;if(S.money<mm)lo++}ok(!lo,'đồ của học sinh: không có cảnh sát thì không bị lộ');
  // để quá 12 giây: khách quay lại lấy
  open();c=cust('thuong');p=forget(c);m0=S.money;tick(13);ok(!D.pend.length&&S.money===m0&&/quay lại lấy/.test(toasts.at(-1)),'để lâu không chọn: '+toasts.at(-1));
  // xác suất thấp, tối đa 2 lần/ngày, cảnh sát chìm và kẻ quỵt không để quên
  open();c=cust('thuong');M.random=()=>.5;lostMaybe(c);M.random=R0;ok(!D.pend.length,'xác suất thấp (rand .5 > 5%): không quên đồ');
  open();c=cust('thuong');forget(c);forget(c);forget(c);ok(D.lostN===2,'tối đa 2 lần mỗi ngày');
  open();c=cust('chim');forget(c);ok(!D.pend.length,'cảnh sát chìm không để quên đồ');
  // nhân viên tự lo đồ khách quên
  open();const ch=Object.assign(genStaff(),{role:'cashier',trait:'chamchi',mood:90});S.staff=[ch];c=cust('thuong');let n1=S.reviews.length;M.random=()=>.5;staffLost({kind:'lost',c,item:'ví',ic:'👛',v:50000,risk:.05},ch);M.random=R0;
  ok(!D.pend.length&&S.reviews.length===n1+1&&/thật thà/.test(S.reviews.at(-1).t),'có nhân viên chăm chỉ: tự trả đồ, khách review 5★ “'+S.reviews.at(-1).t+'”');
  open();const lz=Object.assign(genStaff(),{role:'cashier',trait:'luoi',mood:90});S.staff=[lz];cust('chim');c=cust('sop');m0=S.money;
  {let k=0;M.random=()=>k++?.01:.01;lostMaybe(c);M.random=R0}
  ok(!D.pend.length&&S.money<m0&&/bị phát hiện/.test(toasts.at(-1))&&lz.mood<90,'nhân viên lười ỉm đồ đại gia, có cảnh sát chìm: tiệm bị phạt 25% ('+fk(m0-S.money)+'): '+toasts.at(-1));
  ok(ACH.some(a=>a.id==='honest3'),'huy hiệu Thật thà');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
