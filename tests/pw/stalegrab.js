// Đang vuốt hàng thẻ: nhân viên chờ tối đa 1 giây rồi nhận ly, thẻ vẫn ghi "Chờ" (chưa dựng lại); chạm thẻ đó thì bạn lấy được ly
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=200;S.shop=3;S.money=5e7;['hongtra','suadac','luctra','den','trang'].forEach(k=>S.stock[k]=[{q:999,e:99}]);
  S.staff=[...Array(3)].map(()=>Object.assign(genStaff(),{role:'barista',trait:'chamchi',skill:5,spd:4,mood:90}));syncLayout();renderPrep()});
await p.click('#openBtn');
// chờ có hàng khách và có nhân viên rảnh
await p.waitForFunction(()=>D&&D.queue.filter(c=>c.in).length>=3,null,{timeout:60000});
const r=await p.evaluate(()=>new Promise(res=>{const el=document.querySelector('#qrow');
  // cho mọi nhân viên rảnh rồi giữ hàng thẻ như đang vuốt
  S.staff.forEach(s=>{if(s.w){const c=D.queue.find(x=>x.id===s.w.cid);if(c&&c.items[s.w.ix])c.items[s.w.ix].sj=null;s.w=null;s.job=null}});
  D.evPlan=[];qHold=0;renderQ();qHold=performance.now()+5000;
  setTimeout(()=>{const s=S.staff.find(x=>x.w);if(!s)return res({none:1});const k=s.w.cid+':'+s.w.ix,card=el.querySelector(`[data-qc="${k}"]`);
    const info={stale:card&&card.classList.contains("wait"),k,cls:card&&card.className,at:(now-s.w.at).toFixed(2)};console.log(JSON.stringify(info));const wc=s.w.cup;const cc=D.queue.find(x=>x.id===s.w.cid),st0=qState(cc,s.w.ix);info.st=st0.k;info.cup=!!cup;info.away=D.away>now;info.tk=document.querySelector("#shop").className;D.away=0;card.click();res({...info,mine:cup===wc,PV,sw:!!s.w})},2400)}));
console.log(JSON.stringify(r));ok(!r.none,'đang vuốt 1,5 giây: nhân viên vẫn nhận ly');
ok(r.stale,'thẻ chưa dựng lại, vẫn ghi Chờ');
ok(r.mine&&r.PV,'chạm thẻ đó: bạn lấy được ly (cả phần nhân viên đã pha)');
ok(!errs.length,'không lỗi JS '+errs.join('|'));await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
