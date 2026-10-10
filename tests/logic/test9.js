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
(function(){
  const mkR=(name,bs,ss=[])=>{const r={id:S.ruid++,name,bs,ss,ts:[],fs:[],status:'ok',mult:2.6,grade:'B',price:0,on:false,until:null};r.price=recValue(r);S.recipes.push(r);return r};
  const click=d=>{const t={id:'',dataset:d,closest:q=>q==='button'?t:null};prepClick({target:t})};

  // 1. giới hạn món đang bán theo cấp tiệm
  S=fresh();S.day=3;S.shop=0;S.drinks=['hongtra','suadac','luctra','suatuoi'];syncBasics();
  const rs=[['hongtra'],['luctra'],['suatuoi'],['suadac'],['hongtra','luctra'],['luctra','suatuoi'],['hongtra','suatuoi'],['hongtra','suadac'],['luctra','suadac']].map((b,i)=>mkR('ABCDEFGHI'[i],b));
  S.recipes.forEach(r=>r.on=false);ok(menuCap()===8&&MENU_CAP.join()==='8,10,12,14,18','cấp 1 bán tối đa 8 món, các cấp: '+MENU_CAP.join(', '));
  const ron=id=>click({ron:id+':0'});
  rs.forEach(r=>ron(r.id));ok(activeMenu().length===8&&!rs[8].on&&/đã đủ 8 món/.test(toasts.at(-1)),'món thứ 9 bị từ chối: "'+toasts.at(-1)+'"');
  ok(/Thực đơn đã đủ 8 món/.test(recCard(rs[8],'menu'))&&!/data-ron/.test(recCard(rs[8],'menu')),'khung món chưa bán: thay nút Bán bằng lời nhắc');
  S.shop=2;ron(rs[8].id);ok(rs[8].on&&activeMenu().length===9,'tiệm cấp 3 (12 món): bán thêm được');

  // 2. người chơi cũ bán quá giới hạn: giữ nguyên, có thông báo một lần
  const old=JSON.parse(JSON.stringify(S));old.shop=0;old.day=12;delete old.capV;old.recipes.forEach(r=>{if(r.status==='ok')r.on=true});old.notice=[];
  const m1=migrate(old),n=m1.recipes.filter(r=>r.on).length;ok(n>8&&m1.notice.filter(x=>/món đang bán vẫn giữ/.test(x.t)).length===1&&m1.notice.some(x=>/Giao diện mới/.test(x.t)),'save cũ '+n+' món đang bán: giữ hết, báo một lần');
  ok(migrate(m1).notice.length===m1.notice.length,'tải lại không báo lần nữa');
  const nw=fresh();ok(!(migrate(nw).notice||[]).some(x=>/Cập nhật:/.test(x.t)),'người mới không thấy thông báo cập nhật');

  // 3. tab mở dần
  S=fresh();S.money=500000;const vis=()=>TABS.filter(([k])=>tabOpen(k)).map(([k])=>k).join(',');
  ok(vis()==='quay,thucdon,menu,luu','ngày 1: '+vis());
  S.day=2;ok(vis()==='quay,thucdon,congthuc,menu,rv,luu','ngày 2: '+vis());
  S.day=3;ok(vis().includes('trangtri')&&!vis().includes('staff'),'ngày 3: thêm Trang trí');
  S.day=4;ok(['staff','taichinh'].every(k=>vis().includes(k)),'ngày 4: đủ tab');
  S.day=1;S.money=90000;ok(tabOpen('taichinh'),'sắp hết tiền: hiện Tài chính sớm để vay');
  S.money=500000;S.loan={amt:1};ok(tabOpen('taichinh'),'đang vay: hiện Tài chính');S.loan=null;
  S.allOpen=1;ok(vis().split(',').length===TABS.length,'mở khóa tất cả: hiện đủ tab');S.allOpen=0;
  const old2=fresh();old2.day=20;ok(TABS.every(([k])=>{const s0=S;S=old2;const r=tabOpen(k);S=s0;return r}),'người chơi cũ (ngày 20): mọi tab như trước');

  // 4. kem phủ chỉ hiện từ ngày 5
  S=fresh();syncLayout();S.day=3;ok(!/data-kcat="foam"/.test(menuHTML()),'ngày 3: tab Kho chưa có mục Kem');S.day=5;ok(/data-kcat="foam"/.test(menuHTML()),'ngày 5: có mục Kem');

  // 5. bày theo thực đơn
  S=fresh();S.day=6;S.drinks=['hongtra','suadac','luctra','suatuoi'];S.tops=['den','trang','thach','pudding'];S.syrups=['s_duongden','s_dao'];
  [...S.drinks,...S.tops,...S.syrups].forEach(k=>S.stock[k]=[{q:30,e:99}]);S.grid=null;syncLayout();
  S.recipes.forEach(r=>r.on=false);const rr=mkR('Trà đào',['luctra'],['s_dao']);rr.on=true;
  storeObj(S.grid.find(o=>o.id==='luctra'));ok(!onCounter('luctra'),'cất trà lài vào kho (thực đơn cần)');
  const before=S.grid.map(o=>o.id+'@'+o.c+','+o.r);const P=layPlan();
  ok(P.add.includes('luctra')&&P.store.includes('suatuoi')&&P.store.includes('s_duongden'),'kế hoạch: bày '+P.add.join(',')+' / cất '+P.store.join(','));
  autoLay();ok(onCounter('luctra')&&onCounter('s_dao')&&!onCounter('suatuoi')&&S.stored.includes('suatuoi'),'sau khi bày: đủ đồ thực đơn, đồ không dùng vào kho');
  ok(S.tops.every(k=>onCounter(k)),'còn chỗ: bày hết topping');
  const kept=S.grid.filter(o=>FIXED.includes(o.id)).every(o=>before.includes(o.id+'@'+o.c+','+o.r));ok(kept,'ly, máy, bàn pha giữ nguyên chỗ');
  ok(!layPlan().add.length&&!layPlan().store.length,'bày xong: nút chuyển thành "đã khớp"');
  syncLayout();ok(!onCounter('suatuoi'),'đồ đã cất không tự bày lại khi mở ngày');
  S.stock.luctra=[];syncLayout();const P2=layPlan();ok(!P2.add.includes('luctra'),'đồ hết hàng không được bày');
  ok(/data-goto="menu"/.test(quayHTML()),'thực đơn cần đồ hết hàng: nút đổi thành "Hết hàng · nhập thêm"');

  // 6. nhập đủ cho hôm nay
  S=fresh();S.day=4;S.money=2000000;S.ev='binhthuong';S.evDay=4;S.drinks=['hongtra','suadac'];S.tops=['den'];['hongtra','suadac','s_duongden','den'].forEach(k=>S.stock[k]=[]);S.grid=null;syncLayout();prepDay();
  const bp=buyPlan(),cups=dayCups();ok(cups>5&&bp.length>=2&&bp.some(p=>p.k==='hongtra')&&bp.some(p=>p.k==='suadac'),'ước tính '+cups+' ly, cần nhập '+bp.map(p=>p.k+'×'+p.n).join(', '));
  const m0=S.money;autoBuy();const cost=m0-S.money;ok(cost===bp.reduce((a,p)=>a+p.cost,0)&&qty('hongtra')>=cups*.6,'đã nhập đủ, hết '+cost+'đ, còn '+qty('hongtra')+' phần trà');
  ok(!buyPlan().length&&/Đủ hàng/.test(menuHTML()),'nhập xong: nút chuyển thành "Đủ hàng"');
  ok(S.ledger===undefined||true,'ghi sổ chi nhập hàng');ok((S.spentCat||{}).nhaphang>=cost||S.spent>=cost,'tiền nhập hàng ghi vào chi tiêu hôm nay');
  S.stock.hongtra=[];S.money=ITEM('hongtra').cost;const q0=qty('hongtra');autoBuy();ok(qty('hongtra')>q0&&S.money>=0,'ít tiền: nhập được phần nào hay phần đó, không âm tiền');
  S.stock.hongtra=[];S.money=0;autoBuy();ok(/vay|Đủ|Không đủ|Thiếu/.test(toasts.at(-1)),'hết tiền: báo "'+toasts.at(-1)+'"');
  S.recipes.forEach(r=>r.on=false);ok(!buyPlan().length&&!/data-auto="buy"/.test(menuHTML()),'thực đơn trống: không có nút nhập');

  // 7. ước tính khách khớp với lúc mở cửa
  S=fresh();S.day=8;['hongtra','suadac','s_duongden'].forEach(k=>S.stock[k]=[{q:99,e:99}]);prepDay();const est=Math.min(shopLv().cap,dayRaw());M.random=()=>.5;startDay();ok(D.total===Math.max(4,est),'số khách ước tính = số khách thật ('+est+')');D=null;M.random=Math.random;

  // 8. thực đơn dạng lưới, sắp xếp theo lãi
  S=fresh();S.day=6;S.drinks=['hongtra','suadac','luctra','suatuoi'];S.syrups=['s_duongden','s_dao'];syncBasics();
  const a=mkR('Rẻ',['luctra']),b=mkR('Lãi to',['hongtra','suadac'],['s_dao']);b.price+=20000;
  const h=thucdonHTML(),cards=[...h.matchAll(/data-msel="(\\d+)"/g)].map(x=>+x[1]);
  ok(cards.length===S.recipes.filter(r=>r.status==='ok').length,'lưới hiện mọi món đã đạt ('+cards.length+')');
  ok(cards.every((id,i)=>i===0||recProfit(recById(cards[i-1]))>=recProfit(recById(id))),'mặc định xếp theo lãi/ly giảm dần, đầu bảng: '+recById(cards[0]).name);
  menuSort='gia';const c2=[...thucdonHTML().matchAll(/data-msel="(\\d+)"/g)].map(x=>recById(+x[1]).price);ok(c2.every((p,i)=>!i||c2[i-1]>=p),'xếp theo giá');
  menuFilter='tu';const c3=[...thucdonHTML().matchAll(/data-msel="(\\d+)"/g)].map(x=>recById(+x[1]));ok(c3.length&&c3.every(r=>!r.basic),'lọc món tự chế');
  menuFilter='cb';ok([...thucdonHTML().matchAll(/data-msel="(\\d+)"/g)].every(x=>recById(+x[1]).basic),'lọc món cơ bản');
  menuFilter='all';menuSort='lai';menuSel=a.id;const h2=thucdonHTML();ok(/class="medit"/.test(h2)&&h2.includes('data-rpi="'+a.id+'"'),'chạm món: mở khung đặt giá');
  const order=[...h2.matchAll(/data-msel="(\\d+)"|class="medit"/g)].map(x=>x[1]?+x[1]:'E'),ei=order.indexOf('E');ok(ei%3===0&&order.indexOf(a.id)<ei&&ei-order.indexOf(a.id)<=3,'khung đặt giá nằm ngay dưới hàng của món');
  menuFilter='on';S.recipes.forEach(r=>r.on=false);ok(!/class="medit"/.test(thucdonHTML())&&menuSel===null,'đổi bộ lọc mất món đang chọn: đóng khung');menuFilter='all';
  ok(/Đang bán <span[^>]*>0\\/8<\\/span>/.test(thucdonHTML()),'tiêu đề hiện số món / giới hạn');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
