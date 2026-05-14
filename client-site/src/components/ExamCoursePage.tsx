import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { fetchSiteBundle, fetchExamCourseSections, resolveMediaUrl, API_BASE } from '@/lib/api';
import { CtaBanner } from './CtaBanner';

type Props = {
  locale: Locale;
  badge: 'IELTS' | 'SAT';
  pageTitle: string;
  pageDesc: string;
  stats: Array<{ num: string; label: string }>;
  ctaTitle: string;
};

export async function ExamCoursePage({
  locale, badge, pageTitle, pageDesc, stats, ctaTitle,
}: Props) {
  const dict = getDict(locale);
  const [bundle, sectionsResp] = await Promise.all([
    fetchSiteBundle(locale),
    fetchExamCourseSections(badge, locale),
  ]);
  const s = bundle.settings;
  const sections = sectionsResp.items;

  const logoUrl = `${API_BASE}/uploads/seed/${badge.toLowerCase()}-logo.png`;
  const themeClass = badge === 'SAT' ? 'md-page-logo--sat' : 'md-page-logo--ielts';

  return (
    <>
      <section className="md-page-hero">
        <div className="container">
          <div className="crumbs reveal">
            <Link href={`/${locale}`}>{dict.sections.crumb_home}</Link>
            <span className="sep">/</span>
            <Link href={`/${locale}/mashgulotlar`}>{dict.nav.lessons}</Link>
            <span className="sep">/</span>
            <span>{badge}</span>
          </div>
          <div className="md-page-hero-grid reveal delay-1">
            <div className="md-page-hero-info">
              <h1>{pageTitle}</h1>
              <p className="md-page-hero-desc">{pageDesc}</p>
              <div className="md-page-stats">
                {stats.map((st, i) => (
                  <div key={i} className="md-page-stat">
                    <div className="md-page-stat-num">{st.num}</div>
                    <div className="md-page-stat-label">{st.label}</div>
                  </div>
                ))}
              </div>
              <Link href={`/${locale}/aloqa`} className="btn btn-primary btn-large">Bepul konsultatsiya →</Link>
            </div>
            <div className={`md-page-logo-card ${themeClass}`}>
              <img src={logoUrl} alt={badge} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {sections.map((sec) => (
            <div key={sec.id} className={'md-section reveal' + (sec.is_reverse ? ' reverse' : '')}>
              <div className="md-section-text">
                <h2>{sec.title}</h2>
                <div dangerouslySetInnerHTML={{ __html: sec.body || '' }} />
              </div>
              {sec.image_url && (
                <img className="md-section-img" src={resolveMediaUrl(sec.image_url)} alt={sec.title} />
              )}
            </div>
          ))}
        </div>
      </section>

      <CtaBanner locale={locale} settings={s} variant="compact" customTitle={ctaTitle}
        customSubtitle="Raqamingizni qoldiring — biz 24 soat ichida bog'lanamiz." />
    </>
  );
}
