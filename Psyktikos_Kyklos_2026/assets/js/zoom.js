/* ---- Ζουμ στις κύριες φωτογραφίες (slides 11, 13, 18, 24, 25) ----
   Κλικ στη φωτογραφία (ή στο κουμπί μεγεθυντικού στις ασκήσεις) → πλήρης οθόνη.
   Μέσα: ροδέλα / pinch = ζουμ, σύρσιμο = μετακίνηση, διπλό κλικ = ζουμ ×2.5 / επαναφορά.
   Χ πάνω δεξιά, Esc ή κλικ στο φόντο = κλείσιμο & επαναφορά. */
(() => {
  const TARGETS = ['#s-fourway', '#s-refrigerant', '#s-inverter', '#s-ex1', '#s-ex2'];
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21M10.5 7.5v6M7.5 10.5h6"/></svg>';
  const lb = document.createElement('div');
  lb.className = 'zlb';
  lb.innerHTML = `<div class="zlb-vp"><img alt="" draggable="false"></div>
    <button class="zlb-x" aria-label="Κλείσιμο">×</button>
    <div class="zlb-bar"><button data-z="-1" aria-label="Σμίκρυνση">−</button><span class="zlb-p">100%</span><button data-z="1" aria-label="Μεγέθυνση">+</button><button data-z="0" class="zlb-r">Επαναφορά</button></div>`;
  document.body.appendChild(lb);
  const vp = lb.querySelector('.zlb-vp'), im = vp.querySelector('img'), pct = lb.querySelector('.zlb-p');
  let z = 1, x = 0, y = 0, open = false;
  const MAX = 5;
  const clamp = () => {
    const w = im.offsetWidth * z, h = im.offsetHeight * z, W = vp.clientWidth, H = vp.clientHeight;
    const mx = Math.max(0, (w - W) / 2), my = Math.max(0, (h - H) / 2);
    x = Math.min(mx, Math.max(-mx, x)); y = Math.min(my, Math.max(-my, y));
  };
  const apply = (anim) => {
    clamp();
    im.style.transition = anim ? 'transform .35s cubic-bezier(.2,.8,.2,1)' : 'none';
    im.style.transform = `translate(${x}px,${y}px) scale(${z})`;
    pct.textContent = Math.round(z * 100) + '%';
    lb.classList.toggle('zoomed', z > 1.01);
  };
  // ζουμ γύρω από σημείο (clientX/Y)
  const zoomAt = (nz, cx, cy, anim) => {
    nz = Math.min(MAX, Math.max(1, nz));
    const r = vp.getBoundingClientRect(), px = cx - (r.left + r.width / 2), py = cy - (r.top + r.height / 2);
    x = px - (px - x) * (nz / z); y = py - (py - y) * (nz / z); z = nz; apply(anim);
  };
  const reset = (anim = true) => { z = 1; x = 0; y = 0; apply(anim); };
  // η φωτογραφία γεμίζει την οθόνη (92% × 84%), ακόμα κι αν είναι μικρότερη
  const fit = () => {
    const nw = im.naturalWidth || 1, nh = im.naturalHeight || 1, k = Math.min(innerWidth * .92 / nw, innerHeight * .84 / nh);
    im.style.width = Math.round(nw * k) + 'px'; im.style.height = Math.round(nh * k) + 'px';
  };
  im.addEventListener('load', () => { fit(); apply(false); });
  function show(src, alt) {
    im.src = src; im.alt = alt || ''; if (im.complete) fit(); reset(false);
    open = true; lb.classList.add('on'); document.body.classList.add('zlb-open');
  }
  function hide() { open = false; lb.classList.remove('on'); document.body.classList.remove('zlb-open'); setTimeout(() => reset(false), 300); }

  // εκκίνηση από τα slides
  TARGETS.forEach(sel => {
    const sec = document.querySelector(sel); if (!sec) return;
    const fr = sec.querySelector('.frame'); const img = fr && fr.querySelector('img'); if (!img) return;
    const ex = fr.classList.contains('exphoto');
    const b = document.createElement('button');
    b.className = 'zbtn'; b.type = 'button'; b.title = 'Μεγέθυνση φωτογραφίας'; b.innerHTML = ICON;
    b.addEventListener('pointerdown', e => e.stopPropagation());
    b.addEventListener('click', e => { e.stopPropagation(); show(img.currentSrc || img.src, img.alt); });
    fr.appendChild(b); fr.classList.add('zoomable');
    // στις ασκήσεις το κλικ στη φωτογραφία τοποθετεί εξάρτημα, οπότε ζουμ μόνο από το κουμπί
    if (!ex) { fr.classList.add('zclick'); fr.addEventListener('click', () => show(img.currentSrc || img.src, img.alt)); }
  });

  // χειρισμοί μέσα στο lightbox
  lb.querySelector('.zlb-x').addEventListener('click', hide);
  lb.querySelector('.zlb-bar').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const r = vp.getBoundingClientRect(), d = +b.dataset.z;
    if (d === 0) reset(); else zoomAt(z * (d > 0 ? 1.5 : 1 / 1.5), r.left + r.width / 2, r.top + r.height / 2, true);
  });
  vp.addEventListener('wheel', e => { e.preventDefault(); zoomAt(z * Math.exp(-e.deltaY * 0.0022), e.clientX, e.clientY, false); }, { passive: false });
  vp.addEventListener('dblclick', e => { if (z > 1.01) reset(); else zoomAt(2.5, e.clientX, e.clientY, true); });
  // σύρσιμο & pinch
  const pts = new Map(); let last = null, pinch = null, moved = false;
  vp.addEventListener('pointerdown', e => { vp.setPointerCapture(e.pointerId); pts.set(e.pointerId, e); moved = false; last = { x: e.clientX, y: e.clientY };
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), z }; } });
  vp.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, e);
    if (pts.size === 2 && pinch) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      zoomAt(pinch.z * d / pinch.d, (a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2, false); moved = true; return; }
    if (last && z > 1.01) { x += e.clientX - last.x; y += e.clientY - last.y; apply(false); }
    if (last && Math.hypot(e.clientX - last.x, e.clientY - last.y) > 3) moved = true;
    last = { x: e.clientX, y: e.clientY };
  });
  const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = null; if (!pts.size) last = null; };
  vp.addEventListener('pointerup', up); vp.addEventListener('pointercancel', up);
  // κλικ στο φόντο (όχι στη φωτό) = κλείσιμο
  vp.addEventListener('click', e => { if (!moved && e.target === vp && z <= 1.01) hide(); });

  // όσο είναι ανοιχτό, η παρουσίαση δεν αλλάζει σελίδα
  addEventListener('keydown', e => {
    if (!open) return;
    e.stopImmediatePropagation();
    if (e.key === 'Escape') { e.preventDefault(); hide(); }
    else if (e.key === '+' || e.key === '=') zoomAt(z * 1.5, innerWidth / 2, innerHeight / 2, true);
    else if (e.key === '-') zoomAt(z / 1.5, innerWidth / 2, innerHeight / 2, true);
    else if (e.key === '0') reset();
    else if (['PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' ', 'Home', 'End'].includes(e.key)) e.preventDefault();
  }, true);
  // ροδέλα/αφή εκτός lightbox μπλοκάρονται· μέσα σε αυτό δεν φτάνουν ποτέ στην πλοήγηση
  ['wheel', 'touchstart', 'touchmove', 'touchend'].forEach(t => {
    addEventListener(t, e => { if (open && !lb.contains(e.target)) e.stopImmediatePropagation(); }, { capture: true, passive: true });
    lb.addEventListener(t, e => e.stopPropagation(), { passive: true });
  });
  addEventListener('resize', () => { if (open) { fit(); apply(false); } });
})();
