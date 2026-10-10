// Chạy save thật (do bot tạo) qua đúng vòng lặp frame0 với thời gian giả, bắt mọi lỗi bị frame nuốt và đo lúc "đứng hình"
// (khách không mất kiên nhẫn, pha chế không tiến triển trong khi hàng còn khách)
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');const fs=require('fs');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const H=process.argv[2],dumps=process.argv.slice(3);
for(const f of dumps){
 const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await ctx.addInitScript(j=>{if(!sessionStorage.getItem('x')){localStorage.setItem('tiemtra3',j);localStorage.setItem('tt_askp','100');localStorage.setItem('tt_bgm','0');localStorage.setItem('tt_snd','0');sessionStorage.setItem('x','1')}},fs.readFileSync(f,'utf8'));
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CE '+m.text().slice(0,200))});
 await p.goto(pathToFileURL(H).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
 for(let day=0;day<2;day++){
  const pre=await p.evaluate(()=>{S.notice=[];syncLayout();try{autoLay()}catch(e){}try{autoBuy()}catch(e){}renderPrep();
    if(S.licDue)S.licDue=null;
    const st=openBtnState?openBtnState():null;startDay(emergencyNeeded&&emergencyNeeded());
    window.__F={T:performance.now()+1e7,E:{},PT:0,frz:[],last:null,frames:0,maxStall:0};return{day:S.day,lv:S.shop,staff:S.staff.map(s=>s.role).join(','),total:D&&D.total}});
  let done=false,guard=0;
  while(!done&&guard++<400){done=await p.evaluate(()=>{const F=window.__F;
    for(let k=0;k<200;k++){if(!D)return true;F.T+=50;F.frames++;
      try{frame0(F.T)}catch(e){const key=(e.stack||String(e)).split('\n').slice(0,4).join(' | ');F.E[key]=(F.E[key]||0)+1}
      if(!D)return true;
      // người chơi bot: lấy order, 8–12 giây sau pha đủ rồi chạm máy đóng gói
      try{if(!cup&&!sealing&&D.away<=now){const n=nextIt();if(n&&!n.miss&&Math.random()<.05){takeOrder(n.c,n.i,null);F.PT=now+8+Math.random()*4}}
      else if(cup&&!sealing&&now>=F.PT){const c=D.queue.find(x=>x.id===cup.cid);const it=c&&c.items[cup.ix];if(it&&!it.done){Object.assign(cup,{pours:it.bs.map(k=>({k,amt:TARGET/it.bs.length})),fill:TARGET,syrups:[...(it.ss||[])],tops:[...it.ts],foams:[...(it.fs||[])],sugar:it.sugar?SUGAR[it.sugar]:0,ice:it.ice?ICE[it.ice][1]:0,skin:it.sk||null,gem:it.gem||null});trySeal()}else{cup=null;PV=false}}
      S.staff.forEach(x=>{if(x.w&&x.w.broken){x.bk=(x.bk||0)+.05;if(x.bk>1.5){x.bk=0;staffDrop(x.id)}}})}catch(e){const key='BOT '+(e.stack||String(e)).split('\n').slice(0,3).join(' | ');F.E[key]=(F.E[key]||0)+1}
      // đứng hình: còn khách chờ (không đang quyết định) mà tổng kiên nhẫn và tiến độ nhân viên không đổi
      const sig=D.queue.filter(c=>!c.dec).map(c=>c.p.toFixed(2)).join()+'|'+S.staff.map(s=>s.w?(s.w.acc+s.w.t).toFixed(2):'-').join();
      const waiting=D.queue.some(c=>!c.dec&&c.items.some(it=>!it.done));
      if(waiting&&sig===F.last){F.st=(F.st||0)+1;if(F.st>F.maxStall){F.maxStall=F.st;F.stallInfo={clock:D.clock.toFixed(2),q:D.queue.length,ev:!!D.ev,pend:D.pend.length,away:D.away>now,MK,PV,cup:!!cup,sealing:!!sealing,exam:!!D.exam,staff:S.staff.map(s=>s.role+':'+(s.w?(s.w.broken?'broken':'w'):'-')+(s.idle>0?'idle':'')).join(' ')}}}else F.st=0;F.last=sig}
    return false});
  }
  const r=await p.evaluate(()=>({F:{frames:window.__F.frames,maxStall:window.__F.maxStall,stallInfo:window.__F.stallInfo,E:window.__F.E},D:!!D}));
  console.log(f.split('/').pop(),'ngày',pre.day,'cấp',pre.lv+1,'NV',pre.staff,'khách',pre.total,'· khung',r.F.frames,'· đứng lâu nhất',(r.F.maxStall*.05).toFixed(1)+'s',JSON.stringify(r.F.stallInfo||{}),r.D?'· CHƯA XONG NGÀY':'');
  for(const k in r.F.E)console.log('  LỖI x'+r.F.E[k]+': '+k);
  if(r.D)break;
  // sang ngày mới
  await p.evaluate(()=>{try{const b=document.querySelector('#sumNext')||[...document.querySelectorAll('button')].find(x=>/Ngày mới|Tiếp|ngày tiếp/i.test(x.textContent));if(b)b.click()}catch(e){}});await p.waitForTimeout(300);
 }
 console.log('  lỗi trang:',errs.length?[...new Set(errs)].slice(0,8).join(' || '):'không');await ctx.close()}
await b.close()})();
