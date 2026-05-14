'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader } from '@/components/PageHeader';

type U = {
  id: number; email: string; name: string; role: 'superadmin'|'admin'|'editor';
  is_active: number; created_at: string;
};

export default function UsersPage() {
  const [items, setItems] = useState<U[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api<{ items: U[] }>('/api/users');
      setItems(r.items);
    } catch (err: any) { toast.push(err.message, 'danger'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function remove(id: number) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await api(`/api/users/${id}`, { method: 'DELETE' });
      toast.push("O'chirildi", 'success'); load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  async function toggleActive(u: U) {
    try {
      await api(`/api/users/${u.id}`, { method: 'PUT', body: { is_active: !u.is_active } });
      load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  return (
    <>
      <PageHeader title="Admin foydalanuvchilar" actions={<Link className="btn btn-primary" href="/users/new">+ Yangi admin</Link>} />
      <main className="content">
        {loading ? <div className="muted">Yuklanmoqda...</div>
          : items.length === 0 ? <div className="empty-state">Foydalanuvchilar yo'q</div>
          : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>#</th><th>Email</th><th>Ism</th><th>Rol</th><th>Status</th><th>Ro'yxatdan o'tgan</th><th className="right">Amal</th></tr></thead>
                <tbody>
                  {items.map((u) => (
                    <tr key={u.id}>
                      <td className="id-cell">{u.id}</td>
                      <td>{u.email}</td>
                      <td>{u.name}</td>
                      <td><span className="pill pill-orange">{u.role}</span></td>
                      <td>{u.is_active
                        ? <span className="pill pill-green">faol</span>
                        : <span className="pill pill-gray">o'chirilgan</span>}</td>
                      <td>{u.created_at}</td>
                      <td className="right">
                        <div className="row-actions">
                          <Link className="btn btn-outline btn-sm" href={`/users/${u.id}`}>Edit</Link>
                          <button className="btn btn-outline btn-sm" onClick={() => toggleActive(u)}>{u.is_active ? 'O\'chirish' : 'Faollashtirish'}</button>
                          <button className="btn btn-danger btn-sm" onClick={() => remove(u.id)}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </main>
    </>
  );
}
