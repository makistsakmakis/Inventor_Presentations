/* Ο Ψυκτικός Κύκλος · Inventor — deck engine & interactions */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const stage = $('#stage');
let S = 1;
const DPR = Math.min(window.devicePixelRatio || 1, 2);

/* ---------------- scale stage to viewport ---------------- */
function fit() {
  S = Math.min(innerWidth / 1600, innerHeight / 900);
  stage.style.setProperty('--s', S);
  window.dispatchEvent(new Event('stagefit'));
}
addEventListener('resize', fit); fit();
const toStage = (cx, cy) => { const r = stage.getBoundingClientRect(); return { x: (cx - r.left) / S, y: (cy - r.top) / S }; };
window.toStage = toStage;

/* ---------------- numbers ---------------- */
const fmt = (v, dec) => {
  const s = Math.abs(v).toLocaleString('el-GR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  return (v < 0 && Math.abs(v) >= Math.pow(10, -dec) / 2 ? '−' : '') + s;
};
window.fmtNum = fmt;
function tween(el, from, to, dec, dur, pre = '', suf = '') {
  const t0 = performance.now();
  cancelAnimationFrame(el._raf);
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = pre + fmt(from + (to - from) * e, dec) + suf;
    if (k < 1) el._raf = requestAnimationFrame(step);
  };
  el._raf = requestAnimationFrame(step);
}
window.tween = tween;
function runCounters(root, extraDelay = 250) {
  $$('.cnt', root).forEach((el) => {
    const host = el.closest('[style*="--d"]');
    const d = host ? parseFloat(getComputedStyle(host).getPropertyValue('--d')) || 0 : 0;
    const to = parseFloat(el.dataset.to), from = parseFloat(el.dataset.from || 0), dec = +el.dataset.dec || 0;
    el.textContent = (el.dataset.pre || '') + fmt(from, dec) + (el.dataset.suf || '');
    clearTimeout(el._to);
    el._to = setTimeout(() => tween(el, from, to, dec, 1700, el.dataset.pre || '', el.dataset.suf || ''), d * 1000 + extraDelay);
  });
}

/* ---------------- sound (tiny synth) ---------------- */
const SFX = (() => {
  let ctx = null, on = true;
  const ac = () => (ctx = ctx || new (window.AudioContext || window.webkitAudioContext)());
  const tone = (f, d = .15, type = 'sine', v = .15, when = 0, slide = 0) => {
    if (!on) return;
    try {
      const c = ac(), t = c.currentTime + when, o = c.createOscillator(), g = c.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .015); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(c.destination); o.start(t); o.stop(t + d + .05);
    } catch (e) {}
  };
  return {
    get on() { return on; }, set on(v) { on = v; },
    pop: () => tone(660, .09, 'triangle', .08, 0, 990),
    click: () => tone(1200, .04, 'square', .03),
    tick: (hi) => tone(hi ? 1500 : 1000, .05, 'square', .04),
    lock: () => { tone(220, .5, 'sawtooth', .06); tone(330, .5, 'sawtooth', .04, .02); },
    right: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .28, 'triangle', .14, i * .09)),
    wrong: () => { tone(200, .5, 'sawtooth', .12, 0, 90); tone(150, .6, 'square', .05, .05, 70); },
    win: () => [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, .35, 'triangle', .14, i * .13)),
    bulb: () => { tone(880, .25, 'sine', .08, 0, 1760); tone(1320, .4, 'sine', .05, .08); },
    check: () => tone(880, .12, 'triangle', .09, 0, 1320),
  };
})();
window.SFX = SFX;

/* ---------------- confetti / fx ---------------- */
const fx = $('#fx'), fctx = fx.getContext('2d');
let parts = [], fxRun = false;
function sizeFx() { fx.width = innerWidth * DPR; fx.height = innerHeight * DPR; fctx.setTransform(DPR, 0, 0, DPR, 0, 0); }
addEventListener('resize', sizeFx); sizeFx();
function confetti(x, y, n = 80, colors = ['#ffd24a', '#ff5a3c', '#3ec5ff', '#3ddc97', '#b48cff', '#fff'], spread = 1) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = (4 + Math.random() * 9) * spread;
    parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, g: .28, w: 6 + Math.random() * 8, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: colors[i % colors.length], life: 1, star: Math.random() < .25 });
  }
  if (!fxRun) { fxRun = true; requestAnimationFrame(fxLoop); }
}
function rain(ms = 3000) {
  const t0 = performance.now();
  const iv = setInterval(() => {
    for (let i = 0; i < 8; i++) parts.push({ x: Math.random() * innerWidth, y: -20, vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3, g: .05, w: 6 + Math.random() * 8, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .3, c: ['#ffd24a', '#fff2a8', '#ffb800', '#fff', '#ff5a3c'][i % 5], life: 1.6, star: Math.random() < .3 });
    if (!fxRun) { fxRun = true; requestAnimationFrame(fxLoop); }
    if (performance.now() - t0 > ms) clearInterval(iv);
  }, 60);
}
function fxLoop() {
  fctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
  for (const p of parts) {
    p.vy += p.g; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= .006;
    fctx.save(); fctx.globalAlpha = Math.min(1, p.life); fctx.translate(p.x, p.y); fctx.rotate(p.r); fctx.fillStyle = p.c;
    if (p.star) { fctx.beginPath(); for (let k = 0; k < 5; k++) { const a = k * 1.2566 - 1.57, b = a + .628; fctx.lineTo(Math.cos(a) * 7, Math.sin(a) * 7); fctx.lineTo(Math.cos(b) * 3, Math.sin(b) * 3); } fctx.fill(); }
    else fctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
    fctx.restore();
  }
  if (parts.length) requestAnimationFrame(fxLoop); else { fxRun = false; fctx.clearRect(0, 0, innerWidth, innerHeight); }
}
window.confetti = confetti; window.rain = rain;

