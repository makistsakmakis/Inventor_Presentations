/* B2B Crete 2026 · v2 — hooks (n6/n7 διαγράμματα, μενού προϊόντων, space φόντο) · φορτώνεται πριν το app.js */
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
        return `<div class="r ${d[0] === 'Inventor' ? 'me' : ''}"><div class="nm">${d[0]}</div><div class="tr"><div class="br" data-v="${d[1]}"></div><div class="vv" style="left:0">${d[1]}</div></div></div>`; }).join('');
      $(id).insertAdjacentHTML('beforeend', `<div class="fns">${notes.map((n, i) => `<span>${n}</span>`).join('')}</div>`);
      const brs = $$('.br', rows), vvs = $$('.vv', rows);
      brs.forEach((b, i) => bindTip(b, `${title}<br><b>${data[i][0]}: ${data[i][1]}</b>`));
      return () => brs.forEach((b, i) => { b.style.width = 0; vvs[i].style.left = 0; later(() => { const w = data[i][1] / max * 100 + '%'; b.style.width = w; vvs[i].style.left = w; }, 900 + i * 90); });
    };
    const ra = build('#n7a', A, 'Buyers in past 2 years'), rb = build('#n7b', B, 'Potential buyers within next year');
    enterOf('n7', () => { ra(); rb(); });
  })();

  /* ================= προϊόντα · μενού κατηγοριών ================= */
  (() => {
    const CATS = [['Οικιακά κλιματιστικά', ['m-ac']], ['Ημικεντρικά Κλιματιστικά', ['m-cassette']], ['Αντλίες θερμότητας', ['hp-mono-w', 'm-hp-indoor']], ['VRF', ['m-vrf']]];
    const host = $('#cats');
    host.innerHTML = CATS.map((c, i) => { const n = api.seqOf('g' + (i + 1)).length;
      return `<div class="cat" data-g="${i + 1}" style="--k:${i}"><div class="pim">${c[1].map((f, j) => `<img class="p${j}" src="assets/img/lz/${f}.webp" alt="" style="--j:${i + j}">`).join('')}</div><div class="ck"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div><div class="cn"><h3>${c[0].replace('&', '&amp;')}</h3><small>${n} ${n === 1 ? 'οθόνη' : 'οθόνες'}</small></div></div>`; }).join('');
    const els = $$('.cat', host);
    els.forEach(el => el.addEventListener('click', () => { el.classList.add('launch'); setTimeout(() => { el.classList.remove('launch'); api.go(api.seqOf('g' + el.dataset.g)[0]); }, 380); }));
    hooks.pmenu = { enter() { els.forEach(el => el.classList.toggle('done', api.pVisited.has(+el.dataset.g))); $('#pmProg').textContent = `${api.pVisited.size} / 4`; } };
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
      [...btns, ...tts].forEach(b => b.addEventListener('click', () => { sel(+b.dataset.t); sec._st = +b.dataset.t; }));
      /* μετάβαση από σειρά σε σειρά μόνο με κλικ / PgDn (clicker) – όχι αυτόματα */
      hooks.pr72 = { enter() { sel(0); }, step(n) { sel(Math.min(n, 3)); } };
    }
    const eb = $('#endBtn'); if (eb) eb.addEventListener('click', e => { e.stopPropagation(); api.go(api.idOf('lz13')); });
  })();
});
