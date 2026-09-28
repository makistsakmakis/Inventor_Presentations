import { put, list } from '@vercel/blob';

// ---- αρχείο log: κάθε σύνδεση προστίθεται ως νέα γραμμή στο τέλος ----
// Το Vercel δεν επιτρέπει εγγραφή αρχείων μέσα στο ίδιο το site, οπότε οι γραμμές φυλάσσονται
// στο Vercel Blob (απλή αποθήκη αρχείων) και ενώνονται σε ΕΝΑ αρχείο κειμένου όταν το ανοίγετε.
const PREFIX = 'inventor-logins/';
export const storageReady = () => !!process.env.BLOB_READ_WRITE_TOKEN;
const athensParts = () => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).map(x => [x.type, x.value]));
  return p;
};
export async function appendLog(email) {
  const p = athensParts();
  const stamp = `${p.year}-${p.month}-${p.day}_${p.hour}-${p.minute}-${p.second}`;
  const line = `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} | ${email}`;
  if (!storageReady()) { console.log('[login]', line); return; }
  await put(`${PREFIX}${stamp}__${email}.txt`, line + '\n', { access: 'private', addRandomSuffix: true, contentType: 'text/plain; charset=utf-8' });
}
export async function readLog() {
  if (!storageReady()) return null;
  const names = []; let cursor;
  do { const r = await list({ prefix: PREFIX, cursor, limit: 1000 }); r.blobs.forEach(b => names.push(b.pathname)); cursor = r.hasMore ? r.cursor : undefined; } while (cursor);
  return names.map(n => n.slice(PREFIX.length)).sort().map(n => {
    const m = n.match(/^(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(\d{2})__(.+?)(?:-[A-Za-z0-9]{10,})?\.txt$/);
    return m ? `${m[1]} ${m[2]}:${m[3]}:${m[4]} | ${m[5]}` : n;
  });
}
