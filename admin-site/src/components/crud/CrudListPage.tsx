'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, resolveMediaUrl } from '@/lib/api';
import { useToast } from '../ToastProvider';
import type { EntityConfig } from './types';
import { PageHeader } from '../PageHeader';

export function CrudListPage({ cfg }: { cfg: EntityConfig }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api<{ items: any[] }>(`${cfg.endpoint}?lang=uz`);
      const filtered = cfg.listFilter
        ? r.items.filter((it) => String(it[cfg.listFilter!.field]) === String(cfg.listFilter!.value))
        : r.items;
      setItems(filtered);
    } catch (err: any) {
      toast.push(err.message || 'Yuklash xatoligi', 'danger');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function remove(id: number) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await api(`${cfg.endpoint}/${id}`, { method: 'DELETE' });
      toast.push("O'chirildi", 'success');
      load();
    } catch (err: any) {
      toast.push(err.message || 'Xatolik', 'danger');
    }
  }

  return (
    <>
      <PageHeader
        title={cfg.title}
        actions={<Link className="btn btn-primary" href={`${cfg.basePath}/new`}>+ Yangi {cfg.singular}</Link>}
      />
      <main className="content">
        {loading ? (
          <div className="muted">Yuklanmoqda...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            Hali hech narsa qo'shilmagan.
            <div style={{ marginTop: 14 }}>
              <Link className="btn btn-primary" href={`${cfg.basePath}/new`}>+ Birinchi {cfg.singular}</Link>
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  {cfg.hasImage && <th style={{ width: 70 }}>Rasm</th>}
                  {cfg.listColumns.map((c) => <th key={c.key}>{c.label}</th>)}
                  <th className="right">Amal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    {cfg.hasImage && (
                      <td>
                        <div className="thumb" style={row.image_url ? { backgroundImage: `url('${resolveMediaUrl(row.image_url)}')` } : undefined} />
                      </td>
                    )}
                    {cfg.listColumns.map((c) => (
                      <td key={c.key}>{c.render ? c.render(row) : (row[c.key] ?? '—')}</td>
                    ))}
                    <td className="right">
                      <div className="row-actions">
                        <Link className="btn btn-outline btn-sm" href={`${cfg.basePath}/${row.id}`}>Edit</Link>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(row.id)}>Del</button>
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
