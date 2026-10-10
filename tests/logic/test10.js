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
(function(){const R=Math.random;
  const stock=()=>['hongtra','suadac','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:999}]);
  const cust=(type,age,sex)=>{spawn(type);const c=D.queue.at(-1);c.age=age;c.sex=sex;c.name=genName(age,sex,TPROF[type]&&TPROF[type].pre);c.p=c.max;c.ratio=1;c.items.forEach(it=>{it.disc=0});return c};
  const open=(day=8)=>{S.day=day;S.evDay=day;S.ev='binhthuong';stock();syncLayout();startDay();D.next=1e9;D.evPlan=[];D.evTax=false;D.queue=[];D.walk=[]};
  // 1. tên theo tuổi và giới, khớp hình
  ['kt1','kt2','kt3','kt4','kt5','kt6','kt7','kt8','kt_ba'].forEach(k=>SPR[k]=SPR[k]||{w:1});
  open();const seen={};let bad=0;
  for(let i=0;i<3000;i++){spawn(pickType());const c=D.queue.pop();if(c.type==='quen')continue;const pre=c.name.split(' ')[0];(seen[c.age]=seen[c.age]||new Set()).add(pre);
    const P=TPROF[c.type]||TPROF.thuong;if(!(P.pre||XUNG[c.age][c.sex]).includes(pre))bad++;
    if(c.spr&&/^kt/.test(c.spr)&&!KTA[c.sex][c.age].includes(c.spr))bad++}
  ok(!bad,'tên khớp tuổi, hình khách chung khớp giới và tuổi ('+bad+' lỗi)');
  ok(['Bé','Em','Bạn','Anh','Chị','Cô','Dì','Chú','Ông','Bà','Bác'].every(p=>Object.values(seen).some(s=>s.has(p))),'đủ cách gọi: '+Object.entries(seen).map(([a,s])=>a+':'+[...s].join('/')).join(' '));
  const names=new Set();for(let i=0;i<500;i++)names.add(genName(wpick(TPROF.thuong.a),pick(['f','m'])));ok(names.size>300,'500 khách thường có '+names.size+' tên khác nhau');
  spawn('reviewer');let c=D.queue.pop();ok(/^(Em|Bạn|Chị) /.test(c.name)&&c.sex==='f','food reviewer (hình nữ) tên nữ: '+c.name);
  spawn('hocsinh');c=D.queue.pop();ok(/^(Em|Bạn) /.test(c.name),'học sinh: '+c.name);
  spawn('xeom');c=D.queue.pop();ok(/^(Chú|Bác) /.test(c.name)&&isOld(c),'xe ôm lớn tuổi: '+c.name);
  spawn('chim');c=D.queue.pop();ok(/^(Chú|Bác|Ông) /.test(c.name)&&isOld(c)&&c.spr==='kt7','cảnh sát chìm lớn tuổi, giả dạng ông tóc bạc: '+c.name);
  ok(!!SPR.kt_ba||typeof SPRSRC.kt_ba==='string','có hình bà tóc bạc');
  // 2. vé số: quay từng giải riêng, lấy giải cao nhất
  const N=200000,cnt={};for(let i=0;i<N;i++){const r=veRoll(0);cnt[r.amt]=(cnt[r.amt]||0)+1}
  const p=a=>(cnt[a]||0)/N,exp={200000:.02,100000:.98*.05,50000:.98*.95*.10,20000:.98*.95*.9*.15,5000:.98*.95*.9*.85*.20};
  ok(Object.entries(exp).every(([a,e])=>Math.abs(p(+a)-e)<.004),'tỉ lệ từng giải đúng kiểu quay riêng lấy cao nhất: '+Object.keys(exp).map(a=>fk(+a)+' '+(p(+a)*100).toFixed(2)+'%').join(', '));
  ok(Math.abs(p(0)-.98*.95*.9*.85*.8*.998)<.005,'không trúng gì: '+(p(0)*100).toFixed(1)+'%');
  ok(Math.abs(p(5e6)-.002)<.0005,'độc đắc cấp 1 (5 triệu): '+(p(5e6)*100).toFixed(2)+'%');
  ok(veRoll(4).amt<=100e6&&VE_JP.join()==='5000000,10000000,25000000,50000000,100000000','độc đắc theo cấp tiệm: '+VE_JP.map(fk).join(', '));
  // 3. ai tặng vé
  open();M.random=()=>.1;const old=cust('thuong','gia','m'),young=cust('thuong','tre','f');settle(old,5,null,[]);settle(young,5,null,[]);M.random=R;
  ok(D.tix.length===1&&D.tix[0].from===old.name,'chỉ khách lớn tuổi tặng vé ('+D.tix.map(t=>t.from).join(',')+')');
  M.random=()=>.1;const x=cust('xeom','gia','m');settle(x,4,null,[]);M.random=R;ok(D.tix.length===2,'chú xe ôm cũng tặng');
  M.random=()=>.1;const g=cust('thuong','gia','f');settle(g,3,null,[]);M.random=R;ok(D.tix.length===2,'3★ thì không tặng');
  // 4. cuối ngày quay số, dò vé cộng tiền, ghi sổ
  D.queue=[];D.walk=[];D.pend=[];D.spawned=D.total;D.ev=null;const day=S.day;endDay();
  const T=S.tix.filter(t=>t.d===day);ok(T.length===2&&T.every(t=>'amt' in t&&!t.seen),'cuối ngày: 2 vé đã quay số, chưa dò');
  T[0].amt=50000;T[0].jp=false;T[1].amt=0;const m0=S.money,L=S.ledger.at(-1),in0=ledIn(L);veOpen(T[0]);veOpen(T[1]);
  ok(S.money===m0+50000&&ledIn(L)===in0+50000&&S.life.veso>=50000,'dò vé trúng 50k: cộng tiền và ghi sổ ngày đó');
  ok(/data-ve="0"/.test(veHTML())&&/\\+50k/.test(veHTML())&&/Trật/.test(veHTML()),'màn tổng kết hiện vé đã dò');
  // 5. bỏ qua màn tổng kết: tự dò giùm
  S.tix.push({k:0,from:'Ông Tư',d:S.day-1,seen:0,amt:20000,jp:false});const m1=S.money;S.notice=[];veFlush();ok(S.money===m1+20000&&/Đã dò giúp 1 vé số: trúng/.test(S.notice[0].t),'chưa dò thì tự dò giùm: '+S.notice[0].t);
  // 6. tab Nguyên liệu tô nổi đồ của thực đơn
  S.day=6;S.drinks=['hongtra','suadac','luctra'];S.tops=['den','trang'];['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:2,e:99}]);syncLayout();S.recipes.forEach(r=>r.on=r.id===1);
  const H=c=>{kcat=c;return menuHTML()},rowOf=(n,c='tea')=>H(c).split('<div class="kit').find(x=>x.includes('<b>'+ITEM(n).name+'</b>'))||'',h=H('tea');
  ok(/^ inmenu/.test(rowOf('hongtra'))&&/Thực đơn/.test(rowOf('hongtra'))&&/🎯/.test(rowOf('hongtra')),'trà của món đang bán: tô nổi, có nhãn và số phần cần');
  ok(!/inmenu/.test(rowOf('luctra'))&&!/mtag/.test(rowOf('luctra')),'trà không dùng: không tô');
  ok(h.indexOf(ITEM('hongtra').name)<h.indexOf(ITEM('luctra').name),'đồ của thực đơn lên đầu mục');
  ok(/oncnt/.test(rowOf('den','top'))&&/Đang bày/.test(rowOf('den','top')),'topping đang bày có nhãn riêng');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
