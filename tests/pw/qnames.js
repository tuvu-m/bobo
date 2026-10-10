// Tên khách trên thẻ order không bị cắt; nút từ chối ở dòng cuối thẻ
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const out=process.argv[3];
for(const [W,H] of [[390,780],[375,667]]){const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=12;['hongtra','suadac','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:99}]);syncLayout();renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(700);
await p.evaluate(()=>{D.next=1e9;D.evPlan=[];D.queue=[];D.pend=[];['hocsinh','thuong','thuong','nhom'].forEach(t=>spawn(t));const N=['Em Thành','Bác Nguyệt','Anh Quang','Chị Phượng'];D.queue.forEach((c,i)=>{c.name=N[i]||c.name;c.max=300;c.p=300});const el=document.querySelector('#qrow');el.dataset.ks='';renderQ()});
await p.waitForTimeout(600);
const r=await p.$$eval('#qrow .qc',cs=>cs.map(c=>{const b=c.querySelector('.qch b');return {t:b.textContent,clip:b.scrollHeight>b.clientHeight+1||b.scrollWidth>b.clientWidth+1,x:!!c.querySelector('.qs .qx')}}));
console.log(W+'x'+H,JSON.stringify(r));await p.screenshot({path:`${out}/qnames-${W}.png`,clip:{x:0,y:0,width:W,height:420}});await p.evaluate(()=>document.querySelector('#qrow').scrollLeft=400);await p.waitForTimeout(200);await p.screenshot({path:`${out}/qnames-${W}-b.png`,clip:{x:0,y:0,width:W,height:420}});
await p.click('#qrow .qc .qx');await p.waitForTimeout(200);console.log('  bấm ✕:',await p.$eval('#qrow .qc .qx',e=>e.textContent));
console.log('  lỗi JS:',errs.length?errs.join(' | '):'không');await ctx.close()}
await b.close()})();
