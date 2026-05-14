import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { fetchSiteBundle } from '@/lib/api';
import { ExamCoursePage } from '@/components/ExamCoursePage';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const bundle = await fetchSiteBundle(params.locale as Locale).catch(() => null);
  const s = bundle?.settings || {};
  return {
    title: s['mash_sat.page_title'] || 'SAT tayyorlov — Sodiq School',
    description: s['mash_sat.page_desc'] || "Sodiq School SAT tayyorlov kursi.",
  };
}

export default async function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const bundle = await fetchSiteBundle(locale);
  const s = bundle.settings;
  const stats = (bundle.about_stats || [])
    .filter((st) => st.page === 'mash_sat')
    .map((st) => ({ num: `${st.prefix || ''}${st.value}${st.suffix || ''}`, label: st.label }));
  return (
    <ExamCoursePage
      locale={locale}
      badge="SAT"
      pageTitle={s['mash_sat.page_title'] || 'SAT tayyorlov kursi'}
      pageDesc={s['mash_sat.page_desc'] || ''}
      stats={stats}
      ctaTitle={s['mash_sat.cta_title'] || 'SAT kursiga yozilish'}
    />
  );
}
