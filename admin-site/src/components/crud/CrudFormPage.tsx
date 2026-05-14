'use client';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useToast } from '../ToastProvider';
import { LocaleTabs, useLocaleTabs, LOCALES } from '../LocaleTabs';
import { FieldRenderer } from './FieldRenderer';
import { PageHeader, BackLink } from '../PageHeader';
import type { EntityConfig } from './types';

export function CrudFormPage({ cfg, id }: { cfg: EntityConfig; id?: string }) {
  const router = useRouter();
  const toast = useToast();
  const { locale, setLocale } = useLocaleTabs();
  const [parent, setParent] = useState<Record<string, any>>({});
  const [translations, setTranslations] = useState<Record<string, Record<string, any>>>({});
  const [loading, setLoading] = useState(!!id);
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isEdit = !!id;

  useEffect(() => {
    if (!id) {
      // initialise empty translations for all locales
      const t: Record<string, Record<string, any>> = {};
      for (const l of LOCALES) {
        t[l] = {};
        for (const f of cfg.translationFields) t[l][f.name] = '';
      }
      setTranslations(t);
      // initialize parent defaults
      const p: Record<string, any> = {};
      for (const f of cfg.parentFields) {
        if (f.type === 'checkbox') p[f.name] = true;
        else if (f.type === 'number') p[f.name] = 0;
        else p[f.name] = null;
      }
      // Apply per-config defaults (e.g. page='results' for the Results stats screen)
      if (cfg.defaults) Object.assign(p, cfg.defaults);
      setParent(p);
      return;
    }
    setLoading(true);
    api<any>(`${cfg.endpoint}/${id}/admin`)
      .then((data) => {
        const p: Record<string, any> = {};
        for (const f of cfg.parentFields) {
          let v = data[f.name];
          if (f.type === 'checkbox') v = v === 1 || v === true;
          p[f.name] = v;
        }
        setParent(p);
        const t: Record<string, Record<string, any>> = {};
        for (const l of LOCALES) {
          t[l] = {};
          const tr = data.translations?.[l] || {};
          for (const f of cfg.translationFields) {
            let v = tr[f.name];
            if (f.type === 'tags' || f.type === 'facts' || f.type === 'json') {
              if (typeof v === 'string') {
                try { v = JSON.parse(v); } catch {}
              }
            }
            t[l][f.name] = v ?? (f.type === 'tags' ? [] : f.type === 'facts' ? [] : '');
          }
        }
        setTranslations(t);
        if (data.image_url) setPreviewUrl(data.image_url);
      })
      .catch((err) => toast.push(err.message || 'Yuklash xatosi', 'danger'))
      .finally(() => setLoading(false));
  // eslint-disable-next-line
  }, [id]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      // Serialize parent
      const parentOut: Record<string, any> = {};
      for (const f of cfg.parentFields) {
        let v = parent[f.name];
        if (f.type === 'checkbox') v = v ? 1 : 0;
        if (f.type === 'number' && v === '') v = null;
        parentOut[f.name] = v;
      }
      // Serialize translations: stringify tags/facts/json fields
      const trOut: Record<string, any> = {};
      for (const l of LOCALES) {
        trOut[l] = {};
        for (const f of cfg.translationFields) {
          let v = translations[l]?.[f.name];
          if (f.type === 'tags' || f.type === 'facts') {
            trOut[l][f.name] = JSON.stringify(Array.isArray(v) ? v : []);
          } else if (f.type === 'json') {
            trOut[l][f.name] = typeof v === 'string' ? v : JSON.stringify(v ?? null);
          } else {
            trOut[l][f.name] = v ?? null;
          }
        }
      }
      const payload = { ...parentOut, translations: trOut };
      if (isEdit) {
        await api(`${cfg.endpoint}/${id}`, { method: 'PUT', body: payload });
        toast.push('Saqlandi', 'success');
      } else {
        const r = await api<{ id: number }>(cfg.endpoint, { method: 'POST', body: payload });
        toast.push('Yaratildi', 'success');
        router.replace(`${cfg.basePath}/${r.id}`);
      }
    } catch (err: any) {
      toast.push(err.message || 'Xatolik', 'danger');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title={isEdit ? `${cfg.singular} #${id}` : `Yangi ${cfg.singular}`}
        actions={<BackLink href={cfg.basePath} label={cfg.title} />}
      />
      <main className="content">
        {loading ? (
          <div className="muted">Yuklanmoqda...</div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="card">
              <h3 style={{ marginBottom: 14 }}>Asosiy maydonlar</h3>
              {cfg.parentFields.map((f) => (
                <div key={f.name} className="field">
                  <span className="field-label">{f.label}</span>
                  <FieldRenderer
                    field={f}
                    value={parent[f.name]}
                    onChange={(v) => setParent({ ...parent, [f.name]: v })}
                    previewUrl={f.type === 'image' ? previewUrl : undefined}
                  />
                  {f.help && f.type !== 'checkbox' && <div className="muted" style={{ fontSize: '0.78rem', marginTop: 4 }}>{f.help}</div>}
                </div>
              ))}
            </div>

            {cfg.translationFields.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: 14 }}>Tilga oid maydonlar</h3>
                <LocaleTabs current={locale} onChange={setLocale} />
                {cfg.translationFields.map((f) => (
                  <div key={f.name} className="field">
                    <span className="field-label">{f.label} <span className="muted">({locale})</span></span>
                    <FieldRenderer
                      field={f}
                      value={translations[locale]?.[f.name]}
                      onChange={(v) => setTranslations({ ...translations, [locale]: { ...translations[locale], [f.name]: v } })}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="card flex gap-12" style={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <BackLink href={cfg.basePath} label="Bekor qilish" />
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Saqlanmoqda...' : isEdit ? 'Saqlash' : 'Yaratish'}
              </button>
            </div>
          </form>
        )}
      </main>
    </>
  );
}
