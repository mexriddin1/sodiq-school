'use client';
import { useState, type FormEvent } from 'react';
import type { Locale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { submitApplication } from '@/lib/api';
import { PinIcon, PhoneIcon, ClockIcon, TelegramIcon } from './Icons';

type Props = {
  locale: Locale;
  settings: Record<string, string>;
  variant?: 'default' | 'compact';
  customTitle?: string;
  customSubtitle?: string;
  showMap?: boolean;
};

export function CtaBanner({
  locale,
  settings,
  variant = 'default',
  customTitle,
  customSubtitle,
  showMap = true,
}: Props) {
  const dict = getDict(locale);
  const phone = settings['contact.phone'] || '+998 78 888 80 80';
  const phoneLink = settings['contact.phone_link'] || phone.replace(/\D/g, '');
  const tg = settings['contact.telegram'] || 'https://t.me/sodiq_school';
  const ig = settings['contact.instagram'] || 'https://instagram.com/sodiqschool.uz';
  const yt = settings['contact.youtube'] || 'https://youtube.com/@sodiq_school';

  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') as string || '').trim();
    const phoneVal = (fd.get('phone') as string || '').trim();
    const message = (fd.get('message') as string || '').trim();
    if (!name || !phoneVal) return;
    setBusy(true);
    try {
      await submitApplication({ name, phone: phoneVal, message: message || undefined, source_form: 'cta-banner' });
      setSuccess(true);
      (e.currentTarget as HTMLFormElement).reset();
      setTimeout(() => { setSuccess(false); setBusy(false); }, 6000);
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  }

  return (
    <section className="cta-banner">
      <div className="cta-deco cta-deco-1"></div>
      <div className="cta-deco cta-deco-2"></div>
      <div className="cta-deco cta-deco-3"></div>
      <div className="cta-deco cta-deco-4"></div>
      <div className="container">
        <div className="cta-inner reveal">
          <div className="cta-left">
            <div className="cta-info-head">
              <h3 className="cta-info-title">{dict.sections.contact_title}</h3>
              <p className="cta-info-sub">{dict.sections.contact_subtitle}</p>
            </div>
            <div className="cta-info-card">
              {variant === 'default' && (
                <div className="cta-info-row">
                  <PinIcon className="cta-ic" />
                  <div>
                    <span className="cta-info-label">{dict.sections.address_label}</span>
                    <span className="cta-info-value">{settings['contact.address']}</span>
                  </div>
                </div>
              )}
              <div className="cta-info-row">
                <PhoneIcon className="cta-ic" />
                <div>
                  <span className="cta-info-label">{dict.sections.phone_label}</span>
                  <a href={`tel:${phoneLink}`} className="cta-info-value">{phone}</a>
                </div>
              </div>
              {variant === 'default' && (
                <div className="cta-info-row">
                  <ClockIcon className="cta-ic" />
                  <div>
                    <span className="cta-info-label">{dict.sections.hours_label}</span>
                    <span className="cta-info-value">{settings['contact.hours']}</span>
                  </div>
                </div>
              )}
            </div>

            {variant === 'default' && (
              <div className="cta-socials">
                <a href={tg} className="cta-social" aria-label="Telegram">
                  <TelegramIcon />
                </a>
                <a href={ig} className="cta-social" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="5"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/>
                  </svg>
                </a>
                <a href={yt} className="cta-social" aria-label="YouTube">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 9.71s-.23-1.6-.93-2.3c-.89-.93-1.89-.94-2.35-.99C16.4 6.1 12 6.1 12 6.1s-4.4 0-7.72.32c-.46.05-1.46.06-2.35.99-.7.7-.93 2.3-.93 2.3S.77 11.54.77 13.37v1.71c0 1.83.23 3.66.23 3.66s.23 1.6.93 2.3c.89.93 2.06.9 2.58 1 1.87.18 7.49.23 7.49.23s4.4-.01 7.72-.33c.46-.05 1.46-.06 2.35-.99.7-.7.93-2.3.93-2.3s.23-1.83.23-3.66v-1.71c0-1.83-.23-3.66-.23-3.66zM9.55 15.72V9.5l6.36 3.12-6.36 3.1z"/></svg>
                </a>
              </div>
            )}
          </div>

          <div className="cta-right">
            <form className="cta-form" onSubmit={onSubmit} noValidate>
              <div className="cta-form-head">
                <h3 className="cta-form-title">{customTitle || dict.sections.contact_eyebrow}</h3>
                <p className="cta-form-sub">{customSubtitle || dict.sections.contact_subtitle}</p>
              </div>
              <input type="text" name="name" required placeholder={dict.form.name_placeholder} />
              <input type="tel" name="phone" required placeholder={dict.form.phone_placeholder} />
              <textarea name="message" rows={3} placeholder={dict.form.message_placeholder} />
              <button type="submit" className="cta-submit" disabled={busy}>
                {busy ? dict.form.submitted : dict.form.submit}
              </button>
              <div className={'form-success' + (success ? ' show' : '')}>{dict.form.success}</div>
            </form>
          </div>
        </div>
      </div>

      {showMap && variant === 'default' && (
        <div className="cta-map-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2998.5!2d69.2181!3d41.2389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8de7c2b0e3f5%3A0x4e5a7f3b8e2d1c9a!2sKumarik%20ko'chasi%203%2F1%2C%20Toshkent!5e0!3m2!1suz!2suz!4v1700000000000"
            title="Sodiq School manzili"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </section>
  );
}
