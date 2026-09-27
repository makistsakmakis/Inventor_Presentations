/* Inventor × Welcome Stores — microsite engine */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const W = 1920, H = 1080;
  const stage = $('#stage');
  const slides = $$('.slide');
  const N = slides.length;
  let cur = -1, lock = false;
  const rnd = (a, b) => a + Math.random() * (b - a);

  /* ---------- fit one screen ---------- */
  function fit() {
    const s = Math.min(innerWidth / W, innerHeight / H);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
    stage.style.transformOrigin = '50% 50%';
  }
  addEventListener('resize', fit); fit();

  /* ---------- emphasis split ---------- */
  $$('.em').forEach(el => {
    const words = el.textContent.split(/(\s+)/);
    el.textContent = '';
    let i = 0;
    words.forEach(w => {
      if (/^\s+$/.test(w)) { el.appendChild(document.createTextNode(' ')); return; }
      const ws = document.createElement('span'); ws.className = 'w';
      [...w].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++); s.textContent = c; ws.appendChild(s); });
      el.appendChild(ws);
    });
  });

  /* ---------- counters ---------- */
  function fmt(v, el) {
    const dec = +(el.dataset.dec || 0);
    let s = v.toFixed(dec);
    let [a, b] = s.split('.');
    if (el.dataset.sep) a = a.replace(/\B(?=(\d{3})+(?!\d))/g, el.dataset.sep);
    return (el.dataset.pre || '') + a + (b ? ',' + b : '') + (el.dataset.suf || '');
  }
  const easeOutExpo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  function runCount(el, extraDelay = 0) {
    const from = +(el.dataset.from || 0), to = +el.dataset.to;
    const dur = +(el.dataset.dur || 2200), delay = +(el.dataset.delay || 0) + extraDelay + 350;
    el.textContent = fmt(from, el);
    const token = el._tok = Math.random();
    setTimeout(() => {
      const t0 = performance.now();
      const step = now => {
        if (el._tok !== token) return;
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(from + (to - from) * easeOutExpo(p), el);
        if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(to, el);
      };
      requestAnimationFrame(step);
    }, delay);
  }

  /* ---------- canvas helper ---------- */
  const DPR = 1.5;
  function cv(id) {
    const c = document.getElementById(id); if (!c) return null;
    c.width = W * DPR; c.height = H * DPR;
    const x = c.getContext('2d'); x.setTransform(DPR, 0, 0, DPR, 0, 0);
    return x;
  }
  function glowDot(ctx, x, y, r, col, a = 1) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(.25, `rgba(${col},${a * .5})`); g.addColorStop(1, `rgba(${col},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 4, 0, 7); ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.arc(x, y, r * .55, 0, 7); ctx.fill();
  }
  function burst(list, x, y, n, cols, sp = 9) {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, Math.PI * 2), v = rnd(2, sp);
      list.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - rnd(0, 3), life: 1, r: rnd(1.5, 4.5), c: cols[i % cols.length] });
    }
  }
  function drawSparks(ctx, list, g = .18) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i]; p.x += p.vx; p.y += p.vy; p.vy += g; p.vx *= .985; p.life -= .014;
      if (p.life <= 0) { list.splice(i, 1); continue; }
      glowDot(ctx, p.x, p.y, p.r, p.c, p.life);
    }
  }

  /* ---------- per-slide hooks ---------- */
  const hooks = {}; // index(1-based) -> {enter, leave, tick}
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  /* S3/S4 map */
  function buildMap(host) {
    const d = window.MAP_DOTS; let h = '';
    for (let i = 0; i < d.length; i += 3) {
      h += `<circle class="${d[i + 2] ? 'd' : 'l'}" cx="${d[i]}" cy="${d[i + 1]}" r="8.2" style="--x:${Math.round(d[i] / 2146 * 1100)}"/>`;
    }
    host.innerHTML = `<svg viewBox="0 0 2146 1012">${h}</svg>`;
    return $$('circle.d', host);
  }
  const dark3 = buildMap($('#map3'));
  buildMap($('#map4'));
  let flashAcc = 0;
  hooks.s3 = {
    tick(dt) {
      flashAcc += dt;
      if (flashAcc < 45) return; flashAcc = 0;
      const k = 2 + (Math.random() * 4 | 0);
      for (let i = 0; i < k; i++) {
        const c = dark3[Math.random() * dark3.length | 0];
        if (c.classList.contains('fl')) continue;
        c.classList.add('fl');
        setTimeout(() => c.classList.remove('fl'), 560);
      }
    }
  };

  /* S8 constellation */
  const c8 = cv('fx8'); const pts8 = [];
  for (let i = 0; i < 80; i++) pts8.push({ x: rnd(1440, 1850), y: rnd(150, 950), vx: rnd(-.4, .4), vy: rnd(-.4, .4), c: Math.random() < .3 ? '255,60,70' : '140,195,255' });
  hooks.s8 = {
    tick() {
      c8.clearRect(0, 0, W, H);
      for (const p of pts8) { p.x += p.vx; p.y += p.vy; if (p.x < 1420 || p.x > 1880) p.vx *= -1; if (p.y < 120 || p.y > 980) p.vy *= -1; }
      c8.lineWidth = 1;
      for (let i = 0; i < pts8.length; i++) for (let j = i + 1; j < pts8.length; j++) {
        const a = pts8[i], b = pts8[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 150) { c8.strokeStyle = `rgba(140,195,255,${(1 - d / 150) * .35})`; c8.beginPath(); c8.moveTo(a.x, a.y); c8.lineTo(b.x, b.y); c8.stroke(); }
      }
      for (const p of pts8) glowDot(c8, p.x, p.y, 2.2, p.c, .9);
    }
  };

  /* S10 people grid */
  const ppl = $('#people');
  for (let i = 0; i < 100; i++) { const d = document.createElement('i'); d.className = 'p'; ppl.appendChild(d); }
  hooks.s10 = {
    enter() { const ps = $$('.p', ppl); ps.forEach(p => p.classList.remove('on')); for (let i = 0; i < 40; i++) later(() => ps[i].classList.add('on'), 450 + i * 55); },
  };

  /* S12 linear flow */
  const c12 = cv('fx12'); const p12 = $('#p12'); const L12 = p12.getTotalLength();
  const st12 = $$('.s12 .station'); const sx12 = [320, 640, 960, 1280, 1600];
  let t12 = 0; const trail12 = []; const sp12 = [];
  hooks.s12 = {
    enter() { t12 = 0; trail12.length = 0; },
    tick(dt) {
      c12.clearRect(0, 0, W, H);
      t12 += dt;
      const P = 6500, u = (t12 % P) / P;
      const pt = p12.getPointAtLength(u * L12);
      trail12.push({ x: pt.x, y: pt.y }); if (trail12.length > 38) trail12.shift();
      if (u < .01) trail12.length = 0;
      for (let i = 0; i < trail12.length; i++) glowDot(c12, trail12[i].x, trail12[i].y, 1 + i / 7, '255,60,70', i / trail12.length * .6);
      glowDot(c12, pt.x, pt.y, 7, '255,70,80', 1);
      sx12.forEach((x, i) => {
        const on = Math.abs(pt.x - x) < 70;
        if (on && !st12[i].classList.contains('lit')) burst(sp12, x, 560, 22, ['255,80,90', '255,255,255']);
        st12[i].classList.toggle('lit', on || (i === 2 && Math.abs(pt.x - x) < 260));
      });
      drawSparks(c12, sp12, .08);
    }
  };

  /* S13 hub network */
  const hubData = [
    ['Ανάγκη', 'need'], ['Google', 'google', 1], ['Αξιολογήσεις', 'star'], ['YouTube / Δημιουργοί', 'play'], ['Σύγκριση τιμών', 'tag'],
    ['Site κατασκευαστή', 'globe'], ['Skroutz', 'bag'], ['Φυσικό κατάστημα', 'store'], ['Τράπεζα / Κινητό', 'phone'], ['Αγορά', 'cart'],
    ['Παράδοση', 'truck'], ['Εγκατάσταση', 'wrench'], ['Σέρβις', 'gear'], ['Κριτική', 'review']
  ];
  const HC = { x: 1190, y: 565 }, RX = 520, RY = 365;
  const hub = $('#hub'); const hubsvg = $('#hubsvg');
  const nodes = hubData.map((d, i) => {
    const a = (-115 + i * 360 / hubData.length) * Math.PI / 180;
    return { x: HC.x + RX * Math.cos(a), y: HC.y + RY * Math.sin(a), lab: d[0], ic: d[1], g: !!d[2] };
  });
  let lines = '';
  nodes.forEach((n, i) => {
    lines += `<line class="sp" x1="${HC.x}" y1="${HC.y}" x2="${n.x}" y2="${n.y}"/>`;
    const m = nodes[(i + 1) % nodes.length]; lines += `<line x1="${n.x}" y1="${n.y}" x2="${m.x}" y2="${m.y}"/>`;
    if (i % 3 === 0) { const k = nodes[(i + 5) % nodes.length]; lines += `<line x1="${n.x}" y1="${n.y}" x2="${k.x}" y2="${k.y}"/>`; }
  });
  hubsvg.innerHTML = lines;
  let hh = `<div class="hubc rv zoom" style="left:${HC.x}px;top:${HC.y}px;--d:300"><svg viewBox="0 0 24 24"><use href="#i-user"/></svg></div>`;
  nodes.forEach((n, i) => {
    hh += `<div class="node ${n.g ? 'g' : ''} rv zoom" style="left:${n.x}px;top:${n.y}px;--d:${400 + i * 60}"><svg viewBox="0 0 24 24"><use href="#i-${n.ic}"/></svg><div class="lbl">${n.lab}</div></div>`;
  });
  hub.innerHTML = hh;
  const nodeEls = $$('.node', hub);
  const c13 = cv('fx13'); const pk13 = []; const sp13 = []; let acc13 = 0;
  const gi = nodes.findIndex(n => n.g);
  function ping(el) { el.classList.add('ping'); clearTimeout(el._pt); el._pt = setTimeout(() => el.classList.remove('ping'), 380); }
  hooks.s13 = {
    enter() { pk13.length = 0; },
    tick(dt) {
      c13.clearRect(0, 0, W, H);
      acc13 += dt;
      if (acc13 > 70) {
        acc13 = 0;
        const r = Math.random();
        let a, b, ai = -1, bi = -1;
        let i = Math.random() < .3 ? gi : Math.random() * nodes.length | 0;
        if (r < .45) { a = nodes[i]; b = HC; ai = i; }
        else if (r < .75) { a = HC; b = nodes[i]; bi = i; }
        else { const j = (i + (Math.random() < .5 ? 1 : nodes.length - 1)) % nodes.length; a = nodes[i]; b = nodes[j]; ai = i; bi = j; }
        const col = (ai === gi || bi === gi) ? '255,60,70' : (Math.random() < .5 ? '140,195,255' : '255,255,255');
        pk13.push({ a, b, bi, t: 0, s: rnd(.008, .018), c: col });
      }
      for (let k = pk13.length - 1; k >= 0; k--) {
        const p = pk13[k]; p.t += p.s * dt / 16;
        if (p.t >= 1) {
          if (p.bi >= 0) ping(nodeEls[p.bi]);
          else burst(sp13, HC.x, HC.y, 4, [p.c]);
          pk13.splice(k, 1); continue;
        }
        const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
        const tx = p.a.x + (p.b.x - p.a.x) * Math.max(0, p.t - .12), ty = p.a.y + (p.b.y - p.a.y) * Math.max(0, p.t - .12);
        const g = c13.createLinearGradient(tx, ty, x, y); g.addColorStop(0, `rgba(${p.c},0)`); g.addColorStop(1, `rgba(${p.c},.8)`);
        c13.strokeStyle = g; c13.lineWidth = 2.5; c13.beginPath(); c13.moveTo(tx, ty); c13.lineTo(x, y); c13.stroke();
        glowDot(c13, x, y, 3.2, p.c, .95);
      }
      drawSparks(c13, sp13, .02);
    }
  };

  /* S14 AI journey */
  function fillOrbit(el, n, r) {
    let h = '';
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; h += `<i style="left:calc(50% + ${Math.cos(a) * r}px - 6px);top:calc(50% + ${Math.sin(a) * r}px - 6px);opacity:${.35 + (i % 4) * .18}"></i>`; }
    el.innerHTML = h;
  }
  fillOrbit($('#orbit14'), 20, 235); fillOrbit($('#orbit16'), 20, 235);
  const c14 = cv('fx14'); const in14 = [], out14 = [], sp14 = []; let acc14 = 0, pulse14 = 0;
  const A = { x: 330, y: 580 }, C = { x: 960, y: 580 }, B = { x: 1590, y: 580 }; const st14c = $('#st14c');
  hooks.s14 = {
    enter() { in14.length = out14.length = 0; pulse14 = 0; },
    tick(dt) {
      c14.clearRect(0, 0, W, H);
      acc14 += dt; pulse14 += dt;
      if (acc14 > 40) {
        acc14 = 0;
        const cols = ['255,90,100', '140,195,255', '255,255,255', '190,150,255'];
        in14.push({ x: A.x + rnd(40, 90), y: A.y + rnd(-120, 120), t: 0, s: rnd(.006, .012), c: cols[Math.random() * 4 | 0], wob: rnd(0, 6) });
      }
      if (pulse14 > 1300) { pulse14 = 0; out14.push({ t: 0, tr: [] }); }
      for (let i = in14.length - 1; i >= 0; i--) {
        const p = in14[i]; p.t += p.s * dt / 16;
        if (p.t >= 1) { in14.splice(i, 1); continue; }
        const e = p.t * p.t;
        const x = p.x + (C.x - p.x) * e, y = p.y + (C.y - p.y) * e + Math.sin(p.t * 8 + p.wob) * 30 * (1 - p.t);
        glowDot(c14, x, y, 2.4, p.c, .9 * (1 - p.t * .4));
      }
      for (let i = out14.length - 1; i >= 0; i--) {
        const o = out14[i]; o.t += .012 * dt / 16;
        const e = 1 - Math.pow(1 - o.t, 3);
        const x = C.x + 120 + (B.x - 100 - C.x - 120) * e;
        o.tr.push(x); if (o.tr.length > 26) o.tr.shift();
        o.tr.forEach((tx, k) => glowDot(c14, tx, C.y, 1.5 + k / 5, '255,70,80', k / o.tr.length * .7));
        glowDot(c14, x, C.y, 9, '255,90,100', 1);
        if (o.t >= 1) {
          out14.splice(i, 1); burst(sp14, B.x - 90, B.y, 26, ['255,80,90', '255,255,255', '255,210,120']);
          st14c.classList.add('lit'); setTimeout(() => st14c.classList.remove('lit'), 520);
        }
      }
      drawSparks(c14, sp14, .1);
    }
  };

  /* S15 ghost journey */
  const gh = $('#journey').cloneNode(true);
  $$('[id]', gh).forEach(e => e.removeAttribute('id'));
  $$('canvas', gh).forEach(e => e.remove());
  $('#ghost15').appendChild(gh);

  /* S18 balance */
  const c18 = cv('fx18'); const sp18 = []; let flash18 = 0;
  function play18() {
    later(() => { burst(sp18, 1300, 630, 90, ['255,70,80', '255,255,255', '255,200,120', '255,120,130'], 14); flash18 = 1; }, 2650);
    later(() => burst(sp18, 520, 520, 24, ['255,190,200', '255,255,255'], 6), 1200);
  }
  hooks.s18 = {
    enter() { sp18.length = 0; play18(); },
    tick() {
      c18.clearRect(0, 0, W, H);
      if (flash18 > 0) { const g = c18.createRadialGradient(1300, 630, 0, 1300, 630, 900); g.addColorStop(0, `rgba(255,60,70,${flash18 * .35})`); g.addColorStop(1, 'rgba(255,60,70,0)'); c18.fillStyle = g; c18.fillRect(0, 0, W, H); flash18 -= .02; }
      drawSparks(c18, sp18, .22);
    }
  };
  $('#replay18').addEventListener('click', () => {
    const sc = $('.s18 .scale'); sc.replaceWith(sc.cloneNode(true));
    sp18.length = 0; timers.forEach(clearTimeout); timers = []; play18();
    $$('.s18 .count').forEach(el => runCount(el, -2300));
  });

  /* S19 loyalty — interactive */
  const tp = [
    ['Πριν την επίσκεψη', 'Online stock και διαθεσιμότητα'],
    ['Στο κατάστημα', 'Γνώση του πωλητή, ταχύτητα'],
    ['Σημείο πώλησης', 'Προνόμια'],
    ['Παράδοση & Εγκατάσταση', 'Ταχύτητα, επικοινωνία'],
    ['Υποστήριξη μετά την πώληση', 'Χρόνος αντίδρασης, εγγύηση'],
    ['Μετά την αγορά', 'Επικοινωνία μετά την αγορά / αξιολόγηση']
  ];
  const LC = { x: 1250, y: 560 }, LRX = 440, LRY = 330, RR = 150;
  const s19 = $('#s19'), links = $('#links19'), tpHost = $('#tp19');
  const ang = i => (-90 + i * 60) * Math.PI / 180;
  const arc = (a0, a1) => { const p = a => [LC.x + RR * Math.cos(a), LC.y + RR * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${RR} ${RR} 0 0 1 ${x1} ${y1}`; };
  let lh = '', th = '';
  tp.forEach((t, i) => {
    const a = ang(i), x = LC.x + LRX * Math.cos(a), y = LC.y + LRY * Math.sin(a);
    lh += `<line data-i="${i}" x1="${LC.x + 125 * Math.cos(a)}" y1="${LC.y + 125 * Math.sin(a)}" x2="${x}" y2="${y}"/>`;
    lh += `<path class="seg" data-i="${i}" d="${arc(a - .42, a + .42)}"/>`;
    th += `<div class="tile rv" data-i="${i}" style="left:${x}px;top:${y}px;--d:${500 + i * 110}"><div class="face front"><div class="num">${i + 1}</div><h3>${t[0].replace('&', '&amp;')}</h3></div><div class="face back"><div class="k">${t[0].replace('&', '&amp;')}</div><p>${t[1]}</p></div></div>`;
  });
  links.innerHTML = lh; tpHost.innerHTML = th;
  const tiles19 = $$('.tile', tpHost);
  const done = new Set(); const c19 = cv('fx19'); const sp19 = []; let ring19 = 0;
  function mark(i) {
    if (done.has(i)) return; done.add(i);
    tiles19[i].classList.add('done');
    $$(`#links19 [data-i="${i}"]`).forEach(e => e.classList.add('on'));
    const a = ang(i); burst(sp19, LC.x + LRX * Math.cos(a), LC.y + LRY * Math.sin(a), 18, ['255,80,90', '255,255,255'], 6);
    $('#prog19').textContent = `${done.size}/6`; $('#lp19').textContent = `${done.size} / 6`;
    if (done.size === 6) setTimeout(complete, 500);
  }
  function complete() {
    s19.classList.add('complete'); ring19 = 1;
    burst(sp19, LC.x, LC.y, 140, ['255,70,80', '255,255,255', '255,200,120', '255,130,140'], 16);
    runCount($('#q64'), -300);
  }
  function reset19() {
    done.clear(); s19.classList.remove('complete'); tour = false;
    tiles19.forEach(t => t.classList.remove('done', 'flipped'));
    $$('#links19 .on').forEach(e => e.classList.remove('on'));
    $('#prog19').textContent = '0/6'; $('#lp19').textContent = '0 / 6'; $('#q64').textContent = '0%';
  }
  tiles19.forEach((t, i) => {
    t.addEventListener('mouseenter', () => mark(i));
    t.addEventListener('click', () => { t.classList.toggle('flipped'); mark(i); });
  });
  let tour = false;
  $('#tour19').addEventListener('click', () => {
    reset19(); tour = true;
    tiles19.forEach((t, i) => {
      later(() => { if (!tour) return; t.classList.add('flipped'); mark(i); }, 300 + i * 1500);
      later(() => { t.classList.remove('flipped'); }, 300 + i * 1500 + 1400);
    });
  });
  $('#reset19').addEventListener('click', reset19);
  $('#loyal19').addEventListener('click', () => burst(sp19, LC.x, LC.y, 50, ['255,70,80', '255,255,255'], 10));
  hooks.s19 = {
    tick() {
      c19.clearRect(0, 0, W, H);
      if (ring19 > 0) {
        c19.strokeStyle = `rgba(255,80,90,${ring19})`; c19.lineWidth = 3;
        c19.beginPath(); c19.arc(LC.x, LC.y, 150 + (1 - ring19) * 500, 0, 7); c19.stroke(); ring19 -= .012;
      }
      drawSparks(c19, sp19, .12);
    },
    leave() { tour = false; }
  };

  /* ================= PART 2 hooks ================= */
  /* x19 six dots */
  (() => { const r = $('#six19'); let h = ''; for (let i = 0; i < 6; i++) { const a = (-90 + i * 60) * Math.PI / 180; h += `<span class="line" style="transform:rotate(${a}rad)"><b class="arw" style="animation-delay:${i * .27}s"></b></span><i style="left:${50 + 41 * Math.cos(a)}%;top:${50 + 41 * Math.sin(a)}%"><em>${i + 1}</em></i>`; } r.innerHTML = h; })();

  /* ---------- groups & menu ---------- */
  const PILLARS = [
    { t: 'Πριν την επίσκεψη', d: 'Απόθεμα σε πραγματικό χρόνο και παραγγελία 24/7, πριν ο πελάτης έρθει στο κατάστημα.' },
    { t: 'Στο κατάστημα', d: 'Γνώση του πωλητή και ταχύτητα — με την INVY, το νέο μας σύστημα AI, δίπλα του.' },
    { t: 'Σημείο πώλησης', d: 'Προνόμια που περνούν από την Inventor στον συνεργάτη και στον τελικό πελάτη.' },
    { t: 'Παράδοση & Εγκατάσταση', d: 'Ορατότητα παραγγελιών, ανταλλακτικά χωρίς αναμονή και το MyPartner στο πεδίο.' },
    { t: 'Υποστήριξη μετά την πώληση', d: 'Η χρυσή εγγύηση Inventor στην πράξη, για τον συνεργάτη και τον καταναλωτή.' },
    { t: 'Μετά την αγορά', d: 'Μετράμε την εμπειρία: βαθμολογίες Google και ερωτηματολόγια NPS.' }
  ];
  const groupOf = i => slides[i].dataset.group || 'main';
  const seqOf = g => slides.map((s, i) => i).filter(i => groupOf(i) === g);
  const menuIdx = slides.findIndex(s => s.id === 'menu');
  const MC = { x: 1250, y: 560 }, MRX = 450, MRY = 330, MR = 150;
  const mAng = i => (-90 + i * 60) * Math.PI / 180;
  const mPos = i => ({ x: MC.x + MRX * Math.cos(mAng(i)), y: MC.y + MRY * Math.sin(mAng(i)) });
  const mArc = (a0, a1) => { const p = a => [MC.x + MR * Math.cos(a), MC.y + MR * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${MR} ${MR} 0 0 1 ${x1} ${y1}`; };
  const raysSvg = $('#menuRays'), pilHost = $('#pillars');
  raysSvg.innerHTML = PILLARS.map((p, i) => `<line class="ray" data-i="${i}" x1="${MC.x}" y1="${MC.y}" x2="${mPos(i).x}" y2="${mPos(i).y}"/><path class="mseg" data-i="${i}" d="${mArc(mAng(i) - .42, mAng(i) + .42)}"/>`).join('');
  pilHost.innerHTML = PILLARS.map((p, i) => {
    const n = seqOf('p' + (i + 1)).length, q = mPos(i);
    return `<div class="opt rv zoom" data-p="${i + 1}" style="left:${q.x}px;top:${q.y}px;--d:${400 + i * 120}">
      <div class="num"><span class="nn">${i + 1}</span><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
      <h3>${p.t.replace('&', '&amp;')}</h3><div class="cnt">${n} ${n === 1 ? 'οθόνη' : 'οθόνες'}</div></div>`;
  }).join('');
  const pillarEls = $$('.opt', pilHost), rays = $$('#menuRays .ray'), msegs = $$('#menuRays .mseg');
  const visited = new Set();
  const cMenu = cv('fxMenu'); const spMenu = []; let mT = 0, mRing = 0;
  const menuEl = $('#menu');
  function refreshMenu() {
    pillarEls.forEach((el, i) => el.classList.toggle('done', visited.has(i + 1)));
    rays.forEach((r, i) => r.classList.toggle('done', visited.has(i + 1)));
    msegs.forEach((r, i) => r.classList.toggle('on', visited.has(i + 1)));
    $('#menuProg').textContent = `${visited.size} / 6`; $('#mcoreN').textContent = `${visited.size} / 6`;
    if (visited.size === 6 && !menuEl.classList.contains('complete')) {
      later(() => {
        menuEl.classList.add('complete', 'celebrate'); mRing = 1;
        burst(spMenu, MC.x, MC.y, 170, ['255,70,80', '255,255,255', '255,200,120', '255,130,140'], 16);
        later(() => menuEl.classList.remove('celebrate'), 3200);
      }, 2000);
    }
  }
  pillarEls.forEach((el, i) => {
    el.addEventListener('mouseenter', () => { menuEl.classList.add('hovering'); rays[i].classList.add('hot'); });
    el.addEventListener('mouseleave', () => { menuEl.classList.remove('hovering'); rays[i].classList.remove('hot'); });
    el.addEventListener('click', () => {
      const p = +el.dataset.p; el.classList.add('launch');
      setTimeout(() => { el.classList.remove('launch'); menuEl.classList.remove('hovering'); rays[i].classList.remove('hot'); go(seqOf('p' + p)[0]); }, 420);
    });
  });
  $('#menuReset').addEventListener('click', () => { visited.clear(); menuEl.classList.remove('complete', 'celebrate'); refreshMenu(); });
  $('#mcore').addEventListener('click', () => burst(spMenu, MC.x, MC.y, 50, ['255,70,80', '255,255,255'], 10));
  hooks.menu = {
    enter() { menuEl.classList.remove('settled', 'hovering', 'celebrate'); refreshMenu(); later(() => menuEl.classList.add('settled'), 1900); },
    tick(dt) {
      mT += dt / 1000;
      pillarEls.forEach((el, i) => {
        const dx = Math.sin(mT * .55 + i * 1.3) * 7, dy = Math.cos(mT * .7 + i * 1.7) * 11;
        el.style.translate = `${dx}px ${dy}px`;
        const q = mPos(i); rays[i].setAttribute('x2', q.x + dx); rays[i].setAttribute('y2', q.y + dy);
      });
      cMenu.clearRect(0, 0, W, H);
      if (mRing > 0) { cMenu.strokeStyle = `rgba(255,80,90,${mRing})`; cMenu.lineWidth = 3; cMenu.beginPath(); cMenu.arc(MC.x, MC.y, 150 + (1 - mRing) * 560, 0, 7); cMenu.stroke(); mRing -= .01; }
      drawSparks(cMenu, spMenu, .12);
    }
  };
  $('#backBtn').addEventListener('click', () => go(menuIdx));

  /* ---------- lightbox ---------- */
  const lb = $('#lb'), lbImg = $('img', lb);
  const openLB = src => { lbImg.src = src; lb.classList.add('open'); };
  lb.addEventListener('click', () => lb.classList.remove('open'));
  $$('.shot').forEach(f => {
    if (f.classList.contains('zl')) return;
    f.addEventListener('click', () => openLB($('img', f).src));
  });

  /* ---------- zoom reveal ---------- */
  function layoutZR(zr) {
    const zl = $('.zl', zr), zd = $('.zd', zr), hot = $('.hot', zr), iw = $('.iw', zl);
    const ax = zl.offsetLeft + iw.offsetLeft + hot.offsetLeft + hot.offsetWidth / 2, ay = zl.offsetTop + iw.offsetTop + hot.offsetTop + hot.offsetHeight / 2;
    const x2 = zd.offsetLeft + 2, y1 = zd.offsetTop + 30, y2 = zd.offsetTop + zd.offsetHeight - 30;
    const poly = $('polygon', zr);
    poly.setAttribute('points', `${ax},${ay} ${x2},${y1} ${x2},${y2}`);
    poly.style.transformOrigin = `${ax}px ${ay}px`;
    zd.style.transformOrigin = `${ax - zd.offsetLeft}px ${ay - zd.offsetTop}px`;
  }
  const zrs = $$('.zr');
  const toggleZR = (zr, on) => { layoutZR(zr); zr.classList.toggle('open', on === undefined ? !zr.classList.contains('open') : on); };
  zrs.forEach(zr => {
    $('.zl', zr).addEventListener('click', () => toggleZR(zr));
    $('.zd', zr).addEventListener('click', e => { e.stopPropagation(); openLB($('.zd img', zr).src); });
  });
  addEventListener('load', () => zrs.forEach(layoutZR));

  /* ---------- p3a flow ---------- */
  let vfT = 0;
  hooks.p3a = { enter() { vfT = 0; }, tick(dt) { vfT += dt; const k = Math.floor(vfT / 800) % 5; $$('#vflow .vn').forEach((n, i) => n.classList.toggle('lit', k < 4 && i <= k)); } };

  /* ---------- p4c video ---------- */
  const mp = $('#mpVideo');
  hooks.p4c = { enter() { try { mp.currentTime = 0; const p = mp.play(); p && p.catch(() => {}); } catch (e) {} }, leave() { mp.pause(); } };

  /* ---------- p6a stacked bars ---------- */
  const GR = ['Πολύ κακή', 'Κακή', 'Μέτρια', 'Καλή', 'Πολύ καλή'];
  const GC = ['#3b2a31', '#6a2a36', '#9c2d3c', '#d2404d', '#ff2536'];
  const ROWS = [
    ['Ευγένεια — επαγγελματισμός του προσωπικού', [1.5, 0.5, 2, 8.5, 87.5]],
    ['Ταχύτητα επίλυσης του ζητήματός σας', [4, 1.5, 6, 20, 68.5]],
    ['Τεχνική κατάρτιση του προσωπικού που σας εξυπηρέτησε', [2.5, 0.5, 3, 12, 82]],
    ['Ευκολία επικοινωνίας με την τεχνική εξυπηρέτηση', [2.5, 2, 5, 16, 74.5]]
  ];
  $('#stackRows').innerHTML = ROWS.map(r => `<div class="srow"><div class="q">${r[0]}</div><div class="sbar">${r[1].map((v, k) =>
    `<div class="seg" data-w="${v}" data-t="${GR[k]}" data-q="${r[0]}" style="background:${GC[k]}">${v >= 8 ? `<span>${String(v).replace('.', ',')}%</span>` : ''}</div>`).join('')}</div></div>`).join('');
  $('#stackLegend').innerHTML = GR.map((g, k) => `<span><i style="background:${GC[k]}"></i>${g}</span>`).join('');
  const segs = $$('#stackRows .seg');
  hooks.p6a = {
    enter() { segs.forEach(s => s.style.width = '0'); segs.forEach((s, i) => later(() => s.style.width = `calc(${s.dataset.w}% - 2px)`, 700 + (i % 5) * 180 + Math.floor(i / 5) * 160)); }
  };

  /* ---------- p6b horizontal bars ---------- */
  const HB = [['Inventor', 4.8, 1], ['FG Europe', 3.8], ['Daikin Hellas', 3.0], ['Toyotomi', 2.6], ['LG Electronics', 2.1]];
  const hbars = $('#hbars');
  hbars.insertAdjacentHTML('beforeend', HB.map(b => `<div class="hrow ${b[2] ? 'me' : ''}"><div class="nm">${b[0]}</div><div class="track"><div class="bar" data-v="${b[1]}" data-t="${b[0]}"></div><div class="val"><span class="count" data-to="${b[1]}" data-dec="1" data-dur="1600" data-delay="500">0</span> ★</div></div></div>`).join(''));
  $('#hgrid').innerHTML = [0, 1, 2, 3, 4, 5].map(v => `<i style="left:${v * 20}%"><span>${v}</span></i>`).join('');
  const hb = $$('.hrow .bar', hbars), hv = $$('.hrow .val', hbars);
  hooks.p6b = {
    enter() { hb.forEach((b, i) => { b.style.width = '0'; hv[i].style.left = '0'; }); hb.forEach((b, i) => later(() => { const w = b.dataset.v / 5 * 100 + '%'; b.style.width = w; hv[i].style.left = w; hv[i].style.transition = 'left 1.6s cubic-bezier(.2,.8,.2,1)'; }, 600 + i * 150)); }
  };

  /* ---------- tooltips ---------- */
  const tip = $('#tip');
  const showTip = (e, html) => { tip.innerHTML = html; tip.style.opacity = 1; tip.style.left = e.clientX + 16 + 'px'; tip.style.top = e.clientY - 12 + 'px'; };
  segs.forEach(s => { s.addEventListener('mousemove', e => showTip(e, `${s.dataset.q}<br><b>${s.dataset.t}: ${String(s.dataset.w).replace('.', ',')}%</b>`)); s.addEventListener('mouseleave', () => tip.style.opacity = 0); });
  hb.forEach(b => { b.addEventListener('mousemove', e => showTip(e, `${b.dataset.t}<br><b>${String(b.dataset.v).replace('.', ',')} / 5 ★</b>`)); b.addEventListener('mouseleave', () => tip.style.opacity = 0); });
  $$('.s9 .bar').forEach((b, i) => { b.addEventListener('mousemove', e => showTip(e, i ? '2026 · <b>9.000.000 επισκέψεις (+93%)</b>' : '2025 · <b>4.700.000 επισκέψεις</b>')); b.addEventListener('mouseleave', () => tip.style.opacity = 0); });

  /* agenda links */
  $$('.s2 .tile').forEach(t => t.addEventListener('click', () => go(+t.dataset.go - 1)));

  /* ---------- navigation ---------- */
  const dotsEl = $('#dots');
  let dots = [], dotsGroup = null;
  function buildDots(g) {
    dotsGroup = g; dotsEl.innerHTML = '';
    dots = seqOf(g).map(i => { const a = document.createElement('a'); a.title = `${i + 1}`; a.onclick = () => go(i); dotsEl.appendChild(a); return a; });
  }
  const notes = $('#notes'), notesText = $('#notesText');

  function go(n) {
    n = Math.max(0, Math.min(N - 1, n));
    if (n === cur) return;
    const prev = cur;
    if (prev >= 0) {
      const h = hooks[slides[prev].classList[1]]; h && h.leave && h.leave();
      slides[prev].classList.remove('active');
      slides[prev].classList.toggle('prev', n > prev);
      $$('.zr.open', slides[prev]).forEach(z => z.classList.remove('open'));
      const pg = groupOf(prev); if (pg !== 'main') visited.add(+pg.slice(1));
    }
    lb.classList.remove('open'); tip.style.opacity = 0;
    timers.forEach(clearTimeout); timers = [];
    cur = n;
    const s = slides[n], g = groupOf(n), seq = seqOf(g), pos = seq.indexOf(n);
    s.classList.remove('prev');
    void s.offsetWidth;
    s.classList.add('active');
    document.body.dataset.slide = n + 1;
    document.body.dataset.group = g;
    document.body.dataset.bg = s.dataset.bg || '';
    if (dotsGroup !== g) buildDots(g);
    dots.forEach((d, i) => d.classList.toggle('on', i === pos));
    const label = g === 'main' ? '' : `Πυλώνας ${g.slice(1)} · `;
    $('#counter').innerHTML = `${label}<b>${String(pos + 1).padStart(2, '0')}</b> / ${String(seq.length).padStart(2, '0')}`;
    $('#pbar').style.width = ((pos + 1) / seq.length * 100) + '%';
    $('#prevBtn').disabled = g === 'main' && pos === 0;
    $('#nextBtn').disabled = g === 'main' && pos === seq.length - 1;
    notesText.textContent = s.dataset.notes || '—';
    $$('.count', s).forEach(el => { if (!el.dataset.manual) runCount(el); });
    const h = hooks[slides[n].classList[1]]; h && h.enter && h.enter();
    history.replaceState(null, '', '#' + (n + 1));
    lock = true; setTimeout(() => lock = false, 750);
  }
  function step(d) {
    const g = groupOf(cur), seq = seqOf(g), pos = seq.indexOf(cur);
    if (d > 0) { const z = $('.zr', slides[cur]); if (z && !z.classList.contains('open')) { toggleZR(z, true); return; } }
    const np = pos + d;
    if (np < 0 || np >= seq.length) { if (g !== 'main') go(menuIdx); return; }
    go(seq[np]);
  }
  const next = () => step(1), prevS = () => step(-1);
  $('#nextBtn').onclick = next; $('#prevBtn').onclick = prevS;
  $('#fsBtn').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
  $('#notesBtn').onclick = () => notes.classList.toggle('open');

  addEventListener('keydown', e => {
    if (['PageDown', 'ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); next(); hideHint(); }
    else if (['PageUp', 'ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); prevS(); hideHint(); }
    else if (e.key === 'Escape') { if (lb.classList.contains('open')) lb.classList.remove('open'); else if (groupOf(cur) !== 'main') go(menuIdx); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(menuIdx);
    else if (e.key === 'f' || e.key === 'F') $('#fsBtn').onclick();
    else if (e.key === 'n' || e.key === 'N') notes.classList.toggle('open');
  });
  let wheelAcc = 0, wheelT = 0;
  addEventListener('wheel', e => {
    e.preventDefault();
    const now = performance.now(); if (now - wheelT > 250) wheelAcc = 0; wheelT = now;
    wheelAcc += e.deltaY;
    if (lock || Math.abs(wheelAcc) < 40) return;
    wheelAcc > 0 ? next() : prevS(); wheelAcc = 0; hideHint();
  }, { passive: false });
  let ty0 = null;
  addEventListener('touchstart', e => ty0 = e.touches[0].clientY, { passive: true });
  addEventListener('touchend', e => { if (ty0 === null) return; const d = ty0 - e.changedTouches[0].clientY; if (Math.abs(d) > 50) d > 0 ? next() : prevS(); ty0 = null; });

  const hint = $('#hint'); const hideHint = () => hint.classList.add('hide'); setTimeout(hideHint, 6000);

  /* ---------- loop ---------- */
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(50, now - last); last = now;
    const h = (cur >= 0 && hooks[slides[cur].classList[1]]); if (h && h.tick) h.tick(dt);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (Number.isFinite(n) && n - 1 !== cur) go(n - 1); });
  const start = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(start) ? start - 1 : 0);
})();
