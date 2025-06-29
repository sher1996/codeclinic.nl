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
        <meta name="apple-mobile-web-app-capable" content="yes" />
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
