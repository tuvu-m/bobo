// Kiểm tra nhân viên tự pha ly riêng (mỗi người 1 ly): tốc độ, trình tự, song song, người chơi pha ly kế tiếp, ly hỏng, làm lại, nghỉ giải lao.
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
  M.random=()=>.5;  // không lỗi, không lười

  const W=()=>S.staff.map(s=>s.w);
  const addC=(order)=>{spawn('thuong');const c=D.queue.at(-1);c.p=c.max=1e6;c.type='thuong';Object.assign(c.items[0],{size:'M',ts:[],fs:[],ss:[],sugar:0,ice:0},order);c.items.length=1;c.o=c.items[0];c.price=99000;return c};
  // 1. 1 pha chế, Tốc độ 3: tự pha trọn một ly (gồm đóng gói) trong ~6 giây
  hire(1);let c=setup({bs:['hongtra','suadac'],sugar:50,ice:'thuong',ts:['den']});
  let steps=[];const t1=until(()=>{const w=S.staff[0].w;if(w){const st=w.steps[w.i];if(steps[steps.length-1]!==st)steps.push(st)}return !D.queue.includes(c)});
  ok(t1>5.8&&t1<7.2,'1 pha chế: ly 2 trà + đường + đá + topping xong trong '+t1.toFixed(2)+'s (~6,5s)');
  ok(steps.join('>')==='ly>nuoc>duong>da>top>goi','trình tự: '+steps.join(' > '));
  ok(D.stars[D.stars.length-1]===5,'nhân viên pha đúng thì khách cho 5★ ('+D.stars[D.stars.length-1]+')');
  ok(/NV1/.test(S.reviews[S.reviews.length-1].by||''),'review ghi tên nhân viên đã pha');
  ok(!cup,'nhân viên không đụng tới ly của người chơi');

  // 2. mỗi người 1 ly: 3 pha chế làm 3 khách cùng lúc; 1 pha chế thì lần lượt
  const three=n=>{hire(n);setup({bs:['hongtra'],sugar:50});addC({bs:['hongtra'],sugar:50});addC({bs:['hongtra'],sugar:50});return until(()=>!D.queue.length,40)};
  const p3=three(3),p1=three(1);
  ok(p1>p3*2.5,'3 khách: 3 pha chế xong trong '+p3.toFixed(1)+'s, 1 pha chế mất '+p1.toFixed(1)+'s');
  hire(3);setup({bs:['hongtra']});addC({bs:['hongtra']});until(()=>S.staff.filter(s=>s.w).length===2,1);
  ok(S.staff.filter(s=>s.w).length===2&&new Set(S.staff.filter(s=>s.w).map(s=>s.w.cid)).size===2,'2 khách: 2 nhân viên nhận 2 ly khác nhau, người thứ 3 rảnh');
  hire(1,{spd:5});setup({bs:['hongtra']});const t5=until(()=>!D.queue.length);
  hire(1,{spd:1});setup({bs:['hongtra']});const tt1=until(()=>!D.queue.length);
  ok(t5<tt1,'Tốc độ 5 nhanh hơn Tốc độ 1 ('+t5.toFixed(2)+'s so với '+tt1.toFixed(2)+'s)');
  hire(1);setup({bs:['hongtra']});const tOk=until(()=>!D.queue.length);hire(1,{mood:20});setup({bs:['hongtra']});const tTired=until(()=>!D.queue.length);ok(Math.abs(tTired-tOk)<tOk*.25,'nhân viên mệt không pha chậm trong ngày ('+tOk.toFixed(1)+'s → '+tTired.toFixed(1)+'s)');
  hire(1);setup({bs:['hongtra','suadac'],ss:['s_duongden'],sugar:50,ice:'thuong',ts:['den','trang']});const tCx=until(()=>!D.queue.length,30);ok(tCx>tOk*2,'ly nhiều bước (2 trà, siro, đường, đá, 2 topping) pha lâu hơn hẳn ly đơn giản ('+tCx.toFixed(1)+'s so với '+tOk.toFixed(1)+'s)');

  // 3. người chơi pha ly kế tiếp: nhân viên nhận khách đầu, người chơi được khách sau; ly đang cầm không bị nhân viên lấy
  hire(1);let c1=setup({bs:['hongtra']}),c2=addC({bs:['hongtra','suadac'],size:'L'});until(()=>!!S.staff[0].w,1);
  ok(S.staff[0].w.cid===c1.id&&target()===c2,'nhân viên nhận khách đầu, phiếu của bạn là khách tiếp theo ('+target().name+')');
  takeCup('L');ok(cup.cid===c2.id,'chạm ly: ly gắn với khách đó');
  until(()=>!D.queue.includes(c1));const c3=addC({bs:['hongtra']});until(()=>!!S.staff[0].w,1);
  ok(S.staff[0].w&&S.staff[0].w.cid===c3.id&&target()===c2,'nhân viên xong thì nhận khách mới, không lấy khách bạn đang pha');
  cup.pours=[{k:'hongtra',amt:.36},{k:'suadac',amt:.36}];cup.fill=TARGET;cup.used={hongtra:1,suadac:1};trySeal();until(()=>!sealing);
  ok(!D.queue.includes(c2)&&D.stars[D.stars.length-1]===5,'bạn giao ly của bạn: khách đó tính tiền');
  until(()=>!D.queue.length);
  // khách gọi 3 ly: mỗi người lo 1 ly
  hire(2);c=setup({bs:['hongtra']});c.items.push({...c.items[0]},{...c.items[0]});c.items.forEach(x=>{delete x.done;delete x.sj});until(()=>S.staff.every(s=>s.w),1);
  ok(S.staff.map(s=>s.w.ix).sort().join()==='0,1'&&target()===c&&c.cur===2,'khách gọi 3 ly: 2 nhân viên làm ly 1, 2; phiếu của bạn là ly 3');
  takeCup('M');cup.pours=[{k:'hongtra',amt:TARGET}];cup.fill=TARGET;cup.used={hongtra:1};trySeal();until(()=>!sealing);
  ok(D.queue.includes(c)&&c.res.length===1,'bạn giao ly 3 trước: khách chờ 2 ly còn lại');
  until(()=>!D.queue.includes(c));ok(c.res.length===3,'đủ 3 ly thì khách tính tiền');
  // khách đang được nhân viên pha thì chờ được lâu hơn
  hire(1);c1=setup({bs:['hongtra']});const c4=addC({bs:['hongtra']});c1.p=c4.p=100;c1.max=c4.max=100;until(()=>!!S.staff[0].w,1);run(2);
  ok(c1.p>c4.p,'khách đang được pha mất kiên nhẫn chậm hơn ('+c1.p.toFixed(1)+' so với '+c4.p.toFixed(1)+')');

  // 4. nhân viên pha sai: ly hỏng, đứng chờ người chơi bỏ ly rồi làm lại
  hire(1);c=setup({bs:['hongtra','suadac'],sugar:50,ice:'thuong',ts:['den']});M.random=()=>.001;until(()=>S.staff[0].w&&S.staff[0].w.broken,8);M.random=()=>.5;
  ok(S.staff[0].w&&S.staff[0].w.broken,'nhân viên pha sai: ly hỏng ('+(S.staff[0].w&&S.staff[0].w.broken)+')');ok(/pha hỏng ly của/.test(toasts[toasts.length-1]),'có thông báo: '+toasts[toasts.length-1]);
  const served0=D.served;run(2);ok(S.staff[0].w.broken&&D.queue.includes(c),'chưa tới 3 giây: nhân viên chờ bạn chạm Bỏ ly, khách chưa được giao');
  const dh0=qty('den');staffDrop(S.staff[0].id);ok(!S.staff[0].w.broken,'chạm thẻ Bỏ ly: nhân viên làm lại');
  until(()=>!D.queue.includes(c),10);ok(D.served===served0+1&&qty('den')===dh0-1,'làm lại đúng: giao được cho khách (tốn nguyên liệu lần nữa)');
  // không ai chạm Bỏ ly: 3 giây sau nhân viên tự bỏ ly, làm lại (trước đây chờ mãi, lúc đông cả đội đứng im như đơ game)
  hire(1);c=setup({bs:['hongtra','suadac'],sugar:50,ice:'thuong',ts:['den']});M.random=()=>.001;until(()=>S.staff[0].w&&S.staff[0].w.broken,8);M.random=()=>.5;run(2.5);ok(S.staff[0].w&&S.staff[0].w.broken,'2,5 giây: vẫn chờ bạn');run(.7);ok(S.staff[0].w&&!S.staff[0].w.broken,'quá 3 giây không ai chạm: nhân viên tự bỏ ly, làm lại');
  until(()=>!D.queue.includes(c),10);ok(!D.queue.includes(c)&&D.log.some(l=>/tự bỏ ly pha hỏng/.test(l)),'tự làm lại vẫn giao được, nhật ký có ghi');
  // nhảy vào phụ ly nhân viên đang pha
  hire(1);c=setup({bs:['hongtra','suadac'],sugar:50,ice:'thuong',ts:['den']});until(()=>S.staff[0].w&&S.staff[0].w.i>=1,2);
  staffHelp(S.staff[0].id);let w0=S.staff[0].w;ok(cup===w0.cup&&MK!==undefined&&target()===c&&PV,'chạm thẻ nhân viên: vào phụ đúng ly đang pha');
  until(()=>w0.got&&w0.steps[w0.i]==='nuoc',2);startPour('hongtra');ok(!pouring&&/đang rót/.test(toasts[toasts.length-1]),'nhân viên đang rót: bạn chờ ('+toasts[toasts.length-1]+')');
  addTop('den');const den0=qty('den');const tH=until(()=>!D.queue.includes(c),8);
  ok(!D.queue.includes(c)&&qty('den')===den0&&!cup,'bạn bỏ topping trước: nhân viên bỏ qua bước topping, giao xong, bạn về màn quán');
  ok(tH<6-1,'có bạn phụ thì xong sớm hơn ('+tH.toFixed(1)+'s còn lại)');
  // phụ rồi tự đóng gói
  c=setup({bs:['hongtra']});until(()=>!!S.staff[0].w,1);w0=S.staff[0].w;staffHelp(S.staff[0].id);cup.pours=[{k:'hongtra',amt:TARGET}];cup.fill=TARGET;cup.used.hongtra=1;cup.lyOk=1;
  trySeal();until(()=>!sealing,3);ok(!D.queue.includes(c)&&!S.staff[0].w&&D.stars[D.stars.length-1]===5,'bạn tự chạm máy đóng gói ly đang phụ: giao được, nhân viên rảnh tay');
  // rời ly (← Quán): nhân viên làm tiếp
  c=setup({bs:['hongtra']});until(()=>!!S.staff[0].w,1);staffHelp(S.staff[0].id);cup=null;PV=false;until(()=>!D.queue.includes(c),8);ok(!D.queue.includes(c),'rời ly đang phụ: nhân viên làm tiếp và giao');
  // bỏ ly khi đang phụ: nhân viên làm lại, bạn phụ tiếp ly mới
  c=setup({bs:['hongtra']});until(()=>!!S.staff[0].w,1);staffHelp(S.staff[0].id);const old=cup;useTool('trash');ok(cup&&cup!==old&&cup===S.staff[0].w.cup&&S.staff[0].w.i===0,'bỏ ly khi đang phụ: nhân viên làm lại, bạn phụ tiếp ly mới');
  // bạn làm hỏng ly đang phụ (dư đường): nhân viên đóng gói thì báo ly hỏng
  c=setup({bs:['hongtra'],sugar:30});until(()=>!!S.staff[0].w,1);staffHelp(S.staff[0].id);useTool('sugar');useTool('sugar');useTool('sugar');until(()=>S.staff[0].w&&S.staff[0].w.broken,8);
  ok(S.staff[0].w&&/dư đường/.test(S.staff[0].w.broken)&&D.queue.includes(c),'bạn bỏ dư đường: tới lúc đóng gói nhân viên báo ly hỏng, không giao');useTool('trash');until(()=>!D.queue.includes(c),10);ok(!D.queue.includes(c),'bỏ ly: nhân viên làm lại và giao');cup=null;
  // đang cầm ly của mình thì không phụ được
  c=setup({bs:['hongtra']});addC({bs:['hongtra']});until(()=>!!S.staff[0].w,1);takeCup('M');const mineCup=cup;staffHelp(S.staff[0].id);ok(cup===mineCup&&/đang cầm ly/.test(toasts[toasts.length-1]),'đang cầm ly của mình: không nhảy vào phụ, có nhắc lý do');cup=null;

  // hết hàng giữa chừng: trả ly lại cho người chơi đổi món
  hire(1);c=setup({bs:['hongtra'],ts:['den']});until(()=>S.staff[0].w&&S.staff[0].w.i>=2,4);S.stock.den=[];until(()=>!S.staff[0].w,3);
  ok(!S.staff[0].w&&target()===c&&missingOf(c.items[c.cur]).includes('den')&&/hết TC đen/.test(toasts[toasts.length-1]),'hết topping giữa chừng: nhân viên trả ly, phiếu báo hết để bạn đổi món');
  S.stock.den=[{q:99,e:99}];
  // nhân viên mệt: cho nghỉ giải lao 1 lần/ngày, tinh thần hồi lại
  hire(1,{mood:20});c=setup({bs:['hongtra']});until(()=>!!S.staff[0].w,1);staffRest(S.staff[0].id);ok(S.staff[0].brkReq&&S.staff[0].w,'cho nghỉ khi đang pha: pha xong ly này mới nghỉ');
  until(()=>S.staff[0].brkT>now,10);ok(!D.queue.includes(c)&&S.staff[0].mood===35,'xong ly thì nghỉ, tinh thần +15 (20 → '+S.staff[0].mood+')');
  const c5=addC({bs:['hongtra']});run(5);ok(!S.staff[0].w&&D.queue.includes(c5),'đang nghỉ thì không nhận ly');until(()=>!D.queue.includes(c5),40);ok(!D.queue.includes(c5),'nghỉ xong thì pha tiếp');
  const nt=toasts.length;staffRest(S.staff[0].id);ok(!S.staff[0].brkReq&&/đã nghỉ giải lao hôm nay/.test(toasts[toasts.length-1]),'mỗi ngày chỉ nghỉ 1 lần');

  // 5. người chơi rót tràn: ly hỏng, máy từ chối
  hire(0);setup({bs:['hongtra']});takeCup('M');pouring='hongtra';cup.used.hongtra=1;run(3);
  ok(cup.broken==='tràn ly'&&!pouring,'người chơi rót tràn: ly hỏng');trySeal();ok(!sealing,'máy từ chối ly tràn');
  // ly người chơi pha sai (không tràn) vẫn giao được, chỉ bị trừ sao
  useTool('trash');takeCup('M');cup.pours=[{k:'hongtra',amt:.5}];cup.fill=.5;cup.used.hongtra=1;trySeal();ok(!sealing&&/còn thiếu nước cho tới vạch/.test(toasts[toasts.length-1]),'rót chưa tới vạch: máy từ chối, báo rót thêm');
  cup.pours[0].amt=TARGET;cup.fill=TARGET;trySeal();ok(!!sealing,'rót thêm tới vạch: giao được');until(()=>!sealing);
  // các lỗi không sửa được: phải bỏ ly
  const fatal=(order,mk,re,name)=>{setup(order);takeCup(order.cupSize||'M');cup.pours=order.bs.map(k=>({k,amt:TARGET/order.bs.length}));cup.fill=TARGET;mk();trySeal();
    ok(!sealing&&re.test(toasts[toasts.length-1])&&[...orderNeeds()].join()==='trash',name+' ('+toasts[toasts.length-1]+')')};
  fatal({bs:['hongtra'],ts:['den']},()=>{addTop('den');addTop('trang')},/thừa TC trắng/,'thừa topping: máy từ chối, bảo bỏ ly');
  fatal({bs:['hongtra'],cupSize:'L'},()=>{},/sai size/,'sai size: máy từ chối');
  fatal({bs:['hongtra']},()=>{cup.fill=TARGET+.15;cup.pours[0].amt=cup.fill},/rót quá vạch/,'rót quá vạch: máy từ chối');
  fatal({bs:['hongtra']},()=>{cup.pours.push({k:'suadac',amt:.05})},/thừa sữa đặc/,'thừa sữa: máy từ chối');
  // thiếu topping: báo thiếu, bỏ vào là giao được
  setup({bs:['hongtra'],ts:['den','trang']});takeCup('M');cup.pours=[{k:'hongtra',amt:TARGET}];cup.fill=TARGET;addTop('den');trySeal();
  ok(!sealing&&/còn thiếu TC trắng/.test(toasts[toasts.length-1])&&orderNeeds().has('trang'),'thiếu topping: máy báo thiếu, highlight topping đó');addTop('trang');trySeal();ok(!!sealing,'bỏ đủ topping: giao được');until(()=>!sealing);
  // 6. không có pha chế thì không ai phụ; phục vụ/bảo vệ không pha
  hire(1,{role:'cashier'});c=setup({bs:['hongtra']});run(8);ok(!cup&&D.queue.includes(c),'chỉ có Phục vụ: không ai pha giúp');

  // 8. đường/đá sai thì máy từ chối; thiếu thì thêm cho đủ là giao được; dư thì phải bỏ ly
  M.random=()=>.5;hire(0);setup({bs:['hongtra'],sugar:70,ice:'it'});takeCup('M');cup.pours=[{k:'hongtra',amt:TARGET}];cup.fill=TARGET;cup.used.hongtra=1;
  useTool('sugar');trySeal();ok(!sealing&&/còn thiếu 2 lần đường, 1 lần đá/.test(toasts[toasts.length-1]),'thiếu đường, đá: máy từ chối, báo còn thiếu ('+toasts[toasts.length-1]+')');
  useTool('sugar');useTool('sugar');useTool('ice');trySeal();ok(!!sealing,'thêm đủ đường đá: giao được');until(()=>!sealing);
  setup({bs:['hongtra'],sugar:30,ice:'none'});takeCup('M');cup.pours=[{k:'hongtra',amt:TARGET}];cup.fill=TARGET;cup.used.hongtra=1;useTool('sugar');useTool('sugar');trySeal();
  ok(!sealing&&/dư đường/.test(toasts[toasts.length-1]),'dư đường: máy từ chối, bảo bỏ ly làm lại');ok([...orderNeeds()].join()==='trash','dư đường: highlight thùng rác');
  cup.sugar=1;useTool('ice');trySeal();ok(!sealing&&/dư đá/.test(toasts[toasts.length-1]),'khách dặn không đá mà bỏ đá: máy từ chối');
  // 7. càng nhiều nhân viên càng nhiều khách
  M.random=R;const avg=k=>{hire(k);S.shop=SHOP.length-1;let s=0;for(let i=0;i<300;i++){startDay();s+=D.total}D=null;return s/300};
  const a0=avg(0),a1=avg(1),a3=avg(3);ok(a1>a0+2&&a3>a1+5,'trung bình khách/ngày: 0 NV '+a0.toFixed(1)+', 1 NV '+a1.toFixed(1)+', 3 NV '+a3.toFixed(1));
})();`, ctx);
console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
process.exit(fails ? 1 : 0);
