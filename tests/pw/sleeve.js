// Khách gọi ly bọc giấy mùa: nhãn trên thẻ order, phiếu ở màn pha, viền cam ở xấp giấy
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
for(const [W,H] of [[390,780],[375,667]]){const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out=process.argv[3];
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=8;S.drinks=['hongtra','suadac','luctra'];['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:99}]);
  const sk=Object.keys(CUPSKIN).find(inSeason);S.owned.push(sk);syncLayout();renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(700);
await p.evaluate(()=>{D.next=1e9;D.evPlan=[];D.queue=[];D.pend=[];D.ev=null;const R=Math.random;Math.random=()=>.1;spawn('thuong');Math.random=()=>.9;spawn('thuong');Math.random=R;
  D.queue.forEach(c=>{c.max=200;c.p=200});layoutQ&&layoutQ();tkKey='';renderTicket()});
await p.waitForTimeout(500);
const tags=await p.$$eval('#qrow .qslv',e=>e.map(x=>x.textContent));ok(tags.length===1&&/Bọc/.test(tags[0]),W+'x'+H+' thẻ order của khách gọi ly bọc giấy có nhãn "'+tags[0]+'"');
await p.screenshot({path:`${out}/sleeve-${W}-queue.png`});
await p.click('#qrow .qc');await p.waitForTimeout(400);
const mk=await p.evaluate(()=>({ord:document.querySelector('#ordp')&&document.querySelector('#ordp').textContent,need:[...(orderNeeds()||[])].join()}));
ok(/Bọc/.test(mk.ord)&&/cs_/.test(mk.need),W+'x'+H+' màn pha: khung đơn có mục bọc giấy, xấp giấy viền cam ('+mk.need+')');
await p.screenshot({path:`${out}/sleeve-${W}-make.png`});
ok(!errs.length,'không có lỗi JS '+errs.join(' | '));await ctx.close()}
await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
