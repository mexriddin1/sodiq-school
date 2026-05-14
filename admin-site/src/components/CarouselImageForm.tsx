'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from './ToastProvider';
import { ImageUploader } from './ImageUploader';
import { PageHeader, BackLink } from './PageHeader';

export function CarouselImageForm({ id }: { id?: string }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<{
    image_id: number | null; sort_order: number; is_published: boolean;
  }>({ image_id: null, sort_order: 0, is_published: true });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    api<any>(`/api/carousel/${id}`)
      .then((d) => {
        setForm({
          image_id: d.image_id,
          sort_order: d.sort_order,
          is_published: !!d.is_published,
        });
      })
      .catch((err) => toast.push(err.message, 'danger'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        image_id: form.image_id,
        sort_order: form.sort_order,
        is_published: form.is_published,
      };
      if (id) {
        await api(`/api/carousel/${id}`, { method: 'PUT', body: payload });
        toast.push('Saqlandi', 'success');
      } else {
        await api('/api/carousel', { method: 'POST', body: payload });
        toast.push('Yaratildi', 'success');
      }
      router.replace('/carousel');
    } catch (err: any) {
      toast.push(err.message, 'danger');
    } finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title={id ? `Karusel rasmi #${id}` : 'Yangi karusel rasmi'} actions={<BackLink href="/carousel" label="Karusel" />} />
      <main className="content">
        {loading ? <div className="muted">Yuklanmoqda...</div> : (
          <form onSubmit={onSubmit}>
            <div className="card">
              <div className="field">
                <span className="field-label">Rasm</span>
                <ImageUploader
                  value={form.image_id}
                  onChange={(mediaId, url) => { setForm({ ...form, image_id: mediaId }); if (url) setPreviewUrl(url); }}
                  previewUrl={previewUrl}
                />
              </div>
              <div className="field">
                <span className="field-label">Tartib raqami</span>
                <input className="input" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
              </div>
              <label className="checkbox-row">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                <span>Chop etilgan</span>
              </label>
            </div>
            <div className="card flex gap-12" style={{ justifyContent: 'flex-end' }}>
              <BackLink href="/carousel" label="Bekor qilish" />
              <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? '...' : 'Saqlash'}</button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
