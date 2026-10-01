// Καταγραφή ανοίγματος παρουσίασης ή γεγονότος μέσα της ({p, a:'pdf'} = λήψη PDF)
import { readSession } from './_auth.js';
import { appendLog } from './_log.js';
import { PRESENTATIONS } from './_presentations.js';
export async function POST(request) {
  const s = await readSession(request);
  if (!s) return new Response('Unauthorized', { status: 401 });
  let body = {}; try { body = await request.json(); } catch {}
  const key = String(body.p || '');
  if (!Object.hasOwn(PRESENTATIONS, key)) return Response.json({ ok: false }, { status: 400 });
  try { await appendLog(s.e, key, String(body.a || '')); } catch (e) { console.error('log failed', e); }
  return Response.json({ ok: true });
}
