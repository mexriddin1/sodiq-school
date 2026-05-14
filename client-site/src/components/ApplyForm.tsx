'use client';
import { useState, type FormEvent } from 'react';
import type { Locale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { submitApplication } from '@/lib/api';

type Variant = 'full' | 'compact' | 'aloqa';

export function ApplyForm({ locale, variant = 'full' }: { locale: Locale; variant?: Variant }) {
  const dict = getDict(locale);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const fd = new FormData(e.currentTarget);
    const name = (fd.get('name') as string || '').trim();
    const phone = (fd.get('phone') as string || '').trim();
    const message = (fd.get('message') as string || '').trim();
    const grade = (fd.get('grade') as string || '').trim();
    if (!name || !phone) return;
    setBusy(true);
    try {
      await submitApplication({
        name, phone,
        message: message || undefined,
        grade: grade || undefined,
        source_form: variant,
      });
      setSuccess(true);
      (e.currentTarget as HTMLFormElement).reset();
      setTimeout(() => { setSuccess(false); setBusy(false); }, 6000);
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  }

  if (variant === 'compact') {
    return (
      <>
        <form className="apply-form reveal delay-1" onSubmit={onSubmit}>
          <input type="text" name="name" placeholder={dict.form.name} required />
          <input type="tel" name="phone" placeholder={dict.form.phone} required />
          <textarea name="message" placeholder={dict.form.message} rows={3} />
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? dict.form.submitted : dict.form.submit}
          </button>
        </form>
        <div className={'form-success' + (success ? ' show' : '')}>{dict.form.success}</div>
      </>
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
            {dict.form.grade_options.map((g) => <option key={g}>{g}</option>)}
          </select>
        </label>
        <button type="submit" className="btn btn-primary btn-large btn-block" disabled={busy}>
          {busy ? dict.form.submitted : dict.cta_apply}
        </button>
        <p className="privacy-note">{dict.form.privacy}</p>
        <div className={'form-success' + (success ? ' show' : '')}>{dict.form.success}</div>
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
      <button type="submit" className="btn btn-primary btn-large btn-block" disabled={busy}>
        {busy ? dict.form.submitted : dict.form.submit}
      </button>
      <p className="privacy-note">{dict.form.privacy}</p>
      <div className={'form-success' + (success ? ' show' : '')}>{dict.form.success}</div>
    </form>
  );
}
