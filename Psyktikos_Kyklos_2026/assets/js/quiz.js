/* INVENTOR TRIVIA — 10-round TV-style quiz */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const Q = [
  { q: 'Ποια είναι τα 4 βασικά στάδια του ψυκτικού κύκλου;',
    a: ['Συμπίεση → Συμπύκνωση → Εκτόνωση → Εξάτμιση', 'Συμπίεση → Εξάτμιση → Εκτόνωση → Συμπύκνωση', 'Αναρρόφηση → Φιλτράρισμα → Ψύξη → Απόψυξη', 'Θέρμανση → Ψύξη → Αφύγρανση → Ανεμισμός'],
    e: 'Ο κύκλος: <b>συμπίεση</b> (συμπιεστής), <b>συμπύκνωση</b> (συμπυκνωτής), <b>εκτόνωση</b> (εκτονωτική) και <b>εξάτμιση</b> (εξατμιστής) — και ξανά από την αρχή.' },
  { q: 'Ποιος είναι ο ρόλος του συμπιεστή;',
    a: ['Αναρροφά ατμό, αυξάνει πίεση & θερμοκρασία και τον στέλνει στον συμπυκνωτή', 'Μειώνει απότομα την πίεση του υγρού πριν μπει στον εξατμιστή', 'Αλλάζει την κατεύθυνση ροής ώστε η μονάδα να κάνει θέρμανση', 'Φιλτράρει τον αέρα του δωματίου και ρυθμίζει την υγρασία'],
    e: 'Ο συμπιεστής είναι η <b>«καρδιά»</b>: αναρροφά ατμό, αυξάνει πίεση και θερμοκρασία και τον προωθεί στον συμπυκνωτή.' },
  { q: 'Τι συμβαίνει στον εξατμιστή;',
    a: ['Το ψυκτικό απορροφά θερμότητα από τον εσωτερικό αέρα και εξατμίζεται', 'Το ψυκτικό αποβάλλει θερμότητα στο περιβάλλον και υγροποιείται', 'Η πίεση του ψυκτικού αυξάνεται απότομα και γίνεται θερμό αέριο', 'Το ψυκτικό καταναλώνεται σιγά σιγά και πρέπει να συμπληρωθεί'],
    e: 'Στον εξατμιστή το ψυκτικό <b>απορροφά θερμότητα</b> από τον αέρα του χώρου και εξατμίζεται· ο αέρας επιστρέφει δροσερός.' },
  { q: 'Τι κάνει η εκτονωτική διάταξη;',
    a: ['Προκαλεί πτώση πίεσης & θερμοκρασίας και ελέγχει την παροχή στον εξατμιστή', 'Αυξάνει πίεση & θερμοκρασία και προωθεί το ψυκτικό στον συμπυκνωτή', 'Αντιστρέφει τη ροή του ψυκτικού για να περάσουμε σε θέρμανση', 'Αποχετεύει τα συμπυκνώματα νερού από τη λεκάνη της μονάδας'],
    e: 'Η εκτονωτική (τριχοειδής ή <b>EEV</b>) ρίχνει πίεση και θερμοκρασία και ελέγχει την παροχή προς τον εξατμιστή.' },
  { q: 'Ποιος είναι ο ρόλος της 4-way valve;',
    a: ['Αλλάζει την κατεύθυνση ροής, ώστε η ίδια μονάδα να κάνει ψύξη ή θέρμανση', 'Ρυθμίζει την ταχύτητα του ανεμιστήρα ανάλογα με τη θερμοκρασία', 'Μειώνει την πίεση του υγρού ακριβώς όπως μια ηλεκτρονική EEV', 'Προστατεύει τον συμπιεστή κόβοντας το ρεύμα σε υπερφόρτωση'],
    e: 'Η τετράοδη βαλβίδα <b>αντιστρέφει τη ροή</b>: οι ρόλοι εσωτερικού και εξωτερικού εναλλάκτη αλλάζουν.' },
  { q: 'Ποια είναι η βασική διαφορά Inverter και Fixed Speed;',
    a: ['Στο inverter η συχνότητα του συμπιεστή αλλάζει με το φορτίο· το fixed δουλεύει ON/OFF', 'Το inverter δουλεύει ON/OFF, ενώ το fixed speed αλλάζει συνεχώς την ισχύ του', 'Το inverter δεν διαθέτει συμπιεστή, λειτουργεί μόνο με ανεμιστήρες και EEV', 'Διαφέρουν μόνο στο ψυκτικό: το inverter χρησιμοποιεί πάντα R22'],
    e: 'Fixed speed = <b>ON / OFF</b>. Inverter = <b>μεταβλητή συχνότητα</b> συμπιεστή ανάλογα με το φορτίο.' },
  { q: 'Τι θα ελέγξετε πρώτο όταν μια μονάδα δεν αποδίδει στην ψύξη;',
    a: ['Ρυθμίσεις & τρόπο λειτουργίας, φίλτρα και airflow', 'Προσθέτουμε αμέσως ψυκτικό μέσο στο κύκλωμα', 'Αντικαθιστούμε απευθείας την πλακέτα PCB', 'Αλλάζουμε τον συμπιεστή για σιγουριά'],
    e: 'Πάντα <b>από το απλό στο σύνθετο</b>: ρυθμίσεις, φίλτρα, airflow — και μετά ψυκτικό κύκλωμα.' },
  { q: 'Τι σημαίνει Low Pressure και High Pressure;',
    a: ['LP = πλευρά χαμηλής πίεσης (αναρρόφηση) · HP = πλευρά υψηλής πίεσης (κατάθλιψη)', 'LP = Low Power, HP = High Power: η κατανάλωση ρεύματος της μονάδας', 'LP = θερμοκρασία εσωτερικού χώρου · HP = θερμοκρασία εξωτερικού χώρου', 'LP / HP είναι κωδικοί μοντέλων για μικρές και μεγάλες μονάδες'],
    e: '<b>LP</b> είναι η πλευρά χαμηλής πίεσης (suction), <b>HP</b> η πλευρά υψηλής πίεσης (discharge).' },
  { q: 'Γιατί είναι σημαντικό το airflow;',
    a: ['Η ανεπαρκής ροή αέρα επηρεάζει έντονα την απόδοση και τις θερμοκρασίες λειτουργίας', 'Επηρεάζει μόνο τον θόρυβο της μονάδας, όχι την απόδοσή της', 'Έχει σημασία μόνο στη θέρμανση, ποτέ στην ψύξη', 'Γιατί όσο περισσότερος αέρας, τόσο λιγότερο ψυκτικό χρειάζεται'],
    e: 'Βρώμικα φίλτρα, εναλλάκτες ή ανεμιστήρες = λίγος αέρας = <b>πτώση απόδοσης</b> και ακραίες θερμοκρασίες/πιέσεις.' },
  { q: 'Γιατί δεν αρκεί η ένδειξη «η μονάδα δεν κρυώνει» για διάγνωση;',
    a: ['Χρειάζονται μετρήσεις (πιέσεις, θερμοκρασίες) και έλεγχος συνθηκών λειτουργίας', 'Γιατί σημαίνει πάντα και μόνο έλλειψη ψυκτικού στο κύκλωμα', 'Γιατί το πρόβλημα βρίσκεται πάντα στο τηλεχειριστήριο', 'Γιατί η λύση είναι πάντα η αντικατάσταση της μονάδας'],
    e: 'Μία ένδειξη δεν είναι διάγνωση: <b>καταγράφουμε μετρήσεις και ευρήματα</b> πριν από κάθε συμπέρασμα.' },
];
const LET = ['Α', 'Β', 'Γ', 'Δ'];
const ROUND_S = 60;
const root = $('#quiz'); if (!root) return;
const el = { intro: $('#qzIntro'), play: $('#qzPlay'), fin: $('#qzFinal'), q: $('#qzQ'), ans: $('#qzAns'), exp: $('#qzExp'), next: $('#qzNext'), round: $('#qzRound'),
  tm: $('#qzTm'), timer: $('#qzTimer'), score: $('#qzScore'), pips: $('#qzPips'), life: $('#qz5050'), snd: $('#qzSnd') };

