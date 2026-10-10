// Khách quen có biệt danh: thẻ order, lời chào, danh sách ở tab Đánh giá (chạm để đổi)
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
for(const [W,H] of [[390,780],[375,667]]){const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2,isMobile:true,hasTouch:true});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out=process.argv[3];
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=20;S.drinks=['hongtra','suadac','luctra'];['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:99,e:99}]);
  S.regs=[{id:901,name:'Anh Tâm',age:'tre',sex:'m',fav:1,favName:'Trà sữa',visits:4,bad:0,nick:'răng hô',last:0},{id:902,name:'Chị Mai',age:'tre',sex:'f',fav:1,favName:'Trà sữa',visits:2,bad:0,nick:'dù',last:0},{id:903,name:'Bà Tư',age:'gia',sex:'f',fav:1,favName:'Trà sữa',visits:7,bad:0,last:0}];
  syncLayout();renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(700);
await p.evaluate(()=>{D.next=1e9;D.evPlan=[];D.queue=[];D.pend=[];D.ev=null;const R=Math.random;Math.random=()=>.05;spawn();spawn();Math.random=R;spawn('thuong');D.queue.forEach(c=>{c.max=200;c.p=200});tkKey='';renderTicket()});
await p.waitForTimeout(1600);
const q=await p.$$eval('#qrow .qc',e=>e.map(x=>x.querySelector('.qch b').textContent+' | '+((x.querySelector('.qt')||{}).textContent||'').trim()));
ok(q.filter(t=>/\| \S+ (răng hô|dù)$/.test(t)).length===2,W+'x'+H+' thẻ order: '+q.join(' ; '));
const greet=await p.evaluate(()=>Object.values(D.flo||{}).map(f=>f.say).filter(Boolean).join(' / '));console.log('     lời chào:',greet||'(không có Phục vụ)');
await p.screenshot({path:`${out}/nick-${W}-queue.png`});
await p.evaluate(()=>{D.queue=[];endDay()});await p.waitForTimeout(400);
await p.evaluate(()=>{show&&0;$('#shop').hidden=true;$('#prep').hidden=false;tab='rv';renderPrep()});await p.waitForTimeout(300);
await p.evaluate(()=>{const e=document.querySelector('.regs');e&&e.scrollIntoView({block:'center'})});await p.waitForTimeout(200);
const chips=await p.$$eval('.regc',e=>e.map(x=>x.textContent));ok(chips.length===3&&chips.some(t=>/Bà Tư \S/.test(t)),W+'x'+H+' tab Đánh giá: '+chips.join(' ; '));
await p.screenshot({path:`${out}/nick-${W}-list.png`});
const before=chips[0];await p.click('.regc');await p.waitForTimeout(300);const after=await p.$eval('.regc',x=>x.textContent);ok(before!==after,'chạm: đổi biệt danh '+before.split(' · ')[0]+' → '+after.split(' · ')[0]);
ok(!errs.length,'không có lỗi JS '+errs.join(' | '));await ctx.close()}
await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
