/* Inventor B2B Network · Κρήτη 2026 — microsite engine (από το template Welcome Stores) */
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

  /* ---------- groups & menu ---------- */
  const PILLARS = [
    { t: 'Πριν την Αγορά', d: 'Απόθεμα σε πραγματικό χρόνο και παραγγελία 24/7, πριν ο πελάτης έρθει στο κατάστημα.' },
    { t: 'Στο Σημείο Πώλησης', d: 'Γνώση του πωλητή και ταχύτητα — με την INVY, το νέο μας σύστημα AI, δίπλα του.' },
    { t: 'Στον Συνεργάτη', d: 'Προνόμια που περνούν από την Inventor στον συνεργάτη και στον τελικό πελάτη.' },
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
  const menuOf = g => (g && g[0] === 'g') ? prodMenuIdx : menuIdx;
  const pVisited = new Set(); let prodMenuIdx = slides.findIndex(s => s.id === 'pmenu');
  $('#backBtn').addEventListener('click', () => go(menuOf(groupOf(cur))));

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

  /* ---------- INVENTOR TRIVIA ---------- */
  function makeTrivia(root) {
    const T = 30, NT = 60;
    const ticksG = $('.ticks', root), dig = $('.digits', root), tm = $('.tv-timer', root), round = $('.tv-round', root), fx = $('.tv-fx', root);
    let h = ''; for (let i = 0; i < NT; i++) { const a = i / NT * Math.PI * 2 - Math.PI / 2, c = Math.cos(a), s = Math.sin(a); h += `<line class="tick" x1="${c * 150}" y1="${s * 150}" x2="${c * 186}" y2="${s * 186}"/>`; }
    ticksG.innerHTML = h;
    const tk = [...ticksG.children], opts = $$('.tva', root);
    const dust = $('.tv-dust', root); for (let i = 0; i < 40; i++) { const d = document.createElement('i'); d.style.left = Math.random() * 1920 + 'px'; d.style.top = 600 + Math.random() * 480 + 'px'; d.style.animationDelay = Math.random() * 6 + 's'; d.style.animationDuration = 4 + Math.random() * 5 + 's'; dust.appendChild(d); }
    const lerp = (a, b, k) => a + (b - a) * k;
    const color = rem => { const k = 1 - rem / T; if (k < .5) { const u = k / .5; return `hsl(${lerp(205, 45, u)} ${lerp(90, 100, u)}% ${lerp(84, 62, u)}%)`; } const u = (k - .5) / .5; return `hsl(${lerp(45, 0, u)} 100% ${lerp(62, 56, u)}%)`; };
    let t0 = 0, running = false, done = false, startT = null, revealT = null;
    function reset() {
      running = false; done = false; clearTimeout(startT); clearTimeout(revealT);
      root.classList.remove('won', 'locked'); opts.forEach(o => o.classList.remove('picked', 'correct', 'wrong'));
      tm.classList.remove('over', 'hurry'); round.textContent = 'ΓΥΡΟΣ 30 ΔΕΥΤΕΡΟΛΕΠΤΩΝ'; round.classList.remove('end');
      dig.textContent = '00:30'; tk.forEach(l => l.classList.remove('off')); tm.style.setProperty('--tc', color(T));
    }
    function pick(o) {
      if (done) return; done = true; running = false;
      root.classList.add('locked'); o.classList.add('picked');
      revealT = setTimeout(() => {
        const c = opts.find(x => x.dataset.correct);
        o.classList.remove('picked'); if (o !== c) o.classList.add('wrong');
        c.classList.add('correct');
        const cx = c.offsetLeft + c.parentElement.offsetLeft + c.offsetWidth / 2, cy = c.offsetTop + c.parentElement.offsetTop + c.offsetHeight / 2;
        [...fx.children].forEach(el => { el.style.left = cx + 'px'; el.style.top = cy + 'px'; });
        void fx.offsetWidth; root.classList.add('won');
      }, 1500);
    }
    opts.forEach(o => o.addEventListener('click', () => pick(o)));
    return {
      enter() { reset(); startT = setTimeout(() => { t0 = performance.now(); running = true; }, 1800); },
      leave() { reset(); },
      key(k) { if (opts[k]) pick(opts[k]); },
      tick() {
        if (!running) return;
        const rem = Math.max(0, T - (performance.now() - t0) / 1000);
        dig.textContent = '00:' + String(Math.ceil(rem)).padStart(2, '0');
        const lit = Math.ceil(rem / T * NT); tk.forEach((l, i) => l.classList.toggle('off', i >= lit));
        tm.style.setProperty('--tc', color(rem));
        tm.classList.toggle('hurry', rem <= 10 && rem > 0);
        if (rem <= 0) { running = false; tm.classList.add('over'); round.textContent = 'ΤΕΛΟΣ ΧΡΟΝΟΥ'; round.classList.add('end'); }
      }
    };
  }
  $$('.slide.tv').forEach(s => { hooks[s.classList[1]] = makeTrivia(s); });

  /* agenda links */
  $$('.s2 .tile[data-go]').forEach(t => t.addEventListener('click', () => { const v = t.dataset.go; go(isNaN(v) ? slides.findIndex(x => x.id === v) : +v - 1); }));

  /* ---------- v2 extensions ---------- */
  const api = { hooks, later, cv, glowDot, burst, drawSparks, rnd, runCount, slides, W, H, $, $$, go: n => go(n), seqOf, pVisited, idOf: id => slides.findIndex(s => s.id === id), get cur() { return cur; } };
  if (window.WS_EXT) window.WS_EXT.forEach(f => { try { f(api); } catch (e) { console.error(e); } });

  /* ---------- navigation ---------- */
  /* κάθετη μπάρα προόδου (rail) με σελιδοδείκτες */
  const BOOKMARKS = { n6: 'Inventor σε αριθμούς', n12: 'Μ. Φλουρής', menu: '6 σημεία επαφής', pr70: 'Γ. Λαζαρίδου (Προϊοντική)', pr83: 'Κ. Κρίκος (Αντλίες θερμότητας)', pr84: 'Τ. Γαζής (VRF)' };
  const bmOf = i => { const k = Object.keys(BOOKMARKS).find(c => slides[i].classList.contains(c)); return k ? BOOKMARKS[k] : ''; };
  const titleOf = i => {
    const s = slides[i]; if (s.dataset.title) return s.dataset.title;
    const h = s.querySelector('h1,h2,h3'), e = s.querySelector('.eyebrow');
    let t = ((h && h.textContent) || (e && e.textContent) || '').replace(/\s+/g, ' ').trim();
    return t.length > 56 ? t.slice(0, 54) + '…' : t;
  };
  const pad2 = n => String(n).padStart(2, '0');
  const railEl = $('#rail');
  let railSeq = [], railGroup = null, railDrag = false;
  const yOf = k => railSeq.length < 2 ? 0 : k / (railSeq.length - 1) * 100;
  function buildRail(g) {
    railGroup = g; railSeq = seqOf(g);
    const bms = railSeq.map((i, k) => bmOf(i) ? `<a class="r-bm" data-k="${k}" style="top:${yOf(k)}%" title="${bmOf(i)}"></a>` : '').join('');
    railEl.innerHTML = `<div class="r-in"><div class="r-track"></div><div class="r-fill"></div>${bms}<div class="r-ghost"></div><div class="r-knob"><span></span></div><div class="r-tip"><small></small><i></i><b></b></div></div>`;
  }
  const railIdx = e => { const r = $('.r-in', railEl).getBoundingClientRect(); return Math.round(Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) * (railSeq.length - 1)); };
  function railHover(e) {
    const k = railIdx(e), i = railSeq[k];
    let sec = ''; for (let j = k; j >= 0; j--) { sec = bmOf(railSeq[j]); if (sec) break; }
    $('.r-ghost', railEl).style.top = $('.r-tip', railEl).style.top = yOf(k) + '%';
    $('.r-tip small', railEl).textContent = sec; $('.r-tip i', railEl).textContent = pad2(k + 1); $('.r-tip b', railEl).textContent = titleOf(i);
    return i;
  }
  railEl.addEventListener('pointermove', railHover);
  railEl.addEventListener('pointerdown', e => { railDrag = true; railEl.classList.add('drag'); railHover(e); e.preventDefault(); });
  addEventListener('pointermove', e => { if (railDrag) railHover(e); });
  addEventListener('pointerup', e => { if (!railDrag) return; railDrag = false; railEl.classList.remove('drag'); go(railHover(e)); });
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
      const pg = groupOf(prev); if (pg[0] === 'p') visited.add(+pg.slice(1)); else if (pg[0] === 'g') pVisited.add(+pg.slice(1));
    }
    lb.classList.remove('open'); tip.style.opacity = 0;
    timers.forEach(clearTimeout); timers = [];
    cur = n;
    const s = slides[n], g = groupOf(n), seq = seqOf(g), pos = seq.indexOf(n);
    s.classList.remove('prev');
    s._st = 0; for (let k = 1; k <= 9; k++) s.classList.remove('st' + k);
    s._tk = -1; flipTiles(s).forEach(t => t.classList.remove('flipped'));
    void s.offsetWidth;
    s.classList.add('active');
    document.body.dataset.slide = n + 1;
    document.body.dataset.group = g;
    document.body.dataset.bg = s.dataset.bg || '';
    document.body.dataset.tv = s.dataset.tv || '';
    if (railGroup !== g) buildRail(g);
    $('.r-knob', railEl).style.top = $('.r-fill', railEl).style.height = yOf(pos) + '%';
    $('.r-knob span', railEl).textContent = pad2(pos + 1);
    $$('.r-bm', railEl).forEach(b => b.classList.toggle('past', +b.dataset.k <= pos));
    const label = g === 'main' ? '' : g[0] === 'g' ? `${(s.dataset.cat || 'Κατηγορία')} · ` : `Πυλώνας ${g.slice(1)} · `;
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
    if (tileNav(d)) return;
    if (d > 0 && buildStep()) return;
    /* σειριακή ροή: «επόμενο» στο μενού των 6 σημείων → το επόμενο σημείο που δεν έχει παρουσιαστεί· όταν ολοκληρωθούν και τα 6 → συνέχεια κανονικά */
    if (d > 0 && cur === menuIdx) {
      const nx = PILLARS.findIndex((p, i) => !visited.has(i + 1) && seqOf('p' + (i + 1)).length);
      if (nx >= 0) { go(seqOf('p' + (nx + 1))[0]); return; }
    }
    /* ίδια σειριακή ροή στο μενού κατηγοριών της προϊοντικής: επόμενη κατηγορία που δεν έχει παρουσιαστεί */
    if (d > 0 && cur === prodMenuIdx) {
      for (let k = 1; k <= 6; k++) if (!pVisited.has(k) && seqOf('g' + k).length) { go(seqOf('g' + k)[0]); return; }
    }
    /* Page Up στο μενού: αντίστροφη σειριακή ροή — πίσω στην τελευταία οθόνη της τελευταίας ολοκληρωμένης ενότητας */
    if (d < 0 && (cur === menuIdx || cur === prodMenuIdx)) {
      const P = cur === menuIdx, S = P ? visited : pVisited, pre = P ? 'p' : 'g';
      const ks = [...S].filter(k => seqOf(pre + k).length).sort((x, y) => y - x);
      if (ks.length) { S.delete(ks[0]); const q = seqOf(pre + ks[0]); go(q[q.length - 1]); return; }
    }
    const np = pos + d;
    if (np < 0 || np >= seq.length) {
      if (g !== 'main') {
        go(menuOf(g));
        /* Page Up από την 1η οθόνη ενότητας: επιστροφή στο μενού χωρίς ✓, ώστε το επόμενο Page Up να πάει στην προηγούμενη ενότητα */
        if (d < 0) { const k = +g.slice(1); (g[0] === 'p' ? visited : pVisited).delete(k); const h = hooks[slides[cur].classList[1]]; h && h.enter && h.enter(); }
      }
      return;
    }
    go(seq[np]);
  }
  /* πλακίδια με κείμενο από πίσω: Page Down ανοίγει το επόμενο (κλείνει το προηγούμενο), Page Up το αντίστροφο */
  const flipTiles = sl => $$('.tile', sl).filter(t => t.querySelector('.face.back'));
  function tileNav(d) {
    const s = slides[cur], ts = flipTiles(s);
    if (!ts.length) return false;
    let k = s._tk == null ? -1 : s._tk;
    const open = i => { ts.forEach((t, j) => t.classList.toggle('flipped', j === i)); if (i >= 0) ts[i].dispatchEvent(new Event('mouseenter')); };
    if (d > 0) {
      if (k >= ts.length - 1) { open(-1); s._tk = -1; return false; }
      s._tk = k + 1; open(k + 1); return true;
    }
    if (k < 0) return false;
    s._tk = k - 1; open(k - 1); return true;
  }
  /* build steps: <section data-steps="N"> · κάθε κλικ/PgDn προσθέτει .st1 … .stN */
  function buildStep() {
    const s = slides[cur], n = +(s.dataset.steps || 0);
    if (!n || (s._st || 0) >= n) return false;
    if (lock) return true;
    s._st = (s._st || 0) + 1; s.classList.add('st' + s._st);
    const h = hooks[s.classList[1]]; h && h.step && h.step(s._st);
    lock = true; setTimeout(() => lock = false, 450);
    return true;
  }
  slides.forEach(s => { if (s.dataset.steps) s.addEventListener('click', e => { if (e.target.closest('button,a,.tile,.shot,.opt,.cat,[data-noclick]')) return; if ((s._st || 0) < +s.dataset.steps) buildStep(); }); });
  const next = () => step(1), prevS = () => step(-1);
  $('#nextBtn').onclick = next; $('#prevBtn').onclick = prevS;
  /* μετά από κλικ με το ποντίκι το κουμπί δεν κρατά focus (αλλιώς το Space του clicker θα το «πατούσε» δεύτερη φορά) */
  $$('.nav button, .backbtn').forEach(b => b.addEventListener('mouseup', () => b.blur()));
  $('#fsBtn').onclick = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {});
  $('#notesBtn').onclick = () => notes.classList.toggle('open');

  addEventListener('keydown', e => {
    if (['PageDown', 'ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); next(); hideHint(); }
    else if (['PageUp', 'ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); prevS(); hideHint(); }
    else if (e.key === 'Escape') { if (lb.classList.contains('open')) lb.classList.remove('open'); else if (groupOf(cur) !== 'main') go(menuOf(groupOf(cur))); }
    else if (['1', '2', '3', '4'].includes(e.key) && slides[cur].classList.contains('tv')) { const h = hooks[slides[cur].classList[1]]; h && h.key(+e.key - 1); }
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
