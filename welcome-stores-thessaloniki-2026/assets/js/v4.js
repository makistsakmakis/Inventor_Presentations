/* Welcome Stores · v4 (Οκτ. 2026) — φορτώνεται μετά το v2.js και πριν το app.js */
(window.WS_EXT = window.WS_EXT || []).push(api => {
  'use strict';
  const { hooks, $ } = api;

/* ---- σελ. 34: μεγάλα, «ανακατεμένα» πλαίσια στο κάτω μέρος
        (τα πλαίσια επικαλύπτονται τυχαία, τα κείμενα ποτέ) ---- */
(() => {
  const host = document.getElementById('chips34'); if (!host) return;
  // κείμενο, μέγεθος γραμμάτων, padding x, padding y, απόχρωση πλαισίου
  const BOT = [
    ['Google search', 40, 48, 30, 'w'], ['Social Media Ads', 36, 44, 28, 'b'], ['Κατάστημα', 38, 46, 34, 'w'],
    ['Site κατασκευαστή', 30, 40, 26, 'g'], ['YouTube & Creators', 30, 38, 24, 'b'], ['Online shop', 34, 44, 30, 'g'],
    ['Σύγκριση τιμών', 28, 36, 26, 'b'], ['Price comparison', 24, 34, 22, 'w'], ['Marketplaces', 27, 36, 30, 'g'],
    ['Instagram', 25, 34, 24, 'w'], ['Reviews', 26, 40, 30, 'b'], ['TikTok', 28, 42, 28, 'g'], ['Influencers', 24, 32, 22, 'w'],
    ['Τηλεόραση', 38, 50, 32, 'g'], ['AI βοηθός', 36, 46, 30, 'b'], ['Ραδιόφωνο', 30, 40, 26, 'w'], ['Newsletter', 26, 36, 24, 'g'],
    ['Outdoor', 29, 44, 30, 'b'], ['Forums', 23, 36, 22, 'w'], ['Print', 25, 40, 26, 'g']
  ];
  const R = { x0: 80, x1: 1790, y0: 604, y1: 1004 };          // ζώνη κάτω μέρους (συντεταγμένες σκηνής 1920×1080)
  let seed = 20261010; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
  const hit = (a, b, m = 0) => a.x < b.x + b.w + m && b.x < a.x + a.w + m && a.y < b.y + b.h + m && b.y < a.y + a.h + m;
  const area = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

  const bot = BOT.map(([t, fs, px, py, tone], i) =>
    `<span class="mx mx-${tone}" style="font-size:${fs}px;padding:${py}px ${px}px;--cd:${1900 + i * 90}ms;--fl:${(rnd() * 8 + 4).toFixed(1)}s;--fa:${(rnd() * 3 + 2).toFixed(1)}px">${t}</span>`).join('');
  host.innerHTML = bot;

  const layout = (s0 = 20261010, tries = 0) => {
    seed = s0; let ok = true;
    const all = [...host.querySelectorAll('.mx')];
    const placed = [];                                       // {box, txt}
    const order = all.map((el, i) => i).sort((a, b) => BOT[b][1] - BOT[a][1]);
    order.forEach(i => { const el = all[i];
      const w = el.offsetWidth, h = el.offsetHeight, [, , px, py] = BOT[i];
      let best = null, bestScore = -1e9;
      for (let k = 0; k < 2600; k++) {
        const x = R.x0 + rnd() * (R.x1 - R.x0 - w), y = R.y0 + rnd() * (R.y1 - R.y0 - h);
        const box = { x, y, w, h }, txt = { x: x + px - 4, y: y + py - 6, w: w - 2 * px + 8, h: h - 2 * py + 12 };
        // κανένα κείμενο δεν τέμνεται από άλλο πλαίσιο (ούτε το δικό μας κείμενο από ξένο πλαίσιο)
        if (placed.some(p => hit(txt, p.box, 6) || hit(box, p.txt, 6))) continue;
        const ov = placed.reduce((s, p) => s + area(box, p.box), 0);
        const touches = placed.filter(p => hit(box, p.box)).length;
        // θέλουμε μέτρια επικάλυψη πλαισίων και καλή κάλυψη της ζώνης
        const cx = x + w / 2, cy = y + h / 2;
        const near = placed.length ? Math.min(...placed.map(p => Math.hypot((p.box.x + p.box.w / 2 - cx) * .8, (p.box.y + p.box.h / 2 - cy) * 1.6))) : 0;
        // κάλυψη: προτιμάμε θέσεις μακριά από τα ήδη τοποθετημένα κέντρα, αλλά με επαφή πλαισίων
        const score = (touches ? 900 : 0) - Math.abs(ov - w * h * .1) / 40 - (touches > 2 ? 900 : 0) + Math.min(near, 420) * 2.2 + rnd() * 80;
        if (score > bestScore) { bestScore = score; best = { box, txt }; }
      }
      if (!best) { ok = false; best = { box: { x: R.x0, y: R.y0, w, h }, txt: { x: 0, y: 0, w: 0, h: 0 } }; }
      placed.push(best);
      el.style.left = Math.round(best.box.x) + 'px'; el.style.top = Math.round(best.box.y) + 'px';
      el.style.zIndex = String(1 + Math.floor(rnd() * 5));
    });
    if (!ok && tries < 40) layout(s0 + 7919, tries + 1);      // δοκίμασε άλλη «τυχαία» διάταξη μέχρι να χωρέσουν όλα καθαρά
  };
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(() => layout()));
  window.addEventListener('load', () => requestAnimationFrame(() => layout()));
})();

/* ---- σελ. 36: φωτορεαλιστικό εργαστήριο — 2 συστατικά → σκούρο μωβ, αργό 3D κύμα, μαγικός καπνός ---- */
(() => {
  const lab = document.getElementById('lab36v4'); if (!lab) return;
  const sec = lab.closest('.slide');
  const q = s => lab.querySelector(s);
  const lvR = q('.fn4.r .lv'), sfR = q('.fn4.r .sf'), lvB = q('.fn4.b .lv'), sfB = q('.fn4.b .sf');
  const T = id => { const g = document.getElementById(id), lq = g.querySelector('.t-lq'), bb = g.querySelector('.t-bb'); return { lq, bb, L: lq.getTotalLength(), fill: 0, op: 0 }; };
  const TR = T('tubeR4'), TB = T('tubeB4');
  [TR, TB].forEach(t => { t.lq.style.strokeDasharray = `${t.L} ${t.L}`; t.lq.style.strokeDashoffset = t.L; });
  const S = 1.5;
  const lc = q('.liq4').getContext('2d'), sc = q('.smoke4').getContext('2d');
  lc.setTransform(S, 0, 0, S, 0, 0); sc.setTransform(S, 0, 0, S, 0, 0);
  const R_ = (a, b) => a + Math.random() * (b - a);
  const clamp = v => Math.max(0, Math.min(1, v));
  const mixc = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  // γεωμετρία φιάλης (συντεταγμένες σκηνής 900×1080)
  const CX = 440, CY = 827.5, RI = 173, YB = 938, YFULL = 712, TIPS = [[428, 694], [452, 694]];
  // χρώματα: κόκκινο συστατικό → σκούρο μωβ
  const RED = { a: [226, 34, 54], b: [140, 4, 20], c: [58, 0, 10], s: [255, 104, 118] };
  const PUR = { a: [84, 24, 138], b: [42, 7, 80], c: [15, 2, 32], s: [118, 66, 178] };
  // μισό πλάτος του αχλαδιού της χοάνης ανά ύψος (συντεταγμένες εικόνας 382×1129)
  const PW = [[214, 84], [260, 140], [300, 168], [345, 184], [385, 187], [430, 184], [480, 160], [560, 124], [650, 86], [720, 58], [790, 6]];
  const pw = y => { for (let i = 1; i < PW.length; i++) if (y <= PW[i][0]) { const a = PW[i - 1], b = PW[i], t = (y - a[0]) / (b[0] - a[0]); return a[1] + (b[1] - a[1]) * t; } return 6; };

  // υφές καπνού: ακανόνιστες «τουλούπες» αντί για τέλειους κύκλους
  const sprites = Array.from({ length: 6 }, (_, k) => {
    // fbm value-noise → «νήματα» καπνού (όχι λείοι κύκλοι)
    const N = 128, c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'), img = x.createImageData(N, N);
    const G = 17, grid = Array.from({ length: G * G }, () => Math.random());
    const v = (px, py) => { const gx = Math.floor(px) % (G - 1), gy = Math.floor(py) % (G - 1), fx = px - Math.floor(px), fy = py - Math.floor(py), sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const a = grid[gy * G + gx], b = grid[gy * G + gx + 1], cc = grid[(gy + 1) * G + gx], d = grid[(gy + 1) * G + gx + 1]; return a + (b - a) * sx + (cc - a) * sy + (a - b - cc + d) * sx * sy; };
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      let n = 0, amp = .55, fr = 3 / N;
      for (let o = 0; o < 4; o++) { n += v(i * fr + k * 3.1, j * fr + k * 1.7) * amp; amp *= .5; fr *= 2.03; }
      const dx = (i - N / 2) / (N / 2), dy = (j - N / 2) / (N / 2), rr = Math.sqrt(dx * dx + dy * dy);
      const fall = Math.max(0, 1 - rr) ** 1.4, a = Math.max(0, Math.min(1, (n - .47) * 3.4)) * fall;
      const o = (j * N + i) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = 255; img.data[o + 3] = a * 255;
    }
    x.putImageData(img, 0, 0); return c;
  });
  const tint = (spr, col) => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    x.drawImage(spr, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = `rgb(${col})`; x.fillRect(0, 0, 128, 128); return c; };
  const SMK = ['176,136,240', '206,160,250', '150,176,240', '226,170,226', '160,124,232'];
  const smokeSpr = sprites.map((sp, i) => tint(sp, SMK[i % SMK.length]));
  const WARM = ['255,214,226', '255,226,196', '246,214,255', '255,232,210', '236,206,250'];
  const warmSpr = sprites.map((sp, i) => tint(sp, WARM[i % WARM.length]));

  let pR = 0, pB = 0, blueOn = false, phase = 'run', hold = 0, f = 0, fFull = 1, m = 0, prev = performance.now(), tF = 0, smokeAmt = 0;
  const smoke = [], mist = [], bubs = [], rip = [];
  const reset = () => { pR = 0; pB = 0; phase = 'run'; hold = 0; f = 0; m = 0; smokeAmt = 0; smoke.length = mist.length = bubs.length = rip.length = 0; blueOn = sec.classList.contains('st1');
    [TR, TB].forEach(t => { t.fill = 0; t.op = 0; }); };
  hooks.n36 = { enter() { reset(); }, step() { blueOn = true; } };

  const tubeUpdate = (t, on, dt) => {
    if (on) { t.op = Math.min(1, t.op + dt / 200); t.fill = Math.min(1, t.fill + dt / 1600); }
    else { t.op = Math.max(0, t.op - dt / 700); if (t.op === 0) t.fill = 0; }
    t.lq.style.opacity = t.op; t.lq.style.strokeDashoffset = t.L * (1 - t.fill);
    t.bb.style.opacity = on ? .9 * t.fill : t.op * .5; t.bb.style.strokeDashoffset = -(tF / 9) % 31.5;
  };

  // επιφάνεια με αργό 3D κύμα + ελαφριά «ταλάντωση» (sloshing)
  const surfY = (x, yl, t) => {
    let h = 2.6 * Math.sin(x * .031 + t * .8) + 1.3 * Math.sin(x * .058 - t * .55) + .5 * Math.sin(x * .09 + t * 1.1);
    h += .03 * Math.sin(t * .42) * (x - CX);
    for (const r of rip) { const d = Math.abs(x - r.x); h += r.a * Math.exp(-d * d / 900) * Math.sin(d * .32 - r.age * 7); }
    return yl + h;
  };

  function drawLiquid(t, yl) {
    lc.clearRect(0, 0, 900, 1080);
    if (f < .004) return;
    const pal = { a: mixc(RED.a, PUR.a, m), b: mixc(RED.b, PUR.b, m), c: mixc(RED.c, PUR.c, m), s: mixc(RED.s, PUR.s, m) };
    const w = Math.sqrt(Math.max(0, RI * RI - (yl - CY) ** 2)), ry = Math.max(3, w * .17);
    lc.save();
    lc.beginPath(); lc.arc(CX, CY, RI, 0, 6.2832); lc.clip();
    lc.beginPath(); lc.rect(0, 0, 900, YB); lc.clip();
    // σώμα υγρού (κάτω από το πίσω χείλος της επιφάνειας)
    lc.beginPath();
    for (let i = 0; i <= 40; i++) { const th = Math.PI + i / 40 * Math.PI, x = CX + w * Math.cos(th); lc.lineTo(x, surfY(x, yl, t) + ry * Math.sin(th)); }
    lc.lineTo(CX + RI + 4, YB + 4); lc.lineTo(CX - RI - 4, YB + 4); lc.closePath();
    let g = lc.createLinearGradient(0, yl - ry, 0, YB);
    g.addColorStop(0, rgba(pal.a, .96)); g.addColorStop(.45, rgba(pal.b, .97)); g.addColorStop(1, rgba(pal.c, .98));
    lc.fillStyle = g; lc.fill();
    // όγκος: σφαιρική σκίαση + φως που διαπερνά από κάτω
    g = lc.createRadialGradient(CX - 40, CY + 10, 20, CX, CY, RI + 6);
    g.addColorStop(0, 'rgba(255,255,255,.08)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
    lc.fillStyle = g; lc.fill();
    lc.globalCompositeOperation = 'lighter';
    g = lc.createRadialGradient(CX + 10, YB - 6, 4, CX + 10, YB - 6, 120);
    g.addColorStop(0, rgba(pal.s, .22)); g.addColorStop(1, rgba(pal.s, 0));
    lc.fillStyle = g; lc.fillRect(CX - 140, YB - 140, 280, 150);
    // αργοί εσωτερικοί «στρόβιλοι» (caustics)
    for (let k = 0; k < 3; k++) { const x = CX + Math.sin(t * .23 + k * 2.1) * 70, y = Math.max(yl + 20, CY + 40 + Math.cos(t * .31 + k) * 40);
      g = lc.createRadialGradient(x, y, 0, x, y, 60); g.addColorStop(0, rgba(pal.s, .07)); g.addColorStop(1, rgba(pal.s, 0)); lc.fillStyle = g; lc.fillRect(x - 60, y - 60, 120, 120); }
    lc.globalCompositeOperation = 'source-over';
    // επιφάνεια
    lc.beginPath();
    for (let i = 0; i <= 64; i++) { const th = i / 64 * 6.2832, x = CX + w * Math.cos(th); lc.lineTo(x, surfY(x, yl, t) + ry * Math.sin(th)); }
    lc.closePath();
    g = lc.createLinearGradient(0, yl - ry, 0, yl + ry);
    g.addColorStop(0, rgba(mixc(pal.s, [255, 255, 255], .12), .92)); g.addColorStop(.55, rgba(pal.a, .94)); g.addColorStop(1, rgba(pal.b, .95));
    lc.fillStyle = g; lc.fill();
    lc.save(); lc.clip();
    // ανακλάσεις που «κυλούν» πάνω στο κύμα
    for (let k = 0; k < 2; k++) { const x = CX - w * .35 + Math.sin(t * .5 + k * 2.4) * w * .3, y = surfY(x, yl, t) - ry * .35;
      g = lc.createRadialGradient(x, y, 0, x, y, w * .45); g.addColorStop(0, 'rgba(255,255,255,.26)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      lc.fillStyle = g; lc.save(); lc.translate(x, y); lc.scale(1, .22); lc.translate(-x, -y); lc.fillRect(x - w, y - w, w * 2, w * 2); lc.restore(); }
    lc.restore();
    // μηνίσκος στο μπροστινό χείλος
    lc.beginPath();
    for (let i = 0; i <= 40; i++) { const th = i / 40 * Math.PI, x = CX + w * Math.cos(th); lc.lineTo(x, surfY(x, yl, t) + ry * Math.sin(th)); }
    lc.strokeStyle = 'rgba(255,255,255,.32)'; lc.lineWidth = 1.4; lc.stroke();
    // φυσαλίδες
    if (Math.random() < .12) bubs.push({ x: CX + R_(-90, 90), y: YB - 6, r: R_(1, 2.6), v: R_(.25, .7), s: Math.random() * 6 });
    lc.strokeStyle = 'rgba(255,255,255,.4)'; lc.lineWidth = .8;
    for (let i = bubs.length - 1; i >= 0; i--) { const b = bubs[i]; b.y -= b.v; b.x += Math.sin(b.y * .06 + b.s) * .25;
      if (b.y < surfY(b.x, yl, t) + 3) { bubs.splice(i, 1); continue; }
      lc.beginPath(); lc.arc(b.x, b.y, b.r, 0, 6.2832); lc.stroke(); }
    // μαγική ομίχλη πάνω από το υγρό (μέσα στη φιάλη)
    if (smokeAmt > .02) {
      if (Math.random() < .12 * smokeAmt) mist.push({ x: CX + R_(-w * .7, w * .7), y: yl - R_(0, 12), r: R_(30, 60), life: 0, max: R_(3, 6), s: (Math.random() * 6) | 0, rot: R_(0, 6), vr: R_(-.003, .003) });
      lc.globalCompositeOperation = 'screen';
      for (let i = mist.length - 1; i >= 0; i--) { const p = mist[i]; p.life += 1 / 60; if (p.life > p.max) { mist.splice(i, 1); continue; }
        const k = p.life / p.max, a = Math.sin(k * Math.PI) * .18 * smokeAmt; p.x += Math.sin(t * .6 + p.s) * .15; p.y -= .08; p.rot += p.vr;
        lc.globalAlpha = a; lc.save(); lc.translate(p.x, p.y); lc.rotate(p.rot); lc.scale(1, .45); const r = p.r * (1 + k * .6); lc.drawImage(smokeSpr[p.s], -r, -r, r * 2, r * 2); lc.restore(); }
      lc.globalAlpha = 1; lc.globalCompositeOperation = 'source-over';
    }
    lc.restore();
  }

  function drawStreams(t, yl, rOn, bOn) {
    // λεπτή ροή από τα σωληνάκια μέσα στη φιάλη + κυματάκια στο σημείο πρόσκρουσης
    [[rOn, TIPS[0], RED.a, TR], [bOn, TIPS[1], [70, 140, 255], TB]].forEach(([on, [x, y], col, tb]) => {
      if (!on || tb.fill < 1) return;
      const yE = f > .004 ? surfY(x, yl, t) : YB - 4;
      lc.beginPath(); lc.moveTo(x, y);
      for (let yy = y; yy <= yE; yy += 6) lc.lineTo(x + Math.sin(yy * .09 + t * 9) * .7, yy);
      lc.strokeStyle = rgba(mixc(col, PUR.a, m * .35), .9); lc.lineWidth = 3.2; lc.lineCap = 'round'; lc.stroke();
      lc.strokeStyle = 'rgba(255,255,255,.35)'; lc.lineWidth = 1; lc.stroke();
      if (Math.random() < .08 && f > .02) rip.push({ x: x + R_(-4, 4), a: 1.6, age: 0 });
    });
    for (let i = rip.length - 1; i >= 0; i--) { const r = rip[i]; r.age += 1 / 60; r.a *= .985; if (r.a < .08) rip.splice(i, 1); }
  }

  // διακριτικός, «μαγικός» ατμός: λεπτά νήματα που ανεβαίνουν ήρεμα σε σπείρα, αλλάζουν απαλά απόχρωση
  // (λεβάντα → ροζ-χρυσό/μαργαριτάρι) και σβήνουν αφήνοντας ελάχιστες απαλές φωτεινές «ανάσες»
  const motes = [];
  // ατμός-«χέρι χορεύτριας»: συνεκτικό κύμα που ανεβαίνει κατά μήκος της στήλης (σαν μπράτσο που λικνίζεται),
  // αργή ταλάντωση όλης της στήλης και στροβιλισμός «δαχτύλων» στην κορυφή — απαλά σβήνει σε μαργαριταρένιες ανάσες
  function drawSmoke(t, dt) {
    sc.clearRect(0, 0, 900, 1080);
    if (smokeAmt < .01 && !smoke.length && !motes.length) return;
    const n = smokeAmt * dt / 16 * .2;
    for (let k = 0; k < n || (k === 0 && Math.random() < n); k++) smoke.push({ x: CX + R_(-5, 5), y: 612, vy: R_(-.62, -.52), r: R_(4, 6.5), g: R_(.03, .07), life: 0, max: R_(8.5, 10.5), s: (Math.random() * 6) | 0, rot: R_(0, 6.28), vr: R_(-.004, .004), ph: R_(-.25, .25), fz: Math.random() < .35 });
    sc.globalCompositeOperation = 'screen';
    for (let i = smoke.length - 1; i >= 0; i--) {
      const p = smoke[i]; p.life += dt / 1000;
      if (p.life > p.max) { if (Math.random() < .3) motes.push({ x: p.dx || p.x, y: p.y, life: 0, max: R_(2.5, 4), r: R_(1.1, 2), ph: Math.random() * 6 }); smoke.splice(i, 1); continue; }
      const k = p.life / p.max;
      p.y += p.vy * dt / 16 * (1 - k * .35); p.r += p.g * dt / 16; p.rot += p.vr * dt / 16;
      // κύμα που «ταξιδεύει» προς τα πάνω (καρπός → δάχτυλα), με πλάτος που μεγαλώνει με το ύψος
      const wave = Math.sin(t * 1.05 - k * 5.2 + p.ph) * (4 + 78 * k ** 1.25);
      const sway = Math.sin(t * .33) * 34 * k + Math.sin(t * .17 + 1.3) * 16 * k;
      // στην κορυφή τα «δάχτυλα» ανοίγουν και στροβιλίζονται
      const f = Math.max(0, (k - .62) / .38), fan = p.fz ? f * f : 0;
      const cx = Math.cos(t * 1.6 + p.ph * 9 + k * 7) * 26 * fan, cy = Math.sin(t * 1.6 + p.ph * 9 + k * 7) * 14 * fan;
      const x = p.x + wave + sway + cx, y = p.y + cy; p.dx = x;
      const a = Math.sin(k * Math.PI) ** 1.3 * .2 * Math.min(1, smokeAmt * 1.4 + .2);
      const ang = Math.atan2(Math.cos(t * 1.05 - k * 5.2 + p.ph) * (4 + 62 * k), 40) * .9;   // ακολουθεί την κλίση του κύματος
      sc.save(); sc.translate(x, y); sc.rotate(ang + p.rot * .3); sc.scale(.42, 1.8);
      sc.globalAlpha = a * (1 - k * .8); sc.drawImage(smokeSpr[p.s], -p.r * 2, -p.r * 2, p.r * 4, p.r * 4);
      sc.globalAlpha = a * k * .6; sc.drawImage(warmSpr[p.s], -p.r * 2, -p.r * 2, p.r * 4, p.r * 4);
      sc.restore();
    }
    for (let i = motes.length - 1; i >= 0; i--) {
      const m = motes[i]; m.life += dt / 1000; if (m.life > m.max) { motes.splice(i, 1); continue; }
      const k = m.life / m.max; m.y -= .16 * dt / 16; m.x += Math.sin(t * 1.2 + m.ph) * .14;
      const a = Math.sin(k * Math.PI) * .45, g = sc.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
      g.addColorStop(0, `rgba(255,236,214,${a})`); g.addColorStop(.35, `rgba(240,200,255,${a * .35})`); g.addColorStop(1, 'rgba(240,200,255,0)');
      sc.globalAlpha = 1; sc.fillStyle = g; sc.fillRect(m.x - m.r * 4, m.y - m.r * 4, m.r * 8, m.r * 8);
    }
    sc.globalAlpha = 1; sc.globalCompositeOperation = 'source-over';
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(50, now - prev); prev = now;
    if (!sec.classList.contains('active')) return;
    tF += dt; const t = tF / 1000;
    const DUR = 19000;
    if (phase === 'run') {
      if (pR < 1) pR = Math.min(1, pR + dt / DUR);
      if (blueOn && pB < 1) pB = Math.min(1, pB + dt / DUR);
      const tgt = .45 * clamp((pR * DUR - 900) / (DUR - 900)) + .55 * clamp((pB * DUR - 900) / (DUR - 900));
      f += (tgt - f) * .012;
      if (blueOn && pB >= 1 && f > .985) { phase = 'full'; hold = 0; }
    } else if (phase === 'full') {
      hold += dt; if (hold > 9000) { phase = 'reset'; hold = 0; fFull = f; }
    } else {
      hold += dt; const k = clamp(hold / 2200), e = k * k * (3 - 2 * k);
      f = fFull * (1 - e); pR = pB = 1 - e;
      if (k >= 1) { pR = pB = 0; f = 0; m = 0; phase = 'run'; }
    }
    const mt = blueOn ? clamp((.55 * clamp((pB * DUR - 900) / (DUR - 900))) / .3) : 0;
    if (phase === 'run') m += (mt - m) * .02;
    smokeAmt += ((phase !== 'reset' && m > .25 ? clamp((m - .25) / .5) : 0) - smokeAmt) * .02;
    lab.style.setProperty('--pool', `rgba(${mixc([220, 30, 50], [130, 50, 220], m)},${(.08 + f * .2).toFixed(3)})`);
    // χοάνες
    const yR = 214 + pR * 576, yB = 214 + pB * 576;
    lvR.setAttribute('y', yR); sfR.setAttribute('cy', yR); sfR.setAttribute('rx', Math.max(0, pw(yR) - 4)); sfR.setAttribute('ry', Math.max(1, pw(yR) * .09));
    lvB.setAttribute('y', yB); sfB.setAttribute('cy', yB); sfB.setAttribute('rx', Math.max(0, pw(yB) - 4)); sfB.setAttribute('ry', Math.max(1, pw(yB) * .09));
    const rOn = phase === 'run' && pR > 0 && pR < 1, bOn = phase === 'run' && blueOn && pB > 0 && pB < 1;
    tubeUpdate(TR, rOn, dt); tubeUpdate(TB, bOn, dt);
    const yl = YB - f * (YB - YFULL);
    drawLiquid(t, yl);
    drawStreams(t, yl, rOn, bOn);
    drawSmoke(t, dt);
  }
  requestAnimationFrame(frame);
})();

});
