// Cấp 5, 6 pha chế nhanh: người chơi cuộn hàng thẻ, chọn một order đang chờ ở cuối hàng rồi chạm thật → phải lấy đúng order đó
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
let cdp;(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=260;S.shop=4;S.money=5e7;['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:99}]);
  S.staff=[...Array(6)].map(()=>Object.assign(genStaff(),{role:'barista',trait:'chamchi',skill:5,spd:4,mood:90}));syncLayout();renderPrep()});
await p.click('#openBtn');cdp=await ctx.newCDPSession(p);await p.waitForTimeout(8000);
let got=0,tries=0,intr=0;
for(let k=0;k<12;k++){await p.waitForTimeout(1200);await p.evaluate(()=>{S.staff.forEach(x=>{if(x.w&&x.w.broken)staffDrop(x.id)});if(D.ev)resolveEvent(false,true);{const q=D.pend[0];if(q){if(q.t0!=null)pendPick(q,'back');else{D.pend.shift();q.c.dec=false;settle(q.c,q.s,null,q.notes)}}}});await p.waitForTimeout(300);
  const box=await p.$eval('#qrow',el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}});
  // vuốt sang trái bằng ngón tay thật
  const y=box.y+box.h/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.w-30,y}]});
  for(let s=1;s<=8;s++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.w-30-s*25,y}]});await p.waitForTimeout(30)}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await p.evaluate(()=>{const el=document.querySelector('#qrow'),w=[...el.querySelectorAll('.qc.wait')].pop();if(w){const t=Math.max(0,w.offsetLeft+w.offsetWidth-el.clientWidth);if(Math.abs(el.scrollLeft-t)>1)el.scrollLeft=t}});
  await p.waitForTimeout(600); // người chơi nhìn rồi nhắm
  const pick=await p.evaluate(()=>{const el=document.querySelector('#qrow'),r=el.getBoundingClientRect();const L=[...el.querySelectorAll('.qc.wait')].filter(n=>{const b=n.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1});
    const n=L[L.length-1];if(!n)return null;const b=n.getBoundingClientRect();return{qc:n.dataset.qc,x:b.left+b.width/2,y:b.top+b.height/2}});
  console.log('  ',JSON.stringify(await p.evaluate(()=>{const el=document.querySelector('#qrow');return{sl:el.scrollLeft,sw:el.scrollWidth,cw:el.clientWidth,wait:el.querySelectorAll('.qc.wait').length,all:el.children.length,cls:[...el.children].map(n=>n.className.replace('qc ','')).join(','),hold:qHold-performance.now()|0}})));
  await p.screenshot({path:'qpick_'+k+'.png'});console.log('   st',JSON.stringify(await p.evaluate(()=>({MK,PV,cup:!!cup,paused:typeof paused!=='undefined'?paused:null,tab:document.querySelector('.tabbar .on')?.textContent,ev:!!D.ev,pend:D.pend.length,away:D.away>now}))));
  if(!pick)continue;tries++;
  await p.evaluate(()=>{window.__clk=0;window.__tst='';if(!window.__inst){window.__inst=1;document.querySelector('#qrow').addEventListener('click',()=>window.__clk++,true);const t0=toast;toast=function(m){window.__tst=String(m);return t0.apply(this,arguments)}}});
  const pre=await p.evaluate(qc=>{const [cid,i]=qc.split(':').map(Number),c=D.queue.find(y=>y.id===cid);const n=document.querySelector(`[data-qc="${qc}"]`);return{away:D.away>now,cup:!!cup,st:c?qState(c,i).k:'gone',cls:n&&n.className,hit:(()=>{const b=n&&n.getBoundingClientRect();if(!b)return null;const e=document.elementFromPoint(b.left+b.width/2,b.top+b.height/2);if(e&&e.tagName==='CANVAS'){let hid='';for(let q=document.querySelector('#qrow');q;q=q.parentElement)if(getComputedStyle(q).display==='none'){hid=(q.id||q.className);break}return 'HIDDEN by '+hid+' MK='+MK+' cup='+!!cup+' sealing='+!!sealing+' body='+document.body.className+' shop='+document.querySelector('#shop').className+' PV='+PV;const r=e.getBoundingClientRect(),cs=getComputedStyle(e);return 'CANVAS#'+e.id+' '+e.parentElement.id+'.'+e.parentElement.className+' '+[r.left,r.top,r.width,r.height].map(Math.round)+' pe='+cs.pointerEvents+' z='+cs.zIndex+' pos='+cs.position+' | qrow '+JSON.stringify(document.querySelector('#qrow').getBoundingClientRect())+' card '+JSON.stringify(b)}return e&&(e.closest('[data-qc]')?.dataset.qc||e.className||e.tagName)})()}},pick.qc);
  await p.touchscreen.tap(pick.x,pick.y);await p.waitForTimeout(250);
  const r=await p.evaluate(qc=>{const [cid,i]=qc.split(':').map(Number);const res={mine:!!cup&&cup.cid===cid&&cup.ix===i&&!cup.staff,staff:!!(cup&&cup.staff),MK};if(cup)useTool('trash');PV=false;syncMode();return res},pick.qc);
  if(!r.mine&&(pre.away||pre.cup||/HIDDEN/.test(pre.hit||'')||/ở ngoài/.test((await p.evaluate(()=>window.__tst))||''))){intr++;continue}if(r.mine)got++;else console.log('  chạm',pick.qc,JSON.stringify(r),JSON.stringify(pre),JSON.stringify(await p.evaluate(()=>({clk:window.__clk,tst:window.__tst}))))}
ok(tries-intr>=3&&got===tries-intr,`chọn order ở cuối hàng: lấy đúng ${got}/${tries-intr} lần (thêm ${intr} lần thẻ sự kiện bật lên đúng lúc chạm)`);
ok(!errs.length,'không lỗi JS '+errs.join('|'));await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
