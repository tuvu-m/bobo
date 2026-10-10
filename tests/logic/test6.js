// Kiểm tra sự kiện tiền lớn, thuế 30 ngày, mốc lên cấp, tên tiệm.
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[2], 'utf8');
const stub = new Proxy(function () {}, {
  get: (t, p) => p === Symbol.toPrimitive ? () => 0 : p === 'length' ? 0 : p === Symbol.iterator ? [][Symbol.iterator] : stub,
  apply: () => stub, construct: () => stub, set: () => true,
});
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m) } else console.log('ok  ', m) };
const M = Object.create(Math), store = {}, toasts = [], doc = { title: '' };
const ctx = {
  console, Math: M, JSON, Date, Object, Array, Set, Map, Promise, String, Number, Symbol, Proxy, Error,
  setTimeout: (f) => { f(); return 0 }, clearTimeout: () => {}, requestAnimationFrame: () => 0, performance: { now: () => 0 }, devicePixelRatio: 2,
  btoa: s => s, atob: s => s, unescape, escape, encodeURIComponent, decodeURIComponent,
  document: { querySelector: () => stub, querySelectorAll: () => [], createElement: () => stub, body: stub, addEventListener: () => {}, set title(v) { doc.title = v }, get title() { return doc.title } },
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v) } },
  Image: function () { return {} }, navigator: stub, addEventListener: () => {}, ok, M, toasts, doc,
};
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(src + `;toast=(m)=>toasts.push(m);
(function(){const R=Math.random;
  /* sổ 30 ngày giả, mỗi ngày thu 2 triệu */
  const ledger=(perDay,n=30)=>{S.ledger=[];for(let d=1;d<=n;d++)S.ledger.push({loanIn:0,loanOut:0,d,sales:[{r:1,name:'Trà sữa',n:80,rev:perDay,cost:0}],tips:0,other:0,ev:0,debt:0,spent:{},wages:0,served:80,total:80,avg:4.5,lost:0,money:0})};
  const open=(day)=>{S.day=day;S.evDay=day;S.ev='binhthuong';['hongtra','suadac'].forEach(k=>S.stock[k]=[{q:999,e:9999}]);startDay();D.next=1e9;D.evPlan=[];D.evTax=false};
  const fire=(id,yes,r)=>{if(r!=null)M.random=()=>r;startEvent(id);const v=D.ev;resolveEvent(yes);M.random=R;return v};

  // 1. số tiền sự kiện theo quy mô tiệm
  ledger(2e6);ok(dayRev()===2e6,'doanh thu trung bình/ngày = 2 triệu');
  ok(evAmt(1.5,300000)===3e6,'bồi thường kiện = 1,5 ngày doanh thu = '+fmt(evAmt(1.5,300000)));
  ledger(500e6);ok(evAmt(1.5,300000)===750e6,'tiệm lớn (500 triệu/ngày): bồi thường '+fmt(evAmt(1.5,300000)));
  S.ledger=[];ok(evAmt(1.5,300000)===450000,'chưa có sổ: tính theo 300k/ngày, bồi thường '+fmt(evAmt(1.5,300000)));
  ok(niceMoney(2437123)===2400000&&niceMoney(137000)===140000,'số tiền làm tròn đẹp: 2.437.123 → '+fmt(niceMoney(2437123)));

  // 2. thuế: ngày 30 có thuế lúc 10 giờ, 8% doanh thu 30 ngày
  ledger(2e6);S.money=50e6;S.day=30;S.evDay=30;S.ev='binhthuong';startDay();D.next=1e9;D.evPlan=[];
  ok(D.evTax===true,'ngày 30: có lịch thu thuế');let t=0;while(!D.ev&&t<300){now+=.1;t+=.1;tickDay(.1)}
  ok(D.ev&&D.ev.e.id==='thue'&&D.clock>=10,'thuế tới lúc '+D.clock.toFixed(1)+' giờ');
  ok(D.ev.a===4.8e6,'tiền thuế = 8% × 60 triệu = '+fmt(D.ev.a));
  const m0=S.money;now+=13;tickDay(.05);ok(S.money===m0-4.8e6,'bận không chọn kịp: tự nộp đủ thuế');
  ok((S.spentCat.thue||0)===4.8e6&&/Thuế/.test(CAT.thue),'tiền thuế ghi vào mục Thuế trong báo cáo lãi lỗ');
  open(29);ok(!D.evTax,'ngày 29: không có thuế');
  open(31);for(let i=0;i<300;i++){startEvent();if(D.ev&&D.ev.e.id==='thue')ok(false,'thuế lọt vào sự kiện ngẫu nhiên');D.ev=null}ok(true,'thuế không xuất hiện như sự kiện ngẫu nhiên');
  // khai thiếu: bị phát hiện thì phạt gấp 3, không thì thoát
  open(30);S.money=50e6;let a=fire('thue',false,.1).a;ok(S.money===50e6-a*3,'khai thiếu bị phát hiện: phạt gấp 3 = '+fmt(a*3));
  S.money=50e6;fire('thue',false,.9);ok(S.money===50e6,'khai thiếu không bị phát hiện: không mất tiền');

  // 3. khách đau bụng đòi kiện
  ledger(2e6);open(40);S.money=100e6;let v=fire('daubung',true);ok(S.money===100e6-2e6&&/nhận/.test(toasts.at(-1)),'bồi thường: trả 2 triệu = 1 ngày doanh thu ('+toasts.at(-1)+')');
  S.money=100e6;const r0=S.reviews.length;v=fire('daubung',false,.2);ok(S.money===100e6-4e6&&S.reviews.length===r0+1&&S.reviews.at(-1).s===1,'kệ cho kiện, thua: bồi thường gấp 2 (4 triệu) và 1 review 1★');
  ok(S.ratings.at(-1).w===1,'review thua kiện tính như review thường');
  S.money=100e6;fire('daubung',false,.6);ok(S.money===100e6&&S.reviews.at(-1).s===5,'kệ cho kiện, thắng: không mất tiền, được báo khen');
  S.money=100e6;fire('daubung',false,.9);ok(S.money===100e6,'khách bỏ qua không kiện');
  S.money=1e6;fire('daubung',false,.2);ok(S.money===0,'thua kiện mà không đủ tiền: chỉ mất hết tiền đang có, không âm');

  // 4. chạy mọi sự kiện mới cả hai lựa chọn, nhiều lần, không lỗi
  const ids=['thue','daubung','matbang','kol','trom','datiec','trattu','hoicho'];let err=[],neg=0;
  for(const id of ids)for(const y of [true,false])for(let i=0;i<30;i++){ledger(rnd(2e5,8e7));open(ri(10,200));S.money=rnd(0,5e8);spawn('thuong');
    const e=EVS.find(x=>x.id===id);if(e.cond&&!e.cond())continue;try{fire(id,y)}catch(x){err.push(id+': '+x.message)}if(S.money<0)neg++}
  ok(!err.length,'8 sự kiện mới, cả Có và Không, không lỗi '+[...new Set(err)].join(' | '));
  ok(!neg,'không sự kiện nào làm tiền âm');
  // không đủ tiền: nút Có bị khoá, chọn Có không trừ tiền
  ledger(2e6);open(40);S.money=1e6;startEvent('daubung');ok(evCantPay(D.ev),'thiếu tiền bồi thường: nút Có bị khoá');resolveEvent(true);ok(D.ev&&S.money===1e6,'bấm Có khi thiếu tiền: không trừ, sự kiện vẫn chờ chọn');D.ev=null;
  open(40);S.money=1e6;M.random=()=>.99;startEvent('daubung');now+=13;tickDay(.05);M.random=R;ok(!D.ev&&S.money===1e6,'hết giờ khi thiếu tiền: coi như chọn Không');
  open(30);S.money=1e6;fire('thue',true);ok(S.money===0&&/Chỉ đủ tiền nộp/.test(toasts.at(-1)),'thuế lớn hơn số tiền đang có: nộp hết những gì có ('+toasts.at(-1)+')');
  // đơn đặt tiệc dùng nguyên liệu và thu tiền
  ledger(2e6);open(20);S.stock.hongtra=[{q:30,e:999}];S.stock.suadac=[{q:30,e:999}];const r1=recById(1);r1.price=20000;S.money=0;
  M.random=()=>.99;startEvent('datiec');M.random=R;const o=D.ev.a;o.n=40;resolveEvent(true);ok(qty('hongtra')===0&&S.money===30*20000&&/30\\/40/.test(toasts.at(-1)),'đặt tiệc 40 ly nhưng chỉ đủ hàng 30 ly: thu 600k ('+toasts.at(-1)+')');

  // 5. mốc lên cấp: cấp 5 cần 37.000 review 5★ và 2,5 tỉ
  ok(SHOP[4].five===37000&&SHOP[4].rev===2.5e9&&SHOP[1].rev===10e6,'mốc cấp 2: 10 triệu, cấp 5: 2,5 tỉ + 37.000 review');
  S.shop=3;S.five=36999;S.life={sales:3e9,tips:0};ok(!shopReady(S),'đủ tiền nhưng 36.999 review: chưa lên cấp 5 được');S.five=37000;ok(shopReady(S)&&S.shop===3,'đủ 37.000 review: đủ điều kiện lên cấp 5 (người chơi tự bấm, phí '+SHOP[4].fee/1e6+' triệu)');S.life=null;

  // 6. tên tiệm
  ok(S.shopName==='Bobơ','tên mặc định: Bobơ');
  const old=JSON.parse(JSON.stringify(S));delete old.shopName;ok(migrate(old).shopName==='Bobơ','save cũ không có tên: đặt Bobơ');const o2=JSON.parse(JSON.stringify(S));o2.shopName='Góc Phố';delete o2.nameV2;ok(migrate(o2).shopName==='Bobơ','save có tên mặc định cũ Góc Phố: đổi sang Bobơ');const o3=JSON.parse(JSON.stringify(S));o3.shopName='Góc Phố';o3.nameV2=1;ok(migrate(o3).shopName==='Góc Phố','người chơi tự đặt lại Góc Phố sau này: giữ nguyên');
  tab='trangtri';ok(decoHTML().includes('id="shopName"')&&decoHTML().includes('value="Bobơ"'),'tab Trang trí có ô Tên tiệm');
  S.shopName='Trà "Mèo" <3';ok(decoHTML().includes('Trà &quot;Mèo&quot; &lt;3'),'tên có ký tự đặc biệt được thoát an toàn');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
