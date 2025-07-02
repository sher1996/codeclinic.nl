import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import ContrastTest from '@/components/ContrastTest';
import ErrorOverlay from '@/components/ErrorOverlay';
import HiddenAdminAccess from '@/components/HiddenAdminAccess';
import StructuredData from '@/components/StructuredData';
import CSSLoader from '@/components/CSSLoader';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import FontLoader from '@/components/FontLoader';

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
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Inline critical CSS */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            :root {
              --c-primary-50: #eef4ff;
              --c-primary-100: #e0e7ff;
              --c-primary-300: #93c5fd;
              --c-primary-400: #60a5fa;
              --c-primary-500: #3b82f6;
              --c-primary-600: #2563eb;
              --c-primary-700: #1d4ed8;
              --c-secondary-50: #ecfdf5;
              --c-secondary-100: #d1fae5;
              --c-secondary-300: #6ee7b7;
              --c-secondary-400: #34d399;
              --c-secondary-500: #10b981;
              --c-secondary-600: #059669;
              --c-secondary-700: #047857;
              --c-accent-50: #fff7ed;
              --c-accent-100: #fffbeb;
              --c-accent-300: #fde68a;
              --c-accent-400: #fbbf24;
              --c-accent-500: #f59e0b;
              --c-accent-600: #d97706;
              --c-accent-700: #b45309;
              --c-surface-light: #f9fafb;
              --c-surface-dark: #1f2937;
              --c-surface-darker: #111827;
              --c-surface-darkest: #0f172a;
              --radius-xs: 4px;
              --radius-sm: 8px;
              --radius-md: 16px;
              --radius-lg: 24px;
              --spacing-section: 6rem;
              --spacing-grid: 2rem;
              --spacing-content: 1.5rem;
              --spacing-xs: 0.25rem;
              --spacing-sm: 0.5rem;
              --spacing-md: 1rem;
              --spacing-lg: 1.5rem;
              --spacing-xl: 2rem;
              --spacing-2xl: 3rem;
              --spacing-3xl: 4rem;
              --spacing-4xl: 6rem;
              --spacing-5xl: 8rem;
              --spacing-6xl: 9rem;
              --elderly-font-size-base: 20px;
              --elderly-font-size-large: 22px;
              --elderly-font-size-xl: 26px;
              --elderly-line-height: 1.8;
              --elderly-button-padding: 18px 28px;
              --elderly-min-touch-target: 48px;
              --elderly-link-underline: 3px;
              --elderly-focus-ring: 5px;
              --elderly-high-contrast: #FFFFFF;
              --elderly-high-contrast-bg: #1F2C90;
              --elderly-text-contrast: #FFFFFF;
              --elderly-text-contrast-secondary: #E8F0FF;
              --elderly-text-spacing: 0.05em;
              --elderly-paragraph-spacing: 1.5em;
              --elderly-section-spacing: 3em;
              --elderly-button-text-size: 18px;
              --elderly-link-text-size: 18px;
              --elderly-description-text-size: 16px;
              --focus-ring-color: #FFFFFF;
              --focus-ring-offset: 3px;
              --focus-ring-width: 3px;
              --skip-link-bg: #1F2C90;
              --skip-link-color: #FFFFFF;
              --skip-link-padding: 12px 24px;
              --skip-link-z-index: 9999;
            }

            /* Skip to main content link */
            .skip-link {
              position: absolute;
              top: -100px;
              left: 6px;
              background: var(--skip-link-bg);
              color: var(--skip-link-color);
              padding: var(--skip-link-padding);
              text-decoration: none;
              border-radius: 4px;
              z-index: var(--skip-link-z-index);
              font-weight: 600;
              font-size: 14px;
              transition: top 0.3s ease;
              opacity: 0;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
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

            /* Focus indicators */
            *:focus-visible {
              outline: var(--focus-ring-width) solid var(--focus-ring-color) !important;
              outline-offset: var(--focus-ring-offset) !important;
              border-radius: 4px;
            }

            /* Basic typography */
            html {
              scroll-behavior: smooth;
              font-size: 16px;
              line-height: 1.6;
              text-rendering: optimizeSpeed;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: var(--elderly-font-size-base);
              line-height: var(--elderly-line-height);
              color: #ffffff;
              background: #0f172a;
              overflow-x: hidden;
              margin: 0;
              padding: 0;
            }

            /* Optimize rendering */
            * {
              box-sizing: border-box;
            }

            /* Prevent layout shift */
            img, video, canvas, audio, iframe, embed, object {
              display: block;
              max-width: 100%;
            }

            /* Hero section critical styles */
            .hero {
              min-height: 100vh;
              height: 100vh;
              display: flex;
              align-items: center;
              position: relative;
              overflow: hidden;
              will-change: transform;
              transform: translateZ(0);
              backface-visibility: hidden;
            }

            .hero-content {
              min-height: 100vh;
              display: flex;
              align-items: center;
              width: 100%;
              position: relative;
              z-index: 50;
            }

            .text-animation-container {
              min-height: 400px;
              width: 100%;
              position: relative;
            }

            .text-animation-paragraph {
              min-height: 3em !important;
              height: 3em !important;
              display: flex !important;
              align-items: center !important;
              transition: none !important;
            }

            .cta-button {
              min-height: 56px !important;
              transition: background-color 0.3s ease, box-shadow 0.3s ease !important;
            }

            .scroll-indicator {
              position: absolute !important;
              bottom: 24px !important;
              left: 50% !important;
              transform: translateX(-50%) !important;
              opacity: 1 !important;
              z-index: 40;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            }

            .floating-testimonials {
              position: absolute !important;
              inset: 0;
              pointer-events: none;
              overflow: hidden;
              z-index: -1;
            }

            /* Header critical styles */
            header {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              z-index: 1000;
              background: rgba(15, 23, 42, 0.95);
              backdrop-filter: blur(10px);
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            /* Main content area */
            main {
              position: relative;
              z-index: 1;
            }

            /* Container styles */
            .container {
              width: 100%;
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 1rem;
            }

            @media (min-width: 640px) {
              .container {
                padding: 0 1.5rem;
              }
            }

            @media (min-width: 1024px) {
              .container {
                padding: 0 2rem;
              }
            }

            /* Senior-friendly text styles */
            .senior-text {
              font-size: var(--elderly-font-size-base);
              line-height: var(--elderly-line-height);
              letter-spacing: var(--elderly-text-spacing);
            }

            .senior-text-large {
              font-size: var(--elderly-font-size-large);
              line-height: var(--elderly-line-height);
              letter-spacing: var(--elderly-text-spacing);
            }

            .senior-text-xl {
              font-size: var(--elderly-font-size-xl);
              line-height: var(--elderly-line-height);
              letter-spacing: var(--elderly-text-spacing);
            }

            .senior-description {
              font-size: var(--elderly-description-text-size);
              line-height: var(--elderly-line-height);
              letter-spacing: var(--elderly-text-spacing);
              margin-bottom: var(--elderly-paragraph-spacing);
            }

            .btn-primary {
              background: var(--elderly-high-contrast-bg);
              color: var(--elderly-text-contrast);
              padding: var(--elderly-button-padding);
              font-size: var(--elderly-button-text-size);
              font-weight: 600;
              border-radius: var(--radius-md);
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-height: var(--elderly-min-touch-target);
              transition: all 0.3s ease;
              border: none;
              cursor: pointer;
            }

            .btn-primary:hover {
              background: #2B3CA0;
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(31, 44, 144, 0.3);
            }

            .btn-primary:focus-visible {
              outline: var(--focus-ring-width) solid var(--focus-ring-color);
              outline-offset: var(--focus-ring-offset);
              background: #2B3CA0;
            }

            @media (max-width: 768px) {
              .hero {
                min-height: 100vh;
                height: 100vh;
              }

              .senior-text {
                font-size: 18px;
              }

              .senior-text-large {
                font-size: 20px;
              }

              .senior-text-xl {
                font-size: 24px;
              }

              .btn-primary {
                padding: 16px 24px;
                font-size: 16px;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }

              .skip-link {
                transition: none;
              }

              .btn-primary {
                transition: none;
              }

              .btn-primary:hover {
                transform: none;
              }
            }

            .footer-link {
              color: var(--elderly-text-contrast-secondary);
              text-decoration: none;
              font-size: var(--elderly-link-text-size);
              transition: color 0.3s ease;
              padding: 8px 0;
              display: inline-block;
            }

            .footer-link:hover {
              color: var(--elderly-text-contrast);
              text-decoration: underline;
              text-decoration-thickness: var(--elderly-link-underline);
            }

            .footer-link:focus-visible {
              outline: var(--focus-ring-width) solid var(--focus-ring-color);
              outline-offset: var(--focus-ring-offset);
              color: var(--elderly-text-contrast);
            }
          `
        }} />
        
        {/* CSS Loader for non-critical styles */}
        <CSSLoader />
        
        {/* Structured Data */}
        <StructuredData pageType="home" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        {/* Font Loader */}
        <FontLoader />
        
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

        {/* Performance monitor */}
        {process.env.NODE_ENV !== 'production' && <PerformanceMonitor />}

        <ErrorOverlay />
      </body>
    </html>
  );
}
