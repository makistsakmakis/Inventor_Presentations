/* Welcome Stores · v5 — Προϊοντική (Γ. Λαζαρίδου): πλακίδια που γυρίζουν
   (hover/κλικ εδώ· Page Down/Up μέσω app.js → tileNav) */
(window.WS_EXT = window.WS_EXT || []).push(api => {
  'use strict';
  const { hooks, $$ } = api;
  $$('.slide.ptiles').forEach(s => {
    const key = s.classList[1], tiles = $$('.ptile', s);
    tiles.forEach(t => {
      t.addEventListener('mouseenter', () => t.classList.add('done'));
      t.addEventListener('click', () => { t.classList.toggle('flipped'); t.classList.add('done'); });
    });
    const prev = hooks[key] || {};
    hooks[key] = Object.assign({}, prev, {
      enter() { prev.enter && prev.enter(); tiles.forEach(t => t.classList.remove('flipped', 'done')); }
    });
  });
});
