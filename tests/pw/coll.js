// Sổ sưu tập ở tab Trang trí: đủ bộ thì có thông báo, bộ tô vàng, cúp vàng đứng trên bậu cửa sổ; đã đủ thì giữ dù số lượng tụt
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext({viewport:{width:375,height:740},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
const r=await p.evaluate(()=>{const T=[];const t0=toast;toast=(m,...a)=>{T.push(m);return t0(m,...a)};S.notice=[];S.day=60;S.allOpen=1;tab='trangtri';renderPrep();
  const before=document.querySelectorAll('.coll').length,done0=document.querySelectorAll('.coll.done').length;
  S.stat=S.stat||{};S.stat.inspCup=50;S.owned.push(...Object.keys(CUPSKIN));renderPrep();
  const done=[...document.querySelectorAll('.coll.done')].map(e=>e.textContent.replace(/\s+/g,' ').trim());
  /* cúp vẽ trên bậu cửa sổ: so điểm ảnh vùng bậu trước và sau khi có cúp */
  const shot=()=>{const c=document.createElement('canvas');const C=mk(c,160,62);C.s=4;c.width=640;c.height=248;const old=K;begin(C);drawScene(C,now,{});K=old;return c.getContext('2d').getImageData(4*112,4*24,4*30,4*6).data};
  const a=shot(),coll0=S.coll;S.coll={};const z=shot();S.coll=coll0;let diff=0;for(let i=0;i<a.length;i+=4)diff+=Math.abs(a[i]-z[i])>20;
  S.stat.inspCup=0;renderPrep();const keep=document.querySelectorAll('.coll.done').length;
  return{before,done0,done,toast:T.find(m=>/🏆/.test(m))||'',diff,keep}});
ok(r.before===7&&r.done0===0,`tab Trang trí có Sổ sưu tập 7 bộ (${r.before}), save mới chưa bộ nào đủ`);
ok(r.done.length===2&&/Ly cho thanh tra/.test(r.done.join())&&/Giấy bọc ly/.test(r.done.join()),'đủ bộ: tô vàng ('+r.done.join(' | ')+')');
ok(/🏆 Đủ bộ/.test(r.toast),'có thông báo: '+r.toast);
ok(r.diff>200,`cúp vàng hiện trên bậu cửa sổ (${r.diff} điểm ảnh khác)`);
ok(r.keep===2,'số lượng tụt sau này thì vẫn giữ cúp');
await p.evaluate(()=>document.querySelector('.colls').scrollIntoView({block:'center'}));await p.waitForTimeout(150);await p.screenshot({path:'coll.png'});
// chạm một bộ: mở danh sách đã có / còn thiếu ngay dưới hàng của bộ đó
await p.evaluate(()=>{S.stat.inspCup=0;S.gems=[{id:1,k:'kimtuyen'}];renderPrep()});
await p.evaluate(()=>document.querySelector('[data-coll="gem"]').scrollIntoView({block:'center'}));await p.waitForTimeout(150);
const gb=await p.evaluate(()=>{const e=document.querySelector('[data-coll="gem"]').getBoundingClientRect();return[e.left+e.width/2,e.top+e.height/2]});
await p.touchscreen.tap(...gb);await p.waitForTimeout(250);
const g=await p.evaluate(()=>{const d=document.querySelector('.colld');return d?{no:d.querySelectorAll('.no').length,ok:d.querySelectorAll('.ok').length,txt:d.textContent,prev:d.previousElementSibling&&d.previousElementSibling.dataset.coll}:null});
ok(g&&g.ok===1&&g.no===5&&/đi chợ/.test(g.txt),'chạm Đồ siêu hiếm: 1 đã có ✓, 5 còn thiếu ❔, ghi cách kiếm');
ok(g&&(g.prev==='gem'||g.prev==='bang'),'chi tiết mở ngay dưới hàng của bộ đó');
await p.screenshot({path:'coll_det.png'});
await p.touchscreen.tap(...await p.evaluate(()=>{const e=document.querySelector('[data-coll="gem"]').getBoundingClientRect();return[e.left+e.width/2,e.top+e.height/2]}));await p.waitForTimeout(200);
ok(await p.evaluate(()=>!document.querySelector('.colld')),'chạm lần nữa: đóng lại');
ok(!errs.length,'không lỗi JS '+errs.join('|'));await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