/* ---------------- background particles ---------------- */
(() => {
  const c = $('#bgcv'), x = c.getContext('2d'); let W, Hh, P = [];
  const size = () => { W = c.width = innerWidth * DPR; Hh = c.height = innerHeight * DPR; };
  addEventListener('resize', size); size();
  for (let i = 0; i < 70; i++) P.push({ x: Math.random(), y: Math.random(), r: .6 + Math.random() * 2.2, v: .00008 + Math.random() * .00025, w: Math.random() * 6.28, hot: Math.random() >= .5 });
  const loop = (t) => {
    x.clearRect(0, 0, W, Hh);
    for (const p of P) {
      p.y -= p.v; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
      const px = (p.x + Math.sin(t / 4000 + p.w) * .01) * W, py = p.y * Hh;
      const pc = p.hot ? (document.body.dataset.mood === 'quiz' ? '255,170,120' : '120,170,255') : '143,227,255';
      x.beginPath(); x.fillStyle = `rgba(${pc},${.25 + .25 * Math.sin(t / 900 + p.w)})`; x.arc(px, py, p.r * DPR, 0, 6.28); x.fill();
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
})();

/* ---------------- tips (light bulbs) ---------------- */
let openTip = null;
function closeTip() {
  if (!openTip) return;
  const { btn, bal } = openTip; btn.classList.remove('lit');
  bal.classList.add('out'); setTimeout(() => bal.remove(), 300); openTip = null;
}
function showTip(btn) {
  if (openTip && openTip.btn === btn) { closeTip(); return; }
  closeTip();
  const slide = btn.closest('.slide');
  btn.classList.add('lit'); SFX.bulb();
  const bal = document.createElement('div'); bal.className = 'balloon';
  const txt = btn.dataset.tip.replace(/(ΑΠΛΑ:|ΠΡΟΣΟΧΗ!!!|ΣΗΜΑΝΤΙΚΟ!!!)/g, '<b>$1</b>')
    .replace(/(\d+(?:[.,]\d+)?)/g, (m) => `<b class="cnt" data-to="${m.replace(',', '.')}" data-dec="${m.includes(',') ? 1 : 0}">0</b>`);
  bal.innerHTML = `<button class="x" aria-label="Κλείσιμο">×</button>${txt}<i class="tail"></i>`;
  slide.appendChild(bal);
  const r = btn.getBoundingClientRect(), p = toStage(r.left + r.width / 2, r.top + r.height / 2);
  const bw = 430, bh = bal.offsetHeight;
  let left = p.x + 50, tailSide = 'l';
  if (left + bw > 1540) { left = p.x - 50 - bw; tailSide = 'r'; }
  let top = Math.max(20, Math.min(900 - bh - 20, p.y - 40));
  bal.style.left = left + 'px'; bal.style.top = top + 'px';
  const tail = $('.tail', bal), ty = Math.max(16, Math.min(bh - 30, p.y - top - 11));
  tail.style.top = ty + 'px'; tail.style[tailSide === 'l' ? 'left' : 'right'] = '-10px';
  bal.style.setProperty('--ox', tailSide === 'l' ? '0px' : bw + 'px'); bal.style.setProperty('--oy', ty + 'px');
  $$('.cnt', bal).forEach((el) => tween(el, 0, parseFloat(el.dataset.to), +el.dataset.dec, 1200));
  $('.x', bal).onclick = (e) => { e.stopPropagation(); closeTip(); };
  bal.onclick = (e) => e.stopPropagation();
  openTip = { btn, bal };
}
document.addEventListener('click', (e) => {
  const t = e.target.closest('.tip');
  if (t) { e.stopPropagation(); showTip(t); return; }
  if (openTip && !e.target.closest('.balloon')) closeTip();
});

/* ---------------- flip tiles on touch ---------------- */
document.addEventListener('pointerup', (e) => {
  if (e.pointerType === 'mouse') return;
  const f = e.target.closest('.flip, .minif');
  if (f) f.classList.toggle('flipped');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement && document.activeElement.matches('.flip,.minif')) document.activeElement.classList.toggle('flipped');
});
document.addEventListener('mouseover', (e) => { const f = e.target.closest('.flip'); if (f && !f._hov) { f._hov = true; } });
document.addEventListener('mouseout', (e) => { const f = e.target.closest('.flip'); if (f && !f.contains(e.relatedTarget)) f._hov = false; });

/* ---------------- flow canvases (fading trails) ---------------- */
class Trails {
  constructor(canvas, baseW, baseH, fade = .16) { this.c = canvas; this.x = canvas.getContext('2d'); this.bw = baseW; this.bh = baseH; this.fade = fade; this.run = false; this.t = 0; this.size(); addEventListener('stagefit', () => this.size()); }
  size() { const w = this.c.offsetWidth, h = this.c.offsetHeight; if (!w) return; this.c.width = w * S * DPR; this.c.height = h * S * DPR; this.k = (w / this.bw) * S * DPR; this.x.setTransform(this.k, 0, 0, this.k, 0, 0); }
  start() { if (this.run) return; this.size(); this.run = true; this.last = performance.now(); const L = (t) => { if (!this.run) return; const dt = Math.min(50, t - this.last); this.last = t; this.t += dt; this.frame(dt); requestAnimationFrame(L); }; requestAnimationFrame(L); }
  stop() { this.run = false; }
  clearFade() { const x = this.x; x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'destination-out'; x.fillStyle = `rgba(0,0,0,${this.fade})`; x.fillRect(0, 0, this.c.width, this.c.height); x.restore(); }
  dot(px, py, r, col, a = 1) { const x = this.x; x.globalAlpha = a * .25; x.fillStyle = col; x.beginPath(); x.arc(px, py, r * 2.4, 0, 6.28); x.fill(); x.globalAlpha = a; x.beginPath(); x.arc(px, py, r, 0, 6.28); x.fill(); x.fillStyle = '#fff'; x.globalAlpha = a * .8; x.beginPath(); x.arc(px, py, r * .45, 0, 6.28); x.fill(); x.globalAlpha = 1; }
}
const poly = (pts) => { const seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const [a, b] = [pts[i - 1], pts[i]]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push({ a, b, l, s: L }); L += l; } return { seg, L, at(s) { s = ((s % L) + L) % L; for (const g of seg) if (s <= g.s + g.l) { const k = (s - g.s) / g.l; return [g.a[0] + (g.b[0] - g.a[0]) * k, g.a[1] + (g.b[1] - g.a[1]) * k]; } return pts[pts.length - 1]; } }; };

