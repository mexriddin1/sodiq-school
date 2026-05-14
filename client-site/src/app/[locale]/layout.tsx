import { notFound } from 'next/navigation';
import { isLocale, type Locale, LOCALES } from '@/i18n/config';
import { LocaleSetter } from '@/components/LocaleSetter';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { GlobalScripts } from '@/components/GlobalScripts';
import { ScrollToTop } from '@/components/ScrollToTop';
import { fetchSiteBundle } from '@/lib/api';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;

  // Fetch shared site bundle once for header/footer (cached by Next).
  let bundle: Awaited<ReturnType<typeof fetchSiteBundle>> | null = null;
  try {
    bundle = await fetchSiteBundle(locale);
  } catch (err) {
    console.error('[layout] failed to fetch site bundle:', err);
  }

  return (
    <>
      <LocaleSetter locale={locale} />
      <ScrollProgress />
      <Header locale={locale} settings={bundle?.settings || {}} />
      {children}
      <Footer locale={locale} settings={bundle?.settings || {}} />
      <ScrollToTop />
      <GlobalScripts />
    </>
  );
}
