// helpers for UX audit 2
const { chromium } = require('playwright-core');
const { pathToFileURL } = require('url');
const fs = require('fs');
const path = require('path');
const GAME = path.join(__dirname, '..', '..', 'tiem-tra-sua.html');
const OUT = path.join(__dirname, '..', 'out', 'audit');

async function open(browser, w, h, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.errs = [];
  page.on('pageerror', e => page.errs.push(e.message));
  page.on('console', m => { if (m.type() === 'error') page.errs.push('console: ' + m.text()) });
  if (opts.clear !== false) await page.addInitScript(() => { if (!sessionStorage.getItem('_k')) { localStorage.clear(); sessionStorage.setItem('_k', '1') } });
  await page.goto(pathToFileURL(GAME).href);
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(150); if (await page.evaluate(() => !document.getElementById('boot'))) break }
  await page.waitForTimeout(300);
  return { ctx, page };
}

// client coords for counter object id on canvas sel (#st in shop, #ed in prep)
async function objPos(page, id, sel = '#st') {
  return page.evaluate(([id, sel]) => {
    const cv = document.querySelector(sel); if (!cv) return null; const r = cv.getBoundingClientRect();
    const g = D ? LAYG() : S.grid; const o = g.find(o => o.id === id); if (!o) return null; const q = objRect(o);
    return { x: r.left + (q.x + q.w / 2) * r.width / SW, y: r.top + (q.y + q.h / 2) * r.height / SH, w: q.w * r.width / SW, h: q.h * r.height / SH };
  }, [id, sel]);
}
async function tap(page, id) { const p = await objPos(page, id); if (!p) return false; await page.mouse.click(p.x, p.y); await page.waitForTimeout(120); return true }

// serve current target order with real taps. returns description
async function serveOne(page, opt = {}) {
  /* lấy order như người chơi: bấm nút Lấy order tiếp theo (chồng ly M/L trên quầy đã bỏ) */
  if (!(await page.evaluate(() => !!cup))) { const nb = await page.$('.nextBtn:not([disabled])'); if (!nb) return null; await nb.click(); await page.waitForTimeout(700) }
  const o = await page.evaluate(() => { const c = target(); if (!c) return null; const it = c.items[c.cur]; return { id: c.id, cur: c.cur, size: it.size, bs: it.bs, ss: it.ss || [], ts: it.ts, fs: it.fs, sugar: it.sugar ? SUGAR[it.sugar] : 0, ice: it.ice ? ICE[it.ice][1] : 0, miss: missingOf(it), name: c.name, type: c.type, emerg: D.emerg } });
  if (!o) return null;
  if (o.miss.length) {
    // use suggestion
    const b = await page.$('[data-sug]'); if (b) { await b.click(); await page.waitForTimeout(200); const s = await page.$('[data-sugr]'); if (s) { await s.click(); await page.waitForTimeout(300) } else { const x = await page.$('[data-sugx]'); if (x) await x.click() } }
    return 'sug';
  }
  // cup
  if (!(await page.evaluate(() => !!cup))) return null;
  // pour each base
  for (let i = 0; i < o.bs.length; i++) {
    const k = o.bs[i];
    const tgt = await page.evaluate(([i, n]) => TARGET * (i + 1) / n, [i, o.bs.length]);
    const cur = await page.evaluate(() => cup ? cup.fill : 0);
    if (cur >= tgt - 0.03) continue;
    const p = await objPos(page, D_emerg_tea(o, k)); if (!p) continue;
    await page.mouse.move(p.x, p.y); await page.mouse.down();
    for (let t = 0; t < 120; t++) { await page.waitForTimeout(30); const f = await page.evaluate(() => cup ? cup.fill : 0); if (f >= tgt - (opt.under || 0.015) + (opt.over || 0)) break }
    await page.mouse.up(); await page.waitForTimeout(80);
  }
  for (const k of o.ss) { if (!(await page.evaluate(k => cup && cup.syrups.includes(k), k))) await tap(page, k) }
  for (let i = await page.evaluate(() => cup ? cup.sugar : 0); i < o.sugar; i++) await tap(page, 'sugar');
  for (let i = await page.evaluate(() => cup ? cup.ice : 0); i < o.ice; i++) await tap(page, 'ice');
  for (const k of o.ts) { if (!(await page.evaluate(k => cup && cup.tops.includes(k), k))) await tap(page, k) }
  for (const k of o.fs) { if (!(await page.evaluate(k => cup && cup.foams.includes(k), k))) await tap(page, k) }
  if (opt.beforeSeal) await opt.beforeSeal();
  await tap(page, 'seal');
  await page.waitForTimeout(1300);
  return o;
}
function D_emerg_tea(o, k) { return o.emerg ? 'traman' : k }

// AUDIT layout issues from audit.js
const AUDIT = () => {
  const W = innerWidth, out = [];
  const vis = e => { const s = getComputedStyle(e); return e.offsetParent !== null && s.visibility !== 'hidden' && s.display !== 'none' };
  const scrollerX = e => { for (let a = e.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o === 'auto' || o === 'scroll') return a } return null };
  const label = e => (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '') + ' "' + (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40) + '"';
  if (document.documentElement.scrollWidth > W + 1) out.push(['page overflow-x', document.documentElement.scrollWidth + 'px > ' + W]);
  for (const e of document.querySelectorAll('#app *')) {
    if (!vis(e)) continue;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if ((r.right > W + 1 || r.left < -1) && !scrollerX(e)) out.push(['offscreen', label(e) + ` [${Math.round(r.left)}..${Math.round(r.right)}]`]);
    const s = getComputedStyle(e);
    if (e.children.length === 0 && e.scrollWidth > e.clientWidth + 1 && (s.overflowX === 'hidden' || s.overflowX === 'clip') && e.tagName !== 'CANVAS' && e.tagName !== 'TEXTAREA') out.push(['clipped', label(e)]);
    if (/^(BUTTON|SELECT|INPUT|SUMMARY)$/.test(e.tagName)) { if (r.height < 28 || r.width < 28) out.push(['small tap', label(e) + ` ${Math.round(r.width)}x${Math.round(r.height)}`]) }
    if (e.children.length === 0 && (e.textContent || '').trim() && parseFloat(s.fontSize) < 11) out.push(['tiny text', label(e) + ' ' + s.fontSize]);
  }
  const seen = new Map(); out.forEach(([k, v]) => { const key = k + '|' + v.replace(/\d+/g, '#'); if (!seen.has(key)) seen.set(key, [k, v, 0]); seen.get(key)[2]++ });
  return [...seen.values()];
};

async function fullTab(page, path, w) {
  const st = await page.addStyleTag({ content: 'html,body{height:auto!important;overflow:visible!important}#app{height:auto!important;overflow:visible!important}.tbody{overflow:visible!important;flex:none!important}' });
  await page.evaluate(() => { const s = document.querySelectorAll('style'); s[s.length - 1].id = 'tall' });
  await page.waitForTimeout(250);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  const files = [];
  for (let y = 0, i = 1; y < H && i <= 6; y += 1400, i++) { const f = path.replace('.png', `-${i}.png`); await page.screenshot({ path: f, fullPage: true, clip: { x: 0, y, width: w, height: Math.min(1400, H - y) } }); files.push(f) }
  await page.evaluate(() => document.getElementById('tall').remove());
  return files;
}

module.exports = { chromium, open, objPos, tap, serveOne, AUDIT, fullTab, OUT, fs };
