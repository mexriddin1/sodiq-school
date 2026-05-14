import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { isLocale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { fetchSiteBundle } from '@/lib/api';
import { PageHero } from '@/components/PageHero';
import { CtaBanner } from '@/components/CtaBanner';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getDict(params.locale as Locale);
  return { title: dict.meta.aloqa_title, description: dict.meta.aloqa_desc };
}

export default async function AloqaPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDict(locale);
  const bundle = await fetchSiteBundle(locale);
  const s = bundle.settings;

  const aloqaFaqs = bundle.faqs.filter(f => f.page === 'aloqa' || f.page === 'both');

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s['aloqa.hero_eyebrow'] || dict.nav.contact}
        title={s['aloqa.hero_title'] || dict.nav.contact}
        lead={s['aloqa.hero_lead']}
      />

      <CtaBanner locale={locale} settings={s} />

      <section className="faq">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.faq_eyebrow}</span>
            <h2>{dict.sections.faq_title}</h2>
          </div>
          <div className="faq-list reveal delay-1">
            {aloqaFaqs.map((f) => (
              <div key={f.id} className="faq-item">
                <button className="faq-q" type="button">{f.question}<span className="icon">+</span></button>
                <div className="faq-a"><div className="faq-a-inner" dangerouslySetInnerHTML={{ __html: f.answer || '' }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
