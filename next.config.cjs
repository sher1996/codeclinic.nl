/** @type {import('next').NextConfig} */
const nextConfig = {
  // skip ESLint errors in prod builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // skip TypeScript errors in prod builds (if you ever hit TS errors)
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'calendly.com'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com",
              "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://assets.calendly.com",
              "frame-src 'self' https://calendly.com",
              "font-src 'self' data:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 