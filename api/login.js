import { isEmail, VIEWER_PASSWORD, ADMIN_EMAIL, ADMIN_PASSWORD, makeSession, COOKIE, MAX_AGE } from './_auth.js';
import { appendLog } from './_log.js';
export async function POST(request) {
  let body = {}; try { body = await request.json(); } catch {}
  const email = String(body.email || '').trim().toLowerCase(), pass = String(body.password || '');
  if (!isEmail(email)) return Response.json({ ok: false, error: 'email' }, { status: 400 });
  const admin = email === ADMIN_EMAIL && pass === ADMIN_PASSWORD;
  if (!admin && pass !== VIEWER_PASSWORD) return Response.json({ ok: false, error: 'password' }, { status: 401 });
  try { await appendLog(email); } catch (e) { console.error('log failed', e); }
  const token = await makeSession(email, admin);
  return new Response(JSON.stringify({ ok: true, admin }), { status: 200, headers: {
    'Content-Type': 'application/json',
    'Set-Cookie': `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}` } });
}
