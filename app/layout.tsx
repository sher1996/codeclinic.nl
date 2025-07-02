import './critical.css';
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
        
        {/* Inline critical CSS for immediate rendering */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            :root {
              --c-primary-600: #2563eb;
              --c-primary-700: #1d4ed8;
              --elderly-font-size-base: 20px;
              --elderly-line-height: 1.8;
              --focus-ring-color: #FFFFFF;
              --focus-ring-offset: 3px;
              --focus-ring-width: 3px;
            }
            
            html {
              scroll-behavior: smooth;
              font-size: 16px;
              line-height: 1.6;
            }
            
            body {
              font-family: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;
              font-size: var(--elderly-font-size-base);
              line-height: var(--elderly-line-height);
              color: #ffffff;
              background: #0f172a;
              overflow-x: hidden;
              margin: 0;
            }
            
            .hero {
              height: 100vh;
              overflow: hidden;
              will-change: transform;
              transform: translateZ(0);
              backface-visibility: hidden;
              min-height: 100vh;
              display: flex;
              align-items: center;
              position: relative;
            }
            
            .hero-content {
              width: 100%;
              z-index: 50;
              min-height: 100vh;
              display: flex;
              align-items: center;
              position: relative;
            }
            
            .text-4xl {
              font-size: 2.25rem;
              line-height: 2.5rem;
            }
            
            .text-5xl {
              font-size: 3rem;
              line-height: 1;
            }
            
            .text-6xl {
              font-size: 3.75rem;
              line-height: 1;
            }
            
            .font-extrabold {
              font-weight: 800;
            }
            
            .leading-\\[1\\.1\\] {
              line-height: 1.1;
            }
            
            .tracking-tight {
              letter-spacing: -0.025em;
            }
            
            .flex {
              display: flex;
            }
            
            .items-center {
              align-items: center;
            }
            
            .justify-center {
              justify-content: center;
            }
            
            .relative {
              position: relative;
            }
            
            .absolute {
              position: absolute;
            }
            
            .inset-0 {
              inset: 0;
            }
            
            .z-50 {
              z-index: 50;
            }
            
            .px-4 {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .py-28 {
              padding-top: 7rem;
              padding-bottom: 7rem;
            }
            
            .mb-8 {
              margin-bottom: 2rem;
            }
            
            .text-white {
              color: rgb(255 255 255);
            }
            
            .bg-\\[\\#1F2C90\\]\\/20 {
              background-color: rgb(31 44 144 / 0.2);
            }
            
            @media (min-width: 640px) {
              .sm\\:px-6 {
                padding-left: 1.5rem;
                padding-right: 1.5rem;
              }
              
              .sm\\:py-36 {
                padding-top: 9rem;
                padding-bottom: 9rem;
              }
              
              .sm\\:text-5xl {
                font-size: 3rem;
                line-height: 1;
              }
            }
            
            @media (min-width: 1024px) {
              .lg\\:px-8 {
                padding-left: 2rem;
                padding-right: 2rem;
              }
              
              .lg\\:py-44 {
                padding-top: 11rem;
                padding-bottom: 11rem;
              }
              
              .lg\\:text-6xl {
                font-size: 3.75rem;
                line-height: 1;
              }
            }
            
            *:focus-visible {
              outline: var(--focus-ring-width) solid var(--focus-ring-color) !important;
              outline-offset: var(--focus-ring-offset) !important;
              border-radius: 4px;
            }
            
            .skip-link {
              position: absolute;
              top: -100px;
              left: 6px;
              background: #1F2C90;
              color: #FFFFFF;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 4px;
              z-index: 9999;
              font-weight: 600;
              font-size: 14px;
              transition: top 0.3s ease;
              opacity: 0;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              transform: scale(0.9);
              clip: rect(0 0 0 0);
              overflow: hidden;
              visibility: hidden;
              pointer-events: none;
              display: block;
              width: auto;
              height: auto;
            }
            
            .skip-link:focus {
              top: 6px;
              outline: var(--focus-ring-width) solid var(--focus-ring-color);
              outline-offset: var(--focus-ring-offset);
              opacity: 1;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
              transform: scale(1);
              clip: auto;
              overflow: visible;
              visibility: visible;
              pointer-events: auto;
            }
          `
        }} />
        

        
        {/* Structured Data */}
        <StructuredData pageType="home" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        {/* Simplified background gradient */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/40 via-[#2B3CA0]/20 to-[#4F4F00]/30" />
        
        {/* Simplified dark overlay for better readability */}
        <div 
          className="fixed inset-0 bg-black/15 mix-blend-overlay pointer-events-none z-[9998]"
          aria-hidden="true"
        />
        
        {/* Main content */}
        <div className="relative z-[9999] min-h-screen">
          {/* Skip to main content link for keyboard users */}
          <a href="#main-content" className="skip-link">
            Spring naar hoofdinhoud
          </a>
          
          <Header />
          <main id="main-content" className="pt-20">
            {children}
          </main>
        </div>

        {/* Hidden Admin Access */}
        <HiddenAdminAccess />

        {/* Error overlay - rendered at root level */}
        <div id="error-overlay-root" style={{ position: 'relative', zIndex: 2147483647 }} />

        {/* Contrast test component */}
        {process.env.NODE_ENV !== 'production' && <ContrastTest />}

        <ErrorOverlay />
      </body>
    </html>
  );
}
