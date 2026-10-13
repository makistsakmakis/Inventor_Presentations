/* =====================================================================
   clm.js · CLM demo (Closed Loop Marketing) — Inventor Αφυγραντήρες 2026
   Καταγραφή επίσκεψης πωλητή πάνω στην υπάρχουσα παρουσίαση:
   • αυτόματα: διαδρομή slides, χρόνοι, κλικ (σύγκριση, διάγραμμα, φωτογραφίες, USP)
   • πωλητής: ✓ / ⭐ / ✕ (+λόγος), 🙋, 👍/👎 χαρακτηριστικών, ερωτήσεις, σημείωση
   • πελάτης: «Top-3» μοντέλα
   • ολοκλήρωση επίσκεψης (υποχρεωτική) → payload προς CRM + αναφορά
   DEMO: χωρίς CRM — πελάτης «TEST ΕΠΕ». Αποθήκευση τοπικά στον browser (localStorage).
   ===================================================================== */
(function () {
  'use strict';
  const C = window.CAT, P = C.P, I = C.IMG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------------- σταθερές / λίστες κωδικών ---------------- */
  const CATALOG_VERSION = 'afygrantires-2026.10';
  const DWELL_MIN = 20;                                   // δευτ. σε slide μοντέλου ⇒ «συζητήθηκε»
  const CUSTOMER = { code: 'TEST-0001', name: 'TEST ΕΠΕ' };
  const REP = { code: 'DEMO', name: 'Demo Πωλητής' };
  const ORDER = Object.values(C.SERIES).flatMap(s => s.models);
  const seriesOf = m => Object.entries(C.SERIES).find(([, s]) => s.models.includes(m));
  const pimg = m => I + 'p-' + P[m].hero[0] + '.webp';
  const sku = m => { const r = (P[m].table && P[m].table.rows || []).find(r => typeof r[0] === 'string'); return r ? r[0] : m.toUpperCase(); };
  const price = m => P[m].spec.price;
  const OUT = { offer: ['✓', 'Θέλει προσφορά'], interest: ['⭐', 'Ενδιαφέρον'], reject: ['✕', 'Όχι'] };
  const REASONS = [['PRICE', 'Τιμή'], ['COMPETITOR', 'Έχει ανταγωνιστικό'], ['NOT_FIT', 'Δεν ταιριάζει στο κοινό του'], ['SIMILAR', 'Μοιάζει με άλλο Inventor'], ['AVAILABILITY', 'Διαθεσιμότητα'], ['OTHER', 'Άλλο']];
  const QUESTIONS = [['WHOLESALE_PRICE', 'Τιμή χονδρικής'], ['AVAILABILITY', 'Διαθεσιμότητα / παράδοση'], ['DISPLAY_STAND', 'Εκθετήριο'], ['POS_MATERIAL', 'Υλικό προβολής'], ['PROMO', 'Προωθητική ενέργεια'], ['WARRANTY', 'Εγγύηση / Service']];
  const COMMON = [['PRICE_LEVEL', 'Τιμή'], ['NOISE', 'Θόρυβος'], ['CAPACITY', 'Ικανότητα / απόδοση'], ['DESIGN', 'Εμφάνιση'], ['ENERGY', 'Κατανάλωση']];
  const NEXT = [['SEND_OFFER', 'Αποστολή προσφοράς'], ['CALL', 'Τηλεφωνική επικοινωνία'], ['REVISIT', 'Νέα επίσκεψη'], ['NONE', 'Καμία ενέργεια']];
  const lab = (list, code) => (list.find(x => x[0] === code) || [code, code])[1];
  const aspectsOf = m => P[m].usps.map(u => { const k = (u.ico.match(/i-([^/]+)\.png$/) || [])[1] || u.label; return [k, u.label]; }).concat(COMMON);
  const aspectLabel = (m, code) => lab(aspectsOf(m), code);

  /* ---------------- αποθήκευση ---------------- */
  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const K_DRAFT = 'clm_draft_v1', K_VISITS = 'clm_visits_v1';
  let V = null;                          // τρέχουσα επίσκεψη
  const save = () => { if (V) LS.set(K_DRAFT, V); };
  const now = () => Date.now();
  const iso = t => { const d = new Date(t), p = n => String(n).padStart(2, '0'), o = -d.getTimezoneOffset();
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}${o >= 0 ? '+' : '-'}${p(Math.floor(Math.abs(o) / 60))}:${p(Math.abs(o) % 60)}`; };
  const fmtDur = s => { s = Math.round(s); const m = Math.floor(s / 60); return m ? `${m}′${String(s % 60).padStart(2, '0')}″` : `${s}″`; };
  const fmtDT = t => new Date(t).toLocaleString('el-GR', { weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtT = t => new Date(t).toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' });

  function newVisit() {
    const t = now();
    return { visit_id: 'DEMO-' + new Date(t).toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(t).slice(-5),
      crm_visit_id: null, customer: CUSTOMER, rep: REP, started_at: t, ended_at: null,
      path: [], events: [], marks: {}, top3: [], compare_added: [], visit_note: '',
      next: { type: 'SEND_OFFER', due: new Date(t + 3 * 864e5).toISOString().slice(0, 10) }, status: 'live' };
  }

  /* ---------------- UI σκελετός ---------------- */
  const ico = {
    pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>',
    rep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/></svg>'
  };
  document.body.insertAdjacentHTML('beforeend', `
    <button id="clmFab" aria-label="Σημείωση πωλητή" title="Σημείωση πωλητή">${ico.pen}<span class="dot"></span><span class="bd"></span></button>
    <div id="clmPanel" data-scroll role="dialog" aria-label="Σημείωση πωλητή"></div>
    <div id="clmToast"></div>
    <div id="clmStart" class="clm-ov" data-scroll></div>
    <div id="clmTop3" class="clm-ov" data-scroll></div>
    <div id="clmWrapup" class="clm-ov" data-scroll></div>
    <div id="clmReport" class="clm-ov" data-scroll></div>`);
  const fab = $('#clmFab'), panel = $('#clmPanel'), toastEl = $('#clmToast');
  // Τα δικά μας στοιχεία δεν πρέπει να «γυρίζουν σελίδα» (πλήκτρα, ροδέλα, swipe της παρουσίασης)
  ['#clmPanel', '#clmStart', '#clmTop3', '#clmWrapup', '#clmReport', '#clmFab'].forEach(s => {
    const el = $(s); ['keydown', 'wheel', 'touchend'].forEach(t => el.addEventListener(t, e => e.stopPropagation()));
  });
  // κουμπί αναφορών στην πάνω μπάρα
  const tools = $('#topbar .tb-tools');
  if (tools) { tools.insertAdjacentHTML('afterbegin', `<button class="tb-btn tb-pdf" id="clmRpBtn" title="CLM · Αναφορές επισκέψεων" aria-label="Αναφορές επισκέψεων">${ico.rep}<b>Αναφορές</b></button>`); $('#clmRpBtn').onclick = () => openReport(); }

  let toastT = 0;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 1300); }

  /* ---------------- αυτόματη καταγραφή: διαδρομή slides ---------------- */
  const deck = $('#deck');
  const activeSlide = () => $('#deck > section.slide.is-active');
  function closePath(t) { const last = V && V.path[V.path.length - 1]; if (last && !last.t1) last.t1 = t || now(); }
  function onSlide(el) {
    if (!V || V.status !== 'live' || !el) return;
    const last = V.path[V.path.length - 1];
    if (last && !last.t1 && last.id === el.id) return;
    const t = now(); closePath(t);
    V.path.push({ id: el.id, title: el.getAttribute('aria-label') || el.id, model: el.id.startsWith('p-') ? el.id.slice(2) : null, t0: t, t1: null });
    save();
    if (panel.classList.contains('open')) { const m = currentModel(); if (m) sel = m; renderPanel(); }
  }
  new MutationObserver(ms => { for (const m of ms) if (m.target.parentNode === deck && m.target.classList.contains('is-active')) { onSlide(m.target); break; } })
    .observe(deck, { subtree: true, attributes: true, attributeFilter: ['class'] });

  /* ---------------- αυτόματη καταγραφή: κλικ μέσα στην παρουσίαση ---------------- */
  function ev(type, data) { if (!V || V.status !== 'live') return; V.events.push(Object.assign({ t: now(), type, slide: (activeSlide() || {}).id }, data || {})); save(); }
  document.addEventListener('click', e => {
    if (!V || V.status !== 'live') return;
    const t = e.target; if (t.closest('#clmPanel,#clmFab,.clm-ov,#clmRpBtn')) return;
    let x;
    if ((x = t.closest('[data-pick]'))) { const m = x.dataset.pick; const wasOn = x.classList.contains('on'); ev(wasOn ? 'compare_remove' : 'compare_add', { model: m }); if (!wasOn && !V.compare_added.includes(m)) V.compare_added.push(m); return; }
    if ((x = t.closest('[data-rm]'))) { ev('compare_remove', { model: x.dataset.rm }); return; }
    if (t.closest('[data-all]')) { ev('compare_all'); return; }
    if (t.closest('[data-diff]')) { ev('compare_diff'); return; }
    if ((x = t.closest('[data-metric]'))) { ev('chart_metric', { metric: x.dataset.metric }); return; }
    if ((x = t.closest('[data-gal]'))) { ev('gallery_open', { model: x.dataset.gal }); return; }
    if (t.closest('[data-ztable]')) { ev('table_zoom', { model: currentModel() }); return; }
    if ((x = t.closest('[data-usp]'))) { const [m, k] = x.dataset.usp.split(':'); ev('usp_tap', { model: m, usp: P[m].usps[+k].label }); return; }
    if ((x = t.closest('[data-go]'))) { ev('nav_click', { to: x.dataset.go }); return; }
    if (t.closest('#btnPdf')) { ev('pdf_download'); return; }
    if (t.closest('[data-locator]')) { ev('service_locator'); return; }
  }, true);

  /* ---------------- υπολογισμοί ---------------- */
  const segDur = (p, t) => ((p.t1 || t || now()) - p.t0) / 1000;
  function dwellByModel(v, t) { const d = {}; v.path.forEach(p => { if (p.model) d[p.model] = (d[p.model] || 0) + segDur(p, t); }); return d; }
  function discussed(v) {
    const d = dwellByModel(v, v.ended_at);
    const set = new Set(ORDER.filter(m => (d[m] || 0) >= DWELL_MIN));
    Object.keys(v.marks).forEach(m => set.add(m)); v.top3.forEach(m => set.add(m));
    return ORDER.filter(m => set.has(m)).sort((a, b) => (d[b] || 0) - (d[a] || 0));
  }
  function currentModel() { const s = activeSlide(); return s && s.id.startsWith('p-') ? s.id.slice(2) : null; }
  const mark = m => (V.marks[m] = V.marks[m] || { outcome: null, reason: null, initiated_by: 'rep', aspects: {}, questions: [], note: '', source: 'rep', t: now() });
  const markedCount = () => Object.values(V.marks).filter(x => x.outcome).length;
  function updBadge() { const n = V ? markedCount() : 0; const b = $('.bd', fab); b.textContent = n; b.classList.toggle('on', n > 0); }

  /* ---------------- χειριστήρια (κοινά για πάνελ & ολοκλήρωση) ---------------- */
  function controlsHTML(m) {
    const k = V.marks[m] || {};
    const a = k.aspects || {};
    return `
      <div class="clm-out">${Object.entries(OUT).map(([o, [i, l]]) => `<button data-co="${o}" class="${k.outcome === o ? 'on' : ''}"><i>${i}</i>${l}</button>`).join('')}</div>
      ${k.outcome === 'reject' ? `<div class="clm-lab">Λόγος (υποχρεωτικό)</div><div class="clm-chips">${REASONS.map(([c, l]) => `<button data-cr="${c}" class="${k.reason === c ? 'on' : ''}">${l}</button>`).join('')}</div>` : ''}
      <button class="clm-tog ${k.initiated_by === 'customer' ? 'on' : ''}" data-ci>🙋 Το ζήτησε ο ίδιος ο πελάτης</button>
      <div class="clm-lab">Χαρακτηριστικά · τι του άρεσε 👍 / δεν του άρεσε 👎 (προαιρετικά)</div>
      <div class="clm-asp">${aspectsOf(m).map(([c, l]) => `<div class="a ${a[c] === 1 ? 'pos' : a[c] === -1 ? 'neg' : ''}"><span>${esc(l)}</span><button data-ca="${esc(c)}" data-pol="1" class="${a[c] === 1 ? 'on' : ''}" aria-label="Του άρεσε">👍</button><button data-ca="${esc(c)}" data-pol="-1" class="${a[c] === -1 ? 'on' : ''}" aria-label="Δεν του άρεσε">👎</button></div>`).join('')}</div>
      <div class="clm-lab">Ρώτησε για</div>
      <div class="clm-chips">${QUESTIONS.map(([c, l]) => `<button class="q ${(k.questions || []).includes(c) ? 'on' : ''}" data-cq="${c}">${l}</button>`).join('')}</div>
      <textarea class="clm-note" data-cn rows="1" placeholder="Σημείωση (προαιρετικά · 🎤 υπαγόρευση από το πληκτρολόγιο)">${esc(k.note || '')}</textarea>`;
  }
  // χειρισμός πατημάτων σε ένα container που αφορά το μοντέλο m
  function bindControls(box, getModel, rerender) {
    box.addEventListener('click', e => {
      const m = getModel(e.target); if (!m) return;
      let x, msg = null;
      if ((x = e.target.closest('[data-co]'))) { const k = mark(m); const o = x.dataset.co; k.outcome = k.outcome === o ? null : o; if (k.outcome !== 'reject') k.reason = null; msg = k.outcome ? OUT[o][0] + ' ' + OUT[o][1] : 'Αναίρεση'; }
      else if ((x = e.target.closest('[data-cr]'))) { const k = mark(m); k.reason = x.dataset.cr; msg = '✕ ' + lab(REASONS, k.reason); }
      else if (e.target.closest('[data-ci]')) { const k = mark(m); k.initiated_by = k.initiated_by === 'customer' ? 'rep' : 'customer'; msg = k.initiated_by === 'customer' ? '🙋 Το ζήτησε ο πελάτης' : 'Το έδειξε ο πωλητής'; }
      else if ((x = e.target.closest('[data-ca]'))) { const k = mark(m); const c = x.dataset.ca; const pol = +x.dataset.pol; const nv = (k.aspects[c] || 0) === pol ? 0 : pol; if (nv) k.aspects[c] = nv; else delete k.aspects[c]; msg = (nv === 1 ? '👍 ' : nv === -1 ? '👎 ' : 'Αναίρεση: ') + aspectLabel(m, c); }
      else if ((x = e.target.closest('[data-cq]'))) { const k = mark(m); const c = x.dataset.cq; k.questions = k.questions.includes(c) ? k.questions.filter(q => q !== c) : k.questions.concat(c); msg = 'Ρώτησε: ' + lab(QUESTIONS, c); }
      else return;
      V.marks[m].t = now(); ev('rep_mark', { model: m }); save(); updBadge(); rerender(m); toast(msg);
    });
    box.addEventListener('input', e => { const n = e.target.closest('[data-cn]'); if (!n) return; const m = getModel(n); if (!m) return; mark(m).note = n.value; save(); });
  }

  /* ---------------- πάνελ πωλητή ---------------- */
  let sel = null;
  function renderPanel() {
    const s = activeSlide();
    const m = sel;
    panel.innerHTML = `
      <div class="clm-hd"><h4>Σημείωση πωλητή · ${esc(CUSTOMER.name)}</h4><button class="clm-x" data-cx aria-label="Κλείσιμο">×</button></div>
      <div class="clm-lab" style="margin-top:0">Μοντέλο ${m && m === currentModel() ? '(τρέχουσα σελίδα)' : ''}</div>
      <div class="clm-pick">${ORDER.map(x => `<button data-cm="${x}" class="${x === m ? 'on' : ''} ${V.marks[x] && V.marks[x].outcome ? 'has' : ''}">${esc(P[x].name)}</button>`).join('')}</div>
      ${m ? `<div class="clm-model"><img src="${pimg(m)}" alt=""><div><b>${esc(P[m].name)}</b><span>${esc(seriesOf(m)[1].name)} · ${esc(price(m))}</span></div></div>
        <div data-cmodel="${m}">${controlsHTML(m)}</div>`
        : `<div class="clm-hint" style="margin:6px 0 4px">Διάλεξε μοντέλο για να καταγράψεις αντίδραση. Στις σελίδες μοντέλων επιλέγεται αυτόματα.</div>`}
      <div class="clm-foot"><button class="clm-btn" data-ctop>❤ Top-3 πελάτη</button><button class="clm-btn red" data-cend>Ολοκλήρωση επίσκεψης</button></div>
      <div class="clm-hint">Σελίδα: ${esc(s ? s.getAttribute('aria-label') : '')} · Επίσκεψη ${esc(V.visit_id)}</div>`;
  }
  panel.addEventListener('click', e => {
    if (e.target.closest('[data-cx]')) { togglePanel(false); return; }
    const pm = e.target.closest('[data-cm]'); if (pm) { sel = pm.dataset.cm; renderPanel(); return; }
    if (e.target.closest('[data-ctop]')) { togglePanel(false); openTop3(); return; }
    if (e.target.closest('[data-cend]')) { togglePanel(false); openWrapup(); return; }
  });
  bindControls(panel, () => sel, () => renderPanel());
  function togglePanel(on) {
    if (on === undefined) on = !panel.classList.contains('open');
    if (on) { sel = currentModel() || sel; renderPanel(); }
    panel.classList.toggle('open', on); fab.classList.toggle('on', on);
  }
  fab.onclick = () => togglePanel();

  /* ---------------- έναρξη επίσκεψης ---------------- */
  const startOv = $('#clmStart');
  function openStart() {
    const draft = LS.get(K_DRAFT, null);
    const visits = LS.get(K_VISITS, []);
    startOv.innerHTML = `<div class="clm-wrap"><div class="clm-card">
      <div class="clm-lab" style="margin-top:0">CLM · Επίσκεψη πελάτη <span class="clm-demo">DEMO</span></div>
      <h2>Έναρξη <b>επίσκεψης</b></h2>
      <div class="clm-kv">
        <span>Πελάτης</span><b>${esc(CUSTOMER.name)}</b>
        <span>Κωδικός</span><span style="color:#fff">${CUSTOMER.code} <span class="clm-hint">(στην παραγωγή έρχεται από το CRM)</span></span>
        <span>Πωλητής</span><span style="color:#fff">${esc(REP.name)}</span>
        <span>Ημερομηνία</span><span style="color:#fff">${fmtDT(now())}</span>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${draft && draft.status === 'live' ? `<button class="clm-btn" data-cres>Συνέχεια ανοιχτής επίσκεψης (${fmtT(draft.started_at)})</button>` : ''}
        <button class="clm-btn red" data-cnew>Έναρξη επίσκεψης</button>
      </div>
      <div style="margin-top:14px"><button class="clm-btn ghost" data-crep style="width:100%">Αναφορές · επίσκεψης & συγκεντρωτική όλων των μοντέλων (${visits.length} επισκέψεις)</button></div>
      <div class="clm-hint" style="margin-top:14px">Κατά την παρουσίαση: διακριτικό κουμπί ✎ κάτω αριστερά για σημειώσεις πωλητή. Στο τέλος: «Ολοκλήρωση επίσκεψης».</div>
    </div></div>`;
    startOv.classList.add('open');
  }
  startOv.addEventListener('click', e => {
    if (e.target.closest('[data-cnew]')) { V = newVisit(); begin(); }
    else if (e.target.closest('[data-cres]')) { V = LS.get(K_DRAFT, null); begin(true); }
    else if (e.target.closest('[data-crep]')) { startOv.classList.remove('open'); openReport(null, true); }
  });
  function begin(resumed) {
    startOv.classList.remove('open');
    document.body.classList.add('clm-live');
    if (resumed) closePath(V.path.length ? V.path[V.path.length - 1].t0 + 1000 : now());   // κλείσιμο τμήματος που έμεινε ανοιχτό
    ev(resumed ? 'visit_resume' : 'visit_start'); onSlide(activeSlide()); save(); updBadge();
    toast(resumed ? 'Συνέχεια επίσκεψης' : 'Η επίσκεψη ξεκίνησε');
  }

  /* ---------------- Top-3 πελάτη ---------------- */
  const top3Ov = $('#clmTop3');
  function openTop3() {
    if (!V) return;
    ev('top3_open');
    const pick = V.top3.slice();
    const draw = () => {
      top3Ov.innerHTML = `<div class="clm-wrap">
        <h2>Ποια <b>3 μοντέλα</b> θα βάζατε στο κατάστημά σας;</h2>
        <div class="clm-sub">Επιλέξτε με τη σειρά προτίμησης — έως 3</div>
        <div class="grid">${ORDER.map(m => { const i = pick.indexOf(m); return `<button class="m ${i >= 0 ? 'on' : ''}" data-tm="${m}"><span class="n">${i + 1}</span><img src="${pimg(m)}" alt=""><b>${esc(P[m].name)}</b><span>${esc(seriesOf(m)[1].name)}</span></button>`; }).join('')}</div>
        <div class="clm-actions"><button class="clm-btn ghost" data-tx>Άκυρο</button><button class="clm-btn red" data-tok>Έτοιμο</button></div></div>`;
    };
    top3Ov.onclick = e => {
      const b = e.target.closest('[data-tm]');
      if (b) { const m = b.dataset.tm; const i = pick.indexOf(m); if (i >= 0) pick.splice(i, 1); else if (pick.length < 3) pick.push(m); draw(); return; }
      if (e.target.closest('[data-tx]')) { top3Ov.classList.remove('open'); return; }
      if (e.target.closest('[data-tok]')) { V.top3 = pick; ev('top3_set', { models: pick.slice() }); save(); top3Ov.classList.remove('open'); toast('❤ Top-3 πελάτη: ' + (pick.map(m => P[m].name).join(', ') || '—')); }
    };
    draw(); top3Ov.classList.add('open');
  }

  /* ---------------- ολοκλήρωση επίσκεψης ---------------- */
  const wrapOv = $('#clmWrapup');
  let wrapExtra = [];
  function openWrapup() {
    if (!V) return;
    closePath(); save();               // ο χρόνος της ολοκλήρωσης δεν μετράει στα slides
    wrapExtra = [];
    drawWrapup();
    wrapOv.classList.add('open'); wrapOv.scrollTop = 0;
  }
  function wrapModels() { const list = discussed(V); wrapExtra.forEach(m => { if (!list.includes(m)) list.push(m); }); return list; }
  function drawWrapup(err) {
    const d = dwellByModel(V);
    const list = wrapModels();
    const others = ORDER.filter(m => !list.includes(m));
    const dur = (now() - V.started_at) / 1000;
    wrapOv.innerHTML = `<div class="clm-wrap">
      <div class="clm-lab" style="margin-top:0">Ολοκλήρωση επίσκεψης <span class="clm-demo">DEMO</span></div>
      <h2><b>${esc(CUSTOMER.name)}</b> · ${fmtDur(dur)}</h2>
      <div class="clm-sub">Τα μοντέλα που συζητήθηκαν (πάνω από ${DWELL_MIN}″ στη σελίδα τους, ή με σημείωση, ή στο Top-3 του πελάτη). Η αντίδραση είναι υποχρεωτική για κάθε μοντέλο· στο ✕ και ο λόγος.</div>
      <div class="clm-rows">${list.length ? list.map(m => {
        const k = V.marks[m] || {}; const ti = V.top3.indexOf(m); const missing = err && (!k.outcome || (k.outcome === 'reject' && !k.reason));
        return `<div class="clm-card clm-row ${missing ? 'miss' : ''}" data-wm="${m}">
          <div class="who"><img src="${pimg(m)}" alt=""><b>${esc(P[m].name)}</b><span>${esc(price(m))} · ${d[m] ? fmtDur(d[m]) : 'δεν άνοιξε η σελίδα'}</span>
            <div class="tags">${ti >= 0 ? `<span class="clm-t h">❤ Top-3 #${ti + 1}</span>` : ''}${V.compare_added.includes(m) ? '<span class="clm-t c">Σε σύγκριση</span>' : ''}</div></div>
          <div>${controlsHTML(m)}</div></div>`; }).join('')
        : '<div class="clm-card clm-hint">Δεν υπάρχει ακόμα μοντέλο που να συζητήθηκε. Πρόσθεσε από κάτω όσα έδειξες.</div>'}</div>
      <div class="clm-add"><select data-wadd><option value="">+ Προσθήκη μοντέλου που συζητήθηκε…</option>${others.map(m => `<option value="${m}">${esc(P[m].name)} · ${esc(price(m))}</option>`).join('')}</select></div>
      <div class="clm-sec">Επίσκεψη</div>
      <div class="clm-card"><div class="clm-f">
        <div><label>Επόμενο βήμα</label><select data-wnext>${NEXT.map(([c, l]) => `<option value="${c}" ${V.next.type === c ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
        <div><label>Έως</label><input type="date" data-wdue value="${V.next.due || ''}"></div>
      </div>
      <label style="display:block;font-size:12px;color:var(--mute);margin:12px 0 5px">Σημείωση επίσκεψης (προαιρετικά)</label>
      <textarea class="clm-note" data-wnote rows="3" placeholder="π.χ. ανακαινίζει το κατάστημα τον Νοέμβριο · 🎤 υπαγόρευση">${esc(V.visit_note)}</textarea>
      <div class="clm-hint">Top-3 πελάτη: ${V.top3.length ? V.top3.map((m, i) => `${i + 1}. ${esc(P[m].name)}`).join(' · ') : '— (προαιρετικό)'} &nbsp; <a href="#" data-wtop style="color:#ff8a90">${V.top3.length ? 'αλλαγή' : 'ρωτήστε τον πελάτη'}</a></div></div>
      <div class="clm-err">${err ? esc(err) : ''}</div>
      <div class="clm-actions"><button class="clm-btn ghost" data-wback>← Πίσω στην παρουσίαση</button><button class="clm-btn red" data-wsend>Ολοκλήρωση & αποστολή στο CRM</button></div>
    </div>`;
  }
  bindControls(wrapOv, t => { const r = t.closest('[data-wm]'); return r && r.dataset.wm; }, m => {
    const r = $(`[data-wm="${m}"] > div:last-child`, wrapOv); if (r) r.innerHTML = controlsHTML(m);
    const row = $(`[data-wm="${m}"]`, wrapOv); const k = V.marks[m] || {}; if (row && k.outcome && (k.outcome !== 'reject' || k.reason)) row.classList.remove('miss');
  });
  wrapOv.addEventListener('change', e => {
    if (e.target.matches('[data-wadd]') && e.target.value) { wrapExtra.push(e.target.value); drawWrapup(); }
    if (e.target.matches('[data-wnext]')) { V.next.type = e.target.value; save(); }
    if (e.target.matches('[data-wdue]')) { V.next.due = e.target.value; save(); }
  });
  wrapOv.addEventListener('input', e => { if (e.target.matches('[data-wnote]')) { V.visit_note = e.target.value; save(); } });
  wrapOv.addEventListener('click', e => {
    if (e.target.closest('[data-wback]')) { wrapOv.classList.remove('open'); onSlide(activeSlide()); return; }
    if (e.target.closest('[data-wtop]')) { e.preventDefault(); openTop3(); const t = setInterval(() => { if (!top3Ov.classList.contains('open')) { clearInterval(t); drawWrapup(); } }, 300); return; }
    if (e.target.closest('[data-wsend]')) {
      const list = wrapModels();
      const miss = list.filter(m => { const k = V.marks[m] || {}; return !k.outcome || (k.outcome === 'reject' && !k.reason); });
      if (!list.length) { drawWrapup('Πρόσθεσε τουλάχιστον ένα μοντέλο που συζητήθηκε.'); return; }
      if (miss.length) { drawWrapup('Λείπει αντίδραση ή λόγος για: ' + miss.map(m => P[m].name).join(', ')); const f = $('.clm-row.miss', wrapOv); f && f.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      finish(list);
    }
  });

  /* ---------------- payload προς CRM ---------------- */
  function buildPayload(v, list) {
    const d = dwellByModel(v, v.ended_at);
    const marks = v.marks;
    const offers = list.filter(m => marks[m] && marks[m].outcome === 'offer');
    const ints = list.filter(m => marks[m] && marks[m].outcome === 'interest');
    const rej = list.filter(m => marks[m] && marks[m].outcome === 'reject');
    const qs = [...new Set(list.flatMap(m => (marks[m] && marks[m].questions) || []))];
    const notShownSeries = Object.values(C.SERIES).filter(s => !s.models.some(m => list.includes(m))).map(s => s.name);
    const names = a => a.map(m => P[m].name).join(', ');
    const text = [
      offers.length ? `Θέλει προσφορά για ${names(offers)}.` : '',
      ints.length ? `Ενδιαφέρον (όχι τώρα) για ${names(ints)}.` : '',
      rej.length ? `Απέρριψε ${rej.map(m => `${P[m].name} (${lab(REASONS, marks[m].reason)})`).join(', ')}.` : '',
      v.top3.length ? `Top-3 πελάτη: ${names(v.top3)}.` : '',
      qs.length ? `Ρώτησε για: ${qs.map(q => lab(QUESTIONS, q)).join(', ')}.` : '',
      notShownSeries.length ? `Δεν παρουσιάστηκαν: ${notShownSeries.join(', ')}.` : ''
    ].filter(Boolean).join(' ');
    return {
      visit_id: v.visit_id,
      crm_visit_id: v.crm_visit_id || 'DEMO (χωρίς CRM)',
      customer: v.customer, rep: v.rep,
      catalog_version: CATALOG_VERSION,
      started_at: iso(v.started_at), ended_at: iso(v.ended_at),
      duration_sec: Math.round((v.ended_at - v.started_at) / 1000),
      summary: {
        models_presented: list.length,
        outcome: offers.length ? 'OFFER_REQUESTED' : ints.length ? 'INTEREST' : 'NO_INTEREST',
        next_action: { type: v.next.type, due: v.next.type === 'NONE' ? null : v.next.due },
        text, visit_note: v.visit_note || null
      },
      products: ORDER.map(m => {
        const k = marks[m];
        const presented = list.includes(m);
        const o = { model: m, sku: sku(m), name: P[m].name, series: seriesOf(m)[0], presented, dwell_sec: Math.round(d[m] || 0) };
        if (!presented) return o;
        return Object.assign(o, {
          signal: k ? k.outcome : null, reason: k && k.outcome === 'reject' ? k.reason : null,
          initiated_by: k ? k.initiated_by : 'rep', source: 'rep',
          aspects: k ? Object.entries(k.aspects).map(([code, pol]) => ({ code, label: aspectLabel(m, code), pol })) : [],
          questions: k ? k.questions : [],
          customer_top3: v.top3.includes(m) ? v.top3.indexOf(m) + 1 : null,
          in_comparison: v.compare_added.includes(m),
          note: k && k.note ? k.note : null
        });
      }),
      events_ref: `/api/clm/visits/${v.visit_id}/events`
    };
  }
  function finish(list) {
    V.ended_at = now(); closePath(V.ended_at); V.status = 'done';
    ev('visit_end');
    const payload = buildPayload(V, list);
    const rec = { payload, path: V.path.map(p => ({ id: p.id, title: p.title, model: p.model, t0: p.t0, t1: p.t1 })), events: V.events, top3: V.top3 };
    const visits = LS.get(K_VISITS, []); visits.push(rec); LS.set(K_VISITS, visits);
    LS.del(K_DRAFT);
    wrapOv.classList.remove('open'); togglePanel(false);
    document.body.classList.remove('clm-live');
    V = null; updBadge();
    openReport(visits.length - 1);
  }

  /* ---------------- αναφορές ---------------- */
  const rpOv = $('#clmReport');
  let rpTab = 'visit', rpIdx = 0;
  function openReport(idx, fromStart) {
    const visits = LS.get(K_VISITS, []);
    rpIdx = idx == null ? visits.length - 1 : idx; rpTab = 'visit';
    rpOv._fromStart = !!fromStart;
    drawReport(); rpOv.classList.add('open'); rpOv.scrollTop = 0;
  }
  function drawReport() {
    const visits = LS.get(K_VISITS, []);
    const live = !!V && V.status === 'live';
    const top = `<div class="rp-top"><div><b>CLM · Αναφορές επισκέψεων</b> <span class="clm-demo">DEMO</span></div>
      <div class="rp-tabs">
        <button data-rt="visit" class="${rpTab === 'visit' ? 'on' : ''}">Αναφορά επίσκεψης</button>
        <button data-rt="all" class="${rpTab === 'all' ? 'on' : ''}">Συγκεντρωτική · όλα τα μοντέλα</button>
        <button data-rt="json" class="${rpTab === 'json' ? 'on' : ''}">Δεδομένα προς CRM</button>
      </div>
      <div class="rp-tabs">
        ${visits.length > 1 && rpTab !== 'all' ? `<select data-rsel style="padding:6px 8px;border-radius:8px;background:#222;color:#fff;border:1px solid #444">${visits.map((v, i) => `<option value="${i}" ${i === rpIdx ? 'selected' : ''}>${esc(v.payload.customer.name)} · ${fmtDT(Date.parse(v.payload.started_at))}</option>`).join('')}</select>` : ''}
        <button class="rp-btn" data-rprint>Εκτύπωση</button>
        ${live ? '' : '<button class="rp-btn" data-rnew>Νέα επίσκεψη</button>'}
        <button class="rp-btn" data-rclose>${live ? 'Πίσω στην παρουσίαση' : 'Κλείσιμο'}</button>
      </div></div>`;
    let body;
    if (!visits.length) body = `<div class="rp"><div class="card empty">Δεν υπάρχουν ακόμα ολοκληρωμένες επισκέψεις.</div></div>`;
    else if (rpTab === 'visit') body = visitReport(visits[rpIdx]);
    else if (rpTab === 'all') body = allReport(visits);
    else body = `<div class="rp"><div class="card"><h3>Payload προς CRM (POST στο κλείσιμο της επίσκεψης)</h3>
      <div class="sub">Κεφαλίδα + γραμμές ανά μοντέλο. Το αναλυτικό log κινήσεων (${visits[rpIdx].events.length} κινήσεις, ${visits[rpIdx].path.length} σελίδες) μένει στο δικό μας backend — <code>events_ref</code>.</div>
      <pre>${esc(JSON.stringify(visits[rpIdx].payload, null, 2))}</pre>
      <button class="rp-btn" data-rdl>Λήψη JSON</button></div></div>`;
    rpOv.innerHTML = top + body;
  }
  rpOv.addEventListener('click', e => {
    const t = e.target.closest('[data-rt]'); if (t) { rpTab = t.dataset.rt; drawReport(); rpOv.scrollTop = 0; return; }
    if (e.target.closest('[data-rprint]')) { window.print(); return; }
    if (e.target.closest('[data-rclose]')) { rpOv.classList.remove('open'); if (!V) openStart(); return; }
    if (e.target.closest('[data-rnew]')) { rpOv.classList.remove('open'); openStart(); return; }
    if (e.target.closest('[data-rdl]')) { const v = LS.get(K_VISITS, [])[rpIdx]; const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(v.payload, null, 2)], { type: 'application/json' })); a.download = v.payload.visit_id + '.json'; a.click(); return; }
    if (e.target.closest('[data-rclear]')) { if (confirmClear()) { LS.del(K_VISITS); drawReport(); } return; }
    const vi = e.target.closest('[data-rvis]'); if (vi) { rpIdx = +vi.dataset.rvis; rpTab = 'visit'; drawReport(); rpOv.scrollTop = 0; }
  });
  rpOv.addEventListener('change', e => { if (e.target.matches('[data-rsel]')) { rpIdx = +e.target.value; drawReport(); } });
  let clearArm = 0;
  function confirmClear() { const b = $('[data-rclear]', rpOv); if (Date.now() - clearArm < 3000) return true; clearArm = Date.now(); if (b) b.textContent = 'Πάτησε ξανά για επιβεβαίωση'; return false; }

  const sigTag = p => p.signal === 'offer' ? '<span class="tag t-ok">✓ Θέλει προσφορά</span>' : p.signal === 'interest' ? '<span class="tag t-int">⭐ Ενδιαφέρον</span>' : p.signal === 'reject' ? `<span class="tag t-no">✕ ${esc(lab(REASONS, p.reason))}</span>` : '<span class="tag t-g">—</span>';

  function visitReport(rec) {
    const pl = rec.payload; const S = pl.summary;
    const pres = pl.products.filter(p => p.presented).sort((a, b) => b.dwell_sec - a.dwell_sec);
    const notPres = pl.products.filter(p => !p.presented);
    const cnt = s => pres.filter(p => p.signal === s).length;
    const qs = [...new Set(pres.flatMap(p => p.questions))];
    // διαδρομή: συγχώνευση διαδοχικών ίδιων, παράλειψη < 3″
    const segs = []; rec.path.forEach(p => { const dur = ((p.t1 || p.t0) - p.t0) / 1000; const l = segs[segs.length - 1]; if (l && l.id === p.id) l.d += dur; else segs.push({ id: p.id, title: p.title, model: p.model, d: dur }); });
    const segsV = segs.filter(s => s.d >= 3);
    const evs = rec.events;
    const evCount = t => evs.filter(e => e.type === t).length;
    const metrics = [...new Set(evs.filter(e => e.type === 'chart_metric').map(e => ({ cap: 'Ικανότητα', area: 'Κάλυψη', price: 'Τιμή' }[e.metric] || e.metric)))];
    // ευκαιρίες
    const opp = [];
    Object.values(C.SERIES).forEach(s => { if (!s.models.some(m => pres.find(p => p.model === m))) opp.push(`Δεν παρουσιάστηκε καθόλου η σειρά <b>${esc(s.name)}</b>.`); });
    pres.filter(p => p.signal === 'interest').forEach(p => opp.push(`<b>${esc(p.name)}</b>: ενδιαφέρον χωρίς αίτημα προσφοράς — follow-up με πρόταση.`));
    pres.filter(p => p.customer_top3 && p.signal !== 'offer').forEach(p => opp.push(`<b>${esc(p.name)}</b> είναι στο Top-3 του πελάτη αλλά δεν ζητήθηκε προσφορά.`));
    pres.filter(p => p.signal === 'reject' && p.initiated_by === 'customer').forEach(p => opp.push(`<b>${esc(p.name)}</b>: το ζήτησε ο ίδιος αλλά απέρριψε (${esc(lab(REASONS, p.reason))}) — αξίζει δεύτερη κουβέντα.`));
    return `<div class="rp">
      <div class="card" style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div><h3 style="font-size:20px">${esc(pl.customer.name)}</h3>
        <div class="sub" style="margin:2px 0 0">Κωδ. ${esc(pl.customer.code)} · Επίσκεψη ${esc(pl.visit_id)} · ${fmtDT(Date.parse(pl.started_at))}–${fmtT(Date.parse(pl.ended_at))} (${fmtDur(pl.duration_sec)}) · Πωλητής: ${esc(pl.rep.name)}</div></div>
        <div>${cnt('offer') ? `<span class="tag t-ok">${cnt('offer')} για προσφορά</span>` : ''}${cnt('interest') ? `<span class="tag t-int">${cnt('interest')} ⭐ ενδιαφέρον</span>` : ''}${cnt('reject') ? `<span class="tag t-no">${cnt('reject')} ✕</span>` : ''}${S.next_action.type !== 'NONE' ? `<span class="tag t-q">${esc(lab(NEXT, S.next_action.type))}${S.next_action.due ? ' έως ' + new Date(S.next_action.due).toLocaleDateString('el-GR') : ''}</span>` : ''}</div>
      </div>
      <div class="g g5" style="margin-top:14px">
        <div class="card kpi"><b>${fmtDur(pl.duration_sec)}</b><span>διάρκεια</span></div>
        <div class="card kpi"><b>${pres.length} / ${ORDER.length}</b><span>μοντέλα συζητήθηκαν</span></div>
        <div class="card kpi"><b>${cnt('offer')}</b><span>✓ θέλει προσφορά</span></div>
        <div class="card kpi"><b>${cnt('interest')}</b><span>⭐ ενδιαφέρον</span></div>
        <div class="card kpi"><b>${cnt('reject')}</b><span>✕ όχι</span></div>
      </div>
      <div class="sect">Η διαδρομή της παρουσίασης</div>
      <div class="card"><div class="path">${segsV.length ? segsV.map((s, i) => `${i ? '<span class="ar">→</span>' : ''}<div class="st ${s.model ? 'p' : ''}"><b>${esc(s.model ? P[s.model].name : s.title)}</b><i>${fmtDur(s.d)}</i></div>`).join('') : '<span class="sub">—</span>'}</div>
        <div class="sub" style="margin:10px 0 0">Αυτόματα: ${evCount('gallery_open')} φωτογραφίες · ${evCount('table_zoom')} μεγεθύνσεις πίνακα · ${evCount('usp_tap')} χαρακτηριστικά · ${evCount('compare_add')} προσθήκες στη σύγκριση${metrics.length ? ' · διάγραμμα: ' + metrics.join(', ') : ''}</div></div>
      <div class="sect">Αντίδραση ανά μοντέλο · και τα ${ORDER.length}</div>
      <div class="card"><table><thead><tr><th>Μοντέλο</th><th class="n">Λιανική</th><th class="n">Χρόνος</th><th>Αντίδραση</th><th>Χαρακτηριστικά</th><th>Ρώτησε για</th><th>Σημείωση</th></tr></thead><tbody>
        ${pres.concat(notPres).map(p => !p.presented ? `<tr style="color:#9ca3af"><td><b>${esc(p.name)}</b><div class="sub" style="margin:0">${esc(p.sku)}</div></td><td class="n">${esc(price(p.model))}</td><td class="n">${p.dwell_sec ? fmtDur(p.dwell_sec) : '—'}</td><td colspan="4"><span class="tag t-g">δεν παρουσιάστηκε</span></td></tr>` : `<tr><td><b>${esc(p.name)}</b>${p.initiated_by === 'customer' ? ' <span class="tag t-q">🙋 το ζήτησε</span>' : ''}${p.customer_top3 ? ` <span class="tag t-no">❤ #${p.customer_top3}</span>` : ''}${p.in_comparison ? ' <span class="tag t-g">σύγκριση</span>' : ''}<div class="sub" style="margin:0">${esc(p.sku)}</div></td>
          <td class="n">${esc(price(p.model))}</td><td class="n">${p.dwell_sec ? fmtDur(p.dwell_sec) : '—'}</td><td>${sigTag(p)}</td>
          <td>${p.aspects.map(a => `<span class="tag ${a.pol > 0 ? 't-ok' : 't-no'}">${a.pol > 0 ? '👍' : '👎'} ${esc(a.label)}</span>`).join('') || '—'}</td>
          <td>${p.questions.map(q => `<span class="tag t-q">${esc(lab(QUESTIONS, q))}</span>`).join('') || '—'}</td><td>${esc(p.note || '')}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="g g2" style="margin-top:14px">
        <div class="card"><h3>❤ Top-3 του πελάτη</h3><div class="sub">Επιλογή του ίδιου του καταστηματάρχη</div>
          ${rec.top3 && rec.top3.length ? rec.top3.map((m, i) => `<div style="display:flex;align-items:center;gap:10px;margin:6px 0"><b style="width:22px">${i + 1}.</b><img src="${pimg(m)}" style="height:40px;width:40px;object-fit:contain" alt=""><span>${esc(P[m].name)} · ${esc(price(m))}</span></div>`).join('') : '<div class="sub">Δεν ζητήθηκε.</div>'}</div>
        <div class="card"><h3>Ερωτήσεις του πελάτη</h3><div class="sub">Συγκεντρωτικά από όλα τα μοντέλα</div>
          ${qs.length ? qs.map(q => `<span class="tag t-q">${esc(lab(QUESTIONS, q))}</span>`).join('') : '<div class="sub">Καμία.</div>'}
          ${S.visit_note ? `<h3 style="margin-top:14px">Σημείωση επίσκεψης</h3><div>${esc(S.visit_note)}</div>` : ''}</div>
      </div>
      <div class="g g2" style="margin-top:14px">
        <div class="act"><b>Σύνοψη & επόμενο βήμα</b><div style="margin-top:6px">${esc(S.text || '—')}</div>
          <div style="margin-top:8px"><b>${esc(lab(NEXT, S.next_action.type))}</b>${S.next_action.due ? ' έως ' + new Date(S.next_action.due).toLocaleDateString('el-GR') : ''}</div></div>
        <div class="warn"><b>Ευκαιρίες / προσοχή</b>${opp.length ? `<ul>${opp.map(o => `<li>${o}</li>`).join('')}</ul>` : '<div style="margin-top:6px">Καμία.</div>'}</div>
      </div>
    </div>`;
  }

  function allReport(visits) {
    const n = visits.length;
    const avgDur = visits.reduce((s, v) => s + v.payload.duration_sec, 0) / n;
    const avgMod = visits.reduce((s, v) => s + v.payload.summary.models_presented, 0) / n;
    const withOffer = visits.filter(v => v.payload.summary.outcome === 'OFFER_REQUESTED').length;
    const rows = ORDER.map(m => {
      const ps = visits.map(v => v.payload.products.find(p => p.model === m)).filter(p => p && p.presented);
      const c = s => ps.filter(p => p.signal === s).length;
      const reasons = {}; ps.filter(p => p.signal === 'reject').forEach(p => reasons[p.reason] = (reasons[p.reason] || 0) + 1);
      const main = Object.entries(reasons).sort((a, b) => b[1] - a[1])[0];
      return { m, pres: ps.length, offer: c('offer'), int: c('interest'), rej: c('reject'), top3: ps.filter(p => p.customer_top3).length, cust: ps.filter(p => p.initiated_by === 'customer').length,
        dwell: ps.length ? ps.reduce((s, p) => s + p.dwell_sec, 0) / ps.length : 0, main: main ? lab(REASONS, main[0]) : '—' };
    });
    const allRej = visits.flatMap(v => v.payload.products.filter(p => p.signal === 'reject'));
    const rc = {}; allRej.forEach(p => rc[p.reason] = (rc[p.reason] || 0) + 1);
    const rmax = Math.max(1, ...Object.values(rc));
    const asp = {}; visits.forEach(v => v.payload.products.forEach(p => (p.aspects || []).forEach(a => { const k = p.name + ' · ' + a.label; asp[k] = asp[k] || { pos: 0, neg: 0 }; a.pol > 0 ? asp[k].pos++ : asp[k].neg++; })));
    const aspTop = Object.entries(asp).sort((a, b) => (b[1].pos + b[1].neg) - (a[1].pos + a[1].neg)).slice(0, 8);
    return `<div class="rp">
      <div class="card"><h3 style="font-size:18px">Συγκεντρωτική αναφορά · όλα τα μοντέλα</h3><div class="sub" style="margin:0">Όλες οι ολοκληρωμένες επισκέψεις σε αυτό το tablet (demo). Στην παραγωγή: όλο το πελατολόγιο, με φίλτρα περιοχή / κατηγορία / πωλητή και σύνδεση με παραγγελίες Entersoft.</div></div>
      <div class="g g5" style="margin-top:14px">
        <div class="card kpi"><b>${n}</b><span>επισκέψεις</span></div>
        <div class="card kpi"><b>${fmtDur(avgDur)}</b><span>μέση διάρκεια</span></div>
        <div class="card kpi"><b>${avgMod.toFixed(1).replace('.', ',')}</b><span>μοντέλα / επίσκεψη</span></div>
        <div class="card kpi"><b>${Math.round(withOffer / n * 100)}%</b><span>επισκέψεις με αίτημα προσφοράς</span></div>
        <div class="card kpi"><b>${visits.filter(v => v.top3 && v.top3.length).length}</b><span>με Top-3 πελάτη</span></div>
      </div>
      <div class="sect">Ανά μοντέλο</div>
      <div class="card"><table><thead><tr><th>Μοντέλο</th><th class="n">Λιανική</th><th class="n">Παρουσιάστηκε</th><th class="n">Μέσος χρόνος</th><th class="n">✓</th><th class="n">⭐</th><th class="n">✕</th><th class="n">🙋</th><th class="n">❤ Top-3</th><th>Κύριος λόγος ✕</th></tr></thead><tbody>
        ${rows.map(r => `<tr${r.pres ? '' : ' style="color:#9ca3af"'}><td><b>${esc(P[r.m].name)}</b></td><td class="n">${esc(price(r.m))}</td><td class="n">${r.pres}</td><td class="n">${r.pres ? fmtDur(r.dwell) : '—'}</td><td class="n">${r.offer}</td><td class="n">${r.int}</td><td class="n">${r.rej}</td><td class="n">${r.cust}</td><td class="n">${r.top3}</td><td>${esc(r.main)}</td></tr>`).join('')}
      </tbody></table></div>
      <div class="g g2" style="margin-top:14px">
        <div class="card"><h3>Γιατί λένε όχι</h3><div class="sub">${allRej.length} απορρίψεις</div>
          ${Object.keys(rc).length ? Object.entries(rc).sort((a, b) => b[1] - a[1]).map(([c, v]) => `<div class="bar"><span>${esc(lab(REASONS, c))}</span><div class="tr"><i style="width:${v / rmax * 100}%"></i></div><em>${v}</em></div>`).join('') : '<div class="sub">Καμία ακόμα.</div>'}</div>
        <div class="card"><h3>Χαρακτηριστικά που σχολιάστηκαν</h3><div class="sub">👍 / 👎 του πωλητή</div>
          ${aspTop.length ? `<table><tbody>${aspTop.map(([k, v]) => `<tr><td>${esc(k)}</td><td class="n"><span class="tag t-ok">👍 ${v.pos}</span><span class="tag t-no">👎 ${v.neg}</span></td></tr>`).join('')}</tbody></table>` : '<div class="sub">Κανένα ακόμα.</div>'}</div>
      </div>
      <div class="sect">Επισκέψεις</div>
      <div class="card"><table><thead><tr><th>Ημερομηνία</th><th>Πελάτης</th><th class="n">Διάρκεια</th><th class="n">Μοντέλα</th><th>Αποτέλεσμα</th><th></th></tr></thead><tbody>
        ${visits.map((v, i) => [v, i]).reverse().map(([v, i]) => `<tr><td>${fmtDT(Date.parse(v.payload.started_at))}</td><td>${esc(v.payload.customer.name)}</td><td class="n">${fmtDur(v.payload.duration_sec)}</td><td class="n">${v.payload.summary.models_presented}</td><td>${{ OFFER_REQUESTED: '<span class="tag t-ok">Αίτημα προσφοράς</span>', INTEREST: '<span class="tag t-int">Ενδιαφέρον</span>', NO_INTEREST: '<span class="tag t-g">Χωρίς ενδιαφέρον</span>' }[v.payload.summary.outcome]}</td><td><button class="rp-btn" data-rvis="${i}" style="background:#fff;color:#16181d;border-color:#d1d5db">Άνοιγμα</button></td></tr>`).join('')}
      </tbody></table>
      <div style="margin-top:12px"><button class="rp-btn" data-rclear style="background:#fff;color:#d7141e;border-color:#f3b4b8">Διαγραφή demo επισκέψεων</button></div></div>
    </div>`;
  }

  /* ---------------- εκκίνηση ---------------- */
  function boot() { if (!document.body.classList.contains('ready')) { setTimeout(boot, 300); return; } openStart(); }
  boot();
  addEventListener('beforeunload', () => { if (V && V.status === 'live') { closePath(); save(); } });
})();
