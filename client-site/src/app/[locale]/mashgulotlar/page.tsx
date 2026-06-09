import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isLocale, LOCALES } from "@/i18n/config"; // LOCALES qo'shildi
import { getDict } from "@/i18n/dictionaries";
import { fetchSiteBundle, resolveMediaUrl, API_BASE } from "@/lib/api";
import { PageHero } from "@/components/PageHero";
import { CtaBanner } from "@/components/CtaBanner";
import { GraduationCap, Book, Sparkles } from "@/components/Icons";

const mashgulotlarSeoData: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  uz: {
    title: "Sodiq School Mashgʻulotlari – Chuqurlashtirilgan Fanlar va Kurslar",
    description:
      "Maktabimizdagi darslar va toʻgaraklar. Matematika fanidan imtihonlarga tayyorlov, oʻquvchilar uchun haftalik qiziqarli mashgʻulotlar va til kurslari.",
    keywords: [
      "sodiq school mashg'ulotlari",
      "maktab darslari",
      "matematika imtihon",
      "xususiy maktab to'garaklari",
      "chuqurlashtirilgan matematika",
      "ingliz tili darslari",
    ],
  },
  ru: {
    title: "Занятия в Sodiq School – Учебная Программа и Предметы",
    description:
      "Уникальная программа занятий в Sodiq School. Продвинутая математика, интенсивные уроки и эффективная подготовка к вступительным экзаменам в школу.",
    keywords: [
      "занятия в школе",
      "вступительные экзамены по математике",
      "уроки математики",
      "подготовка к вступительным экзаменам",
      "учебная программа xususiy maktab",
      "уроки английского для школьников",
    ],
  },
  en: {
    title: "Sodiq School Classes – Advanced Curriculum & Activities",
    description:
      "Discover educational classes and school activities at Sodiq School. Advanced mathematics courses and intensive entry exam preparation for high school.",
    keywords: [
      "high school classes",
      "advanced mathematics course",
      "school exam preparation",
      "secondary school curriculum",
      "academic lessons tashkent",
      "english classes",
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
  const currentSeo = mashgulotlarSeoData[locale] || mashgulotlarSeoData.uz;

  const baseUrl = "https://sodiqschool.uz/uz";
  const currentUrl = `${baseUrl}/${locale}/mashgulotlar`;

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
        "uz-UZ": `${baseUrl}/uz/mashgulotlar`,
        "ru-RU": `${baseUrl}/ru/mashgulotlar`,
        "en-US": `${baseUrl}/en/mashgulotlar`,
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

export default async function MashPage({
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

  // Map exam course badge to its detail page slug
  const examDetailSlug = (badge: string) =>
    badge?.toLowerCase() === "sat" ? "mashgulot-sat" : "mashgulot-ielts";

  // Try to use the exam logo from settings (if seeded), or known seed paths.
  const examLogoUrl = (badge: string) => {
    const key = badge?.toLowerCase() === "sat" ? "sat-logo" : "ielts-logo";
    return `${API_BASE}/uploads/seed/${key}.png`;
  };

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s["mash.hero_eyebrow"] || dict.nav.lessons}
        title={s["mash.hero_title"] || ""}
        lead={s["mash.hero_lead"]}
      />

      {/* GRANT BANNER */}
      <section className="mash-grant-banner">
        <div className="container">
          <div className="grant-banner-inner reveal">
            {(bundle.about_stats || [])
              .filter((st) => st.page === "mash_grant")
              .map((st) => {
                const numeric = /^\d+(\.\d+)?$/.test(st.value);
                return (
                  <div key={st.id} className="grant-stat">
                    <span className="grant-dollar">
                      {st.prefix}
                      {numeric ? (
                        <span className="cu" data-target={st.value}>
                          0
                        </span>
                      ) : (
                        st.value
                      )}
                      {st.suffix}
                    </span>
                    <span className="grant-label">{st.label}</span>
                  </div>
                );
              })}
          </div>
          <p className="grant-desc reveal">{dict.sections.mash_grant_desc}</p>
        </div>
      </section>

      {/* IELTS & SAT */}
      <section className="mash-exams">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.mash_exam_eyebrow}</span>
            <h2>{dict.sections.mash_exam_title}</h2>
            <p className="lead" style={{ maxWidth: 700, margin: "0 auto" }}>
              {dict.sections.mash_exam_lead}
            </p>
          </div>
          <div className="mash-exam-grid">
            {bundle.exam_courses.map((c, i) => (
              <div
                key={c.id}
                className={`mash-exam-card reveal${i ? " delay-" + i : ""}`}
                data-tilt
              >
                <div className={`mash-exam-header mash-exam-${c.theme}`}>
                  <img
                    className="mash-exam-logo"
                    src={examLogoUrl(c.badge)}
                    alt={c.badge}
                    height={40}
                  />
                  <div className="mash-exam-score">
                    <span className="mash-score-label">{c.score_label}</span>
                    <span className="mash-score-num">{c.score_value}</span>
                  </div>
                </div>
                <div className="mash-exam-body">
                  <p dangerouslySetInnerHTML={{ __html: c.body || "" }} />
                  <ul className="mash-exam-facts">
                    {(c.facts || []).map((f, idx) => (
                      <li key={idx}>
                        <strong>{f.label}:</strong> {f.value}
                      </li>
                    ))}
                  </ul>
                  <p className="mash-exam-note">{c.note}</p>
                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <Link
                      href={`/${locale}/${examDetailSlug(c.badge)}`}
                      className="btn btn-primary"
                    >
                      Batafsil →
                    </Link>
                    <Link
                      href={`/${locale}/aloqa`}
                      className="btn btn-outline"
                      style={{ borderColor: "var(--navy-10)" }}
                    >
                      {c.cta_label}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="mash-subjects">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">
              {dict.sections.mash_subjects_eyebrow}
            </span>
            <h2>{dict.sections.mash_subjects_title}</h2>
          </div>
          <div className="mash-subjects-row">
            {bundle.lesson_subjects.map((sb, i) => (
              <div
                key={sb.id}
                className={`mash-subject-block reveal${i ? " delay-" + i : ""}`}
              >
                <div className={`mash-subject-icon mash-icon-${sb.icon_key}`}>
                  {sb.icon_key === "tarbiya" ? <Book /> : <GraduationCap />}
                </div>
                <h3>{sb.title}</h3>
                <div className="mash-tags">
                  {(sb.tags || []).map((tg) => (
                    <span key={tg} className="mash-tag">
                      {tg}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXTRAS */}
      <section className="mash-extra">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.mash_extra_eyebrow}</span>
            <h2>{dict.sections.mash_extra_title}</h2>
          </div>
          <div className="mash-extra-grid">
            {bundle.lesson_extras.map((ex, i) => (
              <div
                key={ex.id}
                className={`mash-extra-card${ex.image_url ? " has-image" : ""} reveal${i ? " delay-" + i : ""}`}
              >
                <div className="mash-extra-body">
                  <h3>{ex.title}</h3>
                  <p
                    dangerouslySetInnerHTML={{ __html: ex.description || "" }}
                  />
                  {ex.link_url && (
                    <a
                      href={ex.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link"
                    >
                      {ex.link_label || dict.see_video}
                    </a>
                  )}
                </div>
                <div className="mash-extra-visual">
                  {ex.image_url ? (
                    <img src={resolveMediaUrl(ex.image_url)} alt={ex.title} />
                  ) : ex.icon_key === "book" ? (
                    <Book />
                  ) : (
                    <Sparkles />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner locale={locale} settings={s} />
    </>
  );
}
