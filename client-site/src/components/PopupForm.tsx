'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { submitApplication } from '@/lib/api';
import { getUtm } from '@/lib/utm';
import { fireMetaLead, generateEventId, getMetaCookies } from '@/lib/meta-pixel';
import { GRADE_OPTIONS, UZBEKISTAN_REGIONS } from '@/lib/form-options';

export function goToThanks(locale: string) {
  if (typeof window === 'undefined') return;
  window.location.href = `/${locale}/thanks`;
}

export function PopupForm({ locale }: { locale: Locale }) {
  const dict = getDict(locale);
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname?.includes('/short-landing') || pathname?.includes('/long-landing') || pathname?.includes('/imtixon-1avgust');
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const leadFired = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.body.classList.toggle('popup-open', open);
    return () => document.body.classList.remove('popup-open');
  }, [open]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const trigger = target.closest<HTMLElement>('[data-popup-open], .btn-primary');
      if (!trigger) return;
      if (trigger.closest('.popup-form-modal')) return;
      if (trigger.hasAttribute('data-popup-skip')) return;
      if (trigger.closest('[data-popup-skip="true"]')) return;
      if ((trigger as HTMLButtonElement).type === 'submit' && trigger.closest('form')) return;
      const href = trigger.getAttribute('href') || '';
      if (href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return;

      if (isLanding) {
        const ctaTarget = document.querySelector('.cta-banner');
        if (ctaTarget) {
          e.preventDefault();
          ctaTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }

      e.preventDefault();
      setOpen(true);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [close, isLanding]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const grade = String(data.get('grade') || '').trim();
    const region = String(data.get('region') || '').trim();
    if (!name || !phone) return;

    setBusy(true);
    const eventId = generateEventId();
    const { fbp, fbc } = getMetaCookies();
    if (!leadFired.current) {
      fireMetaLead(eventId);
      leadFired.current = true;
    }
    try {
      await submitApplication({
        ...getUtm(),
        name,
        phone,
        grade: grade || undefined,
        region: region || undefined,
        source_form: 'popup',
        event_id: eventId, fbp, fbc,
      });
    } catch (err) {
      console.error(err);
    } finally {
      form.reset();
      setOpen(false);
      const fromExamLanding = pathname?.includes('/imtixon-1avgust');
      router.push(`/${locale}/thanks${fromExamLanding ? '?tg=imtixon-1avgust' : ''}`);
    }
  }

  return (
    <div className={'popup-form-modal' + (open ? ' open' : '')} aria-hidden={!open}>
      <div className="popup-form-backdrop" onClick={close} />
      <div className="popup-form-card" role="dialog" aria-modal="true">
        <button className="popup-form-close" type="button" aria-label="Close" onClick={close}>×</button>
        <div className="popup-form-layout">
          <div className="popup-form-left">
            <span className="eyebrow">{dict.sections.contact_eyebrow}</span>
            <h3>{dict.sections.contact_title}</h3>
            <p>{dict.sections.contact_subtitle}</p>
            <form className="popup-form-fields" onSubmit={onSubmit}>
              <label htmlFor="popupName">{dict.form.name}</label>
              <input id="popupName" name="name" type="text" placeholder={dict.form.name_placeholder} required />
              <label htmlFor="popupPhone">{dict.form.phone}</label>
              <input id="popupPhone" name="phone" type="tel" placeholder={dict.form.phone_placeholder} required />
              <label htmlFor="popupGrade">{dict.form.grade}</label>
              <select id="popupGrade" name="grade" defaultValue="">
                <option value="" disabled>{dict.form.grade_choose}</option>
                {GRADE_OPTIONS.map((grade) => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <label htmlFor="popupRegion">{dict.form.region}</label>
              <select id="popupRegion" name="region" defaultValue="">
                <option value="" disabled>{dict.form.region_choose}</option>
                {UZBEKISTAN_REGIONS.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {busy ? dict.form.submitted : dict.cta_apply}
              </button>
            </form>
          </div>
          <div className="popup-form-right">
            <img
              src="/images/hero-bg.png"
              alt="Sodiq School"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
