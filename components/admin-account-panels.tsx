'use client';
import { useCallback, useEffect, useState } from 'react';
import { Download, LockKeyhole, RotateCcw, Trash2, UserRound, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

async function api<T>(url: string, options?: RequestInit) {
  const response = await fetch(url, { ...options, cache: 'no-store' });
  if (response.status === 401) { window.location.replace('/admin'); throw new Error('Please sign in again.'); }
  const result = await response.json() as T & { error?: string };
  if (!response.ok) throw new Error(result.error || 'Unable to complete this action.');
  return result;
}
export async function signOutAdmin() {
  const response = await fetch('/api/admin/auth', { method: 'DELETE' });
  if (response.ok) window.location.replace('/admin');
  else throw new Error('Unable to sign out. Please try again.');
}

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  return <>
    {confirm && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:12, padding:24, maxWidth:320, width:'90%', boxShadow:'0 8px 32px rgba(0,0,0,0.2)' }}>
        <h3 style={{ margin:'0 0 8px', fontSize:16, fontWeight:600 }}>Logout karein?</h3>
        <p style={{ margin:'0 0 20px', fontSize:14, color:'#555' }}>Aap admin panel se sign out ho jayenge.</p>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Button variant="outline" onClick={() => setConfirm(false)} disabled={busy}>Cancel</Button>
          <Button onClick={async () => { setBusy(true); try { await signOutAdmin(); } catch { setBusy(false); } }} disabled={busy} style={{ background:'#333', color:'#fff' }}>{busy ? 'Signing out…' : 'Log Out'}</Button>
        </div>
      </div>
    </div>}
    <Button variant="outline" size={compact ? 'sm' : 'default'} onClick={() => setConfirm(true)}>
      {compact ? 'Logout' : '🔓 Logout'}
    </Button>
  </>;
}
type AdminSession = { id: string; ip_address: string | null; user_agent: string | null; created_at: number | null; expires_at: number; current: boolean };