/* timer ring */
const tg = $('.ticks', el.timer); const ticks = [];
for (let i = 0; i < 60; i++) {
  const r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  r.setAttribute('x', 126); r.setAttribute('y', 6); r.setAttribute('width', 8); r.setAttribute('height', 26); r.setAttribute('rx', 3);
  r.setAttribute('transform', `rotate(${i * 6} 130 130)`); r.setAttribute('class', 'tk'); tg.appendChild(r); ticks.push(r);
}
const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
ring.setAttribute('cx', 130); ring.setAttribute('cy', 130); ring.setAttribute('r', 88); ring.setAttribute('fill', 'rgba(5,10,30,.6)'); ring.setAttribute('stroke', 'rgba(255,255,255,.15)'); ring.setAttribute('stroke-width', 2);
tg.parentNode.insertBefore(ring, tg);
const colorAt = (f) => { const h = 195 - 195 * f, l = 74 - 16 * f, s = 92; return `hsl(${h},${s}%,${l}%)`; };
function paintTimer(rem) {
  const f = 1 - rem / ROUND_S, col = colorAt(Math.min(1, f)), left = Math.ceil(rem);
  ticks.forEach((t, i) => { t.setAttribute('fill', col); t.classList.toggle('off', i >= left); });
  el.tm.style.setProperty('--tc', col);
  el.tm.textContent = '00:' + String(Math.max(0, left)).padStart(2, '0');
  if (left === 60) el.tm.textContent = '01:00';
  el.timer.classList.toggle('hurry', left <= 10 && left > 0);
}


