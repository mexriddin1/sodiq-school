import { notFound } from "next/navigation";
import { isLocale, type Locale, LOCALES } from "@/i18n/config";
import { LocaleSetter } from "@/components/LocaleSetter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { GlobalScripts } from "@/components/GlobalScripts";
import { ScrollToTop } from "@/components/ScrollToTop";
import { fetchSiteBundle } from "@/lib/api";
import type { Metadata } from "next";

const seoData: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  uz: {
    title: "Sodiq School – Toshkentdagi Eng Yaxshi Xususiy Maktab",
    description:
      "Toshkentdagi elita xususiy maktabi. Yunusoboddagi eng yaxshi maktabda zamonaviy taʼlim, kuchli matematika va TOP universitetlarga tayyorlov.",
    keywords: [
      "sodiq school",

      "toshkentdagi xususiy maktablar",
      "xususiy maktab narxlari",
      "yunusoboddagi xususiy maktablar",
      "xususiy maktab reytingi",
      "eng yaxshi maktablar toshkent",
      "xususiy ta'lim",
    ],
  },
  ru: {
    title: "Sodiq School – Лучшая Частная Школа в Ташкенте | Цены",
    description:
      "Элитная частная школа в Ташкенте на Юнусабаде. Качественное образование, сильная математика и подготовка в ТОП-100 вузов мира. Узнайте цены!",
    keywords: [
      "лучшие частные школы ташкента",
      "частные школы ташкента цены",
      "рейтинг частных школ ташкента",
      "топ 10 частных школ ташкента",
      "элитные школы в ташкенте",
      "частные школы на юнусабаде",
      "стоимость частной школы",
    ],
  },
  en: {
    title: "Sodiq School – Top Private School in Tashkent | Fees",
    description:
      "Elite private school in Tashkent, Yunusabad. High-quality secondary education, advanced mathematics, and direct preparation for TOP-100 world universities.",
    keywords: [
      "best private schools in tashkent",
      "private school tashkent price",
      "top schools in tashkent",
      "elite schools uzbekistan",
      "high school yunusabad",
      "private school fees tashkent",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale || "uz";
  const currentSeo = seoData[locale] || seoData.uz;

  const baseUrl = "https://sodiqschool.uz";
  const currentUrl = `${baseUrl}/${locale}`;

  return {
    title: currentSeo.title,
    description: currentSeo.description,
    keywords: currentSeo.keywords,

    verification: {
      google: "bdJsJORhzTgyLoOw27C1XX8tw1iGdUrszCEpJIS0DuE",
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: currentUrl,
      languages: {
        "uz-UZ": `${baseUrl}/uz`,
        "ru-RU": `${baseUrl}/ru`,
        "en-US": `${baseUrl}/en`,
      },
    },

    openGraph: {
      title: currentSeo.title,
      description: currentSeo.description,
      url: currentUrl,
      siteName: "Sodiq School",
      type: "website",
      locale: locale === "uz" ? "uz_UZ" : locale === "ru" ? "ru_RU" : "en_US",
      images: [
        {
          url: `${baseUrl}/images/hero-bg.png`,
          width: 1200,
          height: 630,
          alt: currentSeo.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: currentSeo.title,
      description: currentSeo.description,
      images: [`${baseUrl}/images/hero-bg.png`],
    },
  };
}

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

  let bundle: Awaited<ReturnType<typeof fetchSiteBundle>> | null = null;
  try {
    bundle = await fetchSiteBundle(locale);
  } catch (err) {
    console.error("[layout] failed to fetch site bundle:", err);
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
