s=open('/mnt/user-data/uploads/Inventor_Presentations/CLM/assets/js/app.js',encoding='utf-8').read()
sl=open('/tmp/hpbuild/slides.js',encoding='utf-8').read().replace('    <svg class="flows" data-flows="steps"></svg>\n','')
a=s.index('  /* ---- 01 COVER ---- */'); b=s.index('  /* ------------------------------------------------------------------\n     Build DOM')
s=s[:a]+sl+s[b:]
def rep(x,y):
    global s; assert s.count(x)==1,x[:60]; s=s.replace(x,y)
old_sec=s[s.index('  const SECTIONS = ['):s.index('];',s.index('  const SECTIONS = ['))+2]
s=s.replace(old_sec,"""  const SECTIONS = [
    { id: 'welcome',  n: '01', short: 'Καλωσόρισμα',        name: 'Κάνουμε περισσότερα' },
    { id: 'tech',     n: '02', short: 'Τεχνολογίες',         name: 'Τεχνολογίες' },
    { id: 'series',   n: '03', short: 'Προϊοντικές Σειρές',  name: 'Προϊοντικές Σειρές' },
    { id: 'compare',  n: '04', short: 'Σύγκριση μοντέλων',   name: 'Σύγκριση μοντέλων' },
    { id: 'services', n: '05', short: 'Λύσεις & Υπηρεσίες',  name: 'Λύσεις και Υπηρεσίες' }
  ];""")
rep("const DEF = ['sera', 'stardust', 'zora', 'iria'];","const DEF = ['zero1', 'mono1', 'xf1', 'split1'];")
a=s.index('    const SPEC = ['); b=s.index('];',a)+2
s=s[:a]+"    const SPEC = C.CMP_SPEC;"+s[b:]
rep("JSON.stringify({ p: 'Inventor_Timokatalogos_Afygrantiron_2026', a: 'pdf' })","JSON.stringify({ p: 'Inventor_Antlies_Thermotitas_2026', a: 'pdf' })")
rep("<small>${seriesName(p.series)} · Τιμοκατάλογος 2026</small>","<small>${seriesName(p.series)} · Κατάλογος & τιμές 2026</small>")
rep("INVENTOR 2026 · Interactive price list — engine","INVENTOR 2026 · Αντλίες Θερμότητας · Interactive catalogue — engine")
# fitTiles: κάθε πλακίδιο με το μεγαλύτερο μέγεθος κειμένου που χωράει
a=s.index('  function fitTiles() {'); b=s.index('  // TIPS: μπροστινοί')
s=s[:a]+"""  function fitTiles() {   // κάθε πλακίδιο: το μεγαλύτερο μέγεθος κειμένου που χωράει στον διαθέσιμο χώρο
    $$('.tile .back .scroll').forEach(x => { const t = x.closest('.tile');
      let lo = 10, hi = 30;
      for (let k = 0; k < 9; k++) { const m = (lo + hi) / 2; t.style.setProperty('--tfs', m + 'px'); if (x.scrollHeight <= x.clientHeight + 1) lo = m; else hi = m; }
      t.style.setProperty('--tfs', Math.floor(lo * 4) / 4 + 'px'); });
  }
  addEventListener('resize', () => setTimeout(fitTiles, 200));
"""+s[b:]
# calculator dialog
rep("    if (t.closest('[data-locator]')) { e.preventDefault(); openLocator(); return; }","    if (t.closest('[data-locator]')) { e.preventDefault(); openLocator(); return; }\n    if (t.closest('[data-calc]')) { e.preventDefault(); openCalc(); return; }")
rep("  function openLocator() {","""  function openCalc() {
    const body = dialog(`<span>Τι αντλία θερμότητας χρειάζεται το έργο σας;</span><small>Προεκτίμηση θερμικών απωλειών & ισχύος</small>`,
      `<iframe class="calcfr" src="assets/calc/index.html" title="Υπολογισμός αντλίας θερμότητας"></iframe>`,
      `<a class="zbtn" href="assets/calc/index.html" target="_blank" rel="noopener">Νέα καρτέλα ↗</a>`);
    return body;
  }
  function openLocator() {""")
open('/tmp/hpbuild/site/assets/js/app.js','w',encoding='utf-8').write(s)
