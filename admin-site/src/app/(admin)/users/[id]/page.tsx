'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader, BackLink } from '@/components/PageHeader';

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState({ email: '', name: '', password: '', role: 'admin' as 'superadmin'|'admin'|'editor', is_active: true });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ items: any[] }>('/api/users')
      .then((r) => {
        const u = r.items.find((x) => String(x.id) === String(id));
        if (u) setForm({ email: u.email, name: u.name, password: '', role: u.role, is_active: !!u.is_active });
      })
      .catch((err) => toast.push(err.message, 'danger'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload: any = {
        name: form.name,
        role: form.role,
        is_active: form.is_active,
      };
      if (form.password) payload.password = form.password;
      await api(`/api/users/${id}`, { method: 'PUT', body: payload });
      toast.push('Saqlandi', 'success');
      router.replace('/users');
    } catch (err: any) {
      toast.push(err.message, 'danger');
    } finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title={`Foydalanuvchi #${id}`} actions={<BackLink href="/users" label="Foydalanuvchilar" />} />
      <main className="content">
        {loading ? <div className="muted">Yuklanmoqda...</div> : (
          <form onSubmit={onSubmit}>
            <div className="card">
              <div className="field">
                <span className="field-label">Email</span>
                <input className="input" type="email" disabled value={form.email} />
                <div className="muted" style={{ fontSize: '0.78rem', marginTop: 4 }}>Emailni o'zgartirib bo'lmaydi</div>
              </div>
              <div className="field">
                <span className="field-label">Ism</span>
                <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <span className="field-label">Yangi parol (bo'sh qoldirsangiz o'zgarmaydi)</span>
                <input className="input" type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="field">
                <span className="field-label">Rol</span>
                <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })}>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <label className="checkbox-row">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <span>Faol</span>
              </label>
            </div>
            <div className="card flex gap-12" style={{ justifyContent: 'flex-end' }}>
              <BackLink href="/users" label="Bekor qilish" />
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '...' : 'Saqlash'}</button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
