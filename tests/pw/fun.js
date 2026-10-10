const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');const fs=require('fs');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const ctx=await b.newContext({viewport:{width:393,height:659},deviceScaleFactor:2,isMobile:true,hasTouch:true,acceptDownloads:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out=process.argv[3];
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{S.notice=[];S.day=5;S.ev='mua';S.evDay=5;['hongtra','suadac','s_duongden','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:99}]);renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(1200);await p.evaluate(()=>{D.next=1e9;D.evPlan=[];S.ev='mua'});
const sc=()=>p.evaluate(()=>{const r=document.querySelector('#sc').getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height}});
// 1. vuốt mèo
const cat=await p.evaluate(()=>catRects()[0]);let R=await sc();
const pets0=await p.evaluate(()=>(S.stat||{}).pets||0);
await p.mouse.click(R.x+(cat.x+cat.w/2)*R.w/160,R.y+(cat.y+cat.h/2)*R.h/62);await p.waitForTimeout(350);
ok(await p.evaluate(p0=>(S.stat.pets===p0+1)&&catRects()[0].c.wake>now&&catRects()[0].c.hearts.length===3,pets0),'chạm mèo: mèo thức dậy, 3 trái tim, đếm lượt vuốt');
await p.screenshot({path:out+'/F1-meo.png',clip:{x:0,y:R.y+R.h*.1,width:393,height:R.h*.9}});
// 2. chạm khách
await p.evaluate(()=>{spawn('thuong')});await p.waitForTimeout(2500);
const cu=await p.evaluate(()=>{const c=D.queue[0];return{x:c.x,id:c.id}});R=await sc();
await p.mouse.click(R.x+(cu.x+6)*R.w/160,R.y+50*R.h/62);await p.waitForTimeout(200);
ok(await p.evaluate(()=>{const c=D.queue[0];const esc=t=>t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\\\{x\\\}/g,'\\S+');return Object.values(CHAT).flat().some(t=>t===c.sayT||new RegExp('^'+esc(t)+'$','i').test(c.sayT))}),'chạm khách: khách nói một câu ('+await p.evaluate(()=>D.queue[0].sayT)+')');
await p.screenshot({path:out+'/F2-khach.png',clip:{x:0,y:R.y+R.h*.1,width:393,height:R.h*.9}});
// 3. combo + huy hiệu
const a0=await p.evaluate(()=>Object.keys(S.ach||{}).length);
await p.evaluate(()=>{for(let i=0;i<5;i++){spawn('thuong');const c=D.queue[D.queue.length-1];c.ratio=1;settle(c,5,null,[])}});await p.waitForTimeout(800);
ok(await p.evaluate(()=>D.combo>=5&&S.stat.combo>=5),'5 ly 5★ liên tiếp: combo x'+await p.evaluate(()=>D.combo));
ok(await p.evaluate(()=>!!(S.ach&&S.ach.combo5&&S.ach.five1)),'mở huy hiệu Combo x5 và Ly 5★ đầu tiên ('+await p.evaluate(()=>Object.keys(S.ach).join(','))+')');
await p.screenshot({path:out+'/F3-combo.png'});
// 4. thời tiết mưa đã thấy ở ảnh; 5. tab Đánh giá có huy hiệu
await p.evaluate(()=>{D.queue=[];D.walk=[];D.pend=[];D.spawned=D.total;D.ev=null;endDay();tab='rv';renderPrep();document.querySelector('#tbody').scrollTop=0});await p.waitForTimeout(400);
ok(await p.evaluate(()=>document.querySelectorAll('.bdg').length===ACH.length&&document.querySelectorAll('.bdg:not(.off)').length>=2),'tab Đánh giá có bảng huy hiệu');
await p.screenshot({path:out+'/F4-huyhieu.png'});
// 6. chụp ảnh tiệm
await p.evaluate(()=>{tab='trangtri';renderPrep()});await p.waitForTimeout(300);
const shared=await p.evaluate(async()=>{let got=null;const o1=navigator.canShare,o2=navigator.share;navigator.canShare=()=>true;navigator.share=d=>{got=d.files[0];return Promise.resolve()};document.querySelector('#photoBtn').click();await new Promise(r=>setTimeout(r,300));navigator.canShare=o1;navigator.share=o2;return got&&{n:got.name,t:got.type,s:got.size}});
  ok(shared&&shared.t==='image/png'&&shared.s>50000,'điện thoại: mở bảng chia sẻ với file ảnh '+(shared&&shared.n));
  await p.evaluate(()=>{navigator.canShare=undefined});
  const [dl]=await Promise.all([p.waitForEvent('download',{timeout:5000}).catch(()=>null),p.click('#photoBtn')]);
if(dl){const f=out+'/F5-anh-tiem.png';await dl.saveAs(f);ok(fs.statSync(f).size>50000,'chụp ảnh tiệm: tải file '+dl.suggestedFilename()+' ('+Math.round(fs.statSync(f).size/1024)+'KB)')}else ok(false,'chụp ảnh tiệm: không có file tải về');
ok(await p.evaluate(()=>!!S.ach.photo),'mở huy hiệu Nhiếp ảnh gia');
// 7. cài đặt
await p.evaluate(()=>{tab='luu';renderPrep()});await p.waitForTimeout(200);
await p.click('[data-set="snd"]');await p.click('[data-set="eco"]');
ok(await p.evaluate(()=>SND===false&&ECO===true&&localStorage.getItem('tt_snd')==='0'&&localStorage.getItem('tt_eco')==='1'),'tắt âm thanh, bật tiết kiệm pin, nhớ lại sau khi tải lại');
await p.screenshot({path:out+'/F6-caidat.png'});
await p.click('[data-set="eco"]');await p.click('[data-set="snd"]');
ok(errs.length===0,'không có lỗi JS '+errs.join(' | '));
await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
