/* ---- Γλωσσάρι: μεγάλο παράθυρο διαλόγου με ευρετήριο ΕΛ / EN + αναζήτηση ---- */
(() => {
  const G = window.GLOSSARY || [];
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ς/g, 'σ');
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  // κάθε όρος εμφανίζεται 2 φορές: μία στα Ελληνικά, μία στα Αγγλικά
  const items = [];
  G.forEach((g, i) => { items.push({ i, lang: 'el', name: g.el, other: g.en }); items.push({ i, lang: 'en', name: g.en, other: g.el }); });
  items.forEach(it => { it.key = norm(it.name); it.hay = norm(it.name + ' ' + it.other + ' ' + G[it.i].t.join(' ')); });
  const byLang = l => items.filter(x => x.lang === l).sort((a, b) => a.name.localeCompare(b.name, l === 'el' ? 'el' : 'en', { sensitivity: 'base', numeric: true }));
  const SORTED = { el: byLang('el'), en: byLang('en') };

  const BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 11.5h5"/></svg>';

  // κουμπί πάνω από το navigation
  const nav = document.querySelector('.nav');
  const btn = document.createElement('button');
  btn.className = 'glo-btn'; btn.type = 'button'; btn.title = 'Γλωσσάρι'; btn.setAttribute('aria-label', 'Γλωσσάρι'); btn.innerHTML = BOOK + '<b>ΓΛΩΣΣΑΡΙ</b>';
  nav.insertBefore(btn, nav.firstChild);

  const ov = document.createElement('div');
  ov.className = 'glo'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Γλωσσάρι');
  ov.innerHTML = `<div class="glo-win">
    <header class="glo-hd"><span class="glo-ic">${BOOK}</span><div><div class="glo-k">Τεχνική ορολογία</div><h2>Γλωσσάρι</h2></div>
      <span class="glo-cnt">${G.length} όροι · ${items.length} λήμματα</span><button class="glo-x" aria-label="Κλείσιμο">×</button></header>
    <div class="glo-body">
      <aside class="glo-side">
        <label class="glo-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>
          <input type="search" placeholder="Αναζήτηση όρου · Search term" autocomplete="off" spellcheck="false"><button class="glo-clr" aria-label="Καθαρισμός">×</button></label>
        <div class="glo-tabs" role="tablist"><button data-l="all" class="on">Όλα</button><button data-l="el">Ελληνικά</button><button data-l="en">English</button><i></i></div>
        <div class="glo-list" tabindex="-1"></div>
      </aside>
      <article class="glo-det"></article>
    </div></div>`;
  document.body.appendChild(ov);
  const $ = s => ov.querySelector(s);
  const list = $('.glo-list'), det = $('.glo-det'), inp = $('.glo-search input');
  let lang = 'all', sel = null, open = false;

  function renderList() {
    const q = norm(inp.value.trim());
    const langs = lang === 'all' ? ['el', 'en'] : [lang];
    let html = '', first = null;
    const row = x => { const id = x.i + ':' + x.lang; first = first || id;
      return `<button class="glo-it${sel === id ? ' on' : ''}" data-id="${id}"><span class="glo-n">${esc(x.name)}</span><span class="glo-o">${esc(x.other)}</span><em>${x.lang.toUpperCase()}</em></button>`; };
    if (q) {
      // αναζήτηση: μία λίστα, πρώτα όσοι ταιριάζουν στο όνομα, μετά στη μετάφραση, μετά στο κείμενο
      const score = x => x.key.startsWith(q) ? 4 : x.key.split(/[\s()·/-]+/).some(w => w.startsWith(q)) ? 3 : x.key.includes(q) ? 2.5 : norm(x.other).includes(q) ? 2 : x.hay.includes(q) ? 1 : 0;
      const arr = items.filter(x => langs.includes(x.lang)).map(x => [score(x), x]).filter(a => a[0] > 0)
        .sort((a, b) => b[0] - a[0] || a[1].name.localeCompare(b[1].name, 'el'));
      if (arr.length) { html += `<div class="glo-lh">ΑΠΟΤΕΛΕΣΜΑΤΑ · RESULTS <span>${arr.length}</span></div>`; arr.forEach(a => html += row(a[1])); }
    } else langs.forEach(l => {
      const arr = SORTED[l];
      if (lang === 'all') html += `<div class="glo-lh">${l === 'el' ? 'ΕΛΛΗΝΙΚΑ' : 'ENGLISH'} <span>${arr.length}</span></div>`;
      let letter = '';
      arr.forEach(x => {
        const L = x.key.replace(/[^a-zα-ω0-9]/g, '').charAt(0).toUpperCase();
        if (L && L !== letter) { letter = L; html += `<div class="glo-let">${/[0-9]/.test(L) ? '#' : L}</div>`; }
        html += row(x);
      });
    });
    list.innerHTML = html || `<div class="glo-none">Δεν βρέθηκε όρος για «${esc(inp.value)}».<br><span>No term found.</span></div>`;
    return { first };
  }

  function show(id) {
    sel = id;
    const [i, l] = id.split(':'); const g = G[+i]; const isEl = l === 'el';
    const name = isEl ? g.el : g.en, tr = isEl ? g.en : g.el;
    det.innerHTML = `<div class="glo-lang">${isEl ? 'ΕΛΛΗΝΙΚΟΣ ΟΡΟΣ' : 'ENGLISH TERM'}</div>
      <h3>${esc(name)}</h3>
      <div class="glo-tr"><span>${isEl ? 'EN' : 'ΕΛ'}</span><b>${esc(tr)}</b><small>${isEl ? 'English translation' : 'Ελληνική απόδοση'}</small></div>
      <div class="glo-txt">${g.t.map(p => `<p>${esc(p)}</p>`).join('')}</div>
      <div class="glo-pg"><div class="glo-pgh">Το συναντάμε στις σελίδες</div>${g.s.map(n => `<button data-go="${n}">${String(n).padStart(2, '0')} <span>${esc(slideTitle(n))}</span></button>`).join('')}</div>`;
    det.scrollTop = 0; det.classList.remove('in'); void det.offsetWidth; det.classList.add('in');
    list.querySelectorAll('.glo-it').forEach(b => b.classList.toggle('on', b.dataset.id === id));
    const on = list.querySelector('.glo-it.on'); on && on.scrollIntoView({ block: 'nearest' });
  }
  const slides = [...document.querySelectorAll('#stage > section.slide, section.slide')];
  const slideTitle = n => (slides[n - 1] && slides[n - 1].dataset.title || '').replace(/&amp;/g, '&');

  function refresh(keepSel) {
    const r = renderList();
    const vis = [...list.querySelectorAll('.glo-it')].map(b => b.dataset.id);
    if (!(keepSel && sel && vis.includes(sel))) { if (r.first) show(r.first); else det.innerHTML = '<div class="glo-empty">Πληκτρολογήστε έναν όρο στα Ελληνικά ή στα Αγγλικά.</div>'; }
  }

  function openG() {
    open = true; ov.classList.add('on'); document.body.classList.add('glo-open');
    refresh(true); setTimeout(() => inp.focus({ preventScroll: true }), 250);
  }
  function closeG() { open = false; ov.classList.remove('on'); document.body.classList.remove('glo-open'); inp.blur(); }

  btn.addEventListener('click', openG);
  $('.glo-x').addEventListener('click', closeG);
  ov.addEventListener('click', e => { if (e.target === ov) closeG(); });
  list.addEventListener('click', e => { const b = e.target.closest('.glo-it'); if (b) show(b.dataset.id); });
  det.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) { closeG(); window.go && window.go(+b.dataset.go - 1); } });
  inp.addEventListener('input', () => refresh(false));
  $('.glo-clr').addEventListener('click', () => { inp.value = ''; refresh(true); inp.focus(); });
  $('.glo-tabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; lang = b.dataset.l;
    $('.glo-tabs').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
    $('.glo-tabs').style.setProperty('--x', [...$('.glo-tabs').querySelectorAll('button')].indexOf(b));
    refresh(true);
  });

  // πληκτρολόγιο: όσο είναι ανοιχτό, η παρουσίαση δεν αλλάζει σελίδα
  addEventListener('keydown', e => {
    if (!open) return;
    e.stopImmediatePropagation();
    if (e.key === 'Escape') { e.preventDefault(); closeG(); return; }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || (e.key === 'Enter' && document.activeElement === inp)) {
      const ids = [...list.querySelectorAll('.glo-it')].map(b => b.dataset.id); if (!ids.length) return;
      e.preventDefault(); let k = ids.indexOf(sel);
      if (e.key === 'ArrowDown') k = Math.min(ids.length - 1, k + 1); else if (e.key === 'ArrowUp') k = Math.max(0, k - 1); else k = Math.max(0, k);
      show(ids[k]);
    } else if (['PageDown', 'PageUp'].includes(e.key) && document.activeElement !== inp) e.preventDefault();
  }, true);
  ['wheel', 'touchstart', 'touchmove', 'touchend'].forEach(t => {
    addEventListener(t, e => { if (open && !ov.contains(e.target)) e.stopImmediatePropagation(); }, { capture: true, passive: true });
    ov.addEventListener(t, e => e.stopPropagation(), { passive: true });
  });
  // συντόμευση: G ανοίγει το γλωσσάρι (εκτός TRIVIA)
  addEventListener('keydown', e => {
    if (open || e.ctrlKey || e.metaKey || e.altKey) return;
    if ((e.key === 'g' || e.key === 'G' || e.key === 'γ' || e.key === 'Γ') && document.body.dataset.mood !== 'quiz' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); openG(); }
  });
})();
