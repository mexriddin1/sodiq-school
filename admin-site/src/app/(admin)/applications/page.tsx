'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader } from '@/components/PageHeader';

type App = {
  id: number; name: string; phone: string; message: string | null;
  age: string | null; grade: string | null; region: string | null; status: 'new'|'contacted'|'closed'; notes: string | null;
  source_form: string; created_at: string;
};

export default function ApplicationsPage() {
  const [items, setItems] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const url = filter === 'all' ? '/api/applications' : `/api/applications?status=${filter}`;
      const r = await api<{ items: App[] }>(url);
      setItems(r.items);
    } catch (err: any) { toast.push(err.message, 'danger'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  async function setStatus(id: number, status: App['status']) {
    try {
      await api(`/api/applications/${id}`, { method: 'PUT', body: { status } });
      toast.push('Yangilandi', 'success');
      load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  async function remove(id: number) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await api(`/api/applications/${id}`, { method: 'DELETE' });
      toast.push("O'chirildi", 'success');
      load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  return (
    <>
      <PageHeader title="Arizalar (form yuborilgan)" />
      <main className="content">
        <div className="card mb-18 flex gap-8">
          {(['all','new','contacted','closed'] as const).map((s) => (
            <button key={s} type="button"
              className={'btn btn-sm ' + (filter === s ? 'btn-primary' : 'btn-outline')}
              onClick={() => setFilter(s)}>
              {s}
            </button>
          ))}
        </div>

        {loading ? <div className="muted">Yuklanmoqda...</div>
          : items.length === 0 ? <div className="empty-state">Arizalar yo'q</div>
          : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th><th>Sana</th><th>Ism</th><th>Telefon</th><th>Yosh</th><th>Sinf</th><th>Viloyat</th><th>Habar</th>
                  <th>Manba</th><th>Status</th><th className="right">Amal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td className="id-cell">{a.id}</td>
                    <td>{a.created_at}</td>
                    <td><strong>{a.name}</strong></td>
                    <td><a href={`tel:${a.phone}`}>{a.phone}</a></td>
                    <td>{a.age || '-'}</td>
                    <td>{a.grade || '—'}</td>
                    <td>{a.region || '—'}</td>
                    <td style={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.message || '—'}</td>
                    <td><span className="pill pill-gray">{a.source_form}</span></td>
                    <td>
                      <span className={'pill ' + (a.status === 'new' ? 'pill-orange' : a.status === 'contacted' ? 'pill-green' : 'pill-gray')}>{a.status}</span>
                    </td>
                    <td className="right">
                      <div className="row-actions">
                        {a.status !== 'contacted' && <button className="btn btn-outline btn-sm" onClick={() => setStatus(a.id, 'contacted')}>Bog'landim</button>}
                        {a.status !== 'closed' && <button className="btn btn-outline btn-sm" onClick={() => setStatus(a.id, 'closed')}>Yopish</button>}
                        <button className="btn btn-danger btn-sm" onClick={() => remove(a.id)}>Del</button>
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
