/* fit.js · Οκτ. 2026 — η πίσω όψη κάθε πλακιδίου γεμίζει ~85% με το κείμενό της.
   Τίτλος (πίσω όψη) = 2× μέγεθος κειμένου. Κείμενα 1–2 γραμμών δεν μεγαλώνουν (δεν γίνεται). */
(() => {
  'use strict';
  const FILL = .85, MAXF = 64;
  function fitBack(B) {
    const cs = getComputedStyle(B);
    const availH = B.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (availH < 20) return;
    const title = B.querySelector(':scope > .bk-t');
    const body = B.querySelector(':scope > .bk-b');
    const parts = [...B.children].filter((c) => c !== title);           // ό,τι δεν είναι τίτλος
    const target = body || B;
    // αρχικό μέγεθος & πλήθος γραμμών
    target.style.fontSize = ''; if (title) title.style.fontSize = '';
    const base = parseFloat(getComputedStyle(body || parts[0] || B).fontSize);
    const lh = parseFloat(getComputedStyle(body || parts[0] || B).lineHeight) || base * 1.4;
    const bodyH = body ? body.offsetHeight : parts.reduce((s, c) => s + c.offsetHeight, 0);
    const lines = bodyH / lh;
    const total = () => {
      let h = 0; for (const c of B.children) { const s = getComputedStyle(c); h += c.offsetHeight + parseFloat(s.marginTop) + parseFloat(s.marginBottom); } return h;
    };
    const fits = () => total() <= availH * FILL + .5 && [...B.querySelectorAll('*')].concat(B).every((e) => e.scrollWidth <= e.clientWidth + 1 || !e.clientWidth);
    const apply = (f) => { target.style.fontSize = f + 'px'; if (title) title.style.fontSize = (2 * f) + 'px'; };
    B.classList.add('fitted');
    if (lines <= 2.2) {                         // σύντομο κείμενο: μόνο ο τίτλος στο 2×, χωρίς μεγέθυνση
      apply(base); let tf = 2 * base; while (!fits() && title && tf > base) { tf -= .5; title.style.fontSize = tf + 'px'; }
      return;
    }
    apply(base);
    if (!fits()) {                              // ούτε στο βασικό μέγεθος δεν χωράει τίτλος 2×: κρατάμε το κείμενο, μικραίνουμε τον τίτλο
      let tf = 2 * base; while (!fits() && tf > base) { tf -= .5; if (title) title.style.fontSize = tf + 'px'; else break; }
      let f = base; while (total() > availH && f > 9) { f -= .5; target.style.fontSize = f + 'px'; if (title) title.style.fontSize = Math.min(tf, 2 * f) + 'px'; }   // μόνο αν ξεχειλίζει
      return;
    }
    let lo = base, hi = MAXF;
    for (let k = 0; k < 18; k++) { const m = (lo + hi) / 2; apply(m); if (fits()) lo = m; else hi = m; }
    apply(Math.floor(lo * 2) / 2);
  }
  const run = () => document.querySelectorAll('.flip .face.back, .minif .face.back').forEach(fitBack);
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(run, 50));
  addEventListener('load', () => setTimeout(run, 100));
})();
