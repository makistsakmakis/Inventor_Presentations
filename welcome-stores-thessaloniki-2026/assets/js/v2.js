/* Welcome Stores · v2 — hooks για τις νέες σελίδες (φορτώνεται πριν το app.js) */
(window.WS_EXT = window.WS_EXT || []).push(api => {
  'use strict';
  const { hooks, later, cv, glowDot, burst, drawSparks, rnd, runCount, $, $$, W, H } = api;
  const NS = 'http://www.w3.org/2000/svg';
  const fmtN = (v, d = 0) => v.toFixed(d).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const tip = $('#tip');
  const showTip = (e, html) => { tip.innerHTML = html; tip.style.opacity = 1; tip.style.left = e.clientX + 16 + 'px'; tip.style.top = e.clientY - 12 + 'px'; };
  const hideTip = () => tip.style.opacity = 0;
  const bindTip = (el, html) => { el.addEventListener('mousemove', e => showTip(e, typeof html === 'function' ? html() : html)); el.addEventListener('mouseleave', hideTip); };
  const enterOf = (k, fn) => { hooks[k] = Object.assign(hooks[k] || {}, { enter: fn }); };

  /* ---------- «ριπή» λεζάντες ---------- */
  $$('.burst').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const s = document.createElement('span'); s.className = 'bw'; s.style.setProperty('--i', i); s.textContent = w;
      el.appendChild(s); if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.style.setProperty('--bd', (+(el.dataset.bd || 400)) + 'ms');
  });

  /* ---------- SVG helper ---------- */
  const mk = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };

  /* ================= n6 · γραμμικό διάγραμμα ================= */
  (() => {
    const host = $('#n6chart'), svg = $('.lcsvg', host);
    const cats = ['2021', '2022', '2023', '2024', '2025', '2026'];
    const S = [{ n: 'Sales', v: [69, 89, 98, 80, 74, 70], c: '#4aa3ff', g: 'gN6a' }, { n: 'EBIT', v: [12, 11, 21, 14, 11, 9], c: '#ff4a57', g: 'gN6b' }];
    const L = 70, R = 1010, T = 30, B = 560, ymax = 120;
    const X = i => L + (R - L) * i / (cats.length - 1), Y = v => B - (B - T) * v / ymax;
    const defs = mk('defs', {}, svg);
    S.forEach(s => { const lg = mk('linearGradient', { id: s.g, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); mk('stop', { offset: 0, 'stop-color': s.c, 'stop-opacity': .45 }, lg); mk('stop', { offset: 1, 'stop-color': s.c, 'stop-opacity': 0 }, lg); });
    const fl = mk('filter', { id: 'n6glow', x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs); mk('feGaussianBlur', { stdDeviation: 6, result: 'b' }, fl); const fm = mk('feMerge', {}, fl); mk('feMergeNode', { in: 'b' }, fm); mk('feMergeNode', { in: 'SourceGraphic' }, fm);
    for (let v = 0; v <= ymax; v += 20) { mk('line', { class: 'gl', x1: L, x2: R, y1: Y(v), y2: Y(v) }, svg); mk('text', { class: 'yl', x: L - 16, y: Y(v) + 6, 'text-anchor': 'end' }, svg).textContent = v; }
    cats.forEach((c, i) => mk('text', { class: 'xl', x: X(i), y: B + 44, 'text-anchor': 'middle' }, svg).textContent = c);
    const cross = mk('line', { class: 'cross', x1: 0, x2: 0, y1: T, y2: B }, svg);
    const smooth = pts => pts.reduce((d, p, i, a) => { if (!i) return `M${p[0]} ${p[1]}`; const q = a[i - 1], cx = (q[0] + p[0]) / 2; return d + ` C${cx} ${q[1]} ${cx} ${p[1]} ${p[0]} ${p[1]}`; }, '');
    const groups = S.map(s => {
      const g = mk('g', { class: 'ser' }, svg);
      const pts = s.v.map((v, i) => [X(i), Y(v)]);
      const d = smooth(pts);
      const ar = mk('path', { class: 'ar', d: d + ` L${R} ${B} L${L} ${B} Z`, fill: `url(#${s.g})` }, g);
      const ln = mk('path', { class: 'ln', d, stroke: s.c, filter: 'url(#n6glow)' }, g);
      const dots = pts.map((p, i) => {
        const c = mk('circle', { class: 'pt', cx: p[0], cy: p[1], r: 0, fill: '#fff', stroke: s.c, 'stroke-width': 4 }, g);
        const t = mk('text', { class: 'pv', x: p[0], y: p[1] - 22, 'text-anchor': 'middle' }, g); t.textContent = s.v[i];
        return { c, t };
      });
      return { g, ar, ln, dots, s };
    });
    // hover columns
    cats.forEach((c, i) => {
      const hit = mk('rect', { class: 'hit', x: X(i) - (R - L) / 10, y: T, width: (R - L) / 5, height: B - T }, svg);
      hit.addEventListener('mousemove', e => {
        cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.style.opacity = 1;
        groups.forEach(G => G.dots[i].c.setAttribute('r', 13));
        showTip(e, `<b>${c}</b><br>${S.map(s => `<span style="color:${s.c}">●</span> ${s.n}: <b>${s.v[i]}</b>`).join('<br>')}`);
      });
      hit.addEventListener('mouseleave', () => { cross.style.opacity = 0; groups.forEach(G => G.dots[i].c.setAttribute('r', 8)); hideTip(); });
    });
    const leg = $('#n6leg');
    S.forEach((s, k) => {
      const b = document.createElement('button'); b.innerHTML = `<i style="background:${s.c};box-shadow:0 0 12px ${s.c}"></i>${s.n}`;
      b.onclick = () => { b.classList.toggle('off'); groups[k].g.classList.toggle('off'); };
      leg.appendChild(b);
    });
    enterOf('n6', () => {
      groups.forEach((G, k) => {
        const len = G.ln.getTotalLength();
        G.ln.style.transition = 'none'; G.ln.style.strokeDasharray = len; G.ln.style.strokeDashoffset = len; G.ar.style.opacity = 0;
        G.dots.forEach(d => { d.c.setAttribute('r', 0); d.t.style.opacity = 0; });
        G.ln.getBoundingClientRect();
        later(() => { G.ln.style.transition = 'stroke-dashoffset 2.6s cubic-bezier(.4,0,.2,1)'; G.ln.style.strokeDashoffset = 0; }, 700 + k * 500);
        later(() => G.ar.style.opacity = 1, 1900 + k * 500);
        G.dots.forEach((d, i) => later(() => { d.c.setAttribute('r', 8); d.t.style.opacity = 1; }, 900 + k * 500 + i * 400));
      });
    });
  })();

  /* ================= n7 · οριζόντιες μπάρες ================= */
  (() => {
    const A = [['Inventor', 51, 'Higher among 25-34 y/o'], ['Toyotomi', 42, 'Higher among Attica'], ['Fujitsu', 36], ['Daikin', 29, 'Higher among 45-55 y/o'], ['Mitsubishi', 26], ['LG', 24], ['Bosch', 20], ['Midea', 20], ['Morris', 15], ['Pitsos', 13], ['TCL', 10]];
    const B = [['Inventor', 54], ['Toyotomi', 44, 'Higher among male'], ['Fujitsu', 38], ['LG', 33], ['Daikin', 32], ['Midea', 23], ['Mitsubishi', 23, 'Higher among male'], ['Bosch', 22], ['Morris', 17], ['Pitsos', 16], ['TCL', 11], ['Juro Pro', 9], ['Sendo', 4], ['Carrier', 1]];
    const build = (id, data, title) => {
      const rows = $('.rows', $(id)), max = 56;
      let fn = 0; const notes = [];
      rows.innerHTML = data.map(d => { const m = d[2] ? (notes.push(d[2]), ++fn) : 0;
        return `<div class="r ${d[0] === 'Inventor' ? 'me' : ''}"><div class="nm">${d[0]}</div><div class="tr"><div class="br" data-v="${d[1]}"></div><div class="vv" style="left:0">${d[1]}${m ? `<sup class="fn">${m}</sup>` : ''}</div></div></div>`; }).join('');
      $(id).insertAdjacentHTML('beforeend', `<div class="fns">${notes.map((n, i) => `<span><sup class="fn">${i + 1}</sup>${n}</span>`).join('')}</div>`);
      const brs = $$('.br', rows), vvs = $$('.vv', rows);
      brs.forEach((b, i) => bindTip(b, `${title}<br><b>${data[i][0]}: ${data[i][1]}</b>`));
      return () => brs.forEach((b, i) => { b.style.width = 0; vvs[i].style.left = 0; later(() => { const w = data[i][1] / max * 100 + '%'; b.style.width = w; vvs[i].style.left = w; }, 900 + i * 90); });
    };
    const ra = build('#n7a', A, 'Buyers in past 2 years'), rb = build('#n7b', B, 'Potential buyers within next year');
    enterOf('n7', () => { ra(); rb(); });
  })();

  /* ================= n8 · step ================= */
  hooks.n8 = { step() { runCount($('#n8c'), 600); } };

  /* ================= n10 · ουρά που μικραίνει ================= */
  (() => {
    const svg = $('#queue10');
    const door = mk('g', {}, svg);
    mk('rect', { class: 'door', x: 870, y: 60, width: 110, height: 170, rx: 10 }, door);
    const st = mk('path', { d: 'M862 64l59-34 67 34', fill: 'none', stroke: 'rgba(255,255,255,.4)', 'stroke-width': 2 }, door);
    // διαδρομή S
    const path = mk('path', { d: 'M900 250 C900 330 700 320 560 330 C380 345 300 420 300 470 C300 540 520 540 640 560 C760 580 760 620 700 640', fill: 'none', stroke: 'rgba(255,255,255,.16)', 'stroke-width': 3, 'stroke-dasharray': '6 12', 'stroke-linecap': 'round' }, svg);
    const LEN = path.getTotalLength(), N = 46;
    const person = (x, y, s, col) => {
      const o = mk('g', { transform: `translate(${x} ${y}) scale(${s})` }, svg), g = mk('g', { class: 'pp' }, o);
      mk('circle', { cx: 0, cy: -34, r: 9, fill: col }, g);
      mk('path', { d: 'M-11 -20h22l5 28h-8l-2 26h-12l-2-26h-8z', fill: col }, g);
      return g;
    };
    const ppl = [];
    for (let i = 0; i < N; i++) {
      const p = path.getPointAtLength(Math.min(LEN, 20 + i * (LEN - 30) / N));
      const jx = rnd(-22, 22), jy = rnd(-14, 14), s = .9 + (p.y / 640) * .5;
      ppl.push({ g: person(p.x + jx, p.y + jy, s, 'rgba(255,255,255,.75)'), buyer: false });
    }
    const conv = $('#conv10');
    let t0 = 0;
    hooks.n10 = {
      enter() {
        t0 = 0;
        ppl.forEach(p => { p.g.classList.remove('gone'); $$('circle,path', p.g).forEach(e => e.setAttribute('fill', 'rgba(255,255,255,.75)')); });
        conv.textContent = '0%';
        // η ουρά μικραίνει από το τέλος, οι μπροστινοί γίνονται αγοραστές (conversion ↑)
        for (let k = 0; k < 26; k++) later(() => ppl[N - 1 - k].g.classList.add('gone'), 1200 + k * 130);
        for (let k = 0; k < 14; k++) later(() => { $$('circle,path', ppl[k].g).forEach(e => e.setAttribute('fill', '#3ee08f')); conv.textContent = Math.round((k + 1) / 20 * 100) + '%'; }, 2400 + k * 160);
      }
    };
  })();

  /* ================= n11 · premium γραμμικό (στυλ σελ. 6) ================= */
  (() => {
    const host = $('#n11chart'), svg = $('.lcsvg', host), leg = $('.sl-legend', host);
    const D = [['TELECOM', 588, 596, '#c084fc'], ['MDA', 367, 376, '#4aa3ff'], ['IT', 281, 247, '#9ae66e'], ['CLIMA', 261, 214, '#3ee08f'], ['CE', 186, 197, '#38bdf8'], ['SDA', 147, 157, '#ff9f43']];
    const L = 150, R = 860, T = 30, B = 560, ymax = 700;
    const X = i => L + (R - L) * i, Y = v => B - (B - T) * v / ymax;
    const defs = mk('defs', {}, svg);
    const fl = mk('filter', { id: 'n11glow', x: '-20%', y: '-50%', width: '140%', height: '200%' }, defs); mk('feGaussianBlur', { stdDeviation: 5, result: 'b' }, fl); const fm = mk('feMerge', {}, fl); mk('feMergeNode', { in: 'b' }, fm); mk('feMergeNode', { in: 'SourceGraphic' }, fm);
    for (let v = 0; v <= ymax; v += 100) mk('line', { class: 'gl', x1: L, x2: R, y1: Y(v), y2: Y(v) }, svg);
    ['2025', '2026'].forEach((c, i) => mk('text', { class: 'xl', x: X(i), y: B + 44, 'text-anchor': 'middle' }, svg).textContent = c);
    const spread = vals => { const o = vals.map((v, i) => ({ i, y: Y(v) })).sort((a, b) => a.y - b.y); for (let k = 1; k < o.length; k++) if (o[k].y - o[k - 1].y < 30) o[k].y = o[k - 1].y + 30; const r = []; o.forEach(q => r[q.i] = q.y); return r; };
    const LY = spread(D.map(d => d[2]));
    const LY0 = spread(D.map(d => d[1]));
    const G = D.map((d, k) => {
      const lg = mk('linearGradient', { id: 'n11a' + k, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); mk('stop', { offset: 0, 'stop-color': d[3], 'stop-opacity': .28 }, lg); mk('stop', { offset: 1, 'stop-color': d[3], 'stop-opacity': 0 }, lg);
      const g = mk('g', { class: 'ser' }, svg);
      const y0 = Y(d[1]), y1 = Y(d[2]), dd = `M${X(0)} ${y0} C${X(.5)} ${y0} ${X(.5)} ${y1} ${X(1)} ${y1}`;
      const ar = mk('path', { class: 'ar', d: dd + ` L${R} ${B} L${L} ${B} Z`, fill: `url(#n11a${k})` }, g);
      const ln = mk('path', { class: 'ln', d: dd, stroke: d[3], filter: 'url(#n11glow)' }, g);
      const c0 = mk('circle', { class: 'pt', cx: X(0), cy: y0, r: 0, fill: '#fff', stroke: d[3], 'stroke-width': 4 }, g);
      const c1 = mk('circle', { class: 'pt', cx: X(1), cy: y1, r: 0, fill: '#fff', stroke: d[3], 'stroke-width': 4 }, g);
      const ch = (d[2] - d[1]) / d[1] * 100;
      const t0 = mk('text', { class: 'pv', x: X(0) - 22, y: LY0[k] + 7, 'text-anchor': 'end' }, g); t0.innerHTML = `<tspan fill="${d[3]}">${d[0]}</tspan> ${d[1]}`;
      const t1 = mk('text', { class: 'pv', x: X(1) + 22, y: LY[k] + 7, 'text-anchor': 'start' }, g);
      t1.innerHTML = `<tspan fill="${d[3]}">${d[0]}</tspan> ${d[2]} <tspan class="dlt" fill="${ch < 0 ? '#ff5a66' : '#3ee08f'}">${ch > 0 ? '+' : ''}${fmtN(ch, 1)}%</tspan>`;
      const hit = mk('path', { d: dd, stroke: 'transparent', 'stroke-width': 28, fill: 'none', style: 'cursor:pointer' }, g);
      const on = () => G.forEach(o => o.g.style.opacity = o.g === g ? 1 : .12), off = () => { G.forEach(o => o.g.style.opacity = ''); hideTip(); };
      hit.addEventListener('mouseenter', on); hit.addEventListener('mouseleave', off);
      bindTip(hit, `<b>${d[0]}</b><br>2025: ${d[1]} → 2026: ${d[2]}<br><b>${ch > 0 ? '+' : ''}${fmtN(ch, 1)}%</b>`);
      const b = document.createElement('button'); b.innerHTML = `<i style="background:${d[3]};box-shadow:0 0 10px ${d[3]}"></i>${d[0]}`;
      b.onmouseenter = on; b.onmouseleave = off; b.onclick = () => { b.classList.toggle('off'); g.classList.toggle('off'); }; leg.appendChild(b);
      return { g, ar, ln, c0, c1, t0, t1 };
    });
    enterOf('n11', () => G.forEach((o, k) => {
      const len = o.ln.getTotalLength();
      o.ln.style.transition = 'none'; o.ln.style.strokeDasharray = len; o.ln.style.strokeDashoffset = len; o.ar.style.opacity = 0;
      [o.c0, o.c1].forEach(c => c.setAttribute('r', 0)); o.t0.style.opacity = 0; o.t1.style.opacity = 0; o.ln.getBoundingClientRect();
      later(() => { o.c0.setAttribute('r', 7); o.t0.style.opacity = 1; }, 600 + k * 180);
      later(() => { o.ln.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1)'; o.ln.style.strokeDashoffset = 0; }, 700 + k * 180);
      later(() => { o.ar.style.opacity = 1; o.c1.setAttribute('r', 7); o.t1.style.opacity = 1; }, 2300 + k * 180);
    }));
  })();

  /* ================= n12 · εξέλιξη ================= */
  (() => {
    const evs = $$('.n12 .ev'), chs = $$('.n12 .chev'), rail = $('.n12 .evo-rail i');
    const c = cv('fx12b'); const sp = []; const P = []; let t = 0, phase = -1, T0 = 0;
    const cx = evs.map(e => 0);
    const pos = () => evs.map(e => { const r = e.offsetLeft + e.parentElement.offsetLeft + e.offsetWidth / 2; return r; });
    hooks.n12 = {
      enter() { T0 = performance.now(); t = 0; phase = -1; evs.forEach(e => e.classList.remove('on')); chs.forEach(e => e.classList.remove('on')); rail.style.transition = 'none'; rail.style.width = 0; sp.length = 0; P.length = 0; },
      tick(dt) {
        t = performance.now() - T0; c.clearRect(0, 0, W, H);
        const px = pos(), y = 540;
        const k = t < 900 ? -1 : t < 2300 ? 0 : t < 3700 ? 1 : 2;
        if (k !== phase) {
          phase = k;
          if (k >= 0) {
            evs[k].classList.add('on'); if (k > 0) chs[k - 1].classList.add('on');
            burst(sp, px[k], y, k === 2 ? 120 : 40, k === 2 ? ['255,70,80', '255,255,255', '255,200,120'] : ['140,195,255', '255,255,255'], k === 2 ? 14 : 8);
            rail.style.transition = 'width 1.3s cubic-bezier(.2,.8,.2,1)'; rail.style.width = (k + 1) / 3 * 100 + '%';
          }
        }
        // ροή ενέργειας μεταξύ ενεργών σταδίων
        if (phase >= 1 && Math.random() < .6) P.push({ x: px[0], y: y + rnd(-60, 60), v: rnd(5, 9), to: px[Math.min(phase, 2)], c: Math.random() < .5 ? '140,195,255' : '255,90,100' });
        for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; p.x += p.v * dt / 16; p.y += (y - p.y) * .02; if (p.x >= p.to) { P.splice(i, 1); continue; } glowDot(c, p.x, p.y, 2.2, p.c, .85); }
        drawSparks(c, sp, .1);
      }
    };
  })();

  /* ================= n14 · typing + μπάρες + 30% ================= */
  (() => {
    const typed = $('#typed14'), s = $('.n14');
    const ww = $$('.n14 .gbar.ww'), gr = $$('.n14 .gbar.gr');
    [...ww, ...gr].forEach(b => { b.innerHTML = `<div class="b3 ${b.classList.contains('ww') ? 'tb2' : 'red'}"><i class="f"></i><i class="s"></i><i class="t"></i></div>` + b.innerHTML;
      bindTip(b, () => `${b.classList.contains('ww') ? 'Παγκοσμίως' : 'Στην Ελλάδα'} · ${b.closest('.gb-cat').dataset.c}<br><b>${b.dataset.v}% online</b>`); });
    const grow = b => { b.style.height = b.dataset.v / 56 * 100 + '%'; b.classList.add('on'); };
    let typeTok = 0;
    const type = (txt, delay, after) => {
      const tok = ++typeTok;
      later(() => {
        let i = 0;
        const step = () => { if (tok !== typeTok) return; typed.textContent = txt.slice(0, ++i); if (i < txt.length) setTimeout(step, 55 + Math.random() * 50); else after && after(); };
        typed.textContent = ''; step();
      }, delay);
    };
    const d30 = $('#d30'); d30.innerHTML = Array.from({ length: 100 }, () => '<i></i>').join('');
    const dots = $$('i', d30);
    hooks.n14 = {
      enter() {
        typeTok++; typed.textContent = '';
        [...ww, ...gr].forEach(b => { b.style.height = 0; b.classList.remove('on'); });
        dots.forEach(d => d.classList.remove('on'));
        type('Online · παγκοσμίως · SDA 45%', 900, () => { grow(ww[0]); type('Online · παγκοσμίως · MDA 26%', 900, () => grow(ww[1])); });
      },
      step(k) {
        if (k === 1) { ww.forEach(b => { if (!b.classList.contains('on')) grow(b); }); type('Online · στην Ελλάδα · SDA 20% · MDA 15%', 100, () => { grow(gr[0]); later(() => grow(gr[1]), 350); }); }
        if (k === 2) { runCount($('#n14c'), 0); dots.slice(0, 30).forEach((d, i) => later(() => d.classList.add('on'), 600 + i * 45)); }
      }
    };
  })();

  /* ================= n15 · 8/10 ================= */
  (() => {
    const host = $('#ppl10');
    host.innerHTML = Array.from({ length: 10 }, () => `<svg viewBox="0 0 40 100"><circle cx="20" cy="12" r="10"/><path d="M8 26h24a4 4 0 0 1 4 4v28h-7v40h-8V66h-2v32h-8V58H4V30a4 4 0 0 1 4-4z"/></svg>`).join('');
    const figs = $$('svg', host);
    enterOf('n15', () => { figs.forEach(f => f.classList.remove('on')); for (let i = 0; i < 8; i++) later(() => figs[i].classList.add('on'), 600 + i * 160); });
  })();

  /* ================= n16 · ∞ ================= */
  (() => {
    const path = $('#infPath'), c = $('#infc'), x = c.getContext('2d'); const L = path.getTotalLength();
    x.setTransform(1.5, 0, 0, 1.5, 0, 0);
    const non = $('.n16 .inf-n.on'), noff = $('.n16 .inf-n.off');
    let t = 0; const trail = [], sp = [];
    hooks.n16 = {
      enter() { t = 0; trail.length = 0; },
      tick(dt) {
        t += dt; x.clearRect(0, 0, 900, 440);
        const u = (t / 5200) % 1, p = path.getPointAtLength(u * L);
        trail.push({ x: p.x, y: p.y }); if (trail.length > 50) trail.shift();
        trail.forEach((q, i) => glowDot(x, q.x, q.y, 1 + i / 12, u < .5 ? '255,70,80' : '140,195,255', i / trail.length * .7));
        glowDot(x, p.x, p.y, 7, '255,255,255', 1);
        const near = (a, b) => Math.hypot(p.x - a, p.y - b) < 120;
        non.classList.toggle('lit', near(210, 220)); noff.classList.toggle('lit', near(690, 220));
        drawSparks(x, sp, .05);
      }
    };
  })();

  /* ================= γενιές · 3D μπάρες ================= */
  const GENS = [['Gen Z', '16–29 ετών', 'cz'], ['Millennials', '30–45 ετών', 'cm'], ['Gen X', '46–61 ετών', 'cx']];
  const b3 = cls => `<div class="b3 ${cls}"><i class="f"></i><i class="s"></i><i class="t"></i></div>`;
  (() => { // n18
    const host = $('#b18'), V = [868, 1159, 989];
    host.innerHTML = GENS.map((g, i) => `<div class="b3col"><div class="bx">${b3(g[2])}<div class="vv"><span class="count" data-manual="1" data-to="${V[i]}" data-sep="." data-suf="€" data-dur="1800">0€</span></div></div><div class="gl">${g[0]}<small>${g[1]}</small></div></div>`).join('');
    const cols = $$('.b3col', host);
    cols.forEach((c, i) => bindTip($('.bx', c), `<b>${GENS[i][0]}</b> (${GENS[i][1]})<br>Μέση δαπάνη online 6μήνου: <b>${fmtN(V[i])}€</b>`));
    enterOf('n18', () => cols.forEach((c, i) => { const bx = $('.bx', c); bx.style.height = 0; c.classList.remove('on'); later(() => { bx.style.height = V[i] / 1300 * 100 + '%'; c.classList.add('on'); runCount($('.count', c), -350); }, 700 + i * 380); }));
  })();
  const genRows = (id, key, rows, opts) => {
    const host = $(id), th = opts.theme;
    host.innerHTML = rows.map((r, gi) => `<div class="grow"><div class="gid"><b>${GENS[gi][0]}</b><small>${GENS[gi][1]}</small></div><div class="gplot">${r.map((it, k) =>
      `<div class="gb5"><div class="bx">${b3(th + (gi + 1))}<span class="rk">${opts.rank ? k + 1 : ''}</span><div class="vv">${opts.label(it)}</div></div><div class="cl">${it[0]}</div></div>`).join('')}</div></div>`).join('');
    const items = [];
    $$('.grow', host).forEach((row, gi) => $$('.gb5', row).forEach((b, k) => { const it = rows[gi][k]; items.push({ b, it, gi, k }); bindTip($('.bx', b), `<b>${GENS[gi][0]}</b> · ${it[0]}<br>${opts.tip(it)}`); }));
    enterOf(key, () => items.forEach(o => { const bx = $('.bx', o.b); bx.style.height = 0; o.b.classList.remove('on');
      later(() => { bx.style.height = opts.h(o.it) + '%'; o.b.classList.add('on'); }, 700 + o.gi * 520 + o.k * 110); }));
  };
  genRows('#g19', 'n19', [
    [['Έπιπλα / οικιακά', 567], ['Αεροπορικά εισιτήρια', 305], ['Ηλεκτρονικά', 295], ['Ηλεκτρικές συσκευές', 259], ['Ξενοδοχεία / διαμονή', 254]],
    [['Ξενοδοχεία / διαμονή', 394], ['Αγορές για κατοικίδια', 362], ['Έπιπλα / οικιακά', 335], ['Supermarket', 330], ['Αεροπορικά εισιτήρια', 327]],
    [['Ξενοδοχεία / διαμονή', 507], ['Αεροπορικά εισιτήρια', 500], ['Supermarket', 409], ['Webinars', 271], ['Ηλεκτρικές συσκευές', 243]]
  ], { theme: 'tg', rank: 1, label: it => `${it[1]}€`, tip: it => `Μέσο ποσό: <b>${it[1]}€</b>`, h: it => it[1] / 600 * 78 });
  genRows('#g20', 'n20', [
    [['Ρούχα', 44, 146], ['Φαγητό / delivery', 36, 140], ['Παπούτσια', 25, 121], ['Εισιτήρια ακτοπλοϊκά, τρένων, λεωφορείων', 21, 98], ['Αεροπορικά εισιτήρια', 20, 305]],
    [['Ρούχα', 41, 171], ['Φαγητό / delivery', 40, 199], ['Παπούτσια', 34, 122], ['Βιταμίνες / συμπλ.', 25, 81], ['Ηλεκτρονικά', 25, 263]],
    [['Ρούχα', 43, 128], ['Παπούτσια', 32, 113], ['Φαγητό / delivery', 29, 153], ['Καλλυντικά', 28, 74], ['Ηλεκτρονικά', 23, 225]]
  ], { theme: 'tb', rank: 1, label: it => `<small>${it[1]}% →</small>${it[2]}€`, tip: it => `Διείσδυση: <b>${it[1]}%</b> · Μέσο ποσό: <b>${it[2]}€</b>`, h: it => it[1] / 46 * 78 });
  genRows('#g21', 'n21', [
    [['Χρεωστική κάρτα', 56], ['Ψηφιακά wallets', 41], ['Αντικαταβολή', 34], ['Πιστωτική κάρτα', 24]],
    [['Χρεωστική κάρτα', 66], ['Ψηφιακά wallets', 34], ['Αντικαταβολή', 31], ['Πιστωτική κάρτα', 23]],
    [['Χρεωστική κάρτα', 62], ['Αντικαταβολή', 33], ['Πιστωτική κάρτα', 28], ['Ψηφιακά wallets', 26]]
  ], { theme: 'tr', rank: 0, label: it => `${it[1]}%`, tip: it => `<b>${it[1]}%</b>`, h: it => it[1] / 68 * 78 });

  /* ================= n32 · information overload ================= */
  (() => {
    const c = cv('fx32'); const items = []; let t = 0;
    const words = ['@', '✉', '🔔', 'ad', 'news', '♥', '▶', '#', '💬', '★', '%', 'sale', '📷', 'GB', '!!', '⚡', 'link', 'feed', 'push', 'email', '📢', 'live', 'new', '•••'];
    hooks.n32 = {
      enter() { t = 0; items.length = 0; },
      tick(dt) {
        t += dt; c.clearRect(0, 0, W, H);
        const rate = Math.min(1, t / 9000);
        if (Math.random() < .25 + rate * .75) for (let k = 0; k < 1 + rate * 3; k++) {
          const a = rnd(0, Math.PI * 2);
          items.push({ x: 500 + Math.cos(a) * rnd(700, 1000), y: 470 + Math.sin(a) * rnd(500, 700), w: words[Math.random() * words.length | 0], s: rnd(16, 40), life: 1, c: Math.random() < .3 ? '255,80,90' : Math.random() < .5 ? '140,195,255' : '255,255,255' });
        }
        c.textAlign = 'center'; c.textBaseline = 'middle';
        for (let i = items.length - 1; i >= 0; i--) {
          const p = items[i]; p.x += (500 - p.x) * .012; p.y += (470 - p.y) * .012; p.life -= .005;
          const inBox = p.x > 30 && p.x < 970 && p.y > 120 && p.y < 820;
          if (inBox || p.life <= 0) { items.splice(i, 1); continue; }
          const fade = Math.min(1, (Math.min(Math.abs(p.x - 500) - 470, Math.abs(p.y - 470) - 350) + 260) / 260);
          c.font = `800 ${p.s}px Commissioner, sans-serif`; c.fillStyle = `rgba(${p.c},${Math.max(0, Math.min(.85, p.life, fade)) * .8})`; c.fillText(p.w, p.x + rnd(-1, 1), p.y + rnd(-1, 1));
        }
      }
    };
  })();

  /* ================= n33 · 100GB vs 8TB ================= */
  (() => {
    const MAN = '<svg viewBox="0 0 40 100"><circle cx="20" cy="12" r="10"/><path d="M8 26h24a4 4 0 0 1 4 4v28h-7v40h-8V66h-2v32h-8V58H4V30a4 4 0 0 1 4-4z"/></svg>';
    const wall = $('#wall33'); wall.innerHTML = Array.from({ length: 80 }, () => `<i>${MAN}</i>`).join(''); $('.n33 .cube1 i').innerHTML = MAN;
    const cells = $$('i', wall), eq = $('#eq33');
    hooks.n33 = {
      enter() {
        cells.forEach(c => c.classList.remove('on')); eq.classList.remove('on'); $('#d80').textContent = '0'; $('#x7m').textContent = '0';
        // 80 «ημέρες ανθρώπου» γεμίζουν μέσα σε ~1 δευτερόλεπτο
        cells.forEach((c, i) => later(() => c.classList.add('on'), 2200 + i * 12));
        later(() => { eq.classList.add('on'); runCount($('#d80'), -350); runCount($('#x7m'), 200); }, 3500);
      }
    };
  })();

  /* ================= n34 · παντού (μεγαλύτερα & εμφωλευμένα πλαίσια) ================= */
  (() => {
    const host = $('#chips34');
    const C = (t, kids) => kids ? `<span class="nest"><b>${t}</b>${kids.map(k => typeof k === 'string' ? `<span>${k}</span>` : C(k[0], k[1])).join('')}</span>` : `<span>${t}</span>`;
    const items = [
      [90, 104, C('Τηλεόραση')], [370, 104, C('Ραδιόφωνο')], [640, 104, C('Outdoor')], [880, 104, C('Print')], [1060, 104, C('AI βοηθός')], [1320, 104, C('Newsletter')], [1560, 104, C('Forums')],
      [100, 810, C('Social Media Ads', ['Instagram', 'TikTok', 'Influencers'])], [840, 810, C('Google search', ['Reviews', ['Σύγκριση τιμών', ['Price comparison']]])],
      [120, 935, C('YouTube & Creators')], [520, 935, C('Site κατασκευαστή')], [910, 925, C('Online shop', ['Marketplaces'])], [1400, 935, C('Κατάστημα')]
    ];
    host.innerHTML = items.map((it, i) => it[2].replace(/^<span/, `<span style="left:${it[0]}px;top:${it[1]}px;--cd:${1800 + i * 110}ms"`)).join('');
  })();

  /* ================= n35 · πανηγυρισμός → (fade) απογοήτευση ================= */
  hooks.n35 = {
    leave() { if (document.body.dataset.bg === 'grey') document.body.dataset.bg = ''; },
    step() { document.body.dataset.bg = 'grey'; }
  };

  /* ================= n36 · εργαστήριο: 2 συστατικά → μίξη ================= */
  (() => {
    const lab = $('#lab36'); if (!lab) return;
    const sec = lab.closest('.slide');
    const lvR = $('.fn.r .lv', lab), sfR = $('.fn.r .sf', lab), lvB = $('.fn.b .lv', lab), sfB = $('.fn.b .sf', lab);
    const flB = $('.fl-b', lab), flS = $('.fl-s', lab), flW = $('.fl-w1', lab), s1 = $('#liqF .s1'), s2 = $('#liqF .s2');
    const tubeR = $('#tubeR'), tubeB = $('#tubeB');
    const mkFlow = (g, src, col) => { const d = src.getAttribute('d'), L = src.getTotalLength(); let h = '';
      for (let k = 0; k < 9; k++) h += `<path d="${d}" fill="none" stroke="${col}" stroke-linecap="round" style="opacity:${(1 - k / 9).toFixed(2)};stroke-width:${(5.5 - k * .45).toFixed(2)}"/>`;
      g.innerHTML = h; return { segs: [...g.children], L }; };
    const FR = mkFlow($('.flow.fr', lab), tubeR, '#ff4a57'), FB = mkFlow($('.flow.fb', lab), tubeB, '#5aa8ff');
    const cvs = $('#labfx'), cx = cvs.getContext('2d'); cx.setTransform(1.5, 0, 0, 1.5, 0, 0);
    // μισό πλάτος του αχλαδιού της χοάνης ανά ύψος (συντεταγμένες εικόνας 382×1129)
    const PW = [[214, 84], [260, 140], [300, 168], [345, 184], [385, 187], [430, 184], [480, 160], [560, 124], [650, 86], [720, 58], [790, 6]];
    const pw = y => { for (let i = 1; i < PW.length; i++) if (y <= PW[i][0]) { const a = PW[i - 1], b = PW[i], t = (y - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * t; } return 6; };
    const clamp = v => Math.max(0, Math.min(1, v));
    const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
    const RED1 = [255, 74, 87], RED2 = [138, 0, 11], PUR1 = [190, 90, 255], PUR2 = [64, 12, 150];
    let pR = 0, pB = 0, blueOn = false, phase = 'run', hold = 0, f = 0, fFull = 1, m = 0, prev = performance.now(), tF = 0;
    const parts = [], bubs = [], sp = [];
    const reset = () => { pR = 0; pB = 0; phase = 'run'; hold = 0; f = 0; m = 0; parts.length = bubs.length = sp.length = 0; blueOn = sec.classList.contains('st1'); };
    hooks.n36 = { enter() { reset(); }, step() { blueOn = true; } };
    const flow = (F, on, t, per) => {
      const u = (t / per) % 1, head = u * (F.L + 14 * 9);
      F.segs.forEach((p, k) => { p.style.strokeDasharray = `14.5 ${F.L * 3}`; p.style.strokeDashoffset = on ? -(head - (k + 1) * 14) : F.L * 2; });
    };
    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min(60, now - prev); prev = now;
      if (!sec.classList.contains('active')) return;
      tF += dt;
      const DUR = 10000;
      if (phase === 'run') {
        if (pR < 1) pR = Math.min(1, pR + dt / DUR);
        if (blueOn && pB < 1) pB = Math.min(1, pB + dt / DUR);
        const tgt = .45 * clamp((pR * DUR - 900) / (DUR - 900)) + .55 * clamp((pB * DUR - 900) / (DUR - 900));
        f += (tgt - f) * .04;
        if (blueOn && pB >= 1 && f > .985) { phase = 'full'; hold = 0; burst(sp, 420, 520, 120, ['242,194,48', '255,255,255', '200,140,255', '255,120,130'], 9); }
      } else if (phase === 'full') {
        hold += dt; if (hold > 2800) { phase = 'reset'; hold = 0; fFull = f; }
      } else {
        hold += dt; const k = clamp(hold / 1800), e = k * k * (3 - 2 * k);
        f = fFull * (1 - e); pR = pB = 1 - e;
        if (k >= 1) { pR = pB = 0; f = 0; m = 0; phase = 'run'; }
      }
      const mt = blueOn ? clamp((.55 * clamp((pB * DUR - 900) / (DUR - 900))) / .3) : 0;
      if (phase === 'run') m += (mt - m) * .03;
      // χοάνες
      const yR = 214 + pR * 576, yB = 214 + pB * 576;
      lvR.setAttribute('y', yR); sfR.setAttribute('cy', yR); sfR.setAttribute('rx', Math.max(0, pw(yR) - 4)); sfR.setAttribute('ry', Math.max(1, pw(yR) * .09));
      lvB.setAttribute('y', yB); sfB.setAttribute('cy', yB); sfB.setAttribute('rx', Math.max(0, pw(yB) - 4)); sfB.setAttribute('ry', Math.max(1, pw(yB) * .09));
      const rOn = phase === 'run' && pR > 0 && pR < 1, bOn = phase === 'run' && blueOn && pB > 0 && pB < 1;
      flow(FR, rOn, tF, 1700); flow(FB, bOn, tF + 600, 1700);
      // φιάλη
      const yl = 868 - f * 258, rx = yl > 601 ? Math.sqrt(Math.max(0, 140 * 140 - (yl - 735) ** 2)) - 3 : 37;
      flB.setAttribute('y', yl + 2);
      flS.setAttribute('cy', yl + 2 + Math.sin(tF / 700) * 1.5); flS.setAttribute('rx', Math.max(0, rx)); flS.setAttribute('ry', Math.max(2, rx * .16));
      flW.setAttribute('transform', `translate(${270 - (tF / 30) % 150} ${yl - 2 + Math.sin(tF / 900) * 2})`);
      const c1 = mix(RED1, PUR1, m), c2 = mix(RED2, PUR2, m), cs = mix([255, 140, 150], [225, 180, 255], m);
      s1.setAttribute('stop-color', `rgb(${c1})`); s2.setAttribute('stop-color', `rgb(${c2})`); flS.setAttribute('fill', `rgb(${cs})`);
      flS.style.opacity = f > .01 ? .9 : 0; flW.style.opacity = f > .03 ? 1 : 0;
      // σωματίδια
      cx.clearRect(0, 0, 840, 890);
      const inside = (x, y) => (x - 420) ** 2 + (y - 735) ** 2 < 128 * 128 && y > yl + 4;
      if (f > .03 && Math.random() < .35) bubs.push({ x: 420 + rnd(-90, 90), y: 860, r: rnd(1.5, 4), v: rnd(.4, 1.1) });
      for (let i = bubs.length - 1; i >= 0; i--) { const b = bubs[i]; b.y -= b.v * dt / 16; b.x += Math.sin((b.y + i) / 14) * .3;
        if (b.y < yl + 6 || !inside(b.x, b.y + 10)) { bubs.splice(i, 1); continue; }
        cx.strokeStyle = 'rgba(255,255,255,.55)'; cx.lineWidth = 1; cx.beginPath(); cx.arc(b.x, b.y, b.r, 0, 7); cx.stroke(); }
      if (m > .05) for (let n = 0; n < m * 4; n++) { const x = 420 + rnd(-135, 135), y = rnd(yl, 870); if (inside(x, y)) parts.push({ x, y, life: 1, r: rnd(1, 3.2), d: rnd(.006, .02), c: Math.random() < .45 ? '255,220,120' : Math.random() < .5 ? '230,190,255' : '255,255,255' }); }
      for (let i = parts.length - 1; i >= 0; i--) { const p = parts[i]; p.life -= p.d * dt / 16; p.y -= .25;
        if (p.life <= 0 || p.y < yl) { parts.splice(i, 1); continue; }
        glowDot(cx, p.x, p.y, p.r * (0.6 + Math.abs(Math.sin(p.life * 9)) * .7), p.c, p.life * (.6 + m * .4)); }
      if (m > .4 && Math.random() < m * .5) sp.push({ x: 420 + rnd(-60, 60), y: yl - rnd(0, 30), vx: rnd(-.6, .6), vy: rnd(-2.4, -.8), life: 1, r: rnd(1, 2.6), c: Math.random() < .5 ? '242,194,48' : '210,160,255' });
      if (rOn) glowDot(cx, 395, 528, 4, '255,74,87', .9);
      if (bOn) glowDot(cx, 445, 528, 4, '90,168,255', .9);
      drawSparks(cx, sp, .03);
    }
    requestAnimationFrame(frame);
  })();

  /* ================= n38 · οικοσύστημα ================= */
  (() => {
    const IC = {
      tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M9 2l3 4 3-4"/>',
      radio: '<rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="15" cy="14" r="3"/><path d="M6 12h4M6 16h4M7 8l10-5"/>',
      out: '<rect x="3" y="4" width="18" height="11" rx="1"/><path d="M8 15v6M16 15v6M6 21h12"/>',
      print: '<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-3a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h4z"/>',
      social: '<path d="M3 11l14-6v14L3 13z"/><path d="M17 9a3 3 0 0 1 0 6M6 13l1 6h3l-1-5"/>',
      search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>',
      yt: '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3z"/>',
      site: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01M7 13h6M7 16h10"/>',
      rev: '<path d="M21 14a2 2 0 0 1-2 2H9l-5 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/><path d="M12.5 6.5l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z"/>',
      cmp: '<path d="M4 7h7l-3-3M20 17h-7l3 3"/><rect x="13" y="4" width="8" height="8" rx="2"/><rect x="3" y="12" width="8" height="8" rx="2"/>',
      pcp: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 14v-3M11 14V8M15 14v-5M8 21h8"/>',
      store: '<use href="#i-store"/>', shop: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20M8 8h2l1 4h4l1-3h-6"/>'
    };
    const COLS = [
      ['01', 'Αναγνωρισιμότητα', [['tv', 'Τηλεόραση'], ['radio', 'Ραδιόφωνο'], ['out', 'Outdoor'], ['print', 'Print'], ['social', 'Social Media Ads']]],
      ['02', 'Αναζήτηση & εξερεύνηση', [['search', 'Google search'], ['yt', 'YouTube & Creators'], ['site', 'Site κατασκευαστή']]],
      ['03', 'Αξιολόγηση & σύγκριση', [['rev', 'Reviews'], ['cmp', 'Σύγκριση τιμών'], ['pcp', 'Price comparison πλατφόρμες']]],
      ['04', 'Αγορά', [['store', 'Κατάστημα'], ['shop', 'Online shop']], 'buy']
    ];
    const host = $('#eco38');
    host.innerHTML = COLS.map((c, k) => `<div class="eco-col ${c[3] || ''}" style="--k:${k}"><div class="eco-hd"><span>${c[0]}</span><h3>${c[1].replace('&', '&amp;')}</h3></div>${c[2].map((it, j) =>
      `<div class="eco-it" style="--j:${j}"><svg viewBox="0 0 24 24">${IC[it[0]]}</svg>${it[1]}</div>`).join('')}${k < 3 ? '<i class="eco-arrow"></i>' : ''}</div>`).join('');
    const its = $$('.eco-it', host); const c = cv('fx38'); const pk = []; let acc = 0;
    const center = el => { const r = el.getBoundingClientRect(), s = $('#stage').getBoundingClientRect(), k = s.width / W; return { x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k }; };
    hooks.n38 = {
      enter() { pk.length = 0; acc = -2600; },
      tick(dt) {
        c.clearRect(0, 0, W, H); acc += dt;
        if (acc > 650) {
          acc = 0;
          const cols = $$('.eco-col', host); const a = cols[0], pick = col => { const l = $$('.eco-it', col); return l[Math.random() * l.length | 0]; };
          const route = [pick(cols[0]), pick(cols[1]), pick(cols[2]), pick(cols[3])];
          pk.push({ route, seg: 0, t: 0, pts: route.map(center) });
        }
        for (let i = pk.length - 1; i >= 0; i--) {
          const p = pk[i]; p.t += .02 * dt / 16;
          if (p.t >= 1) { p.seg++; p.t = 0; const el = p.route[p.seg]; if (el) { el.classList.add('ping'); setTimeout(() => el.classList.remove('ping'), 420); } if (p.seg >= 3) { pk.splice(i, 1); continue; } }
          const A = p.pts[p.seg], B = p.pts[p.seg + 1], e = p.t * p.t * (3 - 2 * p.t);
          glowDot(c, A.x + (B.x - A.x) * e, A.y + (B.y - A.y) * e - Math.sin(e * Math.PI) * 60, 3.4, p.seg === 2 ? '255,70,80' : '140,195,255', .95);
        }
      }
    };
  })();

  /* ================= n39 · fusion ================= */
  (() => {
    const c = cv('fx39'); const P = []; const sp = []; let t = 0, flash = 0, fired = false, ring = 0, T0 = 0;
    const CY = 160 + 430;
    hooks.n39 = {
      enter() { T0 = performance.now(); t = 0; P.length = 0; sp.length = 0; flash = 0; fired = false; ring = 0; },
      tick(dt) {
        t = performance.now() - T0; c.clearRect(0, 0, W, H);
        const k = Math.min(1, Math.max(0, (t - 600) / 3400)), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const lx = 560 - 500 + (500 + 70) * e + 0, rx = 1320 + 500 - (500 + 70) * e;
        if (Math.random() < .7) { const s = Math.random() < .5; P.push({ a: rnd(0, 7), r: rnd(330, 360), s, v: rnd(.006, .014), life: 1 }); }
        for (let i = P.length - 1; i >= 0; i--) {
          const p = P[i]; p.a += p.v * dt / 16 * (p.s ? 1 : -1); p.life -= .004;
          if (p.life <= 0) { P.splice(i, 1); continue; }
          const cx = p.s ? lx + 320 - 320 + 0 : rx;
          glowDot(c, (p.s ? lx : rx) + Math.cos(p.a) * p.r, CY + Math.sin(p.a) * p.r, 1.8, p.s ? '140,195,255' : '255,90,100', p.life * .8);
        }
        if (!fired && t > 3900) { fired = true; flash = 1; ring = 1; burst(sp, 960, CY, 200, ['255,255,255', '255,90,100', '140,195,255', '255,210,140'], 18); }
        if (ring > 0) { c.strokeStyle = `rgba(255,255,255,${ring})`; c.lineWidth = 4; c.beginPath(); c.arc(960, CY, 120 + (1 - ring) * 900, 0, 7); c.stroke(); ring -= .012; }
        if (flash > 0) { const g = c.createRadialGradient(960, CY, 0, 960, CY, 900); g.addColorStop(0, `rgba(255,255,255,${flash * .6})`); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); flash -= .02; }
        if (t > 4500 && Math.random() < .5) sp.push({ x: 960 + rnd(-40, 40), y: CY + rnd(-180, 180), vx: rnd(-1, 1), vy: rnd(-1.5, 1.5), life: 1, r: rnd(1.2, 3), c: Math.random() < .5 ? '255,255,255' : '255,120,130' });
        drawSparks(c, sp, .02);
      }
    };
  })();

  /* ================= προϊόντα · μενού κατηγοριών ================= */
  (() => {
    const CATS = [['Οικιακά κλιματιστικά', 'cat0'], ['Αφυγραντήρες & καθαριστές αέρα', 'cat1'], ['Λευκές συσκευές', 'cat2'], ['Ημικεντρικά κλιματιστικά', 'cat3'], ['Αντλίες θερμότητας', 'cat4'], ['VRF', 'cat5']];
    const host = $('#cats');
    host.innerHTML = CATS.map((c, i) => { const n = api.seqOf('g' + (i + 1)).length;
      return `<div class="cat" data-g="${i + 1}" style="--k:${i}"><div class="im" style="background-image:url(assets/img/v2/${c[1]}.jpg)"></div><div class="ck"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><div class="cn"><h3>${c[0].replace('&', '&amp;')}</h3><small>${n} ${n === 1 ? 'οθόνη' : 'οθόνες'}</small></div></div>`; }).join('');
    const els = $$('.cat', host);
    els.forEach(el => el.addEventListener('click', () => { el.classList.add('launch'); setTimeout(() => { el.classList.remove('launch'); api.go(api.seqOf('g' + el.dataset.g)[0]); }, 380); }));
    hooks.pmenu = { enter() { els.forEach(el => el.classList.toggle('done', api.pVisited.has(+el.dataset.g))); $('#pmProg').textContent = `${api.pVisited.size} / 6`; } };
  })();
  /* ================= v3 · «space» φόντο (από τον Τιμοκατάλογο) ================= */
  (() => {
    const cvs = $('#space'); if (!cvs) return;
    const cx = cvs.getContext('2d'); let w, h, mx = .5, my = .5; const pts = [];
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); w = cvs.width = innerWidth * d; h = cvs.height = innerHeight * d; };
    size(); addEventListener('resize', size);
    for (let i = 0; i < 90; i++) pts.push({ x: Math.random(), y: Math.random(), z: .3 + Math.random() * .7, v: .00008 + Math.random() * .00022, r: Math.random() < .12 });
    const gc = $('#glowCursor');
    addEventListener('mousemove', e => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; if (gc) { gc.style.left = e.clientX + 'px'; gc.style.top = e.clientY + 'px'; } });
    (function loop() {
      cx.clearRect(0, 0, w, h);
      const P2 = pts.map(p => { p.y -= p.v * p.z * 16; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); } return [(p.x + (mx - .5) * .02 * p.z) * w, (p.y + (my - .5) * .02 * p.z) * h, p]; });
      cx.lineWidth = 1; const lim = (w * .07) ** 2;
      for (let i = 0; i < P2.length; i++) for (let j = i + 1; j < P2.length; j++) { const dx = P2[i][0] - P2[j][0], dy = P2[i][1] - P2[j][1], d = dx * dx + dy * dy; if (d < lim) { cx.strokeStyle = `rgba(255,255,255,${.06 * (1 - d / lim)})`; cx.beginPath(); cx.moveTo(P2[i][0], P2[i][1]); cx.lineTo(P2[j][0], P2[j][1]); cx.stroke(); } }
      P2.forEach(([x, y, p]) => { cx.fillStyle = p.r ? `rgba(255,70,80,${.6 * p.z})` : `rgba(210,235,255,${.4 * p.z})`; cx.beginPath(); cx.arc(x, y, (p.r ? 1.9 : 1.4) * p.z * (w / innerWidth), 0, 7); cx.fill(); });
      requestAnimationFrame(loop);
    })();
  })();

  /* ================= v3 · scanner στα αριθμημένα πλακίδια ================= */
  $$('.tile .front').forEach(f => { if (f.querySelector('.num')) f.insertAdjacentHTML('beforeend', '<i class="scanl"></i>'); });

  /* ================= v3 · προϊόντα: μικρογραφίες, βαθμίδες, ΤΕΛΟΣ ================= */
  (() => {
    const lb = $('#lb'), lbImg = lb && $('img', lb);
    $$('.sp .thumb img[data-full]').forEach(im => im.closest('.thumb').addEventListener('click', () => { lbImg.src = im.dataset.full; lb.classList.add('open'); }));
    const sec = $('.pr72'); if (sec) {
      const btns = $$('.tier-b', sec), tts = $$('.tthumbs .thumb', sec), sets = $$('.tset', sec); let iv = null, k = 0;
      const sel = i => { k = i; [btns, tts, sets].forEach(L => L.forEach((e, j) => e.classList.toggle('on', j === i))); };
      [...btns, ...tts].forEach(b => b.addEventListener('click', () => { clearInterval(iv); iv = null; sel(+b.dataset.t); }));
      hooks.pr72 = { enter() { sel(0); clearInterval(iv); iv = setInterval(() => sel((k + 1) % 4), 3400); }, leave() { clearInterval(iv); iv = null; } };
    }
    const eb = $('#endBtn'); if (eb) eb.addEventListener('click', e => { e.stopPropagation(); api.go(api.idOf('pr86')); });
  })();
});