/* ---- μουσική αντίστροφης μέτρησης (τηλεπαιχνίδι) — συντίθεται live με Web Audio ----
   κυκλικό μοτίβο: παλμός μπάσου, hi-hat, σκοτεινό pad και αρπέζ· το tempo και η ένταση
   ανεβαίνουν όσο πλησιάζουμε στο 0 και στη λήξη ακούγεται «γκονγκ». */
const Music = (() => {
  let ctx = null, master = null, timer = 0, next = 0, step = 0, playing = false, intensity = 0;
  const AC = () => {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = .55;
      const comp = ctx.createDynamicsCompressor(); master.connect(comp).connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  let noiseBuf = null;
  const noise = () => { if (noiseBuf) return noiseBuf; const c = AC(), b = c.createBuffer(1, c.sampleRate * .5, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return noiseBuf = b; };
  const env = (g, t, a, d, v) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); };
  const osc = (type, f, t, a, d, v, dest = master, f2) => { const c = ctx, o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + a + d); env(g, t, a, d, v); o.connect(g).connect(dest); o.start(t); o.stop(t + a + d + .05); };
  const kick = (t, v = .9) => osc('sine', 150, t, .002, .28, v, master, 42);
  const hat = (t, v = .12) => { const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noise(); f.type = 'highpass'; f.frequency.value = 7000; env(g, t, .001, .05, v); s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + .08); };
  const BASS = [55, 55, 65.41, 55, 49, 49, 51.91, 55];            // A1 … (λα ελάσσονα, «τηλεπαιχνίδι»)
  const ARP = [440, 523.25, 659.25, 523.25, 440, 523.25, 698.46, 659.25];
  function sched(t) {
    const s = step % 16, beat = s % 4 === 0, k = intensity;
    if (beat) { kick(t, .7 + k * .3); osc('sawtooth', BASS[(step >> 2) % 8], t, .01, .32, .16 + k * .08); }
    if (k > .75 && s % 4 === 2) kick(t, .5);                              // «καρδιοχτύπι» στα τελευταία δευτερόλεπτα
    if (s % 2 === 1) hat(t, .06 + k * .1);
    if (s % 2 === 0) osc('square', ARP[(step >> 1) % 8] * (k > .5 ? 2 : 1), t, .005, .11, .025 + k * .03);
    if (s === 0) [220, 261.63, 329.63].forEach((f) => osc('triangle', f * (1 + k * .06), t, .4, 1.6, .03 + k * .03));  // pad που «ανεβαίνει» σε ένταση
    if (k > .55 && s === 8) osc('sawtooth', 880, t, .02, .5, .03 + k * .03, master, 1760);          // ανερχόμενος συναγερμός
  }
  function pump() {
    const c = ctx; const spb = 60 / (112 + intensity * 70) / 4;            // 16ths · tempo 112 → 182 BPM
    while (next < c.currentTime + .12) { sched(next); next += spb; step++; }
  }
  return {
    start() { if (!SFX.on) return; AC(); if (playing) return; playing = true; step = 0; next = ctx.currentTime + .06; master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(.55, ctx.currentTime); timer = setInterval(pump, 25); },
    stop(fade = .25) { if (!playing) return; playing = false; clearInterval(timer); if (ctx) { const t = ctx.currentTime; master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(0.0001, t + fade); setTimeout(() => { if (!playing) master.gain.value = .55; }, fade * 1000 + 60); } },
    set(rem) { intensity = Math.max(0, Math.min(1, 1 - rem / ROUND_S)) ** 1.6; },
    gong() {
      if (!SFX.on) return; AC(); const t = ctx.currentTime + .02;
      [[65.4, .55, 6], [130.8, .3, 5], [174.6, .22, 4.2], [233.1, .16, 3.4], [311.1, .12, 2.6], [415.3, .08, 2]].forEach(([f, v, d]) => {
        const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(f * 1.01, t); o.frequency.exponentialRampToValueAtTime(f, t + 1.2);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .015); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + d + .1); });
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = noise(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = .7;
      g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .5); s.connect(f).connect(g).connect(ctx.destination); s.start(t);
    },
  };
})();

