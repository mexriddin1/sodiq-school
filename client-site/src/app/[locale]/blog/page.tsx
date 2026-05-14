import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { isLocale } from '@/i18n/config';
import { getDict } from '@/i18n/dictionaries';
import { fetchSiteBundle, resolveMediaUrl } from '@/lib/api';
import { PageHero } from '@/components/PageHero';
import { BlogSearch } from '@/components/BlogSearch';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = getDict(params.locale as Locale);
  return { title: dict.meta.blog_title, description: dict.meta.blog_desc };
}

export default async function BlogIndex({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDict(locale);
  const bundle = await fetchSiteBundle(locale);
  const s = bundle.settings;

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={s['blog.hero_eyebrow'] || dict.nav.blog}
        title={s['blog.hero_title'] || dict.nav.blog}
        lead={s['blog.hero_lead']}
      />

      <section className="blog">
        <div className="container">
          <BlogSearch placeholder={dict.blog_search_placeholder || 'Maqolalardan qidiring...'} />
          <div className="blog-grid">
            {bundle.blog_posts.map((p, i) => (
              <article key={p.id} className={`blog-card reveal${i % 3 ? ' delay-' + (i % 3) : ''}`}>
                <div className="blog-img">
                  {p.image_url
                    ? <img src={resolveMediaUrl(p.image_url)} alt={p.title} />
                    : <div style={{ background: 'var(--navy-10)', width: '100%', aspectRatio: '4/3' }} />}
                  {p.badge && <span className="badge">{p.badge}</span>}
                </div>
                <div className="blog-body">
                  <span className="blog-meta">{p.date_label}</span>
                  <h3>{p.title}</h3>
                  <Link href={`/${locale}/blog/${p.slug}`} className="text-link">{dict.read_more}</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
