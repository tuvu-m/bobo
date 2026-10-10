const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true,args:['--autoplay-policy=no-user-gesture-required']});const ctx=await b.newContext({viewport:{width:393,height:659},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out=process.argv[3];
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
// review mẫu: 1 chê (2★), 1 khen (5★), 1 trung bình
await p.evaluate(()=>{S.day=Math.max(S.day,2);S.notice=[];S.reviews=[];S.ratings=[];[[2,'Anh Huy','Không giống như mình gọi.'],[5,'Chị Lan','Ngon xuất sắc!'],[3,'Bé Na','Bình thường thôi.']].forEach(([s,n,t])=>evReview(s,n,t,'Khách'));tab='rv';renderPrep();document.querySelector('#tbody').scrollTop=0});
await p.waitForTimeout(300);ok(await p.evaluate(()=>document.querySelectorAll('.repBtn').length===3),'mỗi review có nút Trả lời');
const ids=await p.evaluate(()=>S.reviews.map(r=>r.id));
// cà khịa review chê, ép kết quả hạ sao
await p.evaluate(()=>{window._r=Math.random;Math.random=()=>.1});
await p.click(`[data-rpo="${ids[2]}"]`);await p.waitForTimeout(150);await p.screenshot({path:out+'/C1-chon.png'});
await p.click(`[data-rp="${ids[2]}:sass"]`);await p.waitForTimeout(200);
ok(await p.evaluate(id=>S.reviews.find(r=>r.id===id).back==='…'&&/đang gõ/.test(document.querySelector('#tbody').textContent),ids[2]),'gửi trả lời: khách "đang gõ…"');
await p.waitForTimeout(1300);
const r0=await p.evaluate(id=>{const r=S.reviews.find(r=>r.id===id);return{back:r.back,s:r.s,edit:r.edit,rating:S.ratings.find(x=>x.id===id).s}},ids[2]);
ok(BACK_ok(r0.back)&&r0.s===2&&r0.edit==='down'&&r0.rating===2,'cà khịa review 3★: khách cãi lại "'+r0.back+'" và hạ xuống 2★ (điểm nổi tiếng cũng đổi)');
function BACK_ok(t){return !!t&&t!=='…'}
// cảm ơn review khen
await p.evaluate(()=>{Math.random=window._r});
await p.click(`[data-rpo="${ids[1]}"]`);await p.click(`[data-rp="${ids[1]}:nice"]`);await p.waitForTimeout(1400);
const r1=await p.evaluate(id=>S.reviews.find(r=>r.id===id),ids[1]);ok(r1.reply&&r1.back&&r1.back!=='…'&&r1.s===5,'cảm ơn review 5★: khách đáp "'+r1.back+'", giữ 5★');
// tự viết, lịch sự, ép sửa sao lên
await p.evaluate(()=>{Math.random=()=>.1});
await p.click(`[data-rpo="${ids[0]}"]`);await p.fill('#repTxt','Tiệm xin lỗi bạn nha, ghé lại tiệm bù cho ly khác!');await p.click(`[data-rp="${ids[0]}:custom"]`);await p.waitForTimeout(1400);
const r2=await p.evaluate(id=>S.reviews.find(r=>r.id===id),ids[0]);ok(r2.s===3&&r2.edit==='up'&&/xin lỗi/.test(r2.reply),'tự viết xin lỗi: khách bớt giận, sửa 2★ lên 3★');
await p.evaluate(()=>{Math.random=window._r});
ok(await p.evaluate(()=>document.querySelectorAll('.repBtn').length===0&&document.querySelectorAll('.thr').length===6),'đã trả lời thì không trả lời lại được; hiện đủ luồng hội thoại');
await p.evaluate(()=>document.querySelector('#tbody').scrollTop=9999);await p.waitForTimeout(100);await p.evaluate(()=>{const e=[...document.querySelectorAll('.rv')].pop();e&&e.scrollIntoView({block:'center'})});
await p.screenshot({path:out+'/C2-traloi.png'});
ok(await p.evaluate(()=>{const n=document.createElement('div');S.reviews.push({id:999,d:1,name:'X',type:'thuong',s:3,t:'x',n:1,reply:'<b>hi</b>',back:'<i>x</i>'});const h=repHTML(S.reviews.at(-1));S.reviews.pop();return h.includes('&lt;b&gt;')&&!h.includes('<b>hi')}),'chữ người chơi viết được thoát an toàn');
// nhạc nền theo thời tiết + chuông cửa
await p.mouse.click(200,600);await p.waitForTimeout(500);
await p.mouse.click(5,5);await p.waitForTimeout(400);
ok(await p.evaluate(()=>MUS.on&&TRACK==='auto'&&!MUS.el),'chạm: có nhạc nền, không dùng thẻ audio (mở bằng file:// không tải được bài thu âm thì dùng nhạc điện tử)');await p.evaluate(()=>setTrack('synth'));await p.waitForTimeout(300);
await p.evaluate(()=>{S.ev='mua'});await p.waitForTimeout(3500);
ok(await p.evaluate(()=>MUS.mood===MOODS.mua&&!!MUS.rainSrc),'ngày mưa: đổi sang nhạc mưa, có tiếng mưa');
await p.evaluate(()=>{S.ev='cuoituan'});await p.waitForTimeout(3500);ok(await p.evaluate(()=>MUS.mood===MOODS.cuoituan&&!MUS.rainSrc),'cuối tuần: nhạc nhanh, tắt tiếng mưa');
await p.evaluate(()=>{tab='luu';renderPrep()});await p.click('[data-set="bgm"]');ok(await p.evaluate(()=>!MUS.on&&!BGM),'tắt nhạc nền trong Cài đặt');await p.click('[data-set="bgm"]');
await p.evaluate(()=>{window._sfx=[];const o=sfx;sfx=n=>{window._sfx.push(n);o(n)};tab='quay';renderPrep()});await p.click('#openBtn');await p.waitForTimeout(800);
await p.evaluate(()=>{D.next=0;D.evPlan=[]});await p.waitForTimeout(2500);
ok(await p.evaluate(()=>window._sfx.includes('bell')),'khách vào: có chuông cửa');
ok(errs.length===0,'không có lỗi JS '+errs.join(' | '));
await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
