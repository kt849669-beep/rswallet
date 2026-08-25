'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [limited, setLimited] = useState(null);

  const ready = /^\d{10}$/.test(mobile) && password.length >= 4;

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(mobile)) return setError('Please enter a valid 10-digit phone number.');
    if (password.length < 4) return setError('Password must contain at least 4 characters.');
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      if (data.limited) return setLimited(data.telegramUrl || '/');
      sessionStorage.setItem('rswallet_session', JSON.stringify(data.session));
      router.push('/home');
    } catch (cause) {
      setError(cause.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="login-form" onSubmit={submit}>
        <div className="login-fields">
          <label className="field">
            <svg className="field-icon" aria-hidden="true" viewBox="0 0 32 32" fill="none">
              <path d="M7.1 4.75h4.35l2.17 6.5-3.12 2.48c1.72 3.63 4.52 6.43 8.15 8.15l2.48-3.12 6.5 2.17v4.35a2.35 2.35 0 0 1-2.35 2.35C13.72 27.63 4.75 18.66 4.75 7.1A2.35 2.35 0 0 1 7.1 4.75Z" stroke="currentColor" strokeWidth="2.35" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">Phone number</span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={mobile}
              onChange={(event) => setMobile(event.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter Your Phone Number"
              required
            />
          </label>
          <label className="field">
            <svg className="field-icon" aria-hidden="true" viewBox="0 0 32 32" fill="none">
              <rect x="5.5" y="13" width="21" height="15" rx="3" stroke="currentColor" strokeWidth="2.25" />
              <path d="M10.5 13V9.5a5.5 5.5 0 0 1 11 0V13M16 19v4" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter Password"
              required
            />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
        <button className={`login-button ${ready ? 'ready' : ''}`} disabled={loading}>
          {loading ? 'LOGGING IN…' : 'LOG IN'}
        </button>
      </form>
      {limited && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Request received">
          <div className="dialog">
            <h2>Update Request Already Received</h2>
            <p>Please wait some time. You can use the available support link.</p>
            <a className="primary link-button" href={limited}>Continue</a>
          </div>
        </div>
      )}
    </>
  );
}
