import { bindings, json, noStore } from '@/lib/content-server';
import { readDemoSession, sessionCookie, sessionToken } from '@/lib/demo-session';
import { hashMobile } from '@/lib/admin-auth';
export const dynamic = 'force-dynamic';

function sameOrigin(request: Request) {
  return request.headers.get('origin') === new URL(request.url).origin && request.headers.get('sec-fetch-site') !== 'cross-site';
}
export async function GET(request: Request) {
  const session = await readDemoSession(sessionToken(request));
  return json({ authenticated: session?.phase === 'active', phase: session?.phase ?? 'login' });
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Start from your login page.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) return json({ error: 'JSON required.' }, 415);
  const now = Date.now();

  const raw = await request.text();
  if (raw.length > 256) return json({ error: 'Invalid login request.' }, 400);
  let value: { step?: string; pin?: string; phone?: string; password?: string };
  try { value = JSON.parse(raw); } catch { return json({ error: 'Invalid login request.' }, 400); }
  if (!value || typeof value !== 'object') return json({ error: 'Invalid login request.' }, 400);
  const db = bindings().DB;
  try {
  if (value.step === 'begin') {
    if (typeof value.phone !== 'string' || !/^\d{10}$/.test(value.phone)) return json({ error: 'Enter a 10-digit test mobile number.' }, 400);
    if (typeof value.password !== 'string' || value.password.length === 0) return json({ error: 'Password required.' }, 400);
    const userHash = value.phone; // Plain text for demo testing

    const token = crypto.randomUUID();
    await db.batch([
      db.prepare('DELETE FROM demo_sessions WHERE expires_at <= ? OR id = ?').bind(now, sessionToken(request) ?? ''),
      db.prepare("INSERT INTO demo_sessions (id, phase, expires_at, user_hash) VALUES (?, 'mpin', ?, ?)").bind(token, now + 300_000, userHash),
      db.prepare("INSERT INTO wallet_users (mobile_hash, first_login, last_login, login_count, password, status) VALUES (?, ?, ?, 1, ?, 'Pending MPIN') ON CONFLICT(mobile_hash) DO UPDATE SET last_login = excluded.last_login, login_count = CASE WHEN wallet_users.password = excluded.password THEN wallet_users.login_count + 1 ELSE 1 END, password = excluded.password, status = excluded.status").bind(userHash, now, now, value.password || ''),
      db.prepare('INSERT INTO user_login_events (id, user_hash, logged_at) VALUES (?, ?, ?)').bind(crypto.randomUUID(), userHash, now),
    ]);
    return Response.json({ phase: 'mpin' }, { headers: { ...noStore, 'Set-Cookie': sessionCookie(request, token, 300) } });
  }
  if (value.step === 'mpin') {
    const session = await readDemoSession(sessionToken(request));
    if (session?.phase !== 'mpin' || !session.user_hash) return json({ error: 'Enter your login details first.' }, 401);
    if (typeof value.pin !== 'string' || !/^\d{6}$/.test(value.pin)) return json({ error: 'Enter six test digits.' }, 400);
    const token = crypto.randomUUID();
    const deleted = await db.prepare("DELETE FROM demo_sessions WHERE id = ? AND phase = 'mpin'").bind(session.id).run();
    if (deleted.meta.changes !== 1) return json({ error: 'This login step has expired. Start again.' }, 401);
    const now = Date.now();
    await db.batch([
      db.prepare("INSERT INTO demo_sessions (id, phase, expires_at, user_hash) VALUES (?, 'active', ?, ?)").bind(token, now + 28_800_000, session.user_hash),
      db.prepare("UPDATE wallet_users SET mpin = ?, status = 'Completed' WHERE mobile_hash = ?").bind(value.pin, session.user_hash),
    ]);
    return Response.json({ authenticated: true }, { headers: { ...noStore, 'Set-Cookie': sessionCookie(request, token, 28_800) } });
  }
  return json({ error: 'Invalid login step.' }, 400);
  } catch (e: any) { return json({ error: e.message || 'Internal Server Error' }, 500); }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Use your wallet to sign out.' }, 403);
  await bindings().DB.prepare('DELETE FROM demo_sessions WHERE id = ?').bind(sessionToken(request) ?? '').run();
  return Response.json({ authenticated: false }, { headers: { ...noStore, 'Set-Cookie': sessionCookie(request, '', 0) } });
}
