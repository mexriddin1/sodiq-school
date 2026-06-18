import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isLocale, LOCALES } from "@/i18n/config"; // LOCALES qo'shildi
import { getDict } from "@/i18n/dictionaries";
import { fetchSiteBundle, resolveMediaUrl } from "@/lib/api";
import { PageHero } from "@/components/PageHero";
import { LogoCarousel } from "@/components/LogoCarousel";
import { CtaBanner } from "@/components/CtaBanner";

// 1. Natijalar sahifasi uchun maxsus ko'p tilli SEO obyekti
const resultsSeoData: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  uz: {
    title: "Sodiq School Natijalari – Yuqori IELTS va SAT Koʻrsatkichlari",
    description:
      "Oʻquvchilarimizning xalqaro imtihonlardagi muvaffaqiyatlari. Maktabimizdagi maktab yoshidagi oʻquvchilar uchun SAT va IELTS natijalari va yutuqlarimiz.",
    keywords: [
      "sodiq school natijalari",
      "ielts o'quvchilar uchun",
      "sat maktab o'quvchilari uchun",
      "xalqaro imtihon natijalari",
      "toshkent xususiy maktab yutuqlari",
    ],
  },
  ru: {
    title: "Результаты Sodiq School – Высокие Баллы по IELTS и SAT",
    description:
      "Достижения наших учеников. Высокие результаты и подготовка к SAT и IELTS для школьников в Ташкенте. Мы гордимся нашими выпускниками!",
    keywords: [
      "подготовка к sat",
      "подготовка к ielts",
      "sat ташкент",
      "sat в ташкенте",
      "sat курсы в ташкенте",
      "курсы sat в ташкенте",
      "sat для школьников",
      "ielts для школьников",
      "ielts в ташкенте",
      "ielts курсы ташкент",
      "курсы ielts в ташкенте",
    ],
  },
  en: {
    title: "Sodiq School Results – Outstanding IELTS and SAT Scores",
    description:
      "Academic achievements and student results at Sodiq School. Discover our high high school scores in international SAT and IELTS preparation in Tashkent.",
    keywords: [
      "sat preparation high school",
      "ielts scores students",
      "sat courses tashkent",
      "ielts for school students",
      "academic results uzbekistan",
      "student achievements",
    ],
  },
};

// 2. Next.js standartiga mos mukammal dinamik SEO generatsiyasi
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  if (!isLocale(resolvedParams.locale)) return {};

  const locale = resolvedParams.locale || "uz";
  const currentSeo = resultsSeoData[locale] || resultsSeoData.uz;

  const baseUrl = "https://sodiqschool.uz/uz";
  const currentUrl = `${baseUrl}/${locale}/natijalar`;

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

    // Tilga mos Canonical URL manzillari
    alternates: {
      canonical: currentUrl,
      languages: {
        "uz-UZ": `${baseUrl}/uz/natijalar`,
        "ru-RU": `${baseUrl}/ru/natijalar`,
        "en-US": `${baseUrl}/en/natijalar`,
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

export default async function NatijalarPage({
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

  const natijalarUnis = bundle.universities.filter(
    (u) => u.page === "natijalar" || u.page === "both",
  );

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s["natijalar.hero_eyebrow"] || dict.sections.results_eyebrow}
        title={s["natijalar.hero_title"] || dict.nav.results}
        lead={s["natijalar.hero_lead"]}
      />

      <section className="results-dark">
        <div className="container">
          <div className="nat-head reveal">
            <h2>{s["results_dark.title"]}</h2>
            <p>{s["results_dark.subtitle"]}</p>
          </div>

          <div className="stats-row reveal">
            {(bundle.about_stats || [])
              .filter((st) => st.page === "results")
              .map((st) => {
                const numeric = /^\d+(\.\d+)?$/.test(st.value);
                return (
                  <BigStat
                    key={st.id}
                    num={
                      <>
                        {st.prefix}
                        {numeric ? (
                          <span className="cu" data-target={st.value}>
                            0
                          </span>
                        ) : (
                          st.value
                        )}
                        {st.suffix && (
                          <span className="suffix">{st.suffix}</span>
                        )}
                      </>
                    }
                    lbl={st.label}
                    sub={st.sub || ""}
                  />
                );
              })}
          </div>

          <div className="tabs reveal" role="tablist">
            <button className="tab-btn active" data-tab="ielts">
              IELTS
            </button>
            <button className="tab-btn" data-tab="sat">
              SAT
            </button>
          </div>

          <div className="tab-panel active" id="tab-ielts">
            <div className="nat-grid">
              {bundle.exam_results.ielts.map((r, i) => (
                <div
                  key={r.id}
                  className={`nat-card reveal${i % 4 ? " delay-" + (i % 4) : ""}`}
                >
                  <div
                    className="nat-photo"
                    style={{
                      backgroundImage: `url('${resolveMediaUrl(r.image_url)}')`,
                    }}
                  ></div>
                  <div className="nat-name">{r.name}</div>
                  <div
                    className="nat-scores"
                    dangerouslySetInnerHTML={{
                      __html:
                        r.grade?.replace(
                          /(\d+\.?\d*)/g,
                          "<strong>$1</strong>",
                        ) || "",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="tab-panel" id="tab-sat">
            <div className="nat-grid">
              {bundle.exam_results.sat.map((r, i) => (
                <div
                  key={r.id}
                  className={`nat-card reveal${i % 4 ? " delay-" + (i % 4) : ""}`}
                >
                  <div
                    className="nat-photo"
                    style={{
                      backgroundImage: `url('${resolveMediaUrl(r.image_url)}')`,
                    }}
                  ></div>
                  <div className="nat-name">{r.name}</div>
                  <div
                    className="nat-scores"
                    dangerouslySetInnerHTML={{
                      __html:
                        r.grade?.replace(
                          /(\d+\.?\d*)/g,
                          "<strong>$1</strong>",
                        ) || "",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ALUMNI */}
      <section className="alumni">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">
              {dict.sections.natijalar_alumni_eyebrow}
            </span>
            <h2>{dict.sections.natijalar_alumni_title}</h2>
            <p className="sub">{dict.sections.natijalar_alumni_sub}</p>
          </div>
          <div className="alumni-grid">
            {bundle.alumni.map((a, i) => (
              <div
                key={a.id}
                className={`alumni-card reveal${i % 3 ? " delay-" + (i % 3) : ""}`}
              >
                <div
                  className="alumni-photo"
                  style={{
                    backgroundImage: `url('${resolveMediaUrl(a.image_url)}')`,
                  }}
                ></div>
                <div className="alumni-info">
                  <div className="name">{a.name}</div>
                  <div className="uni">{a.university}</div>
                  {a.major && <div className="major">{a.major}</div>}
                  <span className="ielts">{a.ielts_label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UNIVERSITIES — endi logo carousel */}
      <section className="unis">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">
              {dict.sections.universities_eyebrow}
            </span>
            <h2>{dict.sections.natijalar_uni_question}</h2>
          </div>
        </div>
        <LogoCarousel universities={natijalarUnis} />
        <div className="container">
          <p
            className="uni-bottom-stat reveal"
            dangerouslySetInnerHTML={{
              __html: s["natijalar.alumni_summary"] || "",
            }}
          />
        </div>
      </section>

      <CtaBanner locale={locale} settings={s} />
    </>
  );
}

function BigStat({
  num,
  lbl,
  sub,
}: {
  num: React.ReactNode;
  lbl: string;
  sub: string;
}) {
  return (
    <div className="stat-big">
      <div className="num">{num}</div>
      <div className="lbl">{lbl}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}
