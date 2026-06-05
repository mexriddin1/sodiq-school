'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader } from '@/components/PageHeader';

type Webhook = {
  id: number;
  name: string;
  url: string;
  method: string;
  event_types: string[];
  selected_fields: string[];
  is_active: boolean;
  is_archived: boolean;
  archived_at: string | null;
  last_success_at: string | null;
  last_error_at: string | null;
  last_error: string | null;
  created_at: string;
};

export default function WebhooksPage() {
  const [items, setItems] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'active' | 'archived'>('active');
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api<{ items: Webhook[] }>(
        view === 'archived' ? '/api/webhooks?archived=1' : '/api/webhooks',
      );
      setItems(r.items);
    } catch (err: any) {
      toast.push(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [view]);

  async function archive(id: number) {
    if (!confirm("Webhookni arxivlashni tasdiqlaysizmi? (Toʻxtatadi, lekin tarix saqlanadi)")) return;
    try {
      await api(`/api/webhooks/${id}/archive`, { method: 'POST' });
      toast.push('Arxivlandi', 'success');
      load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  async function restore(id: number) {
    try {
      await api(`/api/webhooks/${id}/restore`, { method: 'POST' });
      toast.push('Tiklandi', 'success');
      load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  async function remove(id: number) {
    if (!confirm("Butunlay oʻchirish? (Barcha tarix ham yoʻq qilinadi)")) return;
    try {
      await api(`/api/webhooks/${id}`, { method: 'DELETE' });
      toast.push("Oʻchirildi", 'success');
      load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  async function toggleActive(w: Webhook) {
    try {
      await api(`/api/webhooks/${w.id}`, { method: 'PUT', body: { is_active: !w.is_active } });
      load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  async function sendTest(id: number) {
    try {
      const r = await api<{ ok: boolean; status: number; error: string | null; durationMs: number }>(
        `/api/webhooks/${id}/test`,
        { method: 'POST' },
      );
      if (r.ok) {
        toast.push(`Test OK — ${r.status} (${r.durationMs}ms)`, 'success');
      } else {
        toast.push(`Test xato: ${r.error || r.status} (${r.durationMs}ms)`, 'danger');
      }
      load();
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  return (
    <>
      <PageHeader
        title="Webhooklar (lead forward)"
        description="Saytdan kelgan formalarni boshqa tizimlarga (CRM, Telegram, Make/Zapier) avtomatik yuborish."
        actions={<Link className="btn btn-primary" href="/webhooks/new">+ Yangi webhook</Link>}
      />
      <main className="content">
        <div className="card mb-18 flex gap-8">
          <button
            type="button"
            className={'btn btn-sm ' + (view === 'active' ? 'btn-primary' : 'btn-outline')}
            onClick={() => setView('active')}
          >
            Faol
          </button>
          <button
            type="button"
            className={'btn btn-sm ' + (view === 'archived' ? 'btn-primary' : 'btn-outline')}
            onClick={() => setView('archived')}
          >
            Arxiv
          </button>
        </div>

        {loading ? (
          <div className="muted">Yuklanmoqda...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            {view === 'archived' ? 'Arxivda webhook yoʻq' : 'Hech qanday webhook qoʻshilmagan'}
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom / URL</th>
                  <th>Method</th>
                  <th>Fieldlar</th>
                  <th>Status</th>
                  <th>Oxirgi holat</th>
                  <th className="right">Amal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((w) => (
                  <tr key={w.id}>
                    <td className="id-cell">{w.id}</td>
                    <td>
                      <div><strong>{w.name}</strong></div>
                      <div className="muted" style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{w.url}</div>
                    </td>
                    <td><span className="pill pill-gray">{w.method}</span></td>
                    <td style={{ maxWidth: 240 }}>
                      <div style={{ fontSize: '0.78rem' }}>
                        {(w.selected_fields || []).slice(0, 6).join(', ') || <em className="muted">barchasi</em>}
                        {w.selected_fields && w.selected_fields.length > 6 && ` +${w.selected_fields.length - 6}`}
                      </div>
                    </td>
                    <td>
                      {w.is_archived ? (
                        <span className="pill pill-gray">arxiv</span>
                      ) : w.is_active ? (
                        <span className="pill pill-green">faol</span>
                      ) : (
                        <span className="pill pill-orange">toʻxtatilgan</span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.78rem' }}>
                      {w.last_success_at && (
                        <div style={{ color: '#0a7a3a' }}>OK · {w.last_success_at}</div>
                      )}
                      {w.last_error_at && (
                        <div style={{ color: '#c0392b', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                             title={w.last_error || ''}>
                          ERR · {w.last_error_at}
                        </div>
                      )}
                      {!w.last_success_at && !w.last_error_at && <span className="muted">—</span>}
                    </td>
                    <td className="right">
                      <div className="row-actions">
                        {!w.is_archived && (
                          <>
                            <button className="btn btn-outline btn-sm" onClick={() => sendTest(w.id)}>Test</button>
                            <Link className="btn btn-outline btn-sm" href={`/webhooks/${w.id}/deliveries`}>Log</Link>
                            <Link className="btn btn-outline btn-sm" href={`/webhooks/${w.id}`}>Edit</Link>
                            <button className="btn btn-outline btn-sm" onClick={() => toggleActive(w)}>
                              {w.is_active ? 'Toʻxtatish' : 'Yoqish'}
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => archive(w.id)}>Arxivlash</button>
                          </>
                        )}
                        {w.is_archived && (
                          <>
                            <button className="btn btn-outline btn-sm" onClick={() => restore(w.id)}>Tiklash</button>
                            <button className="btn btn-danger btn-sm" onClick={() => remove(w.id)}>Del</button>
                          </>
                        )}
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
