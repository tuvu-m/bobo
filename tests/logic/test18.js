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
  const setup=(day,lv,ev)=>{S.day=day;S.evDay=day;S.ev=ev;S.shop=lv;S.staff=[0,1,2,3].map(()=>Object.assign(genStaff(),{role:'barista',mood:80}));['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:99}]);syncBasics();S.recipes.forEach(r=>r.on=r.status==='ok'&&r.basic);syncLayout();popularity=()=>4.5};
  // --- trần khách theo ngày
  setup(120,3,'binhthuong');const cap=SHOP[3].cap;ok(dayCap()===cap,'ngày thường: trần '+dayCap());
  S.ev='cuoituan';ok(dayCap()===Math.round(cap*1.3),'cuối tuần: trần ×1,3 = '+dayCap());S.ev='mua';ok(dayCap()===Math.round(cap*.75),'trời mưa: trần ×0,75 = '+dayCap());S.ev='nangnong';ok(dayCap()===Math.round(cap*1.2),'nắng nóng: trần ×1,2 = '+dayCap());
  const tot=ev=>{setup(120,3,ev);S.buzz=0;startDay();const n=D.total;D=null;return n};const a=tot('binhthuong'),b=tot('cuoituan'),m=tot('mua');
  ok(b>a&&m<a,'tiệm đông (đã chạm trần): ngày thường '+a+', cuối tuần '+b+', trời mưa '+m+' khách');
  setup(120,3,'binhthuong');S.buzz=60;startDay();ok(D.total>dayCap()&&D.total<=buzzCap(),'story/livestream được vượt trần ngày thường tới 20%: '+D.total+' khách');D=null;
  // tiệm lớn: thêm chỗ nhân viên và pha nhanh hơn (⚡) để ngày bán không kéo dài
  {const st={spd:3,mood:80};S.shop=1;const a=soloTime(st);S.shop=4;const b=soloTime(st);ok(b<a*.5&&SHOP[4].staff===8&&SHOP[3].staff===6,'cấp 5: 8 nhân viên, mỗi ly pha nhanh gấp '+(a/b).toFixed(1)+' lần cấp 2');S.shop=3}
  // --- khách quen bênh tiệm
  setup(40,2,'binhthuong');startDay();D.next=1e9;D.queue=[];
  S.regs=[{id:501,name:'Chị Mai',type:'thuong',age:'tre',sex:'f',nick:'kế toán',fav:1,favName:'Trà sữa',visits:3,bad:0},{id:502,name:'Chú Bảy',type:'xeom',age:'gia',sex:'m',nick:'lì',fav:1,favName:'Trà sữa',visits:5,bad:0}];
  const bad=(name,age,notes,rnd,st=1)=>{const c={name,age,type:'thuong',items:[{}],o:{r:0,ts:[],ss:[],fs:[],name:'Trà sữa',b:'hongtra',bs:['hongtra']},ratio:1};M.random=()=>rnd;review(c,st,notes);M.random=R0;return S.reviews.at(-1)};
  let r=bad('Anh Tuấn','tre',['chờ lâu'],.01);ok(r.def&&r.def.t&&/(Chị Mai|Chú Bảy)/.test(r.def.n),'review 1★: khách quen vào bênh: '+(r.def&&r.def.n+': “'+r.def.t+'”'));
  ok(S.ratings.find(x=>x.id===r.id).w===.5,'review được bênh chỉ tính nửa sức nặng');ok(rvHTML().includes('thr def'),'tab Đánh giá hiện bình luận bênh tiệm');
  r=bad('Chị Lan','tre',['chê đắt'],.01);ok(!!r.def,'lần 2 trong ngày vẫn bênh');for(let k=0;k<4;k++)bad('Anh B'+k,'tre',['chê đắt'],.01);r=bad('Anh Huy','tre',['chê đắt'],.01);ok(!r.def&&D.defN===6,'tối đa 6 lần mỗi ngày');
  D.defN=0;ok(Math.abs(defP(1)-.45)<1e-9&&Math.abs(defP(3)-.25)<1e-9,'2 khách quen: review 1–2★ 45%, 3★ 25%');r=bad('Anh Huy','tre',[],.5);ok(!r.def,'rand .5 ≥ 45%: không bênh');r=bad('Anh Huy','tre',[],.4);ok(!!r.def,'rand .4 < 45%: bênh');
  D.defN=0;r=bad('Chị Thu','tre',['chờ lâu'],.2,3);ok(!!r.def,'review 3★ cũng có thể được bênh');r=bad('Chị Thu','tre',['chờ lâu'],.3,3);ok(!r.def,'review 3★: rand .3 ≥ 25% thì không');D.defN=0;
  D.defN=0;const c5={name:'Em Na',age:'teen',type:'thuong',items:[{}],o:{r:0,ts:[],ss:[],fs:[],name:'Trà',b:'hongtra',bs:['hongtra']},ratio:1};M.random=()=>.01;review(c5,5,[]);M.random=R0;{const g=S.reviews.at(-1);ok(g.def&&g.def.good&&g.s===5,'review 5★: khách quen bình luận dạo: '+(g.def&&g.def.n+': “'+g.def.t+'”'));
  ok(rvHTML().includes('💬'),'tab Đánh giá hiện bình luận dạo với 💬');
  M.random=()=>.01;review(c5,5,[]);review(c5,4,[]);M.random=R0;ok(!S.reviews.at(-1).def&&D.cmtN===2,'bình luận dạo tối đa 2 lần mỗi ngày');
  D.cmtN=0;M.random=()=>.5;review(c5,5,[]);M.random=R0;ok(!S.reviews.at(-1).def,'xác suất thấp (rand .5 > 6%): không bình luận');
  const R2={name:'Anh Tom',type:'tay',age:'tre',nick:'mập'};let en=0;for(let i=0;i<30;i++){const t=defLine(R2,{name:'Chị Lan'},{age:'tre'},[],1);if([...CMT_T.tay,...CMT_N['mập']].some(l=>t.startsWith(l.slice(0,8))||/Best bubble/.test(t)||/uống ở đây bao nhiêu/.test(t)))en++}
  ok(en>=15,'khách Tây khen theo kiểu của mình ('+en+'/30), ví dụ: '+defLine(R2,{name:'Chị Lan'},{age:'tre'},[],1))}
  // giọng theo người: ông chú xe ôm gọi người trẻ là "con"
  const X=S.regs[1];let ok1=0,ok2=0;for(let i=0;i<40;i++){const t=defLine(X,{name:'Anh Tuấn'},{age:'tre'},['chờ lâu']);if(/con|Chú|chú/.test(t)&&!/anh Tuấn/.test(t))ok1++}
  ok(ok1>=30,'chú xe ôm gọi người trẻ là "con", xưng chú ('+ok1+'/40)');
  const K=S.regs[0];for(let i=0;i<40;i++){const t=defLine(K,{name:'Anh Tuấn'},{age:'tre'},[]);if(DEF_N['kế toán'].some(l=>l.replace(/\\{[TtXx]\\}/g,'').slice(0,12)===t.replace(/(Chị|chị|Anh|anh)/g,'').slice(0,12))||/kế toán|Sổ sách/.test(t))ok2++}
  ok(ok2>=15,'chị kế toán nói theo nghề ('+ok2+'/40)');
  console.log('--- câu mẫu:');const types=[['Chú Bảy','xeom','gia','lì'],['Chị Mai','thuong','tre','kế toán'],['Anh Tom','tay','tre','mập'],['Thầy Tư','thayboi','gia','tóc bạc'],['Cô Tám','batam','trung','nói nhiều'],['Anh Khoa','betthu','tre','IT'],['Bà Hai','thuong','gia','nhai trầu'],['Bé Bin','thuong','nhi','răng sún'],['Anh Hùng','streamer','tre','game thủ'],['Chú Năm','thuong','trung','thợ hồ']];
  types.forEach(([n,ty,ag,nk])=>{const R={name:n,type:ty,age:ag,nick:nk};console.log('   '+n+' '+nk+' → Anh Tuấn chờ lâu: '+defLine(R,{name:'Anh Tuấn'},{age:'tre'},['chờ lâu']))});
  // nhật ký cuối ngày gom gọn (tiệm lớn vài trăm khách)
  {const lg=['Tiệm chật: 50 khách phải đi tiệm khác.',...[...Array(6)].map((_,i)=>'🗣️ Bà Tám kể: chuyện '+i),...[...Array(12)].map((_,i)=>'Chị A'+i+' mê tiệm quá, thành khách quen “Chị A'+i+' dù”!'),'Chú Bảy rủ thêm 2 anh em xe ôm ghé tiệm.','🚨 Minh ỉm ví của Anh B, bị phát hiện! Tiệm bị phạt 10k vì không dạy nhân viên tử tế.'];
   const L=condenseLog(lg).map(l=>l.t||l);ok(L.length===5&&L.includes('🗣️ Bà tám kể 6 chuyện trong xóm')&&L.includes('✨ 12 khách thành khách quen')&&L.some(l=>/rủ thêm 2 anh em/.test(l))&&L.some(l=>/^🚨/.test(l)),'nhật ký cuối ngày gom gọn: 21 dòng → '+L.length+' dòng: '+L.join(' | '))}
  ok(ACH.some(a=>a.id==='def1'),'huy hiệu Có fan bảo kê');
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); process.exit(fails ? 1 : 0);
