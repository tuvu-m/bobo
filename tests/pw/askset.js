// Cài đặt: thanh kéo tỉ lệ thẻ chọn; ô thông tin tiệm có chip 💎
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const out=process.argv[3];
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=40;S.allOpen=1;tab='luu';renderPrep()});await p.waitForTimeout(300);
await p.evaluate(()=>{const e=document.querySelector('[data-askp]');e&&e.scrollIntoView({block:'center'})});await p.waitForTimeout(200);
await p.screenshot({path:`${out}/askp.png`});
const r=await p.evaluate(()=>{const e=document.querySelector('[data-askp]');e.value=80;e.dispatchEvent(new Event('input',{bubbles:true}));return{ASK_P,ls:localStorage.getItem('tt_askp'),lbl:e.parentElement.querySelector('b').textContent}});console.log('kéo 80%:',JSON.stringify(r));
await p.evaluate(()=>{S.shop=3;tab='trangtri';renderPrep();document.querySelector('#tbody').scrollTop=0});await p.waitForTimeout(300);
console.log('ô tiệm:',await p.evaluate(()=>{const e=document.querySelector('.sstat');return e&&e.textContent}));await p.screenshot({path:`${out}/shopk.png`});
console.log('lỗi JS:',errs.length?errs.join(' | '):'không');await b.close()})();
