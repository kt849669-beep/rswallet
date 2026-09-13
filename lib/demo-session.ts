import { bindings } from './content-server';

export const sessionCookieName = 'rswallet_demo_session';
export type DemoSession = { id: string; phase: 'mpin' | 'active'; expires_at: number; user_hash: string | null };
export async function readDemoSession(token?: string): Promise<DemoSession | null> {
  if (!token || !/^[a-f0-9-]{36}$/.test(token)) return null;
  return bindings().DB.prepare('SELECT id, phase, expires_at, user_hash FROM demo_sessions WHERE id = ? AND expires_at > ?')
    .bind(token, Date.now()).first<DemoSession>();
}
export function sessionToken(request: Request) {
  return request.headers.get('cookie')?.split(';').map(item => item.trim()).find(item => item.startsWith(sessionCookieName + '='))?.slice(sessionCookieName.length + 1);
}
export function sessionCookie(request: Request, token: string, maxAge: number) {
  return `${sessionCookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
