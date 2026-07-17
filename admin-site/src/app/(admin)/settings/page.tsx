'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/components/ToastProvider';
import { LocaleTabs, useLocaleTabs, LOCALES } from '@/components/LocaleTabs';
import { PageHeader } from '@/components/PageHeader';

type SettingRow = {
  key: string; group: string; description: string | null;
  value_uz: string | null; value_ru: string | null; value_en: string | null;
  value_raw: string | null;
};

// Name/address are per-locale; coordinates are shared, so they stay flat and there
// is only ever one source of truth for a pin's position.
type LocaleText = { uz: string; ru: string; en: string };

type MapLocation = {
  name: LocaleText;
  address: LocaleText;
  lat: string;
  lng: string;
  zoom: string;
};

const MAP_LOCATIONS_KEY = 'contact.map_locations';

function emptyLocaleText(): LocaleText {
  return { uz: '', ru: '', en: '' };
}

function emptyLocation(): MapLocation {
  return { name: emptyLocaleText(), address: emptyLocaleText(), lat: '', lng: '', zoom: '16' };
}

// Older rows stored a single string per field. Read it into all three locales so the
// admin sees the existing text on every tab instead of losing it on the next save.
function toLocaleText(value: unknown): LocaleText {
  if (typeof value === 'string') return { uz: value, ru: value, en: value };
  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>;
    return {
      uz: String(v.uz || ''),
      ru: String(v.ru || ''),
      en: String(v.en || ''),
    };
  }
  return emptyLocaleText();
}

