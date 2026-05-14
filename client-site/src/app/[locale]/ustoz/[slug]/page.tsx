import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { isLocale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { fetchTeacherBySlug, resolveMediaUrl } from '@/lib/api';

type Params = { locale: string; slug: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = await fetchTeacherBySlug(params.slug, params.locale as Locale);
  if (!t) return {};
  return { title: `${t.name} — Sodiq School`, description: `${t.name} — ${t.role}` };
}

export default async function UstozDetailPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDict(locale);
  const t = await fetchTeacherBySlug(params.slug, locale);
  if (!t) notFound();

  return (
    <section className="ustoz-detail">
      <div className="container">
        <div className="crumbs" style={{ marginBottom: 32 }}>
          <Link href={`/${locale}`}>{dict.sections.crumb_home}</Link>
          <span className="sep">/</span>
          <Link href={`/${locale}/about`}>{dict.nav.about}</Link>
          <span className="sep">/</span>
          <span>{t.name}</span>
        </div>
        <div className="ustoz-grid">
          <div className="ustoz-avatar">
            <div className="ustoz-photo" style={{ backgroundImage: `url('${resolveMediaUrl(t.image_url)}')` }}></div>
          </div>
          <div className="ustoz-info">
            <h2>{t.name}</h2>
            <p className="ustoz-role">{t.role}</p>
            <div dangerouslySetInnerHTML={{ __html: t.bio || '' }} />
            <div className="ustoz-meta">
              {(t.meta || []).map((m, i) => (
                <div key={i} className="meta-item">
                  <span className="meta-label">{m.label}</span>
                  <span className="meta-value">{m.value}</span>
                </div>
              ))}
            </div>
            <Link href={`/${locale}/about#team`} className="btn btn-outline">← {dict.sections.all_teachers}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
