import { COOKIE } from './_auth.js';
export function GET() {
  return new Response(null, { status: 302, headers: { Location: '/login/', 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` } });
}
