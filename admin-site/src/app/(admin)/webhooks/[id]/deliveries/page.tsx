'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader, BackLink } from '@/components/PageHeader';

type Delivery = {
  id: number;
  event_type: string;
  target_url: string;
  response_status: number | null;
  error: string | null;
  attempts: number;
  duration_ms: number | null;
  success: number;
  created_at: string;
};

type DeliveryFull = Delivery & {
  request_body: string | null;
  response_body: string | null;
};

export default function WebhookDeliveriesPage() {
  const params = useParams<{ id: string }>();
  const toast = useToast();
  const [items, setItems] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<DeliveryFull | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await api<{ items: Delivery[] }>(`/api/webhooks/${params.id}/deliveries`);
      setItems(r.items);
    } catch (err: any) { toast.push(err.message, 'danger'); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [params.id]);

  async function viewOne(id: number) {
    try {
      const r = await api<DeliveryFull>(`/api/webhooks/${params.id}/deliveries/${id}`);
      setOpen(r);
    } catch (err: any) { toast.push(err.message, 'danger'); }
  }

  return (
    <>
      <PageHeader
        title={`Webhook #${params.id} — yuborilganlar tarixi`}
        actions={<BackLink href="/webhooks" label="Webhooklar" />}
      />
      <main className="content">
        {loading ? (
          <div className="muted">Yuklanmoqda...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">Hali yuborilgan soʻrov yoʻq</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Sana</th>
                  <th>Hodisa</th>
                  <th>Status</th>
                  <th>Urinishlar</th>
                  <th>Davomiyligi</th>
                  <th>Xato</th>
                  <th className="right">Amal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.id}>
                    <td>{d.created_at}</td>
                    <td><code>{d.event_type}</code></td>
                    <td>
                      {d.success ? (
                        <span className="pill pill-green">{d.response_status || 'OK'}</span>
                      ) : (
                        <span className="pill pill-orange">{d.response_status || 'ERR'}</span>
                      )}
                    </td>
                    <td>{d.attempts}</td>
                    <td>{d.duration_ms ?? '—'} ms</td>
                    <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={d.error || ''}>
                      {d.error || '—'}
                    </td>
                    <td className="right">
                      <button className="btn btn-outline btn-sm" onClick={() => viewOne(d.id)}>Ko'rish</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {open && (
          <div
            onClick={() => setOpen(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: 8, maxWidth: 900, width: '100%',
                maxHeight: '90vh', overflow: 'auto', padding: 20,
              }}
            >
              <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Delivery #{open.id}</h3>
                <button className="btn btn-outline btn-sm" onClick={() => setOpen(null)}>Yopish</button>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div><strong>URL:</strong> <code>{open.target_url}</code></div>
                <div><strong>Hodisa:</strong> <code>{open.event_type}</code></div>
                <div><strong>Status:</strong> {open.response_status || '—'} | <strong>Urinishlar:</strong> {open.attempts} | <strong>Davomiyligi:</strong> {open.duration_ms} ms</div>
                {open.error && <div style={{ color: '#c0392b' }}><strong>Xato:</strong> {open.error}</div>}
              </div>
              <div>
                <h4>Request body</h4>
                <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, overflow: 'auto', maxHeight: 240 }}>
                  {open.request_body || '—'}
                </pre>
              </div>
              <div>
                <h4>Response body</h4>
                <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, overflow: 'auto', maxHeight: 240 }}>
                  {open.response_body || '—'}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
