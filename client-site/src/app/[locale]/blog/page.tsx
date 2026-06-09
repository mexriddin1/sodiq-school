import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { isLocale, LOCALES } from "@/i18n/config"; // LOCALES qo'shildi
import { getDict } from "@/i18n/dictionaries";
import { fetchSiteBundle, resolveMediaUrl } from "@/lib/api";
import { PageHero } from "@/components/PageHero";
import { BlogSearch } from "@/components/BlogSearch";

// 1. Blog sahifasi uchun maxsus ko'p tilli SEO obyekti
const blogSeoData: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  uz: {
    title: "Sodiq School Blogi – Taʼlim Yangiliklari va Foydali Maqolalar",
    description:
      "Sodiq School taʼlim blogi. Maktab yoshidagi bolalar tarbiyasi, xalqaro imtihonlarga tayyorlanish sirlari va xususiy maktab hayotidan eng soʻnggi yangiliklar.",
    keywords: [
      "sodiq school blog",
      "maktab yangiliklari",
      "ta'limga oid maqolalar",
      "ielts va sat maslahatlar",
      "xususiy maktab hayoti",
      "ota-onalar uchun blog",
    ],
  },
  ru: {
    title: "Блог Sodiq School – Новости Образования и Полезные Статьи",
    description:
      "Полезный блог для родителей и школьников в Ташкенте. Статьи о подготовке к SAT и IELTS, советы по поступлению в зарубежные вузы и новости частной школы.",
    keywords: [
      "блог sodiq school",
      "новости образования",
      "статьи для родителей",
      "подготовка к sat",
      "подготовка к ielts",
      "поступление в зарубежные вузы",
      "частные школы ташкента",
    ],
  },
  en: {
    title: "Sodiq School Blog – Educational Insights & School News",
    description:
      "Sodiq School official blog. Read the latest news on high school education, practical tips for SAT/IELTS preparation, and university admission guides.",
    keywords: [
      "sodiq school blog",
      "education articles",
      "sat and ielts preparation tips",
      "study abroad guide",
      "private school news",
      "school education blog",
    ],
  },
};

// 2. Next.js standartiga mos mukammal dinamik SEO funksiyasi
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}): Promise<Metadata> {
  const resolvedParams = await params;
  if (!isLocale(resolvedParams.locale)) return {};

  const locale = resolvedParams.locale || "uz";
  const currentSeo = blogSeoData[locale] || blogSeoData.uz;

  const baseUrl = "https://sodiqschool.uz/uz";
  const currentUrl = `${baseUrl}/${locale}/blog`; // Yo'nalish aynan blog sahifasiga moslandi

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

    // To'g'ri Canonical URL va ko'p tilli muqobil havolalar
    alternates: {
      canonical: currentUrl,
      languages: {
        "uz-UZ": `${baseUrl}/uz/blog`,
        "ru-RU": `${baseUrl}/ru/blog`,
        "en-US": `${baseUrl}/en/blog`,
      },
    },

    // Ijtimoiy tarmoqlar (Open Graph) uchun meta ma'lumotlar
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
export default async function BlogIndex({
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

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s["blog.hero_eyebrow"] || dict.nav.blog}
        title={s["blog.hero_title"] || dict.nav.blog}
        lead={s["blog.hero_lead"]}
      />

      <section className="blog">
        <div className="container">
          <BlogSearch
            placeholder={
              dict.blog_search_placeholder || "Maqolalardan qidiring..."
            }
          />
          <div className="blog-grid">
            {bundle.blog_posts.map((p, i) => (
              <article
                key={p.id}
                className={`blog-card reveal${i % 3 ? " delay-" + (i % 3) : ""}`}
              >
                <div className="blog-img">
                  {p.image_url ? (
                    <img src={resolveMediaUrl(p.image_url)} alt={p.title} />
                  ) : (
                    <div
                      style={{
                        background: "var(--navy-10)",
                        width: "100%",
                        aspectRatio: "4/3",
                      }}
                    />
                  )}
                  {p.badge && <span className="badge">{p.badge}</span>}
                </div>
                <div className="blog-body">
                  <span className="blog-meta">{p.date_label}</span>
                  <h3>{p.title}</h3>
                  <Link
                    href={`/${locale}/blog/${p.slug}`}
                    className="text-link"
                  >
                    {dict.read_more}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
