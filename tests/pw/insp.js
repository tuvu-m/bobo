// Thanh tra đột xuất trong ngày bán: vào như khách, thẻ order có 📋, nhân viên không nhận, chạm thẻ thì bạn lấy ly của thanh tra
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=40;S.shop=1;S.money=5e7;['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:99}]);
  S.staff=[...Array(2)].map(()=>Object.assign(genStaff(),{role:'barista',trait:'chamchi',skill:5,spd:4,mood:90}));syncLayout();renderPrep()});
await p.click('#openBtn');await p.evaluate(()=>{D.evPlan=[];D.insp={at:D.clock}});
await p.waitForFunction(()=>D&&D.queue.some(c=>c.insp&&c.in),null,{timeout:20000});await p.waitForTimeout(1500);
const r=await p.evaluate(()=>{const c=D.queue.find(x=>x.insp),card=document.querySelector(`#qrow [data-qc="${c.id}:0"]`);return{n:c.items.length,sj:c.items.some(it=>it.sj),badge:card&&card.querySelector('.qown')&&card.querySelector('.qown').textContent,id:c.id}});
ok(r.n>=2&&r.n<=3,`thanh tra gọi ${r.n} ly`);ok(!r.sj,'nhân viên không nhận ly của thanh tra');ok(r.badge==='📋','thẻ order có dấu 📋');
await p.evaluate(id=>{document.querySelector(`#qrow [data-qc="${id}:0"]`).scrollIntoView({inline:'center'})},r.id);await p.waitForTimeout(400);
const box=await p.evaluate(id=>{const e=document.querySelector(`#qrow [data-qc="${id}:0"]`).getBoundingClientRect();return[e.left+e.width/2,e.top+e.height/2]},r.id);
await p.touchscreen.tap(...box);await p.waitForTimeout(500);
ok(await p.evaluate(id=>!!cup&&cup.cid===id,r.id),'chạm thẻ: bạn lấy ly của thanh tra để pha');
await p.screenshot({path:'insp.png'});
ok(!errs.length,'không lỗi JS '+errs.join('|'));await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
