import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/magnifier-test/',
          '/binary-morph/',
          '/particles/',
          '/animations/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/magnifier-test/',
          '/binary-morph/',
          '/particles/',
          '/animations/',
        ],
      },
    ],
    sitemap: 'https://codeclinic.nl/sitemap.xml',
    host: 'https://codeclinic.nl',
  }
} 