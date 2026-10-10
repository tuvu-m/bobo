const { chromium } = require('playwright-core'); const { pathToFileURL } = require('url'); const fs = require('fs');
const [, , game, out] = process.argv; fs.mkdirSync(out, { recursive: true });let fails=0;const ok=(c,m)=>{if(!c)fails++;console.log(c?'ok  ':'FAIL',m)};
(async () => { const b = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(pathToFileURL(game).href); for (let i = 0; i < 60; i++) { await p.waitForTimeout(150); if (await p.evaluate(() => !document.getElementById('boot'))) break }
  await p.evaluate(() => { document.body.classList.remove('help'); S.day = 6; S.money = 2e6; ['hongtra','suadac','s_duongden','den','trang'].forEach(k => S.stock[k] = [{ q: 30, e: 30 }]); S.notice = []; tab = 'quay'; renderPrep() });
  await p.click('#openBtn'); await p.waitForTimeout(600);
  // 1. hai nền: rót đầy trà rồi sữa không quá vạch
  let r = await p.evaluate(async () => { D.next = 1e9; D.evPlan = []; D.queue = []; spawn('thuong'); const c = D.queue.at(-1); Object.assign(c.items[0], { bs: ['hongtra','suadac'], size: 'M', ts: [], ss: [], fs: [], sugar: 0, ice: 0 }); c.o = c.items[0]; c.p = c.max = 999; layoutQ(); tkKey=''; renderTicket();
    takeCup('M'); startPour('hongtra'); for (let i = 0; i < 40; i++) { now += .05; tickDay(.05); if (cup.fill >= TARGET) break } stopPour();
    startPour('suadac'); for (let i = 0; i < 20; i++) { now += .05; tickDay(.05) } stopPour(); const m = cupMiss(c.items[0]); return { fill: cup.fill, m: m && m.msg, T: TARGET, tol: POUR_TOL } });
  ok(!r.m && r.fill <= r.T + r.tol, 'rót đầy trà rồi giữ sữa 1 giây: ly vẫn đúng vạch (' + (r.fill / r.T * 100).toFixed(0) + '%)');
  // 2. chạm nhanh không mất hàng
  r = await p.evaluate(() => { useTool('trash'); takeCup('M'); const q0 = qty('hongtra'); startPour('hongtra'); stopPour(); return { q0, q1: qty('hongtra'), t: document.querySelector('#toast').textContent } });
  ok(r.q0 === r.q1 && /Giữ bình/.test(r.t), 'chạm nhanh bình trà: không mất hàng, nhắc "' + r.t + '"');
  await p.waitForTimeout(400); await p.screenshot({ path: out + '/empty-cup.png' });
  // 3. nhân viên tự nhận khách: bạn không còn khách thì phiếu báo nhân viên đang pha
  r = await p.evaluate(() => { useTool('trash'); S.staff = [Object.assign(genStaff(), { role: 'barista', skill: 5, spd: 3, mood: 90 })]; for (let i = 0; i < 10 && !S.staff[0].w; i++) { now += .05; tickDay(.05) } tkKey = ''; renderTicket(); return { w: !!S.staff[0].w, tg: !!target(), t: document.querySelector('#tk').textContent } });
  ok(r.w && !r.tg && /nhân viên/.test(r.t), 'nhân viên nhận khách duy nhất: phiếu báo "' + r.t + '"');
  // 4. ly hỏng: nhãn trên bàn pha + phiếu
  r = await p.evaluate(() => { S.staff.forEach(x => x.w = null); S.staff = []; D.queue.forEach(c => c.items.forEach(x => x.sj = null)); if (!cup) takeCup('L'); PV = true; syncMode(); breakCup('sai size'); tkKey = ''; renderTicket(); const b = document.querySelector('#ordp .op.bad'); return b ? b.textContent : '' });
  ok(/Hồng trà/.test(r), 'ly hỏng: mục trà tô đỏ trong khung đơn "' + r + '"');
  await p.waitForTimeout(500); await p.screenshot({ path: out + '/broken.png' });
  // 5. toast lúc bán không che đồng hồ
  r = await p.evaluate(() => { toast('Thử một câu thông báo khá dài để xem vị trí'); const a = document.querySelector('#toast').getBoundingClientRect(), h = document.querySelector('.hudMini').getBoundingClientRect(); return { overlap: a.left < h.right && a.top < h.bottom } });
  await p.waitForTimeout(300); ok(!r.overlap, 'toast lúc bán không đè lên đồng hồ/tiền');await p.screenshot({ path: out + '/toast-play.png' });
  // 6. tổng kết: thu gồm nợ, ô vé số
  r = await p.evaluate(() => { useTool('trash'); S.debts = [{ name: 'Anh Huy', amt: 20000, d: S.day - 1 }]; const R = Math.random; Math.random = () => .1; D.tix = [{ k: 1, from: 'Bà Năm' }]; D.queue = []; D.walk = []; D.pend = []; D.spawned = D.total; D.ev = null; endDay(); Math.random = R; const T = S.tix.filter(t => t.d === S.day - 1); T[0].amt = 100000; T[0].jp = false; renderVe(); return { thu: document.querySelector('#sumGrid div b').textContent, lbl: document.querySelector('#sumGrid div span').textContent } });
  ok(/nợ/.test(r.lbl), 'tổng kết: ô Thu ghi gồm nợ thu lại (' + r.thu + ' ' + r.lbl + ')');
  await p.click('[data-ve="0"]'); await p.waitForTimeout(700);
  r = await p.evaluate(() => { const V = document.querySelector('#sumVeT'); return V && !V.hidden && V.textContent });
  ok(/100/.test(r || ''), 'dò vé trúng: ô "Vé số trúng" hiện ' + r); await p.screenshot({ path: out + '/summary.png' });
  // 7. thông báo xấu lên trước, nút xem thêm
  await p.click('#nextBtn'); await p.waitForTimeout(300);
  r = await p.evaluate(() => { S.notice = [{ t: 'Bạn A bùng nợ', bad: 1 }, { t: 'TB1' }, { t: 'TB2' }, { t: 'TB3' }]; renderPrep(); return { first: document.querySelector('.nlist .notice').textContent, more: !!document.querySelector('[data-nall]') } });
  ok(/bùng nợ/.test(r.first) && r.more, 'thông báo xấu hiện trước, có nút xem thêm');
  await p.click('[data-nall]'); await p.waitForTimeout(200); r = await p.evaluate(() => document.querySelectorAll('.nlist .notice').length); ok(r === 4, 'bấm xem thêm: hiện cả 4 thông báo');
  // 8. gõ giá: chữ lãi cập nhật
  await p.evaluate(() => { tab = 'thucdon'; menuSel = S.recipes.find(r => r.status === 'ok').id; renderPrep() }); await p.waitForTimeout(200);
  const inp = await p.$('.medit input[data-rpi]'); await inp.fill('99000'); await p.click('.mhead'); await p.waitForTimeout(200);
  r = await p.evaluate(() => ({ note: document.querySelector('.medit .pnote').textContent, card: document.querySelector('.mcard.sel span').textContent }));
  ok(/quá đắt/.test(r.note) && /99k/.test(r.card), 'gõ giá 99k: cập nhật ngay "' + r.note + '" / thẻ "' + r.card + '"');
  await p.screenshot({ path: out + '/price.png' });
  // 9. tab mới có chấm, thanh tab mờ mép
  r = await p.evaluate(() => { S.newTabs = ['staff']; tab = 'quay'; renderPrep(); return { dot: !!document.querySelector('.tab.new'), fade: document.querySelector('#tabs').className } });
  ok(r.dot, 'tab mới mở có chấm báo; thanh tab: ' + r.fade);console.log(await p.evaluate(()=>{const t=document.querySelector('#tabs');const r=t.getBoundingClientRect();return 'tabs h='+r.height+' top='+r.top+' n='+t.children.length+' sl='+t.scrollLeft+' sw='+t.scrollWidth+' cw='+t.clientWidth+' prep.scrollTop='+document.querySelector('#prep').scrollTop+' app='+document.querySelector('#app').scrollTop})); await p.screenshot({ path: out + '/tabs.png' });
  console.log(errs.length ? 'LỖI JS: ' + errs.join(' | ') : 'không lỗi JS'); console.log(fails ? fails + ' FAILED' : 'ALL PASSED'); await b.close() })();
