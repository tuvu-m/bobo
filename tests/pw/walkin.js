// Cấp 5, 6 pha chế nhanh: không ly nào giao khi khách còn đang đi từ cửa vào
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=260;S.shop=4;S.money=5e7;['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:99}]);
  S.staff=[...Array(6)].map(()=>Object.assign(genStaff(),{role:'barista',trait:'chamchi',skill:5,spd:5,mood:90}));syncLayout();renderPrep();
  window.__E={n:0,early:0,shift:0,wait:[]};const sc=serveCup;serveCup=function(c){__E.n++;if(!c.in)__E.early++;else{if(c.x-c.tx>2){__E.shift++;(__E.d=__E.d||[]).push(+(c.x-c.tx).toFixed(1)+(c.items.length>1?'g':''))}if(c._arr!=null)__E.wait.push(now-c._arr)}return sc.apply(this,arguments)};
  setInterval(()=>{if(D)D.queue.forEach(c=>{if(c.in&&c._arr==null)c._arr=now})},50)});
await p.click('#openBtn');
for(let i=0;i<10;i++){await p.waitForTimeout(3000);await p.evaluate(()=>{S.staff.forEach(x=>{if(x.w&&x.w.broken)staffDrop(x.id)});if(D.ev)resolveEvent(false,true);const q=D.pend[0];if(q){if(q.t0!=null)pendPick(q,'back');else{D.pend.shift();q.c.dec=false;settle(q.c,q.s,null,q.notes)}}})}
await p.screenshot({path:'walkin.png'});
const E=await p.evaluate(()=>({d:__E.d,n:__E.n,early:__E.early,shift:__E.shift,avgWait:__E.wait.length?(__E.wait.reduce((a,b)=>a+b,0)/__E.wait.length).toFixed(1):'-'}));
console.log('khoảng cách lúc giao khi đang nhích:',JSON.stringify(E.d));ok(E.n>=10&&E.early===0,`giao ${E.n} ly, ${E.early} ly giao khi khách còn đang đi từ cửa vào (${E.shift} ly lúc khách đang nhích lên trong hàng); khách tới chỗ rồi chờ TB ${E.avgWait}s`);
ok(!errs.length,'không lỗi JS '+errs.join('|'));await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
