'use client';
import { ImageUploader } from '../ImageUploader';
import type { FieldDef } from './types';

export function FieldRenderer({
  field, value, onChange, previewUrl,
}: {
  field: FieldDef;
  value: any;
  onChange: (v: any) => void;
  previewUrl?: string | null;
}) {
  const v = value ?? '';

  if (field.type === 'image') {
    return (
      <ImageUploader
        value={typeof v === 'number' ? v : null}
        onChange={(id) => onChange(id)}
        previewUrl={previewUrl ?? null}
      />
    );
  }

  if (field.type === 'textarea' || field.type === 'richtext') {
    return (
      <textarea
        className="textarea"
        rows={field.rows || (field.type === 'richtext' ? 8 : 4)}
        value={v}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <select className="select" value={v} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>
        {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
  }

  if (field.type === 'checkbox') {
    const checked = v === true || v === 1 || v === '1';
    return (
      <label className="checkbox-row">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span>{field.help || 'Yoqilgan'}</span>
      </label>
    );
  }

  if (field.type === 'number') {
    return (
      <input className="input" type="number" value={v ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />
    );
  }

  if (field.type === 'tags') {
    const arr = Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : []);
    return (
      <input
        className="input"
        value={arr.join(', ')}
        placeholder="Comma separated, e.g. Math, English, History"
        onChange={(e) => onChange(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
      />
    );
  }

  if (field.type === 'facts') {
    const arr: Array<{ label: string; value: string }> = Array.isArray(v) ? v : [];
    return (
      <div className="flex" style={{ flexDirection: 'column', gap: 8 }}>
        {arr.map((it, i) => (
          <div key={i} className="field-row">
            <input className="input" placeholder="Label" value={it.label} onChange={(e) => {
              const next = [...arr]; next[i] = { ...next[i], label: e.target.value }; onChange(next);
            }} />
            <div className="flex gap-8">
              <input className="input" style={{ flex: 1 }} placeholder="Value" value={it.value} onChange={(e) => {
                const next = [...arr]; next[i] = { ...next[i], value: e.target.value }; onChange(next);
              }} />
              <button type="button" className="btn btn-danger btn-sm" onClick={() => onChange(arr.filter((_, j) => j !== i))}>×</button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange([...(arr || []), { label: '', value: '' }])}>+ Qator qo'shish</button>
      </div>
    );
  }

  if (field.type === 'json') {
    const text = typeof v === 'string' ? v : JSON.stringify(v ?? null, null, 2);
    return (
      <textarea
        className="textarea"
        rows={6}
        value={text}
        onChange={(e) => {
          try { onChange(JSON.parse(e.target.value)); }
          catch { onChange(e.target.value); }
        }}
      />
    );
  }

  return (
    <input className="input" type="text" value={v} onChange={(e) => onChange(e.target.value)} />
  );
}
