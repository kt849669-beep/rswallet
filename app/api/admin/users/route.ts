import { guardAdmin } from '@/lib/content-server';
import { bindings, json } from '@/lib/runtime';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const denied = await guardAdmin(request); if (denied) return denied;
  const trashed = new URL(request.url).searchParams.get('trash') === 'true';
  const where = `deleted_at IS ${trashed ? 'NOT ' : ''}NULL`;
  const [users, count] = await Promise.all([
    bindings().DB.prepare(`SELECT mobile_hash AS "mobileHash", first_login AS "firstLogin", last_login AS "lastLogin", login_count AS "loginCount", deleted_at AS "deletedAt", password, mpin, status FROM wallet_users WHERE ${where} ORDER BY last_login DESC, mobile_hash LIMIT 500`).all(),
    bindings().DB.prepare(`SELECT count(*) AS total FROM wallet_users WHERE ${where}`).first<{ total: number }>(),
  ]);
  return json({ users: users.results, total: count?.total ?? 0 });
}
export async function PATCH(request: Request) {
  const denied = await guardAdmin(request, true); if (denied) return denied;
  const raw = await request.text(); if (raw.length > 40000) return json({ error: 'Select up to 500 users or use Select all.' }, 400);
  let value: { deleted?: boolean; all?: boolean; ids?: string[]; exclude?: string[] };
  try { value = JSON.parse(raw); } catch { return json({ error: 'Invalid selection.' }, 400); }
  if (!value || typeof value.deleted !== 'boolean' || (value.all !== undefined && typeof value.all !== 'boolean')) return json({ error: 'Invalid action.' }, 400);
  const ids = value.all ? [] : value.ids;
  if (!value.all && (!Array.isArray(ids) || !ids.length || ids.length > 500 || ids.some(id => typeof id !== 'string'))) return json({ error: 'Select valid users.' }, 400);
  const excluded = value.exclude ?? [];
  if (!Array.isArray(excluded) || excluded.length > 500 || excluded.some(id => typeof id !== 'string')) return json({ error: 'Invalid excluded users.' }, 400);
  // JSON_each keeps bulk selection within D1's SQL parameter limit.
  const selection = value.all ? (excluded.length ? ' AND mobile_hash NOT IN (SELECT value FROM json_each(?))' : '') : ' AND mobile_hash IN (SELECT value FROM json_each(?))';
  const query = bindings().DB.prepare(`UPDATE wallet_users SET deleted_at = ? WHERE deleted_at IS ${value.deleted ? '' : 'NOT '}NULL${selection}`);
  const args = selection ? [value.deleted ? Date.now() : null, JSON.stringify(value.all ? excluded : ids)] : [value.deleted ? Date.now() : null];
  const result = await query.bind(...args).run();
  return json({ changed: result.meta.changes });
}
