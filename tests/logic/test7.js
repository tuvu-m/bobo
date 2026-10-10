// Kiểm tra 5 nhân vật mới: chú xe ôm, cảnh sát chìm, đại gia sĩ gái, shipper, hot girl sống ảo.
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[2], 'utf8');
const stub = new Proxy(function () {}, { get: (t, p) => p === Symbol.toPrimitive ? () => 0 : p === 'length' ? 0 : p === Symbol.iterator ? [][Symbol.iterator] : stub, apply: () => stub, construct: () => stub, set: () => true });
let fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m) } else console.log('ok  ', m) };
const M = Object.create(Math), store = {}, toasts = [];
const ctx = { console, Math: M, JSON, Date, Object, Array, Set, Map, Promise, String, Number, Symbol, Proxy, Error, setTimeout: (f) => { f(); return 0 }, clearTimeout: () => {}, requestAnimationFrame: () => 0, performance: { now: () => 0 }, devicePixelRatio: 2,
  btoa: s => s, atob: s => s, unescape, escape, encodeURIComponent, decodeURIComponent,
  document: { querySelector: () => stub, querySelectorAll: () => [], createElement: () => stub, body: stub, addEventListener: () => {} },
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v) } }, Image: function () { return {} }, navigator: stub, addEventListener: () => {}, ok, M, toasts };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(src + `;toast=m=>toasts.push(m);
(function(){const R=Math.random;
  /* thực đơn có 3 món giá khác nhau */
  S.day=10;S.shop=4;['hongtra','suadac','luctra','s_duongden','den','trang','thach'].forEach(k=>S.stock[k]=[{q:999,e:9999}]);S.drinks=['hongtra','suadac','luctra'];S.tops=['den','trang','thach'];syncLayout();
  const mk=(name,bs,price)=>{const r={id:S.ruid++,name,bs,ss:[],ts:[],fs:[],status:'ok',mult:2.6,grade:'B',price,on:true,until:null};S.recipes.push(r);return r};
  S.recipes.forEach(r=>r.on=false);const r1=mk('Rẻ',['luctra'],12000),r2=mk('Vừa',['hongtra','suadac'],25000),r3=mk('Đắt',['hongtra','suadac','luctra'],45000);const fair=()=>[r1,r2,r3].forEach(r=>r.price=recValue(r));fair();
  const open=()=>{S.evDay=S.day;S.ev='binhthuong';startDay();D.next=1e9;D.evPlan=[];D.evTax=false;D.queue=[];D.walk=[]};
  const make=(type)=>{spawn(type);const c=D.queue.at(-1);c.p=c.max;c.ratio=1;return c};

  // 1. đều xuất hiện ngẫu nhiên từ đúng ngày
  open();const seen=new Set();for(let i=0;i<4000;i++)seen.add(pickType());
  ok(['xeom','chim','sigai','shipper','songao'].every(t=>seen.has(t)),'ngày 10: đủ 5 nhân vật mới xuất hiện ngẫu nhiên');
  S.day=1;const s1=new Set();for(let i=0;i<2000;i++)s1.add(pickType());ok(!s1.has('xeom')&&!s1.has('chim')&&!s1.has('sigai'),'ngày 1: chưa có nhân vật mới');S.day=10;

  // 2. đại gia sĩ gái
  open();let c=make('sigai');ok(c.items.length===2&&c.items[0].r===r3.id&&c.items[1].r===r2.id&&c.items.every(o=>o.size==='L')&&c.friends.length===1,'đại gia: 2 món đắt nhất, size L, đi cùng bạn gái');
  ok(c.items.some(o=>o.ts.length>=1),'đại gia: gọi thêm topping');
  r3.price=999000;r2.price=999000;served(c,5,[],null);ok(D.stars.at(-1)===5,'đại gia không bao giờ chê đắt (giá gấp nhiều lần vẫn 5★)');fair();
  open();c=make('sigai');let m0=S.money;served(c,5,[],null);ok(S.money-m0>=c.price*1.5,'đại gia 5★: bo từ 50% giá trở lên (thu '+(S.money-m0)+' / giá '+c.price+')');
  open();c=make('sigai');served(c,3,[],null);ok(D.stars.at(-1)===1&&/mất mặt/.test(S.reviews.at(-1).t),'đại gia 3★: thành 1★ "mất mặt", không bo');

  // 3. chú xe ôm
  open();c=make('xeom');ok(c.items.length===1&&c.items[0].ts.length<=1&&[r1.id,r2.id].includes(c.items[0].r)&&c.pay==='Tiền mặt'&&/^(Chú|Bác) /.test(c.name),'xe ôm: món rẻ, tối đa 1 topping, trả tiền mặt, tên "Chú/Bác…"');
  M.random=()=>.1;open();c=make('xeom');const t0=D.total;served(c,5,[],null);M.random=R;ok(D.total===t0+2&&D.log.some(l=>/anh em xe ôm/.test(l)),'xe ôm 5★: rủ thêm 2 anh em ghé');
  open();c=make('xeom');c.items.forEach(it=>{it.ts=[];const r=recById(it.r);r.price=Math.round(recValue(r)*1.15)});served(c,5,[],null);ok(D.stars.at(-1)===4,'xe ôm nhạy giá: đắt hơn 15% đã chê');fair();

  // 4. cảnh sát chìm
  open();c=make('chim');ok(typeLabel(c)==='Khách thường','cảnh sát chìm trông như khách thường');
  S.staff=[Object.assign(genStaff(),{trait:'tinhy',role:'cashier'})];ok(/nghiêm nghị/.test(typeLabel(c)),'có nhân viên Tinh ý: nhận ra "Khách lạ mặt, dáng nghiêm nghị"');S.staff=[];
  const th=make('quyt');m0=S.money;const caught0=D.caught;thief(th);ok(D.caught===caught0+1&&S.money===m0+th.price+20000&&!D.chase,'có cảnh sát chìm trong tiệm: kẻ quỵt bị bắt ngay, tiệm thu lại tiền + thưởng 20k');
  ok(S.ach&&S.ach.chim,'mở huy hiệu "Có quý nhân"');
  open();c=make('chim');const r0=S.reviews.length;D.queue=D.queue.filter(x=>x!==c);D.left++;review(c,1,['từ chối công an']);ok(S.reviews.at(-1).t==='Từ chối phục vụ cả công an?!','từ chối cảnh sát chìm: review 1★ "Từ chối phục vụ cả công an?!"');

  // 5. shipper
  open();c=make('shipper');ok(c.items.length>=2&&c.items.length<=4+Math.min(2,(S.shop||0)>>1)&&c.friends.length===0,'shipper: lấy 2–4 ly (tiệm lớn thì nhiều hơn), đi một mình');
  m0=D.tips;served(c,4,[],null);ok(D.tips-m0>=5000&&S.ratings.at(-1).w===2,'shipper làm nhanh: bo 5k "giao kịp giờ", review tính gấp đôi');
  open();c=make('shipper');c.p=c.max*.2;served(c,5,[],null);ok(D.stars.at(-1)===4&&/trễ đơn/.test(toasts.at(-1)),'shipper chờ lâu: trừ sao "trễ đơn"');

  // 6. hot girl sống ảo
  open();c=make('songao');ok(c.items[0].ts.length>=2,'hot girl: gọi từ 2 topping trở lên');
  S.buzz=0;served(c,5,[],null);const bz=S.buzz;ok(bz>=2&&bz<=4,'hot girl 5★: đăng story (+'+bz+' khách hôm sau)');
  D=null;S.evDay=S.day;S.ev='binhthuong';const base=(()=>{let t=0;for(let i=0;i<1;i++){}return 0})();startDay();ok(S.buzz===0&&D.log.some(l=>/Story, livestream khen tiệm hút thêm/.test(l)),'hôm sau: thêm khách nhờ story');
  open();c=make('songao');S.regs=[];served(c,2,[],null);ok(S.ratings.at(-1).w===2,'hot girl chê: review tính gấp đôi');

  // 7. biểu tượng tạm và lời nói khi chạm
  open();const icons=['xeom','sigai','shipper','songao','chim'].map(t=>make(t).icon||'');ok(icons.slice(0,4).every(Boolean)&&!icons[4],'nhân vật chưa có hình riêng có biểu tượng nhỏ, riêng cảnh sát chìm thì không ('+icons.join(' ')+')');
  ok(['xeom','chim','sigai','shipper','songao'].every(t=>CHAT[t]&&CHAT[t].length),'có câu nói riêng khi chạm vào');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
