'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Copy, FileClock, Globe, Link, LockKeyhole, Phone, UserRound, BadgeCheck, CircleDot, LogOut } from 'lucide-react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { demoAuthenticatorUri, verifyDemoCode } from '@/lib/demo-authenticator';

export type WalletScreen = 'login' | 'mpin' | 'home' | 'deposit' | 'team' | 'profile' | 'authenticator';

function ScreenshotAsset({ src, sourceWidth, sourceHeight, x, y, width, height, alt, className = '' }: {
  src: string; sourceWidth: number; sourceHeight: number; x: number; y: number; width: number; height: number; alt: string; className?: string;
}) {
  const style: CSSProperties = { aspectRatio: `${width} / ${height}` };
  return <div className={`reference-asset ${className}`} style={style}>
    <img src={src} alt={alt} draggable={false} style={{ width: `${sourceWidth / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%`, aspectRatio: `${sourceWidth}/${sourceHeight}` }} />
  </div>;
}

export function GoogleAuthenticatorIcon({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
    <path d="M15 7 33 39" stroke="#EA4335" strokeWidth="7" strokeLinecap="round" />
    <path d="M15 7 24 23" stroke="#FBBC04" strokeWidth="7" strokeLinecap="round" />
    <path d="M7 25H24" stroke="#34A853" strokeWidth="7" strokeLinecap="round" />
    <path d="M15 39 33 7M24 25H41" stroke="#1A73E8" strokeWidth="7" strokeLinecap="round" />
    <path d="m15 39 9-15" stroke="#EA4335" strokeWidth="7" strokeLinecap="round" />
  </svg>;
}

export function WalletLogin({ phone, setPhone, password, setPassword, onSubmit, muted, showNotice }: {
  phone: string; setPhone: (value: string) => void; password: string; setPassword: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void; muted: boolean; showNotice: (text: string) => void;
}) {
  return <div className={`login-page ${muted ? 'is-muted' : ''}`}>
    <header className="login-header"><h1>LOG IN</h1></header>
    <form className="login-form" onSubmit={onSubmit} autoComplete="off">
      <div className="login-fields">
        <label className="login-field"><Phone aria-hidden="true" strokeWidth={1.7} />
          <Input aria-label="Mobile number" name="demo-mobile" inputMode="numeric" autoComplete="off" maxLength={10} value={phone} onChange={event => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Enter Your Phone Number" className="wallet-input" />
        </label>
        <label className="login-field"><LockKeyhole aria-hidden="true" strokeWidth={1.7} />
          <Input aria-label="Password" name="demo-password" type="password" autoComplete="off" value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter Password" className="wallet-input" />
        </label>
        <button type="button" className="forgot-password" onClick={() => showNotice('Use test details to enter this demo.')}>Forget Password</button>
      </div>
      <Button type="submit" disabled={phone.length !== 10 || password.length === 0} className="login-submit">LOG IN</Button>
      <p className="login-demo-note">Demo preview · Use test details only</p>
    </form>
  </div>;
}

export function WalletHome({ footer, showComingSoon }: { footer: ReactNode; showComingSoon: (label: string) => void }) {
  return <div className="wallet-page home-page">
    <div className="home-content">
      <h1 className="home-title">RsWallet</h1>
      <ScreenshotAsset src="/rswallet-home.jpeg" sourceWidth={589} sourceHeight={1280} x={25} y={179} width={539} height={224} alt="A must read for newbies. How to make more profits. Click to read." className="home-hero" />
      <section className="ratio-card">
        <div><h2>USDT Ratio</h2><p className="usdt-value">1 USDT ≈ 109.5 INR</p><p className="bonus-note">Bonus ratio: 0%</p></div>
        <div><h2>INR Bonus Ratio</h2><p className="ratio-percent">4%</p></div>
      </section>
      <ScreenshotAsset src="/rswallet-home.jpeg" sourceWidth={589} sourceHeight={1280} x={25} y={598} width={539} height={135} alt="Newbie Reward" className="newbie-banner" />
      <p className="upi-note">You&apos;re not bound to UPI</p>
      <Button className="bind-upi" onClick={() => showComingSoon('Bind UPI')}>Bind UPI Now</Button>
      <section className="balance-card">
        {['Balance', 'Today Received', 'Top up Bonus', 'Team Commission'].map(label => <button key={label} type="button" onClick={() => showComingSoon(label)}>
          <span>{label}</span><strong>0.00</strong><ChevronRight aria-hidden="true" strokeWidth={1.4} />
        </button>)}
      </section>
    </div>
    {footer}
  </div>;
}

const rows = [
  { label: 'Recharge History', icon: BadgeCheck },
  { label: 'Token History', icon: FileClock },
  { label: 'Languages', icon: Globe, value: 'English' },
  { label: 'Google Authentication', icon: GoogleAuthenticatorIcon },
  { label: 'Lucky Wheel', icon: CircleDot },
];

export function WalletProfile({ footer, navigate, showComingSoon, logout }: {
  footer: ReactNode; navigate: (screen: WalletScreen) => void; showComingSoon: (label: string) => void; logout: () => void;
}) {
  return <div className="wallet-page profile-page">
    <div className="profile-content">
      <button type="button" className="edit-profile" onClick={() => showComingSoon('Edit profile')}><UserRound className="profile-avatar-icon" /><span>Edit profile</span><ChevronDown /></button>
      <p className="profile-id">ID: 10073108</p>
      <section className="quota-section">
        <p className="quota-label"><Link aria-hidden="true" />Quota</p>
        <div className="quota-value-row"><p className="quota-value">54.36 <span>INR</span></p><Button className="top-up" onClick={() => navigate('deposit')}>Top up</Button></div>
        <p className="reward-ratio">Reward ratio 2%</p>
      </section>
      <ScreenshotAsset src="/rswallet-profile.jpeg" sourceWidth={892} sourceHeight={1600} x={38} y={460} width={816} height={171} alt="Invite user rewards. Earn team commissions." className="invite-banner" />
      <section className="profile-options">
        {rows.map(({ label, icon: Icon, value }) => <button type="button" className="profile-option" key={label} onClick={() => label === 'Google Authentication' ? navigate('authenticator') : showComingSoon(label)}>
          <Icon className="profile-option-icon" /><span>{label}</span>{value && <span className="option-value">{value}</span>}<ChevronRight className="option-chevron" strokeWidth={1.8} />
        </button>)}
      </section>
      <Button className="logout-button" onClick={logout}><LogOut aria-hidden="true" />Log out</Button>
    </div>
    {footer}
  </div>;
}

export function AuthenticatorView({ secret, bound, onBound, onBack, showNotice }: {
  secret: string; bound: boolean; onBound: () => void; onBack: () => void; showNotice: (text: string) => void;
}) {
  const [qr, setQr] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!secret || bound) return;
    let cancelled = false;
    QRCode.toDataURL(demoAuthenticatorUri(secret), { width: 600, margin: 1, errorCorrectionLevel: 'M' }).then(url => {
      if (!cancelled) setQr(url);
    }).catch(() => { if (!cancelled) setError('QR unavailable. Enter the setup key manually.'); });
    return () => { cancelled = true; };
  }, [secret, bound]);

  const bind = async (event: React.FormEvent) => {
    event.preventDefault();
    if (checking || code.length !== 6 || !secret) return;
    setChecking(true);
    setError('');
    try {
      if (await verifyDemoCode(secret, code)) { setCode(''); onBound(); }
      else setError('Incorrect code. Enter the current code from Google Authenticator.');
    } catch { setError('Verification unavailable. Please try again.'); }
    finally { setChecking(false); }
  };

  return <div className={`auth-page ${bound ? 'is-bound' : ''}`}>
    <header className="auth-header"><button type="button" aria-label="Back to profile" onClick={onBack}><ChevronLeft strokeWidth={1.9} /></button><h1>Google Authentication</h1></header>
    <GoogleAuthenticatorIcon className="auth-logo" />
    {bound ? <p className="auth-bound" role="status">Google Authenticator has been bound</p> : <form className="auth-form" onSubmit={bind}>
      <p className="auth-instructions">Scan the QR code with Google Authenticator app or enter the key manually</p>
      <div className="auth-qr">{qr ? <img src={qr} alt="Scan to add RsWallet Demo in Google Authenticator" /> : <span>Preparing QR code…</span>}</div>
      <div className="auth-key-row"><span>Key:</span><code aria-label="Authenticator setup key">{secret}</code><button type="button" aria-label="Copy setup key" onClick={async () => {
        try { await navigator.clipboard.writeText(secret); showNotice('Setup key copied'); } catch { showNotice('Select the setup key to copy it.'); }
      }}><Copy strokeWidth={1.8} /></button></div>
      <label className="auth-code-row"><span>Code:</span><Input className="wallet-input" aria-label="Google Authenticator code" inputMode="numeric" autoComplete="one-time-code" value={code} maxLength={6} onChange={event => { setCode(event.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} placeholder="Enter Google Authenticator code" /></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      <Button className="auth-bind" type="submit" disabled={code.length !== 6 || checking || !secret}>{checking ? 'Verifying…' : 'Bind'}</Button>
      <p className="auth-demo-note">Demo setup · Applies to this browser session</p>
    </form>}
  </div>;
}

export function WalletNavIcon({ name }: { name: string }) {
  return <svg viewBox="0 0 40 40" fill="none" className={`wallet-nav-icon nav-icon-${name.toLowerCase()}`} aria-hidden="true">
    {name === 'Home' && <><path d="M4 15 20 4l16 11v20H4z" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" /><path d="M20 25v7" stroke="white" strokeWidth="4" strokeLinecap="round" /></>}
    {name === 'Deposit' && <><circle cx="20" cy="20" r="19" fill="currentColor" /><path d="m13 11-5 5h23M27 29l5-5H9" stroke="white" strokeWidth="3.3" strokeLinecap="round" strokeLinejoin="round" /></>}
    {name === 'UPI' && <><path d="M13 9V4h14v5" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" /><path d="M1 10h38v13H1zM1 25h38v13H1z" fill="currentColor" /><path d="M16 24v4a4 4 0 0 0 8 0v-4" stroke="white" strokeWidth="2" /></>}
    {name === 'Team' && <><rect x="3" y="4" width="34" height="15" rx="4" fill="currentColor" /><rect x="3" y="22" width="22" height="15" rx="4" fill="currentColor" /><rect x="28" y="22" width="9" height="15" rx="4" fill="currentColor" /></>}
    {name === 'Me' && <><path d="M36 4H20a17 17 0 1 0 17 17V4z" fill="currentColor" /><ellipse cx="13" cy="19" rx="2" ry="3" fill="white" /><ellipse cx="21" cy="19" rx="2" ry="3" fill="white" /></>}
  </svg>;
}
