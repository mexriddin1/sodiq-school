import { env } from '../config/env.js';

export const LOCALES = env.locales;
export const DEFAULT_LOCALE = env.defaultLocale;

export function pickLocale(req) {
  const q = (req.query.lang || req.query.locale || '').toString().toLowerCase();
  if (LOCALES.includes(q)) return q;
  return DEFAULT_LOCALE;
}

// Given an array of *_translations rows for one parent (multiple locales),
// returns the row matching the requested locale, falling back to default
// then any available row.
export function pickTranslation(rows, locale) {
  if (!rows?.length) return null;
  return rows.find(r => r.locale === locale)
      || rows.find(r => r.locale === DEFAULT_LOCALE)
      || rows[0];
}

// Group a flat result of (parent JOIN translations) rows into nested
// {...parent, translations: { uz, ru, en }}
export function groupTranslations(rows, parentIdField = 'id', translationFields = []) {
  const map = new Map();
  for (const r of rows) {
    if (!map.has(r[parentIdField])) {
      const { locale, ...parent } = r;
      // strip translation-only fields off the parent
      for (const f of translationFields) delete parent[f];
      delete parent.locale;
      map.set(r[parentIdField], { ...parent, translations: {} });
    }
    if (r.locale) {
      const t = {};
      for (const f of translationFields) t[f] = r[f];
      map.get(r[parentIdField]).translations[r.locale] = t;
    }
  }
  return Array.from(map.values());
}

// Validate that req.body.translations contains all 3 locales
export function validateTranslationBlock(translations) {
  if (!translations || typeof translations !== 'object') {
    throw new Error('translations object is required');
  }
  for (const loc of LOCALES) {
    if (!translations[loc]) {
      throw new Error(`translations.${loc} is required`);
    }
  }
}
