import type { Metadata } from 'next';
import type React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { isLocale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { fetchSiteBundle, resolveMediaUrl, API_BASE } from '@/lib/api';
import { TestimonialVideos } from '@/components/TestimonialVideos';
import { LogoCarousel } from '@/components/LogoCarousel';
import { ImgCarousel } from '@/components/ImgCarousel';
import { CtaBanner } from '@/components/CtaBanner';
import { GraduationCap, Bars, People, Document, Building } from '@/components/Icons';
import { getYouTubeEmbedUrl, isDirectVideoUrl } from '@/lib/video';

const advIconMap: Record<string, React.ComponentType> = {
  graduation: GraduationCap,
  bars: Bars,
  people: People,
  document: Document,
  building: Building,
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getDict(params.locale as Locale);
  return { title: dict.meta.home_title, description: dict.meta.home_desc };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  return HomeContent({ params });
}

const examLandingAdvantages = [
  {
    accent: '1',
    icon: 'document',
    title: '1-IYUL IMTIHONI: Biz maktab baholariga aldanib qolmayapmizmi?',
    body: "Ba'zan kundalikdagi besh baholar ortiga bolaning haqiqiy bilimi yashirinib qoladi. Biz xotirjam yuraveramiz, lekin vaqt o'tib borsa-da, bo'shliqlar to'lmay qolaveradi. 1-iyul kungi imtihon esa shunchaki sinov emas — bu farzandingizning bugungi kungi real darajasini ko'rsatadigan ko'zgu.",
  },
  {
    accent: '2',
    icon: 'bars',
    title: 'Real manzara',
    body: "Kundalikdagi baholar ba'zan andisha ortiga berkinadi. Imtihon esa hech qanday pardasiz bolaning haqiqiy bilimini ko'rsatadi. Qaysi fanda peshqadam-u, qaysi mavzuda ko'makka muhtoj — bor haqiqat bilan yuzma-yuz kelasiz.",
  },
  {
    accent: '3',
    icon: 'graduation',
    title: 'Vaqtni tejash',
    body: "Bola nimani bilmasligini aniqlash uchun oylab vaqt yo'qotmaysiz. Yangi o'quv yilida aynan qaysi bo'shliqlarni to'ldirish kerakligi ochiq-oydin ko'rinadi. Adashib sarflanadigan vaqt va ortiqcha xarajatlar tejaladi.",
  },
  {
    accent: '4',
    icon: 'people',
    title: "To'g'ri qaror",
    body: "Farzandingiz kelajagini taxminlarga qarab emas, aniq faktlarga tayanib rejalashtirasiz. Bu esa uni kelajakda noto'g'ri yo'nalish tanlashdan asraydi.",
  },
];

type HomeVariant = 'default' | 'exam-1july';

export async function HomeContent({
  params,
  variant = 'default',
}: {
  params: { locale: string };
  variant?: HomeVariant;
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDict(locale);
  const bundle = await fetchSiteBundle(locale);
  const s = bundle.settings;
  const phone = s['contact.phone'] || '+998 78 888 80 80';
  const phoneLink = s['contact.phone_link'] || phone.replace(/\D/g, '');
  const isExamLanding = variant === 'exam-1july';
  const hero = isExamLanding
    ? {
        pill: '1-iyul imtihoni',
        title: <>Farzandingiz bilimini sinang</>,
        lead: 'Sodiq School da 2026-2027 BEPUL qabul imtixoniga farzandingizni yozdiring va farzandingiz aniq bilimini bilib oling.',
        cta: 'Ariza qoldirish',
      }
    : {
        pill: s['hero.pill'],
        title: <>{s['hero.title_main']} <span className="accent">{s['hero.title_accent']}</span> {s['hero.title_suffix']}</>,
        lead: s['hero.lead'] || '',
        cta: s['hero.cta_primary'],
      };

  const indexUnis = bundle.universities.filter(u => u.page === 'index' || u.page === 'both');
  const indexFaqs = bundle.faqs.filter(f => f.page === 'index' || f.page === 'both');
  const pricingPlans = (bundle.pricing_plans || []).length
    ? bundle.pricing_plans
    : [{
        id: 0,
        amount: s['pricing.amount'] || '',
        currency: s['pricing.currency'] || '',
        is_featured: 1,
        sort_order: 0,
        label: s['pricing.label'] || '',
        note: s['pricing.note'] || '',
        includes: s['pricing.includes'] || '',
        cta_label: s['pricing.cta'] || dict.cta_apply,
      }];
  const advantages = isExamLanding
    ? examLandingAdvantages.map((a, index) => ({
        id: index + 1,
        accent_num: a.accent,
        icon_key: a.icon,
        title: a.title,
        description: a.body,
      }))
    : (bundle.advantages || []);
  const ctaSettings = isExamLanding
    ? Object.fromEntries(Object.entries(s).filter(([key]) => key.startsWith('contact.')))
    : s;

  return (
    <>
      {/* HERO */}
      <section className="hero" id="top">
        <div className="container hero-inner">
          <span className="pill reveal"><span className="dot"></span>{hero.pill}</span>
          <h1 className="reveal delay-1">
            {hero.title}
          </h1>
          <p className="lead reveal delay-2" dangerouslySetInnerHTML={{ __html: hero.lead }} />
          <div className="hero-actions reveal delay-3">
            <button type="button" className="btn btn-primary btn-large" data-popup-open>{hero.cta}</button>
            {!isExamLanding && <a href="#results" className="text-link on-dark">{s['hero.cta_secondary']}</a>}
          </div>
          <div className="hero-stats reveal delay-4">
            <HeroStat
              num={<><span className="cu" data-target={s['hero.stat_students_value'] || '450'}>0</span>{s['hero.stat_students_suffix'] || '+'}</>}
              lbl={s['hero.stat_students_label']} sub={s['hero.stat_students_sub']} />
            <HeroStat
              num={<>$<span className="cu" data-target={s['hero.stat_grants_value'] || '20'}>0</span>M+</>}
              lbl={s['hero.stat_grants_label']} sub={s['hero.stat_grants_sub']} />
            <HeroStat
              num={<>~<span className="cu" data-target={s['hero.stat_abroad_value'] || '100'}>0</span></>}
              lbl={s['hero.stat_abroad_label']} sub={s['hero.stat_abroad_sub']} />
            <HeroStat
              num={<><span className="cu" data-target={s['hero.stat_ielts_value'] || '7.5'}>0</span></>}
              lbl={s['hero.stat_ielts_label']} sub={s['hero.stat_ielts_sub']} />
            <HeroStat num={<><span className="cu" data-target={s['hero.stat_sat_value'] || '1400'}>0</span></>} lbl={s['hero.stat_sat_label']} sub={s['hero.stat_sat_sub']} />
          </div>
        </div>
      </section>

      {/* BIZ KIMMIZ */}
      <section className="about about-stacked" id="about">
        <div className="container">
          <div className="about-text">
            <span className="eyebrow">{s['about_home.eyebrow']}</span>
            <h2>{s['about_home.title']}</h2>
            <div dangerouslySetInnerHTML={{ __html: s['about_home.body'] || '' }} />
            <Link href={`/${locale}/about`} className="text-link">{dict.read_more}</Link>
          </div>
          <div className="about-card about-card-row">
            {(bundle.about_stats || []).filter(st => st.page === 'home_about' || st.page === 'both').map((st) => {
              const numeric = /^\d+(\.\d+)?$/.test(st.value);
              return (
                <div key={st.id} className="row">
                  <div className="val">
                    {st.prefix}
                    {numeric ? <span className="cu" data-target={st.value}>0</span> : st.value}
                    {st.suffix}
                  </div>
                  <div className="lbl">{st.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSIYA — 2 ustunli yangi struktura */}
      {!isExamLanding && (
        <>
      <section className="mission mission-v2">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-left reveal">
              <h2 className="mission-title">
                <span className="mission-title-brand">{s['mission.title_brand']}</span>
                <span className="mission-title-accent">{s['mission.title_accent']}</span>
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
                  dangerouslySetInnerHTML={{ __html: s['mission.quote'] || '' }}
                />
              </div>
            </div>
            <div className="mission-right reveal delay-1">
              <div className="mission-photo">
                <img
                  src={`${API_BASE}/uploads/seed/Mission/school-building.png`}
                  alt="Sodiq School"
                />
                <span className="mission-corner mission-corner-tl" aria-hidden="true"></span>
                <span className="mission-corner mission-corner-br" aria-hidden="true"></span>
              </div>
            </div>
          </div>
        </div>
        <div className="mission-chevrons" aria-hidden="true"></div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials video-testimonials-section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.parents_say_eyebrow}</span>
            <h2>{dict.sections.parents_say_title}</h2>
          </div>
          <TestimonialVideos items={bundle.testimonial_videos} dict={{ left: dict.scroll_left, right: dict.scroll_right }} />
        </div>
      </section>

      {/* TOP STUDENTS */}
      <section className="top-students">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.top_students_eyebrow}</span>
            <h2>{dict.sections.top_students_title}</h2>
          </div>
          <div className="top-students-grid">
            {bundle.top_students.map((t, i) => (
              <div key={t.id} className={`top-student-card reveal${i ? ' delay-' + Math.min(i, 3) : ''}`} data-tilt>
                <div className="top-student-img" style={{ backgroundImage: `url('${resolveMediaUrl(t.image_url)}')` }}>
                  <div className="top-student-grant glow">{t.grant_label}</div>
                </div>
                <div className="top-student-body">
                  <div className="top-student-uni">{t.university}</div>
                  <div className="top-student-name">{t.name}</div>
                  <p>{t.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="results-cta reveal">
            <Link href={`/${locale}/natijalar`} className="btn btn-outline">{dict.sections.all_results}</Link>
          </div>
        </div>
      </section>

      {/* RESULTS-DARK (yangi struktura: nat-grid) */}
      <section className="results-dark" id="results">
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
                <NatCard key={r.id} r={r} delay={i % 4} />
              ))}
            </div>
          </div>
          <div className="tab-panel" id="tab-sat">
            <div className="nat-grid">
              {bundle.exam_results.sat.map((r, i) => (
                <NatCard key={r.id} r={r} delay={i % 4} />
              ))}
            </div>
          </div>
          <div className="results-cta reveal">
            <Link href={`/${locale}/natijalar`} className="btn btn-outline">{dict.sections.all_results}</Link>
          </div>
        </div>
      </section>

      {/* UNIVERSITIES — endi logo carousel */}
      <section className="unis">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.universities_eyebrow}</span>
            <h2>{dict.sections.universities_title}</h2>
          </div>
        </div>
        <LogoCarousel universities={indexUnis} />
        <div className="container">
          <p className="uni-bottom-stat reveal" dangerouslySetInnerHTML={{ __html: dict.sections.bottom_stat_template }} />
        </div>
      </section>

      {/* AWARDS — yangi: image bilan, orbs bilan, summary bilan */}
      <section className="awards" id="awards">
        <div className="awards-bg">
          <div className="awards-orb awards-orb-1"></div>
          <div className="awards-orb awards-orb-2"></div>
          <div className="awards-orb awards-orb-3"></div>
        </div>
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow" style={{ color: 'var(--orange)' }}>{dict.sections.awards_eyebrow}</span>
            <h2 style={{ color: '#fff' }}>{dict.sections.awards_title}</h2>
            <p className="sub" style={{ color: 'rgba(255,255,255,.55)' }}>{s['awards.subtitle']}</p>
          </div>
          <div className="awards-grid">
            {bundle.awards.map((a, i) => {
              const youtubeEmbedUrl = getYouTubeEmbedUrl(a.video_url);
              const directVideo = isDirectVideoUrl(a.video_url);
              const image = a.image_url
                ? <img src={resolveMediaUrl(a.image_url)} alt={a.title} />
                : <div style={{ background: 'var(--navy)', width: '100%', height: '100%' }} />;
              return (
              <div key={a.id} className={`award-card reveal${i ? ' delay-' + i : ''}`} data-tilt>
                <div className="award-shimmer"></div>
                <div className={'award-media' + (a.video_url ? ' has-video' : '')}>
                  {youtubeEmbedUrl ? (
                    <iframe
                      src={youtubeEmbedUrl}
                      title={a.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : directVideo && a.video_url ? (
                    <video controls preload="metadata" poster={resolveMediaUrl(a.image_url)}>
                      <source src={resolveMediaUrl(a.video_url)} />
                    </video>
                  ) : a.video_url ? (
                    <a href={a.video_url} target="_blank" rel="noopener noreferrer" className="award-media-link" aria-label={a.title}>
                      {image}
                      <div className="award-play">
                        <svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </a>
                  ) : (
                    image
                  )}
                </div>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
                <div className="award-medals">
                  {a.gold_count > 0 && (
                    <div className="medal-badge gold">
                      <span className="medal-num cu" data-target={a.gold_count}>0</span>
                      <span className="medal-label">{a.gold_label}</span>
                    </div>
                  )}
                  {a.silver_count > 0 && (
                    <div className="medal-badge silver">
                      <span className="medal-num cu" data-target={a.silver_count}>0</span>
                      <span className="medal-label">{a.silver_label}</span>
                    </div>
                  )}
                  {a.bronze_count > 0 && (
                    <div className="medal-badge bronze">
                      <span className="medal-num cu" data-target={a.bronze_count}>0</span>
                      <span className="medal-label">{a.bronze_label}</span>
                    </div>
                  )}
                </div>
                <div className="award-total" dangerouslySetInnerHTML={{ __html: a.total_label || '' }} />
              </div>
            );
            })}
          </div>

          <div className="awards-summary reveal">
            <div className="awards-summary-item">
              <span className="awards-summary-num cu" data-target="111">0</span>
              <span className="awards-summary-label">{s['awards.summary_total_label']}</span>
            </div>
            <div className="awards-summary-divider"></div>
            <div className="awards-summary-item">
              <span className="awards-summary-num cu" data-target="3">0</span>
              <span className="awards-summary-label">{s['awards.summary_competitions_label']}</span>
            </div>
            <div className="awards-summary-divider"></div>
            <div className="awards-summary-item">
              <span className="awards-summary-num cu" data-target="35">0</span>
              <span className="awards-summary-label">{s['awards.summary_winners_label']}</span>
            </div>
          </div>
        </div>
      </section>

        </>
      )}

      {!isExamLanding && (
        <>
          {/* IMAGE CAROUSEL */}
          <ImgCarousel items={bundle.carousel} />
        </>
      )}

      {/* ADVANTAGES */}
      <section className="advantages">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.advantages_eyebrow}</span>
            <h2>{isExamLanding ? 'Sodiq school imtixonida farzandingiz bilimini sinang' : dict.sections.advantages_title}</h2>
          </div>
          <div className="advantages-grid">
            {advantages.map((a) => (
              <AdvCard
                key={a.id}
                accent={String(a.accent_num || 1)}
                Icon={advIconMap[a.icon_key] || GraduationCap}
                title={a.title}
                body={a.description || ''}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — yangi section */}
      {!isExamLanding && (
        <>
      <section className="pricing" id="narx">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{s['pricing.eyebrow']}</span>
            <h2>{s['pricing.title']}</h2>
          </div>
          <div className={`pricing-grid pricing-count-${pricingPlans.length} reveal delay-1`}>
            {pricingPlans.map((p) => {
              const includes = (p.includes || '').split('|').map((x) => x.trim()).filter(Boolean);
              return (
                <div key={p.id} className={`pricing-card${p.is_featured ? ' is-featured' : ''}`}>
                  <span className="pricing-label">{p.label}</span>
                  <div className="pricing-amount">{p.amount} <span>{p.currency}</span></div>
                  {p.note && <p className="pricing-note">{p.note}</p>}
                  <div className="pricing-includes">
                    {includes.map((inc) => (
                      <div key={inc} className="pricing-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                        {inc}
                      </div>
                    ))}
                  </div>
                  <button type="button" className="btn btn-primary btn-large" data-popup-open>{p.cta_label || dict.cta_apply}</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ADMISSIONS — yangi 3 ustun struktura */}
      <section className="admissions" id="qabul">
        <div className="container">
          <div className="adm-header reveal">
            <span className="eyebrow">{s['admissions.eyebrow']}</span>
            <h2 dangerouslySetInnerHTML={{ __html: s['admissions.title']?.replace(' kelajak', '<br/>kelajak') || '' }} />
            <p className="adm-desc" dangerouslySetInnerHTML={{ __html: s['admissions.desc'] || '' }} />
          </div>

          <div className="adm-cols">
            <div className="adm-col-steps reveal">
              <h3 className="adm-col-title">{s['admissions.process_title']}</h3>
              <div className="adm-timeline">
                <AdmStep n={1} lbl={s['admissions.step1_label']} desc={s['admissions.step1_desc']} hasLine />
                <AdmStep n={2} lbl={s['admissions.step2_label']} desc={s['admissions.step2_desc']} hasLine />
                <AdmStep n={3} lbl={s['admissions.step3_label']} desc={s['admissions.step3_desc']} />
              </div>
            </div>

            <div className="adm-col-exam reveal delay-1">
              <h3 className="adm-col-title">{s['admissions.exams_title']}</h3>
              <div className="adm-tests">
                <TestCard nm={s['admissions.test1_name']} sub={s['admissions.test1_sub']}
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16v16H4z"/><path d="M9 9h6M9 13h6M9 17h3"/></svg>} />
                <TestCard nm={s['admissions.test2_name']} sub={s['admissions.test2_sub']}
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>} />
                <TestCard nm={s['admissions.test3_name']} sub={s['admissions.test3_sub']}
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 5h18M3 12h18M3 19h12"/></svg>} />
              </div>
            </div>

            <div className="adm-col-info reveal delay-2">
              <h3 className="adm-col-title">{s['admissions.info_title']}</h3>
              <div className="adm-info-list">
                <AdmInfoItem label={s['admissions.info1_label']} value={s['admissions.info1_value']} />
                <AdmInfoItem label={s['admissions.info2_label']} value={s['admissions.info2_value']} />
                <AdmInfoItem label={s['admissions.info3_label']} value={s['admissions.info3_value']} />
              </div>
              <button type="button" className="btn btn-primary btn-large btn-block" data-popup-open>{s['admissions.register']}</button>
              <p className="adm-secondary">{s['admissions.secondary']} <a href={`tel:${phoneLink}`}>{phone}</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.sections.faq_eyebrow}</span>
            <h2>{dict.sections.faq_title}</h2>
          </div>
          <div className="faq-list reveal delay-1" id="faqList">
            {indexFaqs.map((f) => (
              <div key={f.id} className="faq-item">
                <button className="faq-q" type="button">{f.question}<span className="icon">+</span></button>
                <div className="faq-a"><div className="faq-a-inner" dangerouslySetInnerHTML={{ __html: f.answer || '' }} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

        </>
      )}

      {/* CTA BANNER */}
      <CtaBanner locale={locale} settings={ctaSettings} />
    </>
  );
}

function HeroStat({ num, lbl, sub }: { num: React.ReactNode; lbl: string; sub: string }) {
  return (
    <div className="hero-stat">
      <div className="num">{num}</div>
      <div className="lbl">{lbl}</div>
      <div className="sub">{sub}</div>
    </div>
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

function NatCard({ r, delay }: { r: { id: number; image_url: string | null; name: string; grade: string }; delay: number }) {
  return (
    <div className={`nat-card reveal${delay ? ' delay-' + delay : ''}`}>
      <div className="nat-photo" style={{ backgroundImage: `url('${resolveMediaUrl(r.image_url)}')` }}></div>
      <div className="nat-name">{r.name}</div>
      <div className="nat-scores" dangerouslySetInnerHTML={{ __html: r.grade?.replace(/(\d+\.?\d*)/g, '<strong>$1</strong>') || '' }} />
    </div>
  );
}

function AdvCard({ accent, Icon, title, body }: { accent: string; Icon: any; title: string; body: string }) {
  return (
    <div className={`adv-card adv-accent-${accent} reveal`}>
      <div className="adv-icon"><Icon /></div>
      <h3>{title}</h3>
      <p dangerouslySetInnerHTML={{ __html: body }} />
    </div>
  );
}

function AdmStep({ n, lbl, desc, hasLine }: { n: number; lbl: string; desc: string; hasLine?: boolean }) {
  return (
    <div className="adm-step">
      <div className="adm-step-marker">
        <span className="n">{n}</span>
        {hasLine && <span className="adm-step-line"></span>}
      </div>
      <div className="adm-step-content">
        <span className="lbl">{lbl}</span>
        <span className="step-desc">{desc}</span>
      </div>
    </div>
  );
}

function TestCard({ nm, sub, icon }: { nm: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="test-card">
      <div className="test-card-icon">{icon}</div>
      <div className="test-card-text">
        <span className="nm">{nm}</span>
        <span className="test-sub">{sub}</span>
      </div>
    </div>
  );
}

function AdmInfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="adm-info-item">
      <span className="adm-info-label">{label}</span>
      <span className={'adm-info-val' + (highlight ? ' adm-info-highlight' : '')}>{value}</span>
    </div>
  );
}
