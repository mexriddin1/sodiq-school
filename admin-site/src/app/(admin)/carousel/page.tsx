'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, resolveMediaUrl } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader } from '@/components/PageHeader';

type C = { id: number; image_id: number | null; sort_order: number; image_url: string | null };

export default function CarouselPage() {
  const [items, setItems] = useState<C[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api<{ items: C[] }>('/api/carousel');
      setItems(r.items);
    } catch (err: any) { toast.push(err.message, 'danger'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function remove(id: number) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await api(`/api/carousel/${id}`, { method: 'DELETE' });
      toast.push("O'chirildi", 'success'); load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  return (
    <>
      <PageHeader title="Rasm karuseli" actions={<Link className="btn btn-primary" href="/carousel/new">+ Yangi rasm</Link>} />
      <main className="content">
        {loading ? <div className="muted">Yuklanmoqda...</div>
          : items.length === 0 ? <div className="empty-state">Rasmlar yo'q</div>
          : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th style={{ width: 90 }}>Rasm</th><th>ID</th><th>Tartib</th><th className="right">Amal</th></tr></thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id}>
                    <td><div className="thumb" style={c.image_url ? { backgroundImage: `url('${resolveMediaUrl(c.image_url)}')` } : undefined} /></td>
                    <td>#{c.id}</td>
                    <td>{c.sort_order}</td>
                    <td className="right">
                      <div className="row-actions">
                        <Link className="btn btn-outline btn-sm" href={`/carousel/${c.id}`}>Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>Del</button>
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
