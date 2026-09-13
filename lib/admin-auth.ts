import { bindings } from './runtime';

export const adminCookieName = 'rswallet_admin_session';
const iterations = 100_000;
const hex = (bytes: ArrayBuffer) => Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2, '0')).join('');
export type AdminAccount = { id: number; email: string; password_hash: string; mobile_hash_key: string; version: number; updated_at: number };
export async function hashPassword(password: string, salt = crypto.randomUUID()) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', iterations, salt: new TextEncoder().encode(salt) }, key, 256);
  return `pbkdf2$${salt}$${hex(bits)}`;
}
export async function verifyPassword(password: string, expected: string) {
  const [, salt] = expected.split('$');
  const actual = await hashPassword(password, salt);
  let difference = actual.length ^ expected.length;
  for (let i = 0; i < actual.length; i++) difference |= actual.charCodeAt(i) ^ (expected.charCodeAt(i) || 0);
  return difference === 0;
}
export async function adminAccount(): Promise<AdminAccount> {
  const db = bindings().DB;
  let account = await db.prepare('SELECT * FROM admin_accounts WHERE id = 1').first<AdminAccount>();
  if (!account) {
    const hash = await hashPassword('admin@01234');
    await db.prepare('INSERT OR IGNORE INTO admin_accounts (id, email, password_hash, mobile_hash_key, version, updated_at) VALUES (1, ?, ?, ?, 1, ?)')
      .bind('admin@rswallet.com', hash, crypto.randomUUID() + crypto.randomUUID(), Date.now()).run();
    account = await db.prepare('SELECT * FROM admin_accounts WHERE id = 1').first<AdminAccount>();
  }
  if (!account) throw new Error('Admin account is unavailable.');
  return account;
}
export function adminToken(headers: Headers) {
  return headers.get('cookie')?.split(';').map(item => item.trim()).find(item => item.startsWith(adminCookieName + '='))?.slice(adminCookieName.length + 1);
}
export async function readAdminSession(headers: Headers) {
  const token = adminToken(headers);
  if (!token || !/^[a-f0-9-]{36}$/.test(token)) return null;
  return bindings().DB.prepare('SELECT a.id, a.email, a.version, a.updated_at FROM admin_accounts a JOIN admin_sessions s ON s.account_id = a.id AND s.version = a.version WHERE s.id = ? AND s.expires_at > ?')
    .bind(token, Date.now()).first<{ id: number; email: string; version: number; updated_at: number }>();
}
export function adminCookie(request: Request, token: string, maxAge = 28_800) {
  return `${adminCookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(request.url).protocol === 'https:' ? '; Secure' : ''}`;
}
export async function createAdminSession(version: number, request?: Request) {
  const token = crypto.randomUUID();
  const now = Date.now();
  const ip = request?.headers.get('x-forwarded-for') || request?.headers.get('cf-connecting-ip') || 'Unknown';
  const ua = request?.headers.get('user-agent') || 'Unknown';
  await bindings().DB.batch([
    bindings().DB.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').bind(now),
    bindings().DB.prepare('INSERT INTO admin_sessions (id, account_id, version, expires_at, ip_address, user_agent, created_at) VALUES (?, 1, ?, ?, ?, ?, ?)').bind(token, version, now + 28_800_000, ip, ua, now),
  ]);
  return token;
}
export async function hashMobile(mobile: string) {
  const account = await adminAccount();
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(account.mobile_hash_key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(mobile)));
}
