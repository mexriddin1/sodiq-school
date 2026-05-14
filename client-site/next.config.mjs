/** @type {import('next').NextConfig} */
const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
let imageDomain = 'localhost';
try {
  imageDomain = new URL(apiBase).hostname;
} catch {}

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: imageDomain, port: '4000', pathname: '/uploads/**' },
      { protocol: 'http',  hostname: imageDomain,                pathname: '/uploads/**' },
      { protocol: 'https', hostname: imageDomain,                pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
