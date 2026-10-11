// Tiền thuê mặt bằng hàng tháng: cuối ngày cuối tháng trong game từ ngày 10, theo cấp, +10% mỗi năm, chủ nhà tăng giá, thiếu tiền thì dồn sang tháng sau.
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
  M.random=R;
  const day=(d,money)=>{S.day=d;['hongtra','suadac','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:9999}]);startDay();D.next=1e9;D.evPlan=[];D.queue=[];if(money!=null)S.money=money;const m0=S.money;D.walk=[];D.pend=[];D.ev=null;cup=null;sealing=null;S.staff=[];endDay();return m0-S.money};
  S.shop=0;S.rentUp=1;S.rentOwe=0;S.loan=null;
  ok(day(9,5e6)===0,'ngày 9: chưa đóng tiền thuê');
  const p10=day(10,5e6);ok(p10===800000,'cuối ngày 10 (hết tháng 2): đóng 800k tiền thuê cấp 1 ('+fk(p10)+')');
  ok((S.ledger.at(-1).spent||{}).matbang===800000,'sổ sách ghi vào mục Mặt bằng');
  ok(day(11,5e6)===0&&day(14,5e6)===0,'giữa tháng: không đóng');
  S.shop=2;ok(day(15,5e7)===6000000,'cấp 3: 6 triệu/tháng');
  S.shop=0;ok(day(65,5e6)===880000,'sang năm thứ hai trong game (ngày 61+): +10% (880k)');
  // thiếu tiền: đóng hết số có, phần thiếu dồn sang tháng sau
  const a=day(20,300000);ok(a===300000&&S.money===0&&S.rentOwe===500000,'thiếu tiền: đóng hết 300k, còn thiếu 500k');
  const b=day(25,5e6);ok(b===1300000&&!S.rentOwe,'tháng sau đóng cả phần thiếu (1,3 triệu)');
  // chủ nhà tăng giá: tăng hẳn tiền thuê các tháng sau
  S.day=30;const e=EVS.find(x=>x.id==='matbang'),r0=rentAmt();e.yes(r0);ok(rentAmt()===r1k(r0*1.15),'đồng ý chủ nhà: tiền thuê +15% ('+fk(r0)+' → '+fk(rentAmt())+')');
  S.rentUp=1;M.random=()=>.1;e.no(r0);ok(Math.abs(rentAmt()-r0*1.05)<1000,'mặc cả được: chỉ +5%');S.rentUp=1;M.random=()=>.9;e.no(r0);ok(Math.abs(rentAmt()-r0*1.25)<1000,'mặc cả hỏng: +25%');M.random=R;S.rentUp=1;
  S.rentNote=0;S.day=12;prepDay();ok(S.rentNote===1&&S.notice.some(n=>/tiền thuê mặt bằng/.test(n.t)),'save cũ: báo một lần về tiền thuê');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
