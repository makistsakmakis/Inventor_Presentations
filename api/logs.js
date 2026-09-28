import { readSession } from './_auth.js';
import { readLog } from './_log.js';
export async function GET(request) {
  const s = await readSession(request);
  if (!s || !s.a) return new Response('Δεν επιτρέπεται η πρόσβαση.', { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  const lines = await readLog();
  const text = lines === null
    ? 'Το αρχείο δεν έχει ενεργοποιηθεί ακόμα.\nVercel → Project → Storage → Create → Blob → Connect, και μετά Redeploy.\n'
    : `ΑΡΧΕΙΟ ΣΥΝΔΕΣΕΩΝ · Inventor Presentations\nΗμερομηνία/ώρα (Αθήνα) | Email\n${'-'.repeat(48)}\n${lines.join('\n')}\n\nΣύνολο: ${lines.length}\n`;
  const dl = new URL(request.url).searchParams.has('download');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store',
    'Content-Disposition': `${dl ? 'attachment' : 'inline'}; filename="inventor-logins.txt"` } });
}
