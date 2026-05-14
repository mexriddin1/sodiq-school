'use client';

import { useEffect, useState } from 'react';

export function BlogSearch({ placeholder }: { placeholder: string }) {
  const [q, setQ] = useState('');

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.blog-grid .blog-card');
    const needle = q.trim().toLowerCase();
    cards.forEach((card) => {
      if (!needle) { card.style.display = ''; return; }
      const text = (card.textContent || '').toLowerCase();
      card.style.display = text.includes(needle) ? '' : 'none';
    });
  }, [q]);

  return (
    <div className="blog-search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}
