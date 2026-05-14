'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { LocaleTabs, useLocaleTabs, LOCALES } from '@/components/LocaleTabs';
import { PageHeader } from '@/components/PageHeader';

type SettingRow = {
  key: string; group: string; description: string | null;
  value_uz: string | null; value_ru: string | null; value_en: string | null;
  value_raw: string | null;
};

export default function SettingsPage() {
  const [rows, setRows] = useState<SettingRow[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>('hero');
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const { locale, setLocale } = useLocaleTabs();
  const toast = useToast();

  async function load() {
    setLoading(true);
    try {
      const r = await api<{ items: SettingRow[] }>('/api/settings/all');
      setRows(r.items);
      const g = Array.from(new Set(r.items.map((s) => s.group)));
      setGroups(g);
      if (!g.includes(activeGroup) && g.length) setActiveGroup(g[0]);
    } catch (err: any) {
      toast.push(err.message, 'danger');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function save(row: SettingRow) {
    setBusyKey(row.key);
    try {
      await api(`/api/settings/${encodeURIComponent(row.key)}`, {
        method: 'PUT',
        body: {
          value_uz: row.value_uz,
          value_ru: row.value_ru,
          value_en: row.value_en,
          value_raw: row.value_raw,
        },
      });
      toast.push('Saqlandi', 'success');
    } catch (err: any) {
      toast.push(err.message || 'Xatolik', 'danger');
    } finally {
      setBusyKey(null);
    }
  }

  function update(idx: number, patch: Partial<SettingRow>) {
    setRows((prev) => prev.map((r, i) => i === idx ? { ...r, ...patch } : r));
  }

  const visible = rows
    .map((r, idx) => ({ row: r, idx }))
    .filter(({ row }) => row.group === activeGroup);

  return (
    <>
      <PageHeader title="Sayt sozlamalari (matnlar)" />
      <main className="content">
        {loading ? <div className="muted">Yuklanmoqda...</div> : (
          <>
            <div className="card mb-18">
              <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                {groups.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={'btn btn-sm ' + (g === activeGroup ? 'btn-primary' : 'btn-outline')}
                    onClick={() => setActiveGroup(g)}
                  >{g}</button>
                ))}
              </div>
              <div className="mt-12">
                <LocaleTabs current={locale} onChange={setLocale} />
              </div>
            </div>

            {visible.map(({ row, idx }) => {
              const isRaw = row.value_uz === null && row.value_ru === null && row.value_en === null;
              const valueKey = ('value_' + locale) as 'value_uz' | 'value_ru' | 'value_en';
              return (
                <div key={row.key} className="card">
                  <div className="between" style={{ marginBottom: 8 }}>
                    <code className="id-cell" style={{ fontSize: '0.85rem' }}>{row.key}</code>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={busyKey === row.key}
                      onClick={() => save(row)}
                    >
                      {busyKey === row.key ? '...' : 'Saqlash'}
                    </button>
                  </div>

                  {isRaw ? (
                    <>
                      <span className="field-label">Qiymat (barcha tillarda bir xil)</span>
                      <input
                        className="input"
                        value={row.value_raw ?? ''}
                        onChange={(e) => update(idx, { value_raw: e.target.value })}
                      />
                    </>
                  ) : (
                    <>
                      <span className="field-label">Qiymat ({locale})</span>
                      {(row[valueKey] || '').length > 80 ? (
                        <textarea
                          className="textarea"
                          rows={3}
                          value={row[valueKey] ?? ''}
                          onChange={(e) => update(idx, { [valueKey]: e.target.value } as any)}
                        />
                      ) : (
                        <input
                          className="input"
                          value={row[valueKey] ?? ''}
                          onChange={(e) => update(idx, { [valueKey]: e.target.value } as any)}
                        />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}
      </main>
    </>
  );
}
