'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LOCALES, LOCALE_NAMES, type Locale, isLocale } from '@/i18n/config';

function FlagUZ() {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="none" aria-hidden="true">
      <rect width="60" height="10" fill="#1eb53a"/>
      <rect y="10" width="60" height="10" fill="#fff"/>
      <rect y="20" width="60" height="10" fill="#0099b5"/>
      <rect y="9.7"  width="60" height="0.6" fill="#ce1126"/>
      <rect y="19.7" width="60" height="0.6" fill="#ce1126"/>
    </svg>
  );
}

function FlagRU() {
  return (
    <svg viewBox="0 0 9 6" preserveAspectRatio="none" aria-hidden="true">
      <rect width="9" height="2" fill="#fff"/>
      <rect y="2" width="9" height="2" fill="#0039a6"/>
      <rect y="4" width="9" height="2" fill="#d52b1e"/>
    </svg>
  );
}

function FlagEN() {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="none" aria-hidden="true">
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#fff" strokeWidth="6"/>
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="3"/>
      <path d="M30 0 V30 M0 15 H60" stroke="#fff" strokeWidth="10"/>
      <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  );
}

const FLAG: Record<Locale, () => JSX.Element> = {
  uz: FlagUZ,
  ru: FlagRU,
  en: FlagEN,
};

export function LanguageSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    // Delay attaching so the click that opened the dropdown isn't caught.
    const t = setTimeout(() => {
      document.addEventListener('click', onDocClick);
      document.addEventListener('keydown', onEsc);
    }, 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  const switchTo = useCallback((target: Locale) => {
    setOpen(false);
    if (target === current) return;
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000`;
    }
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] && isLocale(segments[0])) {
      segments[0] = target;
    } else {
      segments.unshift(target);
    }
    router.push('/' + segments.join('/'));
  }, [current, pathname, router]);

  const CurFlag = FLAG[current];

  return (
    <div className={'lang-switcher' + (open ? ' open' : '')} ref={ref}>
      <button
        type="button"
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="lang-flag"><CurFlag /></span>
        <span className="lang-label">{LOCALE_NAMES[current]}</span>
        <svg className="lang-caret" viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <ul className="lang-menu" role="listbox" hidden={!open}>
        {LOCALES.map((loc) => {
          const Flag = FLAG[loc];
          return (
            <li key={loc}>
              <button
                type="button"
                className={'lang-option' + (loc === current ? ' active' : '')}
                onClick={() => switchTo(loc)}
                role="option"
                aria-selected={loc === current}
              >
                <span className="lang-flag"><Flag /></span>
                <span>{LOCALE_NAMES[loc]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
