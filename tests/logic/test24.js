// Món nổi tiếng: 12 món không trùng món cơ bản, pha đúng nguyên liệu thì đạt A, tên chuẩn, ghi vào sổ; món tự chế đạt A bán giá cao hơn món nổi tiếng.
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
  ok(FAMOUS.length===12&&FAMOUS.every(F=>F.ids.some(k=>ITEM(k).rare)),'12 món nổi tiếng, món nào cũng có nguyên liệu hiếm');
  S.drinks=Object.keys(BASES).filter(k=>!BASES[k].free);S.syrups=Object.keys(SYRUPS);S.foams=Object.keys(FOAMS);
  const B=basicsList();ok(!FAMOUS.some(F=>B.some(b=>sameSet([...b.bs,...b.ss],F.ids))),'không món nổi tiếng nào trùng món cơ bản (đủ nguyên liệu)');
  syncBasics();ok(S.recipes.some(r=>r.basic),'vẫn còn món cơ bản');
  ok(!(S.famous||[]).length&&!S.recipes.find(r=>r.name==='Trà sữa').famous,'món khởi đầu Trà sữa không phải món nổi tiếng');
  const mk=(bs,ss,fs)=>{const r={id:S.ruid++,name:'X',bs,ss,ts:[],fs,status:'pending',ready:S.day,price:null,on:false,until:null};S.recipes.push(r);inspect(r);return r};
  toasts.length=0;const td=mk(['hongtra','hokkaido'],[],[]);ok(td.famous==='hokkaido'&&td.grade==='A'&&td.mult>=3.3,'Hồng trà + Sữa Hokkaido: Trà sữa Hokkaido, hạng A (món 2 nguyên liệu)');
  ok(S.famous.includes('hokkaido')&&toasts.some(t=>/Món nổi tiếng mới: Trà sữa Hokkaido/.test(t)),'khám phá món mới: ghi vào sổ, có thông báo');
  const n0=S.famous.length;mk(['hongtra','hokkaido'],[],[]);ok(S.famous.length===n0,'pha lại món đã khám phá: không ghi trùng');
  const cr=mk(['suadac','suatuoi'],['b_matcha'],[]);ok(cr.grade==='A'&&!cr.famous,'món tự chế hợp vị vẫn lên A ('+cr.mult+')');
  const d=recMult(cr)-recMult({...cr,famous:'hokkaido'});ok(Math.abs(d-.2)<1e-9,'cùng nguyên liệu: món tự chế đạt A hơn món nổi tiếng 0,2 hệ số giá');
  ok(recW({...td,famous:'hokkaido'})>recW({...td,famous:null}),'món nổi tiếng: khách gọi nhiều hơn');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
