'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header({ locale, settings }: { locale: Locale; settings: Record<string, string> }) {
  const dict = getDict(locale);
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Inner pages (everything except home) get the "solid" header always.
  const isSolid = !isHome;
  const headerClass = ['header', isSolid && 'solid', scrolled && 'scrolled'].filter(Boolean).join(' ');

  function isActive(href: string) {
    return pathname === href || pathname === href + '/';
  }

  const links = [
    { href: `/${locale}`,             label: dict.nav.home },
    { href: `/${locale}/about`,       label: dict.nav.about },
    { href: `/${locale}/natijalar`,   label: dict.nav.results },
    { href: `/${locale}/mashgulotlar`, label: dict.nav.lessons },
    { href: `/${locale}/blog`,        label: dict.nav.blog },
    { href: `/${locale}/aloqa`,       label: dict.nav.contact },
  ];

  return (
    <header className={headerClass} id="header">
      <div className="container header-inner">
        <Logo
          locale={locale}
          brand={settings['brand.name']}
          lightUrl={settings['brand.logo_light_url']}
          darkUrl={settings['brand.logo_dark_url']}
        />
        <nav className={'nav' + (open ? ' open' : '')} id="nav">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l.href) ? 'active' : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="header-cta">
          <LanguageSwitcher current={locale} />
          <Link href={`/${locale}/aloqa`} className="btn btn-primary">{dict.cta_apply}</Link>
          <button
            className={'hamburger' + (open ? ' open' : '')}
            id="hamburger"
            aria-label={dict.open_menu}
            onClick={() => setOpen(!open)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
