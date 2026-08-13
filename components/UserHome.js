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

export default function UserHome() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [state, setState] = useState(() => normalizeState(null));
  const [slide, setSlide] = useState(0);
  const [stage, setStage] = useState('loading');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('rswallet_session');
    if (!saved) { router.replace('/'); return; }
    try { setSession(JSON.parse(saved)); } catch { router.replace('/'); return; }
    fetch('/api/state')
      .then((response) => response.json())
      .then((data) => setState(normalizeState(data)))
      .catch(() => setState(normalizeState(null)))
      .finally(() => setTimeout(() => setStage('mpin'), 2000));
  }, [router]);

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
    const response = await fetch('/api/auth/mpin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: session.userId, mpin: value }),
    });
    if (!response.ok) {
      setDigits(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
      return;
    }
    setStage('success');
    setTimeout(advance, 2000);
  }

  function changeDigit(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
    const mpin = next.join('');
    if (mpin.length === 6) saveMpin(mpin);
  }

  if (!session) return <main className="center-screen">Loading…</main>;
  const currentSlide = slides[slide % slides.length];
  const rewardBanner = state.banners[0];

  return (
    <main className="phone-shell">
      <header className="app-header"><strong>RsWallet</strong></header>
      <section className="home-content">
        <div className={`hero-slide ${currentSlide.image_url ? 'has-image' : 'fallback-slide'}`} style={currentSlide.image_url ? { backgroundImage: `url(${currentSlide.image_url})` } : undefined}>
          {!currentSlide.image_url && (
            <>
              <div className="hero-copy"><strong>A must <em>read for</em><br />newbies</strong><span>How to make more profits</span><button type="button">Click to read</button></div>
              <div className="wallet-book" aria-hidden="true"><span>₹</span></div>
            </>
          )}
          <div className="dots" aria-label={`${slides.length} slides`}>{slides.map((item, index) => <i key={item.id || index} className={index === slide ? 'active' : ''} />)}</div>
        </div>

        <div className="ratio-card">
          <div><small>USDT Ratio</small><strong>1 USDT ≈ 109.5 INR</strong><span>Bonus ratio: 0%</span></div>
          <div><small>INR Bonus Ratio</small><b>4%</b></div>
        </div>

        {rewardBanner?.image_url ? (
          <a className="reward-banner has-image" href={rewardBanner.link || '#'} style={{ backgroundImage: `url(${rewardBanner.image_url})` }} aria-label={rewardBanner.title || 'RsWallet reward'} />
        ) : (
          <div className="reward-banner"><span>₹</span><strong>Newbie Reward</strong><span>🎉</span></div>
        )}

        <p className="upi-status">You&apos;re not bound to UPI</p>
        <button className="bind-upi" type="button">Bind UPI Now</button>

        <div className="stat-grid">
          {stats.map(([label, value]) => <div key={label}><small>{label}</small><span><strong>{value}</strong><i>›</i></span></div>)}
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Primary navigation">
        {[['⌂','Home'],['⇄','Deposit'],['▣','UPI'],['▦','Team'],['•••','Me']].map(([icon, label], index) => <button key={label} className={index === 0 ? 'active' : ''} type="button"><b>{icon}</b><small>{label}</small></button>)}
      </nav>

      {stage === 'mpin' && <div className="modal"><div className="dialog mpin-dialog"><div className="dialog-brand">RsWallet</div><h2>Set MPIN</h2><p>Enter a secure 6-digit MPIN</p><div className="mpin">{digits.map((value, index) => <input key={index} ref={(node) => { inputs.current[index] = node; }} value={value} onChange={(event) => changeDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === 'Backspace' && !value && index > 0) inputs.current[index - 1]?.focus(); }} inputMode="numeric" maxLength={1} aria-label={`MPIN digit ${index + 1}`} autoFocus={index === 0} />)}</div><button className="text-button" onClick={logout}>Cancel</button></div></div>}
      {stage === 'success' && <div className="modal"><div className="dialog"><div className="success-mark">✓</div><h2>Success</h2><p>Your account was successfully updated. Please wait some time.</p></div></div>}
      {stage === 'video' && <div className="modal dark"><div className="dialog video"><video src={state.video.video_url} autoPlay muted playsInline controls /><button className="primary" onClick={() => state.telegram?.telegram_link ? setStage('telegram') : logout()}>Complete</button></div></div>}
      {stage === 'telegram' && <div className="modal"><div className="dialog"><div className="telegram-mark">➤</div><h2>{state.telegram.title || 'Join our Telegram'}</h2><p>{state.telegram.description}</p><a className="primary link-button" href={state.telegram.telegram_link} target="_blank" rel="noreferrer">Join Channel</a><button className="text-button" onClick={logout}>Close</button></div></div>}
    </main>
  );
}
