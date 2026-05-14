'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { resolveMediaUrl } from '@/lib/api';

// Two-image logo: Light variant for transparent header, Dark for solid/scrolled.
// CSS in globals.css toggles which one is visible based on header state.
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
  // NOTE: Source files are named the opposite of what they are visually:
  // - "Light.png" is actually the DARK-coloured logo (use on light/white backgrounds)
  // - "Dark.png"  is actually the LIGHT/white logo (use on dark backgrounds)
  // CSS shows `.logo-light` on transparent (dark) headers and `.logo-dark` on solid
  // (white) headers, so we point the file refs accordingly.
  const lightForDarkBg = resolveMediaUrl(lightUrl || '/uploads/seed/Logo/Dark.png');
  const darkForLightBg = resolveMediaUrl(darkUrl || '/uploads/seed/Logo/Light.png');
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
        <img src={lightForDarkBg} alt={alt} height={40} />
      </Link>
    );
  }

  return (
    <Link className="logo" href={home} aria-label={alt} onClick={handleClick}>
      <img className="logo-light" src={lightForDarkBg} alt={alt} height={40} />
      <img className="logo-dark" src={darkForLightBg} alt={alt} height={40} />
    </Link>
  );
}
