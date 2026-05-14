import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { isLocale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { fetchSiteBundle, resolveMediaUrl } from '@/lib/api';
import { PageHero } from '@/components/PageHero';
import { LogoCarousel } from '@/components/LogoCarousel';
import { CtaBanner } from '@/components/CtaBanner';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getDict(params.locale as Locale);
  return { title: dict.meta.natijalar_title, description: dict.meta.natijalar_desc };
}

export default async function NatijalarPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDict(locale);
  const bundle = await fetchSiteBundle(locale);
  const s = bundle.settings;

  const natijalarUnis = bundle.universities.filter(u => u.page === 'natijalar' || u.page === 'both');

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s['natijalar.hero_eyebrow'] || dict.sections.results_eyebrow}
        title={s['natijalar.hero_title'] || dict.nav.results}
        lead={s['natijalar.hero_lead']}
      />

      <section className="results-dark">
        <div className="container">
          <div className="nat-head reveal">
            <h2>{s['results_dark.title']}</h2>
            <p>{s['results_dark.subtitle']}</p>
          </div>

          <div className="stats-row reveal">
            {(bundle.about_stats || []).filter(st => st.page === 'results').map((st) => {
              const numeric = /^\d+(\.\d+)?$/.test(st.value);
              return (
                <BigStat
                  key={st.id}
                  num={<>{st.prefix}{numeric ? <span className="cu" data-target={st.value}>0</span> : st.value}{st.suffix && <span className="suffix">{st.suffix}</span>}</>}
                  lbl={st.label}
                  sub={st.sub || ''}
                />
              );
            })}
          </div>

          <div className="tabs reveal" role="tablist">
            <button className="tab-btn active" data-tab="ielts">IELTS</button>
            <button className="tab-btn" data-tab="sat">SAT</button>
          </div>

          <div className="tab-panel active" id="tab-ielts">
            <div className="nat-grid">
              {bundle.exam_results.ielts.map((r, i) => (
                <div key={r.id} className={`nat-card reveal${i % 4 ? ' delay-' + (i % 4) : ''}`}>
                  <div className="nat-photo" style={{ backgroundImage: `url('${resolveMediaUrl(r.image_url)}')` }}></div>
                  <div className="nat-name">{r.name}</div>
                  <div className="nat-scores" dangerouslySetInnerHTML={{ __html: r.grade?.replace(/(\d+\.?\d*)/g, '<strong>$1</strong>') || '' }} />
                </div>
              ))}
            </div>
          </div>
          <div className="tab-panel" id="tab-sat">
            <div className="nat-grid">
              {bundle.exam_results.sat.map((r, i) => (
                <div key={r.id} className={`nat-card reveal${i % 4 ? ' delay-' + (i % 4) : ''}`}>
                  <div className="nat-photo" style={{ backgroundImage: `url('${resolveMediaUrl(r.image_url)}')` }}></div>
                  <div className="nat-name">{r.name}</div>
                  <div className="nat-scores" dangerouslySetInnerHTML={{ __html: r.grade?.replace(/(\d+\.?\d*)/g, '<strong>$1</strong>') || '' }} />
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
            <span className="eyebrow">{dict.sections.natijalar_alumni_eyebrow}</span>
            <h2>{dict.sections.natijalar_alumni_title}</h2>
            <p className="sub">{dict.sections.natijalar_alumni_sub}</p>
          </div>
          <div className="alumni-grid">
            {bundle.alumni.map((a, i) => (
              <div key={a.id} className={`alumni-card reveal${i % 3 ? ' delay-' + (i % 3) : ''}`}>
                <div className="alumni-photo" style={{ backgroundImage: `url('${resolveMediaUrl(a.image_url)}')` }}></div>
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
            <span className="eyebrow">{dict.sections.universities_eyebrow}</span>
            <h2>{dict.sections.natijalar_uni_question}</h2>
          </div>
        </div>
        <LogoCarousel universities={natijalarUnis} />
        <div className="container">
          <p className="uni-bottom-stat reveal" dangerouslySetInnerHTML={{ __html: s['natijalar.alumni_summary'] || '' }} />
        </div>
      </section>

      <CtaBanner locale={locale} settings={s} showMap={false} />
    </>
  );
}

function BigStat({ num, lbl, sub }: { num: React.ReactNode; lbl: string; sub: string }) {
  return (
    <div className="stat-big">
      <div className="num">{num}</div>
      <div className="lbl">{lbl}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}
