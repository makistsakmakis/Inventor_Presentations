// Προστασία όλου του site: χωρίς έγκυρη σύνδεση → σελίδα εισόδου
import { readSession } from './api/_auth.js';
const PUBLIC = [/^\/login\//, /^\/api\/login$/, /^\/robots\.txt$/, /^\/favicon\.ico$/];
export default async function middleware(request) {
  const url = new URL(request.url), p = url.pathname;
  // φάκελοι χωρίς "/" στο τέλος → προσθήκη (για να δουλεύουν τα σχετικά paths)
  if (!p.startsWith('/api/') && !p.endsWith('/') && !p.split('/').pop().includes('.')) {
    return Response.redirect(new URL(p + '/' + url.search, url), 308);
  }
  if (PUBLIC.some(r => r.test(p))) return;
  if (/^\/(api\/_|middleware\.js|vercel\.json|README\.md|\.git)/.test(p)) return new Response('Not found', { status: 404 });
  const s = await readSession(request);
  if (s) return;
  if (p.startsWith('/api/')) return new Response('Unauthorized', { status: 401 });
  return Response.redirect(new URL('/login/?next=' + encodeURIComponent(p + url.search), url), 302);
}
export const config = { matcher: '/:path*' };
