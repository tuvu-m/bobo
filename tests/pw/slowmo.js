// Đo game có bị "chậm như đứng hình" lúc đông không: tỉ lệ thời gian trong game / thời gian thật mỗi 3 giây, thời gian mỗi khung frame0, với CPU chậm như điện thoại
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');const fs=require('fs');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const H=process.argv[2],f=process.argv[3],SECS=+(process.argv[4]||200),THR=+(process.argv[5]||4),LV=process.argv[6];
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:3,isMobile:true,hasTouch:true});
await ctx.addInitScript(j=>{if(!sessionStorage.getItem('x')){localStorage.setItem('tiemtra3',j);localStorage.setItem('tt_bgm','0');localStorage.setItem('tt_snd','0');sessionStorage.setItem('x','1')}},fs.readFileSync(f,'utf8'));
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('CE '+m.text().slice(0,300))});
const cdp=await ctx.newCDPSession(p);
await p.goto(pathToFileURL(H).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
const pre=await p.evaluate(LV=>{S.notice=[];if(LV){S.shop=+LV;while(S.staff.length<staffMax()){const s=genStaff();s.role='barista';s.mood=90;S.staff.push(s)}}syncLayout();try{autoLay()}catch(e){}try{autoBuy()}catch(e){}if(S.licDue)S.licDue=null;renderPrep();startDay();
  const W=window.__W={win:[],ft:[],t0:performance.now(),n0:now,worst:null};const f0=frame0;frame0=function(t){const a=performance.now();f0(t);const d=performance.now()-a;W.ft.push(d)};
  setInterval(()=>{if(!D)return;const t=performance.now(),dt=(t-W.t0)/1000,dn=now-W.n0;W.t0=t;W.n0=now;const ft=W.ft.splice(0),mx=ft.length?Math.max(...ft):0,avg=ft.length?ft.reduce((a,b)=>a+b,0)/ft.length:0;
    W.win.push({clock:+D.clock.toFixed(1),q:D.queue.length,walk:D.walk.length,rush:!!rushNow(),ratio:+(dn/dt).toFixed(2),fps:+(ft.length/dt).toFixed(1),avg:+avg.toFixed(1),max:+mx.toFixed(0)})},3000);
  return{day:S.day,lv:S.shop,staff:S.staff.map(s=>s.role).join(','),total:D.total}},LV);
await cdp.send('Emulation.setCPUThrottlingRate',{rate:THR});
console.log(f.split('/').pop(),'ngày',pre.day,'cấp',pre.lv+1,'NV',pre.staff,'khách',pre.total,'CPU chậm',THR+'x');
const t0=Date.now();while(Date.now()-t0<SECS*1000){await p.waitForTimeout(3000);if(await p.evaluate(()=>!D))break;
  // người chơi: thỉnh thoảng lấy order và pha xong ngay
  await p.evaluate(()=>{if(!D)return;if(!cup&&!sealing&&D.away<=now){const n=nextIt();if(n&&!n.miss){takeOrder(n.c,n.i,null)}}else if(cup&&!sealing){const c=target(),it=c&&c.items[c.cur];if(it){Object.assign(cup,{pours:it.bs.map(k=>({k,amt:TARGET/it.bs.length})),fill:TARGET,syrups:[...(it.ss||[])],tops:[...it.ts],foams:[...(it.fs||[])],sugar:it.sugar?SUGAR[it.sugar]:0,ice:it.ice?ICE[it.ice][1]:0,skin:it.sk||null,gem:it.gem||null,lyOk:1});trySeal()}}})}
const W=await p.evaluate(()=>window.__W.win);
W.forEach(w=>console.log('  '+JSON.stringify(w)));
const slow=W.filter(w=>w.ratio<.8);console.log('  cửa sổ chậm (<0.8):',slow.length,'/',W.length,' · tỉ lệ thấp nhất',Math.min(...W.map(w=>w.ratio)));
console.log('  lỗi trang:',errs.length?[...new Set(errs)].slice(0,8).join(' || '):'không');await b.close()})();
