// 5 nhân vật mới trong game: thẻ order, thẻ tung đồng xu, phiếu tiếng Anh, đồng hồ streamer
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const out=process.argv[3];
for(const [W,H] of [[390,780],[375,667]]){const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');ASK_P=1;S.notice=[];S.day=12;['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:99}]);syncLayout();renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(700);
await p.evaluate(()=>{D.next=1e9;D.evPlan=[];D.queue=[];D.pend=[];D.ev=null;['betthu','tay','streamer','thayboi'].forEach(t=>spawn(t));D.queue.forEach(c=>{c.max=300;c.p=300});tkKey='';renderTicket()});
await p.waitForTimeout(2500);await p.screenshot({path:`${out}/new-${W}-queue.png`});
// bà tám vào: hỏi tám chuyện
await p.evaluate(()=>{window.__q=D.queue;D.queue=[];spawn('batam');D.queue.at(-1).max=300});await p.waitForTimeout(1500);await p.screenshot({path:`${out}/new-${W}-batam.png`});
console.log(W+'x'+H,'thẻ bà tám:',await p.$eval('#tk',e=>e.innerText.replace(/\s+/g,' ').slice(0,120)));
await p.click('#tk [data-dec="yes"]');await p.waitForTimeout(600);await p.evaluate(()=>{D.queue=[...window.__q,...D.queue];layoutQ()});console.log('  nghe tám ->',await p.$eval('#toast',e=>e.textContent));
// Tây ba lô: phiếu tiếng Anh ở màn pha
await p.evaluate(()=>{D.away=0;const c=D.queue.find(x=>x.type==='tay');Object.assign(c.items[0],{sugar:50,ice:'it'});c.price=priceOf(c.items[0]);takeOrder(c,0)});await p.waitForTimeout(900);
console.log('  phiếu khách Tây:',await p.$eval('#ordp',e=>e.innerText.replace(/\s+/g,' ')));await p.screenshot({path:`${out}/new-${W}-tay.png`});
// streamer: nhận ly, đồng hồ đếm
await p.evaluate(()=>{useTool('trash');cup=null;const c=D.queue.find(x=>x.type==='streamer');takeOrder(c,0)});await p.waitForTimeout(1500);
console.log('  streamer:',await p.$eval('#ordp',e=>e.innerText.replace(/\s+/g,' ').slice(0,80)));await p.screenshot({path:`${out}/new-${W}-streamer.png`});
// Bet thủ: giao xong, thẻ tung đồng xu
await p.evaluate(()=>{useTool('trash');cup=null;show&&0;const c=D.queue.find(x=>x.type==='betthu');D.queue=[c];c.items[0].done=1;served(c,5,[],null)});await p.waitForTimeout(800);
console.log('  thẻ Bet thủ:',await p.$eval('#tk',e=>e.innerText.replace(/\s+/g,' ').slice(0,140)));await p.screenshot({path:`${out}/new-${W}-coin.png`});
await p.click('#tk [data-dec="ngua"]');await p.waitForTimeout(300);await p.screenshot({path:`${out}/new-${W}-coinspin.png`});await p.waitForTimeout(1500);console.log('  kết quả:',await p.$eval('#toast',e=>e.textContent));
console.log('  lỗi JS:',errs.length?errs.join(' | '):'không');await ctx.close()}
await b.close()})();
