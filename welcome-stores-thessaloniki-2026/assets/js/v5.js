/* Welcome Stores · v5 — Προϊοντική: πλακίδια που γυρίζουν (ίδια λογική με την υπόλοιπη παρουσίαση) */
(window.WS_EXT = window.WS_EXT || []).push(api => {
  'use strict';
  const { hooks, later, $$ } = api;
  $$('.slide.ptiles').forEach(s => {
    const key = s.classList[1], tiles = $$('.ptile', s);
    tiles.forEach(t => {
      t.addEventListener('mouseenter', () => t.classList.add('done'));
      t.addEventListener('click', () => { t.classList.toggle('flipped'); t.classList.add('done'); });
    });
    const prev = hooks[key] || {};
    hooks[key] = Object.assign({}, prev, {
      enter() {
        prev.enter && prev.enter();
        tiles.forEach(t => t.classList.remove('flipped', 'done'));
        /* αυτόματη «ξενάγηση»: κάθε πλακίδιο γυρίζει διαδοχικά και επιστρέφει */
        tiles.forEach((t, i) => {
          later(() => { t.classList.add('flipped', 'done'); }, 1600 + i * 1500);
          later(() => { t.classList.remove('flipped'); }, 1600 + i * 1500 + 1300);
        });
      },
      leave() { prev.leave && prev.leave(); tiles.forEach(t => t.classList.remove('flipped')); }
    });
  });
});
