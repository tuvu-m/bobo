// Tiệm cấp 5 với 8 nhân viên: màn bán hàng có vừa màn hình không
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const out=process.argv[3];
for(const [W,H] of [[390,780],[375,667]]){const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=200;S.shop=4;S.money=5e7;['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:99}]);
  S.staff=[...Array(7)].map(()=>Object.assign(genStaff(),{role:'barista',trait:'chamchi',skill:5,spd:4,mood:90}));S.staff.push(Object.assign(genStaff(),{role:'cashier',mood:90}));syncLayout();renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(6000);
const r=await p.evaluate(()=>{const btn=document.querySelector('.nextBtn')||document.querySelector('#nextBtn');const r=btn&&btn.getBoundingClientRect();return{btnBottom:r&&Math.round(r.bottom),vh:innerHeight,scroll:document.documentElement.scrollHeight>innerHeight+2,stf:document.querySelectorAll('#stfs > *').length}});
console.log(W+'x'+H,JSON.stringify(r));await p.screenshot({path:`${out}/staff8-${W}.png`});console.log('  lỗi JS:',errs.length?errs.join(' | '):'không');await ctx.close()}
await b.close()})();
