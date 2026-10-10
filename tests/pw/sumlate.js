// Màn tổng kết late game: nhiều dòng nhật ký được gom gọn, 8 dòng đầu + nút xem thêm
const { chromium } = require('playwright-core');const { pathToFileURL } = require('url');
(async()=>{const b=await chromium.launch({channel:'chrome',headless:true});const out=process.argv[3];
const ctx=await b.newContext({viewport:{width:375,height:667},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(pathToFileURL(process.argv[2]).href);for(let i=0;i<60;i++){await p.waitForTimeout(150);if(await p.evaluate(()=>!document.getElementById('boot')))break}
await p.evaluate(()=>{document.body.classList.remove('help');S.notice=[];S.day=200;S.shop=4;['hongtra','suadac'].forEach(k=>S.stock[k]=[{q:999,e:99}]);syncLayout();renderPrep()});
await p.click('#openBtn');await p.waitForTimeout(600);
await p.evaluate(()=>{for(let i=0;i<9;i++)D.log.push('🗣️ Bà Tám kể: chuyện '+i);for(let i=0;i<14;i++)D.log.push(`Chị A${i} mê tiệm quá, thành khách quen “Chị A${i} dù”!`);for(let i=0;i<6;i++)D.log.push(`💛 Anh B${i} vào bênh tiệm dưới review 1★ của Chị C.`);for(let i=0;i<5;i++)D.log.push(`Chú Bảy rủ thêm 2 anh em xe ôm ghé tiệm.`);for(let i=0;i<4;i++)D.log.push('🎴 Thầy gieo quẻ Bình an: buôn bán đều đều');D.log.push('🚨 Minh ỉm ví hàng hiệu của Anh Khoa, bị phát hiện! Tiệm bị phạt 2 triệu vì không dạy nhân viên tử tế.');for(let i=0;i<7;i++)D.log.push(`🤝 Lài trả ví cho Chị D${i} · review 5★`.replace('🤝','👛'));for(let i=0;i<3;i++)D.log.push(`Cô E${i} ghi nợ 25.000đ.`);D.queue=[];D.walk=[];D.spawned=D.total;endDay()});
await p.waitForTimeout(700);const n0=await p.$$eval('#sumLog li',e=>e.length);await p.screenshot({path:`${out}/sumlate.png`});
const lines=await p.$$eval('#sumLog li',e=>e.map(x=>x.textContent));console.log('dòng hiện:',n0,'\n'+lines.join('\n'));
const more=await p.$('#sumMore');if(more){await more.click();await p.waitForTimeout(200);console.log('bấm xem thêm:',await p.$$eval('#sumLog li',e=>e.length),'dòng')}
console.log('lỗi JS:',errs.length?errs.join(' | '):'không');await b.close()})();
