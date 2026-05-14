'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader, BackLink } from '@/components/PageHeader';

export default function NewUserPage() {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'admin' as 'superadmin'|'admin'|'editor' });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api('/api/users', { method: 'POST', body: form });
      toast.push('Yaratildi', 'success');
      router.replace('/users');
    } catch (err: any) {
      toast.push(err.message, 'danger');
    } finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="Yangi admin" actions={<BackLink href="/users" label="Foydalanuvchilar" />} />
      <main className="content">
        <form onSubmit={onSubmit}>
          <div className="card">
            <div className="field">
              <span className="field-label">Email</span>
              <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <span className="field-label">Ism</span>
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <span className="field-label">Parol (kamida 6 belgi)</span>
              <input className="input" type="password" minLength={6} required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="field">
              <span className="field-label">Rol</span>
              <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>
          <div className="card flex gap-12" style={{ justifyContent: 'flex-end' }}>
            <BackLink href="/users" label="Bekor qilish" />
            <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '...' : 'Yaratish'}</button>
          </div>
        </form>
      </main>
    </>
  );
}
