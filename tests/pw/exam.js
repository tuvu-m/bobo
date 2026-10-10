// Thanh tra: mời ở tab Trang trí, pha đúng hết số ly bằng chạm thật thì lên cấp và trả phí; bỏ ly là trượt; save cũ có hẹn kiểm tra giấy phép
const L=require('./a2lib');let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
const setup=p=>p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=12;S.five=260;S.life=Object.assign(newLife(),{sales:12e6,tips:0});S.money=5e6;S.loanCash=0;
  S.drinks=[...new Set([...S.drinks,'hongtra','suadac'])];[...S.drinks,...S.syrups,...S.tops,...S.foams].forEach(k=>S.stock[k]=[{q:99,e:99}]);
  S.recipes.forEach(r=>r.on=false);S.recipes.push({id:S.ruid++,name:'Trà sữa hạng A',bs:['hongtra','suadac'],ss:[],ts:[],fs:[],status:'ok',mult:3.4,grade:'A',price:30000,on:true,until:null});
  syncLayout();autoLay&&autoLay();tab='trangtri';renderPrep()});
(async()=>{const b=await L.chromium.launch({channel:'chrome',headless:true});
 // 1. lên cấp: đạt
 {const {page:p}=await L.open(b,375,667);await setup(p);
  const s0=await p.evaluate(()=>({btn:document.querySelector('[data-exam]')?.disabled,reqs:[...document.querySelectorAll('.shopbox .req')].map(x=>x.textContent)}));
  ok(s0.btn===false&&s0.reqs.some(t=>/🏅 B\+ · Trà sữa hạng A ✓/.test(t))&&s0.reqs.some(t=>/3 ly/.test(t)),'tab Trang trí: đủ điều kiện, nút Mời thanh tra bật · '+s0.reqs.join(' | '));
  await p.screenshot({path:'exam0.png'});
  await p.tap('[data-exam]');await p.waitForTimeout(2500);
  const s1=await p.evaluate(()=>({exam:!!(D&&D.exam),staff:working().length,q:D.queue.map(c=>c.name+'|'+c.type),hud:document.querySelector('#hudMini').textContent}));
  ok(s1.exam&&s1.staff===0&&s1.q.length===1&&/Thanh tra/.test(s1.q[0]),'vào bài kiểm tra: không nhân viên, chỉ một thanh tra ('+s1.q[0]+') · '+s1.hud);
  await p.screenshot({path:'exam1.png'});
  let served=0;for(let k=0;k<12;k++){if(await p.evaluate(()=>!D||!!D.exam.end))break;const r=await L.serveOne(p);if(r)served++;await p.waitForTimeout(400);if(k===1)await p.screenshot({path:'exam2.png'})}
  for(let i=0;i<20&&await p.evaluate(()=>!!D);i++)await p.waitForTimeout(300);
  const s2=await p.evaluate(()=>({paid:S.examIn,shop:S.shop,money:S.money,notice:S.notice.map(n=>n.t).join(' | '),tab,nange:(S.spentCat||{}).nangcap}));
  ok(s2.shop===1&&s2.paid>0&&s2.money===3e6+s2.paid&&/mở rộng thành Ki-ốt nhỏ/.test(s2.notice),`pha đúng ${served} ly: đạt, lên Ki-ốt nhỏ, trả 2 triệu, thanh tra trả ${s2.paid}đ tiền ly · ${s2.notice}`);
  await p.screenshot({path:'exam3.png'});
  {const E=p.errs.filter(e=>!/CORS|ERR_FAILED/.test(e));ok(!E.length,'không lỗi JS '+E.join('|'))};await p.context().close()}
 // 2. lên cấp: bỏ ly là trượt, mai mời lại
 {const {page:p}=await L.open(b,375,667);await setup(p);await p.tap('[data-exam]');await p.waitForTimeout(2500);
  const nb=await p.$('.nextBtn:not([disabled])');if(nb){await nb.click();await p.waitForTimeout(700)}
  const pos=await L.objPos(p,(await p.evaluate(()=>target().items[target().cur].bs[0])));await p.mouse.move(pos.x,pos.y);await p.mouse.down();await p.waitForTimeout(500);await p.mouse.up();
  await L.tap(p,'trash');await p.waitForTimeout(500);const msg=await p.evaluate(()=>D&&D.exam&&D.exam.end+'|'+D.exam.why);
  for(let i=0;i<20&&await p.evaluate(()=>!!D);i++)await p.waitForTimeout(300);
  const s=await p.evaluate(()=>({shop:S.shop,money:S.money,bad:S.notice.find(n=>n.bad)?.t,btn:document.querySelector('[data-exam]')?.disabled,why:document.querySelector('.shopbox .upbar .meta')?.textContent}));
  ok(msg==='fail|bỏ ly'&&s.shop===0&&s.money===5e6&&/Chưa đạt \(bỏ ly/.test(s.bad)&&s.btn===true&&/Mai mời lại/.test(s.why),'bỏ ly: trượt, không mất tiền, hôm nay không mời lại được · '+s.bad);
  {const E=p.errs.filter(e=>!/CORS|ERR_FAILED/.test(e));ok(!E.length,'không lỗi JS '+E.join('|'))};await p.context().close()}
 // 3. save cũ cấp 3: hẹn kiểm tra giấy phép; tới hạn bấm Mở cửa là thanh tra tới; trượt thì xuống cấp; thi lại lên cấp miễn phí
 {const {page:p}=await L.open(b,375,667);
  await p.evaluate(()=>{const o=JSON.parse(JSON.stringify(S));o.shop=2;o.day=40;delete o.licV;o.notice=[];const m=migrate(o);window.__m={due:m.licDue,n:m.notice.map(x=>x.t).join(' | ')};S=m;save()});
  const m=await p.evaluate(()=>window.__m);ok(m.due&&m.due.lv===2&&m.due.by===43&&/Thanh tra hẹn kiểm tra giấy phép Tiệm mặt tiền · ⏳ 3 ngày/.test(m.n),'save cũ cấp 3: hẹn kiểm tra trong 3 ngày · '+m.n.slice(0,90));
  await setup(p);await p.evaluate(()=>{S.shop=2;S.five=5000;S.life.sales=200e6;S.day=41;renderPrep()});
  const lb=await p.evaluate(()=>({box:document.querySelector('.licbox')?.innerText.replace(/\n/g,' · '),up:!!document.querySelector('[data-exam=""],[data-exam]:not([data-exam="lic"])')}));
  ok(/Giấy phép.*⏳ 2 ngày/.test(lb.box||'')&&!lb.up,'tab Trang trí: ô kiểm tra giấy phép, chưa cho lên cấp tiếp · '+lb.box);
  await p.screenshot({path:'exam4.png'});
  await p.evaluate(()=>{S.day=43;renderPrep()});const ob=await p.textContent('#openBtn');ok(/Kiểm tra giấy phép/.test(ob),'tới hạn: nút Mở cửa thành "'+ob.trim()+'"');
  await p.tap('#openBtn');await p.waitForTimeout(2500);ok(await p.evaluate(()=>!!(D&&D.exam&&D.exam.kind==='lic')),'bấm: thanh tra tới kiểm tra giấy phép');
  await p.evaluate(()=>{D.queue[0].p=0});for(let i=0;i<20&&await p.evaluate(()=>!!D);i++)await p.waitForTimeout(300);
  const f=await p.evaluate(()=>({shop:S.shop,free:S.freeUp,due:S.licDue,bad:S.notice.find(n=>n.bad)?.t,fee:document.querySelector('.shopbox .meta[style]')?.textContent}));
  ok(f.shop===1&&f.free===2&&!f.due&&/Trượt giấy phép \(hết giờ.*⬇ Ki-ốt nhỏ · lên lại miễn phí/.test(f.bad)&&/miễn phí/.test(f.fee),'hết giờ: trượt, xuống Ki-ốt nhỏ, lên lại miễn phí · '+f.bad);
  await p.screenshot({path:'exam5.png'});
  // thi lại hôm sau: đạt thì lên lại, không trừ tiền
  await p.evaluate(()=>{S.day=44;S.money=1e6;S.examIn=0;renderPrep()});await p.tap('[data-exam]');await p.waitForTimeout(2500);
  for(let k=0;k<12;k++){if(await p.evaluate(()=>!D||!!D.exam.end))break;await L.serveOne(p);await p.waitForTimeout(400)}
  for(let i=0;i<20&&await p.evaluate(()=>!!D);i++)await p.waitForTimeout(300);
  const g=await p.evaluate(()=>({paid:S.examIn,shop:S.shop,money:S.money,free:S.freeUp,n:S.notice[0]?.t}));
  ok(g.shop===2&&g.paid>0&&g.money===1e6+g.paid&&!g.free,'thi lại đạt: lên lại Tiệm mặt tiền, không mất tiền · '+g.n);
  {const E=p.errs.filter(e=>!/CORS|ERR_FAILED/.test(e));ok(!E.length,'không lỗi JS '+E.join('|'))};await p.context().close()}
 await b.close();console.log(fails?fails+' FAILED':'ALL PASSED')})();