function parseLocations(value?: string | null): MapLocation[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => ({
      name: toLocaleText(item?.name),
      address: toLocaleText(item?.address),
      lat: String(item?.lat || ''),
      lng: String(item?.lng || ''),
      zoom: String(item?.zoom || '16'),
    }));
  } catch {
    return [];
  }
}

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

  const mapRow = useMemo(() => rows.find((r) => r.key === MAP_LOCATIONS_KEY), [rows]);
  const mapLocations = useMemo(() => parseLocations(mapRow?.value_raw), [mapRow?.value_raw]);

  function setMapLocations(next: MapLocation[]) {
    setRows((prev) => {
      const value = JSON.stringify(next);
      const existingIndex = prev.findIndex((r) => r.key === MAP_LOCATIONS_KEY);
      if (existingIndex === -1) {
        return [
          ...prev,
          {
            key: MAP_LOCATIONS_KEY,
            group: 'contact',
            description: 'Map manzillari JSON',
            value_uz: null,
            value_ru: null,
            value_en: null,
            value_raw: value,
          },
        ];
      }
      return prev.map((r, i) => i === existingIndex ? { ...r, value_raw: value } : r);
    });
  }

  function patchLocation(index: number, patch: Partial<MapLocation>) {
    setMapLocations(mapLocations.map((item, i) => i === index ? { ...item, ...patch } : item));
  }

  async function saveMapLocations() {
    const row = rows.find((r) => r.key === MAP_LOCATIONS_KEY) || {
      key: MAP_LOCATIONS_KEY,
      group: 'contact',
      description: 'Har bir manzil uchun nom, adres va koordinata.',
      value_uz: null,
      value_ru: null,
      value_en: null,
      value_raw: JSON.stringify(mapLocations),
    };
    await save({
      ...row,
      group: 'contact',
      value_uz: null,
      value_ru: null,
      value_en: null,
      value_raw: JSON.stringify(mapLocations),
      description: 'Har bir manzil uchun nom, adres va koordinata.',
    });
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

            {activeGroup === 'contact' && (
              <div className="card">
                <div className="between" style={{ marginBottom: 8 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Map manzillar</h3>
                    <p className="muted" style={{ margin: '6px 0 0', fontSize: '0.82rem' }}>
                      Har bir manzilni alohida yarating. Nomi va manzili har bir til uchun alohida — yuqoridagi til tab'ini almashtirib to'ldiring. Koordinata va zoom barcha tillar uchun umumiy.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busyKey === MAP_LOCATIONS_KEY}
                    onClick={saveMapLocations}
                  >
                    {busyKey === MAP_LOCATIONS_KEY ? '...' : 'Maplarni saqlash'}
                  </button>
                </div>
                <div style={{ display: 'grid', gap: 12 }}>
                  {mapLocations.map((item, index) => (
                    <div key={index} className="card" style={{ background: '#f8fafc', margin: 0 }}>
                      <div className="between" style={{ marginBottom: 10 }}>
                        <strong>Manzil {index + 1}</strong>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => setMapLocations(mapLocations.filter((_, i) => i !== index))}
                        >
                          O'chirish
                        </button>
                      </div>
                      <div className="field-row">
                        <label>
                          <span className="field-label">Nomi ({locale.toUpperCase()})</span>
                          <input
                            className="input"
                            value={item.name[locale]}
                            onChange={(e) => patchLocation(index, { name: { ...item.name, [locale]: e.target.value } })}
                            placeholder="Masalan: Istirohat"
                          />
                        </label>
                        <label>
                          <span className="field-label">Manzil ({locale.toUpperCase()})</span>
                          <input
                            className="input"
                            value={item.address[locale]}
                            onChange={(e) => patchLocation(index, { address: { ...item.address, [locale]: e.target.value } })}
                            placeholder="Shayxontoxur tumani, Istirohat-258"
                          />
                        </label>
                      </div>
                      <div className="field-row">
                        <label>
                          <span className="field-label">Latitude</span>
                          <input className="input" value={item.lat} onChange={(e) => patchLocation(index, { lat: e.target.value })} placeholder="41.3265" />
                        </label>
                        <label>
                          <span className="field-label">Longitude</span>
                          <input className="input" value={item.lng} onChange={(e) => patchLocation(index, { lng: e.target.value })} placeholder="69.2848" />
                        </label>
                      </div>
                      <label>
                        <span className="field-label">Zoom</span>
                        <input className="input" value={item.zoom} onChange={(e) => patchLocation(index, { zoom: e.target.value })} placeholder="16" />
                      </label>
                    </div>
                  ))}
                  <button type="button" className="btn btn-outline" onClick={() => setMapLocations([...mapLocations, emptyLocation()])}>
                    + Yangi manzil qo'shish
                  </button>
                </div>
              </div>
            )}

            {visible.map(({ row, idx }) => {
              if (row.key === MAP_LOCATIONS_KEY) return null;
              const isRaw = row.value_uz === null && row.value_ru === null && row.value_en === null;
              const valueKey = ('value_' + locale) as 'value_uz' | 'value_ru' | 'value_en';
              const useTextarea = row.key === 'contact.address';
              const helpText = useTextarea
                ? "Bir nechta manzilni yangi qatordan yoki | belgisi bilan ajrating. Masalan: Manzil 1 | Manzil 2"
                : row.description;
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

                  {helpText && (
                    <p className="muted" style={{ fontSize: '0.82rem', marginBottom: 8, marginTop: -2 }}>
                      {helpText}
                    </p>
                  )}

                  {isRaw ? (
                    <>
                      <span className="field-label">Qiymat (barcha tillarda bir xil)</span>
                      {useTextarea ? (
                        <textarea
                          className="textarea"
                          rows={4}
                          value={row.value_raw ?? ''}
                          onChange={(e) => update(idx, { value_raw: e.target.value })}
                        />
                      ) : (
                        <input
                          className="input"
                          value={row.value_raw ?? ''}
                          onChange={(e) => update(idx, { value_raw: e.target.value })}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <span className="field-label">Qiymat ({locale})</span>
                      {useTextarea || (row[valueKey] || '').length > 80 ? (
                        <textarea
                          className="textarea"
                          rows={useTextarea ? 4 : 3}
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
