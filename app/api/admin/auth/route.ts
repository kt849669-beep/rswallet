import { adminAccount, adminCookie, adminToken, createAdminSession, readAdminSession, verifyPassword } from '@/lib/admin-auth';
import { bindings, json, noStore, sameOrigin } from '@/lib/runtime';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const session = await readAdminSession(request.headers);
  if (!session) return json({ error: 'Sign in to the admin panel.' }, 401);
  const { results: sessions } = await bindings().DB.prepare('SELECT id, ip_address, user_agent, created_at, expires_at FROM admin_sessions WHERE account_id = ? AND expires_at > ? ORDER BY created_at DESC').bind(session.id, Date.now()).all();
  return json({ email: session.email, updatedAt: session.updated_at, sessions: sessions.map((s: any) => ({ ...s, current: s.id === adminToken(request.headers) })) });
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Use the admin login page.' }, 403);
  const raw = await request.text();
  if (raw.length > 2048) return json({ error: 'Invalid login request.' }, 400);
  let value: { email?: string; password?: string };
  try { value = JSON.parse(raw); } catch { return json({ error: 'Invalid login request.' }, 400); }
  if (!value || typeof value.email !== 'string' || typeof value.password !== 'string' || value.password.length > 128) return json({ error: 'Enter email and password.' }, 400);
  const db = bindings().DB;
  const attempts = await db.prepare('SELECT failures, blocked_until FROM admin_login_attempts WHERE id = 1').first<{ failures: number; blocked_until: number }>();
  if (attempts && attempts.blocked_until > Date.now()) return json({ error: 'Too many attempts. Try again in one minute.' }, 429);
  const account = await adminAccount();
  const matches = await verifyPassword(value.password, account.password_hash);
  if (!matches || value.email.trim().toLowerCase() !== account.email) {
    const failures = (attempts?.blocked_until ? 0 : attempts?.failures ?? 0) + 1;
    await db.prepare('INSERT INTO admin_login_attempts (id, failures, blocked_until) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET failures = excluded.failures, blocked_until = excluded.blocked_until').bind(failures, failures >= 5 ? Date.now() + 60_000 : 0).run();
    return json({ error: 'Email or password is incorrect.' }, 401);
  }
  await db.prepare('DELETE FROM admin_login_attempts WHERE id = 1').run();
  const token = await createAdminSession(account.version, request);
  return Response.json({ email: account.email }, { headers: { ...noStore, 'Set-Cookie': adminCookie(request, token) } });
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Use the admin panel to sign out.' }, 403);
  await bindings().DB.prepare('DELETE FROM admin_sessions WHERE id = ?').bind(adminToken(request.headers) ?? '').run();
  return Response.json({ ok: true }, { headers: { ...noStore, 'Set-Cookie': adminCookie(request, '', 0) } });
}
