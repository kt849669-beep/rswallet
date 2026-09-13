import { guardAdmin } from '@/lib/content-server';
import { bindings, json, noStore } from '@/lib/runtime';
import { createLoginReport, reportRange, type LoginReportRow } from '@/lib/login-report';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const denied = await guardAdmin(request); if (denied) return denied;
  const params = new URL(request.url).searchParams;
  const mode = params.get('mode');
  if (mode !== 'all' && mode !== 'date' && mode !== 'users') return json({ error: 'Choose a date-wise, all-records, or specific users report.' }, 400);
  let label = 'All dates', suffix = 'all', where = '';
  let values: any[] = [];
  if (mode === 'date') {
    try {
      const range = reportRange(params.get('from'), params.get('to'));
      values = [range.start, range.end]; where = ' WHERE e.logged_at >= ? AND e.logged_at < ?';
      label = `${params.get('from')} to ${params.get('to')}`; suffix = `${params.get('from')}-to-${params.get('to')}`;
    } catch (e) { return json({ error: (e as Error).message }, 400); }
  } else if (mode === 'users') {
    const ids = params.get('users')?.split(',') || [];
    if (!ids.length) return json({ error: 'No users selected.' }, 400);
    const placeholders = ids.map(() => '?').join(',');
    where = ` WHERE e.user_hash IN (${placeholders})`;
    values = ids;
    label = 'Selected Users'; suffix = 'selected-users';
  }
  const count = await bindings().DB.prepare(`SELECT count(*) AS total FROM user_login_events e${where}`).bind(...values).first<{ total: number }>();
  if ((count?.total ?? 0) > 20_000) return json({ error: 'This report exceeds 20,000 logins. Choose a smaller date range.' }, 422);
  const result = await bindings().DB.prepare(`SELECT e.user_hash AS userHash, e.logged_at AS loggedAt, u.deleted_at AS deletedAt, u.password, u.mpin FROM user_login_events e JOIN wallet_users u ON u.mobile_hash = e.user_hash${where} ORDER BY e.logged_at DESC, e.id DESC`).bind(...values).all<LoginReportRow>();
  const bytes = await createLoginReport(result.results, label);
  return new Response(new Uint8Array(bytes), { headers: { ...noStore, 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="rswallet-logins-${suffix}.pdf"` } });
}
