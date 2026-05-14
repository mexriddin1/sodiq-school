'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Counts = {
  applications: number;
  teachers: number;
  blog: number;
  alumni: number;
};

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    Promise.all([
      api<{ items: any[] }>('/api/applications?status=new'),
      api<{ items: any[] }>('/api/teachers?lang=uz'),
      api<{ items: any[] }>('/api/blog?lang=uz'),
      api<{ items: any[] }>('/api/alumni?lang=uz'),
    ]).then(([a, t, b, al]) => {
      setCounts({
        applications: a.items.length,
        teachers: t.items.length,
        blog: b.items.length,
        alumni: al.items.length,
      });
    }).catch(() => setCounts({ applications: 0, teachers: 0, blog: 0, alumni: 0 }));
  }, []);

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Boshqaruv paneli</h1>
        </div>
      </div>
      <main className="content">
        <div className="page-head">
          <div>
            <h2>Xush kelibsiz!</h2>
            <p className="desc">Sodiq School admin panelida boshqarishingiz mumkin bo'lgan bo'limlar:</p>
          </div>
        </div>

        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, alignItems: 'stretch' }}>
          <Stat title="Yangi arizalar" value={counts?.applications ?? '...'} href="/applications" />
          <Stat title="Ustozlar" value={counts?.teachers ?? '...'} href="/teachers" />
          <Stat title="Blog maqolalari" value={counts?.blog ?? '...'} href="/blog" />
          <Stat title="Bitiruvchilar" value={counts?.alumni ?? '...'} href="/alumni" />
        </div>

        <div className="card mt-18">
          <h3 style={{ marginBottom: 8 }}>Tezkor amallar</h3>
          <div className="flex gap-12" style={{ flexWrap: 'wrap' }}>
            <Link href="/blog/new" className="btn btn-primary">Yangi blog yozish</Link>
            <Link href="/teachers/new" className="btn btn-outline">Yangi ustoz qo'shish</Link>
            <Link href="/applications" className="btn btn-outline">Arizalarni ko'rish</Link>
            <Link href="/users/new" className="btn btn-outline">Admin qo'shish</Link>
          </div>
        </div>
      </main>
    </>
  );
}

function Stat({ title, value, href, tone }: { title: string; value: any; href: string; tone?: 'orange' }) {
  return (
    <Link href={href} className="card" style={{ textDecoration: 'none', display: 'block' }}>
      <div className="muted" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ fontSize: '2rem', fontWeight: 700, marginTop: 8, color: tone === 'orange' ? 'var(--orange)' : 'var(--navy)' }}>{value}</div>
    </Link>
  );
}
