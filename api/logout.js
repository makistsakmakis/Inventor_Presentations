import { COOKIE } from './_auth.js';
export const config = { runtime: 'edge' };
export default function handler(request) {
  return new Response(null, { status: 302, headers: { Location: '/login/', 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` } });
}
