'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [forgot, setForgot] = useState('');
  const [forgotNote, setForgotNote] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please enter email and password.'); setStatus('error'); return; }
    setStatus('loading');
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid credentials. Please try again.');
        setStatus('error');
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-login-logo-name">EUPHORIA <span>AUTO</span> HUB</div>
          <div className="admin-login-logo-sub">Admin Panel</div>
        </div>
        <div className="admin-login-title">Welcome back</div>
        <div className="admin-login-subtitle">Sign in to manage your website content.</div>
        {status === 'error' && (
          <div className="admin-alert admin-alert-error" style={{ marginBottom: 20 }}>{error}</div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="admin-form-input"
              placeholder="admin@euphoriaautohub.in"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              required
              autoComplete="email"
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="admin-form-input"
              placeholder="••••••••••"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, email: p.email, password: e.target.value }))}
              required
              autoComplete="current-password"
            />
          </div>
          <label className="admin-check"><input type="checkbox" checked={showPassword} onChange={(event) => setShowPassword(event.target.checked)} /> Show password</label>
          <button type="button" onClick={() => setShowPassword((value) => !value)} style={{ background: 'transparent', color: 'var(--soft-grey)', border: 0, marginBottom: 8 }}>{showPassword ? 'Hide password' : 'Show password'}</button>
          <button
            id="login-submit"
            type="submit"
            className="admin-btn admin-btn-primary w-full"
            style={{ width: '100%', marginTop: 8, padding: '14px', fontSize: 14 }}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <form style={{ marginTop: 16 }} onSubmit={async (event) => {
          event.preventDefault();
          const res = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: forgot || form.email }) });
          const body = await res.json().catch(() => ({}));
          setForgotNote(body.message || 'Something went wrong. Please try again.');
        }}>
          <label className="admin-form-label" htmlFor="forgot-email">Forgot password</label>
          <input id="forgot-email" type="email" className="admin-form-input" value={forgot} placeholder="Admin email" onChange={(event) => setForgot(event.target.value)} />
          <button className="admin-btn admin-btn-secondary" type="submit" style={{ marginTop: 8 }}>Send reset link</button>
          {forgotNote && <p style={{ color: 'var(--soft-grey)', marginTop: 8 }}>{forgotNote}</p>}
        </form>
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: 13, color: 'var(--soft-grey)', textDecoration: 'none' }}>← Back to Website</Link>
        </div>
      </div>
    </div>
  );
}