/* stars */
(() => {
  const c = $('.qz-stars', root), x = c.getContext('2d'); const P = [];
  for (let i = 0; i < 90; i++) P.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .3, w: Math.random() * 6.28 });
  const draw = (t) => {
    if (root.closest('.slide').classList.contains('cur')) {
      const W = c.width = c.offsetWidth, Hh = c.height = c.offsetHeight; x.clearRect(0, 0, W, Hh);
      for (const p of P) { x.globalAlpha = .3 + .7 * Math.abs(Math.sin(t / 1400 + p.w)); x.fillStyle = '#fff'; x.beginPath(); x.arc(p.x * W, p.y * Hh, p.r, 0, 6.28); x.fill(); }
    }
    requestAnimationFrame(draw);
  };
  requestAnimationFrame(draw);
})();

/* state */
let st = null, raf = 0, lastT = 0, running = false, tickSec = -1;
const show = (w) => { [el.intro, el.play, el.fin].forEach((s) => s.classList.toggle('show', s === w)); };
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pips() {
  el.pips.innerHTML = '';
  for (let i = 0; i < Q.length; i++) { const p = document.createElement('div'); p.className = 'pip'; p.innerHTML = `<span>${i + 1}</span>`; el.pips.appendChild(p); }
}
function setPip() { $$('.pip', el.pips).forEach((p, i) => { p.classList.toggle('cur', i === st.i && !st.res[i]); p.classList.toggle('ok', st.res[i] === 'ok'); p.classList.toggle('no', st.res[i] === 'no'); }); }

