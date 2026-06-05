'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';

export type WebhookDto = {
  id?: number;
  name: string;
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  secret: string | null;
  event_types: string[];
  selected_fields: string[];
  custom_headers: Record<string, string>;
  payload_template: string;
  include_metadata: boolean;
  retry_count: number;
  timeout_ms: number;
  is_active: boolean;
};

type Meta = {
  fields: { key: string; label: string }[];
  events: { key: string; label: string }[];
};

type HeaderEntry = { key: string; value: string };

const EMPTY: WebhookDto = {
  name: '',
  url: '',
  method: 'POST',
  secret: '',
  event_types: ['application.created'],
  selected_fields: ['name', 'phone', 'grade', 'region', 'message', 'source_form'],
  custom_headers: {},
  payload_template: '',
  include_metadata: true,
  retry_count: 3,
  timeout_ms: 10000,
  is_active: true,
};

export function WebhookForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: Partial<WebhookDto>;
  onSubmit: (data: WebhookDto) => Promise<void>;
  submitLabel: string;
}) {
  const toast = useToast();
  const [meta, setMeta] = useState<Meta>({ fields: [], events: [] });
  const [form, setForm] = useState<WebhookDto>({ ...EMPTY, ...initial });
  const [headers, setHeaders] = useState<HeaderEntry[]>(
    Object.entries(initial?.custom_headers || {}).map(([key, value]) => ({ key, value })),
  );
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<Meta>('/api/webhooks/meta')
      .then((m) => setMeta(m))
      .catch((err) => toast.push(err.message, 'danger'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleField(key: string) {
    setForm((f) => ({
      ...f,
      selected_fields: f.selected_fields.includes(key)
        ? f.selected_fields.filter((k) => k !== key)
        : [...f.selected_fields, key],
    }));
  }

  function toggleEvent(key: string) {
    setForm((f) => ({
      ...f,
      event_types: f.event_types.includes(key)
        ? f.event_types.filter((k) => k !== key)
        : [...f.event_types, key],
    }));
  }

  function updateHeader(idx: number, patch: Partial<HeaderEntry>) {
    setHeaders((arr) => arr.map((h, i) => (i === idx ? { ...h, ...patch } : h)));
  }

  function removeHeader(idx: number) {
    setHeaders((arr) => arr.filter((_, i) => i !== idx));
  }

  function addHeader() {
    setHeaders((arr) => [...arr, { key: '', value: '' }]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.url.trim()) {
      toast.push("Nom va URL majburiy", 'danger');
      return;
    }
    const customHeaders: Record<string, string> = {};
    for (const h of headers) {
      if (h.key.trim()) customHeaders[h.key.trim()] = h.value;
    }
    setBusy(true);
    try {
      await onSubmit({ ...form, custom_headers: customHeaders, secret: form.secret || null });
    } catch (err: any) {
      toast.push(err.message || 'Xato', 'danger');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Asosiy</h3>
        <div className="field">
          <span className="field-label">Nom *</span>
          <input
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="CRM webhook"
            required
          />
        </div>
        <div className="field">
          <span className="field-label">URL *</span>
          <input
            className="input"
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://example.com/leads"
            required
          />
        </div>
        <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
          <div className="field" style={{ flex: '1 1 160px' }}>
            <span className="field-label">Method</span>
            <select
              className="select"
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value as any })}
            >
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <div className="field" style={{ flex: '1 1 160px' }}>
            <span className="field-label">Retry urinishlar (1-10)</span>
            <input
              className="input"
              type="number"
              min={1}
              max={10}
              value={form.retry_count}
              onChange={(e) => setForm({ ...form, retry_count: parseInt(e.target.value || '3', 10) })}
            />
          </div>
          <div className="field" style={{ flex: '1 1 160px' }}>
            <span className="field-label">Timeout (ms)</span>
            <input
              className="input"
              type="number"
              min={1000}
              max={60000}
              step={500}
              value={form.timeout_ms}
              onChange={(e) => setForm({ ...form, timeout_ms: parseInt(e.target.value || '10000', 10) })}
            />
          </div>
        </div>
        <div className="field">
          <span className="field-label">Secret (HMAC SHA256 imzo uchun)</span>
          <input
            className="input"
            value={form.secret || ''}
            onChange={(e) => setForm({ ...form, secret: e.target.value })}
            placeholder="(ixtiyoriy) — agar berilsa X-Webhook-Signature header qoʻshiladi"
          />
        </div>
        <label className="flex gap-8" style={{ alignItems: 'center', marginTop: 8 }}>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          <span>Faol</span>
        </label>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Hodisalar</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Qaysi hodisalarda yuborilsin. Boʻsh qoldirilsa — barcha hodisalar.
        </p>
        {meta.events.length === 0 ? (
          <div className="muted">Yuklanmoqda...</div>
        ) : (
          <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
            {meta.events.map((ev) => (
              <label key={ev.key} className="flex gap-8" style={{ alignItems: 'center', border: '1px solid var(--border)', padding: '6px 10px', borderRadius: 6 }}>
                <input
                  type="checkbox"
                  checked={form.event_types.includes(ev.key)}
                  onChange={() => toggleEvent(ev.key)}
                />
                <span>{ev.label}</span>
                <code style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{ev.key}</code>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Yuboriladigan fieldlar</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Faqat belgilangan fieldlar webhookga jo'natiladi.
        </p>
        {meta.fields.length === 0 ? (
          <div className="muted">Yuklanmoqda...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {meta.fields.map((f) => (
              <label key={f.key} className="flex gap-8" style={{ alignItems: 'center', border: '1px solid var(--border)', padding: '6px 10px', borderRadius: 6 }}>
                <input
                  type="checkbox"
                  checked={form.selected_fields.includes(f.key)}
                  onChange={() => toggleField(f.key)}
                />
                <span>{f.label}</span>
                <code style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginLeft: 'auto' }}>{f.key}</code>
              </label>
            ))}
          </div>
        )}
        <label className="flex gap-8" style={{ alignItems: 'center', marginTop: 14 }}>
          <input
            type="checkbox"
            checked={form.include_metadata}
            onChange={(e) => setForm({ ...form, include_metadata: e.target.checked })}
          />
          <span>Qo'shimcha metadata qo'shilsin (source_form, lead_id)</span>
        </label>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Custom Headers</h3>
        {headers.length === 0 && <div className="muted">Hech qanday header qoʻshilmagan</div>}
        {headers.map((h, i) => (
          <div key={i} className="flex gap-8" style={{ marginBottom: 6 }}>
            <input
              className="input"
              placeholder="Header nomi (masalan: Authorization)"
              value={h.key}
              onChange={(e) => updateHeader(i, { key: e.target.value })}
              style={{ flex: '1 1 220px' }}
            />
            <input
              className="input"
              placeholder="Qiymat"
              value={h.value}
              onChange={(e) => updateHeader(i, { value: e.target.value })}
              style={{ flex: '2 1 300px' }}
            />
            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeHeader(i)}>
              ×
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={addHeader} style={{ marginTop: 8 }}>
          + Header qoʻshish
        </button>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Payload template (ixtiyoriy)</h3>
        <p className="muted" style={{ marginTop: 0 }}>
          Boʻsh qoldirilsa standart JSON yuboriladi:
          <br />
          <code>{`{ event, timestamp, site, data: { ...selected_fields } }`}</code>
          <br />
          Yoki shu yerda oʻzingiz template yozing va <code>{`{{field_nomi}}`}</code> orqali qiymatlarni
          joylang. Masalan: <code>{`{{name}}`}</code>, <code>{`{{phone}}`}</code>, <code>{`{{data.message}}`}</code>
        </p>
        <textarea
          className="input"
          rows={8}
          style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
          value={form.payload_template}
          onChange={(e) => setForm({ ...form, payload_template: e.target.value })}
          placeholder={`{\n  "client_name": "{{name}}",\n  "client_phone": "{{phone}}",\n  "note": "{{message}}"\n}`}
        />
      </div>

      <div className="card flex gap-12" style={{ justifyContent: 'flex-end' }}>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? '...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