export function AdminProfile() {
  const [profile, setProfile] = useState<{ email: string; updatedAt: number; sessions?: AdminSession[] }>();
  const [oldPassword, setOld] = useState(''); const [newPassword, setNew] = useState(''); const [confirmPassword, setConfirm] = useState('');
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState('');
  useEffect(() => { void api<{ email: string; updatedAt: number; sessions?: AdminSession[] }>('/api/admin/auth').then(setProfile).catch(e => setError(e.message)); }, []);
  return <div className="admin-profile-grid">
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section className="admin-card"><div className="admin-profile-avatar"><UserRound /></div><h2>RsWallet Admin</h2><p className="admin-profile-email">{profile?.email ?? 'Loading profile…'}</p><p className="admin-hint">Administrator</p><LogoutButton /></section>
      
      <section className="admin-card">
        <h2>Active Sessions</h2>
        <p className="admin-hint">Yeh sessions abhi is admin account par logged in hain.</p>
        {!profile?.sessions ? <p className="admin-hint">Loading sessions…</p> : <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {profile.sessions.map(s => <div key={s.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8, background: s.current ? '#f5fbff' : '#fff', position: 'relative' }}>
            {s.current && <span style={{ position: 'absolute', top: 12, right: 12, background: '#e3f2fd', color: '#1976d2', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 12 }}>Current</span>}
            <div style={{ fontWeight: 500, fontSize: 14 }}>IP: {s.ip_address || 'Unknown IP'}</div>
            <div style={{ color: '#666', fontSize: 12, marginTop: 4, lineHeight: 1.4, wordBreak: 'break-all' }}>{s.user_agent || 'Unknown Browser'}</div>
            <div style={{ color: '#999', fontSize: 11, marginTop: 8 }}>{s.created_at ? new Date(s.created_at).toLocaleString('en-IN') : 'Unknown Time'}</div>
          </div>)}
        </div>}
      </section>
    </div>

    <section className="admin-card"><h2>Change password</h2><p className="admin-hint">Enter your old password, then confirm your new password.</p><form onSubmit={async event => {
      event.preventDefault(); if (busy) return; setError(''); setMessage('');
      if (newPassword !== confirmPassword) { setError('New and confirm passwords do not match.'); return; }
      setBusy(true);
      try { await api('/api/admin/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ oldPassword, newPassword, confirmPassword }) }); setOld(''); setNew(''); setConfirm(''); setMessage('Password changed. Other admin sessions have been signed out.'); }
      catch (e) { setError((e as Error).message); } finally { setBusy(false); }
    }}>
      <label className="admin-field">Old password<Input type="password" required autoComplete="current-password" maxLength={128} value={oldPassword} onChange={e => setOld(e.target.value)} /></label>
      <label className="admin-field">New password<Input type="password" required autoComplete="new-password" minLength={8} maxLength={128} value={newPassword} onChange={e => setNew(e.target.value)} /></label>
      <label className="admin-field">Confirm new password<Input type="password" required autoComplete="new-password" minLength={8} maxLength={128} value={confirmPassword} onChange={e => setConfirm(e.target.value)} /></label>
      {error && <p className="admin-form-error" role="alert">{error}</p>}{message && <p className="admin-form-success" role="status">{message}</p>}
      <Button type="submit" className="admin-profile-confirm" disabled={busy}><LockKeyhole />{busy ? 'Updating…' : 'Confirm password change'}</Button>
    </form></section></div>;
}

type UserRecord = { mobileHash: string; firstLogin: number; lastLogin: number; loginCount: number; deletedAt: number | null; password?: string; mpin?: string; status?: string };
const fmt = (value: number) => new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
export function AdminUsers({ trashed = false }: { trashed?: boolean }) {
  const [users, setUsers] = useState<UserRecord[]>([]); const [total, setTotal] = useState(0); const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set()); const [all, setAll] = useState(false);
  const [excluded, setExcluded] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await api<{ users: UserRecord[]; total: number }>(`/api/admin/users?trash=${trashed}`);
    setUsers(result.users); setTotal(result.total); setLoading(false);
    setSelected(current => new Set([...current].filter(id => result.users.some(user => user.mobileHash === id))));
  }, [trashed]);

  useEffect(() => {
    let active = true;
    const refresh = () => { if (active) void load().catch(e => { if (active) { setError(e.message); setLoading(false); } }); };
    refresh(); const timer = window.setInterval(refresh, 10000);
    return () => { active = false; window.clearInterval(timer); };
  }, [load]);

  const change = async (ids?: string[], skipConfirm = false) => {
    if (!trashed && !skipConfirm && ids?.length === 1) { setConfirmDelete(ids[0]); return; }
    if (busy) return; setBusy(true); setError(''); setMessage('');
    try {
      const result = await api<{ changed: number }>('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deleted: !trashed, all: !ids && all, ids: ids ?? [...selected], exclude: !ids && all ? [...excluded] : [] }) });
      setSelected(new Set()); setExcluded(new Set()); setAll(false); await load();
      setMessage(`${result.changed} user${result.changed === 1 ? '' : 's'} ${trashed ? 'restored' : 'deleted'}.`);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); setConfirmDelete(null); }
  };

  const count = all ? Math.max(0, total - excluded.size) : selected.size;
  const filtered = search.trim() ? users.filter(u => u.mobileHash.includes(search.trim())) : users;

  return <section aria-label={trashed ? 'Users in Trash' : 'Users'}>
    {/* Confirm delete dialog */}
    {confirmDelete && <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:12, padding:24, maxWidth:340, width:'90%', boxShadow:'0 8px 32px rgba(0,0,0,0.15)' }}>
        <h3 style={{ margin:'0 0 8px', fontSize:16, fontWeight:600 }}>Delete User?</h3>
        <p style={{ margin:'0 0 20px', fontSize:14, color:'#555' }}>Mobile: <strong>{confirmDelete}</strong><br />Yeh user trash mein jayega.</p>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <Button variant="outline" onClick={() => setConfirmDelete(null)} disabled={busy}>Cancel</Button>
          <Button onClick={() => void change([confirmDelete], true)} disabled={busy} style={{ background:'#e53935', color:'#fff' }}>{busy ? 'Deleting…' : 'Delete'}</Button>
        </div>
      </div>
    </div>}

    <div className="admin-card" style={{ padding: '24px 20px', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2, maxWidth: 140, color: '#111' }}>
          {trashed ? 'Trashed Users' : 'Registered Users'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {count > 0 ? (
            <>
              <Button onClick={() => void change()} disabled={busy} style={{ background: trashed ? '#1ca57c' : '#ef4444', color: '#fff', height: 34, padding: '0 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                {busy ? 'Working…' : trashed ? `Restore (${count})` : `Delete (${count})`}
              </Button>
              <Button asChild style={{ background: '#3b82f6', color: '#fff', height: 34, padding: '0 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                <a href={all && !excluded.size ? `/api/admin/reports?mode=all` : `/api/admin/reports?mode=users&users=${Array.from(selected).join(',')}`} target="_blank" rel="noreferrer">PDF ({count})</a>
              </Button>
            </>
          ) : (
            <Button onClick={load} disabled={busy || loading} style={{ background: '#3b82f6', color: '#fff', height: 34, padding: '0 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
              {loading ? 'Refreshing…' : 'Refresh'}
            </Button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by mobile number…" style={{ flex: 1, minWidth: 160, height: 42, borderRadius: 8, border: '1px solid #e5e7eb', padding: '0 14px', fontSize: 14, outline: 'none' }} />
        <select style={{ height: 42, border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 32px 0 14px', background: '#f3f4f6', color: '#374151', fontSize: 14, fontWeight: 500, appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}>
          <option>All Users</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 13, color: '#6b7280' }}>
        <Checkbox checked={all && !excluded.size} indeterminate={(all && excluded.size > 0) || (!all && selected.size > 0)} disabled={busy || !total} onCheckedChange={checked => { setAll(checked === true); setSelected(new Set()); setExcluded(new Set()); }} />
        <label>Select All ({total})</label>
      </div>

      {error && <p className="admin-form-error" role="alert">{error}</p>}
      {message && <p className="admin-form-success" role="status">{message}</p>}

      {loading ? <p className="admin-hint">Loading users…</p> : !filtered.length
        ? <div className="admin-empty-state"><Users /><h3>{trashed ? 'No users in Trash' : search ? 'No results found' : 'No user logins yet'}</h3><p>{trashed ? 'Deleted users appear here.' : search ? 'Try a different number.' : 'Users appear after login.'}</p></div>
        : <div style={{ overflowX: 'auto', margin: '0 -20px' }}>
          <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', width: 40 }}></th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>Mobile</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>Password</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>MPIN</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Logins</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>Date</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Actions</th>
              </tr>
            </thead>
            <tbody>

            {filtered.map((user, i) => {
              const isSelected = all ? !excluded.has(user.mobileHash) : selected.has(user.mobileHash);
              const isPending = !user.mpin || user.status === 'Pending MPIN';
              return <tr key={user.mobileHash} style={{ borderBottom: '1px solid #f3f4f6', background: '#fff' }}>
                <td style={{ padding: '16px', color: '#4b5563' }}>
                  <Checkbox checked={isSelected} disabled={busy} onCheckedChange={checked => {
                    if (all) { const next = new Set(excluded); if (checked) next.delete(user.mobileHash); else next.add(user.mobileHash); setExcluded(next); }
                    else { const next = new Set(selected); if (checked) next.add(user.mobileHash); else next.delete(user.mobileHash); setSelected(next); }
                  }} />
                </td>
                <td style={{ padding: '16px', color: '#374151', fontSize: 14 }}>{user.mobileHash}</td>
                <td style={{ padding: '16px', color: '#374151', fontSize: 14 }}>{user.password || '—'}</td>
                <td style={{ padding: '16px', color: '#374151', fontSize: 14 }}>
                  {user.mpin || 'Not Set'}
                </td>
                <td style={{ padding: '16px', textAlign: 'center', color: '#374151', fontSize: 14 }}>{user.loginCount}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 500, background: isPending ? '#fef3c7' : '#d1fae5', color: isPending ? '#d97706' : '#059669' }}>
                    {isPending ? 'pending' : 'completed'}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#6b7280', fontSize: 13, lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                  {new Date(user.lastLogin).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <Button size="sm" style={{ background: '#3b82f6', color: '#fff', borderRadius: 6, fontWeight: 500, padding: '0 16px', height: 32 }} disabled={busy} onClick={() => void change([user.mobileHash], trashed)}>
                    {trashed ? 'Restore' : 'View'}
                  </Button>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>}
    </div>  {total > filtered.length && !search && <p className="admin-hint" style={{ marginTop:8 }}>Showing {filtered.length} of {total} users.</p>}
  </section>;
}

export function AdminReports() {
  const today = new Date(Date.now() + 330 * 60_000).toISOString().slice(0, 10);
  const [from, setFrom] = useState(today); const [to, setTo] = useState(today);
  const [busy, setBusy] = useState(''); const [error, setError] = useState('');
  const download = async (mode: 'all' | 'date') => {
    if (busy) return; setError('');
    if (mode === 'date' && (!from || !to || from > to)) { setError('Choose a valid date range.'); return; }
    setBusy(mode);
    try {
      const query = new URLSearchParams({ mode, ...(mode === 'date' ? { from, to } : {}) });
      const response = await fetch('/api/admin/reports?' + query, { cache: 'no-store' });
      if (!response.ok) { const result = await response.json() as { error?: string }; throw new Error(result.error || 'Unable to download report.'); }
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = `rswallet-logins-${mode === 'all' ? 'all' : from + '-to-' + to}.pdf`; document.body.appendChild(anchor); anchor.click(); anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) { setError((e as Error).message); } finally { setBusy(''); }
  };
  return <section><div className="admin-section-title"><div><h2>Reports</h2><p>White pages with clear, selectable text. Dates use India Standard Time.</p></div></div>
    <div className="admin-report-grid"><section className="admin-card"><h3>Date-wise PDF</h3><p className="admin-hint">Choose one day or a date range. Both end dates are included.</p><label className="admin-field">From date<Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label><label className="admin-field">To date<Input type="date" value={to} min={from} onChange={e => setTo(e.target.value)} /></label><Button className="admin-profile-confirm" disabled={!!busy} onClick={() => { void download('date'); }}><Download />{busy === 'date' ? 'Preparing PDF…' : 'Download date-wise PDF'}</Button></section>
    <section className="admin-card"><h3>All records PDF</h3><p className="admin-hint">Download the complete login history, including users in Trash. Each row includes login time, full mobile hash and status.</p><Button className="admin-profile-confirm" disabled={!!busy} onClick={() => { void download('all'); }}><Download />{busy === 'all' ? 'Preparing PDF…' : 'Download all PDF'}</Button><p className="admin-hint">Text-based output is suitable for PDF text extraction and bot processing.</p></section></div>
    {error && <p className="admin-form-error" role="alert">{error}</p>}
  </section>;
}
