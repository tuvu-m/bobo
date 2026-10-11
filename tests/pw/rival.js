// Tiệm đối thủ ở tab Quầy: thẻ có thanh máu, chiêu của họ hôm nay, 3 nút chiêu của bạn (+3/+6/+10%, giá theo cấp); chạm thì trừ tiền, chọn được 1 chiêu/ngày
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext({viewport:{width:375,height:740},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
const r=await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=30;S.money=5e7;S.rival={name:'Mochi Tea',t:.87,start:30,w:2,l:1,n:3,hp:58,pull:.05,tac:'kol',tacDay:30};tab='quay';renderPrep();
  const c=document.querySelector('.rvcard');return{card:!!c,txt:c&&c.textContent.replace(/\s+/g,' '),hit:c&&[...c.querySelectorAll('[data-rvc].pink')].map(e=>e.dataset.rvc),hpw:c&&c.querySelector('.hpbar i').style.width}});
ok(r.card&&/Mochi Tea/.test(r.txt)&&/❤️ 58/.test(r.txt)&&r.hpw==='58%','thẻ đối thủ ở đầu tab Quầy: tên, ❤️ 58, thanh máu 58%');
ok(/📱 thuê KOL/.test(r.txt)&&/Khuyến mãi \+3%/.test(r.txt)&&/Tặng topping \+6%/.test(r.txt)&&/Thuê KOL \+10%/.test(r.txt),'thẻ ghi chiêu của họ và 3 chiêu của bạn: +3%, +6%, +10% kèm giá');
const bb=await p.evaluate(()=>{const e=document.querySelector('[data-rvc="kol"]').getBoundingClientRect();return[e.left+e.width/2,e.top+e.height/2]});
const m0=await p.evaluate(()=>S.money);await p.touchscreen.tap(...bb);await p.waitForTimeout(250);
const a=await p.evaluate(()=>({my:S.rival.my,dm:S.money,dis:[...document.querySelectorAll('[data-rvc]')].every(e=>e.disabled),chk:document.querySelector('[data-rvc="kol"]').textContent}));
ok(a.my&&a.my.k==='kol'&&a.dm<m0&&a.dis&&/✓/.test(a.chk),`chạm Thuê KOL: trừ ${Math.round((m0-a.dm)/1000)}k, đánh dấu ✓, khoá các nút còn lại (1 chiêu/ngày)`);
await p.evaluate(()=>document.querySelector('.rvcard').scrollIntoView({block:'center'}));await p.waitForTimeout(150);await p.screenshot({path:'rival.png'});
ok(!errs.length,'không lỗi JS '+errs.join('|'));await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
