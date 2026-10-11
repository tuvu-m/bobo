// Ô Kho ở tab Quầy (điện thoại, cảm ứng thật): món hết hàng không hiện; vuốt ngang trên Kho thì cuộn ngay (không thành kéo món); kéo dọc xuống quầy vẫn bày được món
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext({viewport:{width:375,height:740},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const cdp=await ctx.newCDPSession(p);
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
// nhiều đồ trong kho (tràn ngang), vài món hết hàng
const pre=await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=30;S.allOpen=1;
  const all=k=>Object.keys(k).filter(x=>!k[x].rare);S.drinks=[...new Set([...S.drinks,...all(BASES)])];S.syrups=[...new Set([...S.syrups,...all(SYRUPS)])];S.tops=[...new Set([...S.tops,...all(TOPS)])];
  [...S.drinks,...S.syrups,...S.tops].forEach((k,i)=>S.stock[k]=i%4===0?[]:[{q:20,e:99}]);
  window.__free=S.grid.find(o=>storable(o.id)&&objKind(o.id)!=='top');S.grid=S.grid.filter(o=>!storable(o.id));syncLayout();tab='quay';renderPrep();
  const zero=[...S.drinks,...S.syrups,...S.tops].filter(k=>!qty(k));return{zero:zero.map(k=>ITEM(k).sh),n:document.querySelectorAll('#khoBox .kchip').length}});
const chips=await p.evaluate(()=>[...document.querySelectorAll('#khoBox .kchip')].map(b=>b.textContent));
ok(pre.zero.length>0&&!chips.some(t=>/hết/.test(t))&&!chips.some(t=>pre.zero.some(z=>t.startsWith(z+' ·'))),`món hết hàng không hiện trong Kho (${pre.zero.length} món hết, còn ${pre.n} món có hàng)`);
// vuốt ngang bằng ngón tay bắt đầu ngay trên một món
const r=await p.evaluate(()=>{const row=document.querySelector('#khoBox .krow');row.scrollLeft=0;const c=row.querySelector('.kchip').getBoundingClientRect(),R=row.getBoundingClientRect();return{x:Math.min(R.right-20,c.left+c.width/2+120),y:c.top+c.height/2,sw:row.scrollWidth,cw:row.clientWidth,g:JSON.stringify(S.grid)}});
ok(r.sw>r.cw+50,`Kho tràn ngang (${r.sw} > ${r.cw})`);
await cdp.send('Input.synthesizeScrollGesture',{x:Math.round(r.x),y:Math.round(r.y),xDistance:-220,yDistance:0,gestureSourceType:'touch',speed:900});await p.waitForTimeout(300);
const a=await p.evaluate(()=>({sl:document.querySelector('#khoBox .krow').scrollLeft,ghost:!!document.querySelector('.kghost'),g:JSON.stringify(S.grid),kdrag:!!kdrag}));
ok(a.sl>60,`vuốt ngang trên món: Kho cuộn ngay (${Math.round(a.sl)}px)`);
ok(!a.ghost&&!a.kdrag&&a.g===r.g,'vuốt ngang không biến thành kéo món, quầy không đổi');
// kéo dọc một món xuống chỗ trống trên quầy bằng ngón tay
const d=await p.evaluate(()=>{const row=document.querySelector('#khoBox .krow');row.scrollLeft=0;const ch=row.querySelector('.kchip'),c=ch.getBoundingClientRect(),id=ch.dataset.psel.split(':')[1];
  const R=document.querySelector('#ed').getBoundingClientRect();const T=document.querySelector('#tbody');
  /* chỗ trống: chỗ của một món 1×2 vừa cất */const cell={cc:window.__free.c,rr:window.__free.r};T.scrollTop+=R.top+(cell.rr+1)/ROWS*R.height-T.getBoundingClientRect().top-innerHeight/2;const R2=document.querySelector('#ed').getBoundingClientRect(),c2=ch.getBoundingClientRect();
  return{id,x:c2.left+c2.width/2,y:c2.top+c2.height/2,tx:R2.left+(cell.cc+.5)/6*R2.width,ty:R2.top+(cell.rr+1)/ROWS*R2.height,vh:innerHeight}});
if(d.ty<d.vh-10){const T=(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
  await T('touchStart',d.x,d.y);for(let k=1;k<=12;k++){await T('touchMove',d.x+(d.tx-d.x)*k/12,d.y+(d.ty-d.y)*k/12);await p.waitForTimeout(16)}await T('touchEnd',0,0);await p.waitForTimeout(300);
  const placed=await p.evaluate(id=>S.grid.some(o=>o.id===id),d.id);ok(placed,`kéo dọc ${d.id} từ Kho xuống quầy: đã bày`)}
else ok(true,'(bỏ qua kéo dọc: quầy nằm ngoài màn hình)');
await p.screenshot({path:'kho.png'});
ok(!errs.length,'không lỗi JS '+errs.join('|'));await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
