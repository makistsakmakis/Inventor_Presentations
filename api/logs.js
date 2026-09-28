import { readSession, readLog } from './_auth.js';
export const config = { runtime: 'edge' };
export default async function handler(request) {
  const s = await readSession(request);
  if (!s || !s.a) return new Response('Δεν επιτρέπεται η πρόσβαση.', { status: 403, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  const lines = await readLog();
  const text = lines === null
    ? 'Δεν έχει ρυθμιστεί ακόμα αποθήκευση για το log.\nΣυνδέστε μια βάση Upstash Redis (Vercel → Storage → Marketplace → Upstash for Redis) στο project και κάντε redeploy.\n'
    : `ΑΡΧΕΙΟ ΣΥΝΔΕΣΕΩΝ · Inventor Presentations\nΗμερομηνία/ώρα (Αθήνα) | Email\n${'-'.repeat(48)}\n${lines.join('\n')}\n\nΣύνολο: ${lines.length}\n`;
  const dl = new URL(request.url).searchParams.has('download');
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store',
    'Content-Disposition': `${dl ? 'attachment' : 'inline'}; filename="inventor-logins.txt"` } });
}