const FLOWS = {
  cycle: { w: 1536, h: 1024,
    liquid: [
      { p: [[945, 374], [1100, 374], [1128, 400], [1130, 480]], c: '#ff3b1f', v: -120 },          // ζεστό (δεξιά): αντίστροφη φορά
      { p: [[1130, 690], [1132, 830], [1110, 865], [1070, 878], [800, 880]], c: '#ff7a1f', v: -120 },
      { p: [[735, 880], [600, 880], [570, 860], [562, 836], [470, 834], [425, 812], [412, 770], [412, 685]], c: '#1f8bff', v: 120 },
      { p: [[412, 480], [412, 410], [432, 380], [470, 374], [620, 374]], c: '#3ec5ff', v: 120 }],
    air: [{ x: 90, y: 545, w: 110, h: 110, dx: 1, dy: 0, c: '#9fe6ff' }, { x: 1380, y: 550, w: 110, h: 105, dx: 1, dy: 0, c: '#ff8a6a' }] },
  fourway: { w: 1536, h: 1024,
    liquid: [
      { p: [[430, 605], [228, 605], [228, 275], [370, 275]], c: '#1f8bff', v: 110 },
      { p: [[425, 275], [550, 275], [550, 605], [440, 605]], c: '#ff3b1f', v: 110 },
      { p: [[1150, 605], [985, 605], [985, 275], [1120, 275]], c: '#ff3b1f', v: 110 },
      { p: [[1180, 275], [1310, 275], [1310, 605], [1195, 605]], c: '#1f8bff', v: 110 },
      { p: [[520, 848], [600, 848], [700, 830], [760, 790], [800, 760], [830, 735], [880, 718]], c: '#ff3b1f', v: 90 },
      { p: [[1000, 858], [940, 858], [860, 835], [780, 800], [735, 760], [700, 730], [650, 718]], c: '#1f8bff', v: 90 }],
    air: [{ x: 55, y: 400, w: 120, h: 60, dx: -.3, dy: 1, c: '#9fe6ff' }, { x: 700, y: 340, w: 45, h: 95, dx: 1, dy: -.3, c: '#ff8a6a' },
          { x: 825, y: 400, w: 115, h: 60, dx: -.2, dy: 1, c: '#ff8a4a' }, { x: 1455, y: 340, w: 50, h: 95, dx: 1, dy: -.4, c: '#9fe6ff' }] },
};
class ImageFlow extends Trails {
  constructor(el) {
    const cfg = FLOWS[el.dataset.flow];
    super($('canvas', el), cfg.w, cfg.h, .14);
    this.cfg = cfg; this.P = [];
    cfg.liquid.forEach((L) => { const pl = poly(L.p); const n = Math.max(3, Math.round(pl.L / 55)); for (let i = 0; i < n; i++) this.P.push({ pl, s: (i / n) * pl.L, v: L.v * (0.9 + Math.random() * .2), c: L.c }); });
    this.A = []; cfg.air.forEach((a) => { for (let i = 0; i < 9; i++) this.A.push(this.newAir(a, Math.random())); });
  }
  newAir(a, life = 0) { return { a, u: Math.random(), life, ph: Math.random() * 6.28 }; }
  frame(dt) {
    this.clearFade();
    for (const p of this.P) { p.s += p.v * dt / 1000; if (p.s > p.pl.L) p.s -= p.pl.L; if (p.s < 0) p.s += p.pl.L; const [x, y] = p.pl.at(p.s); this.dot(x, y, 7, p.c); }
    for (let i = 0; i < this.A.length; i++) {
      const q = this.A[i], a = q.a; q.life += dt / 1600;
      if (q.life > 1) { this.A[i] = this.newAir(a); continue; }
      const L = Math.hypot(a.dx, a.dy), ux = a.dx / L, uy = a.dy / L;
      const along = q.life * (Math.abs(ux) > Math.abs(uy) ? a.w : a.h) * 1.1;
      const bx = a.x + (Math.abs(ux) > Math.abs(uy) ? (ux > 0 ? 0 : a.w) : q.u * a.w), by = a.y + (Math.abs(ux) > Math.abs(uy) ? q.u * a.h : (uy > 0 ? 0 : a.h));
      const wob = Math.sin(q.life * 9 + q.ph) * 7;
      const x = bx + ux * along - uy * wob, y = by + uy * along + ux * wob;
      this.dot(x, y, 4, a.c, Math.sin(q.life * Math.PI) * .9);
    }
  }
}
const flows = new Map();
$$('.flowimg').forEach((el) => flows.set(el, new ImageFlow(el)));
$$('.flowtog').forEach((b) => b.addEventListener('click', () => {
  const sl = b.closest('.slide'), f = flows.get($('.flowimg', sl)); const paused = b.classList.toggle('paused');
  if (paused) f.stop(); else f.start();
  $('use', b).setAttribute('href', paused ? '#i-play' : '#i-pause'); $('span', b).textContent = paused ? 'Συνέχεια' : 'Παύση';
}));

