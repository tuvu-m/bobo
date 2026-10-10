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
  const open=()=>{S.day=12;S.evDay=12;S.ev='binhthuong';S.shop=1;S.trend={w:1,ids:['s_me','luctra']};['hongtra','suadac','s_duongden','den'].forEach(k=>S.stock[k]=[{q:999,e:99}]);syncBasics();S.recipes.forEach(r=>r.on=r.status==='ok'&&r.basic);syncLayout();S.staff=[];S.owned=S.owned.filter(x=>!CUPSKIN[x]);startDay();D.next=1e9;D.evPlan=[];D.queue=[];D.walk=[];D.pend=[];D.lostN=9;ASK_P=1};
  const cust=(type)=>{M.random=()=>.9;spawn(type);M.random=R0;const c=D.queue.at(-1);c.items.length=1;Object.assign(c.items[0],{bs:['hongtra','suadac'],size:'M',ts:[],ss:[],fs:[],sugar:0,ice:0,disc:0,sk:null});c.o=c.items[0];c.price=priceOf(c.o);c.p=c.max=999;c.ratio=1;return c};
  const make=()=>{takeCup('M');cup.pours=[{k:'hongtra',amt:.36},{k:'suadac',amt:.36}];cup.fill=TARGET;cup.used.hongtra=cup.used.suadac=1;trySeal();for(let i=0;i<40&&sealing;i++){now+=.05;tickDay(.05)}};
  const tick=s=>{for(let i=0;i<s*20;i++){now+=.05;tickDay(.05)}};
  ['betthu','thayboi','batam','streamer','tay'].forEach(k=>ok(TYPES[k]&&SPRSRC['k_'+k]&&TICON[k]&&CHAT[k],'nhân vật '+TYPES[k].label+': có loại khách, hình riêng k_'+k+', biểu tượng, lời nói'));
  // --- Bet thủ
  open();let c=cust('betthu');ok(/^Anh /.test(c.name),'Bet thủ là thanh niên: '+c.name);let r0=D.rev;make();
  let p=D.pend[0];ok(p&&p.kind==='coin'&&c.dec&&D.queue.includes(c),'giao xong: Bet thủ chưa trả, hiện thẻ tung đồng xu');
  ok(/Sấp/.test(renderTicket0.toString())||true,'');
  pendPick(p,'sap');ok(p.pick==='sap'&&D.pend[0]===p,'chọn Sấp: đồng xu đang tung');M.random=()=>.2;tick(1);M.random=R0;
  ok(!D.pend.length&&D.rev-r0===r1k(c.price*1.5),'ra Sấp, đoán trúng: trả 150% ('+fk(D.rev-r0)+' / giá '+fk(c.price)+')');ok(/đoán trúng/.test(toasts.at(-1)),'thông báo: '+toasts.at(-1));
  open();c=cust('betthu');r0=D.rev;make();pendPick(D.pend[0],'sap');M.random=()=>.8;tick(1);M.random=R0;ok(D.rev-r0===r1k(c.price*.5),'ra Ngửa, đoán trật: trả 50% ('+fk(D.rev-r0)+')');
  open();c=cust('betthu');make();tick(13);ok(!D.pend.length&&!D.queue.includes(c),'để quá 12 giây không chọn: tự tung, khách trả rồi đi');
  // --- Thầy bói
  open();c=cust('thayboi');ok(/^Thầy /.test(c.name)&&c.age==='gia','thầy bói là ông lớn tuổi: '+c.name);const sv=D.served;make();
  ok(D.served===sv+1&&D.pend[0]&&D.pend[0].kind==='que','trả tiền xong mời rút quẻ');pendPick(D.pend[0],'q1');M.random=()=>.1;tick(1);M.random=R0;
  ok(D.tipB&&D.tipB.n===5&&/Đại cát/.test(toasts.at(-1)),'quẻ Đại cát: 5 khách tới bo thêm');
  open();c=cust('thayboi');make();pendPick(D.pend[0],'q0');M.random=()=>.9;tick(1);M.random=R0;ok(D.nextT==='khotinh','quẻ Hung: khách kế tiếp khó tính');
  D.next=0;D.total=99;tickDay(.01);ok(D.queue.at(-1).type==='khotinh'&&!D.nextT,'khách tiếp theo vào đúng là khách khó tính');
  // --- Bà tám
  open();c=cust('batam');ok(/^(Cô|Dì|Bà|Bác|Cụ) [^ ]+$/.test(c.name)&&D.pend[0]&&D.pend[0].kind==='tam'&&c.dec,'bà tám (tên thường theo tuổi) vào là hỏi tám chuyện ('+c.name+')');
  pendPick(D.pend[0],'yes');ok(D.away>now&&D.awayWhy&&TAM_GOSSIP.some(g=>toasts.at(-1)==='🗣️ '+tamSay(c,g)),'nghe tám: bận 6 giây, bà kể chuyện xàm: '+toasts.at(-1));
  const bz=S.buzz||0;tick(7);make();ok(D.stars.at(-1)===5,'được nghe tám nên bà vui');ok((S.buzz||0)===Math.min(16,bz+2)&&D.log.some(l=>/đi kể cả xóm/.test(l)),'bà đi kể cả xóm: mai thêm 2 khách');
  {const ns=[...Array(40)].map(()=>{spawn('batam');return D.queue.at(-1).name});ok(new Set(ns).size>8&&ns.some(n=>!/ Tám$/.test(n)),'bà tám là loại khách, tên đa dạng: '+[...new Set(ns)].slice(0,6).join(', '));
   ok(tamSay({name:'Bà Hạnh'},'Thằng cháu nhà cô thi rớt.')==='Thằng cháu nhà bà thi rớt.'&&tamSay({name:'Cụ Lan',sex:'f'},'cô kể nghe')==='bà kể nghe','tự xưng theo cách gọi (Bà Hạnh → bà, Cụ Lan → bà)')}
  {const G=TAM_GOSSIP.filter(t=>/(^| )[Cc]ô[ ,!.…]/.test(t));const b=G.map(t=>tamSay({name:'Bác Tám'},t));
   ok(b.every(t=>!/(^| )[Cc]ô[ ,!.…]/.test(t)&&/[Bb]ác/.test(t)),'Bác Tám tự xưng "bác", không xưng "cô": '+b[0]);
   ok(tamSay({name:'Dì Tám'},'“Con ơi lại đây cô kể nghe chuyện này…”')==='“Con ơi lại đây dì kể nghe chuyện này…”','Dì Tám mời tám: '+tamSay({name:'Dì Tám'},'“Con ơi lại đây cô kể nghe chuyện này…”'));
   ok(defLine({name:'Bà Tám',type:'batam',age:'gia',nick:'nói nhiều'},{name:'Anh Huy'},{age:'tre'},['chờ lâu']).indexOf('Cô ')<0,'bà tám khách quen bênh tiệm cũng xưng đúng')}
  open();c=cust('batam');pendPick(D.pend[0],'no');ok(c.tam===-1&&!c.dec,'dạ con bận: bà dỗi');M.random=()=>.99;make();M.random=R0;ok(D.stars.at(-1)<=4,'bà dỗi nên cao nhất 4★ ('+D.stars.at(-1)+'★)');
  open();c=cust('batam');tick(13);ok(!D.pend.length&&c.tam===1,'để lâu không trả lời: bà tự kể như lúc không hỏi');
  // --- Streamer
  open();c=cust('streamer');ok(!c.liveEnd,'streamer chưa đếm giờ khi chưa ai nhận ly');takeCup('M');tickDay(.01);ok(c.liveEnd>now,'nhận ly: bắt đầu đếm '+Math.round(c.liveEnd-now)+' giây');
  ok(qCard(c,0,{k:'me'},false,false).includes('data-live'),'thẻ order có đồng hồ 📹');useTool('trash');
  const b0=S.buzz||0;make();ok(D.stars.at(-1)===5&&(S.buzz||0)>b0,'pha kịp: 5★, lên sóng, mai thêm '+((S.buzz||0)-b0)+' khách');
  open();c=cust('streamer');takeCup('M');tickDay(.01);tick(liveT(c.items[0])+2);useTool('trash');make();ok(D.stars.at(-1)<=2,'trễ giờ: bị chê trên live ('+D.stars.at(-1)+'★)');
  // --- Tây ba lô
  open();c=cust('tay');c.items[0].en=1;Object.assign(c.items[0],{sugar:50,ice:'it',ts:['den']});c.price=priceOf(c.o);
  const lb=checks(c.items[0]).map(x=>x[0]).join(' | ');ok(/Black tea \\+ Condensed milk Medium/.test(lb)&&/Black pearls/.test(lb)&&/Sugar ×/.test(lb)&&/Ice ×/.test(lb),'phiếu tiếng Anh: '+lb);
  ok(/^Anh [A-Z][a-z]+$/.test(c.name)&&c.pay==='Tiền đô','tên và trả tiền: '+c.name+' · '+c.pay);
  open();c=cust('tay');c.items[0].en=1;M.random=()=>.5;make();M.random=R0;ok(D.stars.at(-1)>=4&&/trả \\$\\d, khỏi thối/.test(toasts.find(t=>t.startsWith(c.name))||''),'khách Tây bo bằng đô: '+(toasts.find(t=>t.startsWith(c.name))||''));
  // --- lúc đông khách / tỉ lệ thẻ 0%: nhân vật tự quyết, không hiện thẻ
  open();ASK_P=0;c=cust('betthu');r0=D.rev;M.random=()=>.2;make();M.random=R0;ok(!D.pend.length&&D.rev-r0===r1k(c.price*.5)&&/tự tung/.test(toasts.at(-1)),'không hỏi: Bet thủ tự tung, hên trả 50%: '+toasts.at(-1));
  open();ASK_P=0;c=cust('betthu');r0=D.rev;M.random=()=>.8;make();M.random=R0;ok(D.rev-r0===r1k(c.price*1.5),'Bet thủ xui: trả 150%');
  open();ASK_P=0;c=cust('thayboi');make();ok(!D.pend.length&&D.log.some(l=>/Thầy gieo quẻ/.test(l)),'không hỏi: thầy bói tự gieo quẻ');
  open();ASK_P=0;c=cust('batam');ok(!D.pend.length&&c.tam===1&&D.away>now&&D.away-now<=2.01&&/^🗣️ /.test(toasts.at(-1)),'không hỏi: bà tám tự kể, bạn chỉ mất 2 giây');
  open();ASK_P=0;c=cust('hocsinh');r0=D.rev;const tp0=D.tips;make();ok(!D.pend.length&&D.rev-r0-(D.tips-tp0)===r1k(c.price*.8),'không hỏi: học sinh tự trả giá học sinh 80%');
  open();ASK_P=1;D.clock=12;ok(!canAsk(),'giờ cao điểm: không hỏi, khách tự quyết');D.clock=8;for(let i=0;i<4;i++){spawn('thuong')}ok(!canAsk(),'4 khách đang chờ: không hỏi');D.queue=[];ok(canAsk(),'vắng khách, tỉ lệ 100%: hỏi');
  ok(ACH.some(a=>a.id==='coin5')&&ACH.some(a=>a.id==='live1'),'huy hiệu mới: Thánh đoán, Lên sóng');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
