import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';

const COPY: Record<string, { title: string; body: string; back: string }> = {
  uz: {
    title: "Rahmat, ma'lumotingiz uchun!",
    body: "Arizangiz qabul qilindi. Operatorimiz eng qisqa vaqt ichida siz bilan bog'lanadi.",
    back: 'Bosh sahifaga qaytish',
  },
  ru: {
    title: 'Спасибо за вашу информацию!',
    body: 'Ваша заявка принята. Наш оператор свяжется с вами в ближайшее время.',
    back: 'Вернуться на главную',
  },
  en: {
    title: 'Thank you for your information!',
    body: 'Your request has been received. Our operator will contact you shortly.',
    back: 'Back to home',
  },
};

export function generateMetadata(): Metadata {
  return {
    title: 'Thank you — Sodiq School',
    robots: { index: false, follow: false },
  };
}

export default function ThanksPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = COPY[locale] || COPY.uz;

  return (
    <main className="thanks-page">
      <div className="thanks-check" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 33 L27 46 L50 21" />
        </svg>
      </div>
      <h1>{t.title}</h1>
      <p>{t.body}</p>
      <Link href={`/${locale}`} className="btn btn-primary btn-large" data-popup-skip="true">
        {t.back}
      </Link>
    </main>
  );
}
