'use client';
import { useState } from 'react';
import { LockKeyhole, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <main className="admin-signin admin-root"><section className="admin-signin-card">
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
      <img src="/rswallet-logo.jpeg" alt="RsWallet" style={{ width:48, height:48, borderRadius:12, objectFit:'cover', flexShrink:0 }} />
      <div>
        <h1 style={{ margin:0, fontSize:22, fontWeight:800, letterSpacing:'-0.03em', background:'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>RsWallet</h1>
        <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.12em', color:'#888', textTransform:'uppercase' }}>Admin Panel</span>
      </div>
    </div>
    <p style={{ margin:'4px 0 16px', fontSize:14, color:'#666' }}>Sign in to manage your app.</p>
    <form onSubmit={async event => {
      event.preventDefault(); if (busy) return; setBusy(true); setError('');
      try {
        const response = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const result = await response.json() as { error?: string };
        if (!response.ok) throw new Error(result.error || 'Unable to sign in.');
        setPassword(''); window.location.replace('/admin');
      } catch (e) { setError((e as Error).message); setBusy(false); }
    }}>
      <label className="admin-field admin-login-label"><span><Mail size={16} />Email</span><Input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter admin email" /></label>
      <label className="admin-field admin-login-label"><span><LockKeyhole size={16} />Password</span><Input type="password" autoComplete="current-password" required maxLength={128} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" /></label>
      {error && <p className="admin-form-error" role="alert">{error}</p>}
      <Button className="admin-login-submit" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Log in'}</Button>
    </form>
  </section></main>;
}
