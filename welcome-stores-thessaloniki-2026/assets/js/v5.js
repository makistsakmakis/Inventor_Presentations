/* Welcome Stores · v5 — Προϊοντική (Γ. Λαζαρίδου): πλακίδια που γυρίζουν + κινούμενα εικονίδια */
(window.WS_EXT = window.WS_EXT || []).push(api => {
  'use strict';
  const { hooks, later, $, $$ } = api;
  $$('.slide.ptiles').forEach(s => {
    const key = s.classList[1], tiles = $$('.ptile', s), hold = +(s.dataset.hold || 0);
    tiles.forEach(t => {
      t.addEventListener('mouseenter', () => t.classList.add('done'));
      t.addEventListener('click', () => { t.classList.toggle('flipped'); t.classList.add('done'); });
    });
    const prev = hooks[key] || {};
    hooks[key] = Object.assign({}, prev, {
      enter() {
        prev.enter && prev.enter();
        tiles.forEach(t => t.classList.remove('flipped', 'done'));
        if (hold) {   /* ένα πλακίδιο: γυρίζει και μένει για να διαβαστεί, μετά επιστρέφει */
          later(() => tiles.forEach(t => t.classList.add('flipped', 'done')), 2200);
          later(() => tiles.forEach(t => t.classList.remove('flipped')), 2200 + hold);
          return;
        }
        /* αυτόματη «ξενάγηση»: κάθε πλακίδιο γυρίζει διαδοχικά και επιστρέφει */
        tiles.forEach((t, i) => {
          later(() => t.classList.add('flipped', 'done'), 1800 + i * 2600);
          later(() => t.classList.remove('flipped'), 1800 + i * 2600 + 2200);
        });
      },
      leave() { prev.leave && prev.leave(); tiles.forEach(t => t.classList.remove('flipped')); }
    });
  });

  /* τηλεχειριστήριο: 21 → 28 → 21 … */
  const rmT = $('.remote .rm-t'), rm = $('.remote');
  if (rmT) {
    let iv = null, v = 21, d = 1;
    const tick = () => {
      v += d; if (v >= 28) { v = 28; d = -1; } else if (v <= 21) { v = 21; d = 1; }
      rmT.textContent = v; rm.classList.toggle('dn', d < 0); rm.classList.remove('blink'); void rm.offsetWidth; rm.classList.add('blink');
    };
    const prev = hooks.pr73 || {};
    hooks.pr73 = Object.assign({}, prev, {
      enter() { prev.enter && prev.enter(); clearInterval(iv); v = 21; d = 1; rmT.textContent = v; iv = setInterval(tick, 750); },
      leave() { prev.leave && prev.leave(); clearInterval(iv); iv = null; }
    });
  }
});
