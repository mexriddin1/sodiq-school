import type { Locale } from '@/i18n/config';

export function PageHero({
  locale, eyebrow, title, lead, crumbExtra,
}: {
  locale: Locale;
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbExtra?: string;
}) {
  void locale;
  return (
    <section className="page-hero">
      <div className="container page-hero-inner">
        {crumbExtra && (
          <div className="crumbs">
            <span>{crumbExtra}</span>
          </div>
        )}
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        {lead && <p className="lead" dangerouslySetInnerHTML={{ __html: lead }} />}
      </div>
    </section>
  );
}
