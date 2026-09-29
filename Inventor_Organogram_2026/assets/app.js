(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = (v, dec = 0) => new Intl.NumberFormat('el-GR', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v);
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ---------------- Tiles ---------------- */
  function tilesHTML(tiles) {
    return `<div class="tiles n${tiles.length}">` + tiles.map((t, i) => `
      <div class="tile" data-a="up" style="--d:${0.15 + i * 0.1}" tabindex="0" aria-label="${t.t}">
        <div class="tile-in">
          <div class="face front">
            <div class="num">${i + 1}</div>
            <div class="ttl">${t.t}</div>
            ${t.s ? `<div class="sub">${t.s}</div>` : ''}
            <div class="flip-hint">hover · ανάλυση</div>
          </div>
          <div class="face back">
            <div class="bt"><i>${i + 1}</i><span>${t.t}</span></div>
            <div class="body">${t.b}</div>
          </div>
        </div>
      </div>`).join('') + '</div>';
  }
  $$('[data-tiles]').forEach(el => { el.outerHTML = tilesHTML(TILE_SLIDES[el.dataset.tiles].tiles); });

  /* ---------------- Department slides ---------------- */
  const anchor = $('#dept-anchor');
  DEPT_SLIDES.forEach(d => {
    const sec = document.createElement('section');
    sec.className = 'slide dept';
    sec.dataset.id = d.id;
    sec.dataset.title = d.title + (d.part ? ' ' + d.part.split(' ')[0] : '');
    const media = `<div class="photo" data-a="up" style="--d:.35"><img src="assets/img/${d.photo}.webp" alt="" style="object-position:${d.photoPos || 'center'}"><b class="pnum">${d.no}</b></div>`;
    sec.innerHTML = `
      <div class="vtitle" data-a="fade" style="--d:0"><span>${d.vtitle || d.title}</span></div>
      <div class="dept-wrap">
        <div class="dept-info">
          <div class="no" data-a="left" style="--d:.05">Τμήμα <b>${d.no}</b> / 11</div>
          <h2 data-a="left" style="--d:.12">${d.title}</h2>
          ${d.part ? `<div class="part" data-a="left" style="--d:.18">Μέρος ${d.part}</div>` : ''}
          ${d.sub ? `<div class="subt" data-a="left" style="--d:.22">${d.sub}</div>` : ''}
          ${media}
        </div>
        ${tilesHTML(d.tiles)}
      </div>`;
    anchor.before(sec);
  });
  anchor.remove();

  /* uniform per-slide text fit: largest size where every back fits without scroll */
  function fitSlideText(slide) {
    const bodies = $$('.face.back .body', slide);
    if (!bodies.length) return;
    const cap = Math.max(15, Math.min(27, innerHeight / 38, innerWidth / 68));
    const fits = fs => {
      slide.style.setProperty('--fs', fs + 'px');
      return bodies.every(b => b.scrollHeight <= b.clientHeight + 1 && b.closest('.face').scrollHeight <= b.closest('.face').clientHeight + 1);
    };
    let lo = 9, hi = cap;
    if (fits(hi)) return;
    for (let k = 0; k < 12; k++) { const m = (lo + hi) / 2; fits(m) ? lo = m : hi = m; }
    slide.style.setProperty('--fs', (Math.floor(lo * 10) / 10 - .2).toFixed(1) + 'px');
  }
  const fitAll = () => $$('.slide').forEach(fitSlideText);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitAll);
  window.addEventListener('load', fitAll);
  document.fonts && document.fonts.addEventListener && document.fonts.addEventListener('loadingdone', fitAll);
  let fz; window.addEventListener('resize', () => { clearTimeout(fz); fz = setTimeout(fitAll, 120); });

  // touch: tap to flip
  document.addEventListener('click', e => {
    const t = e.target.closest('.tile');
    if (t && matchMedia('(hover: none)').matches) t.classList.toggle('flip');
  });
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter') && document.activeElement.classList.contains('tile')) document.activeElement.classList.toggle('flip');
  });

  /* ---------------- Slides & navigation ---------------- */
  const slides = $$('.slide');
  const total = slides.length;
  let cur = -1, lock = false;
  const dots = $('.dots');
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'dot'; b.dataset.label = `${String(i + 1).padStart(2, '0')} · ${s.dataset.title}`;
    b.setAttribute('aria-label', s.dataset.title);
    b.onclick = () => go(i);
    dots.appendChild(b);
  });
  // index overlay
  const idx = $('.index .list');
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.className = 'it'; b.style.setProperty('--i', i);
    b.innerHTML = `<b>${String(i + 1).padStart(2, '0')}</b><span>${s.dataset.title}</span>`;
    b.onclick = () => { toggleIndex(false); go(i); };
    idx.appendChild(b);
  });
  function toggleIndex(v) { $('.index').classList.toggle('open', v); }
  $('#btn-index').onclick = () => toggleIndex(!$('.index').classList.contains('open'));
  $('.index .close').onclick = () => toggleIndex(false);

  function go(n, instant) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === cur) return;
    const prev = cur; cur = n;
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === n);
      s.classList.toggle('before', i < n);
      if (i !== n) setTimeout(() => { if (i !== cur) { s.classList.remove('in'); leave(s); } }, 700);
    });
    const s = slides[n];
    requestAnimationFrame(() => requestAnimationFrame(() => { s.classList.add('in'); enter(s); }));
    $$('.dot').forEach((d, i) => d.classList.toggle('on', i === n));
    $('.ftr .count').innerHTML = `${String(n + 1).padStart(2, '0')} <span>/ ${String(total).padStart(2, '0')}</span>`;
    $('.ftr .bar i').style.width = ((n + 1) / total * 100) + '%';
    $('#btn-up').disabled = n === 0; $('#btn-down').disabled = n === total - 1;
    document.body.classList.toggle('on-cover', n === 0);
    history.replaceState(null, '', '#' + (n + 1));
    $('.tip').classList.remove('on');
    $$('.tile.flip').forEach(t => t.classList.remove('flip'));
  }
  const next = () => go(cur + 1), prevS = () => go(cur - 1);
  $('#btn-up').onclick = prevS; $('#btn-down').onclick = next;
  $('.hdr .logo').onclick = () => go(0);
  $$('[data-go]').forEach(b => b.onclick = () => {
    const i = slides.findIndex(s => s.dataset.id === b.dataset.go); if (i > -1) go(i);
  });

  document.addEventListener('keydown', e => {
    if ($('.index').classList.contains('open')) { if (e.key === 'Escape') toggleIndex(false); return; }
    if (['PageDown', 'ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['PageUp', 'ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); prevS(); }
    else if (e.key === 'Home') go(0); else if (e.key === 'End') go(total - 1);
    else if (e.key === 'f' || e.key === 'F') fs();
  });
  // wheel (with scrollable-element guard)
  let acc = 0, accT;
  window.addEventListener('wheel', e => {
    if ($('.index').classList.contains('open')) return;
    let el = e.target;
    while (el && el !== document.body) {
      if (el.scrollHeight > el.clientHeight + 2 && /auto|scroll/.test(getComputedStyle(el).overflowY)) {
        if ((e.deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) || (e.deltaY < 0 && el.scrollTop > 0)) return;
      }
      el = el.parentElement;
    }
    if (lock) return;
    acc += e.deltaY; clearTimeout(accT); accT = setTimeout(() => acc = 0, 180);
    if (Math.abs(acc) > 60) { acc > 0 ? next() : prevS(); acc = 0; lock = true; setTimeout(() => lock = false, 1000); }
  }, { passive: true });
  // touch swipe
  let ty = null, tx = null;
  window.addEventListener('touchstart', e => { ty = e.touches[0].clientY; tx = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', e => {
    if (ty === null) return;
    const dy = ty - e.changedTouches[0].clientY, dx = tx - e.changedTouches[0].clientX; ty = null;
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) dx > 0 ? next() : prevS();
  }, { passive: true });
  // fullscreen
  function fs() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.();
  }
  $('#btn-fs').onclick = fs;

  /* ---------------- Enter / leave hooks ---------------- */
  function enter(s) {
    fitSlideText(s);
    $$('.cnt', s).forEach(runCount);
    if (s.querySelector('.org')) orgEnter();
    const plot = $$('.plot', s);
    plot.forEach(p => { p.classList.remove('ready'); setTimeout(() => p.classList.add('ready'), 2300); });
  }
  function leave(s) {
    $$('.cnt', s).forEach(c => { c.textContent = c.dataset.pre || '' ; c.textContent = (c.dataset.pre || '') + fmt(0, +c.dataset.dec || 0) + (c.dataset.suf || ''); });
    if (s.querySelector('.org')) orgLeave();
  }

  /* ---------------- Running numbers ---------------- */
  function runCount(el) {
    const to = parseFloat(el.dataset.to), dec = +el.dataset.dec || 0, dur = +el.dataset.dur || 1800;
    const delay = (+el.dataset.delay || 0.3) * 1000, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const t0 = performance.now() + delay;
    cancelAnimationFrame(el._raf);
    const step = now => {
      const p = Math.min(1, Math.max(0, (now - t0) / dur));
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + fmt(to * e, dec) + suf;
      if (p < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  /* ---------------- Org chart ---------------- */
  const org = $('.org');
  const svg = $('svg.lines', org);
  const ini = n => n ? n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('') : '';
  const personNode = (p, cls = '') => `<div class="node ${cls}"><div class="av">${ini(p.n)}</div><div><div class="nm">${p.n}</div><div class="rl">${p.r}</div></div></div>`;
  const chip = (t, i, nested) => `<div class="team${nested ? ' nested' : ''}" style="--i:${i}"><b>${t.c}</b><span>${t.r}</span></div>`;
  const teamChip = (t, i) => t.k ? `<div class="tgrp">${chip(t, i)}${t.k.map(k => chip(k, i, true)).join('')}</div>` : chip(t, i);
  const l1HTML = (p, i, cls = '') => `<div class="node l1${p.low ? ' low' : ''} ${cls}" data-i="${i}" tabindex="0">
      <div class="av">${ini(p.n)}</div><div class="nm">${p.n}</div><div class="rl">${p.short || p.r}</div><div class="tag">${p.tag}</div><div class="open">+</div></div>`;

  $('.lvl0', org).innerHTML = `<div class="node md" data-k="md"><div class="av">${ini(ORG.n)}</div><div><div class="nm">${ORG.n}</div><div class="rl">${ORG.r}</div></div></div>`;
  $('.lvl1', org).innerHTML = ORG.k.map((p, i) => l1HTML(p, i)).join('');

  // columns (director + subtree) of an L1 branch, with a height weight
  function buildCols(p, compact) {
    const persons = p.k.filter(x => x.n), teams = p.k.filter(x => !x.n);
    let cnt = 0; const cols = [];
    persons.forEach(q => {
      let subs = '', w = 1;
      (q.k || []).forEach(c => {
        if (c.n) { subs += `<div class="mgr" style="--i:${cnt++}">${personNode(c, 'show')}${(c.k || []).map(t => teamChip(t, 0)).join('')}</div>`; w += 1.3 + (c.k || []).length; }
        else { subs += teamChip(c, cnt++); w += 1 + (c.k ? c.k.length : 0); }
      });
      cols.push({ w, html: `<div class="bcol">${personNode(q)}${subs ? `<div class="subs${q.wide && !compact ? ' grid2' : ''}">${subs}</div>` : ''}</div>` });
    });
    if (teams.length) cols.push({ w: teams.length, html: `<div class="bcol teams"><div class="subs tsubs">${teams.map(t => teamChip(t, cnt++)).join('')}</div></div>` });
    return cols;
  }

  let sel = -1, full = false, orgTimers = [];
  const toggle = $('.otoggle', org);
  function setMode(f, i) {
    full = f;
    org.classList.toggle('full-mode', f);
    toggle.setAttribute('aria-pressed', f);
    svg.innerHTML = '';
    if (f) renderFull();
    else { $('.full', org).innerHTML = ''; drawLines(false); renderBranch(i !== undefined ? i : (sel > -1 ? sel : 0)); }
  }
  toggle.addEventListener('click', () => setMode(!full));

  function renderBranch(i) {
    const br = $('.branch', org);
    br.classList.remove('show');
    br.innerHTML = buildCols(ORG.k[i], false).map(c => c.html).join('');
    $$('.lvl1 .node', org).forEach((n, j) => n.classList.toggle('sel', j === i));
    sel = i;
    br.style.transform = 'none';
    requestAnimationFrame(() => {
      fitBranch(br);
      $$('.bcol > .node', br).forEach((n, j) => setTimeout(() => n.classList.add('show'), 80 + j * 90));
      setTimeout(() => br.classList.add('show'), 200);
      drawLines(true);
    });
  }
  $$('.lvl1 .node', org).forEach(n => {
    n.addEventListener('click', () => renderBranch(+n.dataset.i));
    n.addEventListener('keydown', e => { if (e.key === 'Enter') renderBranch(+n.dataset.i); });
  });

  // partial: shrink or enlarge to fill the free space
  function fitBranch(br) {
    const kids = Array.from(br.children);
    if (!kids.length) return;
    const need = Math.max(...kids.map(k => k.offsetTop + k.offsetHeight));
    const avail = org.getBoundingClientRect().bottom - br.getBoundingClientRect().top - 6;
    const needW = kids.reduce((a, k) => a + k.offsetWidth, 0) + (kids.length - 1) * parseFloat(getComputedStyle(br).columnGap || 0);
    const f = Math.min(1.3, avail / need, br.clientWidth / needW);
    br.style.transform = Math.abs(f - 1) > .01 ? `scale(${f.toFixed(3)})` : 'none';
  }

  // full: every branch at once, each L1 over its own stacks
  function fullHTML(th) {
    return ORG.k.map((p, i) => {
      const cols = buildCols(p, true);
      const total = cols.reduce((a, c) => a + c.w, 0);
      let stacks = [cols];
      if (cols.length > 1 && total > th) {           // split tall branches into two balanced stacks
        let best = null;
        for (let k = 1; k < cols.length; k++) {
          const a = cols.slice(0, k).reduce((s, c) => s + c.w, 0), d = Math.abs(total - 2 * a);
          if (!best || d < best.d) best = { k, d };
        }
        stacks = [cols.slice(0, best.k), cols.slice(best.k)];
      }
      return `<div class="fgrp" style="--g:${i}">${l1HTML(p, i, 'show')}<div class="stacks">${stacks.map(st => `<div class="stack">${st.map(c => c.html).join('')}</div>`).join('')}</div></div>`;
    }).join('');
  }
  // direct reports of the MD που δεν είναι C-level: στο ύψος των Directors (όπως στο επίσημο οργανόγραμμα)
  function lowerFull(fl) {
    const ref = $$('.fgrp', fl).find(g => !g.querySelector(':scope > .node.l1.low') && g.querySelector('.stack .bcol > .node'));
    if (!ref) return;
    const d = ref.querySelector('.stack .bcol > .node').getBoundingClientRect().top - ref.querySelector(':scope > .node.l1').getBoundingClientRect().top;
    $$('.fgrp > .node.l1.low', fl).forEach(n => n.style.marginTop = d + 'px');
  }
  function renderFull() {
    const wrap = $('.fullwrap', org), fl = $('.full', org);
    fl.classList.remove('show');
    fl.style.transform = 'translateX(-50%)';
    // try a wide (split) and a narrow (unsplit) layout, keep the one that zooms larger
    let best = null;
    for (const th of [9, 16, Infinity]) {
      fl.innerHTML = fullHTML(th); lowerFull(fl);
      const f = Math.min(1.3, (wrap.clientHeight - 4) / fl.offsetHeight, (wrap.clientWidth - 4) / fl.offsetWidth);
      if (!best || f > best.f + .005) best = { th, f };
    }
    fl.innerHTML = fullHTML(best.th); lowerFull(fl);
    $$('.bcol > .node', fl).forEach(n => n.classList.add('show'));
    $$('.fgrp .node.l1', fl).forEach(n => n.addEventListener('click', () => setMode(false, +n.dataset.i)));
    fl.style.transform = `translateX(-50%) scale(${best.f.toFixed(3)})`;
    requestAnimationFrame(() => { fl.classList.add('show'); drawFullLines(); });
  }

  function rel(el) {
    const o = org.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - o.left, y: r.top - o.top, w: r.width, h: r.height, cx: r.left - o.left + r.width / 2, b: r.bottom - o.top, my: r.top - o.top + r.height / 2 };
  }
  function elbow(a, b, midY) { return `M${a.x},${a.y} V${midY} H${b.x} V${b.y}`; }
  function addPath(d, g, delay, cls = '') {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d); p.dataset.g = g; if (cls) p.setAttribute('class', cls);
    svg.appendChild(p);
    const L = p.getTotalLength();
    p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    p.getBoundingClientRect();
    p.style.transition = `stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1) ${delay}s`;
    requestAnimationFrame(() => p.style.strokeDashoffset = 0);
    return p;
  }
  function spines(scope, delay) {
    $$('.bcol', scope).forEach(c => {
      const head = c.firstElementChild, subs = c.querySelector('.subs');
      if (!subs || head === subs) return;
      const hr = rel(head), sr = rel(subs);
      if (sr.y > hr.b) addPath(`M${hr.cx},${hr.b} V${sr.y}`, 'br', delay);
    });
  }
  function drawLines(branchOnly) {
    if (full) return;
    if (!branchOnly) svg.innerHTML = ''; else $$('path', svg).filter(p => p.dataset.g !== 'top').forEach(p => p.remove());
    const md = rel($('.lvl0 .node', org));
    const l1 = $$('.lvl1 .node', org).map(rel);
    if (!branchOnly) {
      const mid = md.b + (Math.min(...l1.map(n => n.y)) - md.b) / 2;
      l1.forEach((n, i) => addPath(elbow({ x: md.cx, y: md.b }, { x: n.cx, y: n.y }, mid), 'top', .3 + Math.abs(i - 3) * .06));
    }
    $$('path[data-g="top"]', svg).forEach((p, i) => p.classList.toggle('hot', i === sel));
    if (sel > -1) {
      const s = l1[sel];
      const heads = $$('.branch .bcol', org).map(c => rel(c.firstElementChild));
      if (!heads.length) return;
      const top = Math.min(...heads.map(h => h.y));
      const mid = s.b + (top - s.b) / 2 + 4;
      heads.forEach((h, i) => addPath(elbow({ x: s.cx, y: s.b + 11 }, { x: h.cx, y: h.y }, mid), 'br', .05 + i * .08, 'hot'));
      spines($('.branch', org), .5);
    }
  }
  function drawFullLines() {
    svg.innerHTML = '';
    const md = rel($('.lvl0 .node', org));
    const grps = $$('.fgrp', org);
    const l1s = grps.map(g => rel(g.querySelector('.node.l1')));
    const mid = md.b + (Math.min(...l1s.map(n => n.y)) - md.b) / 2;
    l1s.forEach((n, i) => addPath(elbow({ x: md.cx, y: md.b }, { x: n.cx, y: n.y }, mid), 'top', .15 + Math.abs(i - 3) * .06));
    grps.forEach((g, gi) => {
      const L = l1s[gi];
      const stacks = $$('.stack', g);
      stacks.forEach((st, si) => {
        const heads = $$(':scope > .bcol', st).map(c => rel(c.firstElementChild || c));
        if (!heads.length) return;
        const railX = heads[0].x - 9;
        const topY = heads[0].y - 12;
        let d = `M${L.cx},${L.b} V${topY} H${railX} V${heads[heads.length - 1].my}`;
        addPath(d, 'br', .5 + gi * .08 + si * .05, 'hot');
        heads.forEach(h => addPath(`M${railX},${h.my} H${h.x}`, 'br', 1 + gi * .08));
      });
      spines(g, 1.1 + gi * .08);
    });
  }

  function orgEnter() {
    orgTimers.forEach(clearTimeout); orgTimers = [];
    const md = $('.lvl0 .node', org); md.classList.remove('show');
    orgTimers.push(setTimeout(() => md.classList.add('show'), 150));
    if (full) { orgTimers.push(setTimeout(renderFull, 400)); return; }
    $$('.lvl1 .node', org).forEach((n, i) => { n.classList.remove('show'); orgTimers.push(setTimeout(() => n.classList.add('show'), 350 + Math.abs(i - 3) * 110)); });
    orgTimers.push(setTimeout(() => { drawLines(false); }, 700));
    orgTimers.push(setTimeout(() => renderBranch(sel > -1 ? sel : 0), 1500));
  }
  function orgLeave() {
    orgTimers.forEach(clearTimeout);
    svg.innerHTML = ''; $('.branch', org).innerHTML = ''; $('.full', org).innerHTML = '';
    $$('.lvl0 .node, .lvl1 .node', org).forEach(n => n.classList.remove('show', 'sel'));
  }
  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => {
    if (!slides[cur].querySelector('.org')) return;
    if (full) renderFull();
    else if (sel > -1) { fitBranch($('.branch', org)); svg.innerHTML = ''; drawLines(false); drawLines(true); }
  }, 150); });

  /* ---------------- Results: table + charts ---------------- */
  const R = RESULTS, M = v => v / 1e6;
  const SER = [
    { k: 'a25', name: 'Actual YtD 2025', c: 'var(--c25)' },
    { k: 'bu', name: 'Budget 2026', c: 'var(--cbu)' },
    { k: 'a26', name: 'Actual YtD 2026', c: 'var(--c26)' }
  ];
  const tb = $('#res-table tbody');
  if (tb) tb.innerHTML = R.rows.map((r, i) => `
    <tr class="${r.total ? 'total' : ''}" style="--i:${i}">
      <td>${r.k}</td>
      ${SER.map((s, j) => `<td><span class="cnt" data-to="${r[s.k]}" data-dec="2" data-suf=" €" data-delay="${.7 + i * .15}" data-dur="1600">0</span></td>`).join('')}
      <td><span class="delta neg"><span class="cnt" data-to="${r.vLY}" data-dec="2" data-suf="%" data-delay="${.9 + i * .15}">0</span></span></td>
      <td><span class="delta neg"><span class="cnt" data-to="${r.vBU}" data-dec="2" data-suf="%" data-delay="${.9 + i * .15}">0</span></span></td>
    </tr>`).join('') + `
    <tr style="--i:3"><td>EBIT %</td>
      ${SER.map(s => `<td><span class="cnt" data-to="${R.ebit[s.k]}" data-dec="2" data-suf="%" data-delay="1.3">0</span></td>`).join('')}
      <td><span class="delta neg">${fmt(R.ebit.a26 - R.ebit.a25, 2)} μ.</span></td><td><span class="delta neg">${fmt(R.ebit.a26 - R.ebit.bu, 2)} μ.</span></td></tr>`;

  function barChart(el, groups, max, step, unit) {
    const gls = [];
    for (let v = 0; v <= max; v += step) gls.push(`<div class="gl" style="top:calc((100% - 30px) * ${1 - v / max})"><span>${v}${unit === '%' ? '%' : ''}</span></div>`);
    let i = 0;
    el.innerHTML = gls.join('') + `<div class="base"></div><div class="groups">` + groups.map(g => `
      <div class="grp">${SER.map(s => {
        const v = g.v[s.k];
        return `<div class="cbar" style="--h:${v / max * 100}%;--c:${s.c};--i:${i++}" data-s="${s.name}" data-g="${g.label}" data-v="${v}" data-u="${unit}" data-row='${JSON.stringify(g.extra || {})}'>
          <span class="bl">${unit === '%' ? fmt(v, 2) + '%' : '€' + fmt(v, 1) + 'M'}</span></div>`;
      }).join('')}<div class="gx">${g.label}</div></div>`).join('') + `</div>`;
  }
  const sales = $('#chart-sales');
  if (sales) {
    barChart(sales, R.rows.map(r => ({ label: r.total ? 'Σύνολο' : r.k.replace('Πωλήσεις ', ''), v: { a25: M(r.a25), bu: M(r.bu), a26: M(r.a26) }, extra: { vLY: r.vLY, vBU: r.vBU } })), 70, 10, '€');
    barChart($('#chart-ebit'), [{ label: 'EBIT %', v: R.ebit }], 20, 5, '%');
  }
  const tip = $('.tip');
  document.addEventListener('mousemove', e => {
    const b = e.target.closest('.plot.ready .cbar');
    if (!b) { tip.classList.remove('on'); return; }
    const v = +b.dataset.v, u = b.dataset.u, ex = JSON.parse(b.dataset.row);
    const val = u === '%' ? fmt(v, 2) + '%' : '€' + fmt(v * 1e6, 2);
    let extra = '';
    if (b.dataset.s.includes('2026') && b.dataset.s.includes('Actual') && ex.vLY !== undefined)
      extra = `<div class="r"><span>vs LY</span><b class="neg" style="font-size:12px">${fmt(ex.vLY, 2)}%</b></div><div class="r"><span>vs Budget</span><b class="neg" style="font-size:12px">${fmt(ex.vBU, 2)}%</b></div>`;
    tip.innerHTML = `<small>${b.dataset.g} · ${b.dataset.s}</small><b>${val}</b>${extra}`;
    tip.classList.add('on');
    const x = Math.min(innerWidth - tip.offsetWidth - 12, e.clientX + 16), y = Math.max(12, e.clientY - tip.offsetHeight - 14);
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  });

  /* ---------------- Start ---------------- */
  const h = parseInt(location.hash.slice(1), 10);
  go(isNaN(h) ? 0 : h - 1);
  window.addEventListener('hashchange', () => { const n = parseInt(location.hash.slice(1), 10); if (!isNaN(n)) go(n - 1); });
  $$('.slide').forEach(s => s.dataset.title || (s.dataset.title = 'Slide'));
})();
