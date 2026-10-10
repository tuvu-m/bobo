// Kiểm tra sự kiện vui + khách quen: chạy script game trong Node với DOM giả.
const fs = require('fs'), vm = require('vm');
const src = fs.readFileSync(process.argv[2], 'utf8');
const stub = new Proxy(function () {}, {
  get: (t, p) => p === Symbol.toPrimitive ? () => 0 : p === 'length' ? 0 : p === Symbol.iterator ? [][Symbol.iterator] : stub,
  apply: () => stub, construct: () => stub, set: () => true,
});
let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m) } else console.log('ok  ', m) };
const store = {};
const ctx = {
  console, Math, JSON, Date, Object, Array, Set, Map, Promise, String, Number, Symbol, Proxy, Error,
  setTimeout: () => 0, clearTimeout: () => {}, requestAnimationFrame: () => 0, performance: { now: () => 0 }, devicePixelRatio: 2,
  btoa: s => Buffer.from(s, 'binary').toString('base64'), atob: s => Buffer.from(s, 'base64').toString('binary'), unescape, escape, encodeURIComponent, decodeURIComponent,
  document: { querySelector: () => stub, querySelectorAll: () => [], createElement: () => stub, body: stub, addEventListener: () => {} },
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v) } },
  Image: function () { return {} }, navigator: stub, addEventListener: () => {}, ok,
};
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(src + `
;(function(){
  // trạng thái: ngày 5, nhiều tiền, có nhân viên, thực đơn có món
  S.day=5;S.money=1000000;S.staff=[genStaff()];S.staff[0].role='barista';
  const fresh=()=>{['hongtra','suadac','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:9999}]);startDay();spawn();spawn();spawn()};

  // 1. chạy mọi sự kiện, cả hai lựa chọn, nhiều lần
  let err=[],empty=[];
  for(const e of EVS)for(const yes of [true,false])for(let i=0;i<25;i++){
    fresh();S.money=Math.max(S.money,500000);
    if(e.id==='quatang'&&!(S.regs||[]).length)S.regs=[{id:999,name:'Chị Test',spr:null,look:makeLook('thuong'),fav:1,favName:'Trà sữa',visits:3,bad:0,last:0}];
    if(e.cond&&!e.cond())continue;
    try{const a=e.arg?e.arg():null;D.ev={e,a,k:1,q:typeof e.q==='function'?e.q(a):e.q,t0:now,T:12};
      if(typeof D.ev.q!=='string'||!D.ev.q)empty.push(e.id+' q');
      resolveEvent(yes);const m=D.log[D.log.length-1]||'';if(!m.includes(': ')||m.endsWith(': '))empty.push(e.id+(yes?' yes':' no'));
      if(!Number.isFinite(S.money))err.push(e.id+' money NaN')}
    catch(x){err.push(e.id+(yes?' yes: ':' no: ')+x.message)}}
  ok(EVS.length>=20,'có '+EVS.length+' sự kiện');
  ok(new Set(EVS.map(e=>e.id)).size===EVS.length,'mã sự kiện không trùng');
  ok(!err.length,'chạy mọi sự kiện cả Có và Không không lỗi '+[...new Set(err)].slice(0,5).join(' | '));
  ok(!empty.length,'mọi kết quả đều có câu thông báo '+[...new Set(empty)].join(','));

  // 2. hết giờ chọn = chọn Không
  fresh();startEvent();ok(!!D.ev,'sự kiện xuất hiện trên phiếu order');
  const t0=D.ev.t0;now=t0+13;tickDay(0);ok(!D.ev&&/Bận quá/.test(D.log.join('|')),'hết 12 giây không chọn: tự bỏ qua');now=0;

  // 3. không lặp lại sự kiện trong 10 lần gần nhất
  S.evLast=[];const seen=[];for(let i=0;i<10;i++){fresh();startEvent();if(D.ev){seen.push(D.ev.e.id);resolveEvent(false)}}
  ok(new Set(seen).size===seen.length,'10 sự kiện liên tiếp không trùng nhau');

  // 4. tần suất: từ ngày 2, khoảng 45% số ngày có sự kiện
  let days=0,withEv=0,tot=0;for(let i=0;i<3000;i++){startDay();days++;if(D.evPlan.length)withEv++;tot+=D.evPlan.length;if(D.evPlan.some(h=>h<9||h>17))err.push('giờ ngoài 9–17')}
  ok(withEv/days>.38&&withEv/days<.52,'tỉ lệ ngày có sự kiện '+(withEv/days*100).toFixed(1)+'%, trung bình '+(tot/days).toFixed(2)+' sự kiện/ngày');
  S.day=1;startDay();ok(D.evPlan.length===0,'ngày 1 không có sự kiện');S.day=5;
  startDay(true);ok(D.evPlan.length===0,'ngày bán trà đá khẩn cấp không có sự kiện');

  // 5. hiệu ứng: ra ngoài, chậm, thu chi vào sổ
  fresh();const m0=S.money;evAway(4);ok(D.away>now&&!frontPeople().some(p=>p.who==='me'),'ra ngoài: chủ tiệm biến khỏi quầy');
  evSlow(40,'Bị chó cắn');ok(D.slowT>now,'bị chó cắn: pha chậm');takeCup('M');pouring='hongtra';const f0=cup.fill;tickDay(1);ok(Math.abs(cup.fill-f0-.27)<.01,'đang chậm: rót 0,27/giây thay vì 0,42');pouring=null;
  const sk0=(S.spentCat||{}).sukien||0;evGain(5000,'x');evPay(10000);ok(S.money===m0+5000-10000&&D.evIn===5000&&S.spentCat.sukien-sk0===10000,'thu 5k, chi 10k ghi đúng sổ');

  // 6. khách quen: tạo, ghé lại, bo, bỏ đi
  S.regs=[];for(let i=0;i<400&&S.regs.length<REG_MAX;i++){startDay();spawn();const c=D.queue[0];if(c.type==='quyt'||c.items.length>1)continue;settle(c,5,null,[])}
  ok(S.regs.length===REG_MAX,'khách 5★ dần thành khách quen, tối đa '+REG_MAX);
  ok(new Set(S.regs.map(r=>r.name)).size===S.regs.length,'không trùng tên khách quen');
  S.day=6;let rc=null;for(let i=0;i<300&&!rc;i++){startDay();spawn();rc=D.queue.find(c=>c.reg)}
  ok(rc&&rc.type==='quen'&&S.regs.some(r=>r.id===rc.reg&&regName(r)===rc.name),'khách quen ghé lại đúng tên');
  ok(/Khách quen · lần ghé thứ/.test(typeLabel(rc)),'phiếu order ghi "Khách quen · lần ghé thứ N"');
  ok(rc.max>(Math.max(24,40-S.day*.8))*1.3,'khách quen chịu chờ lâu hơn');
  const R=S.regs.find(r=>r.id===rc.reg),v0=R.visits,tip0=D.tips;rc.ratio=1;settle(rc,5,null,[]);
  ok(D.tips-tip0>=5000&&R.visits===v0+1,'khách quen 5★ bo thêm 5k, tăng số lần ghé');
  let twice=0;for(let i=0;i<300&&twice<2;i++){S.day++;startDay();spawn();const c=D.queue.find(c=>c.reg===R.id);if(c){settle(c,1,null,[]);twice++}}
  ok(!S.regs.some(r=>r.id===R.id),'phục vụ tệ 2 lần liền: không còn là khách quen');
  // mỗi ngày mỗi khách quen ghé tối đa 1 lần
  startDay();for(let i=0;i<200;i++)spawn();const ids=D.queue.filter(c=>c.reg).map(c=>c.reg);ok(new Set(ids).size===ids.length,'mỗi khách quen ghé tối đa 1 lần/ngày');

  // 7. sổ sách + giao diện
  fresh();evGain(20000,'x');D.queue=[];D.walk=[];D.pend=[];D.spawned=D.total;endDay();
  const L=S.ledger[S.ledger.length-1];ok(L.ev===20000,'sổ ngày có mục thu từ sự kiện');
  ok(finHTML().includes('Sự kiện, may mắn')&&finHTML().includes('Sự kiện bất ngờ'),'tab Tài chính có dòng thu/chi sự kiện');
  ok(rvHTML().includes('Khách quen ('),'tab Đánh giá có danh sách khách quen');
  ok(rvHTML().includes('tg quen'),'review của khách quen có nhãn vàng');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
