import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';

const COPY: Record<string, { title: string; body: string }> = {
  uz: {
    title: "Rahmat, ma'lumotingiz uchun!",
    body: "Arizangiz qabul qilindi. Operatorimiz eng qisqa vaqt ichida siz bilan bog'lanadi.",
  },
  ru: {
    title: 'Спасибо за вашу информацию!',
    body: 'Ваша заявка принята. Наш оператор свяжется с вами в ближайшее время.',
  },
  en: {
    title: 'Thank you for your information!',
    body: 'Your request has been received. Our operator will contact you shortly.',
  },
};

export function generateMetadata(): Metadata {
  return {
    title: 'Thank you - Sodiq School',
    robots: { index: false, follow: false },
  };
}

export default function ThanksPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = COPY[locale] || COPY.uz;
  const telegramLabel = locale === 'en' ? 'Contact on Telegram' : locale === 'ru' ? 'Telegram' : "Telegram orqali bog'lanish";

  return (
    <>
      <Script id="telegram-lead-thanks" strategy="afterInteractive">
        {`if(new URLSearchParams(window.location.search).get('tg')==='imtixon-1july'){var f=false;var fire=function(){if(f||typeof window.tgp!=='function')return;f=true;window.tgp('event','bjPNOpBd-wozq1aBm');};fire();if(!f){var i=0;var timer=setInterval(function(){i+=1;fire();if(f||i>20)clearInterval(timer);},250);}}`}
      </Script>
      <main className="thanks-page">
        <div className="thanks-check" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 33 L27 46 L50 21" />
          </svg>
        </div>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <div className="thanks-actions">
          <a className="btn btn-primary" href="https://t.me/sodiqschool1" target="_blank" rel="noopener noreferrer" data-popup-skip="true">
            {telegramLabel}
          </a>
        </div>
      </main>
    </>
  );
}
