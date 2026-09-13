import { adminAccount, adminCookie, createAdminSession, hashPassword, verifyPassword } from '@/lib/admin-auth';
import { guardAdmin } from '@/lib/content-server';
import { bindings, json, noStore } from '@/lib/runtime';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  const denied = await guardAdmin(request, true); if (denied) return denied;
  const raw = await request.text();
  if (raw.length > 2048) return json({ error: 'Invalid password change request.' }, 400);
  let value: { oldPassword?: string; newPassword?: string; confirmPassword?: string };
  try { value = JSON.parse(raw); } catch { return json({ error: 'Invalid request.' }, 400); }
  if (!value || typeof value.oldPassword !== 'string' || value.oldPassword.length > 128 || typeof value.newPassword !== 'string' || value.newPassword.length < 8 || value.newPassword.length > 128) return json({ error: 'Use a new password with 8 to 128 characters.' }, 400);
  if (value.newPassword !== value.confirmPassword) return json({ error: 'New and confirm passwords do not match.' }, 400);
  if (value.oldPassword === value.newPassword) return json({ error: 'Choose a different new password.' }, 400);
  const account = await adminAccount();
  if (!await verifyPassword(value.oldPassword, account.password_hash)) return json({ error: 'Old password is incorrect.' }, 400);
  const result = await bindings().DB.prepare('UPDATE admin_accounts SET password_hash = ?, version = version + 1, updated_at = ? WHERE id = 1 AND version = ?')
    .bind(await hashPassword(value.newPassword), Date.now(), account.version).run();
  if (result.meta.changes !== 1) return json({ error: 'Password changed in another session. Sign in again.' }, 409);
  await bindings().DB.prepare('DELETE FROM admin_sessions WHERE version <= ?').bind(account.version).run();
  const token = await createAdminSession(account.version + 1);
  return Response.json({ ok: true }, { headers: { ...noStore, 'Set-Cookie': adminCookie(request, token) } });
}
