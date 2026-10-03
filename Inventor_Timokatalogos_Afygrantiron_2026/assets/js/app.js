/* =====================================================================
   INVENTOR 2026 · Interactive price list — engine
   ===================================================================== */
(function () {
  'use strict';
  const C = window.CAT, P = C.P, I = C.IMG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const img = n => I + n + (/\.(png|jpg|webp)$/.test(n) ? '' : (n.startsWith('p-') ? '.webp' : '.png'));
  const pimg = n => I + 'p-' + n + '.webp';

  /* ------------------------------------------------------------------
     Sections
  ------------------------------------------------------------------ */
  const SECTIONS = [
    { id: 'welcome',  n: '01', short: 'Καλωσόρισμα',        name: 'Καλωσόρισμα στην Εμπειρία Ιδανικής Ατμόσφαιρας' },
    { id: 'tech',     n: '02', short: 'Τεχνολογίες',         name: 'Τεχνολογίες' },
    { id: 'series',   n: '03', short: 'Προϊοντικά Series',   name: 'Προϊοντικά Series' },
    { id: 'compare',  n: '04', short: 'Σύγκριση μοντέλων',   name: 'Σύγκριση μοντέλων' },
    { id: 'services', n: '05', short: 'Λύσεις & Υπηρεσίες',  name: 'Λύσεις και Υπηρεσίες' }
  ];

  /* ------------------------------------------------------------------
     Small template helpers
  ------------------------------------------------------------------ */
  const burst = (lines, cls = '', d = 0, style = '') =>
    `<div class="burst ${cls}" style="--d:${d}s;${style}">${lines.map((l, i) => `<span class="ln" style="--i:${i}"><span>${l}</span></span>`).join('')}</div>`;

  const tile = (n, title, backHTML, i) =>
    `<div class="tile" tabindex="0" style="--i:${i}"><div class="in">
       <div class="face front"><div class="num">${n}</div><div class="ttl">${title}</div></div>
       <div class="face back">${backHTML}</div>
     </div></div>`;

  const zoomIco = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5M11 8v6M8 11h6"/></svg>';
  const arrowIco = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const photoZoom = (src, cap) => `<button class="zbtn phz" data-photo="${src}" data-cap="${cap || ''}" style="position:absolute;right:130px;bottom:26px;z-index:4;background:rgba(10,13,17,.55);backdrop-filter:blur(10px)">${zoomIco}Μεγέθυνση</button>`;

  const seriesName = s => C.SERIES[s].name;

  /* spec table */
  function specTable(t) {
    const th = t.head.map(h => `<th>${h}</th>`).join('');
    const rows = t.rows.map(r => {
      const cells = [];
      r.forEach((c, i) => {
        if (typeof c === 'object') cells.push(`<td class="span" colspan="${t.head.length - 2}">${c.span}</td>`);
        else cells.push(`<td${i > 0 ? ' class="rn"' : ''}>${c}</td>`);
      });
      return `<tr>${cells.join('')}</tr>`;
    }).join('');
    return `<table class="spec"><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table>`;
  }

  /* ------------------------------------------------------------------
     Slides
  ------------------------------------------------------------------ */
  const SL = [];
  const add = (o) => SL.push(o);

  /* ---- 01 COVER ---- */
  add({ id: 'cover', sec: 'welcome', title: 'Εξώφυλλο · 2026', thumb: img('ph-cover.jpg'), cls: 's-cover', html: `
    <div class="photo"><img src="${img('ph-cover.jpg')}" alt=""></div>
    <div class="arc fadein" style="--d:.3s"></div>
    <img class="logo rise" src="${img('logo-inventor-tagline-w')}" alt="Inventor · We invent. You live.">
    <div class="year rise" style="--d:.15s"><span class="run">20</span><span class="b run">26</span></div>
    ${burst(['ΤΙΜΟΚΑΤΑΛΟΓΟΣ', 'ΑΦΥΓΡΑΝΤΗΡΩΝ'], 'ttl', .5)}
    <div class="cta rise" style="--d:.7s">
      <button class="btn red" data-next>Ξεφύλλισμα ${arrowIco}</button>
      <button class="btn" data-index>Ευρετήριο</button>
    </div>
    <div class="chips rise" style="--d:.9s">${SECTIONS.map(s => `<button class="chipbtn" data-sec="${s.id}"><b>${s.n}</b>${s.name}</button>`).join('')}</div>
`
  });

  /* ---- 02 EXPERIENCE ---- */
  add({ id: 'experience', sec: 'welcome', title: 'Ζήστε την εμπειρία της ιδανικής ατμόσφαιρας', thumb: img('ph-living.jpg'), cls: 's-exp', html: `
    <div class="photo"><img src="${img('ph-living.jpg')}" alt=""></div>
    ${burst(C.INTRO.title, 'h-thin', .2)}
    ${burst(C.INTRO.caption, 'cap', 1)}
    <div class="right"><p class="lead rise">${C.INTRO.lead}</p></div>
    <div class="tiles">${C.INTRO.tiles.map((t, i) => { const tt = t[0].replace(' | ', ':<br>'); return tile(i + 1, tt, `<h4>${tt}</h4><div class="scroll" data-scroll><p>${t[1]}</p></div>`, i); }).join('')}</div>`
  });

  /* ---- 03 TECH ---- */
  add({ id: 'technology', sec: 'tech', title: 'Προηγμένη τεχνολογία. Απόλυτη άνεση.', thumb: img('ph-tech.jpg'), cls: 's-tech', html: `
    <div class="photo"><img src="${img('ph-tech.jpg')}" alt=""></div>
    ${burst(C.TECH.title, 'h-thin', .2)}
    ${burst(C.TECH.caption, 'cap', .9)}
    <div class="tiles tech-ic">${C.TECH.tiles.map((t, i) => tile(`<img class="ticon" src="${img(t[2])}" alt="">`, t[0], `<h4>${t[0]}</h4><div class="scroll" data-scroll><p>${t[1]}</p></div>`, i)).join('')}</div>
    <p class="foot rise" style="--d:.8s">${C.TECH.foot}</p>`
  });

  /* ---- 04 ECODRIVE infographic ---- */
  const ecoModels = ['sera', 'melody', 'iria', 'alva'];
  add({ id: 'ecodrive', sec: 'tech', title: 'EcoDrive AI · Εξοικονόμηση ενέργειας', thumb: img('t-ecodrive'), cls: 's-eco', html: `
    <svg width="0" height="0" style="position:absolute"><defs><linearGradient id="gMint" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d5ffee"/><stop offset=".5" stop-color="#7fd8b0"/><stop offset="1" stop-color="#3f7560"/></linearGradient></defs></svg>
    <svg class="flows" data-flows="eco"></svg>
    <div class="topl">
      <span class="kicker rise">EcoDrive AI</span>
      <img class="ecologo rise" style="--d:.1s" src="${img('t-ecodrive')}" alt="ECO DRIVE AI">
      ${burst(['ΙΔΑΝΙΚΟ ΕΠΙΠΕΔΟ ΥΓΡΑΣΙΑΣ', 'ΕΞΟΙΚΟΝΟΜΗΣΗ ΕΝΕΡΓΕΙΑΣ'], 'h-thin', .3, 'font-size:34px;font-weight:700;letter-spacing:.04em;line-height:1.35')}
      <p class="lead rise" style="--d:.5s;font-size:16px;margin-top:22px">${C.TECH.tiles[0][1]}</p>
    </div>
    <div class="big rise" style="--d:.6s"><b class="run">36</b>% – <b class="run">40</b>%</div>
    <div class="bigl rise" style="--d:.8s">εξοικονόμηση από 36% έως 40%*</div>
    <div class="donuts">${ecoModels.map((m, i) => { const p = P[m]; return `
      <div class="donut glass" data-anchor style="--i:${i}">
        <svg viewBox="0 0 220 220"><circle class="tk" cx="110" cy="110" r="100"/><circle class="g-tx" cx="104" cy="110" r="84"/><circle class="tr" cx="110" cy="110" r="84"/><circle class="g-rim" cx="110" cy="110" r="97"/><circle class="g-rim i" cx="110" cy="110" r="71"/><circle class="g-px" cx="104" cy="110" r="84" pathLength="100" data-v="${p.eco}"/><circle class="ar" cx="110" cy="110" r="84" pathLength="100" data-v="${p.eco}"/><circle class="g-sh" cx="110" cy="110" r="93" pathLength="100" data-v="${p.eco}"/><circle class="g-hl" cx="110" cy="110" r="76" pathLength="100" data-v="${p.eco}"/><circle class="g-hl2" cx="110" cy="110" r="90" pathLength="100" data-v="${p.eco}"/></svg>
        <div class="val"><small>έως και</small><b><span class="run">${p.eco}</span>%</b></div>
        <div class="meta"><img class="wm" src="${img(p.wm)}" alt="${p.name}"><img class="pr" src="${pimg(p.hero[0])}" alt=""></div>
        <div class="fn">${p.foot}</div>
      </div>`; }).join('')}</div>
    <p class="foot rise" style="--d:1s">${C.TECH.foot}</p>`,
    enter(el) { $$('.donut', el).forEach((d, i) => $$('[data-v]', d).forEach(c => { const L = 100; c.style.transition = 'none'; c.style.strokeDasharray = L; c.style.strokeDashoffset = L; c.getBoundingClientRect(); c.style.transition = `stroke-dashoffset 1.6s cubic-bezier(.2,.8,.2,1) ${.4 + i * .15}s`; c.style.strokeDashoffset = L * (1 - c.dataset.v / 100); })); }
  });

  /* ---- 05 TIPS ---- */
  add({ id: 'tips', sec: 'tech', title: 'Έξυπνες λύσεις · TIPS', thumb: img('t-inverter'), cls: 's-tips', html: `
    <div class="left">
      <span class="kicker rise">TIPS</span>
      ${burst(C.TIPS.title, 'h-thin', .1)}
      <p class="lead rise" style="--d:.4s">${C.TIPS.lead}</p>
    <div class="tipsart rise" style="--d:.7s" aria-hidden="true">
      <div class="tipsword"><span>TIPS</span><span>TIPS</span><span>TIPS</span><span>TIPS</span></div>
      <svg class="bulb" viewBox="0 0 240 360">
        <defs>
          <radialGradient id="bGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffd978" stop-opacity=".75"/><stop offset=".35" stop-color="#ffb43a" stop-opacity=".32"/><stop offset=".7" stop-color="#ff9500" stop-opacity=".08"/><stop offset="1" stop-color="#ff9500" stop-opacity="0"/></radialGradient>
          <radialGradient id="bGlass" cx="46%" cy="58%" r="58%"><stop offset="0" stop-color="#fff3c8" stop-opacity=".7"/><stop offset=".32" stop-color="#ffc452" stop-opacity=".45"/><stop offset=".66" stop-color="#d9832a" stop-opacity=".12"/><stop offset=".9" stop-color="#ffffff" stop-opacity=".03"/><stop offset="1" stop-color="#ffffff" stop-opacity=".14"/></radialGradient>
          <radialGradient id="bHot" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fffdf2" stop-opacity=".95"/><stop offset=".3" stop-color="#ffe9a6" stop-opacity=".6"/><stop offset="1" stop-color="#ffb640" stop-opacity="0"/></radialGradient>
          <linearGradient id="bRim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".12" stop-color="#fff" stop-opacity=".06"/><stop offset=".85" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#fff" stop-opacity=".4"/></linearGradient>
          <linearGradient id="bMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#15171b"/><stop offset=".12" stop-color="#4d535d"/><stop offset=".3" stop-color="#e3e7ec"/><stop offset=".44" stop-color="#9aa1ab"/><stop offset=".62" stop-color="#363b43"/><stop offset=".84" stop-color="#858c97"/><stop offset="1" stop-color="#101216"/></linearGradient>
          <linearGradient id="bMetalD" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0b0e"/><stop offset=".3" stop-color="#454a53"/><stop offset=".5" stop-color="#1e2126"/><stop offset=".78" stop-color="#3a3f47"/><stop offset="1" stop-color="#08090b"/></linearGradient>
          <filter id="bBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter>
          <filter id="bBlur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
          <filter id="bFil" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6" result="g"/><feColorMatrix in="g" values="1 0 0 0 .2  0 1 0 0 .05  0 0 1 0 -.3  0 0 0 1.6 0" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <clipPath id="bClip"><path d="M120 18c-56 0-98 42-98 97 0 36 17 61 36 82 13 15 22 28 24 45h76c2-17 11-30 24-45 19-21 36-46 36-82 0-55-42-97-98-97z"/></clipPath>
        </defs>
        <g class="glow"><circle cx="120" cy="118" r="118" fill="url(#bGlow)"/></g>
        <!-- γυάλινο σώμα -->
        <path class="glass" d="M120 18c-56 0-98 42-98 97 0 36 17 61 36 82 13 15 22 28 24 45h76c2-17 11-30 24-45 19-21 36-46 36-82 0-55-42-97-98-97z" fill="url(#bGlass)" stroke="rgba(255,255,255,.42)" stroke-width="1.4"/>
        <g clip-path="url(#bClip)">
          <rect x="20" y="10" width="200" height="240" fill="url(#bRim)"/>
          <ellipse class="hot" cx="120" cy="140" rx="62" ry="70" fill="url(#bHot)" filter="url(#bBlur)"/>
          <!-- στέλεχος γυαλιού & στηρίγματα -->
          <path d="M104 242c0-30 6-52 16-70 10 18 16 40 16 70z" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.28)" stroke-width="1"/>
          <path d="M112 236V168M128 236V168" stroke="#cfd3d8" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>
          <path d="M112 168c-14-10-22-24-22-36M128 168c14-10 22-24 22-36" stroke="#b9bec5" stroke-width="1.3" fill="none" opacity=".75"/>
          <!-- νήμα βολφραμίου -->
          <path class="fil" d="M90 132c3-7 6-7 9 0s6 7 9 0 6-7 9 0 6 7 9 0 6-7 9 0 6 7 9 0 6-7 9 0" fill="none" stroke="#fff4cf" stroke-width="2.4" stroke-linecap="round" filter="url(#bFil)"/>
          <path d="M90 132c3-7 6-7 9 0s6 7 9 0 6-7 9 0 6 7 9 0 6-7 9 0 6 7 9 0 6-7 9 0" fill="none" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".9"/>
        </g>
        <!-- αντανακλάσεις -->
        <path d="M58 92c6-30 30-54 62-62" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".5" filter="url(#bBlur2)"/>
        <path d="M58 92c6-30 30-54 62-62" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".85"/>
        <ellipse cx="176" cy="70" rx="9" ry="5" fill="#fff" opacity=".5" transform="rotate(38 176 70)"/>
        <path d="M190 150c4 20-2 40-14 56" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".28"/>
        <!-- βάση -->
        <rect x="80" y="242" width="80" height="14" rx="4" fill="url(#bMetalD)"/>
        <rect x="76" y="256" width="88" height="20" rx="10" fill="url(#bMetal)"/>
        <rect x="79" y="280" width="82" height="20" rx="10" fill="url(#bMetal)"/>
        <rect x="82" y="304" width="76" height="20" rx="10" fill="url(#bMetal)"/>
        <path d="M80 259h80M83 283h74M86 307h68" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M78 274h84M81 298h78M84 322h72" stroke="#000" stroke-opacity=".5" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M92 326h56c0 20-12 30-28 30s-28-10-28-30z" fill="url(#bMetalD)"/>
        <ellipse cx="112" cy="337" rx="7" ry="3.5" fill="#fff" opacity=".16"/>
      </svg>
    </div>
    </div>
    <div class="tiles" data-fit="min">${C.TIPS.tiles.map((t, i) => { const [a, b] = t[0].split(' | '); return tile(i + 1, b, `<h4>${b}</h4><div class="scroll" data-scroll><p>${t[1]}</p></div>`, i); }).join('')}</div>`
  });

  /* ---- 06 RANGE OVERVIEW ---- */
  const sKeys = ['premium', 'power', 'essential', 'air'];
  const rangeCard = (m, i) => {
    const p = P[m];
    const kv = p.kind === 'purifier'
      ? `<div class="kv">CADR <b class="run">${p.stats[0][1]}</b> m³/h</div>`
      : `<div class="kv"><b>${p.caps.map(c => c[0]).join(' · ')}</b> έως <b class="run">${p.spec.areaMax}</b>m²</div>`;
    return `<div class="mcard" data-go="p-${m}" style="--i:${i}">
      <div class="wmw">${p.wm ? `<img class="wm" src="${img(p.wm)}" alt="${p.name}">` : `<div class="nm">${p.name}</div>`}${p.isNew ? '<span class="new">Νέο</span>' : ''}</div>
      <div class="im"><img class="pr" src="${pimg(p.hero[0])}" alt="${p.name}"></div>
      ${kv}<div class="pz">${p.spec.price}</div></div>`;
  };
  let ci = 0;
  add({ id: 'range', sec: 'series', title: 'Όλη η σειρά', thumb: pimg('zora'), cls: 's-range', html: `
    <svg class="flows" data-flows="range"></svg>
    <div class="hd"><span class="kicker rise">Προϊοντικά Series</span>${burst(['Αφυγραντήρες <b>&</b> Καθαριστές Αέρα'], 'h-thin', .15, 'font-size:44px;margin-top:10px')}</div>
    <div class="cols">${sKeys.map(s => `<div class="col ${s}" data-col="${s}"><h3 data-go="p-${C.SERIES[s].models[0]}">${C.SERIES[s].name}<span>${C.SERIES[s].sub}</span></h3>
      <div class="cards">${C.SERIES[s].models.map(m => rangeCard(m, ci++)).join('')}</div></div>`).join('')}</div>`
  });

  /* ---- 07 CHART ---- */
  const DEH = C.CMP_MODELS;
  const METRICS = {
    cap:   { lab: 'Ικανότητα Αφύγρανσης (Λίτρα/24 Ώρες)', v: p => p.spec.capMax, t: p => p.spec.cap, u: 'L' },
    area:  { lab: 'Κάλυψη Χώρου έως (m²)', v: p => p.spec.areaMax, t: p => p.spec.areaMax, u: 'm²' },
    price: { lab: 'Προτεινόμενη μη δεσμευτική Τιμή Λιανικής', v: p => p.spec.priceMin, t: p => p.spec.price.replace(/€/g, ''), u: '€' }
  };
  add({ id: 'chart', sec: 'series', title: 'Ικανότητα · Κάλυψη · Τιμή', thumb: pimg('wifipower'), cls: 's-chart', html: `
    <div class="hd"><span class="kicker rise">Αφυγραντήρες 2026</span><div class="h-thin rise" data-metric-title style="font-size:40px;margin-top:10px">${METRICS.cap.lab}</div></div>
    <div class="tabs rise">${Object.entries(METRICS).map(([k, m], i) => `<button data-metric="${k}" style="--i:${i}" class="${i ? '' : 'on'}">${m.lab.split(' (')[0].replace('Προτεινόμενη μη δεσμευτική ', '')}</button>`).join('')}</div>
    <div class="chart glass"><div class="grid"></div><div class="bars"></div></div>`,
    enter(el) { drawChart(el, el._metric || 'cap'); },
    init(el) {
      $$('[data-metric]', el).forEach(b => b.addEventListener('click', () => { $$('[data-metric]', el).forEach(x => x.classList.toggle('on', x === b)); el._metric = b.dataset.metric; drawChart(el, b.dataset.metric); }));
    }
  });

  function drawChart(el, key) {
    const M = METRICS[key];
    el.dataset.metric = key;              // χρώμα ανά διάγραμμα (CSS)
    $('[data-metric-title]', el).textContent = M.lab;
    const vals = DEH.map(m => M.v(P[m]));
    const max = Math.max(...vals);
    const step = key === 'price' ? 100 : key === 'area' ? 50 : 10;
    const top = Math.ceil(max * 1.08 / step) * step;
    const grid = $('.grid', el);
    grid.innerHTML = Array.from({ length: top / step + 1 }, (_, i) => `<i style="bottom:${i * step / top * 100}%"><span>${i * step}</span></i>`).join('');
    const bars = $('.bars', el);
    bars.innerHTML = DEH.map((m, i) => { const p = P[m], v = M.v(p);
      return `<div class="bar" data-go="p-${m}" style="--i:${i};--h:${v / top * 100}%" title="${p.name}">
        <div class="b"><i class="cap"></i></div><div class="v"><span class="run">${M.t(p)}</span><small> ${M.u}</small></div>
        <div class="lbl"><img src="${pimg(p.hero[0])}" alt=""><span>${p.name}</span></div></div>`; }).join('') +
      [['Premium Series', 0, 3], ['Power Series', 3, 7], ['Essential Series', 7, 10]].map(g => `<div class="grp" style="left:${g[1] / 10 * 100}%;width:calc(${(g[2] - g[1]) / 10 * 100}% - 14px)">${g[0]}</div>`).join('');
    requestAnimationFrame(() => { $$('.bar', bars).forEach(b => b.classList.add('up')); runAll(bars, 900, 400); });
  }

  /* ---- PRODUCT SLIDES ---- */
  const DEH_ORDER = ['sera', 'melody', 'stardust', 'comfort', 'atmosphere', 'zora', 'wifipower', 'iria', 'alva', 'risepro'];
  const uspHTML = (p) => p.usps.map((u, i) => `<div class="usp" data-usp="${p.id}:${i}"><div class="ic pulse" style="--i:${i}"><img class="icm" src="${u.ico.replace('.png', '-m.png')}" alt=""><img class="icr" src="${u.ico.replace('.png', '-r.png')}" alt=""></div><span>${u.label}</span></div>`).join('');
  const heroHTML = (p) => `<div class="hero ${p.hero.length > 1 ? 'two' : ''}"><div class="glow"></div><div class="ring"></div>
      ${p.hero.map((h, i) => `<img class="zoomable ${(p.fade || []).includes(i) ? 'fade' : ''}" data-gal="${p.id}" data-gi="${i}" src="${pimg(h)}" alt="${p.name}">`).join('')}<div class="scanl"></div></div>
      <div class="thumbs">${p.gallery.map((g, i) => `<div class="thumb" data-gal="${p.id}" data-gi="${p.hero.length + i}" style="--i:${i}"><img src="${pimg(g)}" alt=""><span class="zi">${zoomIco}</span></div>`).join('')}</div>`;
  const pctRun = t => t.replace(/(\d+)%/g, '<span class="run">$1</span>%');

  function prodSlide(p) {
    const s = C.SERIES[p.series];
    const nrows = p.table.rows.length;
    const head = burst(p.head, 'pt', .25);
    let mid;
    if (p.kind === 'purifier') {
      mid = `<div class="techbox glass filterbox rise" style="--d:.35s"><img src="${pimg(p.filter.img)}" alt=""><div class="tt"><b>${p.filter.title}</b>${p.filter.text}</div></div>
        <div class="usprow rise" style="--d:.45s">${p.stats.map(st => `<div class="stat"><span>${st[0]}</span><b><span class="run">${st[1]}</span><small>${st[2]}</small></b></div>`).join('')}${uspHTML(p)}</div>`;
    } else {
      mid = `<p class="desc rise" style="--d:.3s">${p.desc}</p>
        <div class="techbox glass rise" style="--d:.4s"><img src="${img(p.tech.logo)}" alt=""><div class="tt">${p.tech.title ? `<b>${p.tech.title}</b>` : ''}${pctRun(p.tech.text)}</div></div>
        <div class="usprow rise" style="--d:.5s">${p.caps.map(c => `<div class="capb"><span>${c[0]} έως</span><b><span class="run">${c[1]}</span>m<sup>2</sup></b></div>`).join('')}${uspHTML(p)}</div>`;
    }
    return {
      id: 'p-' + p.id, sec: 'series', title: p.name, thumb: pimg(p.hero[0]), wm: p.wm, cls: `s-prod rows${nrows} ${p.kind === 'purifier' ? 'pur' : ''}`, prod: p.id,
      html: `
      <div class="l">
        <div class="rise"><span class="pill"><b>${s.name}</b>${s.sub ? `<span>${s.sub}</span>` : ''}</span></div>
        <div class="wmrow rise" style="--d:.1s">${p.wm ? `<img src="${img(p.wm)}" alt="${p.name}">` : `<span class="ph">${p.name}</span>`}${p.isNew ? '<span class="new">Νέο</span>' : ''}</div>
        ${head}
        ${mid}
      </div>
      <div class="r">${heroHTML(p)}</div>
      <div class="tblwrap glass rise" style="--d:.6s"><div class="tb-h"><span class="kicker">${p.kind === 'purifier' ? 'Καθαριστές Αέρα' : 'Μοντέλα'}</span><button class="zbtn" data-ztable>${zoomIco}Μεγέθυνση πίνακα</button></div>${specTable(p.table)}</div>
      ${p.foot ? `<p class="foot">${p.foot}</p>` : ''}`,
      enter(el) { runAll($('.tblwrap', el), 700, 700); }
    };
  }
  DEH_ORDER.forEach(m => add(prodSlide(P[m])));

  /* ---- WARRANTY ---- */
  add({ id: 'warranty', sec: 'series', title: '10 & 5 Χρόνια Εγγύηση', thumb: img('warranty-card'), cls: 's-war', html: `
    <div class="t"><h2 class="rise"><span class="run">10</span> ΧΡΟΝΙΑ ΕΓΓΥΗΣΗ</h2>${burst([C.WARRANTY.sub], 'h3', .4, 'font-size:34px;font-weight:400;letter-spacing:.1em;margin-top:22px')}</div>
    <div class="wshadow"></div>
    <div class="wcard" tabindex="0"><div class="float"><div class="wplane"><div class="wflip"><div class="in">
      ${Array.from({length: 11}, (_, k) => `<i class="wedge${k === 0 ? ' d' : k === 10 ? ' s' : ''}" style="--z:${k + 1}"></i>`).join('')}<div class="face front"><img src="${img('warranty-flat')}" alt="10 χρόνια εγγύηση στον συμπιεστή & 5 χρόνια εγγύηση στη συσκευή"></div>
      <div class="face back"><div class="wtxt">${C.WARRANTY.text.map(t => `<p>${t}</p>`).join('')}</div></div>
    </div></div></div></div></div>`
  });

  /* ---- AIR PURIFIERS intro ---- */
  add({ id: 'air', sec: 'series', title: 'Καθαριστές Αέρα', thumb: img('ph-air.jpg'), cls: 's-air', html: `
    <div class="photo"><img src="${img('ph-air.jpg')}" alt=""></div>
    ${burst(C.AIR.title, 'h-thin', .2)}
    <div class="right">
      <span class="kicker rise">Καθαριστές Αέρα</span>
      <div style="height:22px"></div>
      ${C.AIR.text.map((t, i) => `<p class="rise" style="--d:${.2 + i * .15}s">${t}</p>`).join('')}
      <div class="b3 rise" style="--d:.5s"><div class="plq"><img src="${img('badge-3y')}" alt="3 χρόνια εγγύηση"></div></div>
      <div class="go rise" style="--d:.6s"><button class="btn" data-go="p-qlt700">QLT-700 ${arrowIco}</button><button class="btn" data-go="p-qlt500">QLT-500 ${arrowIco}</button></div>
    </div>
    <button class="zbtn phz" data-photo="${img('ph-air.jpg')}" data-cap="${C.AIR.title.join(' ')}" style="position:absolute;left:700px;bottom:26px;z-index:4;background:rgba(10,13,17,.55)">${zoomIco}Μεγέθυνση</button>`
  });
  add(prodSlide(P.qlt700));
  add(prodSlide(P.qlt500));

  /* ---- COMPARE ---- */
  add({ id: 'compare', sec: 'compare', title: 'Σύγκριση μοντέλων', thumb: img('i-sd-smart'), cls: 's-cmp', html: `
    <div class="hd">
      <div><span class="kicker rise">Σύγκριση μοντέλων</span>${burst(['Έξυπνες λύσεις για περισσότερη άνεση και ποιότητα'], 'h2', .1, 'font-size:34px;font-weight:200;margin-top:6px')}</div>
      <div class="ctr rise"><button class="tgl" data-diff><i></i>Μόνο διαφορές</button><button class="sbtn" data-all>Όλα τα μοντέλα</button><button class="sbtn" data-reset>Επαναφορά</button></div>
    </div>
    <div class="picker rise" style="--d:.2s">${DEH.map(m => `<button class="pick" data-pick="${m}"><img src="${pimg(P[m].hero[0])}" alt=""><span>${P[m].name}</span></button>`).join('')}</div>
    <div class="cmpbox glass rise" style="--d:.35s"><div class="cmpscroll" data-scroll></div></div>`,
    init(el) { initCompare(el); },
    enter(el) { el._cmp.render(true); }
  });

  /* ---- SERVICES ---- */
  const svc = C.SERVICES;
  const svcBack = (c) => `
    ${c.logo ? `<img class="bl" src="${img(c.logo)}" alt="" style="background:#fff;border-radius:8px;padding:3px 7px;height:32px">` : ''}
    <h4>${c.sub}</h4>
    <div class="scroll" data-scroll>${c.text.map(t => `<p>${t}</p>`).join('')}${c.mail ? `<p class="mail">${c.mail[0]} <a href="mailto:${c.mail[1]}">${c.mail[1]}</a></p>` : ''}</div>
    ${c.qr ? `<div class="acts"><img class="qr" data-qr="${img(c.qr)}" data-qrcap="${c.front ? c.front[0] : c.title}" data-qrurl="${c.url || ''}" src="${img(c.qr)}" alt="QR" title="Μεγέθυνση QR">${c.locator ? `<button data-locator>${svc.spCta}</button>` : `<a href="${c.url}" target="_blank" rel="noopener">Μάθετε περισσότερα ↗</a>`}</div>` : ''}`;
  add({ id: 'services', sec: 'services', title: 'Λύσεις και υπηρεσίες', thumb: img('logo-servicepoint'), cls: 's-svc', html: `
    <svg class="flows" data-flows="svc"></svg>
    ${burst(svc.title, 'h-thin', .1)}
    <p class="lead rise" style="--d:.4s">${svc.lead}</p>
    <div class="spbox glass rise" style="--d:.3s">
      <div class="n run">28</div>
      <div class="t"><img src="${img('logo-servicepoint')}" alt="Inventor service point"><p><b>Εξουσιοδοτημένα Service Points</b><br>σε όλη την Ελλάδα, η υποστήριξη της Inventor είναι πάντα κοντά σου.</p>
      <button class="btn red" data-locator style="align-self:flex-start">Βρείτε το κοντινότερο Service Point ${arrowIco}</button></div>
    </div>
    <div class="tiles" data-fit="each">${svc.cards.map((c, i) => tile(i + 1, `<span class="ft">${c.front[0]}</span><span class="fs">${c.front[1]}</span>`, svcBack(c), i)).join('')}</div>`
  });

  /* ---- END ---- */
  add({ id: 'contact', sec: 'services', title: 'Επικοινωνία', thumb: img('logo-inventor-tagline-w'), cls: 's-end', html: `
    <div class="arc fadein"></div>
    <img class="logo rise" src="${img('logo-inventor-tagline-w')}" alt="Inventor · We invent. You live.">
    <div class="addr rise" style="--d:.3s"><b>Inventor A.G. A.E.</b><br>${C.CONTACT.address}<br>${C.CONTACT.phones} | <a href="https://www.inventor.ac" target="_blank" rel="noopener">${C.CONTACT.web}</a></div>
    <div class="go rise" style="--d:.5s"><button class="btn red" data-go="cover">Στην αρχή ${arrowIco}</button><button class="btn" data-index>Ευρετήριο</button></div>
    <p class="legal rise" style="--d:.7s">${C.CONTACT.legal.join('<br>')}</p>`
  });

  /* ------------------------------------------------------------------
     Build DOM
  ------------------------------------------------------------------ */
  const deck = $('#deck');
  deck.innerHTML = SL.map((s, i) => `<section class="slide ${s.cls}" id="${s.id}" data-i="${i}" aria-label="${s.title}"><div class="stage">${s.html}</div></section>`).join('');
  SL.forEach((s, i) => { s.el = deck.children[i]; s.init && s.init(s.el); });

  /* Tile backs: one font size per slide, the largest that fits every tile without scrolling */
  function fitTiles() {
    SL.forEach(s => {
      const scr = $$('.tile .back .scroll', s.el); if (!scr.length) return;
      if ($('[data-fit="min"]', s.el)) {   // το μεγαλύτερο μέγεθος που χωράει, ίδιο σε όλα τα πλακίδια
        let mn = 18;
        scr.forEach(x => { const t = x.closest('.tile'); let px = 18; for (; px >= 9; px -= 0.25) { t.style.setProperty('--tfs', px + 'px'); if (x.scrollHeight <= x.clientHeight + 1) break; } mn = Math.min(mn, px); });
        scr.forEach(x => x.closest('.tile').style.setProperty('--tfs', mn + 'px'));
        return;
      }
      if ($('[data-fit="each"]', s.el)) {
        scr.forEach(x => { const t = x.closest('.tile'); for (let px = 18; px >= 9; px -= 0.25) { t.style.setProperty('--tfs', px + 'px'); if (x.scrollHeight <= x.clientHeight + 1) break; } });
        return;
      }
      for (let px = 15; px >= 9; px -= 0.25) {
        s.el.style.setProperty('--tfs', px + 'px');
        if (scr.every(x => x.scrollHeight <= x.clientHeight + 1)) break;
      }
    });
  }
  // TIPS: μπροστινοί τίτλοι διπλάσιοι (32px), με αυτόματη μικρή σμίκρυνση όπου δεν χωρούν
  function fitFronts() {
    $$('.s-tips .tile').forEach(t => { const f = $('.front', t); for (let px = 21; px >= 14; px -= 0.5) { t.style.setProperty('--ffs', px + 'px'); if (f.scrollHeight <= f.clientHeight + 1) break; } });
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(() => { fitTiles(); fitFronts(); }, 50));

  // Top nav
  $('#sections').innerHTML = SECTIONS.map(s => `<button data-sec="${s.id}"><b>${s.n}</b><span>${s.short}</span></button>`).join('');
  // Rail
  let lastSec = '';
  $('#rail').innerHTML = SL.map((s, i) => { const c = s.sec !== lastSec && i ? 'sec' : ''; lastSec = s.sec; return `<button class="${c}" data-goi="${i}"><span>${s.title}</span></button>`; }).join('');
  // Index
  $('#indexGrid').innerHTML = SECTIONS.map(sec => `<div class="ix"><h3><b>${sec.n}</b>${sec.name}</h3>${SL.map((s, i) => s.sec === sec.id ? `<button data-goi="${i}"><i>${String(i + 1).padStart(2, '0')}</i><img src="${s.thumb}" alt="">${s.title}</button>` : '').join('')}</div>`).join('');

  /* ------------------------------------------------------------------
     Scale stage
  ------------------------------------------------------------------ */
  function fit() {
    const k = Math.min(innerWidth / 1600, innerHeight / 900);
    document.documentElement.style.setProperty('--k', k.toFixed(4));
  }
  addEventListener('resize', fit); fit();

  /* ------------------------------------------------------------------
     Running numbers
  ------------------------------------------------------------------ */
  const NUM = /\d+(?:\.\d+)?/g;
  function runEl(el, dur = 1200, delay = 0) {
    if (!el.dataset.orig) el.dataset.orig = el.innerHTML;
    const orig = el.dataset.orig;
    if (/</.test(orig)) { // has markup – animate text nodes only
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); const nodes = []; let n; el.innerHTML = orig;
      while ((n = w.nextNode())) if (/\d/.test(n.nodeValue)) nodes.push([n, n.nodeValue]);
      animate(dur, delay, t => nodes.forEach(([nd, s]) => nd.nodeValue = fmt(s, t)));
      return;
    }
    animate(dur, delay, t => el.textContent = fmt(orig, t));
  }
  function fmt(s, t) {
    return s.replace(NUM, m => { const dec = (m.split('.')[1] || '').length; const v = parseFloat(m) * t; return dec ? v.toFixed(dec) : String(Math.round(v)); });
  }
  function animate(dur, delay, fn) {
    fn(0); const t0 = performance.now() + delay;
    const step = now => { let t = Math.min(1, Math.max(0, (now - t0) / dur)); t = 1 - Math.pow(1 - t, 3); fn(t); if (now - t0 < dur) requestAnimationFrame(step); else fn(1); };
    requestAnimationFrame(step);
  }
  function runAll(root, dur = 1300, delay = 300) {
    if (!root) return;
    $$('.run, td.rn', root).forEach((e, i) => runEl(e, dur, delay + (e.tagName === 'TD' ? (i % 9) * 25 : 0)));
  }

  /* ------------------------------------------------------------------
     Flows (red comets with fading trail)
  ------------------------------------------------------------------ */
  const NS = 'http://www.w3.org/2000/svg';
  const LAYERS = [[7, 1, 3.4], [26, .55, 2.8], [60, .3, 2.2], [110, .16, 1.8], [180, .07, 1.4]];
  function relPos(el, stage) {
    let x = 0, y = 0, e = el;
    while (e && e !== stage) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function buildFlows(slide) {
    const svg = $('svg.flows', slide.el); if (!svg) return;
    const stage = $('.stage', slide.el); const kind = svg.dataset.flows; const paths = [];
    svg.setAttribute('viewBox', '0 0 1600 900');
    if (kind === 'range') {
      $$('.col', stage).forEach(col => {
        const h = relPos($('h3', col), stage); const hx = h.x + h.w / 2;
        const ty = 188; paths.push(`M70 ${ty} H${hx - 16} Q${hx} ${ty} ${hx} ${ty + 16} V${h.y}`);
        $$('.mcard', col).forEach(c => { const r = relPos(c, stage); const cx = r.x + r.w / 2; paths.push(`M${hx} ${h.y + h.h} V${h.y + h.h + 10} Q${hx} ${r.y - 8} ${cx} ${r.y}`); });
      });
    } else if (kind === 'svc') {
      const tt = relPos($('.tile', stage), stage).y, ty = tt - 20;
      $$('.tile', stage).forEach((t, i) => { const r = relPos(t, stage); const cx = r.x + r.w / 2; paths.push(`M64 ${ty} H${cx - 12} Q${cx} ${ty} ${cx} ${ty + 12} V${r.y}`); });
      const sp = relPos($('.spbox', stage), stage); const sx = sp.x + sp.w / 2; paths.push(`M64 ${ty} H${sx - 12} Q${sx} ${ty} ${sx} ${ty - 12} V${sp.y + sp.h}`);
    } else if (kind === 'eco') {
      const lg = relPos($('.ecologo', stage), stage); const sx = lg.x + lg.w + 14, sy = lg.y + lg.h / 2;
      $$('.donut', stage).forEach((d, i) => { const r = relPos(d, stage); const tx = r.x, ty = r.y + r.h / 2; const vx = 736 + (i % 2) * 14; paths.push(`M${sx} ${sy} H${vx - 14} Q${vx} ${sy} ${vx} ${sy + 14} V${ty - 14} Q${vx} ${ty} ${vx + 14} ${ty} H${tx}`); });
    }
    svg.innerHTML = '';
    slide.flows = paths.map((d, i) => {
      const base = document.createElementNS(NS, 'path'); base.setAttribute('d', d); base.setAttribute('class', 'base'); svg.appendChild(base);
      const L = base.getTotalLength();
      const layers = LAYERS.map(([len, op, w]) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'comet'); p.style.opacity = op; p.style.strokeWidth = w; p.style.strokeDasharray = `${len} ${L + 400}`; svg.appendChild(p); return [p, len]; });
      const head = document.createElementNS(NS, 'circle'); head.setAttribute('r', 3.2); head.setAttribute('fill', '#fff'); head.style.filter = 'drop-shadow(0 0 6px #ff3d46) drop-shadow(0 0 12px #e3141e)'; svg.appendChild(head);
      return { base, L, layers, head, off: i * 0.37 };
    });
  }
  let flowRAF = 0;
  function runFlows(slide) {
    cancelAnimationFrame(flowRAF);
    if (!slide.flows) return;
    const t0 = performance.now();
    const tick = now => {
      const t = (now - t0) / 1000;
      slide.flows.forEach(f => {
        const period = 2.4 + f.L / 900; const u = ((t / period) + f.off) % 1; const pos = u * (f.L + 180);
        f.layers.forEach(([p, len]) => { p.style.strokeDashoffset = len - pos; });
        const hp = Math.min(pos, f.L); const pt = f.base.getPointAtLength(hp);
        f.head.setAttribute('cx', pt.x); f.head.setAttribute('cy', pt.y); f.head.style.opacity = pos > f.L ? Math.max(0, 1 - (pos - f.L) / 60) : 1;
      });
      flowRAF = requestAnimationFrame(tick);
    };
    flowRAF = requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------
     Compare engine
  ------------------------------------------------------------------ */
  function initCompare(el) {
    const DEF = ['sera', 'stardust', 'zora', 'iria'];
    const st = { sel: DEF.slice(), diff: false, added: null };
    const box = $('.cmpscroll', el);
    const SPEC = [
      ['Ικανότητα Αφύγρανσης (Λίτρα/24 Ώρες)', 'cap', 'capMax'],
      ['Κάλυψη Χώρου έως (m²)', 'area', 'areaMax'],
      ['Κατανάλωση (W) <small>(26.7°C, 60%RH)</small>', 'w'],
      ['Στάθμη Θορύβου [dB(A)]', 'db', 'dbMax'],
      ['Δοχείο Νερού (Λίτρα)', 'tank'],
      ['Βάρος', 'kg'],
      ['Προτεινόμενη μη δεσμευτική Τιμή Λιανικής', 'price']
    ];
    const maxOf = k => Math.max(...DEH.map(m => P[m].spec[k] || 0));
    function render(all) {
      const cols = DEH.filter(m => st.sel.includes(m));
      let r = 0;
      const pd = (ci, ri) => all || cols[ci] === st.added ? `style="--pd:${(ri * 16 + ci * 35)}ms"` : '';
      const pinCls = (m) => all || m === st.added ? 'pin pop' : 'pin" style="transform:scale(1)';
      const head = `<thead><tr><th>Μοντέλο</th>${cols.map((m, ci) => `<th data-c="${ci}"><div class="mh"><button class="rm" data-rm="${m}" title="Αφαίρεση">×</button><img src="${pimg(P[m].hero[0])}" alt=""><b>${P[m].name}</b></div></th>`).join('')}</tr></thead>`;
      let body = `<tr class="grp"><td colspan="${cols.length + 1}">Τεχνικά στοιχεία</td></tr>`;
      SPEC.forEach(([lab, k, mk]) => {
        const vals = cols.map(m => String(P[m].spec[k]));
        const same = vals.every(v => v === vals[0]) && cols.length > 1;
        body += `<tr class="${st.diff && same ? 'same' : ''}"><td>${lab}</td>${cols.map((m, ci) => { const v = P[m].spec[k];
          const bar = mk ? `<i class="mb" data-w="${(P[m].spec[mk] / maxOf(mk) * 76).toFixed(1)}"></i>` : '';
          return `<td class="rel" data-c="${ci}"><span class="num run">${v}</span>${bar}</td>`; }).join('')}</tr>`;
        r++;
      });
      body += `<tr class="grp"><td colspan="${cols.length + 1}">Χαρακτηριστικά</td></tr>`;
      C.CMP_ROWS.forEach(([lab]) => {
        const vals = cols.map(m => String(C.cmpVal(m, lab)));
        const same = vals.every(v => v === vals[0]) && cols.length > 1;
        body += `<tr class="${st.diff && same ? 'same' : ''}"><td>${lab}</td>${cols.map((m, ci) => { const v = C.cmpVal(m, lab);
          if (v === 1) return `<td data-c="${ci}"><i class="${pinCls(m)}" ${pd(ci, r)}></i></td>`;
          if (v === 0) return `<td data-c="${ci}"><span class="dash">—</span></td>`;
          return `<td data-c="${ci}"><span class="txt">${v}</span></td>`; }).join('')}</tr>`;
        r++;
      });
      box.innerHTML = `<table class="cmp"><colgroup><col class="lab">${cols.map(() => '<col>').join('')}</colgroup>${head}<tbody>${body}</tbody></table>`;
      $$('.pick', el).forEach(b => b.classList.toggle('on', st.sel.includes(b.dataset.pick)));
      $('[data-diff]', el).classList.toggle('on', st.diff);
      requestAnimationFrame(() => {
        $$('.mb', box).forEach(b => b.style.width = b.dataset.w + '%');
        $$('td.rel', box).forEach(td => { const ci = +td.dataset.c; if (all || cols[ci] === st.added) runEl($('.run', td), 800, 150 + ci * 60); });
      });
      st.added = null;
    }
    el._cmp = { render };
    el.addEventListener('click', e => {
      const pk = e.target.closest('[data-pick]'); const rm = e.target.closest('[data-rm]');
      if (pk) { const m = pk.dataset.pick; if (st.sel.includes(m)) { if (st.sel.length > 1) st.sel = st.sel.filter(x => x !== m); } else { st.sel.push(m); st.added = m; } render(false); }
      else if (rm) { if (st.sel.length > 1) { st.sel = st.sel.filter(x => x !== rm.dataset.rm); render(false); } }
      else if (e.target.closest('[data-diff]')) { st.diff = !st.diff; render(false); }
      else if (e.target.closest('[data-all]')) { st.sel = DEH.slice(); render(true); }
      else if (e.target.closest('[data-reset]')) { st.sel = DEF.slice(); st.diff = false; render(true); }
    });
    box.addEventListener('mouseover', e => { const c = e.target.closest('[data-c]'); $$('.col-hl', box).forEach(x => x.classList.remove('col-hl')); if (c) $$(`td[data-c="${c.dataset.c}"]`, box).forEach(x => x.classList.add('col-hl')); });
    box.addEventListener('mouseleave', () => $$('.col-hl', box).forEach(x => x.classList.remove('col-hl')));
  }

  /* ------------------------------------------------------------------
     Navigation
  ------------------------------------------------------------------ */
  let cur = -1, busy = false;
  const hist = [];                       // ιστορικό πραγματικών μεταβάσεων (για το BACK)
  function go(i, instant, fromBack) {
    i = Math.max(0, Math.min(SL.length - 1, i));
    if (i === cur) return;
    if (cur >= 0 && !fromBack) { hist.push(cur); if (hist.length > 200) hist.shift(); }
    const prev = SL[cur];
    if (prev) { prev.el.classList.remove('is-active'); prev.el.classList.add('is-past'); setTimeout(() => prev.el.classList.remove('is-past'), 900); resetSlide(prev.el); $$('.tile.flip,.wcard.flip', prev.el).forEach(t => t.classList.remove('flip')); }
    cur = i; const s = SL[i];
    // restart CSS animations
    s.el.classList.remove('is-active'); void s.el.offsetWidth; s.el.classList.add('is-active');
    if (!instant) { const sw = $('#sweep'); sw.classList.remove('go'); void sw.offsetWidth; sw.classList.add('go'); }
    setTimeout(() => { runAll(s.el.querySelector('.stage'), 1400, 350); s.enter && s.enter(s.el); if (!s.flows) buildFlows(s); runFlows(s); }, 60);
    // UI
    $('#counter').textContent = String(i + 1).padStart(2, '0') + ' / ' + String(SL.length).padStart(2, '0');
    $('#progress i').style.width = ((i + 1) / SL.length * 100) + '%';
    $$('#sections button').forEach(b => b.classList.toggle('on', b.dataset.sec === s.sec));
    $$('#rail button').forEach((b, j) => b.classList.toggle('on', j === i));
    $$('#indexGrid button').forEach(b => b.classList.toggle('on', +b.dataset.goi === i));
    $('#pgUp').disabled = i === 0; $('#pgDn').disabled = i === SL.length - 1;
    history.replaceState(null, '', '#' + s.id);
    updBack();
    hideTip();
    busy = true; setTimeout(() => busy = false, 650);
  }
  function resetSlide(el) { $$('[data-orig]', el).forEach(e => e.innerHTML = e.dataset.orig); }
  const next = () => go(cur + 1), prev = () => go(cur - 1);
  const idOf = id => SL.findIndex(s => s.id === id);

  document.addEventListener('click', e => {
    const t = e.target;
    const g = t.closest('[data-go]'); if (g) { closeOv(); go(idOf(g.dataset.go)); return; }
    const gi = t.closest('[data-goi]'); if (gi) { closeOv(); go(+gi.dataset.goi); return; }
    const sc = t.closest('[data-sec]'); if (sc) { closeOv(); go(SL.findIndex(s => s.sec === sc.dataset.sec)); return; }
    if (t.closest('[data-next]')) { next(); return; }
    if (t.closest('[data-index]')) { openOv($('#indexOv')); return; }
    if (t.closest('[data-close]') || t.classList.contains('overlay')) { closeOv(); return; }
    const gal = t.closest('[data-gal]'); if (gal) { openGallery(gal.dataset.gal, +gal.dataset.gi); return; }
    const ph = t.closest('[data-photo]'); if (ph) { openPhoto(ph.dataset.photo, ph.dataset.cap); return; }
    const qr = t.closest('[data-qr]'); if (qr) { e.preventDefault(); openQR(qr.dataset.qr, qr.dataset.qrcap, qr.dataset.qrurl); return; }
    const zt = t.closest('[data-ztable]'); if (zt) { openTable(SL[cur]); return; }
    if (t.closest('[data-locator]')) { e.preventDefault(); openLocator(); return; }
    const tl = t.closest('.tile, .wcard'); if (tl && matchMedia('(hover:none)').matches) tl.classList.toggle('flip');
  });
  $('#pgUp').onclick = prev; $('#pgDn').onclick = next;
  // BACK: στο slide όπου ήμουν πριν (όχι απαραίτητα το προηγούμενο στη σειρά)
  function back() { while (hist.length && hist[hist.length - 1] === cur) hist.pop(); if (hist.length) go(hist.pop(), false, true); }
  function updBack() { const b = $('#btnBack'); if (!b) return; while (hist.length && hist[hist.length - 1] === cur) hist.pop(); const ok = hist.length > 0; b.classList.toggle('off', !ok);
    b.title = ok ? 'Πίσω στη σελίδα ' + String(hist[hist.length - 1] + 1).padStart(2, '0') + ' · ' + SL[hist[hist.length - 1]].title : 'Πίσω'; }
  $('#rail').insertAdjacentHTML('afterbegin', '<a id="btnBack" class="off" role="button" tabindex="0" aria-label="Πίσω στη σελίδα που ήμουν"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg><b>BACK</b></a>');
  $('#btnBack').onclick = back;
  $('#btnBack').onkeydown = e => { if (e.key === 'Enter') back(); };
  updBack();
  // PDF: λήψη τιμοκαταλόγου + καταγραφή στο log
  $('#btnPdf').addEventListener('click', () => { try { fetch('/api/view', { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ p: 'Inventor_Timokatalogos_Afygrantiron_2026', a: 'pdf' }) }).catch(() => {}); } catch (e) {} });
  $('#btnIndex').onclick = () => openOv($('#indexOv'));
  $('#btnFull').onclick = () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.(); };
  let playT = 0;
  $('#btnPlay').onclick = () => { document.body.classList.toggle('playing'); clearInterval(playT); if (document.body.classList.contains('playing')) playT = setInterval(() => { if (!document.querySelector('.overlay.open')) go(cur === SL.length - 1 ? 0 : cur + 1); }, 9000); };

  addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeOv(); return; }
    const ovOpen = document.querySelector('.overlay.open');
    if (ovOpen) { if (ovOpen.id === 'dlg' && dlgNav) { if (e.key === 'ArrowRight') dlgNav(1); if (e.key === 'ArrowLeft') dlgNav(-1); } return; }
    if (['PageDown', 'ArrowDown', 'ArrowRight', ' '].includes(e.key)) { e.preventDefault(); next(); }
    else if (['PageUp', 'ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') go(0); else if (e.key === 'End') go(SL.length - 1);
    else if (e.key === 'Backspace') { e.preventDefault(); back(); }
  });
  let wheelAcc = 0, wheelT = 0;
  addEventListener('wheel', e => {
    if (document.querySelector('.overlay.open')) return;
    const sc = e.target.closest('[data-scroll]');
    if (sc && sc.scrollHeight > sc.clientHeight + 2) { const atTop = sc.scrollTop <= 0, atBot = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2; if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBot)) return; }
    e.preventDefault();
    if (busy) return;
    wheelAcc += e.deltaY; clearTimeout(wheelT); wheelT = setTimeout(() => wheelAcc = 0, 200);
    if (wheelAcc > 60) { wheelAcc = 0; next(); } else if (wheelAcc < -60) { wheelAcc = 0; prev(); }
  }, { passive: false });
  let tx = 0, ty = 0;
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchend', e => {
    if (document.querySelector('.overlay.open') || e.target.closest('[data-scroll]')) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return;
    if (Math.abs(dy) > Math.abs(dx)) (dy < 0 ? next : prev)(); else (dx < 0 ? next : prev)();
  });

  /* ------------------------------------------------------------------
     Overlays / dialog
  ------------------------------------------------------------------ */
  let dlgNav = null;
  function openOv(ov) { ov.hidden = false; requestAnimationFrame(() => ov.classList.add('open')); hideTip(); }
  function closeOv() {
    $$('.overlay.open').forEach(ov => { ov.classList.remove('open'); setTimeout(() => { ov.hidden = true; if (ov.id === 'dlg') { $('.dlg-body', ov).innerHTML = ''; $('.dlg-box', ov).classList.remove('sm'); } }, 400); });
    dlgNav = null;
  }
  const dlg = $('#dlg');
  function dialog(title, bodyHTML, toolsHTML = '') {
    $('.dlg-title', dlg).innerHTML = title; $('.dlg-tools', dlg).innerHTML = toolsHTML; $('.dlg-body', dlg).innerHTML = bodyHTML;
    openOv(dlg); return $('.dlg-body', dlg);
  }
  function galleryList(pid) {
    const p = P[pid];
    return [...p.hero.map(h => ({ src: pimg(h), cut: true })), ...p.gallery.map(g => ({ src: pimg(g), cut: false }))].map(x => ({ ...x, cap: p.name }));
  }
  function openGallery(pid, idx) {
    const list = galleryList(pid); let i = idx;
    const body = dialog(`<span>${P[pid].name}</span><small>${seriesName(P[pid].series)}</small>`, `
      <div class="dlg-img"><img alt=""></div>
      <button class="dlg-nav p" aria-label="Προηγούμενη"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <button class="dlg-nav n" aria-label="Επόμενη"><svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
      <div class="dlg-strip">${list.map((x, j) => `<button data-j="${j}"><img src="${x.src}" alt=""></button>`).join('')}</div>`);
    const box = $('.dlg-img', body), im = $('img', box);
    const show = j => { i = (j + list.length) % list.length; box.classList.remove('zoomed'); im.style.transform = ''; im.style.opacity = 0; setTimeout(() => { im.src = list[i].src; im.classList.toggle('cut', list[i].cut); im.style.opacity = 1; }, 120); $$('.dlg-strip button', body).forEach((b, k) => b.classList.toggle('on', k === i)); };
    im.style.transition = 'opacity .25s, transform .5s cubic-bezier(.2,.8,.2,1)';
    dlgNav = d => show(i + d);
    $('.dlg-nav.p', body).onclick = () => show(i - 1); $('.dlg-nav.n', body).onclick = () => show(i + 1);
    $$('.dlg-strip button', body).forEach(b => b.onclick = () => show(+b.dataset.j));
    zoomPan(box, im);
    show(i);
  }
  function openQR(src, cap, url) {
    dlg.querySelector('.dlg-box').classList.add('sm');
    dialog(`<span>${cap || 'QR code'}</span>`, `<div class="qrz"><div class="qrframe"><img src="${src}" alt="QR"><i class="qrscan"></i></div>${url ? `<a class="btn red" href="${url}" target="_blank" rel="noopener">Μάθετε περισσότερα ↗</a>` : ''}</div>`);
  }
  function openPhoto(src, cap) {
    const body = dialog(`<span>${cap || ''}</span>`, `<div class="dlg-img"><img src="${src}" alt=""></div><div class="scanbar"></div>`);
    zoomPan($('.dlg-img', body), $('.dlg-img img', body));
  }
  function zoomPan(box, im) {
    box.onclick = e => { const z = box.classList.toggle('zoomed'); if (z) pan(e); else im.style.transform = ''; };
    const pan = e => { if (!box.classList.contains('zoomed')) return; const r = box.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; im.style.transform = `scale(2.2) translate(${-x * 45}%, ${-y * 45}%)`; };
    box.onmousemove = pan;
  }
  function openTable(s) {
    const p = P[s.prod]; if (!p) return;
    const body = dialog(`<span>${p.name}</span><small>${seriesName(p.series)} · Τιμοκατάλογος 2026</small>`, `<div class="dlg-tbl"><div style="width:100%">${specTable(p.table)}${p.foot ? `<p class="foot" style="margin-top:18px;font-size:13px">${p.foot}</p>` : ''}</div></div><div class="scanbar"></div>`);
    runAll(body, 800, 250);
  }
  function openLocator() {
    const SP = window.SERVICE_POINTS || [];
    const body = dialog(`<span>Εξουσιοδοτημένα Service Points</span><small>Η υποστήριξη που χρειάζεσαι, πάντα κοντά σου.</small>`,
      `<div class="loc">
         <aside class="loc-side">
           <div class="loc-search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg><input type="search" placeholder="Πόλη, περιοχή, Τ.Κ. ή επωνυμία" aria-label="Αναζήτηση"></div>
           <button class="btn red loc-geo" data-geo>◎ Η περιοχή μου</button>
           <div class="loc-count mono"></div>
           <div class="loc-list" data-scroll></div>
         </aside>
         <div class="loc-map"><div id="spMap"></div><div class="loc-off" hidden>Ο χάρτης χρειάζεται σύνδεση στο internet.</div></div>
       </div><div class="scanbar"></div>`,
      `<button class="zbtn" data-popup>inventoraircondition.gr ↗</button>`);
    const listEl = $('.loc-list', body), countEl = $('.loc-count', body), inp = $('input', body);
    const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
    const IDX = SP.map((p, i) => ({ i, n: p[0], la: p[1], ln: p[2], a: p[3], r: p[4], c: p[5], z: p[6], t: p[7], key: norm(p.join(' ')) }));
    let map = null, markers = [], me = null, meMarker = null;
    const telLinks = t => t ? t.split(/[\s/,-]+/).filter(x => x.replace(/\D/g, '').length >= 10).map(x => `<a href="tel:${x.replace(/\D/g, '')}">${x}</a>`).join(' · ') || t : '';
    const card = (p, d) => `<b>${p.n}</b><span>${p.a}${p.r && p.r !== p.c ? ', ' + p.r : ''}<br>${p.c} ${p.z}</span>${p.t ? `<em>☏ ${telLinks(p.t)}</em>` : ''}${d != null ? `<i class="km mono">${d < 10 ? d.toFixed(1) : Math.round(d)} km</i>` : ''}`;
    function render(items, withDist) {
      countEl.textContent = withDist ? `Τα πλησιέστερα Service Points` : `${items.length} Εξουσιοδοτημένα Service Points`;
      listEl.innerHTML = items.slice(0, 80).map(x => `<button class="loc-item" data-i="${x.p.i}">${card(x.p, withDist ? x.d : null)}</button>`).join('');
    }
    const dist = (a, b, c, d) => { const R = 6371, r = Math.PI / 180, x = (c - a) * r, y = (d - b) * r; const h = Math.sin(x / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(y / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
    function filter() {
      const q = norm(inp.value.trim());
      let items = IDX.filter(p => !q || p.key.includes(q)).map(p => ({ p, d: me ? dist(me[0], me[1], p.la, p.ln) : null }));
      if (me) items.sort((a, b) => a.d - b.d);
      render(items, !!me);
      if (map && q && items.length) map.flyToBounds(L.latLngBounds(items.slice(0, 40).map(x => [x.p.la, x.p.ln])).pad(.3), { maxZoom: 13, duration: .8 });
    }
    function focus(i) {
      const p = IDX[i]; $$('.loc-item', listEl).forEach(b => b.classList.toggle('on', +b.dataset.i === i));
      if (map) { map.flyTo([p.la, p.ln], 14, { duration: .9 }); markers[i].openPopup(); }
    }
    listEl.addEventListener('click', e => { const b = e.target.closest('.loc-item'); if (b && !e.target.closest('a')) focus(+b.dataset.i); });
    let tq = 0; inp.addEventListener('input', () => { clearTimeout(tq); tq = setTimeout(filter, 180); });
    $('[data-geo]', body).onclick = () => {
      if (!navigator.geolocation) return;
      countEl.textContent = 'Εντοπισμός θέσης…';
      navigator.geolocation.getCurrentPosition(pos => {
        me = [pos.coords.latitude, pos.coords.longitude]; inp.value = ''; filter();
        if (map) {
          if (meMarker) meMarker.remove();
          meMarker = L.marker(me, { icon: L.divIcon({ className: 'me-pin', html: '<i></i>', iconSize: [22, 22] }) }).addTo(map);
          const near = IDX.map(p => [p, dist(me[0], me[1], p.la, p.ln)]).sort((a, b) => a[1] - b[1]).slice(0, 6);
          map.flyToBounds(L.latLngBounds([me, ...near.map(n => [n[0].la, n[0].ln])]).pad(.25), { maxZoom: 14, duration: 1.1 });
        }
      }, () => { countEl.textContent = 'Δεν ήταν δυνατός ο εντοπισμός — χρησιμοποιήστε την αναζήτηση.'; }, { timeout: 9000, enableHighAccuracy: false });
    };
    const w = Math.min(1280, screen.availWidth - 80), h = Math.min(860, screen.availHeight - 80);
    $('[data-popup]', dlg).onclick = () => window.open(C.LOCATOR_URL, 'invLocator', `width=${w},height=${h},left=${(screen.availWidth - w) / 2},top=${(screen.availHeight - h) / 2}`);
    render(IDX.map(p => ({ p })), false);
    if (!window.L) { const o = $('.loc-off', body); if (o) o.hidden = false; return; }
    setTimeout(() => {
      map = L.map('spMap', { zoomControl: true, attributionControl: true, preferCanvas: true }).fitBounds([[34.8, 19.4], [41.75, 28.3]]);
      let ok = 0;
      const E = 'https://server.arcgisonline.com/ArcGIS/rest/services/';
      const lp = map.createPane('labels'); lp.style.zIndex = 350; lp.style.pointerEvents = 'none';
      const LY = {
        sat: [L.tileLayer(E + 'World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics' }),
              L.tileLayer(E + 'Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, pane: 'labels' })],
        map: [L.tileLayer(E + 'World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 18, attribution: 'Tiles &copy; Esri &mdash; HERE, Garmin, &copy; OpenStreetMap' })],
        dark: [L.tileLayer(E + 'Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, attribution: 'Tiles &copy; Esri' }),
               L.tileLayer(E + 'Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, pane: 'labels' })]
      };
      Object.values(LY).flat().forEach(l => l.on('tileload', () => ok++));
      const mapBox = $('.loc-map', body);
      const setLy = k => { Object.entries(LY).forEach(([n, ls]) => ls.forEach(l => n === k ? l.addTo(map) : l.remove())); mapBox.classList.toggle('sat', k === 'sat'); $$('.lyr button', mapBox).forEach(b => b.classList.toggle('on', b.dataset.ly === k)); };
      mapBox.insertAdjacentHTML('beforeend', '<div class="lyr"><button data-ly="sat">Δορυφόρος</button><button data-ly="map">Χάρτης</button><button data-ly="dark">Σκούρος</button></div>');
      $$('.lyr button', mapBox).forEach(b => b.onclick = e => { e.stopPropagation(); setLy(b.dataset.ly); });
      setLy('sat');
      setTimeout(() => { const o = $('.loc-off', body); if (!ok && o && o.isConnected) o.hidden = false; }, 7000);
      const rend = L.canvas({ padding: .5 });
      // radar: κόκκινοι κύκλοι που σβήνουν, όλοι μαζί, κάτω από τα σημεία
      map.createPane('radarPane'); map.getPane('radarPane').style.zIndex = 390; map.getPane('radarPane').style.pointerEvents = 'none';
      const radarIcon = L.divIcon({ className: 'sp-radar', html: '<i></i><i></i>', iconSize: [16, 16] });
      IDX.forEach(p => L.marker([p.la, p.ln], { icon: radarIcon, pane: 'radarPane', interactive: false, keyboard: false }).addTo(map));
      markers = IDX.map(p => L.circleMarker([p.la, p.ln], { renderer: rend, radius: 8, color: '#fff', weight: 2, fillColor: '#e3141e', fillOpacity: .95 })
        .bindPopup(`<div class="sp-pop">${card(p)}</div>`, { className: 'sp-popup', maxWidth: 300 }).addTo(map)
        .on('click', () => $$('.loc-item', listEl).forEach(b => b.classList.toggle('on', +b.dataset.i === p.i))));
    }, 380);
  }

  /* ------------------------------------------------------------------
     USP tooltips (delayed, catalog text only)
  ------------------------------------------------------------------ */
  const tip = $('#tip'); let tipT = 0, typeT = 0;
  function hideTip() { clearTimeout(tipT); clearInterval(typeT); tip.classList.remove('show'); tip._for = null; }
  document.addEventListener('mouseover', e => {
    const u = e.target.closest('[data-usp]');
    if (!u) { if (tip._for) hideTip(); return; }
    if (tip._for === u) return;
    hideTip(); tip._for = u;
    tipT = setTimeout(() => showTip(u), 420);
  });
  function showTip(u) {
    const [pid, k] = u.dataset.usp.split(':'); const p = P[pid]; const x = p.usps[+k];
    let kv = '';
    if (x.kv) kv += `<div class="kv"><span>${x.kv[0]}</span><b>${x.kv[1]}</b></div>`;
    (x.data || []).forEach(row => { const v = C.cmpVal(pid, row); if (v === null || v === 0) return; kv += `<div class="kv"><span>${row}</span><b>${v === 1 ? '<i class="pin"></i>' : v}</b></div>`; });
    tip.innerHTML = `<h5>${x.label}</h5>${x.text ? '<p></p>' : ''}${kv}`;
    const r = u.getBoundingClientRect();
    tip.style.left = '0px'; tip.style.top = '0px'; tip.classList.add('show');
    const tw = tip.offsetWidth; let th = tip.offsetHeight;
    if (x.text) { const pr = $('p', tip); pr.textContent = x.text; th = tip.offsetHeight; pr.innerHTML = '<span class="cursor"></span>'; }
    let left = Math.max(12, Math.min(innerWidth - tw - 12, r.left + r.width / 2 - tw / 2));
    let top = r.top - th - 14, below = false; if (top < 64) { top = r.bottom + 14; below = true; }
    tip.classList.toggle('below', below); tip.style.left = left + 'px'; tip.style.top = top + 'px';
    tip.style.setProperty('--ax', (r.left + r.width / 2 - left) + 'px');
    if (x.text) { const words = x.text.split(' '); let n = 0; const pr = $('p', tip);
      typeT = setInterval(() => { n += 2; pr.innerHTML = words.slice(0, n).join(' ') + (n < words.length ? '<span class="cursor"></span>' : ''); if (n >= words.length) clearInterval(typeT); }, 28); }
  }

  /* ------------------------------------------------------------------
     Background particles + cursor glow
  ------------------------------------------------------------------ */
  const cv = $('#fx'), cx = cv.getContext('2d'); let W, H, pts = [], mx = .5, my = .5;
  function sizeCv() { const d = Math.min(2, devicePixelRatio || 1); W = cv.width = innerWidth * d; H = cv.height = innerHeight * d; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }
  sizeCv(); addEventListener('resize', sizeCv);
  for (let i = 0; i < 80; i++) pts.push({ x: Math.random(), y: Math.random(), z: .3 + Math.random() * .7, v: .00008 + Math.random() * .00022, r: Math.random() < .12 });
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; const g = $('#glowCursor'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });
  (function loop() {
    cx.clearRect(0, 0, W, H);
    const P2 = pts.map(p => { p.y -= p.v * p.z * 16; if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); } return [(p.x + (mx - .5) * .02 * p.z) * W, (p.y + (my - .5) * .02 * p.z) * H, p]; });
    cx.lineWidth = 1;
    for (let i = 0; i < P2.length; i++) for (let j = i + 1; j < P2.length; j++) { const dx = P2[i][0] - P2[j][0], dy = P2[i][1] - P2[j][1], d = dx * dx + dy * dy, lim = (W * .07) ** 2; if (d < lim) { cx.strokeStyle = `rgba(255,255,255,${.05 * (1 - d / lim)})`; cx.beginPath(); cx.moveTo(P2[i][0], P2[i][1]); cx.lineTo(P2[j][0], P2[j][1]); cx.stroke(); } }
    P2.forEach(([x, y, p]) => { cx.fillStyle = p.r ? `rgba(255,70,80,${.55 * p.z})` : `rgba(210,235,255,${.35 * p.z})`; cx.beginPath(); cx.arc(x, y, (p.r ? 1.8 : 1.3) * p.z * (W / innerWidth), 0, 7); cx.fill(); });
    requestAnimationFrame(loop);
  })();

  /* ------------------------------------------------------------------
     Preload & start
  ------------------------------------------------------------------ */
  const srcs = [...new Set($$('img').map(i => i.getAttribute('src')))];
  let done = 0; const bar = $('#loader .ld-bar i');
  const start = () => {
    if (document.body.classList.contains('ready')) return;
    document.body.classList.add('ready');
    const h = location.hash.slice(1); const j = idOf(h);
    go(j >= 0 ? j : 0, true);
  };
  srcs.forEach(s => { const im = new Image(); im.onload = im.onerror = () => { done++; bar.style.width = (done / srcs.length * 100) + '%'; if (done === srcs.length) setTimeout(start, 250); }; im.src = s; });
  setTimeout(start, 6000);
  addEventListener('hashchange', () => { const j = idOf(location.hash.slice(1)); if (j >= 0 && j !== cur) { closeOv(); go(j); } });
  addEventListener('resize', () => { const s = SL[cur]; if (s) { s.flows = null; buildFlows(s); runFlows(s); } });
})();
