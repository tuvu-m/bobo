const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const ctx=await b.newContext({viewport:{width:393,height:659},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out=process.argv[3];
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{S.notice=[];S.day=8;S.drinks=['hongtra','suadac','luctra'];S.syrups=['s_duongden'];['hongtra','suadac','luctra','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:99}]);
  const mk=(id,name,bs,ss,price)=>{const r={id,name,bs,ss,ts:[],fs:[],status:'ok',mult:2.6,grade:'B',price,on:true,until:null};S.recipes=S.recipes.filter(x=>x.id!==id);S.recipes.push(r)};
  mk(901,'Lục trà',['luctra'],[],15000);mk(902,'Trà đường đen',['hongtra'],['s_duongden'],18000);syncLayout();renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(700);
const setup=async(o,type='thuong')=>p.evaluate(([o,type])=>{D.next=1e9;D.evPlan=[];D.queue=[];D.pend=[];D.ev=null;D.sug=null;cup=null;spawn(type);const c=D.queue[0];c.max=100;c.p=30;Object.assign(c.items[0],{size:'M',ts:[],fs:[],ss:[],sugar:0,ice:0},o);c.o=c.items[0];c.price=c.items.reduce((a,x)=>a+priceOf(x),0);tkKey='';renderTicket();return c.price},[o,type]);
// 1. hết sữa đặc: phiếu báo + nút gợi ý
await p.evaluate(()=>{S.stock.suadac=[];syncLayout()});
const price0=await setup({r:1,name:'Trà sữa',bs:['hongtra','suadac']});await p.waitForTimeout(300);
ok(await p.isVisible('#qrow .qc.oos')&&/Hết Sữa đặc · Đổi món/.test(await p.textContent("#qrow .qc.oos")),'món hết sữa đặc: thẻ order báo "Hết Sữa đặc · Đổi món"');
await p.screenshot({path:out+'/S1-het.png',clip:{x:0,y:40,width:393,height:300}});
await p.click('#qrow .qc.oos');await p.waitForTimeout(200);
const opts=await p.$$eval('[data-sugr]',bs=>bs.map(b=>b.textContent));ok(opts.length===2&&opts.some(t=>/Lục trà/.test(t))&&!opts.some(t=>/Trà sữa/.test(t)),'gợi ý các món đang pha được: '+opts.join(' | '));
await p.screenshot({path:out+'/S2-goiy.png',clip:{x:0,y:40,width:393,height:300}});
await p.click('[data-sugr="902"]');await p.waitForTimeout(200);
const r=await p.evaluate(()=>{const c=D.queue[0],o=c.items[0];return{name:o.name,bs:o.bs,disc:o.disc,price:c.price,p:c.p,miss:missingOf(o).length}});
ok(r.name==='Trà đường đen'&&r.disc===.1&&r.price===Math.round(18000*.9/1000)*1000&&r.miss===0,'chọn Trà đường đen: đổi món, giảm 10% ('+r.price+'đ)');
ok(r.p>=65&&r.p<=70,'khách chờ thêm được khoảng 40% (30 → '+r.p.toFixed(0)+')');
ok(!(await p.isVisible('#qrow .qc.oos')),'đổi xong: hết cảnh báo');
// 2. chỉ hết topping: lựa chọn bỏ topping
await p.evaluate(()=>{S.stock.suadac=[{q:99,e:99}];S.stock.den=[];syncLayout()});
await setup({r:1,name:'Trà sữa',bs:['hongtra','suadac'],ts:['den','trang']});await p.click('#qrow .qc.oos');await p.waitForTimeout(150);
ok(await p.isVisible('[data-sugr="top"]'),'chỉ hết topping: có lựa chọn "Bỏ TC đen"');await p.click('[data-sugr="top"]');
ok(await p.evaluate(()=>{const o=D.queue[0].items[0];return o.ts.join()==='trang'&&o.disc===.1}),'bỏ topping hết hàng, giữ topping còn, giảm 10%');
// 3. nhân viên chờ chứ không đuổi khách
await p.evaluate(()=>{S.stock.den=[{q:99,e:99}];S.stock.suadac=[];syncLayout();const s=genStaff();Object.assign(s,{role:'barista',trait:'chamchi',skill:5,spd:3,mood:90});S.staff=[s]});
await setup({r:1,name:'Trà sữa',bs:['hongtra','suadac']});await p.waitForTimeout(1500);
ok(await p.evaluate(()=>D.queue.length===1&&!cup),'có nhân viên: khách gọi món hết hàng không bị đuổi về, chờ bạn gợi ý');
await p.click('#qrow .qc.oos');await p.click('[data-sugr="901"]');for(let i=0;i<80;i++){await p.waitForTimeout(250);if(await p.evaluate(()=>D.stars.length>0||D.pend.length>0))break}
ok(await p.evaluate(()=>D.stars.length>0||D.pend.length>0),'đổi sang Lục trà: nhân viên pha và giao');
await p.evaluate(()=>{S.staff=[]});
// 4. khách khó tính có thể từ chối
await p.evaluate(()=>{window._r=Math.random;Math.random=()=>.1});await setup({r:1,name:'Trà sữa',bs:['hongtra','suadac']},'khotinh');
await p.click('#qrow .qc.oos');await p.click('[data-sugr="901"]');await p.evaluate(()=>{Math.random=window._r});
ok(await p.evaluate(()=>D.queue.length===0),'khách khó tính không chịu đổi: bỏ về');
// 5. nhân vật mới có hình riêng
await p.evaluate(()=>{S.stock.suadac=[{q:99,e:99}];D.queue=[];D.walk=[];['sigai','xeom','chim','songao','shipper'].forEach(t=>spawn(t));D.queue.forEach(c=>{c.p=c.max=1e6});layoutQ();D.queue.forEach(c=>{c.x=c.tx});tkKey='';renderTicket()});
await p.waitForTimeout(900);ok(await p.evaluate(()=>D.queue.every(c=>!c.icon)&&D.queue.find(c=>c.type==='sigai').friends[0].spr==='k_bangai'),'nhân vật mới dùng hình riêng, không còn biểu tượng tạm');
await p.screenshot({path:out+'/S3-nhanvat.png',clip:{x:0,y:40,width:393,height:300}});
// 6. món đã bỏ đúng thì ẩn khỏi phiếu
await p.evaluate(()=>{S.stock.suadac=[{q:99,e:99}];S.stored=[];syncLayout();D.queue=[];D.walk=[];D.pend=[];D.ev=null;cup=null;spawn('thuong');const c=D.queue[0];c.p=c.max=1e6;Object.assign(c.items[0],{size:'M',ts:['den'],fs:[],ss:[],sugar:50,ice:'it',bs:['hongtra','suadac'],r:1,name:'Trà sữa',disc:0});c.o=c.items[0];tkKey='';renderTicket()});
const pills=()=>p.$$eval('#tk .tkmid .pill',ps=>ps.map(x=>x.textContent.trim()));
const p0=await pills();await p.evaluate(()=>{takeCup('M');addTop('den');cup.sugar=2;renderTicket()});const p1=await pills();
ok(p0.length===4&&p1.length===2&&!p1.some(t=>/TC đen|đường/.test(t)),'bỏ đúng topping và đường: 2 mục đó ẩn khỏi phiếu ('+p1.join(' | ')+')');
await p.evaluate(()=>{cup.pours=[{k:'hongtra',amt:.36},{k:'suadac',amt:.36}];cup.fill=TARGET;cup.used.hongtra=cup.used.suadac=1;cup.ice=1;renderTicket()});
ok((await pills()).join()==='✓ Đủ rồi','đủ hết: phiếu chỉ còn "✓ Đủ rồi"');
await p.screenshot({path:out+'/S4-du.png',clip:{x:0,y:40,width:393,height:300}});
await p.evaluate(()=>{addTop('trang');renderTicket()});ok(await p.$$eval('#tk .tkmid .pill.bad.strike',ps=>ps.some(x=>/TC trắng/.test(x.textContent))),'bỏ thừa topping: hiện mục đỏ gạch ngang "TC trắng"');
ok(errs.length===0,'không có lỗi JS '+errs.join(' | '));
await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
