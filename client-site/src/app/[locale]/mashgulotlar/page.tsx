import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { isLocale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { fetchSiteBundle, resolveMediaUrl, API_BASE } from '@/lib/api';
import { PageHero } from '@/components/PageHero';
import { CtaBanner } from '@/components/CtaBanner';
import { GraduationCap, Book, Sparkles } from '@/components/Icons';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getDict(params.locale as Locale);
  return { title: dict.meta.mash_title, description: dict.meta.mash_desc };
}

export default async function MashPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDict(locale);
  const bundle = await fetchSiteBundle(locale);
  const s = bundle.settings;

  // Map exam course badge to its detail page slug
  const examDetailSlug = (badge: string) =>
    badge?.toLowerCase() === 'sat' ? 'mashgulot-sat' : 'mashgulot-ielts';

  // Try to use the exam logo from settings (if seeded), or known seed paths.
  const examLogoUrl = (badge: string) => {
    const key = badge?.toLowerCase() === 'sat' ? 'sat-logo' : 'ielts-logo';
    return `${API_BASE}/uploads/seed/${key}.png`;
  };

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s['mash.hero_eyebrow'] || dict.nav.lessons}
        title={s['mash.hero_title'] || ''}
        lead={s['mash.hero_lead']}
      />

      {/* GRANT BANNER */}
      <section className="mash-grant-banner">
        <div className="container">
          <div className="grant-banner-inner reveal">
            {(bundle.about_stats || []).filter(st => st.page === 'mash_grant').map((st) => {
              const numeric = /^\d+(\.\d+)?$/.test(st.value);
              return (
                <div key={st.id} className="grant-stat">
                  <span className="grant-dollar">
                    {st.prefix}
                    {numeric ? <span className="cu" data-target={st.value}>0</span> : st.value}
                    {st.suffix}
                  </span>
                  <span className="grant-label">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IELTS & SAT */}
      <section className="mash-exams">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.mash_exam_eyebrow}</span>
            <h2>{dict.sections.mash_exam_title}</h2>
            <p className="lead" style={{ maxWidth: 700, margin: '0 auto' }}>{dict.sections.mash_exam_lead}</p>
          </div>
          <div className="mash-exam-grid">
            {bundle.exam_courses.map((c, i) => (
              <div key={c.id} className={`mash-exam-card reveal${i ? ' delay-' + i : ''}`} data-tilt>
                <div className={`mash-exam-header mash-exam-${c.theme}`}>
                  <img className="mash-exam-logo" src={examLogoUrl(c.badge)} alt={c.badge} height={40} />
                  <div className="mash-exam-score">
                    <span className="mash-score-label">{c.score_label}</span>
                    <span className="mash-score-num">{c.score_value}</span>
                  </div>
                </div>
                <div className="mash-exam-body">
                  <p dangerouslySetInnerHTML={{ __html: c.body || '' }} />
                  <ul className="mash-exam-facts">
                    {(c.facts || []).map((f, idx) => (
                      <li key={idx}><strong>{f.label}:</strong> {f.value}</li>
                    ))}
                  </ul>
                  <p className="mash-exam-note">{c.note}</p>
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <Link href={`/${locale}/${examDetailSlug(c.badge)}`} className="btn btn-primary">Batafsil →</Link>
                    <button type="button" className="btn btn-outline" style={{ borderColor: 'var(--navy-10)' }} data-popup-open>{c.cta_label}</button>
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
            <span className="eyebrow">{dict.sections.mash_subjects_eyebrow}</span>
            <h2>{dict.sections.mash_subjects_title}</h2>
          </div>
          <div className="mash-subjects-row">
            {bundle.lesson_subjects.map((sb, i) => (
              <div key={sb.id} className={`mash-subject-block reveal${i ? ' delay-' + i : ''}`}>
                <div className={`mash-subject-icon mash-icon-${sb.icon_key}`}>
                  {sb.icon_key === 'tarbiya' ? <Book /> : <GraduationCap />}
                </div>
                <h3>{sb.title}</h3>
                <div className="mash-tags">
                  {(sb.tags || []).map((tg) => <span key={tg} className="mash-tag">{tg}</span>)}
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
                className={`mash-extra-card${ex.image_url ? ' has-image' : ''} reveal${i ? ' delay-' + i : ''}`}
              >
                <div className="mash-extra-body">
                  <h3>{ex.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: ex.description || '' }} />
                </div>
                <div className="mash-extra-visual">
                  {ex.image_url
                    ? <img src={resolveMediaUrl(ex.image_url)} alt={ex.title} />
                    : (ex.icon_key === 'book' ? <Book /> : <Sparkles />)}
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
