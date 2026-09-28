// Κοινές ρυθμίσεις & βοηθητικά για σύνδεση (τρέχει μόνο στον server του Vercel — δεν σερβίρεται στον browser)
// ΣΥΣΤΑΣΗ: ορίστε τις τιμές ως Environment Variables στο Vercel (Settings → Environment Variables).
export const VIEWER_PASSWORD = process.env.VIEWER_PASSWORD || '14565';
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'm.flouris@inventor.ac').toLowerCase();
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '4999325';
const SECRET = process.env.AUTH_SECRET || 'inventor-presentations-change-me';
export const COOKIE = 'inv_session';
export const MAX_AGE = 60 * 60 * 12; // 12 ώρες

export const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || '').trim());

const enc = new TextEncoder();
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uText = s => b64u(enc.encode(s));
const fromB64u = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)));
async function hmac(data) {
  const key = await crypto.subtle.importKey('raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64u(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}
export async function makeSession(email, admin) {
  const payload = b64uText(JSON.stringify({ e: email, a: admin ? 1 : 0, x: Math.floor(Date.now() / 1000) + MAX_AGE }));
  return `${payload}.${await hmac(payload)}`;
}
export async function readSession(request) {
  const m = (request.headers.get('cookie') || '').match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return null;
  const [payload, sig] = m[1].split('.');
  if (!payload || !sig || sig !== await hmac(payload)) return null;
  try { const s = JSON.parse(fromB64u(payload)); return s.x > Date.now() / 1000 ? s : null; } catch { return null; }
}

// ---- αποθήκευση log (Upstash Redis / Vercel KV, μέσω REST) ----
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const storageReady = () => !!(KV_URL && KV_TOKEN);
async function kv(cmd) {
  const r = await fetch(KV_URL, { method: 'POST', headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  if (!r.ok) throw new Error('KV ' + r.status);
  return (await r.json()).result;
}
const athens = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date());
export async function appendLog(email) {
  const line = `${athens()} | ${email}`;
  if (!storageReady()) { console.log('[login]', line); return; }
  await kv(['RPUSH', 'inventor:logins', line]);
}
export async function readLog() {
  if (!storageReady()) return null;
  return (await kv(['LRANGE', 'inventor:logins', 0, -1])) || [];
}
