// Thao tác thật trên quầy lưới (Chrome, khung 393×659): kéo, đổi chỗ, dời bàn pha, kho, chạm chọn, giao ly bằng chạm máy.
const { chromium } = require('playwright-core');
const { pathToFileURL } = require('url');
const [, , gameFile, out] = process.argv;
let fails = 0;
const ok = (c, m) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) fails++ };
(async () => {
  const b = await chromium.launch({ channel: 'chrome', headless: true });
  const ctx = await b.newContext({ viewport: { width: 393, height: 760 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(pathToFileURL(gameFile).href); for (let i = 0; i < 60; i++) { await p.waitForTimeout(150); if (await p.evaluate(() => !document.getElementById('boot'))) break }
  await p.evaluate(() => { S.notice = []; S.money = 1e7; while ((S.qrows || 12) < 12) growCounter(); S.money = 500000; renderPrep() }); await p.waitForTimeout(300);
  const G = () => p.evaluate(() => Object.fromEntries(S.grid.map(o => [o.id, o.c + ',' + o.r])));
  const cv = (sel) => p.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height } }, sel);
  // tâm của ô (c,r) theo đơn vị CSS, cộng lệch nếu cần
  const GD = async () => p.evaluate(() => [COLS, ROWS, SH]);
  const cell = async (c, r, sel = '#ed') => { const R = await cv(sel), [C, Rw] = await GD(); return [R.x + (c + .5) * R.w / C, R.y + (r + .5) * R.h / Rw] };
  const objC = async (id, sel = '#ed') => { const o = await p.evaluate(id => { const o = S.grid.find(o => o.id === id), [w, h] = fpOf(id); return { c: o.c + w / 2, r: o.r + h / 2 } }, id); const R = await cv(sel), [C, Rw] = await GD(); return [R.x + o.c * R.w / C, R.y + o.r * R.h / Rw] };
  // kéo: món được nhấc lên trên ngón tay nửa chiều cao + 6 đơn vị, nên ngón tay thả thấp hơn đích
  const drag = async (from, to, shot) => { await p.mouse.move(...from); await p.mouse.down(); await p.mouse.move(from[0] + 4, from[1] + 4, { steps: 2 }); await p.mouse.move(...to, { steps: 12 }); await p.waitForTimeout(120); if (shot) await p.screenshot({ path: `${out}/g-${shot}.png` }); await p.mouse.up(); await p.waitForTimeout(200) };
  const lift = async () => 0;
  const toast = () => p.evaluate(() => document.querySelector('#toast').textContent);
  await p.screenshot({ path: `${out}/g-0-quay.png` });

  // 1. kéo Hồng trà tới chỗ trống cột 5 hàng 1 (ngón tay thấp hơn đích một khoảng nhấc)
  /* bình trà cao 2 ô: đặt ở hàng 0 thì tâm nằm ở đường giữa hàng 0 và 1 */
  let t = await cell(4, .5); t[1] += await lift('hongtra');
  await drag(await objC('hongtra'), t, '1-keo-tra'); let g = await G();
  ok(g.hongtra === '4,0', 'kéo bình trà tới chỗ trống: sang cột 5 (' + g.hongtra + ')');
  // 2. thả Sữa đặc lên Hồng trà -> đổi chỗ
  t = await objC('hongtra'); t[1] += await lift('suadac');
  const s0 = g.suadac; await drag(await objC('suadac'), t); g = await G();
  ok(g.suadac === '4,0' && g.hongtra === s0, 'thả sữa lên bình trà: đổi chỗ');
  // 3. thả bình trà lên khay topping (khác cỡ) -> không được, có báo
  const before = JSON.stringify(g); t = await objC('trang'); t[1] += await lift('hongtra');
  await drag(await objC('hongtra'), t, '3-sai-cho'); ok(JSON.stringify(await G()) === before && /không đủ chỗ/.test(await toast()), 'thả bình trà lên khay topping: không đổi, có báo');
  await p.evaluate(() => { document.querySelector('#tbody').scrollTop = 9999 }); await p.waitForTimeout(250);
  // 4. dời máy đóng gói lên hai hàng (cột 5–6, hàng 9–10 đang trống)
  t = await cell(4.5, 8.5); t[1] += await lift('seal');
  await drag(await objC('seal'), t, '4-doi-may'); g = await G();
  ok(g.seal === '4,8', 'dời máy đóng gói lên chỗ trống (' + g.seal + ')');
  await p.evaluate(() => { const o = S.grid.find(o => o.id === 'den'), R = document.querySelector('#ed').getBoundingClientRect(), T = document.querySelector('#tbody'); T.scrollTop += R.top + (o.r + 1) / ROWS * R.height - T.getBoundingClientRect().top - 260 }); await p.waitForTimeout(250);
  // 5. kéo TC đen lên Kho -> cất; kéo chip về chỗ trống
  await p.evaluate(() => { const o = S.grid.find(o => o.id === 'den'), R = document.querySelector('#ed').getBoundingClientRect(), T = document.querySelector('#tbody'); T.scrollTop += R.top + (o.r + 1) / ROWS * R.height - T.getBoundingClientRect().top - 260 }); await p.waitForTimeout(250);
  const kho = await p.evaluate(() => { const r = document.querySelector('#khoBox').getBoundingClientRect(); return [r.left + r.width * .8, r.top + r.height / 2] });
  await drag(await objC('den'), kho); g = await G();
  ok(!g.den && (await p.evaluate(() => S.stored.includes('den'))), 'kéo TC đen lên Kho: đã cất');
  const chip = await p.evaluate(() => { const r = [...document.querySelectorAll('.kchip')].find(b => b.textContent.includes('TC đen')).getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] });
  const dst = await cell(4.5, 2.5);
  await p.mouse.move(...chip); await p.mouse.down(); await p.mouse.move(chip[0], chip[1] + 30, { steps: 4 }); await p.mouse.move(...dst, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(300);
  g = await G(); ok(!!g.den, 'kéo chip TC đen từ Kho xuống chỗ trống: đã bày (' + g.den + ')');
  // 6. chạm chọn TC trắng rồi chạm chỗ trống
  await p.evaluate(() => { const o = S.grid.find(o => o.id === 'trang'), R = document.querySelector('#ed').getBoundingClientRect(), T = document.querySelector('#tbody'); T.scrollTop += R.top + (o.r + 1) / ROWS * R.height - T.getBoundingClientRect().top - 260 }); await p.waitForTimeout(250);
  await p.mouse.click(...await objC('trang')); await p.waitForTimeout(150);
  ok(await p.evaluate(() => edSel && edSel.id === 'trang'), 'chạm TC trắng: đã chọn');
  await p.screenshot({ path: `${out}/g-6-dang-chon.png` });
  const free = await p.evaluate(() => { const t = S.grid.find(o => o.id === 'trang'); for (let r = Math.max(0, t.r - 2); r < ROWS; r++)for (let c = 0; c < COLS - 1; c++)if (fits(S.grid, 'trang', c, r)) return { c, r }; return null });
  await p.mouse.click(...await cell(free.c + .5, free.r + .5)); await p.waitForTimeout(200); g = await G();
  ok(g.trang === free.c + ',' + free.r, 'chạm chỗ trống: TC trắng dời tới (' + g.trang + ')');
  // 7. mở cửa, pha 1 ly, chạm máy đóng gói để giao
  await p.evaluate(() => { tab = 'quay'; renderPrep() }); await p.click('#openBtn');
  for (let i = 0; i < 30; i++) { await p.waitForTimeout(300); if (await p.evaluate(() => !!(D && target()))) break }
  await p.evaluate(() => { const c = target(), o = c.items[c.cur]; o.ts = []; o.sugar = 0; o.ice = 0; tkKey = ''; renderTicket() });
  const st = '#st', sh = async (id) => { const R = await cv(st); const o = await p.evaluate(id => { const o = LAYG().find(o => o.id === id), r = objRect(o); return { x: (r.x + r.w / 2) / ST.LW, y: (r.y + r.h / 2) / ST.LH } }, id); return [R.x + o.x * R.w, R.y + o.y * R.h] };
  const sz = await p.evaluate(() => target().items[0].size); await p.waitForTimeout(300); await p.click('.nextBtn[data-next]'); await p.waitForTimeout(500);
  ok(await p.evaluate(sz => !!cup && cup.size === sz && MK, sz), 'chạm ly ' + sz + ' ở màn quán: sang màn pha');
  await p.evaluate(() => { const o = target().items[0]; cup.pours = o.bs.map(k => ({ k, amt: TARGET / o.bs.length })); cup.fill = TARGET; o.bs.forEach(k => cup.used[k] = 1) });
  await p.waitForTimeout(200); await p.screenshot({ path: `${out}/g-7-cho-giao.png` });
  const served0 = await p.evaluate(() => D.served);
  await p.mouse.click(...await sh('seal')); await p.waitForTimeout(350); await p.screenshot({ path: `${out}/g-8-dang-giao.png` });
  await p.waitForTimeout(1200);
  const res = await p.evaluate(s0 => ({ ok: D.served === s0 + 1 || D.stars.length > 0 || D.pend.length > 0, type: (D.pend[0] && D.pend[0].c.type) || 'đã đi', pend: D.pend.length }), served0);
  ok(await p.evaluate(() => !MK && !cup), 'giao xong: về màn quán');
  ok(res.ok, 'chạm máy đóng gói: ly rơi vào máy và giao cho khách (' + res.type + (res.pend ? ', đang chờ bạn quyết định bớt/ghi nợ' : '') + ')');
  ok(errs.length === 0, 'không có lỗi JS ' + errs.join(' | '));
  await b.close(); console.log(fails ? fails + ' FAILED' : 'ALL PASSED');
})();
