import Link from 'next/link';

export function PageHeader({
  title, description, actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <>
      <div className="topbar">
        <h1>{title}</h1>
        <div className="actions">{actions}</div>
      </div>
      {description && (
        <div style={{ padding: '16px 28px 0', color: 'var(--text-soft)', fontSize: '0.92rem' }}>
          {description}
        </div>
      )}
    </>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="btn btn-outline">← {label}</Link>
  );
}