/* loop around the 4 tiles (slide "cycle") */
class LoopFlow extends Trails {
  constructor(box) {
    const c = $('canvas', box); super(c, 1420, 320, .13); this.mode = 'cool';
    const i = 22, r = 80, W = 1420, H = 320, pts = [];
    const arc = (cx, cy, a0, a1) => { for (let k = 0; k <= 12; k++) { const a = a0 + (a1 - a0) * k / 12; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    arc(i + r, i + r, Math.PI, Math.PI * 1.5); arc(W - i - r, i + r, -Math.PI / 2, 0); arc(W - i - r, H - i - r, 0, Math.PI / 2); arc(i + r, H - i - r, Math.PI / 2, Math.PI); pts.push(pts[0]);
    this.pl = poly(pts); this.P = []; const n = 64; for (let k = 0; k < n; k++) this.P.push({ s: k / n * this.pl.L, j: Math.random() });
    this.dir = 1;
  }
  col(x, y) {
    const top = y < 110, mid = top && x >= 200 && x < 880;
    const hot = this.mode === 'cool' ? mid : !mid;
    if (hot) return (x > 760 && x < 880 && top) ? '#ffa13c' : '#ff4a2a';
    return (top && x >= 880 && x < 1000) ? '#1f8bff' : '#62d4ff';
  }
  frame(dt) {
    this.clearFade();
    const x = this.x; x.lineWidth = 3; x.strokeStyle = 'rgba(255,255,255,.06)'; x.setLineDash([4, 10]); x.beginPath(); this.pl.seg.forEach((g, k) => { if (!k) x.moveTo(...g.a); x.lineTo(...g.b); }); x.stroke(); x.setLineDash([]);
    for (const p of this.P) { p.s += this.dir * 150 * dt / 1000; const [px, py] = this.pl.at(p.s); this.dot(px, py, 6.5, this.col(px, py)); }
  }
}
const loopBox = $('.loopbox'); const loop = loopBox ? new LoopFlow(loopBox) : null;
function bindModeSwitch(sw, cb) {
  $$('button', sw).forEach((b) => b.addEventListener('click', () => {
    $$('button', sw).forEach((x) => x.classList.toggle('on', x === b));
    sw.classList.toggle('heat', b.dataset.mode === 'heat'); SFX.pop(); cb(b.dataset.mode);
  }));
}
const cyc = $('#s-cycle');
if (cyc) bindModeSwitch($('.modesw', cyc), (m) => { loop.mode = m === 'heat' ? 'heat' : 'cool'; loop.dir = m === 'heat' ? -1 : 1; });

/* airflow canvas (slide 19) */
class AirStreaks extends Trails {
  constructor(c) { super(c, 780, 522, .2); this.P = []; for (let i = 0; i < 60; i++) this.P.push(this.nw(Math.random() * 780)); }
  nw(x = -10) { return { x, y: 40 + Math.random() * 440, v: 160 + Math.random() * 120, bounce: Math.random() < .55 }; }
  frame(dt) {
    this.clearFade();
    for (let i = 0; i < this.P.length; i++) {
      const p = this.P[i], zone = p.x > 300 && p.x < 560;
      p.x += (zone ? p.v * .18 : p.v) * dt / 1000 * (p.back ? -1 : 1); p.y += Math.sin((p.x + i * 13) / 20) * .6;
      if (zone && p.bounce && !p.back && p.x > 380) p.back = true;
      if (p.x > 800 || p.x < -20) { this.P[i] = this.nw(); continue; }
      this.dot(p.x, p.y, 3, p.back ? '#ff8a6a' : '#cfeeff', zone ? .5 : .9);
    }
  }
}
const airEl = $('.aircv'); const air = airEl ? new AirStreaks(airEl) : null;

/* ---------------- slide hooks ---------------- */
const H = {
  flow: { enter: (s) => { const f = flows.get($('.flowimg', s)); const b = $('.flowtog', s); if (!b.classList.contains('paused')) setTimeout(() => f.start(), 500); }, leave: (s) => flows.get($('.flowimg', s)).stop() },
  cycle: { enter: () => setTimeout(() => loop.start(), 300), leave: () => loop.stop() },
  airflow: { enter: () => setTimeout(() => air.start(), 500), leave: () => air.stop() },
  chart: { enter: (s) => { const c = $('.chart', s); c.classList.remove('go'); setTimeout(() => c.classList.add('go'), 700); }, leave: (s) => $('.chart', s).classList.remove('go') },
  gauges: {
    enter: (s) => {
      const lp = $('.lp .needle', s), hp = $('.hp .needle', s);
      lp.style.transform = hp.style.transform = 'rotate(-135deg)';
      setTimeout(() => { lp.style.transform = 'rotate(-50deg)'; hp.style.transform = 'rotate(70deg)'; }, 600);
      clearInterval(s._g); s._g = setInterval(() => { lp.style.transform = `rotate(${-50 + (Math.random() - .5) * 8}deg)`; hp.style.transform = `rotate(${70 + (Math.random() - .5) * 8}deg)`; }, 2200);
    }, leave: (s) => clearInterval(s._g) },
  pflow: {
    enter: (s) => {
      const steps = $$('.pstep', s), arr = $$('.parrow', s); let k = 0;
      const seq = () => {
        steps.forEach((x) => x.classList.remove('lit')); arr.forEach((x) => x.classList.remove('lit'));
        const run = [() => steps[0].classList.add('lit'), () => arr[0].classList.add('lit'), () => steps[1].classList.add('lit'), () => arr[1].classList.add('lit'), () => steps[2].classList.add('lit')];
        run.forEach((f, i) => { s._pt.push(setTimeout(() => { f(); if (i % 2 === 0) SFX.click(); }, 900 + i * 700)); });
      };
      s._pt = []; seq(); s._pi = setInterval(() => { s._pt.forEach(clearTimeout); s._pt = []; seq(); }, 6500);
    }, leave: (s) => { clearInterval(s._pi); (s._pt || []).forEach(clearTimeout); } },
  case: { enter: (s) => { const f = $('.sflow', s); resetFlow(f); s._ct = setTimeout(() => runFlow(f), 1800); }, leave: (s) => { clearTimeout(s._ct); stopFlow($('.sflow', s)); } },
  case2: { enter: (s) => { $$('.area', s).forEach((a) => a.classList.remove('done')); $('#arN').textContent = '0'; } },
  hero: {}, goals: {}, basics: {}, refrig: {}, labs: {}, lens: {}, line: {}, ex: {}, fourway: {},
  quiz: { enter: () => window.Quiz && Quiz.enter(), leave: () => window.Quiz && Quiz.leave() },
};

/* case step flows */
function resetFlow(f) { stopFlow(f); $$('.sstep', f).forEach((x) => x.classList.remove('act', 'done')); $$('.sarrow', f).forEach((x) => x.classList.remove('lit')); const d = f.closest('.slide').querySelector('.sdone'); d && d.classList.remove('show'); }
function stopFlow(f) { (f._t || []).forEach(clearTimeout); f._t = []; }
function markStep(f, i) {
  const st = $(`.sstep[data-s="${i}"]`, f); st.classList.remove('act'); st.classList.add('done'); SFX.check();
  if (i < 5) $(`.sarrow[data-a="${i}"]`, f).classList.add('lit');
  if ($$('.sstep.done', f).length === 6) { const d = f.closest('.slide').querySelector('.sdone'); d.classList.add('show'); const r = d.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top, 60); }
}
function runFlow(f) {
  resetFlow(f); f._t = [];
  for (let i = 0; i < 6; i++) {
    f._t.push(setTimeout(() => $(`.sstep[data-s="${i}"]`, f).classList.add('act'), i * 1500));
    f._t.push(setTimeout(() => markStep(f, i), i * 1500 + 1000));
  }
}
$$('.sflow').forEach((f) => $$('.sstep', f).forEach((st) => st.addEventListener('click', () => { if (!st.classList.contains('done')) markStep(f, +st.dataset.s); })));
$$('[data-run]').forEach((b) => b.addEventListener('click', () => runFlow($('#' + b.dataset.run))));
$$('[data-reset]').forEach((b) => b.addEventListener('click', () => resetFlow($('#' + b.dataset.reset))));

/* case 2 areas */
$$('.area').forEach((a) => a.addEventListener('click', () => {
  a.classList.toggle('done'); SFX.check();
  const n = $$('.area.done').length; $('#arN').textContent = n;
  if (n === 6) { const r = a.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + r.height / 2, 70); }
}));

