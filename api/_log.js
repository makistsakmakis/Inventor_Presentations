import { put, list, del } from '@vercel/blob';
import { PRESENTATIONS, LOGIN, titleOf } from './_presentations.js';

// ---- αρχείο log: κάθε σύνδεση / άνοιγμα παρουσίασης προστίθεται ως νέα γραμμή στο τέλος ----
// Το Vercel δεν επιτρέπει εγγραφή αρχείων μέσα στο ίδιο το site, οπότε οι γραμμές φυλάσσονται
// στο Vercel Blob (απλή αποθήκη αρχείων) και ενώνονται σε ΕΝΑ αρχείο κειμένου όταν το ανοίγετε.
const PREFIX = 'inventor-logins/';
// Ο διαχειριστής (καρφωτά) ΔΕΝ καταγράφεται ποτέ· όσες παλιές εγγραφές του υπάρχουν διαγράφονται οριστικά
// από την αποθήκη την επόμενη φορά που ανοίγει το αρχείο /api/logs.
export const NO_LOG_EMAIL = 'm.flouris@inventor.ac';
const isExcluded = e => String(e || '').trim().toLowerCase() === NO_LOG_EMAIL;
export const storageReady = () => !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
const athensParts = () => Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
  .formatToParts(new Date()).map(x => [x.type, x.value]));

// key: όνομα υποφακέλου παρουσίασης ή 'login'
const EVENTS = { pdf: 'Λήψη PDF' };
// ev: προαιρετικό γεγονός μέσα στην παρουσίαση (π.χ. 'pdf')
export async function appendLog(email, key = LOGIN, ev = '') {
  if (isExcluded(email)) return;
  if (ev && !EVENTS[ev]) ev = '';
  const p = athensParts();
  const stamp = `${p.year}-${p.month}-${p.day}_${p.hour}-${p.minute}-${p.second}`;
  const line = `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} | ${email} | ${titleOf(key)}${ev ? ' · ' + EVENTS[ev] : ''}`;
  if (!storageReady()) { console.log('[log]', line); return; }
  await put(`${PREFIX}${stamp}__${email}__${key}${ev ? '@' + ev : ''}.txt`, line + '\n', { access: 'private', addRandomSuffix: true, contentType: 'text/plain; charset=utf-8' });
}

const KEYS = [...Object.keys(PRESENTATIONS), LOGIN].sort((a, b) => b.length - a.length);
export async function readLog() {
  if (!storageReady()) return null;
  const blobs = []; let cursor;
  do { const r = await list({ prefix: PREFIX, cursor, limit: 1000 }); r.blobs.forEach(b => blobs.push(b)); cursor = r.hasMore ? r.cursor : undefined; } while (cursor);
  const rows = blobs.map(b => ({ url: b.url, ...parseName(b.pathname.slice(PREFIX.length)) }));
  // οριστική διαγραφή των εγγραφών του διαχειριστή
  const purge = rows.filter(r => isExcluded(r.email)).map(r => r.url);
  for (let i = 0; i < purge.length; i += 500) { try { await del(purge.slice(i, i + 500)); } catch (e) { console.error('purge failed', e); } }
  return rows.filter(r => !isExcluded(r.email)).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0).map(r => r.line);
}
function parseName(n) {
  const m = n.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(\d{2})__(.+)\.txt$/);
  if (!m) return { name: n, email: '', line: n };
  let rest = m[5], email = rest, title = titleOf(LOGIN);          // παλιές εγγραφές (χωρίς παρουσίαση) = σύνδεση
  const i = rest.indexOf('__');
  if (i > -1) {
    email = rest.slice(0, i); const tail = rest.slice(i + 2);
    const k = KEYS.find(k => tail === k || tail.startsWith(k + '-') || tail.startsWith(k + '@'));
    const ev = k && (tail.slice(k.length).match(/^@([a-z]+)/) || [])[1];
    title = titleOf(k || tail.replace(/-[A-Za-z0-9]{10,}$/, '')) + (ev && EVENTS[ev] ? ' · ' + EVENTS[ev] : '');
  } else email = rest.replace(/-[A-Za-z0-9]{10,}$/, '');
  return { name: n, email, line: `${m[1]} ${m[2]}:${m[3]}:${m[4]} | ${email} | ${title}` };
}
