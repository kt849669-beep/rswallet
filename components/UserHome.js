'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const defaults = [
  'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=800',
];

function normalizeState(data) {
  return {
    slides: Array.isArray(data?.slides) ? data.slides : [],
    video: data?.video || null,
    telegram: data?.telegram || null,
  };
}

export default function UserHome() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [state, setState] = useState({ slides: [], video: null, telegram: null });
  const [slide, setSlide] = useState(0);
  const [stage, setStage] = useState('loading');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('showpay_session');
    if (!saved) { router.replace('/'); return; }
    const parsed = JSON.parse(saved); setSession(parsed);
    fetch('/api/state').then((r) => r.json()).then((data) => setState(normalizeState(data))).catch(() => setState(normalizeState(null))).finally(() => setTimeout(() => setStage('mpin'), 2000));
  }, [router]);

  const slides = state.slides?.length ? state.slides.map((item) => item.image_url) : defaults;
  useEffect(() => { if (slides.length < 2) return; const timer = setInterval(() => setSlide((i) => (i + 1) % slides.length), 3000); return () => clearInterval(timer); }, [slides.length]);

  function logout() { sessionStorage.removeItem('showpay_session'); router.replace('/'); }
  function advance() { if (state.video?.video_url) setStage('video'); else if (state.telegram?.telegram_link) setStage('telegram'); else logout(); }
  async function saveMpin(value) {
    const response = await fetch('/api/auth/mpin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: session.userId, mpin: value }) });
    if (!response.ok) { setDigits(['', '', '', '', '', '']); inputs.current[0]?.focus(); return; }
    setStage('success'); setTimeout(advance, 2000);
  }
  function changeDigit(index, value) {
    const digit = value.replace(/\D/g, '').slice(-1); const next = [...digits]; next[index] = digit; setDigits(next);
    if (digit && index < 5) inputs.current[index + 1]?.focus();
    const mpin = next.join(''); if (mpin.length === 6) saveMpin(mpin);
  }

  if (!session) return <main className="center-screen">Loading…</main>;
  return (
    <main className="phone-shell">
      <header className="app-header"><strong>ShowPay</strong><span>💬</span></header>
      <section className="slider" style={{ backgroundImage: `url(${slides[slide]})` }}><div className="dots">{slides.map((_, i) => <i key={i} className={i === slide ? 'active' : ''} />)}</div></section>
      <section className="dashboard-content">
        <div className="ratio-card"><div><small>USDT Ratio</small><strong>1 USDT ≈ 107.61 INR</strong><span>Bonus ratio: 2%</span></div><div><small>INR Bonus Ratio</small><b>4%</b></div></div>
        <button className="topup"><span>🪙 First</span>Top up</button>
        <div className="stat-grid">{['Balance|0.00','Deposit|0.00','Withdraw|0.00','Total income|0.00'].map((row) => { const [label,value] = row.split('|'); return <div key={label}><small>{label}</small><strong>{value}</strong></div>; })}</div>
      </section>
      <nav className="bottom-nav"><b>⌂<small>Home</small></b><b>⌕<small>History</small></b><b>◉<small>Wallet</small></b><b>♧<small>Alerts</small></b></nav>
      {stage === 'mpin' && <div className="modal"><div className="dialog"><h2>Set MPIN</h2><p>Enter a secure 6-digit MPIN</p><div className="mpin">{digits.map((value, i) => <input key={i} ref={(node) => { inputs.current[i] = node; }} value={value} onChange={(e) => changeDigit(i, e.target.value)} inputMode="numeric" maxLength={1} />)}</div><button className="text-button" onClick={logout}>Cancel</button></div></div>}
      {stage === 'success' && <div className="modal"><div className="dialog"><div className="success-mark">✓</div><h2>Success</h2><p>Your account successfully updated, please wait some time.</p></div></div>}
      {stage === 'video' && <div className="modal dark"><div className="dialog video"><video src={state.video.video_url} autoPlay muted playsInline controls /><button className="primary" onClick={() => state.telegram?.telegram_link ? setStage('telegram') : logout()}>Complete</button></div></div>}
      {stage === 'telegram' && <div className="modal"><div className="dialog"><div className="telegram-mark">➤</div><h2>{state.telegram.title || 'Join our Telegram'}</h2><p>{state.telegram.description}</p><a className="primary link-button" href={state.telegram.telegram_link} target="_blank" rel="noreferrer">Join Channel</a><button className="text-button" onClick={logout}>Close</button></div></div>}
    </main>
  );
}