/* airflow checklist */
$$('.chk').forEach((c) => c.addEventListener('click', () => {
  c.classList.toggle('done'); SFX.check();
  const n = $$('.chk.done').length; $('#chkN').textContent = n;
  if (n === 4) { const r = c.getBoundingClientRect(); confetti(r.left + 40, r.top, 50); }
}));

/* BTU calc */
(() => {
  const r = $('#btuR'); if (!r) return; const b = $('#cvBtu'), k = $('#cvKw'); let pb = 12000, pk = 3.52;
  const upd = (v) => { const kw = v * 0.00029307107; tween(b, pb, v, 0, 450); tween(k, pk, kw, 2, 450); pb = v; pk = kw; r.value = v; };
  r.addEventListener('input', () => upd(+r.value));
  $$('.presets button').forEach((x) => x.addEventListener('click', () => { upd(+x.dataset.b); SFX.pop(); }));
})();

/* SH / SC labs */
$$('.lab').forEach((lab) => {
  const ins = $$('input', lab);
  const upd = () => {
    const key = ins[0].dataset.lab, a = +ins.find((i) => i.dataset.k === 'a').value, b = +ins.find((i) => i.dataset.k === 'b').value;
    $(`[data-o="${key}-a"]`, lab).textContent = a + ' °C'; $(`[data-o="${key}-b"]`, lab).textContent = b + ' °C';
    const o = $(`[data-o="${key}-r"]`, lab), v = a - b; tween(o, parseFloat((o.textContent || '0').replace('−', '-').replace(',', '.')) || 0, v, 0, 350);
  };
  ins.forEach((i) => i.addEventListener('input', upd)); upd();
});

/* 4-way switch */
const fw = $('#fwSw');
if (fw) bindModeSwitch(fw, (m) => {
  const box = fw.closest('.fwbox'); box.classList.toggle('heat', m === 'heat');
  const ri = $('.r-in', box), ro = $('.r-out', box);
  [ri, ro].forEach((x) => { x.classList.remove('swap'); void x.offsetWidth; x.classList.add('swap'); });
  setTimeout(() => { ri.textContent = m === 'heat' ? 'ΣΥΜΠΥΚΝΩΤΗΣ' : 'ΕΞΑΤΜΙΣΤΗΣ'; ro.textContent = m === 'heat' ? 'ΕΞΑΤΜΙΣΤΗΣ' : 'ΣΥΜΠΥΚΝΩΤΗΣ'; }, 330);
});

/* magnifier lens */
$$('.lensbox').forEach((box) => {
  const img = $('img', box), lens = $('.lens', box), Z = 2.6;
  lens.style.backgroundImage = `url("${img.getAttribute('src')}")`;
  box.addEventListener('mousemove', (e) => {
    const br = box.getBoundingClientRect(); const bw = br.width / S, bh = br.height / S;
    const ar = img.naturalWidth / img.naturalHeight || .8; let iw = bw, ih = bw / ar; if (ih > bh) { ih = bh; iw = bh * ar; }
    const ox = (bw - iw) / 2, oy = (bh - ih) / 2;
    const mx = (e.clientX - br.left) / S, my = (e.clientY - br.top) / S;
    lens.style.left = (mx - 115) + 'px'; lens.style.top = (my - 115) + 'px';
    lens.style.backgroundSize = `${iw * Z}px ${ih * Z}px`;
    lens.style.backgroundPosition = `${-((mx - ox) * Z - 115)}px ${-((my - oy) * Z - 115)}px`;
  });
});

/* hero go button */
$$('[data-go="next"]').forEach((b) => b.addEventListener('click', () => go(cur + 1)));

