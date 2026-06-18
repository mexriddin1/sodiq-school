'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { resolveMediaUrl } from '@/lib/api';

// Single-image logo, matching the Seven School header: the floating header is
// always on a light shell, so the dark-coloured logo is rendered directly.
export function Logo({
  locale,
  lightUrl,
  darkUrl,
  brand,
  variant = 'header',
}: {
  locale: Locale;
  lightUrl?: string | null;
  darkUrl?: string | null;
  brand?: string;
  variant?: 'header' | 'footer';
}) {
  // File-naming reality from the uploaded assets:
  //   "Light.png" = dark-coloured logo, for light backgrounds
  //   "Dark.png"  = light/white logo, for dark backgrounds
  const onLightBg = resolveMediaUrl(darkUrl || '/uploads/seed/Logo/Light.png');
  const onDarkBg = resolveMediaUrl(lightUrl || '/uploads/seed/Logo/Dark.png');
  const alt = brand || 'Sodiq School';
  const home = `/${locale}`;
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === home || pathname === home + '/';

  // Always land at the very top of the home page when the logo is clicked,
  // regardless of where we are or where the previous scroll position was.
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (onHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate first, then force the scroll to top after the route mounts.
      router.push(home);
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
      });
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'auto' }), 50);
    }
  }

  if (variant === 'footer') {
    return (
      <Link className="logo" href={home} aria-label={alt} onClick={handleClick}>
        <img src={onDarkBg} alt={alt} height={40} />
      </Link>
    );
  }

  return (
    <Link className="nav-logo" href={home} aria-label={alt} onClick={handleClick}>
      <img src={onLightBg} alt={alt} />
    </Link>
  );
}
