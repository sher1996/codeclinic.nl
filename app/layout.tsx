import './globals.css';
import './calendar.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import ContrastTest from '@/components/ContrastTest';
import ErrorOverlay from '@/components/ErrorOverlay';
import HiddenAdminAccess from '@/components/HiddenAdminAccess';
import StructuredData from '@/components/StructuredData';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeClinic – Computerhulp aan huis en op afstand in Rotterdam',
  description: 'CodeClinic: snelle en betrouwbare computerhulp voor thuis en via internet. Geen voorrijkosten in Rotterdam, niet opgelost = geen kosten. Plan direct uw afspraak!',
  keywords: 'computerhulp, computer reparatie, virus verwijdering, wifi optimalisatie, computer opschonen, senioren computerhulp, remote hulp, aan huis service, computer ondersteuning, IT support, Rotterdam, computerhulp Rotterdam, computer reparatie Rotterdam',
  authors: [{ name: 'CodeClinic.nl' }],
  creator: 'CodeClinic.nl',
  publisher: 'CodeClinic.nl',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://codeclinic.nl'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'CodeClinic – Computerhulp aan huis en op afstand in Rotterdam',
    description: 'CodeClinic: snelle en betrouwbare computerhulp voor thuis en via internet. Geen voorrijkosten in Rotterdam, niet opgelost = geen kosten. Plan direct uw afspraak!',
    url: 'https://codeclinic.nl',
    siteName: 'CodeClinic.nl',
    images: [
      {
        url: '/logo-cc.png',
        width: 1200,
        height: 630,
        alt: 'CodeClinic.nl - Expert Computerhulp Rotterdam',
      },
    ],
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeClinic – Computerhulp aan huis en op afstand in Rotterdam',
    description: 'CodeClinic: snelle en betrouwbare computerhulp voor thuis en via internet. Geen voorrijkosten in Rotterdam, niet opgelost = geen kosten.',
    images: ['/logo-cc.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        
        {/* Additional SEO meta tags */}
        <meta name="author" content="CodeClinic.nl" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="theme-color" content="#1F2C90" />
        <meta name="msapplication-TileColor" content="#1F2C90" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CodeClinic" />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="nl" href="https://codeclinic.nl" />
        <link rel="alternate" hrefLang="x-default" href="https://codeclinic.nl" />
        
        {/* Preload critical resources */}
        <link
          rel="preconnect"
          href="https://assets.calendly.com"
          crossOrigin="anonymous"
        />
        
        {/* Preload critical CSS */}
        <link
          rel="preload"
          href="/_next/static/css/app/globals.css"
          as="style"
        />
        <noscript>
          <link rel="stylesheet" href="/_next/static/css/app/globals.css" />
        </noscript>
        
        {/* Non-critical CSS will be loaded dynamically */}
        
        {/* Inline critical CSS for immediate rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            :root {
              --c-primary-700: #1d4ed8;
              --c-secondary-700: #047857;
              --elderly-font-size-base: 20px;
              --elderly-font-size-large: 22px;
              --elderly-line-height: 1.8;
              --elderly-min-touch-target: 48px;
              --elderly-high-contrast: #FFFFFF;
              --elderly-text-contrast: #FFFFFF;
              --elderly-text-contrast-secondary: #E8F0FF;
              --focus-ring-color: #FFFFFF;
              --focus-ring-offset: 3px;
              --focus-ring-width: 3px;
            }
            
            html {
              font-size: var(--elderly-font-size-base);
              background: #0f172a;
              overflow-y: scroll;
            }
            
            body {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              color: #FFFFFF;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif;
              position: relative;
              z-index: 0;
              text-shadow: 0 2px 4px rgba(0,0,0,.8);
              min-height: 100vh;
              line-height: var(--elderly-line-height);
              margin: 0;
            }
            
            .hero {
              position: relative;
              background: linear-gradient(135deg, var(--c-primary-700), var(--c-secondary-700));
              min-height: 100vh !important;
              height: 100vh !important;
            }
            
            .hero::before {
              content: "";
              position: absolute;
              inset: 0;
              background: rgba(0,0,0,.2);
              mix-blend-mode: overlay;
              pointer-events: none;
              z-index: 1;
            }
            
            .hero > * {
              position: relative;
              z-index: 2;
            }
            
            .hero-content {
              min-height: 100vh;
              display: flex;
              align-items: center;
              width: 100%;
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-weight: 700;
              letter-spacing: -.025em;
              color: rgb(255 255 255);
              text-shadow: 0 2px 4px rgba(0,0,0,.8);
              line-height: var(--elderly-line-height);
              margin: 0;
            }
            
            h1 {
              font-size: clamp(2.5rem, 5vw, 4rem);
            }
            
            h2 {
              font-size: clamp(2rem, 4vw, 3.5rem);
            }
            
            h3 {
              font-size: clamp(1.75rem, 3.5vw, 3rem);
            }
            
            p {
              font-size: 1rem;
              line-height: 1.5rem;
              color: rgb(255 255 255);
              text-shadow: 0 2px 4px rgba(0,0,0,.8);
              line-height: var(--elderly-line-height);
              max-width: 45ch;
              margin: 0;
            }
            
            .btn-primary {
              font-size: var(--elderly-font-size-large);
              border-radius: .5rem;
              background-color: rgb(31 44 144);
              padding: 1rem 1.5rem;
              font-size: 1.125rem;
              line-height: 1.75rem;
              font-weight: 600;
              color: rgb(255 255 255);
              transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
              transition-timing-function: cubic-bezier(.4,0,.2,1);
              transition-duration: .15s;
              min-height: var(--elderly-min-touch-target);
              box-shadow: 0 4px 8px rgba(0,0,0,.2);
              border: 2px solid transparent;
              text-decoration: none;
              display: inline-block;
              cursor: pointer;
            }
            
            .btn-primary:hover {
              background-color: rgb(43 60 160);
              box-shadow: 0 6px 12px rgba(0,0,0,.3);
              transform: scale(1.05);
            }
            
            .btn-primary:focus-visible {
              outline: 3px solid var(--elderly-high-contrast);
              outline-offset: 2px;
              border-color: var(--elderly-high-contrast);
            }
            
            .nav-link {
              font-size: var(--elderly-font-size-large);
              border-radius: .5rem;
              padding: .75rem 1rem;
              font-size: 1.125rem;
              line-height: 1.75rem;
              font-weight: 600;
              color: rgb(255 255 255);
              transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
              transition-timing-function: cubic-bezier(.4,0,.2,1);
              transition-duration: .15s;
              min-height: var(--elderly-min-touch-target);
              border: 2px solid transparent;
              text-decoration: none;
              display: inline-block;
            }
            
            .nav-link:hover {
              color: rgb(147 197 253);
              background-color: rgb(255 255 255/.1);
              border-color: rgba(255,255,255,.3);
            }
            
            .nav-link:focus-visible {
              outline: 3px solid var(--elderly-high-contrast);
              outline-offset: 2px;
              border-color: var(--elderly-high-contrast);
            }
            
            .container {
              width: 100%;
              max-width: 1280px;
              margin: 0 auto;
              padding: 0 1rem;
            }
            
            .text-center {
              text-align: center;
            }
            
            .text-white {
              color: rgb(255 255 255);
            }
            
            .text-white\\/80 {
              color: rgb(255 255 255/.8);
            }
            
            .text-white\\/60 {
              color: var(--elderly-text-contrast-secondary);
            }
            
            .text-white\\/90 {
              color: var(--elderly-text-contrast);
            }
            
            .text-white\\/70 {
              color: #E8F0FF;
            }
            
            .text-white\\/50 {
              color: #D8E0FF;
            }
            
            :focus-visible {
              outline: var(--elderly-focus-ring) solid var(--elderly-high-contrast) !important;
              outline-offset: 2px !important;
            }
            
            .flex {
              display: flex;
            }
            
            .flex-col {
              flex-direction: column;
            }
            
            .items-center {
              align-items: center;
            }
            
            .justify-center {
              justify-content: center;
            }
            
            .justify-between {
              justify-content: space-between;
            }
            
            .grid {
              display: grid;
            }
            
            .grid-cols-1 {
              grid-template-columns: repeat(1, minmax(0, 1fr));
            }
            
            .grid-cols-2 {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            
            .gap-4 {
              gap: 1rem;
            }
            
            .gap-6 {
              gap: 1.5rem;
            }
            
            .gap-8 {
              gap: 2rem;
            }
            
            .gap-10 {
              gap: 2.5rem;
            }
            
            .mb-4 {
              margin-bottom: 1rem;
            }
            
            .mb-6 {
              margin-bottom: 1.5rem;
            }
            
            .mb-8 {
              margin-bottom: 2rem;
            }
            
            .mb-10 {
              margin-bottom: 2.5rem;
            }
            
            .mb-16 {
              margin-bottom: 4rem;
            }
            
            .mb-20 {
              margin-bottom: 5rem;
            }
            
            .mb-24 {
              margin-bottom: 6rem;
            }
            
            .mt-4 {
              margin-top: 1rem;
            }
            
            .mt-6 {
              margin-top: 1.5rem;
            }
            
            .mt-8 {
              margin-top: 2rem;
            }
            
            .mt-10 {
              margin-top: 2.5rem;
            }
            
            .mt-12 {
              margin-top: 3rem;
            }
            
            .mt-24 {
              margin-top: 6rem;
            }
            
            .py-16 {
              padding-top: 4rem;
              padding-bottom: 4rem;
            }
            
            .py-20 {
              padding-top: 5rem;
              padding-bottom: 5rem;
            }
            
            .py-24 {
              padding-top: 6rem;
              padding-bottom: 6rem;
            }
            
            .py-28 {
              padding-top: 7rem;
              padding-bottom: 7rem;
            }
            
            .py-36 {
              padding-top: 9rem;
              padding-bottom: 9rem;
            }
            
            .py-44 {
              padding-top: 11rem;
              padding-bottom: 11rem;
            }
            
            .px-4 {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .px-6 {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
            
            .px-8 {
              padding-left: 2rem;
              padding-right: 2rem;
            }
            
            @media (min-width: 640px) {
              .sm\\:text-lg {
                font-size: var(--elderly-font-size-large) !important;
              }
              
              .sm\\:text-xl {
                font-size: var(--elderly-font-size-xl) !important;
              }
              
              .sm\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
              
              .sm\\:flex-row {
                flex-direction: row;
              }
            }
            
            @media (min-width: 768px) {
              .md\\:text-xl {
                font-size: var(--elderly-font-size-xl) !important;
              }
              
              .md\\:grid-cols-2 {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
              
              .md\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
            }
            
            @media (min-width: 1024px) {
              .lg\\:grid-cols-3 {
                grid-template-columns: repeat(3, minmax(0, 1fr));
              }
              
              .lg\\:grid-cols-4 {
                grid-template-columns: repeat(4, minmax(0, 1fr));
              }
            }
            
            .sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border: 0;
            }
            
            @media (prefers-reduced-motion: reduce) {
              * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
              }
              
              .btn-primary:hover {
                transform: none;
              }
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        <Header />
        <main id="main-content">
          {children}
        </main>
        
        <ContrastTest />
        <ErrorOverlay />
        <HiddenAdminAccess />
        <StructuredData />
      </body>
    </html>
  );
}
