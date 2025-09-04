import React from 'react';
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
  display: 'swap',
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8VM2Y5JZEM"
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'analytics_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'wait_for_update': 500
              });
              
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
        
        <meta name="author" content="CodeClinic.nl" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="theme-color" content="#1F2C90" />
        <meta name="msapplication-TileColor" content="#1F2C90" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CodeClinic" />
        
        <link rel="alternate" hrefLang="nl" href="https://codeclinic.nl" />
        <link rel="alternate" hrefLang="x-default" href="https://codeclinic.nl" />
        
        <link rel="dns-prefetch" href="//assets.calendly.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//static.teamviewer.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://static.teamviewer.com" crossOrigin="anonymous" />
        
        <link rel="preload" href="/logo-cc.png" as="image" type="image/png" />
        
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              background: #0f172a; 
              color: #ffffff; 
              font-family: system-ui, -apple-system, sans-serif;
              margin: 0;
              min-height: 100vh;
            }
            .hero { 
              background: linear-gradient(135deg, #1d4ed8, #047857); 
              min-height: 100vh; 
            }
            header { 
              position: fixed; 
              top: 0; 
              left: 0; 
              right: 0; 
              z-index: 1000; 
              background: rgba(15,23,42,0.95); 
              backdrop-filter: blur(10px);
            }
          `
        }} />
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