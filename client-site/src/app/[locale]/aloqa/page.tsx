import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isLocale, LOCALES } from "@/i18n/config"; // LOCALES qo'shildi
import { getDict } from "@/i18n/dictionaries";
import { fetchSiteBundle } from "@/lib/api";
import { PageHero } from "@/components/PageHero";
import { CtaBanner } from "@/components/CtaBanner";

const aloqaSeoData: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  uz: {
    title:
      "Sodiq School Aloqa – Toshkentdagi Xususiy Maktab Manzili va Telefonlari",
    description:
      "Sodiq School bilan bogʻlanish. Maktabimiz manzili, telefon raqamlari va maktabga bolani yozdirish uchun qabul boʻlimi kontaktlari.",
    keywords: [
      "sodiq school kontakt",
      "xususiy maktab manzil",
      "maktabga qabul 2026",
      "toshkent xususiy maktablari telefon",
      "bolani maktabga yozdirish",
    ],
  },
  ru: {
    title: "Контакты Sodiq School – Частная Школа в Ташкенте (Адрес и Телефон)",
    description:
      "Контакты частной школы Sodiq School в Ташкенте. Адрес школы, номера телефонов и информация, как записать ребенка в школу и связаться с приемной комиссией.",
    keywords: [
      "записать ребенка в школу",
      "частные школы ташкента",
      "адрес частной школы",
      "телефон школы",
      "прием в школу",
      "контакты sodiq school",
    ],
  },
  en: {
    title:
      "Contact Sodiq School – Private School in Tashkent (Address & Phone)",
    description:
      "Contact Sprivate School in Tashkent. Find our official address, phone numbers, and admissions office details to enroll your child today.",
    keywords: [
      "contact private school",
      "top schools in tashkent",
      "school admission office",
      "high school address",
      "enroll child in school",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  if (!isLocale(resolvedParams.locale)) return {};

  const locale = resolvedParams.locale || "uz";
  const currentSeo = aloqaSeoData[locale] || aloqaSeoData.uz;

  const baseUrl = "https://sodiqschool.uz/uz";
  const currentUrl = `${baseUrl}/${locale}/aloqa`;

  return {
    title: currentSeo.title,
    description: currentSeo.description,
    keywords: currentSeo.keywords,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },

    alternates: {
      canonical: currentUrl,
      languages: {
        "uz-UZ": `${baseUrl}/uz/aloqa`,
        "ru-RU": `${baseUrl}/ru/aloqa`,
        "en-US": `${baseUrl}/en/aloqa`,
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

// 3. Asosiy sahifa komponenti (Mantiq va JSX o'zgarishsiz qoldi)
export default async function AloqaPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolvedParams = await params;
  if (!isLocale(resolvedParams.locale)) notFound();
  const locale = resolvedParams.locale as Locale;
  const dict = getDict(locale);
  const bundle = await fetchSiteBundle(locale);
  const s = bundle.settings;

  const aloqaFaqs = bundle.faqs.filter(
    (f) => f.page === "aloqa" || f.page === "both",
  );

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s["aloqa.hero_eyebrow"] || dict.nav.contact}
        title={s["aloqa.hero_title"] || dict.nav.contact}
        lead={s["aloqa.hero_lead"]}
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
                <button className="faq-q" type="button">
                  {f.question}
                  <span className="icon">+</span>
                </button>
                <div className="faq-a">
                  <div
                    className="faq-a-inner"
                    dangerouslySetInnerHTML={{ __html: f.answer || "" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
