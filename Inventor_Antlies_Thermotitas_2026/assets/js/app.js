/* =====================================================================
   INVENTOR 2026 · Αντλίες Θερμότητας · Interactive catalogue — engine
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
    { id: 'welcome',  n: '01', short: 'Καλωσόρισμα',        name: 'Κάνουμε περισσότερα' },
    { id: 'tech',     n: '02', short: 'Τεχνολογίες',         name: 'Τεχνολογίες' },
    { id: 'series',   n: '03', short: 'Προϊοντικές Σειρές',  name: 'Προϊοντικές Σειρές' },
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
  add({ id: 'cover', sec: 'welcome', title: 'Εξώφυλλο · 2026', thumb: img('ph-cover.jpg'), cls: 's-cover hp-cover', html: `
    <div class="photo"><img src="${img('ph-cover.jpg')}" alt=""></div>
    <div class="arc fadein" style="--d:.3s"></div>
    <img class="logo rise" src="${img('logo-inventor-tagline-w')}" alt="Inventor · We invent. You live.">
    <div class="year rise" style="--d:.15s"><span class="run">20</span><span class="b run">26</span></div>
    ${burst(C.COVER.ttl, 'ttl', .5)}
    <p class="tag rise" style="--d:.6s">${C.COVER.tag}</p>
    <div class="cta rise" style="--d:.7s">
      <button class="btn red" data-next>Ξεφύλλισμα ${arrowIco}</button>
      <button class="btn" data-index>Ευρετήριο</button>
    </div>
    <div class="chips rise" style="--d:.9s">${SECTIONS.map(s => `<button class="chipbtn" data-sec="${s.id}"><b>${s.n}</b>${s.name}</button>`).join('')}</div>`
  });

  /* ---- 02 EXPERIENCE ---- */
  add({ id: 'experience', sec: 'welcome', title: 'Λύσεις άνεσης και απόδοσης', thumb: img('ph-exp.jpg'), cls: 's-exp hp-exp4', html: `
    <div class="photo"><img src="${img('ph-exp.jpg')}" alt=""></div>
    ${burst(C.INTRO.title, 'h-thin', .2)}
    ${burst(C.INTRO.caption, 'cap', 1)}
    <div class="right"><span class="kicker rise">Κάνουμε περισσότερα…</span><p class="lead rise" style="--d:.1s;margin-top:14px">${C.INTRO.lead}</p>
      <div class="badges rise" style="--d:.3s">${C.INTRO.badges.map(b => `<span>${b}</span>`).join('')}</div></div>
    <div class="tiles">${C.INTRO.tiles.map((t, i) => tile(i + 1, t[0], `<h4>${t[0]}</h4><div class="scroll" data-scroll><p>${t[1]}</p></div>`, i)).join('')}</div>`
  });

  /* ---- 03 PLANET (R290) ---- */
  add({ id: 'planet', sec: 'tech', title: 'Κάνουμε περισσότερα για τον πλανήτη', thumb: img('ph-planet.jpg'), cls: 's-exp hp-exp4 hp-planet', html: `
    <div class="photo"><img src="${img('ph-planet.jpg')}" alt=""></div>
    ${burst(C.PLANET.title, 'h-thin', .2)}
    ${burst(C.PLANET.caption, 'cap', 1)}
    <div class="right"><span class="kicker rise">R290 · Matrix Zero</span><p class="lead rise" style="--d:.1s;margin-top:14px">${C.PLANET.lead}</p></div>
    <div class="tiles">${C.PLANET.tiles.map((t, i) => tile(i + 1, t[0], `<h4>${t[0]}</h4><div class="scroll" data-scroll><p>${t[1]}</p></div>`, i)).join('')}</div>`
  });

  /* ---- 04 R290 safe & eco ---- */
  add({ id: 'r290', sec: 'tech', title: 'R290 · Ασφαλές & φιλικό προς το περιβάλλον', thumb: pimg('mx290-x'), cls: 's-tips hp-r290', html: `
    <div class="left">
      <span class="kicker rise">Γιατί R290;</span>
      ${burst(C.R290.title, 'h-thin', .1)}
      <p class="lead rise" style="--d:.4s">${C.R290.lead}</p>
      <div class="gx"><div class="gwp rise" style="--d:.6s">${C.R290.stats.map(s => `<div class="g glass"><span>${s[0]}</span><b>=<i class="run">${s[1]}</i></b><p>${s[2]}</p></div>`).join('')}</div>
      <div class="xplw rise" style="--d:.8s" title="Matrix Zero R290 · Προηγμένος σχεδιασμός"><img class="xb" src="${pimg('mx290-body')}" alt="Matrix Zero R290"><img class="xl" src="${pimg('mx290-lid')}" alt=""></div></div>
    </div>
    <div class="tiles" data-fit="min">${C.R290.tiles.map((t, i) => tile(i + 1, t[0], `<h4>${t[0]}</h4><div class="scroll" data-scroll><ul>${t[1].map(x => `<li>${x}</li>`).join('')}</ul></div>`, i)).join('')}</div>`,
    init(el) { const w = $('.xplw', el); w.addEventListener('click', () => w.classList.toggle('open')); },
    enter(el) { $('.xplw', el).classList.remove('open'); }
  });

  /* ---- 05 Technology & reliability ---- */
  const R = C.REL;
  const rangeChart = (g, cls) => { const k = v => ((v - g.min) / (g.max - g.min) * 100).toFixed(2);
    const ticks = []; for (let v = Math.ceil(g.min / 10) * 10; v <= g.max; v += 10) ticks.push(v);
    return `<div class="rc ${cls}"><h5>${g.t}</h5><div class="rcb">${ticks.map(v => `<i style="bottom:${k(v)}%"><span>${v}°</span></i>`).join('')}
      ${g.bars.map((b, i) => `<div class="rb" style="--i:${i};--a:${k(b[1])}%;--b:${k(b[2])}%"><em class="hi">${b[2]}°C</em><em class="lo">${b[1]}°C</em><u><i class="cap"></i></u><span>${b[0]}</span></div>`).join('')}</div></div>`; };
  add({ id: 'reliability', sec: 'tech', title: 'Τεχνολογία και Αξιοπιστία', thumb: pimg('mx290'), cls: 'hp-rel', html: `
    <div class="hd"><span class="kicker rise">Matrix Zero R290</span>${burst(R.title, 'h-thin', .1, 'font-size:50px;margin-top:8px')}</div>
    <div class="stats">${R.stats.map((s, i) => `<div class="st glass rise" style="--d:${.15 + i * .07}s"><small>${s[0]}</small><b class="run">${s[1]}</b><p>${s[2]}</p></div>`).join('')}</div>
    <p class="fan rise" style="--d:.6s"><img class="spin" src="${pimg('mx290-fan')}" alt="">${R.fan}</p>
    <div class="ranges glass rise" style="--d:.3s"><span class="kicker">Μεγάλο εύρος λειτουργίας</span><div class="rcs">${rangeChart(R.ranges.amb, 'amb')}${rangeChart(R.ranges.wat, 'wat')}</div><p class="note">${R.ranges.note}</p></div>
    <div class="ota glass rise" style="--d:.5s"><img src="${img('i-hp-ota')}" alt=""><div><b>${R.ota.t}</b><p>${R.ota.text}</p><ul>${R.ota.pts.map(p => `<li>${p}</li>`).join('')}</ul></div></div>`,
    /* ανεμιστήρας: 5″ αργά → απότομη επιτάχυνση → αργή επιβράδυνση → ξανά */
    init(el) {
      const fan = $('.fan img.spin', el); let ang = 0, last = 0, t0 = 0;
      const SLOW = 36, FAST = 1500, T1 = 5, T2 = 0.7, T3 = 4.5, CYC = T1 + T2 + T3;   // °/s · δευτ.
      const speed = t => { if (t < T1) return SLOW; t -= T1;
        if (t < T2) { const u = t / T2; return SLOW + (FAST - SLOW) * u * u * u; }           // απότομη επιτάχυνση
        t -= T2; const u = t / T3; return FAST - (FAST - SLOW) * (1 - Math.pow(1 - u, 3)); };  // αργή επιβράδυνση
      const tick = now => { requestAnimationFrame(tick);
        if (!el.classList.contains('is-active')) { last = 0; return; }
        if (!last) { last = now; t0 = now; return; }
        const dt = Math.min(.05, (now - last) / 1000); last = now;
        ang = (ang + speed(((now - t0) / 1000) % CYC) * dt) % 360;
        fan.style.transform = `rotate(${ang}deg)`; };
      requestAnimationFrame(tick);
    }
  });

  /* ---- 06-09 Features (6 tiles each) ---- */
  C.FEAT.forEach((f, fi) => add({ id: f.id, sec: 'tech', title: f.title.join(' '), thumb: img(f.photo), cls: `s-tech hp-feat ${fi % 2 ? 'alt' : ''}`, html: `
    <div class="photo"><img src="${img(f.photo)}" alt=""></div>
    ${burst(f.title, 'h-thin', .2)}
    ${burst(f.caption, 'cap', .9)}
    <div class="tiles tech-ic" data-fit="min">${f.tiles.map((t, i) => tile(`<img class="ticon" src="${img(t[2])}" alt="">`, t[0], `<h4>${t[0]}</h4><div class="scroll" data-scroll><p>${t[1]}</p></div><div class="clm-tf" data-tf="${t[2].replace('i-hp-', '')}" data-tfl="${t[0]}"></div>`, i)).join('')}</div>`
  }));

  /* ---- RANGE OVERVIEW ---- */
  const sKeys = Object.keys(C.SERIES);
  const rangeCard = (m, i) => { const p = P[m];
    return `<div class="mcard" data-go="p-${m}" style="--i:${i}">
      <div class="wmw"><div class="nm">${p.name.split(' · ')[1] || p.name}</div>${p.isNew ? '<span class="new">Νέο</span>' : ''}</div>
      <div class="im"><img class="pr" src="${pimg(p.hero[0])}" alt="${p.name}"></div>
      <div class="kv"><b class="run">${p.spec.heat.replace(/ /g, '')}</b> kW</div><div class="pz">${p.spec.priceMin ? 'από ' + p.spec.price.split(' – ')[0] : 'Κατόπιν επικοινωνίας'}</div></div>`; };
  let ci = 0;
  add({ id: 'range', sec: 'series', title: 'Όλη η σειρά', thumb: pimg('mx290'), cls: 's-range hp-range', html: `
    <svg class="flows" data-flows="range"></svg>
    <div class="hd"><span class="kicker rise">Προϊοντικές Σειρές</span>${burst(['Αντλίες Θερμότητας <b>2026</b>'], 'h-thin', .15, 'font-size:44px;margin-top:10px')}</div>
    <div class="cols">${sKeys.map(s => `<div class="col ${s}" data-col="${s}" style="flex:${C.SERIES[s].models.length}"><h3 data-go="ser-${s}"><img src="${img(C.SERIES[s].wm)}" alt="${C.SERIES[s].name}"><span>${C.SERIES[s].sub}</span></h3>
      <div class="cards">${C.SERIES[s].models.map(m => rangeCard(m, ci++)).join('')}</div></div>`).join('')}</div>`
  });

  /* ---- CHART ---- */
  const DEH = C.CMP_MODELS;
  const METRICS = {
    heat:  { lab: 'Απόδοση Θέρμανσης (kW · A7/W35)', v: p => p.spec.heatMax, t: p => p.spec.heat.replace(/ /g, ''), u: 'kW', step: 5 },
    scop:  { lab: 'Εποχιακή Απόδοση SCOP (W35 · Μεσαία Ζώνη)', v: p => p.spec.scopMax, t: p => 'έως ' + p.spec.scopMax, u: '', step: 1 },
    price: { lab: 'Προτεινόμενη Τιμή Λιανικής (από)', v: p => p.spec.priceMin, t: p => p.spec.priceMin ? p.spec.price.split(' – ')[0].replace('€', '') : '—', u: '€', step: 1000 }
  };
  add({ id: 'chart', sec: 'series', title: 'Απόδοση · SCOP · Τιμή', thumb: pimg('mx290-40'), cls: 's-chart hp-chart', html: `
    <div class="hd"><span class="kicker rise">Αντλίες Θερμότητας 2026</span><div class="h-thin rise" data-metric-title style="font-size:40px;margin-top:10px">${METRICS.heat.lab}</div></div>
    <div class="tabs rise">${Object.entries(METRICS).map(([k, m], i) => `<button data-metric="${k}" style="--i:${i}" class="${i ? '' : 'on'}">${{ heat: 'Απόδοση', scop: 'SCOP', price: 'Τιμή' }[k]}</button>`).join('')}</div>
    <div class="chart glass"><div class="grid"></div><div class="bars"></div></div>`,
    enter(el) { drawChart(el, el._metric || 'heat'); },
    init(el) {
      $$('[data-metric]', el).forEach(b => b.addEventListener('click', () => { $$('[data-metric]', el).forEach(x => x.classList.toggle('on', x === b)); el._metric = b.dataset.metric; drawChart(el, b.dataset.metric); }));
    }
  });
  function drawChart(el, key) {
    const M = METRICS[key];
    el.dataset.metric = key === 'heat' ? 'cap' : key === 'scop' ? 'area' : 'price';   // χρώμα ανά διάγραμμα (CSS)
    $('[data-metric-title]', el).textContent = M.lab;
    const vals = DEH.map(m => M.v(P[m]) || 0);
    const max = Math.max(...vals);
    const top = Math.ceil(max * 1.08 / M.step) * M.step;
    const grid = $('.grid', el);
    const n = top / M.step;
    grid.innerHTML = Array.from({ length: n + 1 }, (_, i) => `<i style="bottom:${i / n * 100}%"><span>${(i * M.step).toLocaleString('el-GR')}</span></i>`).join('');
    const bars = $('.bars', el);
    let gi = 0;
    bars.innerHTML = DEH.map((m, i) => { const p = P[m], v = M.v(p) || 0;
      return `<div class="bar" data-go="p-${m}" style="--i:${i};--h:${v / top * 100}%" title="${p.name}">
        <div class="b"><i class="cap"></i></div><div class="v"><span class="run">${M.t(p)}</span><small> ${M.u}</small></div>
        <div class="lbl"><img src="${pimg(p.hero[0])}" alt=""><span>${p.name.split(' · ')[1] || ''}</span></div></div>`; }).join('') +
      sKeys.map(s => { const n0 = gi, n1 = gi + C.SERIES[s].models.length; gi = n1; return `<div class="grp" style="left:${n0 / DEH.length * 100}%;width:calc(${(n1 - n0) / DEH.length * 100}% - 14px)">${C.SERIES[s].name}</div>`; }).join('');
    requestAnimationFrame(() => { $$('.bar', bars).forEach(b => b.classList.add('up')); runAll(bars, 900, 400); });
  }

  /* ---- PRODUCT SLIDES ---- */
  const uspHTML = (p) => p.usps.map((u, i) => `<div class="usp" data-usp="${p.id}:${i}"><div class="ic pulse" style="--i:${i}"><img class="icm" src="${u.ico.replace('.png', '-m.png')}" alt=""><img class="icr" src="${u.ico.replace('.png', '-r.png')}" alt=""></div><span>${u.label}</span></div>`).join('');
  const heroHTML = (p) => `<div class="hero ${p.hero.length > 1 ? 'two' : ''}"><div class="glow"></div><div class="ring"></div>
      ${p.hero.map((h, i) => `<img class="zoomable ${(p.fade || []).includes(i) ? 'fade' : ''}" data-gal="${p.id}" data-gi="${i}" src="${pimg(h)}" alt="${p.name}">`).join('')}<div class="scanl"></div></div>
      <div class="thumbs">${p.gallery.map((g, i) => `<div class="thumb" data-gal="${p.id}" data-gi="${p.hero.length + i}" style="--i:${i}"><img src="${pimg(g)}" alt=""><span class="zi">${zoomIco}</span></div>`).join('')}</div>`;
  const pctRun = t => t.replace(/(\d+)%/g, '<span class="run">$1</span>%');
  function prodSlide(p) {
    const s = C.SERIES[p.series];
    const nrows = p.table.rows.length;
    const head = burst(p.head, 'pt', .25);
    const mid = `<p class="desc rise" style="--d:.3s">${p.desc}</p>
        ${p.tech && nrows < 6 ? `<div class="techbox glass rise" style="--d:.4s"><img src="${img(p.tech.logo)}" alt=""><div class="tt">${p.tech.title ? `<b>${p.tech.title}</b>` : ''}${pctRun(p.tech.text)}</div></div>` : ''}
        <div class="usprow rise" style="--d:.5s">${p.caps.map(c => `<div class="capb"><span>${c[0]}</span><b><span class="run">${c[1]}</span><small>${c[2]}</small></b></div>`).join('')}${uspHTML(p)}</div>`;
    return {
      id: 'p-' + p.id, sec: 'series', title: p.name, thumb: pimg(p.hero[0]), wm: p.wm, cls: `s-prod hp-prod rows${nrows}`, prod: p.id,
      html: `
      <div class="l">
        <div class="rise"><span class="pill"><b>${s.name}</b><span>${p.name.split(' · ')[1] || s.sub}</span></span></div>
        <div class="wmrow rise" style="--d:.1s"><img src="${img(p.wm)}" alt="${s.name}">${p.isNew ? '<span class="new">Νέο</span>' : ''}</div>
        ${head}
        ${mid}
      </div>
      <div class="r ${p.gallery.length ? '' : 'nog'}">${heroHTML(p)}</div>
      <div class="tblwrap glass rise" style="--d:.6s"><div class="tb-h"><span class="kicker">Μοντέλα & τιμές 2026</span><button class="zbtn" data-ztable>${zoomIco}Μεγέθυνση πίνακα</button></div>${specTable(p.table)}</div>
      ${p.foot ? `<p class="foot">${p.foot}</p>` : ''}`,
      enter(el) { runAll($('.tblwrap', el), 700, 700); }
    };
  }
  /* ---- SERIES INTRO ---- */
  const serSlide = (k) => { const S = C.SERIES[k], I = C.SERIES_INTRO[k];
    return { id: 'ser-' + k, sec: 'series', title: S.name, thumb: img(I.photo), cls: 's-air hp-ser', html: `
      <div class="photo"><img src="${img(I.photo)}" alt=""></div>
      <div class="right">
        <img class="swm rise" src="${img(S.wm)}" alt="${S.name}">
        ${burst(I.title, 'h-thin', .15)}
        ${I.text.map((t, i) => `<p class="rise" style="--d:${.3 + i * .12}s">${t}</p>`).join('')}
        <div class="go rise" style="--d:.6s">${S.models.map(m => `<button class="btn" data-go="p-${m}">${P[m].name.split(' · ')[1] || P[m].name} ${arrowIco}</button>`).join('')}</div>
      </div>
      <button class="zbtn phz" data-photo="${img(I.photo)}" data-cap="${S.name}" style="position:absolute;left:600px;bottom:26px;z-index:4;background:rgba(10,13,17,.55)">${zoomIco}Μεγέθυνση</button>` }; };
  sKeys.forEach(k => { add(serSlide(k)); C.SERIES[k].models.forEach(m => add(prodSlide(P[m]))); });

  /* ---- WARRANTY ---- */
  add({ id: 'warranty', sec: 'series', title: '10 Χρόνια Εγγύηση', thumb: img('warranty-hp-card'), cls: 's-war', html: `
    <div class="t"><h2 class="rise"><span class="run">10</span> ΧΡΟΝΙΑ ΕΓΓΥΗΣΗ</h2>${burst([C.WARRANTY.sub], 'h3', .4, 'font-size:34px;font-weight:400;letter-spacing:.1em;margin-top:22px')}</div>
    <div class="wshadow"></div>
    <div class="wcard" tabindex="0"><div class="float"><div class="wplane"><div class="wflip"><div class="in">
      ${Array.from({length: 11}, (_, k) => `<i class="wedge${k === 0 ? ' d' : k === 10 ? ' s' : ''}" style="--z:${k + 1}"></i>`).join('')}<div class="face front"><img src="${img('warranty-hp')}" alt="10 χρόνια εγγύηση στον συμπιεστή"></div>
      <div class="face back"><div class="wtxt">${C.WARRANTY.text.map(t => `<p>${t}</p>`).join('')}</div></div>
    </div></div></div></div></div>`
  });

  /* ---- COMPARE ---- */
  add({ id: 'compare', sec: 'compare', title: 'Σύγκριση μοντέλων', thumb: img('i-hp-a3'), cls: 's-cmp', html: `
    <div class="hd">
      <div><span class="kicker rise">Σύγκριση μοντέλων</span>${burst(['Βρείτε την ιδανική αντλία θερμότητας'], 'h2', .1, 'font-size:34px;font-weight:200;margin-top:6px')}</div>
      <div class="ctr rise"><button class="tgl" data-diff><i></i>Μόνο διαφορές</button><button class="sbtn" data-all>Όλα τα μοντέλα</button><button class="sbtn" data-reset>Επαναφορά</button></div>
    </div>
    <div class="picker rise" style="--d:.2s">${DEH.map(m => `<button class="pick" data-pick="${m}"><img src="${pimg(P[m].hero[0])}" alt=""><span>${P[m].name.replace(' · ', '<br>')}</span></button>`).join('')}</div>
    <div class="cmpbox glass rise" style="--d:.35s"><div class="cmpscroll" data-scroll></div></div>`,
    init(el) { initCompare(el); },
    enter(el) { el._cmp.render(true); }
  });

  /* ---- STEPS ---- */
  add({ id: 'steps', sec: 'services', title: 'Κάνουμε περισσότερα σε κάθε σας βήμα', thumb: img('ph-future.jpg'), cls: 'hp-steps', html: `
    <div class="photo"><img src="${img('ph-future.jpg')}" alt=""></div>
    ${burst(C.STEPS.title, 'h-thin', .1)}
    <p class="lead rise" style="--d:.4s">${C.STEPS.lead}</p>
    <div class="tiles" data-fit="each">${C.STEPS.cards.map((c, i) => tile(i + 1, `<span class="ft">${c[0]}</span><span class="fs">${c[1]}</span>`, `<h4>${c[1]}</h4><div class="scroll" data-scroll><p>${c[2]}</p></div>`, i)).join('')}</div>`
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
    <div class="spbox calcbox glass rise" style="--d:.3s" data-calc>
      <div class="n"><svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><rect x="12" y="5" width="40" height="54" rx="7"/><rect x="19" y="12" width="26" height="11" rx="2.5"/><circle cx="22" cy="32" r="1.6" fill="#fff"/><circle cx="32" cy="32" r="1.6" fill="#fff"/><circle cx="42" cy="32" r="1.6" fill="#fff"/><circle cx="22" cy="41" r="1.6" fill="#fff"/><circle cx="32" cy="41" r="1.6" fill="#fff"/><circle cx="42" cy="41" r="1.6" fill="#fff"/><circle cx="22" cy="50" r="1.6" fill="#fff"/><circle cx="32" cy="50" r="1.6" fill="#fff"/><path d="M42 47v6"/></svg></div>
      <div class="t"><p><b>Τι αντλία θερμότητας<br>χρειάζεται ο χώρος σου;</b></p>
      <button class="btn red" data-calc style="align-self:flex-start">ΥΠΟΛΟΓΙΣΜΟΣ ${arrowIco}</button></div>
    </div>
    <div class="tiles" data-fit="each">${svc.cards.map((c, i) => tile(i + 1, `<span class="ft">${c.front[0]}</span><span class="fs">${c.front[1]}</span>`, svcBack(c), i)).join('')}</div>`
  });

  /* ---- END ---- */
  add({ id: 'contact', sec: 'services', title: 'Επικοινωνία', thumb: img('logo-inventor-tagline-w'), cls: 's-end', html: `
    <div class="arc fadein"></div>
    <img class="logo rise" src="${img('logo-inventor-tagline-w')}" alt="Inventor · We invent. You live.">
    <div class="addr rise" style="--d:.3s"><b>Inventor A.G. A.E.</b><br>${C.CONTACT.address}<br>${C.CONTACT.phones} | <a href="https://www.inventor.ac" target="_blank" rel="noopener">${C.CONTACT.web}</a><br><b>${C.CONTACT.orders}</b></div>
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
  function fitTiles() {   // κάθε πλακίδιο: το μεγαλύτερο μέγεθος κειμένου που χωράει στον διαθέσιμο χώρο
    $$('.tile .back .scroll').forEach(x => { const t = x.closest('.tile');
      let lo = 10, hi = 30;
      for (let k = 0; k < 9; k++) { const m = (lo + hi) / 2; t.style.setProperty('--tfs', m + 'px'); if (x.scrollHeight <= x.clientHeight + 1) lo = m; else hi = m; }
      t.style.setProperty('--tfs', Math.floor(lo * 4) / 4 + 'px'); });
  }
  addEventListener('resize', () => setTimeout(fitTiles, 200));
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
        $$('.mcard', col).forEach(c => { const r = relPos(c, stage); const cx = r.x + r.w / 2; paths.push(`M${cx} ${h.y + h.h} V${r.y}`); });   // κάθετη γραμμή από την υποκατηγορία προς κάθε μοντέλο
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
    const DEF = ['zero1', 'mono1', 'xf1', 'split1'];
    const st = { sel: DEF.slice(), diff: false, added: null };
    const box = $('.cmpscroll', el);
    const SPEC = C.CMP_SPEC;
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
    if (t.closest('[data-calc]')) { e.preventDefault(); openCalc(); return; }
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
  $('#btnPdf').addEventListener('click', () => { try { fetch('/api/view', { method: 'POST', credentials: 'same-origin', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ p: 'Inventor_Antlies_Thermotitas_2026', a: 'pdf' }) }).catch(() => {}); } catch (e) {} });
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
    const body = dialog(`<span>${p.name}</span><small>${seriesName(p.series)} · Κατάλογος & τιμές 2026</small>`, `<div class="dlg-tbl"><div style="width:100%">${specTable(p.table)}${p.foot ? `<p class="foot" style="margin-top:18px;font-size:13px">${p.foot}</p>` : ''}</div></div><div class="scanbar"></div>`);
    runAll(body, 800, 250);
  }
  function openCalc() {
    const body = dialog(`<span>Τι αντλία θερμότητας χρειάζεται ο χώρος σου;</span><small>Προεκτίμηση θερμικών απωλειών & ισχύος</small>`,
      `<iframe class="calcfr" src="assets/calc/index.html" title="Υπολογισμός αντλίας θερμότητας"></iframe>`,
      `<a class="zbtn" href="assets/calc/index.html" target="_blank" rel="noopener">Νέα καρτέλα ↗</a>`);
    return body;
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