function start() {
  st = { i: 0, score: 0, shown: 0, res: [], used5050: false, rem: ROUND_S };
  el.life.classList.remove('used'); el.score.textContent = '0';
  root.classList.remove('done'); root.classList.add('playing'); pips(); show(el.play); round();
}
function round() {
  const item = Q[st.i];
  root.classList.remove('locked', 'revealed');
  el.exp.classList.remove('show'); el.next.classList.remove('show');
  el.round.textContent = `ΓΥΡΟΣ ${st.i + 1} / ${Q.length}`;
  el.q.classList.remove('in'); void el.q.offsetWidth; el.q.textContent = item.q; el.q.classList.add('in');
  const order = shuffle([0, 1, 2, 3]);
  el.ans.innerHTML = '';
  order.forEach((k, pos) => {
    const b = document.createElement('button'); b.className = 'ans'; b.dataset.k = k;
    b.innerHTML = `<span class="L">${LET[pos]}</span><span class="t">${item.a[k]}</span><span class="ok">✓</span>`;
    b.style.animationDelay = (0.5 + pos * .15) + 's'; b.classList.add('in');
    b.addEventListener('click', () => choose(b));
    el.ans.appendChild(b);
  });
  st.rem = ROUND_S; paintTimer(st.rem); setPip();
  SFX.pop();
  clearTimeout(st.startT); st.startT = setTimeout(() => { running = true; lastT = performance.now(); tickSec = -1; Music.set(st.rem); Music.start(); loop(); }, 1300);
}
function loop() {
  cancelAnimationFrame(raf);
  const f = (t) => {
    if (!running) return;
    st.rem -= (t - lastT) / 1000; lastT = t;
    if (st.rem <= 0) { st.rem = 0; paintTimer(0); running = false; Music.stop(.05); Music.gong(); reveal(null); return; }
    paintTimer(st.rem); Music.set(st.rem);
    const s = Math.ceil(st.rem); if (s !== tickSec) { tickSec = s; if (s <= 10) SFX.tick(s <= 5); }
    raf = requestAnimationFrame(f);
  };
  raf = requestAnimationFrame(f);
}
function choose(b) {
  if (root.classList.contains('locked') || !running && st.rem > 0 && !el.play.classList.contains('show')) return;
  if (root.classList.contains('locked')) return;
  running = false; clearTimeout(st.startT); cancelAnimationFrame(raf); Music.stop(.6);
  root.classList.add('locked'); b.classList.add('pick'); SFX.lock();
  setTimeout(() => reveal(b), 1500);
}
function reveal(b) {
  root.classList.add('locked', 'revealed');
  const right = $('.ans[data-k="0"]', el.ans);
  right.classList.add('right');
  const rays = document.createElement('i'); rays.className = 'qz-rays';
  const rr = right.getBoundingClientRect(), p = toStage(rr.left + rr.width / 2, rr.top + rr.height / 2);
  rays.style.left = p.x + 'px'; rays.style.top = p.y + 'px'; el.play.insertBefore(rays, el.play.firstChild);
  const item = Q[st.i];
  if (b && b === right) {
    b.classList.remove('pick');
    const pts = 1000 + Math.round(st.rem) * 20;
    const from = st.score; st.score += pts; tween(el.score, from, st.score, 0, 1200);
    const fp = document.createElement('div'); fp.className = 'float-pts'; fp.textContent = '+' + fmtNum(pts, 0);
    fp.style.left = (p.x - 60) + 'px'; fp.style.top = (p.y - 80) + 'px'; el.play.appendChild(fp); setTimeout(() => fp.remove(), 1700);
    confetti(rr.left + rr.width / 2, rr.top + rr.height / 2, 110); SFX.right();
    st.res[st.i] = 'ok';
    el.exp.innerHTML = '<b>ΣΩΣΤΑ!</b> ' + item.e;
  } else {
    if (b) { b.classList.remove('pick'); b.classList.add('wrong'); }
    SFX.wrong(); st.res[st.i] = 'no';
    el.exp.innerHTML = (b ? '<b>Όχι αυτή τη φορά.</b> ' : '<b>Τέλος χρόνου!</b> ') + item.e;
  }
  setPip();
  el.exp.classList.add('show');
  el.next.textContent = st.i === Q.length - 1 ? 'Δες το αποτέλεσμα →' : 'Επόμενος γύρος →';
  setTimeout(() => el.next.classList.add('show'), 600);
}
function next() {
  if (!el.next.classList.contains('show')) return;
  $$('.qz-rays', el.play).forEach((r) => r.remove());
  st.i++;
  if (st.i >= Q.length) return finish();
  round();
}
function finish() {
  root.classList.remove('playing'); root.classList.add('done'); show(el.fin);
  const ok = st.res.filter((r) => r === 'ok').length, pct = Math.round(ok / Q.length * 100);
  const d = $('#qzDonut'); d.style.transition = 'none'; d.style.strokeDashoffset = 578; void d.offsetWidth; d.style.transition = '';
  setTimeout(() => { d.style.strokeDashoffset = 578 * (1 - pct / 100); tween($('#qzPct'), 0, pct, 0, 2200); tween($('#qzFinalPts'), 0, st.score, 0, 2400); }, 300);
  $('#qzCorrect').textContent = `${ok}/${Q.length} σωστές`;
  $('#qzTitle').textContent = ok === 10 ? 'ΘΡΥΛΟΣ ΤΟΥ ΨΥΚΤΙΚΟΥ ΚΥΚΛΟΥ!' : ok >= 8 ? 'MASTER ΤΟΥ ΚΛΙΜΑΤΙΣΜΟΥ!' : ok >= 6 ? 'ΑΝΕΡΧΟΜΕΝΟΣ ΤΕΧΝΙΚΟΣ!' : ok >= 4 ? 'ΚΑΛΟ ΞΕΚΙΝΗΜΑ!' : 'ΜΙΑ ΒΟΛΤΑ ΑΚΟΜΑ ΣΤΑ SLIDES!';
  SFX.win(); rain(ok >= 6 ? 4500 : 2000);
  const r = $('.donut', el.fin).getBoundingClientRect(); setTimeout(() => confetti(r.left + r.width / 2, r.top + r.height / 2, 160, undefined, 1.4), 900);
}
function fifty() {
  if (!st || st.used5050 || root.classList.contains('locked') || !el.play.classList.contains('show')) return;
  st.used5050 = true; el.life.classList.add('used'); SFX.pop();
  shuffle($$('.ans', el.ans).filter((b) => b.dataset.k !== '0')).slice(0, 2).forEach((b) => b.classList.add('gone'));
}
$('#qzStart').addEventListener('click', start);
$('#qzAgain').addEventListener('click', start);
el.next.addEventListener('click', next);
el.life.addEventListener('click', fifty);
el.snd.addEventListener('click', () => { SFX.on = !SFX.on; el.snd.classList.toggle('off', !SFX.on); if (!SFX.on) Music.stop(.2); else if (running) Music.start(); });
addEventListener('keydown', (e) => {
  if (!root.closest('.slide').classList.contains('cur')) return;
  const map = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3, 'α': 0, 'β': 1, 'γ': 2, 'δ': 3 };
  const k = map[(e.key || '').toLowerCase()];
  if (k !== undefined && el.play.classList.contains('show') && !root.classList.contains('locked')) { const b = $$('.ans', el.ans)[k]; if (b && !b.classList.contains('gone')) choose(b); }
  if (e.key === 'Enter') { if (el.intro.classList.contains('show')) start(); else next(); }
});

window.Quiz = {
  enter() { if (!st) { show(el.intro); root.classList.remove('playing', 'done'); } else if (el.play.classList.contains('show') && !root.classList.contains('locked') && st.rem > 0) { running = true; lastT = performance.now(); Music.start(); loop(); } },
  leave() { running = false; cancelAnimationFrame(raf); Music.stop(.3); if (st) clearTimeout(st.startT); },
};
show(el.intro);
})();
