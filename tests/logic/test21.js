// Food reviewer, Streamer do nhân viên pha như thường; sự kiện không rơi vào giờ cao điểm.
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
  const addT=(type,order)=>{spawn(type);const c=D.queue.at(-1);c.p=c.max=100;Object.assign(c.items[0],{size:'M',ts:[],fs:[],ss:[],sugar:0,ice:0,sk:null,gem:null},order);c.items.length=1;c.o=c.items[0];return c};
  const fill=(c,i)=>{const it=c.items[i];const k=newCup(it.size);Object.assign(k,{cid:c.id,ix:i,pours:it.bs.map(x=>({k:x,amt:TARGET/it.bs.length})),fill:TARGET,syrups:[...(it.ss||[])],tops:[...it.ts],foams:[...(it.fs||[])],sugar:0,ice:0});return k};
  // 1. Food reviewer, Streamer: nhân viên pha như khách thường (đã bỏ luật đòi chủ tiệm pha)
  hire(1);let c0=setup({bs:['hongtra']});c0.p=c0.max=1e6;until(()=>!D.queue.includes(c0),15);
  let rv=addT('reviewer',{bs:['hongtra']});ok(!rv.items[0].own,'Food reviewer: không còn đánh dấu chủ tiệm pha');
  until(()=>!D.queue.includes(rv),15);ok(!D.queue.includes(rv)&&D.stars.at(-1)===5,'nhân viên pha cho Food reviewer như thường, 5★');
  let sm=addT('streamer',{bs:['hongtra']});until(()=>!D.queue.includes(sm),15);ok(!D.queue.includes(sm)&&!toasts.some(t=>/👑/.test(t)),'nhân viên pha cho Streamer, không có thông báo 👑');
  // 7. sự kiện tới giờ mà đang cao điểm thì chờ qua giờ cao điểm
  D.queue.length=0;D.ev=null;D.pend=[];D.clock=12;D.evPlan=[11];run(.2);ok(rushNow()?!D.ev&&D.evPlan.length===1:true,'giờ cao điểm: sự kiện chưa tới ('+(rushNow()||'không cao điểm')+')');
  D.clock=14.5;D.rate=0;run(.2);ok(!!D.ev||!D.evPlan.length,'qua giờ cao điểm: sự kiện tới');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