/* ---------------- drag-arrow exercises (σωστή αντιστοίχιση σε κωδικούς του σχεδίου) ---------------- */
const NS = 'http://www.w3.org/2000/svg';
// σημεία-στόχοι: [ετικέτα, κέντρο x%, κέντρο y%, πλάτος%, ύψος%] — θέσεις των κωδικών μέσα στο σχέδιο
const EXDATA = {
  's-ex1': { hs: [["E4",48.84,3.97,2.95,2.53],["E12",32.28,5.48,3.89,2.53],["F9",10.43,8.95,2.82,2.65],["F18",57.89,8.95,3.89,2.65],["F14",82.62,11.79,3.75,2.53],["F21",76.26,13.31,3.62,2.53],["E5",50.58,14.06,2.95,2.53],["B22",57.96,15.14,4.02,2.65],["E14",29.73,15.51,3.89,2.65],["C3",84.63,15.52,3.22,2.65],["E24",23.3,22.08,3.89,2.65],["E23",21.29,25.05,3.89,2.53],["E6-2",34.43,26.18,4.7,2.53],["E1",21.69,28.26,2.82,2.65],["E6-1",44.08,28.58,4.42,2.53],["F14",7.68,29.27,3.75,2.65],["E8-1",49.04,33.06,4.42,2.65],["F12",54.8,33.06,3.89,2.65],["F3",15.33,35.07,2.95,2.65],["E8-4",52.19,36.02,4.55,2.53],["B20",84.91,37.98,4.02,2.65],["E20",59.63,39.56,3.89,2.53],["F4",15.39,39.74,2.82,2.65],["F6",70.96,40.88,2.95,2.65],["E3",34.23,42.9,2.95,2.65],["C4",6.41,43.91,3.09,2.65],["F15",59.57,44.03,3.75,2.65],["F2-1",71.23,44.17,4.29,2.65],["B16",84.64,44.1,4.02,2.53],["E22",90.47,44.93,3.89,2.65],["E19",81.75,47.32,3.89,2.65],["E18",83.63,49.47,3.89,2.65],["C1",48.57,50.98,2.95,2.65],["F5",57.49,52.49,2.82,2.65],["C2",44.62,52.74,3.09,2.65],["F7",96.57,56.72,2.95,2.53],["A13",46.43,58.99,4.02,2.53],["F2",68.82,62.09,2.95,2.65],["A8",62.18,63.54,3.09,2.53],["A4",47.03,64.79,3.09,2.53],["A5",43.48,66.75,3.22,2.65],["F7-3",84.37,67.2,4.55,2.53],["F2-2",75.52,67.44,4.02,2.65],["A6",49.57,67.69,3.09,2.53],["F7-2",96.97,69.35,4.55,2.53],["F14",27.45,70.91,3.89,2.65],["E16",90.8,72.94,4.02,2.65],["E25",40.6,73.38,3.89,2.53],["B15",63.19,73.95,4.02,2.65],["B3-4",80.82,75.08,4.7,2.65],["F15",15.19,75.84,3.75,2.65],["E13",42.81,76.28,3.75,2.53],["B3",90.47,77.41,3.09,2.53],["B3-1",91.14,79.5,4.42,2.65],["B3-2",79.28,80.01,4.55,2.65],["B2",66.01,80.75,2.95,2.65],["A3",47.84,81.83,3.09,2.53],["B2-2",71.23,82.34,4.55,2.53],["B3-3",79.41,82.34,4.02,2.65],["B6",62.99,83.28,3.09,2.65],["A2",55.35,85.75,3.09,2.53],["B21",60.91,85.75,3.75,2.53],["B11",89.46,86.88,3.75,2.53],["B2-3",62.45,90.86,4.7,2.65],["F11",87.66,97.36,3.62,2.53],["F16",91.55,97.36,3.89,2.53],["F18-1",63.45,6.62,6.1,2.65],["E6",36.9,16.21,3.09,2.65],["E6-2",41.33,16.46,5.1,2.65],["B22",71.23,15.2,4.09,2.65],["E8-2",42.13,30.97,5.1,2.65],["E8-3",38.51,38.8,5.1,2.65],["E8",42.81,39.81,3.09,2.65],["B1",53.8,25.81,3.09,2.65],["B1-1",85.31,40.95,5.1,2.65],["A10",47.5,56.08,3.75,2.65],["A9",62.39,66.56,3.09,2.65],["K1",21.36,65.04,3.09,2.65],["F8",81.42,60.89,3.09,2.65],["F7-1",84.91,61.89,5.1,2.65],["E16-1",91.2,75.02,6.1,2.65],["A1",48.04,79.3,3.09,2.65],["B2-1",66.67,82.96,5.1,2.65],["B3-3-1",81.15,84.36,7.11,2.65],["B12",89.6,89.02,4.09,2.65],["B10",83.56,90.67,4.09,2.65],["F1",44.69,97.73,3.09,2.65],["B2-3-1",63.45,97.98,7.11,2.65],["B8",80.88,98.9,3.03,1.81]],
    ok: [['A1'], ['B1'], ['C1'], ['B3', 'B3-1', 'E16', 'E16-1'], ['B2', 'B2-1', 'B6'], ['B4', 'B4-1', 'B10', 'B8']] },
  's-ex2': { hs: [["131410",73.7,5.83,5.8,2.59],["733010",92.1,5.83,5.8,2.59],["342800",61.2,16.19,5.8,2.59],["359011",64.6,18.91,5.8,2.59],["268712",36.3,24.48,5.8,2.59],["267110",11.2,30.7,5.8,2.59],["135311",46.7,29.15,5.8,2.59],["135312",24.5,37.69,5.8,2.59],["135314",9.0,61.79,5.8,2.59],["35211B",80.8,57.25,5.8,2.59],["346810",90.6,56.87,5.8,2.59],["354212",90.6,59.97,5.8,2.59],["159901",59.5,71.89,5.8,2.59],["146811",66.2,71.89,5.8,2.59],["352150",73.5,69.82,5.8,2.59],["263230",83.2,71.5,5.8,2.59],["249951",62.3,84.59,5.8,2.59],["152302",34.2,90.93,5.8,2.59],["268714",81.0,93.65,5.8,2.59]],
    ok: [['354212', '35211B'], ['359011'], ['152302'], ['263230'], ['135311'], ['159901']] },
  's-ex3': { num: true, hs: [['1', 10.8, 46.07, 6.9, 6.3], ['2', 51.91, 83.34, 6.9, 6.3], ['3', 89.9, 86.02, 6.9, 6.3], ['4', 51.9, 20.27, 6.9, 6.3], ['5', 10.77, 56.29, 6.9, 6.3]],
    ok: [['1'], ['2'], ['3'], ['4'], ['5']] },
};
$$('.slide[data-hook="ex"]').forEach((sl) => {
  const D = EXDATA[sl.id]; if (!D) return;
  const svg = $('.exsvg', sl), photo = $('.exphoto', sl), img = $('img', photo), comps = $$('.comp[data-c]', sl), route = !!$('.complist.route', sl);
  // σχέδιο + στρώμα σημείων σε κοινό «καμβά» ώστε να κλιμακώνονται μαζί
  const wrap = document.createElement('div'); wrap.className = 'exwrap'; photo.insertBefore(wrap, img); wrap.appendChild(img);
  const layer = document.createElement('div'); layer.className = 'hsl' + (D.num ? ' nmb' : ''); wrap.appendChild(layer);
  D.hs.forEach(([t, x, y, w, h]) => { const e = document.createElement('i'); e.className = 'hs'; e.dataset.t = t; e.style.cssText = `left:${x}%;top:${y}%;width:${w}%;height:${h}%`; if (D.num) e.innerHTML = `<b>${t}</b>`; layer.appendChild(e); });
  // μεγεθυντικός φακός (όπως στη σελ. 17) — μόνο όταν δεν γίνεται drag
  const lens = document.createElement('div'); lens.className = 'lens exlens'; const lz = document.createElement('div'); lz.className = 'lz'; lens.appendChild(lz); photo.appendChild(lens);
  const Z = 2.6, LR = 115;
  const refreshLens = () => { lz.innerHTML = wrap.innerHTML; };
  refreshLens();
  photo.addEventListener('pointermove', (e) => {
    if (sel) { lens.classList.remove('on'); return; }
    const r = wrap.getBoundingClientRect(), w = r.width / S, h = r.height / S, mx = (e.clientX - r.left) / S, my = (e.clientY - r.top) / S;
    if (mx < 0 || my < 0 || mx > w || my > h) { lens.classList.remove('on'); return; }
    lens.classList.add('on');
    lens.style.left = (mx - LR) + 'px'; lens.style.top = (my - LR) + 'px';
    lz.style.width = w + 'px'; lz.style.height = h + 'px';
    lz.style.transform = `translate(${-(mx * Z - LR)}px,${-(my * Z - LR)}px) scale(${Z})`;
  });
  photo.addEventListener('pointerleave', () => lens.classList.remove('on'));

  let sel = null, live = null, links = {}, downAt = null, hot = null;
  const anchor = (c) => { const r = c.getBoundingClientRect(); return toStage(r.right - 6, r.top + r.height / 2); };
  const center = (el) => { const r = el.getBoundingClientRect(); return toStage(r.left + r.width / 2, r.top + r.height / 2); };
  const mk = (tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; };
  const curve = (a, b) => { const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 60 - Math.abs(b.x - a.x) * .08; return { d: `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`, cx: mx, cy: my }; };
  const head = (b, c, col) => { const ang = Math.atan2(b.y - c.cy, b.x - c.cx), L = 18; const p1 = [b.x - L * Math.cos(ang - .45), b.y - L * Math.sin(ang - .45)], p2 = [b.x - L * Math.cos(ang + .45), b.y - L * Math.sin(ang + .45)]; return mk('path', { d: `M${p1} L${b.x},${b.y} L${p2}`, fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }); };
  const setHot = (h) => { if (hot === h) return; hot && hot.classList.remove('hot'); hot = h; hot && hot.classList.add('hot'); };
  const hsAt = (x, y) => { const el = document.elementFromPoint(x, y); return el && el.closest ? el.closest('.exwrap .hs') : null; };
  const cancel = () => { if (live) live.remove(); live = null; if (sel) sel.classList.remove('sel'); sel = null; setHot(null); sl.classList.remove('exdrag'); };
  const count = () => { const n = Object.keys(links).length; $('.exn b', sl).textContent = n; return n; };
  const drawRoute = () => {
    $$('.route,.route-dot,.done-b', svg).forEach((x) => x.remove());
    const ids = comps.map((c) => c.dataset.c); if (!ids.every((i) => links[i])) return;
    const pts = ids.map((i) => center(links[i].hs));
    const d = 'M' + pts.map((p) => `${p.x},${p.y}`).join(' L');
    svg.appendChild(mk('path', { d, class: 'route', id: 'rt-' + sl.id }));
    const dot = mk('circle', { r: 11, fill: '#ffd24a', class: 'route-dot' }); const am = mk('animateMotion', { dur: '4s', repeatCount: 'indefinite', path: d }); dot.appendChild(am); svg.appendChild(dot);
    const pr = photo.getBoundingClientRect(), pp = toStage(pr.left + pr.width / 2, pr.bottom);
    const t = mk('text', { x: pp.x, y: pp.y + 34, class: 'done-b', 'text-anchor': 'middle' }); t.textContent = 'Ο κύκλος έκλεισε!'; svg.appendChild(t);
    SFX.right();
  };
  const drop = (hs) => {
    const i = sel.dataset.c, col = getComputedStyle(sel).getPropertyValue('--c').trim(), a = anchor(sel), pt = center(hs);
    const good = D.ok[+i].includes(hs.dataset.t);
    if (!good) {                                   // λάθος σημείο: κόκκινο ✗ και ακύρωση
      hs.classList.add('bad'); setTimeout(() => hs.classList.remove('bad'), 900);
      sel.classList.add('wrong'); const s0 = sel; setTimeout(() => s0.classList.remove('wrong'), 600);
      SFX.wrong && SFX.wrong(); cancel(); return;
    }
    if (links[i]) { links[i].g.remove(); links[i].hs.classList.remove('ok'); }
    const g = mk('g', {}); const c = curve(a, pt);
    const p = mk('path', { d: c.d, class: 'xl fix', stroke: col }); const len = 2000; p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    g.appendChild(p); g.appendChild(head(pt, c, col)); g.appendChild(mk('circle', { cx: a.x, cy: a.y, r: 6, fill: col }));
    svg.appendChild(g);
    requestAnimationFrame(() => { p.style.transition = 'stroke-dashoffset .6s ease'; p.style.strokeDashoffset = 0; });
    hs.classList.add('ok'); refreshLens();
    links[i] = { g, hs }; sel.classList.add('linked'); SFX.check();
    cancel(); const n = count();
    if (route) drawRoute(); else if (n === comps.length) SFX.right();
  };
  // φωτάκι-βοήθεια: ζωγραφίζει αυτόματα τη σωστή αντιστοίχιση ΜΟΝΟ του συγκεκριμένου εξαρτήματος
  const hintTo = (c) => {
    const i = c.dataset.c, want = D.ok[+i];
    const hs = [...layer.querySelectorAll('.hs')].find((h) => h.dataset.t === want[0]) || [...layer.querySelectorAll('.hs')].find((h) => want.includes(h.dataset.t));
    if (!hs) return;
    cancel(); sel = c; c.classList.add('sel'); c.classList.add('hinted');
    hs.classList.add('hot'); setTimeout(() => hs.classList.remove('hot'), 700);
    SFX.bulb && SFX.bulb(); drop(hs);
  };
  comps.forEach((c) => { const l = c.querySelector('.hint-l'); if (!l) return;
    l.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); });
    l.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (!c.classList.contains('linked')) hintTo(c); }); });
  comps.forEach((c) => c.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.hint-l')) return;
    e.preventDefault(); e.stopPropagation(); cancel();
    sel = c; c.classList.add('sel'); sl.classList.add('exdrag'); lens.classList.remove('on'); SFX.click(); downAt = { x: e.clientX, y: e.clientY };
    try { c.releasePointerCapture(e.pointerId); } catch (_) {}
    const a = anchor(c); live = mk('path', { class: 'xl live', stroke: getComputedStyle(c).getPropertyValue('--c').trim(), d: `M${a.x},${a.y} L${a.x},${a.y}` }); svg.appendChild(live);
  }));
  sl.addEventListener('pointermove', (e) => {
    if (!live || !sel) return; const a = anchor(sel), h = hsAt(e.clientX, e.clientY); setHot(h);
    live.setAttribute('d', curve(a, h ? center(h) : toStage(e.clientX, e.clientY)).d);
  });
  sl.addEventListener('pointerup', (e) => {
    if (!sel) return;
    const h = hsAt(e.clientX, e.clientY);
    if (h) { drop(h); return; }
    if (e.target.closest('.comp')) return;               // απλό κλικ σε εξάρτημα: η γραμμή μένει, επόμενο κλικ σε κωδικό
    const moved = downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 10;
    if (moved || !e.target.closest('.exlist')) cancel();
  });
  $('.ex-reset', sl).addEventListener('click', (e) => { e.stopPropagation(); cancel(); Object.values(links).forEach((l) => { l.g.remove(); l.hs.classList.remove('ok'); }); links = {}; comps.forEach((c) => c.classList.remove('linked', 'hinted')); $$('.route,.route-dot,.done-b', svg).forEach((x) => x.remove()); refreshLens(); count(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') cancel(); });
});

/* ---------------- DECK ---------------- */
const slides = $$('.slide');
let cur = -1, lock = 0;
const dots = $('#dots');
slides.forEach((s, i) => { const b = document.createElement('button'); b.dataset.t = `${i + 1}. ${s.dataset.title}`; b.setAttribute('aria-label', s.dataset.title); b.onclick = () => go(i); dots.appendChild(b); });
$('#pgTot').textContent = String(slides.length).padStart(2, '0');
function go(i) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  if (i === cur) return;
  closeTip();
  const old = slides[cur], n = slides[i], fwd = i > cur;
  if (old) {
    old.classList.remove('on', 'cur'); old.classList.toggle('up', fwd);
    const h = H[old.dataset.hook]; h && h.leave && h.leave(old);
  }
  n.style.transition = 'none'; n.classList.toggle('up', !fwd); void n.offsetWidth; n.style.transition = '';
  n.classList.remove('up'); n.classList.add('cur');
  setTimeout(() => { n.classList.add('on'); runCounters(n); }, 40);
  cur = i; window.scrollTo(0, 0); stage.scrollTop = stage.scrollLeft = 0;
  document.body.dataset.mood = n.dataset.mood || 'mix';
  document.body.classList.toggle('nochrome', n.classList.contains('nochrome'));
  $$('button', dots).forEach((d, k) => d.classList.toggle('on', k === i));
  $('#pgCur').textContent = String(i + 1).padStart(2, '0');
  $('#ftTitle').textContent = n.dataset.title;
  $('#progBar').style.width = ((i + 1) / slides.length * 100) + '%';
  $('#nbUp').disabled = i === 0; $('#nbDn').disabled = i === slides.length - 1;
  history.replaceState(null, '', '#' + (i + 1));
  const h = H[n.dataset.hook]; h && h.enter && h.enter(n);
}
window.go = go;
const next = () => go(cur + 1), prev = () => go(cur - 1);
$('#nbUp').onclick = prev; $('#nbDn').onclick = next;
$('#nbFs').onclick = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); else document.exitFullscreen(); };
addEventListener('keydown', (e) => {
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input') return;
  if (['PageDown', 'ArrowDown', 'ArrowRight'].includes(e.key) || (e.key === ' ' && tag !== 'button')) { e.preventDefault(); next(); }
  else if (['PageUp', 'ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === 'Home') go(0); else if (e.key === 'End') go(slides.length - 1);
  else if (e.key === 'Escape') closeTip();
});
let acc = 0;
addEventListener('wheel', (e) => {
  if (e.target.closest('input')) return;
  const now = Date.now(); if (now < lock) return;
  acc += e.deltaY; if (Math.abs(acc) > 70) { acc > 0 ? next() : prev(); acc = 0; lock = now + 950; }
}, { passive: true });
let ty = null;
addEventListener('touchstart', (e) => { ty = e.touches[0].clientY; }, { passive: true });
addEventListener('touchend', (e) => { if (ty == null) return; const d = ty - e.changedTouches[0].clientY; if (Math.abs(d) > 70 && !e.target.closest('.exphoto,.comp,input')) d > 0 ? next() : prev(); ty = null; }, { passive: true });

const start = parseInt(location.hash.slice(1), 10);
window.addEventListener('load', () => fit());
setTimeout(() => go(isNaN(start) ? 0 : start - 1), 0);
})();
