/* B2B Crete 2026 · hooks: βίντεο, γυάλινες μπάρες (λογική Β), γραμμικά διαγράμματα (λογική Α) */
(window.WS_EXT = window.WS_EXT || []).push(api => {
  'use strict';
  const { hooks, later, $, $$ } = api;
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
  const tip = $('#tip');
  const showTip = (e, html) => { tip.innerHTML = html; tip.style.opacity = 1; tip.style.left = e.clientX + 16 + 'px'; tip.style.top = e.clientY - 12 + 'px'; };
  const hideTip = () => tip.style.opacity = 0;
  const bindTip = (el, html) => { el.addEventListener('mousemove', e => showTip(e, typeof html === 'function' ? html() : html)); el.addEventListener('mouseleave', hideTip); };
  const addHook = (key, fns) => { const prev = hooks[key] || {}; hooks[key] = Object.assign({}, prev, {
    enter() { prev.enter && prev.enter(); fns.enter && fns.enter(); }, leave() { prev.leave && prev.leave(); fns.leave && fns.leave(); } }); };
  const keyOf = s => s.classList[1];

  /* ---------- βίντεο: αναπαραγωγή όταν ανοίγει η σελίδα (loop εκτός αν έχει data-once) ---------- */
  $$('.slide').forEach(s => {
    const vids = $$('video', s).filter(v => v.id !== 'mpVideo');
    if (!vids.length) return;
    addHook(keyOf(s), {
      enter() { vids.forEach(v => { try { v.pause(); v.currentTime = 0; } catch (e) {} later(() => { try { const p = v.play(); p && p.catch(() => {}); } catch (e) {} }, +(v.dataset.delay || 0)); }); },
      leave() { vids.forEach(v => v.pause()); }
    });
  });

  /* ---------- λογική Β · γυάλινος κύλινδρος ---------- */
  const b3 = cls => `<div class="b3 ${cls}"><i class="f"></i><i class="s"></i><i class="t"></i></div>`;

  /* range bars (εύρος θερμοκρασιών): .rbc[data-ticks] > .plot > .rb[data-lo][data-hi][data-hi2][data-lab] */
  $$('.rbc').forEach(host => {
    const ticks = host.dataset.ticks.split(',').map(Number), plot = $('.plot', host), col = host.dataset.color || 'red';
    const top = Math.max(...ticks), bot = Math.min(...ticks), span = top - bot;
    const Y = v => (top - v) / span * 100;                 // % από πάνω
    let h = '';
    ticks.forEach(t => h += `<div class="tk" style="top:${Y(t)}%"><span>${t}°C</span></div>`);
    plot.insertAdjacentHTML('afterbegin', h);
    const bars = $$('.rb', plot), n = bars.length;
    bars.forEach((b, i) => {
      const lo = +b.dataset.lo, hi = +b.dataset.hi, hi2 = b.dataset.hi2 ? +b.dataset.hi2 : null;
      b.style.left = `${(i + .5) / n * 100}%`;
      const snow = lo < 0 ? Math.max(1, Math.round((0 - lo) / 10)) : 0;
      const sub = lo < 0 ? `<div class="sub" style="height:${(Math.min(0, hi) - lo) / (hi - lo) * 100}%">${'<i>❄</i>'.repeat(snow)}</div>` : '';
      b.innerHTML = `<div class="bx${hi2 ? ' ext' : ''}" data-h="${(hi - lo) / span * 100}" style="bottom:${100 - Y(lo)}%">${b3(col)}${sub}</div>` +
        (hi2 ? `<div class="bx g" data-h="${(hi2 - hi) / span * 100}" style="bottom:${100 - Y(hi)}%">${b3('grn')}</div>` : '') +
        `<div class="lab">${b.dataset.lab}</div>`;
      bindTip($('.bx', b), `<b>${b.dataset.lab}</b><br>${lo}°C → ${hi2 || hi}°C${hi2 ? `<br><small>MX290-40T: έως ${hi2}°C</small>` : ''}`);
    });
    const bxs = $$('.bx', plot);
    addHook(keyOf(host.closest('.slide')), {
      enter() {
        bxs.forEach(x => { x.style.transition = 'none'; x.style.height = '0%'; x.classList.remove('on'); });
        plot.getBoundingClientRect();
        bxs.forEach((x, k) => later(() => { x.style.transition = 'height 1.6s cubic-bezier(.2,.8,.2,1)'; x.style.height = x.dataset.h + '%'; x.classList.add('on'); }, 500 + k * 260 + (x.classList.contains('g') ? 1500 : 0)));
      }
    });
  });

  /* grouped bars: .gbc[data-ymax][data-unit][data-legend] > .gb[data-lab][data-v="a,b"] */
  $$('.gbc').forEach(host => {
    const ymax = +host.dataset.ymax, unit = host.dataset.unit || '', leg = (host.dataset.legend || '').split('|');
    const cols = ['amb', 'grn'];
    const grid = [0, 40, 80, 120, 160].filter(v => v <= ymax).map(v => `<div class="tk" style="top:${100 - v / ymax * 100}%"><span>${v}</span></div>`).join('');
    const gs = $$('.gcol', host);
    host.insertAdjacentHTML('afterbegin', `<div class="ggrid">${grid}</div>`);
    gs.forEach(g => {
      const vs = g.dataset.v.split(',').map(Number);
      g.innerHTML = vs.map((v, k) => `<div class="bx ${cols[k]}" data-h="${v / ymax * 100}"><em>${v}</em>${b3(cols[k])}</div>`).join('') + `<div class="lab">${g.dataset.lab}</div>`;
      $$('.bx', g).forEach((x, k) => bindTip(x, `<b>${g.dataset.lab}</b> · ${leg[k] || ''}<br><b>${vs[k]} ${unit}</b>`));
    });
    if (leg[0]) host.insertAdjacentHTML('beforeend', `<div class="lg">${leg.map((l, k) => `<span><i class="${cols[k]}"></i>${l}</span>`).join('')}</div>`);
    const bxs = $$('.bx', host);
    addHook(keyOf(host.closest('.slide')), {
      enter() {
        bxs.forEach(x => { x.style.transition = 'none'; x.style.height = '0%'; x.classList.remove('on'); });
        host.getBoundingClientRect();
        bxs.forEach((x, k) => later(() => { x.style.transition = 'height 1.5s cubic-bezier(.2,.8,.2,1)'; x.style.height = x.dataset.h + '%'; x.classList.add('on'); }, 500 + k * 140));
      }
    });
  });

  /* ---------- λογική Α · γραμμικό διάγραμμα με λάμψη & κάθετο gradient (όπως σελ. 6) ---------- */
  let uid = 0;
  function lineChart(host, cfg) {
    const svg = $('.lcsvg', host), id = 'lcA' + (++uid);
    const W = +svg.viewBox.baseVal.width, H = +svg.viewBox.baseVal.height;
    const L = cfg.left ?? 60, R = W - 24, T = 24, Bm = H - 50;
    const n = cfg.series[0].v.length;
    const X = i => L + (R - L) * i / (n - 1), Y = v => Bm - (Bm - T) * (v - cfg.ymin) / (cfg.ymax - cfg.ymin);
    const defs = mk('defs', {}, svg);
    cfg.series.forEach((s, k) => { const lg = mk('linearGradient', { id: `${id}g${k}`, x1: 0, y1: 0, x2: 0, y2: 1 }, defs); mk('stop', { offset: 0, 'stop-color': s.c, 'stop-opacity': .42 }, lg); mk('stop', { offset: 1, 'stop-color': s.c, 'stop-opacity': 0 }, lg); });
    const fl = mk('filter', { id: `${id}f`, x: '-20%', y: '-20%', width: '140%', height: '140%' }, defs); mk('feGaussianBlur', { stdDeviation: 5, result: 'b' }, fl); const fm = mk('feMerge', {}, fl); mk('feMergeNode', { in: 'b' }, fm); mk('feMergeNode', { in: 'SourceGraphic' }, fm);
    for (let g = 0; g <= 4; g++) { const v = cfg.ymin + (cfg.ymax - cfg.ymin) * g / 4; mk('line', { class: 'gl', x1: L, x2: R, y1: Y(v), y2: Y(v) }, svg); }
    (cfg.xl || []).forEach((t, i) => mk('text', { class: 'xl', x: L + (R - L) * i / (cfg.xl.length - 1), y: Bm + 34, 'text-anchor': 'middle' }, svg).textContent = t);
    (cfg.yl || []).forEach(([v, t]) => mk('text', { class: 'yl', x: L - 12, y: Y(v) + 6, 'text-anchor': 'end' }, svg).textContent = t);
    const smooth = pts => pts.reduce((d, p, i, a) => { if (!i) return `M${p[0]} ${p[1]}`; const q = a[i - 1], cx = (q[0] + p[0]) / 2; return d + ` C${cx} ${q[1]} ${cx} ${p[1]} ${p[0]} ${p[1]}`; }, '');
    const poly = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
    const G = cfg.series.map((s, k) => {
      const g = mk('g', { class: 'ser' }, svg);
      const pts = s.v.map((v, i) => [X(i), Y(v)]);
      const d = s.step ? poly(pts) : smooth(pts);
      const ar = mk('path', { class: 'ar', d: d + ` L${R} ${Bm} L${L} ${Bm} Z`, fill: `url(#${id}g${k})` }, g);
      const ln = mk('path', { class: 'ln', d, stroke: s.c, filter: `url(#${id}f)` }, g);
      const hit = mk('path', { d, stroke: 'transparent', 'stroke-width': 26, fill: 'none' }, g);
      bindTip(hit, `<span style="color:${s.c}">●</span> <b>${s.n}</b>`);
      return { g, ar, ln };
    });
    host.insertAdjacentHTML('beforeend', `<div class="lgA">${cfg.series.map(s => `<span><i style="background:${s.c};box-shadow:0 0 12px ${s.c}"></i>${s.n}</span>`).join('')}</div>`);
    return () => G.forEach((o, k) => {
      const len = o.ln.getTotalLength();
      o.ln.style.transition = 'none'; o.ln.style.strokeDasharray = len; o.ln.style.strokeDashoffset = len; o.ar.style.opacity = 0; o.ln.getBoundingClientRect();
      later(() => { o.ln.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(.4,0,.2,1)'; o.ln.style.strokeDashoffset = 0; }, 600 + k * 500);
      later(() => o.ar.style.opacity = 1, 1700 + k * 500);
    });
  }
  /* SmartFlow: συμβατική ρύθμιση (βηματική ροή · ταλάντωση θερμοκρασίας) vs iVR (ομαλή ροή · σταθερή θερμοκρασία) */
  $$('.lcA').forEach(host => {
    const N = 25, t = i => i / (N - 1);
    const conv = {
      ymin: 0, ymax: 100, xl: ['έναρξη', 'χρόνος →'], yl: [[0, 'χαμηλή'], [100, 'υψηλή']],
      series: [
        { n: 'Ροή ψυκτικού', c: '#ff4a57', step: true, v: Array.from({ length: N }, (_, i) => [95, 95, 95, 40, 40, 40, 95, 95, 95, 40, 40, 40, 95, 95, 95, 40, 40, 40, 95, 95, 95, 40, 40, 40, 95][i]) },
        { n: 'Θερμοκρασία χώρου', c: '#ffb03a', v: Array.from({ length: N }, (_, i) => 55 + 26 * Math.sin(t(i) * Math.PI * 4 - .6)) }
      ]
    };
    const ivr = {
      ymin: 0, ymax: 100, xl: ['έναρξη', 'χρόνος →'], yl: [[0, 'χαμηλή'], [100, 'υψηλή']],
      series: [
        { n: 'Ροή ψυκτικού', c: '#ff4a57', v: Array.from({ length: N }, (_, i) => 92 - 50 * (1 - Math.exp(-t(i) * 4.5)) + 3 * Math.sin(t(i) * 14)) },
        { n: 'Θερμοκρασία χώρου', c: '#ffb03a', v: Array.from({ length: N }, (_, i) => 55 + 22 * Math.exp(-t(i) * 5) * Math.cos(t(i) * 9)) }
      ]
    };
    const play = lineChart(host, host.dataset.kind === 'conv' ? conv : ivr);
    addHook(keyOf(host.closest('.slide')), { enter: play });
  });
});

/* ---------- κόκκινα bullets + εμφάνιση «ριπής» (λέξη-λέξη, το ένα bullet μετά το άλλο) ---------- */
(window.WS_EXT = window.WS_EXT || []).push(api => {
  'use strict';
  const { $$ } = api;
  /* 1. μετατροπή μπλοκ κειμένου σε bullets στις τεχνικές σελίδες */
  const SL = ['c46', 'c54', 'c60', 'c69', 'c81', 'c82', 'c83', 'c84', 'c87', 'c88'];
  SL.forEach(c => $$(`.slide.${c} .tb .tt`).forEach(tt => {
    let ps = [...tt.children].filter(e => e.tagName === 'P');
    if (ps.length < 2 && !(ps.length === 1 && ps[0].textContent.length > 80)) return;
    if (c === 'c87') {                       // τίτλος + μία πρόταση σε 2 γραμμές → τίτλος + 1 bullet
      ps[0].innerHTML = ps[0].innerHTML.replace(/(’’|’<\/b><b>’)(<\/b>)?με/, m => m.replace('με', ' με'));
      ps[1].innerHTML += ' ' + ps[2].innerHTML; ps[2].remove(); ps[0].classList.add('bh'); ps[1].classList.add('bl'); return;
    }
    const first = ps[0], b = first.firstElementChild;
    if (b && b.tagName === 'B' && first.firstChild === b) {
      if (first.textContent.trim() === b.textContent.trim()) { first.classList.add('bh'); ps = ps.slice(1); }
      else if (b.nextSibling && b.nextSibling.tagName === 'BR') {       // «<b>Τίτλος</b><br>πρώτο χαρακτηριστικό»
        const p = document.createElement('p'); let n = b.nextSibling.nextSibling; b.nextSibling.remove();
        while (n) { const nx = n.nextSibling; p.appendChild(n); n = nx; }
        first.after(p); first.classList.add('bh'); ps = [p, ...ps.slice(1)];
      }
    }
    ps.forEach(p => {
      if (c === 'c46') { const i = p.innerHTML.indexOf('<br>'); if (i > 0) p.innerHTML = '<b>' + p.innerHTML.slice(0, i) + '</b>' + p.innerHTML.slice(i); }
      p.classList.add('bl');
    });
  }));
  /* 2. ριπή: κάθε λέξη σε span με καθυστέρηση· τα bullets διαδοχικά. Εξαιρούνται όσα είναι μέσα σε πλακίδια */
  const wrap = (el, base) => {
    let k = 0;
    const walk = n => [...n.childNodes].forEach(ch => {
      if (ch.nodeType === 3) {
        const parts = ch.textContent.split(/(\s+)/); if (!parts.some(t => t.trim())) return;
        const f = document.createDocumentFragment();
        parts.forEach(t => { if (!t) return; if (!t.trim()) { f.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'rw'; s.textContent = t; s.style.setProperty('--rd', (base + k++ * 26) + 'ms'); f.appendChild(s); });
        const w = document.createElement('span'); w.className = 'rwl'; w.appendChild(f); ch.replaceWith(w);
      } else if (ch.nodeType === 1 && !['svg', 'IMG', 'BR'].includes(ch.tagName)) walk(ch);
    });
    walk(el); el.style.setProperty('--pd', base + 'ms');
    return k;
  };
  $$('.slide').forEach(s => {
    let items = $$('.feat li, .sp-list li, .tt p.bl, .tt p.bh, .fi span, .fbot span, .tpill, .sfi span', s).filter(e => !e.closest('.tile'));
    /* λογική σειρά: μπλοκ από πάνω προς τα κάτω & αριστερά προς δεξιά· μέσα σε κάθε μπλοκ με τη σειρά ανάγνωσης */
    const rc = e => e.getBoundingClientRect();
    const groups = new Map();
    items.forEach((el, i) => { const c = el.matches('.tpill') ? el.parentElement : (el.closest('.tt, ul, .fgrid, .fbot, .sfrow') || el.parentElement); if (!groups.has(c)) groups.set(c, []); groups.get(c).push({ el, i }); });
    const gl = [...groups.entries()].map(([c, list]) => {
      const pills = list[0].el.matches('.tpill'), cols = pills || !!list[0].el.closest('.fgrid');
      if (cols) list.sort((a, b) => (Math.round(rc(a.el).left / 60) - Math.round(rc(b.el).left / 60)) || (rc(a.el).top - rc(b.el).top));
      const r = pills ? rc(list[0].el) : rc(c);
      return { list, top: r.top, left: r.left };
    });
    const sc = (rc(s).width || 1920) / 1920;
    gl.sort((a, b) => (Math.round(a.top / (90 * sc)) - Math.round(b.top / (90 * sc))) || (a.left - b.left));
    items = gl.flatMap(g => g.list.map(o => o.el));
    let t = 500;
    items.forEach(el => {
      if (el.classList.contains('rv')) el.style.setProperty('--d', Math.max(0, t - 150));
      if (el.matches('.sp-list li')) el.style.animationDelay = el.style.transitionDelay = (t - 150) + 'ms';
      const n = wrap(el, t);
      t += Math.max(260, n * 26 + 140);
    });
  });
});

/* σελ. 25: κλικ στο παράθυρο INVY = επόμενο βήμα (αλλαγή απάντησης)· μετά το βήμα = μεγέθυνση */
(window.WS_EXT = window.WS_EXT || []).push(api => {
  const sw = document.querySelector('.p5e .swap'); if (!sw) return;
  sw.addEventListener('click', e => {
    e.stopImmediatePropagation(); e.stopPropagation();
    const s = sw.closest('.slide'), lb = document.getElementById('lb');
    if (!s.classList.contains('st1')) document.getElementById('nextBtn').click();
    else { lb.querySelector('img').src = sw.querySelector('img.b').src; lb.classList.add('open'); }
  }, true);
});
