// Màn tổng kết: dòng gộp có ▸, chạm mở xem từng dòng; dòng gộp ghi kết quả (quẻ, tổng nợ, tung xu)
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];renderPrep()});await p.click('#openBtn');await p.waitForTimeout(500);
// chạy thật các đường tự quyết để chắc dòng nhật ký được ghi
await p.evaluate(()=>{ASK_P=0;D.evPlan=[];
  const mk=t=>{spawn(t);const c=D.queue.at(-1);return c};
  for(let i=0;i<3;i++){const c=mk('batam');D.queue=D.queue.filter(x=>x!==c);tamAsk(c)}D.away=0;
  for(let i=0;i<3;i++){const c=mk('thayboi');queDo(c)}
  D.log.push('Chị Lan ghi nợ 30.000đ.','Anh Tùng ghi nợ 45.000đ.');
});
// thanh toán thật cho bet thủ và học sinh qua served() (lúc đông thì nhân vật tự quyết)
await p.evaluate(()=>{for(const t of ['betthu','betthu','betthu','hocsinh','hocsinh']){spawn(t);const c=D.queue.at(-1);c.items.forEach(x=>x.done=1);served(c,5,[])}});
await p.evaluate(()=>{D.queue=[];D.spawned=D.total;D.clock=22.5});for(let i=0;i<30;i++){await p.waitForTimeout(300);if(await p.evaluate(()=>!D))break}await p.waitForTimeout(600);
const info=await p.evaluate(()=>[...document.querySelectorAll('#sumLog>li')].map(li=>li.querySelector('summary')?'▸ '+li.querySelector('summary').textContent+' ['+li.querySelectorAll('details li').length+']':li.textContent));
console.log(info.join('\n'));
ok(info.some(l=>{const m=l.match(/^▸ 🗣️ Bà tám kể (\d+) chuyện trong xóm \[(\d+)\]/);return m&&m[1]===m[2]&&+m[1]>=3}),'bà tám: dòng gộp có ▸, số chuyện khớp số dòng bên trong');
ok(info.some(l=>/^▸ 🎴 Thầy bói gieo 3 quẻ · /.test(l)),'thầy bói: dòng gộp ghi kết quả quẻ');
ok(info.some(l=>/^▸ 📒 2 khách ghi nợ · 75k/.test(l)),'ghi nợ: dòng gộp ghi tổng tiền');
ok(info.some(l=>/^▸ 🪙 Bet thủ tung xu 3 lần · \d+% ×\d/.test(l)),'bet thủ tự tung xu: có trong nhật ký, gộp');
ok(info.some(l=>/^▸ 🎒 2 học sinh trả giá học sinh/.test(l)),'học sinh tự trả giá học sinh: có trong nhật ký, gộp');
// chạm mở
const vis0=await p.evaluate(()=>{const d=[...document.querySelectorAll('#sumLog details')].find(x=>/Bà tám/.test(x.textContent));return d.querySelector('ul').getBoundingClientRect().height});
const sb=await p.evaluateHandle(()=>[...document.querySelectorAll('#sumLog summary')].find(x=>/Bà tám/.test(x.textContent)));await sb.scrollIntoViewIfNeeded();const bx=await sb.boundingBox();
await p.screenshot({path:'logexp0.png'});const vis0b=await p.evaluate(()=>{const d=[...document.querySelectorAll('#sumLog details')].find(x=>/Bà tám/.test(x.textContent));const li=d.querySelector('ul li');const r=li.getBoundingClientRect();const e=document.elementFromPoint(r.left+5,r.top+r.height/2);return{open:d.open,hit:!!e&&d.querySelector('ul').contains(e)}});console.log('trước khi chạm',JSON.stringify(vis0b));
await p.touchscreen.tap(bx.x+bx.width/2,bx.y+bx.height/2);await p.waitForTimeout(300);
const vis1=await p.evaluate(()=>{const d=[...document.querySelectorAll('#sumLog details')].find(x=>/Bà tám/.test(x.textContent));return{open:d.open,h:d.querySelector('ul').getBoundingClientRect().height,t:d.querySelector('ul').innerText}});
console.log('cao trước/sau:',vis0,vis1.h);ok(!vis0b.open&&!vis0b.hit&&vis1.open&&vis1.h>20,'chạm dòng bà tám: mở ra từng câu chuyện ('+vis1.t.split('\n')[0].slice(0,60)+'…)');
await p.screenshot({path:'logexp.png'});
await p.touchscreen.tap(bx.x+bx.width/2,bx.y+bx.height/2);await p.waitForTimeout(300);
ok(await p.evaluate(()=>![...document.querySelectorAll('#sumLog details')].find(x=>/Bà tám/.test(x.textContent)).open),'chạm lần nữa: đóng lại');
ok(!errs.length,'không lỗi JS '+errs.join('|'));await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
