import { readSession } from './_auth.js';
export async function GET(request) {
  const s = await readSession(request);
  if (!s) return Response.json({ ok: false }, { status: 401 });
  return Response.json({ ok: true, email: s.e, admin: !!s.a }, { headers: { 'Cache-Control': 'no-store' } });
}
