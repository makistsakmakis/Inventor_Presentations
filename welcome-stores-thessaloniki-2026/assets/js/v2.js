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

  /* ================= n11 · slope ================= */
  (() => {
    const host = $('#n11chart'), svg = $('svg', host), leg = $('.sl-legend', host);
    const D = [['MDA', 367, 376, '#4aa3ff'], ['SDA', 147, 157, '#ff9f43'], ['CLIMA', 261, 214, '#3ee08f'], ['CE', 186, 197, '#38bdf8'], ['TELECOM', 588, 596, '#c084fc'], ['IT', 281, 247, '#9ae66e']];
    const x0 = 230, x1 = 850, T = 30, B = 600, ymax = 700;
    const Y = v => B - (B - T) * v / ymax;
    mk('line', { class: 'ax', x1: x0, x2: x0, y1: T, y2: B }, svg); mk('line', { class: 'ax', x1: x1, x2: x1, y1: T, y2: B }, svg);
    mk('text', { class: 'axl', x: x0, y: B + 40, 'text-anchor': 'middle' }, svg).textContent = '2025';
    mk('text', { class: 'axl', x: x1, y: B + 40, 'text-anchor': 'middle' }, svg).textContent = '2026';
    for (let v = 0; v <= ymax; v += 100) mk('line', { x1: x0, x2: x1, y1: Y(v), y2: Y(v), stroke: 'rgba(255,255,255,.05)' }, svg);
    const spread = vals => { const o = vals.map((v, i) => ({ i, y: Y(v) })).sort((a, b) => a.y - b.y); for (let k = 1; k < o.length; k++) if (o[k].y - o[k - 1].y < 30) o[k].y = o[k - 1].y + 30; const r = []; o.forEach(q => r[q.i] = q.y); return r; };
    const LY0 = spread(D.map(d => d[1])), LY1 = spread(D.map(d => d[2]));
    const G = D.map((d, di) => {
      const g = mk('g', { class: 'sg' }, svg);
      const ln = mk('line', { class: 'sl', x1: x0, y1: Y(d[1]), x2: x0, y2: Y(d[1]), stroke: d[3] }, g);
      mk('circle', { cx: x0, cy: Y(d[1]), r: 8, fill: d[3] }, g);
      const c2 = mk('circle', { cx: x1, cy: Y(d[2]), r: 0, fill: d[3] }, g);
      const l0 = mk('text', { class: 'lbl', x: x0 - 20, y: LY0[di] + 7, 'text-anchor': 'end' }, g); l0.textContent = `${d[0]}  ${d[1]}`;
      const ch = (d[2] - d[1]) / d[1] * 100;
      const l1 = mk('text', { class: 'lbl', x: x1 + 20, y: LY1[di] + 7, opacity: 0 }, g); l1.innerHTML = `${d[2]} <tspan class="dl" fill="${ch < 0 ? '#ff5a66' : '#3ee08f'}">${ch > 0 ? '+' : ''}${fmtN(ch, 1)}%</tspan>`;
      const hit = mk('line', { x1: x0, y1: Y(d[1]), x2: x1, y2: Y(d[2]), stroke: 'transparent', 'stroke-width': 26, style: 'cursor:pointer' }, g);
      const on = () => { G.forEach(o => o.g.classList.toggle('dim', o.g !== g)); g.classList.add('hl'); };
      const off = () => { G.forEach(o => o.g.classList.remove('dim', 'hl')); hideTip(); };
      hit.addEventListener('mouseenter', on); hit.addEventListener('mouseleave', off);
      bindTip(hit, `<b>${d[0]}</b><br>2025: ${d[1]} → 2026: ${d[2]}<br><b>${ch > 0 ? '+' : ''}${fmtN(ch, 1)}%</b>`);
      const b = document.createElement('button'); b.innerHTML = `<i style="background:${d[3]}"></i>${d[0]}`; b.onmouseenter = on; b.onmouseleave = off; leg.appendChild(b);
      return { g, ln, c2, l1, d };
    });
    enterOf('n11', () => {
      G.forEach((o, i) => {
        o.ln.style.transition = 'none'; o.ln.setAttribute('x2', x0); o.ln.setAttribute('y2', Y(o.d[1])); o.c2.setAttribute('r', 0); o.l1.setAttribute('opacity', 0);
        later(() => {
          const t0 = performance.now(), dur = 1600;
          const stp = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
            o.ln.setAttribute('x2', x0 + (x1 - x0) * e); o.ln.setAttribute('y2', Y(o.d[1] + (o.d[2] - o.d[1]) * e));
            if (p < 1) requestAnimationFrame(stp); else { o.c2.setAttribute('r', 8); o.l1.setAttribute('opacity', 1); } };
          requestAnimationFrame(stp);
        }, 800 + i * 220);
      });
    });
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
      bindTip(b, () => `${b.classList.contains('ww') ? 'Στον κόσμο' : 'Στην Ελλάδα'} · ${b.closest('.gb-cat').dataset.c}<br><b>${b.dataset.v}% online</b>`); });
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
        type('Online · στον κόσμο · SDA 45%', 900, () => { grow(ww[0]); type('Online · στον κόσμο · MDA 26%', 900, () => grow(ww[1])); });
      },
      step(k) {
        if (k === 1) type('Online · στην Ελλάδα · SDA 20% · MDA 15%', 100, () => { grow(gr[0]); later(() => grow(gr[1]), 350); });
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
          const p = items[i]; p.x += (500 - p.x) * .018; p.y += (470 - p.y) * .018; p.life -= .006;
          const d = Math.hypot(p.x - 500, p.y - 470);
          if (d < 60 || p.life <= 0) { items.splice(i, 1); continue; }
          c.font = `800 ${p.s}px Commissioner, sans-serif`; c.fillStyle = `rgba(${p.c},${Math.min(.85, p.life) * .8})`; c.fillText(p.w, p.x + rnd(-1, 1), p.y + rnd(-1, 1));
        }
      }
    };
  })();

  /* ================= n33 · 100GB vs 8TB ================= */
  (() => {
    const wall = $('#wall33'); wall.innerHTML = Array.from({ length: 80 }, () => '<i></i>').join('');
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

  /* ================= n34 · παντού ================= */
  (() => {
    const L = ['Τηλεόραση', 'Ραδιόφωνο', 'Outdoor', 'Print', 'Social Media Ads', 'Google search', 'YouTube & Creators', 'Site κατασκευαστή', 'Reviews', 'Σύγκριση τιμών', 'Price comparison', 'Κατάστημα', 'Online shop', 'Marketplaces', 'AI βοηθός', 'Instagram', 'TikTok', 'Newsletter', 'Influencers', 'Forums'];
    const host = $('#chips34');
    const pos = []; [[810, 140], [890, 360], [970, 200]].forEach(([y, x0], r) => { for (let k = 0; k < 6; k++) pos.push([x0 + k * 250 + (k % 2) * 30, y]); }); pos.push([380, 96], [760, 96]);
    host.innerHTML = L.map((l, i) => `<span style="left:${pos[i][0]}px;top:${pos[i][1]}px;--cd:${1800 + i * 90}ms">${l}</span>`).join('');
  })();

  /* ================= n35 · πανηγυρισμός → Όχι ================= */
  (() => {
    const c = cv('fx35'); const cf = []; let mode = 0, t = 0, T0 = 0;
    const cols = ['255,215,106', '255,255,255', '255,120,130', '140,195,255', '255,180,60'];
    const spawn = (n, x, y) => { for (let i = 0; i < n; i++) { const a = rnd(-Math.PI * .95, -Math.PI * .05), v = rnd(6, 18); cf.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rnd(4, 9), rot: rnd(0, 6), vr: rnd(-.3, .3), c: cols[i % cols.length], life: 1 }); } };
    hooks.n35 = {
      enter() { T0 = performance.now(); mode = 0; t = 0; cf.length = 0; later(() => spawn(220, 1400, 330), 1200); later(() => spawn(160, 1420, 320), 2400); },
      leave() { if (document.body.dataset.bg === 'grey') document.body.dataset.bg = ''; },
      step() { mode = 1; document.body.dataset.bg = 'grey'; cf.forEach(p => { p.vx *= .2; p.vy = Math.abs(p.vy) * .2 + 2; p.c = '120,120,130'; }); },
      tick(dt) {
        t = performance.now() - T0; c.clearRect(0, 0, W, H);
        if (mode === 0 && t > 3500 && Math.random() < .2) spawn(6, 1400, 330);
        for (let i = cf.length - 1; i >= 0; i--) {
          const p = cf[i]; p.x += p.vx; p.y += p.vy; p.vy += mode ? .5 : .22; p.vx *= .99; p.rot += p.vr;
          if (p.y > H + 40) { cf.splice(i, 1); continue; }
          c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = `rgba(${p.c},.95)`; c.fillRect(-p.r, -p.r * .4, p.r * 2, p.r * .8); c.restore();
        }
      }
    };
  })();

  /* ================= n36 / n37 · φίλτρο ================= */
  $$('.flask .bub').forEach(b => { b.innerHTML = Array.from({ length: 12 }, (_, i) => `<i style="left:${rnd(5, 90)}%;animation-delay:${rnd(0, 2.4).toFixed(2)}s;width:${rnd(6, 14) | 0}px;height:${rnd(6, 14) | 0}px"></i>`).join(''); });
  (() => {
    const c = cv('fx37'); const sp = []; let t = 0, boom = false, T0 = 0;
    hooks.n37 = {
      enter() { T0 = performance.now(); t = 0; boom = false; sp.length = 0; },
      tick(dt) {
        t = performance.now() - T0; c.clearRect(0, 0, W, H);
        if (!boom && t > 3100) { boom = true; burst(sp, 1530, 560, 140, ['242,194,48', '255,255,255', '255,233,168', '255,120,130'], 13); }
        if (t > 3300 && Math.random() < .35) sp.push({ x: 1530 + rnd(-130, 130), y: 600 + rnd(-120, 160), vx: rnd(-.5, .5), vy: rnd(-2.4, -.8), life: 1, r: rnd(1.5, 3.5), c: Math.random() < .6 ? '242,194,48' : '255,255,255' });
        drawSparks(c, sp, .05);
      }
    };
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
});
