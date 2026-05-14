'use client';
import { useState } from 'react';

export const LOCALES = ['uz', 'ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_LABEL: Record<Locale, string> = { uz: "O'zbek", ru: 'Русский', en: 'English' };

export function LocaleTabs({
  current, onChange,
}: {
  current: Locale;
  onChange: (l: Locale) => void;
}) {
  return (
    <div className="locale-tabs">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          className={'locale-tab' + (l === current ? ' active' : '')}
          onClick={() => onChange(l)}
        >
          {LOCALE_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

export function useLocaleTabs(initial: Locale = 'uz') {
  const [locale, setLocale] = useState<Locale>(initial);
  return { locale, setLocale };
}
