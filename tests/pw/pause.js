const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const ctx=await b.newContext({viewport:{width:393,height:659},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out=process.argv[3];
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{S.notice=[];S.day=5;['hongtra','suadac','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:50,e:99}]);renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(1500);await p.evaluate(()=>{D.evPlan=[];D.next=0});await p.waitForTimeout(1500);
// 1. tạm dừng
ok(await p.isVisible('#pauseBtn'),'có nút tạm dừng lúc bán hàng');
await p.click('#pauseBtn');await p.waitForTimeout(300);
ok(await p.isVisible('#pauseOv'),'bấm tạm dừng: hiện bảng Tạm dừng');
const a=await p.evaluate(()=>({clock:D.clock,p:D.queue.map(c=>c.p),now}));await p.waitForTimeout(2000);
const z=await p.evaluate(()=>({clock:D.clock,p:D.queue.map(c=>c.p),now}));
ok(a.clock===z.clock&&JSON.stringify(a.p)===JSON.stringify(z.p)&&a.now===z.now,'đang tạm dừng: giờ, sức chờ của khách, thời gian game đứng yên');
await p.screenshot({path:out+'/P1-tamdung.png'});
await p.click('#resumeBtn');await p.waitForTimeout(1200);
ok(!(await p.isVisible('#pauseOv'))&&await p.evaluate(c=>D.clock>c,z.clock),'bấm Tiếp tục: game chạy lại');
// 2. tự tạm dừng khi chuyển app
await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'))});
ok(await p.evaluate(()=>PAUSED&&!document.getElementById('pauseOv').hidden),'chuyển sang app khác: tự tạm dừng');
await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false})});
// 3. đóng cửa sớm từ bảng tạm dừng (bấm 2 lần)
await p.click('#closeBtn');ok(await p.evaluate(()=>!D.closing&&/lần nữa/.test(document.getElementById('closeBtn').textContent)),'bấm Đóng cửa sớm lần 1: hỏi lại cho chắc');
await p.evaluate(()=>{S.stock.suadac=[];/* một khách gọi món hết hàng */});
await p.click('#closeBtn');await p.waitForTimeout(300);
const st=await p.evaluate(()=>({closing:D.closing,total:D.total,spawned:D.spawned,paused:PAUSED,hud:document.getElementById('hSub').textContent,log:D.log.at(-1),stars:D.stars.length}));
ok(st.closing&&st.total===st.spawned&&!st.paused,'bấm lần 2: đóng cửa, không nhận thêm khách, game chạy tiếp');
ok(/đóng cửa/.test(st.hud),'thanh trên cùng ghi "đóng cửa" ('+st.hud+')');
ok(/Đóng cửa sớm lúc/.test(st.log),'tổng kết ghi lại: '+st.log);
await p.screenshot({path:out+'/P2-dongcua.png'});
// phục vụ nốt rồi tự sang màn tổng kết
await p.evaluate(()=>{D.queue.forEach(c=>{c.ratio=1});D.queue.slice().forEach(c=>settle(c,5,null,[]))});
for(let i=0;i<40;i++){await p.waitForTimeout(250);if(await p.evaluate(()=>!D))break}
ok(await p.evaluate(()=>!D&&!document.getElementById('summary').hidden),'phục vụ xong khách cuối: sang màn tổng kết');
ok(await p.evaluate(()=>/Đóng cửa sớm lúc/.test(document.getElementById('sumLog').textContent)),'màn tổng kết có dòng đóng cửa sớm');
// 4. hết hàng: tự hỏi đóng cửa
await p.click('#nextBtn');await p.waitForTimeout(300);
await p.evaluate(()=>{S.notice=[];['hongtra','suadac'].forEach(k=>S.stock[k]=[{q:1,e:99}]);renderPrep()});await p.click('#openBtn');await p.waitForTimeout(500);
await p.evaluate(()=>{D.evPlan=[];D.total=20;S.stock.hongtra=[];S.stock.suadac=[]});await p.waitForTimeout(800);
ok(await p.evaluate(()=>D.ev&&D.ev.e.id==='oos'),'kho hết nguyên liệu: hiện thẻ "Hết hàng rồi!"');
await p.screenshot({path:out+'/P3-hethang.png'});
await p.click('[data-evy="1"]');await p.waitForTimeout(300);ok(await p.evaluate(()=>D&&D.closing||!D),'chọn Đóng cửa sớm: tiệm đóng cửa');
// 5. thẻ ghi nợ có dòng khả năng trả nợ
ok(errs.length===0,'không có lỗi JS '+errs.join(' | '));
await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
