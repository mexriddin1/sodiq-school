'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { PageHeader } from '@/components/PageHeader';

type App = {
  id: number;
  name: string;
  phone: string;
  message: string | null;
  age: string | null;
  grade: string | null;
  region: string | null;
  status: 'new' | 'contacted' | 'closed';
  notes: string | null;
  source_form: string;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  referrer: string | null;
};

function shortDate(value: string) {
  return String(value || '').replace('T', ' ').slice(0, 16);
}

function clean(value: string | null | undefined) {
  return value && value.trim() ? value : '-';
}

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
    } catch (err: any) {
      toast.push(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  async function setStatus(id: number, status: App['status']) {
    try {
      await api(`/api/applications/${id}`, { method: 'PUT', body: { status } });
      toast.push('Yangilandi', 'success');
      load();
    } catch (err: any) {
      toast.push(err.message, 'danger');
    }
  }

  async function remove(id: number) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    try {
      await api(`/api/applications/${id}`, { method: 'DELETE' });
      toast.push("O'chirildi", 'success');
      load();
    } catch (err: any) {
      toast.push(err.message, 'danger');
    }
  }

  return (
    <>
      <PageHeader title="Arizalar (form yuborilgan)" />
      <main className="content applications-content">
        <div className="card mb-18 flex gap-8">
          {(['all', 'new', 'contacted', 'closed'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={'btn btn-sm ' + (filter === s ? 'btn-primary' : 'btn-outline')}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="muted">Yuklanmoqda...</div>
        ) : items.length === 0 ? (
          <div className="empty-state">Arizalar yo'q</div>
        ) : (
          <div className="table-wrap applications-table">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Sana</th>
                  <th>Kontakt</th>
                  <th>Bola</th>
                  <th>UTM / Manba</th>
                  <th>Xabar</th>
                  <th>Status</th>
                  <th className="right">Amal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td className="id-cell">{a.id}</td>
                    <td className="nowrap">{shortDate(a.created_at)}</td>
                    <td>
                      <strong className="lead-name">{a.name}</strong>
                      <a className="lead-phone" href={`tel:${a.phone}`}>{a.phone}</a>
                    </td>
                    <td>
                      <div className="lead-stack">
                        <span>{clean(a.age)}</span>
                        <span>{clean(a.grade)}</span>
                        <span>{clean(a.region)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="utm-cell" title={a.landing_page || ''}>
                        <span className="pill pill-gray">{clean(a.source_form)}</span>
                        <span><b>src:</b> {clean(a.utm_source)}</span>
                        <span><b>med:</b> {clean(a.utm_medium)}</span>
                        <span><b>camp:</b> {clean(a.utm_campaign)}</span>
                      </div>
                    </td>
                    <td className="message-cell" title={a.message || ''}>{a.message || '-'}</td>
                    <td>
                      <span className={'pill ' + (a.status === 'new' ? 'pill-orange' : a.status === 'contacted' ? 'pill-green' : 'pill-gray')}>
                        {a.status}
                      </span>
                    </td>
                    <td className="right">
                      <div className="row-actions">
                        {a.status !== 'contacted' && (
                          <button className="btn btn-outline btn-sm" onClick={() => setStatus(a.id, 'contacted')}>Bog'landim</button>
                        )}
                        {a.status !== 'closed' && (
                          <button className="btn btn-outline btn-sm" onClick={() => setStatus(a.id, 'closed')}>Yopish</button>
                        )}
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
