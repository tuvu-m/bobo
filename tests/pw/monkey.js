// Chạm loạn như người chơi thật (vuốt hàng thẻ, chạm thẻ, nút lấy order, phụ nhân viên, ← Quán, tạm dừng, chọn thẻ sự kiện) theo thời gian thật,
// dò lúc đứng hình: còn ly chờ pha được mà pha chế rảnh, hoặc kiên nhẫn của mọi khách không đổi
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');const fs=require('fs');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const H=process.argv[2],f=process.argv[3],SECS=+(process.argv[4]||240),SEED=+(process.argv[5]||1);
let seed=SEED*7919;const R=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});
await ctx.addInitScript(j=>{if(!sessionStorage.getItem('x')){localStorage.setItem('tiemtra3',j);localStorage.setItem('tt_bgm','0');localStorage.setItem('tt_snd','0');sessionStorage.setItem('x','1')}},fs.readFileSync(f,'utf8'));
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CE '+m.text().slice(0,300))});
const cdp=await ctx.newCDPSession(p);
await p.goto(pathToFileURL(H).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
const pre=await p.evaluate(()=>{S.notice=[];syncLayout();try{autoLay()}catch(e){}try{autoBuy()}catch(e){}if(S.licDue)S.licDue=null;renderPrep();startDay();
  // bộ dò đứng hình chạy theo thời gian thật trong trang
  window.__M={act:[],snaps:[],idleMax:0,patMax:0};let lastSig=null,patSince=performance.now(),idleSince=null;
  setInterval(()=>{if(!D||PAUSED)return;const M=window.__M,t=performance.now();
    const sig=D.queue.filter(c=>!c.dec).map(c=>c.p.toFixed(3)).join();const waiting=D.queue.some(c=>!c.dec&&c.items.some(it=>!it.done));
    if(waiting&&sig===lastSig){const d=t-patSince;if(d>M.patMax){M.patMax=d;if(d>1500)M.snaps.push({k:'pat',d:d|0,st:snap()})}}else patSince=t;lastSig=sig;
    const freeB=hasRole('barista').filter(s=>!s.w&&!(s.idle>0)&&!(s.brkT>now)).length;let freeO=0;for(const c of D.queue){if(c.dec)continue;for(let i=0;i<c.items.length;i++)if(freeIt(c,i)&&!missingOf(c.items[i]).length&&c.in)freeO++}
    if(freeB&&freeO){if(idleSince==null)idleSince=t;const d=t-idleSince;if(d>M.idleMax){M.idleMax=d;if(d>1500&&(!M.lastIdleSnap||t-M.lastIdleSnap>3000)){M.lastIdleSnap=t;M.snaps.push({k:'idle',d:d|0,st:snap()})}}}else idleSince=null},100);
  window.snap=()=>({clock:D.clock.toFixed(2),q:D.queue.length,dec:D.queue.filter(c=>c.dec).length,ev:!!D.ev,pend:D.pend.length,away:D.away>now,MK,PV,cup:!!cup,cupStaff:cup&&cup.staff,sealing:!!sealing,hold:(qHold-performance.now())|0,tk:document.querySelector('#shop').className,
    staff:S.staff.map(s=>s.role[0]+':'+(s.w?(s.w.broken?'B':'w'+s.w.steps[s.w.i]+(s.w.got?'g':'')):'-')+(s.idle>0?'i':'')).join(' '),act:window.__M.act.slice(-6).join(' > ')});
  return{day:S.day,lv:S.shop,staff:S.staff.map(s=>s.role).join(','),total:D.total}});
console.log(f.split('/').pop(),'ngày',pre.day,'cấp',pre.lv+1,'NV',pre.staff,'khách',pre.total);
const touch=async(type,x,y)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y}]});
const t0=Date.now();
while(Date.now()-t0<SECS*1000){
  const st=await p.evaluate(()=>{if(!D)return{end:1};const r=s=>{const e=document.querySelector(s);if(!e||e.offsetParent===null)return null;const b=e.getBoundingClientRect();return b.width?{x:b.left+b.width/2,y:b.top+b.height/2,w:b.width,h:b.height,l:b.left,t:b.top}:null};
    return{MK,cup:!!cup,paused:PAUSED,qrow:r('#qrow'),cards:[...document.querySelectorAll('#qrow .qc')].map(e=>{const b=e.getBoundingClientRect();return{x:b.left+b.width/2,y:b.top+b.height/2,on:b.left>0&&b.right<innerWidth}}).filter(c=>c.on),next:r('.nextBtn'),back:r('#backQ'),stf:[...document.querySelectorAll('#stfs [data-shelp], #stfs [data-sdrop]')].map(e=>{const b=e.getBoundingClientRect();return{x:b.left+b.width/2,y:b.top+b.height/2}}),
      opts:[...document.querySelectorAll('#tk button')].filter(e=>e.offsetParent).map(e=>{const b=e.getBoundingClientRect();return{x:b.left+b.width/2,y:b.top+b.height/2}}),pause:r('#pauseBtn'),resume:r('#pauseOv:not([hidden]) .btn')}});
  if(st.end)break;
  const a=R();let act='';
  try{
  if(st.paused){if(st.resume){await p.touchscreen.tap(st.resume.x,st.resume.y);act='resume'}else{await p.evaluate(()=>resumeGame());act='resumeJS'}}
  else if(st.opts.length&&a<.3){const o=st.opts[Math.floor(R()*st.opts.length)];await p.touchscreen.tap(o.x,o.y);act='tkopt'}
  else if(!st.MK){
    if(a<.35&&st.qrow){const y=st.qrow.y,x1=st.qrow.l+st.qrow.w*(.3+.5*R()),dx=(R()<.5?-1:1)*(60+120*R());await touch('touchStart',x1,y);for(let k=1;k<=6;k++){await touch('touchMove',x1+dx*k/6,y);await p.waitForTimeout(16)}await touch('touchEnd',0,0);
      await p.evaluate(dx=>{const el=document.querySelector('#qrow');el.scrollLeft-=dx},dx);act='swipe'}
    else if(a<.6&&st.cards.length){const c=st.cards[Math.floor(R()*st.cards.length)];await p.touchscreen.tap(c.x,c.y);act='card'}
    else if(a<.75&&st.next){await p.touchscreen.tap(st.next.x,st.next.y);act='next'}
    else if(a<.82&&st.stf.length){const s=st.stf[Math.floor(R()*st.stf.length)];await p.touchscreen.tap(s.x,s.y);act='staffchip'}
    else if(a<.84&&st.pause){await p.touchscreen.tap(st.pause.x,st.pause.y);act='pause'}
    else act='wait'}
  else{ // màn pha: lúc thì pha xong chạm máy đóng gói, lúc về quán
    if(a<.25&&st.back){await p.touchscreen.tap(st.back.x,st.back.y);act='back'}
    else if(a<.7){act=await p.evaluate(()=>{if(!cup||sealing)return 'mk-wait';const c=target(),it=c&&c.items[c.cur];if(!it)return 'mk-none';if(Math.random()<.5)return 'mk-think';
      Object.assign(cup,{pours:it.bs.map(k=>({k,amt:TARGET/it.bs.length})),fill:TARGET,syrups:[...(it.ss||[])],tops:[...it.ts],foams:[...(it.fs||[])],sugar:it.sugar?SUGAR[it.sugar]:0,ice:it.ice?ICE[it.ice][1]:0,skin:it.sk||null,gem:it.gem||null,lyOk:1});trySeal();return 'seal'})}
    else act='mk-idle'}
  }catch(e){act='ERR '+e.message.slice(0,80)}
  await p.evaluate(a=>{window.__M.act.push(a);if(window.__M.act.length>50)window.__M.act.shift()},act);
  await p.waitForTimeout(250+R()*900)}
const M=await p.evaluate(()=>({idleMax:window.__M.idleMax|0,patMax:window.__M.patMax|0,snaps:window.__M.snaps,D:!!D,clock:D&&D.clock}));
console.log('  pha chế rảnh khi còn ly lâu nhất',(M.idleMax/1000).toFixed(1)+'s · kiên nhẫn đứng yên lâu nhất',(M.patMax/1000).toFixed(1)+'s · giờ',M.clock);
const seen=new Set();M.snaps.forEach(s=>{const k=s.k+JSON.stringify(s.st).slice(0,60);if(seen.size<12){seen.add(k);console.log('  ',s.k,s.d+'ms',JSON.stringify(s.st))}});
console.log('  lỗi trang:',errs.length?[...new Set(errs)].slice(0,8).join(' || '):'không');await b.close()})();
