// First-touch UTM capture. Stores in localStorage for 30 days; later form
// submits read the stored values so attribution survives in-site navigation.

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

type UtmKey = (typeof UTM_KEYS)[number];

const STORAGE_KEY = 'utm_first_touch_v1';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type Stored = Partial<Record<UtmKey, string>> & {
  _ts?: number;
  _ref?: string;
  _landing?: string;
};

function readStored(): Stored | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed || !parsed._ts) return null;
    if (Date.now() - parsed._ts > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function captureUtm(): void {
  if (typeof window === 'undefined') return;
  if (readStored()) return; // first-touch only — don't overwrite
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Stored = {};
    let any = false;
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) {
        found[key] = value.slice(0, 120);
        any = true;
      }
    }
    if (!any) return;
    found._ts = Date.now();
    found._ref = (document.referrer || '').slice(0, 500) || undefined;
    found._landing = (window.location.pathname + window.location.search).slice(0, 500);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // ignore
  }
}

export function getUtm(): Partial<Record<UtmKey, string>> & { referrer?: string; landing_page?: string } {
  const stored = readStored();
  if (!stored) return {};
  const out: Partial<Record<UtmKey, string>> & { referrer?: string; landing_page?: string } = {};
  for (const key of UTM_KEYS) {
    if (stored[key]) out[key] = stored[key];
  }
  if (stored._ref) out.referrer = stored._ref;
  if (stored._landing) out.landing_page = stored._landing;
  return out;
}
