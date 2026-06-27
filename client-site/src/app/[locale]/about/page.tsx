import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isLocale, LOCALES } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { fetchSiteBundle, resolveMediaUrl, API_BASE } from "@/lib/api";
import { PageHero } from "@/components/PageHero";
import { TestimonialVideos } from "@/components/TestimonialVideos";
import { CtaBanner } from "@/components/CtaBanner";

const aboutSeoData: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  uz: {
    title: "Sodiq School Haqida – Xalqaro Taʼlim Standartlari va Maqsadlar",
    description:
      "Sodiq School xususiy maktabi haqida. Bizning maqsadimiz – oʻquvchilarni xorijda oʻqish va dunyoning eng nufuzli chet el universitetlariga tayyorlashdir.",
    keywords: [
      "sodiq school haqida",
      "xalqaro ta'lim",
      "chet elda o'qish",
      "xorijiy universitetlarga tayyorlov",
      "toshkent xususiy maktablari",
      "maktab qadriyatlari",
    ],
  },
  ru: {
    title: "О школе Sodiq School – Международное Образование в Ташкенте",
    description:
      "Подробно о частной школе Sodiq School. Наша миссия — качественное обучение за рубежом, поступление в зарубежные вузы и подготовка к топ-университетам.",
    keywords: [
      "о школе sodiq school",
      "обучение за рубежом",
      "зарубежные вузы",
      "учеба за границей",
      "поступление за границу",
      "образование за рубежом",
      "подготовка в иностранный университет",
    ],
  },
  en: {
    title: "About Sodiq School – Elite International High School Tashkent",
    description:
      "Learn about Sodiq School. Discover our values, high academic standards, and professional preparation for admission to top international universities.",
    keywords: [
      "about sodiq school",
      "study abroad preparation",
      "foreign universities",
      "international education tashkent",
      "elite high school",
      "academic excellence uzbekistan",
    ],
  },
};

// Next.js 15 uchun params turi aniq Promise bo'lishi kerak
type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  if (!isLocale(resolvedParams.locale)) return {};

  const locale = resolvedParams.locale || "uz";
  const currentSeo = aboutSeoData[locale] || aboutSeoData.uz;

  // TUZATILDI: Domendagi ortiqcha "/uz" olib tashlandi
  const siteUrl = "https://sodiqschool.uz";
  const currentUrl = `${siteUrl}/${locale}/about`;

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
        // TUZATILDI: tillar havolalari to'g'rilandi
        "uz-UZ": `${siteUrl}/uz/about`,
        "ru-RU": `${siteUrl}/ru/about`,
        "en-US": `${siteUrl}/en/about`,
        "x-default": `${siteUrl}/uz/about`, // SEO Tavsiyasi
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
          url: `${siteUrl}/images/hero-bg.png`, // TO'G'RILANDI
          width: 1200,
          height: 630,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: currentSeo.title,
      description: currentSeo.description,
      images: [`${siteUrl}/images/hero-bg.png`], // TO'G'RILANDI
    },
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function AboutPage({ params }: Props) {
  const resolvedParams = await params;
  if (!isLocale(resolvedParams.locale)) notFound();

  const locale = resolvedParams.locale as Locale;
  const dict = getDict(locale);
  const bundle = await fetchSiteBundle(locale);
  const s = bundle.settings;

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s["about_page.hero_eyebrow"] || dict.nav.about}
        title={s["about_page.hero_title"] || ""}
        lead={s["about_page.hero_lead"] || ""}
      />

      {/* BIZ KIMMIZ */}
      <section className="about about-stacked" id="about">
        <div className="container">
          <div className="about-text">
            <span className="eyebrow">{s["about_home.eyebrow"]}</span>
            <h2>{s["about_home.title"]}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: s["about_home.body"] || "" }}
            />
          </div>
          <div className="about-card about-card-row">
            {(bundle.about_stats || [])
              .filter((st) => st.page === "about_about" || st.page === "both")
              .map((st) => {
                const numeric = /^\d+(\.\d+)?$/.test(st.value);
                return (
                  <div key={st.id} className="row">
                    <div className="val">
                      {st.prefix}
                      {numeric ? (
                        // TUZATILDI: SEO robotlari 0 ni emas, haqiqiy qiymatni o'qiydi
                        <span className="cu" data-target={st.value}>
                          {st.value}
                        </span>
                      ) : (
                        st.value
                      )}
                      {st.suffix}
                    </div>
                    <div className="lbl">{st.label}</div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission mission-v2">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-left reveal">
              <h2 className="mission-title">
                <span className="mission-title-brand">
                  {s["mission.title_brand"]}
                </span>{" "}
                <span className="mission-title-accent">
                  {s["mission.title_accent"]}
                </span>
              </h2>
              <div className="mission-card">
                <img
                  className="mission-target"
                  src={`${API_BASE}/uploads/seed/Mission/target.webp`}
                  alt=""
                  aria-hidden="true"
                />
                <div
                  className="mission-card-body"
                  dangerouslySetInnerHTML={{ __html: s["mission.quote"] || "" }}
                />
              </div>
            </div>
            <div className="mission-right reveal delay-1">
              <div className="mission-photo">
                <img
                  src={`${API_BASE}/uploads/seed/Mission/school-building.png`}
                  alt="Sodiq School"
                />
                <span
                  className="mission-corner mission-corner-tl"
                  aria-hidden="true"
                ></span>
                <span
                  className="mission-corner mission-corner-br"
                  aria-hidden="true"
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div className="mission-chevrons" aria-hidden="true"></div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.parents_say_eyebrow}</span>
            <h2>{dict.sections.parents_say_title}</h2>
          </div>
          <TestimonialVideos
            items={bundle.testimonial_videos}
            dict={{ left: dict.scroll_left, right: dict.scroll_right }}
          />
        </div>
      </section>

      {/* TEAM */}
      <section className="team" id="team">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.team_eyebrow}</span>
            <h2>{dict.sections.team_title}</h2>
            <p
              className="lead"
              style={{ maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}
            >
              {dict.sections.team_lead}
            </p>
          </div>
          <div className="team-row">
            {bundle.teachers.map((t, i) => (
              <Link
                key={t.id}
                href={`/${locale}/ustoz/${t.slug}`}
                className={`team-card reveal${i ? " delay-" + (i % 4) : ""}`}
              >
                <div
                  className="team-img"
                  style={{
                    backgroundImage: `url('${resolveMediaUrl(t.image_url)}')`,
                  }}
                ></div>
                <div className="team-info">
                  <div className="name">{t.name}</div>
                  <div className="role">{t.role}</div>
                  <span className="team-more">
                    {dict.sections.teacher_more}{" "}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="gallery">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.gallery_eyebrow}</span>
            <h2>{dict.sections.gallery_title}</h2>
          </div>
          <div className="masonry reveal delay-1">
            {bundle.gallery.map((g) => (
              <div
                key={g.id}
                className={`tile ${g.size_class || ""}`.trim()}
                style={
                  g.image_url
                    ? {
                        backgroundImage: `url('${resolveMediaUrl(g.image_url)}')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                {!g.image_url && <div className="glyph">S</div>}
                <div className="overlay">{g.caption}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <CtaBanner locale={locale} settings={s} />
    </>
  );
}
