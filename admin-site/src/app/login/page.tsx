'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api, API_BASE, setToken, setUser, getToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('developer@gmail.com');
  const [password, setPassword] = useState('developer$123');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getToken()) router.replace('/dashboard');
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const r = await api<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST', body: { email, password }, noAuth: true,
      });
      setToken(r.token);
      setUser(r.user);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth">
      <form className="auth-card" onSubmit={onSubmit}>
        <div className="auth-logo">
          {/* Auth card has white background → use the dark-coloured logo (file: Light.png) */}
          <img src={`${API_BASE}/uploads/seed/Logo/Light.png`} alt="Sodiq School" />
        </div>
        <h1>Admin paneli</h1>
        <p className="sub">Boshqaruv paneliga kirish</p>
        {error && <div className="auth-error">{error}</div>}
        <label className="field">
          <span className="field-label">Email</span>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>
        <label className="field">
          <span className="field-label">Parol</span>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={busy}>
          {busy ? 'Kirilmoqda...' : 'Kirish'}
        </button>
        <p className="muted" style={{ fontSize: '0.78rem', marginTop: 18 }}>
          Default: developer@gmail.com / developer$123
        </p>
      </form>
    </div>
  );
}
