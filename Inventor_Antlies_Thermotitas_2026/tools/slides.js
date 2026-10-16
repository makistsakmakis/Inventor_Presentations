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
    <p class="fan rise" style="--d:.6s"><img class="spin" src="${pimg('mx290-fan-c')}" alt="">${R.fan}</p>
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
    <svg class="flows" data-flows="steps"></svg>
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

