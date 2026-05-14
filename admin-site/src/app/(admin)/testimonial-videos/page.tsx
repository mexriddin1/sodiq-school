'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, resolveMediaUrl } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader } from '@/components/PageHeader';

type V = { id: number; url: string; thumbnail_id: number | null; sort_order: number; thumbnail_url: string | null };

export default function VideosPage() {
  const [items, setItems] = useState<V[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api<{ items: V[] }>('/api/testimonial-videos');
      setItems(r.items);
    } catch (err: any) { toast.push(err.message, 'danger'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function remove(id: number) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await api(`/api/testimonial-videos/${id}`, { method: 'DELETE' });
      toast.push("O'chirildi", 'success'); load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  return (
    <>
      <PageHeader title="Ota-onalar videolari" actions={<Link className="btn btn-primary" href="/testimonial-videos/new">+ Yangi video</Link>} />
      <main className="content">
        {loading ? <div className="muted">Yuklanmoqda...</div>
          : items.length === 0 ? <div className="empty-state">Videolar yo'q</div>
          : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th style={{ width: 70 }}>Thumbnail</th><th>URL</th><th>Tartib</th><th className="right">Amal</th></tr></thead>
              <tbody>
                {items.map((v) => (
                  <tr key={v.id}>
                    <td><div className="thumb" style={v.thumbnail_url ? { backgroundImage: `url('${resolveMediaUrl(v.thumbnail_url)}')` } : undefined} /></td>
                    <td><a href={v.url} target="_blank" rel="noopener noreferrer">{v.url}</a></td>
                    <td>{v.sort_order}</td>
                    <td className="right">
                      <div className="row-actions">
                        <Link className="btn btn-outline btn-sm" href={`/testimonial-videos/${v.id}`}>Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(v.id)}>Del</button>
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
