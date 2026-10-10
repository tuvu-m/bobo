// Hàng thẻ order khi nhân viên pha nhanh: thẻ không bị dựng lại cả hàng, cuộn đứng yên, đang chạm thì danh sách đứng yên
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();p.on('console',m=>{if(m.text().startsWith('JUMP'))console.log(m.text())});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=260;S.shop=4;S.money=5e7;['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:99}]);
  S.staff=[...Array(6)].map(()=>Object.assign(genStaff(),{role:'barista',trait:'chamchi',skill:5,spd:4,mood:90}));syncLayout();renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(9000);
// 1. không chạm: thẻ giữ nguyên còn lại vẫn là cùng một phần tử, cuộn đứng yên
const r=await p.evaluate(()=>new Promise(res=>{const el=document.querySelector('#qrow');el.scrollLeft=Math.min(230,el.scrollWidth-el.clientWidth);
  let held=0,same=0,diff=0,jumps=0,changes=0,lastKs=el.dataset.ks;let snap=new Map([...el.children].map(n=>[n.dataset.qc,n]));
  const vis=()=>{const sl=el.scrollLeft;return [...el.children].find(n=>n.offsetLeft+n.offsetWidth>sl+5)};let v=vis(),vOff=v?v.offsetLeft-el.scrollLeft:0;
  let n=0;const iv=setInterval(()=>{if(el.dataset.ks!==lastKs){changes++;lastKs=el.dataset.ks;
      for(const c of el.children){const o=snap.get(c.dataset.qc);if(o){if(o===c)same++;else if(o.dataset.k===c.dataset.k)diff++}}
      if(v&&v.isConnected&&Math.abs(v.offsetLeft-el.scrollLeft-vOff)>3){jumps++;console.log('JUMP',JSON.stringify({sl:el.scrollLeft,max:el.scrollWidth-el.clientWidth,d:v.offsetLeft-el.scrollLeft-vOff}))}}
    snap=new Map([...el.children].map(x=>[x.dataset.qc,x]));v=vis();vOff=v?v.offsetLeft-el.scrollLeft:0;
    if(n>=12&&qHold>performance.now())held++;if(++n>=60){clearInterval(iv);res({changes,same,diff,jumps,held})}},100)}));
ok(r.held===0,'game tự giữ chỗ cuộn không tính là người chơi chạm ('+r.held+')');ok(r.changes>=3&&r.diff===0&&r.jumps===0,`không chạm: danh sách đổi ${r.changes} lần, thẻ còn lại giữ nguyên phần tử (${r.same} lần, dựng lại ${r.diff}), thẻ đang xem không nhảy (${r.jumps} lần nhảy)`);
// 2. đang chạm/vuốt: danh sách đứng yên, buông ra thì cập nhật
const h=await p.evaluate(()=>new Promise(res=>{const el=document.querySelector('#qrow');el.dispatchEvent(new Event('touchmove'));const ks0=[...el.children].map(n=>n.dataset.qc).join('|');let moved=false,picks=0,early=0;const sj0=new Set();D.queue.forEach(c=>c.items.forEach(it=>{if(it.sj)sj0.add(it)}));
  let n=0;const iv=setInterval(()=>{el.dispatchEvent(new Event('touchmove'));if([...el.children].map(x=>x.dataset.qc).join('|')!==ks0)moved=true;D.queue.forEach(c=>c.items.forEach(it=>{if(it.sj&&!sj0.has(it)){picks++;if(n<8)early++;sj0.add(it)}}));
    if(++n>=30){clearInterval(iv);const free=D.queue.reduce((a,c)=>a+c.items.filter((it,i)=>!it.done&&freeIt(c,i)).length,0);setTimeout(()=>{let p2=0;D.queue.forEach(c=>c.items.forEach(it=>{if(it.sj&&!sj0.has(it))p2++}));res({picks,early,free,p2,moved,after:[...el.children].map(x=>x.dataset.qc).join('|')!==ks0,want:el.dataset.ks})},1600)}},100)}));
ok(!h.moved,'đang vuốt 3 giây: hàng thẻ đứng yên');ok(h.early===0,`mới vuốt: nhân viên chưa nhận ly mới (${h.early}), còn ${h.free} ly trống cho bạn chọn`);ok(h.picks>0,`vuốt lâu: nhân viên chờ tối đa 1 giây rồi vẫn nhận ly, không đứng im (${h.picks})`);ok(h.p2>=0,`buông ra (${h.p2})`);ok(h.after,'buông ra: hàng thẻ cập nhật');
const rs=await p.evaluate(()=>new Promise(res=>{const el=document.querySelector('#qrow');qHold=0;const a=el.scrollLeft;el.scrollLeft=a>40?a-40:a+40;setTimeout(()=>res({held:qHold>performance.now(),moved:el.scrollLeft!==a}),120)}));
ok(!rs.moved||rs.held,'cuộn thật (người chơi vuốt) thì giữ hàng thẻ');
ok(!errs.length,'không lỗi JS '+errs.join('|'));await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
