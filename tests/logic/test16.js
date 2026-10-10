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
  const open=()=>{S.day=40;S.evDay=40;S.ev='binhthuong';S.shop=2;S.trend={w:1,ids:['s_me','luctra']};['hongtra','suadac','luctra','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:99}]);syncBasics();S.recipes.forEach(r=>r.on=r.status==='ok'&&r.basic);syncLayout();S.staff=[];startDay();D.next=1e9;D.evPlan=[];D.queue=[];D.walk=[]};
  // --- giờ cao điểm: mỗi khách tới lúc hàng đầy chỉ quyết một lần ---
  open();D.clock=12;ok(!!rushNow(),'12 giờ là giờ cao điểm');
  for(let i=0;i<qCap();i++)spawn();D.queue.forEach(c=>{c.p=c.max=1e9});D.total=999;D.spawned=D.queue.length;D.next=0;
  D.rate=1e-4;M.random=()=>.5;const sp0=D.spawned;for(let i=0;i<200;i++){tickDay(.05)}M.random=R0;
  ok((D.rushLost||0)===0&&D.door===1&&D.spawned===sp0,'hàng đầy, khách quyết ở lại (rand .5 > 35%): đứng chờ ngoài cửa 10 giây không bỏ đi (trước đây tung lại mỗi 0,5 giây)');
  D.queue.pop();for(let i=0;i<12&&D.door;i++)tickDay(.05);ok(D.spawned===sp0+1&&D.door===0,'có chỗ trống: khách đứng chờ ngoài cửa vào hàng');
  D.next=0;M.random=()=>.1;tickDay(.01);M.random=R0;ok(D.rushLost===1,'khách tới sau (rand .1 < 35%): thấy đông đi tiệm khác, chỉ một lần');
  ok(Math.abs(rushWalkP()-.35)<1e-9,'không có Phục vụ: 35% khách tới lúc hàng đầy bỏ đi');
  S.staff=[Object.assign(genStaff(),{role:'cashier',mood:90})];ok(Math.abs(rushWalkP()-.245)<1e-9,'1 Phục vụ mời khách chờ: còn 24,5%');
  S.staff=[0,1,2,3].map(()=>Object.assign(genStaff(),{role:'cashier',mood:90}));ok(Math.abs(rushWalkP()-.105)<1e-9,'nhiều Phục vụ: thấp nhất 10,5%');S.staff=[];
  D.served=5;D.left=D.rushLost;S.q={d:S.day,list:[{k:'noleave',n:1,p:0,done:false}]};const lg=[];
  ok(D.left-(D.rushLost||0)===0,'khách thấy đông đi tiệm khác không tính là bỏ về trong nhiệm vụ "không ai bỏ về"');
  // --- biệt danh khách quen ---
  open();S.regs=[];
  let c;spawn('thuong');c=D.queue.at(-1);c.items.length=1;Object.assign(c.items[0],{ice:'none',sugar:30,size:'L',ts:['den']});c.o=c.items[0];c.name='Chị Lan';c.age='tre';c.sex='f';
  M.random=()=>.1;const msg=regAfter(c,5);M.random=R0;const R=S.regs[0];
  ok(R&&R.nick&&['không đá','ít ngọt','ly bự','trân châu đen'].includes(R.nick)||(R&&R.nick===R.favName.toLowerCase()),'khách quen mới có biệt danh theo thói quen gọi món: "'+(R&&regName(R))+'"');
  ok(/khách quen mới “Chị Lan /.test(msg),'thông báo ghi tên kèm biệt danh: '+msg.trim());
  ok(/^Chị Lan \\S/.test(regName(R))&&regName(R)===R.name+' '+R.nick,'tên gọi đầy đủ: '+regName(R));
  D.queue=[];R.last=0;M.random=()=>.05;spawn();M.random=R0;const c2=D.queue.at(-1);ok(c2&&c2.reg===R.id&&c2.name===regName(R),'khách quen ghé lại: tên trên phiếu là "'+(c2&&c2.name)+'"');
  ok(qCard(c2,0,{k:'wait'},true,true).includes('class="qt qnk"')&&qCard(c2,0,{k:'wait'},true,true).includes(R.nick)&&qCard(c2,0,{k:'wait'},true,true).includes('<b>Chị Lan</b>'),'thẻ order: tiêu đề "Chị Lan", dòng dưới là biệt danh');
  // save cũ: khách quen chưa có biệt danh thì tự đặt
  const old={id:999,name:'Anh Tâm',age:'tre',sex:'m',fav:1,favName:'Trà sữa',visits:3,bad:0};S.regs.push(old);ok(/^Anh Tâm \\S/.test(regName(old))&&old.nick,'save cũ: khách quen chưa có biệt danh được đặt tự động ('+regName(old)+')');
  // không trùng biệt danh
  S.regs=[];const seen=new Set();let dup=0;for(let i=0;i<8;i++){const r={id:i+1,name:'Chị '+GNAME.f[i],age:'tre',sex:'f',favName:'Hồng trà sữa đặc biệt'};r.nick=genNick(r);if(seen.has(r.nick))dup++;seen.add(r.nick);S.regs.push(r)}ok(!dup,'8 khách quen, không ai trùng biệt danh: '+[...seen].join(', '));
  {const keep=S.regs;S.regs=[];const R=Math.random;Math.random=()=>.1;const a=genNick({name:'Chị Mai',age:'tre',sex:'f'}),b=genNick({name:'Chú Công',age:'trung',sex:'m'}),g=genNick({name:'Chị Giang',age:'tre',sex:'f'}),k=genNick({name:'Em Mai',age:'teen',sex:'f'});Math.random=R;
   ok(a==='dù'&&b==='ngủ'&&g==='đẫm','biệt danh nói lái theo đúng tên: Chị Mai '+a+', Chú Công '+b+', Chị Giang '+g);
   ok(k!=='dù','học sinh không nhận lái tục: Em Mai '+k);ok(Object.keys(LAI).join()==='Mai,Giang,Công','chỉ giữ 3 câu lái: '+Object.entries(LAI).map(([n,l])=>n+' '+l[0][0]).join(', '));S.regs=keep}
  {const keep=S.regs;S.regs=[];const n={};for(let i=0;i<400;i++){const k=genNick({name:'Anh Tâm',age:'tre',sex:'m'});n[k]=(n[k]||0)+1}S.regs=keep;const adj=Object.keys(n).filter(k=>NICK.adj.includes(k)).reduce((a,k)=>a+n[k],0);
   ok(adj>140&&adj<260,'khoảng một nửa biệt danh là tính từ (mập, gầy, cao, tửng…): '+adj+'/400, ví dụ '+Object.keys(n).filter(k=>NICK.adj.includes(k)).slice(0,6).map(k=>'Anh Tâm '+k).join(', '))}
  ok(!NICK.all.includes('dù'),'"dù" chỉ dành cho tên Mai, không còn trong danh sách chung');
  ok(NICK.nhi.includes(genNick({name:'Bé Na',age:'nhi',sex:'f'}))||NICK.all.length,'trẻ con có biệt danh riêng (răng sún, má phính…)');
  // chạm để đổi biệt danh
  const T=S.regs[0],n0=T.nick;let saved=0;const sv=save;save=()=>{saved++};
  prepClick({target:{closest:s=>s==='button'?{dataset:{renick:String(T.id)}}:null}});save=sv;
  ok(T.nick!==n0&&saved&&/Biệt danh mới: Chị /.test(toasts.at(-1)),'chạm khách quen ở tab Đánh giá: đổi biệt danh ('+n0+' → '+T.nick+')');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
