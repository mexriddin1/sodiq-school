'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { splitContactAddresses } from '@/lib/contact';
import { Logo } from './Logo';

export function Footer({ locale, settings }: { locale: Locale; settings: Record<string, string> }) {
  const dict = getDict(locale);
  const pathname = usePathname();
  const isLanding = pathname === `/${locale}/short-landing` || pathname === `/${locale}/long-landing` || pathname === `/${locale}/imtixon-1avgust`;
  const phone = settings['contact.phone'] || '+998 78 888 80 80';
  const phoneLink = settings['contact.phone_link'] || phone.replace(/\D/g, '');
  const tg = settings['contact.telegram'] || 'https://t.me/sodiq_school';
  const ig = settings['contact.instagram'] || 'https://instagram.com/sodiqschool.uz';
  const yt = settings['contact.youtube'] || 'https://youtube.com/@sodiq_school';
  const desc = settings['brand.description'] || '';
  const addresses = splitContactAddresses(settings['contact.address']);
  const primaryAddress = addresses[0];
  const copy = settings['footer.copyright'] || '© 2025 Sodiq School.';
  return (
    <footer className={'footer' + (isLanding ? ' footer--landing' : '')}>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <Logo
              locale={locale}
              variant="footer"
              brand={settings['brand.name']}
              lightUrl={settings['brand.logo_light_url']}
            />
            <p className="desc">{desc}</p>
          </div>
          {!isLanding && (
            <nav className="footer-nav">
              <Link href={`/${locale}`}>{dict.nav.home}</Link>
              <Link href={`/${locale}/about`}>{dict.nav.about}</Link>
              <Link href={`/${locale}/natijalar`}>{dict.nav.results}</Link>
              <Link href={`/${locale}/mashgulotlar`}>{dict.nav.lessons}</Link>
              <Link href={`/${locale}/blog`}>{dict.nav.blog}</Link>
              <Link href={`/${locale}/aloqa`}>{dict.nav.contact}</Link>
            </nav>
          )}
          <div className="footer-right">
            <div>
              <span className="phone-lbl">{dict.sections.apply_label_phone}</span>
              <div className="phone"><a href={`tel:${phoneLink}`}>{phone}</a></div>
            </div>
            {primaryAddress && (
              <div className="footer-addresses">
                <span className="phone-lbl">{dict.sections.address_label || 'Manzil'}</span>
                <div className="footer-address-list">
                  <span className="footer-address-text">{primaryAddress}</span>
                </div>
              </div>
            )}
            {!isLanding && (
              <div className="socials">
                <a href={tg} className="social-btn" aria-label="Telegram">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 4.5L2.5 12l5.5 2 2 6 3-3.5 5 4 3.5-16zm-4.7 4.2l-7.5 6.8-1.2-3.7 8.7-3.1z"/></svg>
                </a>
                <a href={ig} className="social-btn" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <path d="M16 11.4A4 4 0 1112.6 8 4 4 0 0116 11.4z"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                </a>
                <a href={yt} className="social-btn" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7s-.2-1.5-.8-2.2c-.8-.8-1.7-.8-2.1-.9-3-.2-7.5-.2-7.5-.2s-4.5 0-7.5.2c-.4.1-1.3.1-2.1.9C2.4 5.5 2.2 7 2.2 7S2 8.7 2 10.5v1.7c0 1.7.2 3.5.2 3.5s.2 1.5.8 2.2c.8.8 1.8.8 2.3.9 1.7.2 7.2.2 7.2.2s4.5 0 7.5-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2.2.8-2.2s.2-1.7.2-3.5v-1.7c0-1.8-.2-3.5-.2-3.5zM10 14V8l5 3-5 3z"/></svg>
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="copyright">{copy}</div>
      </div>
    </footer>
  );
}
