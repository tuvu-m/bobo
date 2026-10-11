// Thanh tra kiểm tra đột xuất (2–3 ly, chủ tiệm pha, trượt không trả tiền, trượt 3 lần liền tụt cấp) và giấy bọc ly theo tháng trong game (5 ngày = 1 tháng).
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[2], 'utf8');
const stub = new Proxy(function () {}, {
  get: (t, p) => p === Symbol.toPrimitive ? () => 0 : p === 'length' ? 0 : p === Symbol.iterator ? [][Symbol.iterator] : stub,
  apply: () => stub, construct: () => stub, set: () => true,
});
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m) } else console.log('ok  ', m) };
const toasts = [];
const store = {};
const M = Object.create(Math); // Math riêng để chỉnh random
const ctx = {
  console, Math: M, JSON, Date, Object, Array, Set, Map, Promise, String, Number, Symbol, Proxy, Error,
  setTimeout: () => 0, clearTimeout: () => {}, requestAnimationFrame: () => 0, performance: { now: () => 0 }, devicePixelRatio: 2,
  btoa: s => Buffer.from(s, 'binary').toString('base64'), atob: s => Buffer.from(s, 'base64').toString('binary'), unescape, escape, encodeURIComponent, decodeURIComponent,
  document: { querySelector: () => stub, querySelectorAll: () => [], createElement: () => stub, body: stub, addEventListener: () => {} },
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v) } },
  Image: function () { return {} }, navigator: stub, addEventListener: () => {}, ok, toasts, M,
};
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(src + `
;toast=(m)=>toasts.push(m);
(function(){
  const R=Math.random;
  const hire=(n,o={})=>{S.staff=[];for(let i=0;i<n;i++){const s=genStaff();Object.assign(s,{role:'barista',trait:'chamchi',spd:3,skill:3,mood:80,name:'NV'+(i+1)},o);S.staff.push(s)}};
  /* mở cửa ngày 5 với 1 khách gọi món cố định, chặn khách mới vào */
  const setup=(order)=>{S.day=5;['hongtra','suadac','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:99}]);startDay();D.next=1e9;D.total=99;D.evPlan=[];spawn('thuong');const c=D.queue[0];c.p=c.max=1e6;c.type='thuong';
    Object.assign(c.items[0],{size:'M',ts:[],fs:[],ss:[],sugar:0,ice:0},order);c.items.length=1;c.o=c.items[0];c.price=99000;cup=null;return c};
  const run=(sec,dt=.05)=>{const steps=[];let t=0;for(;t<sec;t+=dt){now+=dt;tickDay(dt);if(!D)break;const A=D.as;if(A&&A.on){const st=ASTEPS[A.i];if(steps[steps.length-1]!==st)steps.push(st)}}return steps};
  const until=(cond,max=20,dt=.05)=>{let t=0;while(t<max&&!cond()){now+=dt;t+=dt;tickDay(dt);if(!D)break}return t};
  M.random=()=>.5;
  const fill=(c,i)=>{const it=c.items[i];const k=newCup(it.size);Object.assign(k,{cid:c.id,ix:i,pours:it.bs.map(x=>({k:x,amt:TARGET/it.bs.length})),fill:TARGET,syrups:[...(it.ss||[])],tops:[...it.ts],foams:[...(it.fs||[])],sugar:it.sugar?SUGAR[it.sugar]:0,ice:it.ice?ICE[it.ice][1]:0,skin:it.sk||null,gem:it.gem||null});return k};
  // 1. tháng trong game
  const mo=d=>{S.day=d;return gameMonth()};ok(mo(1)===1&&mo(5)===1&&mo(6)===2&&mo(56)===12&&mo(61)===1,'5 ngày bán = 1 tháng, 60 ngày một năm');
  S.owned.push('cs_tet');S.day=3;const t1=inSeason('cs_tet');S.day=13;const t2=inSeason('cs_tet');S.day=63;const t3=inSeason('cs_tet');ok(t1&&!t2&&t3,'Ly Tết (tháng 1–2) có mùa ngày 1–10, hết mùa ngày 11, quay lại ngày 61');
  // 2. lên lịch: từ cấp 2, khoảng 15% mỗi ngày
  hire(1);S.shop=0;let c=setup({bs:['hongtra']});const R0=M.random;M.random=()=>.1;startDay();ok(!D.insp,'cấp 1: không có thanh tra đột xuất');
  S.shop=1;startDay();ok(!!D.insp&&D.insp.at>=9&&D.insp.at<=17,'cấp 2: có lịch thanh tra lúc '+(D.insp&&D.insp.at.toFixed(1))+'h');M.random=R;
  let n=0;for(let i=0;i<400;i++){startDay();if(D.insp)n++}ok(n>30&&n<95,'khoảng 1 lần/tuần ('+n+'/400 ngày)');M.random=()=>.5;
  // 3. tới giờ: thanh tra vào, 2–3 ly chủ tiệm pha, nhân viên không đụng
  const go=()=>{startDay();D.next=1e9;D.total=99;D.evPlan=[];D.queue.length=0;D.insp={at:9};D.clock=9.5;D.rate=0;run(.1);return D.queue.find(x=>x.insp)};
  let ic=go();ok(ic&&ic.items.length>=2&&ic.items.length<=3&&ic.items.every(it=>it.own),'thanh tra vào: '+(ic&&ic.items.length)+' ly, đánh dấu chủ tiệm pha');
  ic.x=ic.tx;ic.in=1;run(4);ok(ic.items.every(it=>!it.sj),'nhân viên rảnh vẫn không nhận ly của thanh tra');
  // 4. pha đúng hết: đạt, trả tiền các ly, chuỗi trượt về 0
  S.inspFail=2;let m0=S.money;S.stat=S.stat||{};const ic0=S.stat.inspCup||0;ic.items.forEach((it,i)=>serveCup(ic,i,fill(ic,i),null));
  ok((S.stat.inspCup||0)===ic0+ic.items.length,'mỗi ly pha đúng cho thanh tra đếm vào Sổ sưu tập ('+(S.stat.inspCup||0)+')');
  ok(D.insp.end==='pass'&&S.money-m0===ic.price&&S.inspFail===0&&!D.queue.includes(ic),'pha đúng hết: đạt, trả '+fk(S.money-m0)+', chuỗi trượt về 0');
  // 5. một ly sai (dưới 5★): trượt, không trả tiền
  ic=go();m0=S.money;const k=fill(ic,0);k.sugar=(k.sugar||0)+1;serveCup(ic,0,k,null);
  ok(D.insp.end==='fail'&&S.money===m0&&S.inspFail===1&&!D.queue.includes(ic),'ly sai: trượt, không trả tiền, trượt 1/3');
  // 6. hết giờ: trượt
  ic=go();ic.x=ic.tx;ic.in=1;ic.p=.2;run(.5);ok(D.insp.end==='fail'&&S.inspFail===2,'hết giờ: trượt (2/3)');
  // 7. trượt lần 3 liên tiếp: cuối ngày tụt cấp, thi lại miễn phí
  ic=go();ic.x=ic.tx;ic.in=1;ic.p=.2;run(.5);S.shop=2;S.certs=[1,2];const lv=S.shop;
  D.queue=[];D.walk=[];D.pend=[];D.ev=null;cup=null;sealing=null;S.staff.forEach(s=>{s.w=null;s.job=null});endDay();
  ok(S.shop===lv-1&&upFee(lv)===0&&!(S.certs||[]).includes(lv)&&S.inspFail===0&&S.notice.some(n=>/Trượt kiểm tra đột xuất/.test(n.t)),'trượt 3 lần liền: tụt 1 cấp, mất bằng cấp đó, thi lại miễn phí');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
