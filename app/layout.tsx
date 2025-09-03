import './globals.css';
import './calendar.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/Header';
import ErrorOverlay from '@/components/ErrorOverlay';
import HiddenAdminAccess from '@/components/HiddenAdminAccess';
import StructuredData from '@/components/StructuredData';
import PerformanceMonitor from '@/components/PerformanceMonitor';

import ConsentManager from '@/components/ConsentManager';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
  preload: true,
});

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
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeClinic – Computerhulp aan huis en op afstand in Rotterdam',
    description: 'CodeClinic: snelle en betrouwbare computerhulp voor thuis en via internet. Geen voorrijkosten in Rotterdam, niet opgelost = geen kosten.',
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
        {/* Google tag (gtag.js) with consent mode */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8VM2Y5JZEM"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Initialize consent mode with default settings
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
              
              // Configure Google Analytics with consent mode
              gtag('config', 'G-8VM2Y5JZEM', {
                'consent_mode': 'advanced',
                'anonymize_ip': true,
                'allow_google_signals': false,
                'allow_ad_personalization_signals': false
              });
            `,
          }}
        />
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
        
        {/* DNS Prefetch and Preconnect for external resources - Critical Path Optimization */}
        <link rel="dns-prefetch" href="//assets.calendly.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//static.teamviewer.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Preconnect to critical origins - limit to 4 as recommended */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://static.teamviewer.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources for above-the-fold content */}
        <link rel="preload" href="/logo-cc.png" as="image" type="image/png" />
        
        {/* Defer non-critical CSS */}
        {/* Removed manual CSS <link> and <noscript> tags as per Next.js requirements */}
        
        {/* Defer calendar CSS */}
        {/* Removed manual CSS <link> and <noscript> tags as per Next.js requirements */}
        
        {/* Optimized critical CSS for above-the-fold content only */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Essential variables and base styles */
            :root{--c-primary-700:#1d4ed8;--c-secondary-700:#047857;--elderly-font-size-base:20px;--elderly-line-height:1.8;--elderly-min-touch-target:48px;--elderly-high-contrast:#FFFFFF}
            html{font-size:var(--elderly-font-size-base);background:#0f172a;overflow-y:scroll;scroll-behavior:smooth}
            body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#FFFFFF;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;position:relative;z-index:0;text-shadow:0 2px 4px rgba(0,0,0,.8);min-height:100vh;line-height:var(--elderly-line-height);margin:0}
            
            /* Hero section critical styles */
            .hero{position:relative;background:linear-gradient(135deg,var(--c-primary-700),var(--c-secondary-700));min-height:100vh!important;height:100vh!important}
            .hero::before{content:"";position:absolute;inset:0;background:rgba(0,0,0,.2);mix-blend-mode:overlay;pointer-events:none;z-index:1}
            .hero>*{position:relative;z-index:2}
            .hero-content{min-height:100vh;display:flex;align-items:center;width:100%}
            
            /* Critical typography */
            h1,h2,h3,h4,h5,h6{font-weight:700;letter-spacing:-.025em;color:rgb(255 255 255);text-shadow:0 2px 4px rgba(0,0,0,.8);line-height:var(--elderly-line-height);margin:0}
            h1{font-size:clamp(2.5rem,5vw,4rem)}
            h2{font-size:clamp(2rem,4vw,3.5rem)}
            h3{font-size:clamp(1.75rem,3.5vw,3rem)}
            p{font-size:1rem;line-height:1.5rem;color:rgb(255 255 255);text-shadow:0 2px 4px rgba(0,0,0,.8);line-height:var(--elderly-line-height);max-width:45ch;margin:0}
            
            /* Essential layout utilities */
            .container{width:100%;max-width:1280px;margin:0 auto;padding:0 1rem}
            .text-center{text-align:center}
            .text-white{color:rgb(255 255 255)}
            .flex{display:flex}
            .flex-col{flex-direction:column}
            .items-center{align-items:center}
            .justify-center{justify-content:center}
            .justify-between{justify-content:space-between}
            .grid{display:grid}
            .grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}
            .gap-4{gap:1rem}
            .gap-6{gap:1.5rem}
            .gap-8{gap:2rem}
            .mb-4{margin-bottom:1rem}
            .mb-6{margin-bottom:1.5rem}
            .mb-8{margin-bottom:2rem}
            .py-16{padding-top:4rem;padding-bottom:4rem}
            .py-20{padding-top:5rem;padding-bottom:5rem}
            .py-24{padding-top:6rem;padding-bottom:6rem}
            .px-4{padding-left:1rem;padding-right:1rem}
            .px-6{padding-left:1.5rem;padding-right:1.5rem}
            .px-8{padding-left:2rem;padding-right:2rem}
            
            /* Essential responsive breakpoints */
            @media (min-width:640px){.sm\\:text-lg{font-size:var(--elderly-font-size-large)!important}.sm\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.sm\\:flex-row{flex-direction:row}}
            @media (min-width:768px){.md\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.md\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}
            @media (min-width:1024px){.lg\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}}
            
            /* Accessibility */
            .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
            :focus-visible{outline:3px solid var(--elderly-high-contrast)!important;outline-offset:2px!important}
            
            /* Reduced motion support */
            @media (prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;scroll-behavior:auto!important}}
          `
        }} />
        
        {/* Preload email-decode script to reduce critical path latency */}
        <link rel="preload" href="https://cdn.jsdelivr.net/npm/email-decode@1.0.0/dist/email-decode.min.js" as="script" crossOrigin="anonymous" />
        
        {/* Defer non-critical JavaScript */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Defer loading of non-critical resources
              function loadDeferredResources() {
                // Load email-decode.min.js only when needed
                if (document.querySelector('[data-email]')) {
                  const script = document.createElement('script');
                  script.src = 'https://cdn.jsdelivr.net/npm/email-decode@1.0.0/dist/email-decode.min.js';
                  script.async = true;
                  script.crossOrigin = 'anonymous';
                  document.head.appendChild(script);
                }
              }
              
              // Load deferred resources after page load
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', loadDeferredResources);
              } else {
                loadDeferredResources();
              }
            `
          }}
        />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link" accessKey="m">
          Skip to main content
        </a>
        
        <Header />
        <main id="main-content">
          {children}
        </main>
        
        <ErrorOverlay />
        <HiddenAdminAccess />
        <StructuredData />
        <PerformanceMonitor />

        <ConsentManager />
      </body>
    </html>
  );
}
