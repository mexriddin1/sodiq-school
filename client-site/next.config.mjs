/** @type {import('next').NextConfig} */
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
let imageDomain = 'localhost';
try {
  imageDomain = new URL(apiBase).hostname;
} catch {}

// The exam landing was renamed 1-iyul -> 1-avgust. Ads, Telegram and Instagram posts
// still point at the old slugs (imtixon-1iyul was an alias of imtixon-1july), so both
// keep working instead of 404ing.
const EXAM_LANDING_OLD_SLUGS = ['imtixon-1july', 'imtixon-1iyul'];

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return EXAM_LANDING_OLD_SLUGS.flatMap((slug) => [
      { source: `/:locale/${slug}`, destination: '/:locale/imtixon-1avgust', permanent: true },
      // Bare path: config redirects run before the locale-prefixing middleware.
      { source: `/${slug}`, destination: '/uz/imtixon-1avgust', permanent: true },
    ]);
  },
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: imageDomain, port: '4000', pathname: '/uploads/**' },
      { protocol: 'http',  hostname: imageDomain,                pathname: '/uploads/**' },
      { protocol: 'https', hostname: imageDomain,                pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
