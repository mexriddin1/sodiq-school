'use client';
import { useRef, useState, type FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { submitApplication } from '@/lib/api';
import { getUtm } from '@/lib/utm';
import { fireMetaLead, generateEventId, getMetaCookies } from '@/lib/meta-pixel';
import { GRADE_OPTIONS, UZBEKISTAN_REGIONS } from '@/lib/form-options';

type Variant = 'full' | 'compact' | 'aloqa';

export function ApplyForm({ locale, variant = 'full' }: { locale: Locale; variant?: Variant }) {
  const dict = getDict(locale);
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const leadFired = useRef(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get('name') as string || '').trim();
    const phone = (fd.get('phone') as string || '').trim();
    const message = (fd.get('message') as string || '').trim();
    const grade = (fd.get('grade') as string || '').trim();
    const region = (fd.get('region') as string || '').trim();
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
        name, phone,
        message: message || undefined,
        grade: grade || undefined,
        region: region || undefined,
        source_form: variant,
        event_id: eventId, fbp, fbc,
      });
    } catch (err) {
      console.error(err);
    } finally {
      form.reset();
      const fromExamLanding = pathname?.includes('/imtixon-1july') || pathname?.includes('/imtixon-1iyul');
      router.push(`/${locale}/thanks${fromExamLanding ? '?tg=imtixon-1july' : ''}`);
    }
  }

  if (variant === 'compact') {
    return (
      <form className="apply-form reveal delay-1" onSubmit={onSubmit}>
        <input type="text" name="name" placeholder={dict.form.name} required />
        <input type="tel" name="phone" placeholder={dict.form.phone} required />
        <textarea name="message" placeholder={dict.form.message} rows={3} />
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? dict.form.submitted : dict.form.submit}
        </button>
      </form>
    );
  }

  if (variant === 'aloqa') {
    return (
      <form className="contact-form reveal" onSubmit={onSubmit} noValidate>
        <label>{dict.form.name}
          <input type="text" name="name" required placeholder={dict.form.name_placeholder} />
        </label>
        <label>{dict.form.phone}
          <input type="tel" name="phone" required placeholder={dict.form.phone_placeholder} />
        </label>
        <label>{dict.form.grade}
          <select name="grade" required defaultValue="">
            <option value="" disabled>{dict.form.grade_choose}</option>
            {GRADE_OPTIONS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </label>
        <label>{dict.form.region}
          <select name="region" required defaultValue="">
            <option value="" disabled>{dict.form.region_choose}</option>
            {UZBEKISTAN_REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
        <button type="submit" className="btn btn-primary btn-large btn-block" disabled={busy}>
          {busy ? dict.form.submitted : dict.cta_apply}
        </button>
        <p className="privacy-note">{dict.form.privacy}</p>
      </form>
    );
  }

  return (
    <form className="contact-form reveal" onSubmit={onSubmit} noValidate>
      <label>{dict.form.name}
        <input type="text" name="name" required placeholder={dict.form.name_placeholder} />
      </label>
      <label>{dict.form.phone}
        <input type="tel" name="phone" required placeholder={dict.form.phone_placeholder} />
      </label>
      <label>{dict.form.message}
        <textarea name="message" rows={4} placeholder={dict.form.message_placeholder} />
      </label>
      <label>{dict.form.grade}
        <select name="grade" defaultValue="">
          <option value="" disabled>{dict.form.grade_choose}</option>
          {GRADE_OPTIONS.map((g) => <option key={g}>{g}</option>)}
        </select>
      </label>
      <label>{dict.form.region}
        <select name="region" defaultValue="">
          <option value="" disabled>{dict.form.region_choose}</option>
          {UZBEKISTAN_REGIONS.map((r) => <option key={r}>{r}</option>)}
        </select>
      </label>
      <button type="submit" className="btn btn-primary btn-large btn-block" disabled={busy}>
        {busy ? dict.form.submitted : dict.form.submit}
      </button>
      <p className="privacy-note">{dict.form.privacy}</p>
    </form>
  );
}
