'use client';
import { useRef, useState } from 'react';
import { api, resolveMediaUrl } from '@/lib/api';
import { useToast } from './ToastProvider';

export function ImageUploader({
  value, onChange, previewUrl,
}: {
  value: number | null;
  onChange: (mediaId: number | null, url?: string) => void;
  previewUrl?: string | null;
}) {
  const [busy, setBusy] = useState(false);
  const [localUrl, setLocalUrl] = useState<string | null>(previewUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  async function onFile(f: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      const r = await api<{ id: number; url: string }>('/api/upload', { method: 'POST', formData: fd });
      onChange(r.id, r.url);
      setLocalUrl(r.url);
      toast.push('Rasm yuklandi', 'success');
    } catch (err: any) {
      toast.push(err.message || 'Yuklash xatoligi', 'danger');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="image-uploader">
      <div
        className="preview"
        style={localUrl ? { backgroundImage: `url('${resolveMediaUrl(localUrl)}')` } : undefined}
      />
      <div className="image-uploader-actions">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
            e.target.value = '';
          }}
        />
        <div className="flex gap-8">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? 'Yuklanmoqda...' : 'Rasm tanlash'}
          </button>
          {value && (
            <button type="button" className="btn btn-danger btn-sm" onClick={() => { onChange(null); setLocalUrl(null); }}>
              O'chirish
            </button>
          )}
        </div>
        <div className="name muted">{value ? `media #${value}` : 'Rasm tanlanmagan'}</div>
      </div>
    </div>
  );
}
