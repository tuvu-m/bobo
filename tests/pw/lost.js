// Thẻ khách để quên đồ: đại gia để quên, có nhân viên Tinh ý thấy cảnh sát chìm
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const out=process.argv[3];
for(const [W,H] of [[390,780],[375,667]]){const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');ASK_P=1;S.notice=[];S.day=20;S.money=3e6;['hongtra','suadac'].forEach(k=>S.stock[k]=[{q:99,e:99}]);S.staff=[];syncLayout();renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(700);
await p.evaluate(()=>{D.next=1e9;D.evPlan=[];D.queue=[];D.pend=[];D.ev=null;spawn('chim');spawn('sop');D.queue.forEach(c=>{c.max=300;c.p=300});const c=D.queue.find(x=>x.type==='sop');let k=0;const R=Math.random;Math.random=()=>k++?R():.01;lostMaybe(c);Math.random=R});
await p.waitForTimeout(1500);console.log(W+'x'+H,'thẻ:',await p.$eval('#tk',e=>e.innerText.replace(/\s+/g,' ')));await p.screenshot({path:`${out}/lost-${W}.png`});
const m0=await p.evaluate(()=>S.money);await p.click('#tk [data-dec="im"]');await p.waitForTimeout(500);
console.log('  ỉm khi có cảnh sát:',await p.$eval('#toast',e=>e.textContent),'| tiền',await p.evaluate(m=>S.money-m,m0));await p.screenshot({path:`${out}/lost-${W}-caught.png`});
console.log('  lỗi JS:',errs.length?errs.join(' | '):'không');await ctx.close()}
await b.close()})();
