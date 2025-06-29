import './globals.css';
import './calendar.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import ContrastTest from '@/components/ContrastTest';
import ErrorOverlay from '@/components/ErrorOverlay';
import HiddenAdminAccess from '@/components/HiddenAdminAccess';

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
        
        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "CodeClinic.nl",
              "description": "CodeClinic: snelle en betrouwbare computerhulp voor thuis en via internet. Geen voorrijkosten in Rotterdam, niet opgelost = geen kosten.",
              "url": "https://codeclinic.nl",
              "logo": "https://codeclinic.nl/logo-cc.png",
              "image": "https://codeclinic.nl/logo-cc.png",
              "telephone": "+31-6-24837889",
              "email": "info@codeclinic.nl",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "NL",
                "addressLocality": "Rotterdam",
                "addressRegion": "Zuid-Holland"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "51.9225",
                "longitude": "4.4792"
              },
              "openingHours": "Mo-Fr 09:00-17:00",
              "priceRange": "€€",
              "currenciesAccepted": "EUR",
              "paymentAccepted": "Cash, Credit Card, Bank Transfer",
              "serviceType": [
                "Computer Repair",
                "Virus Removal",
                "WiFi Optimization",
                "Computer Maintenance",
                "Senior Computer Support",
                "Remote Computer Help",
                "Home Computer Service"
              ],
              "areaServed": "Rotterdam, Zuid-Holland, Nederland",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Computer Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Virus- & malware-verwijdering",
                      "description": "Professionele verwijdering van virussen en malware",
                      "price": "49",
                      "priceCurrency": "EUR"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Computer opschonen & versnellen",
                      "description": "Optimalisatie van uw computer voor betere prestaties",
                      "price": "39",
                      "priceCurrency": "EUR"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Wifi- & netwerkoptimalisatie",
                      "description": "Verbetering van wifi-bereik en netwerkverbinding",
                      "price": "45",
                      "priceCurrency": "EUR"
                    }
                  }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127",
                "bestRating": "5",
                "worstRating": "1"
              }
            })
          }}
        />
        
        {/* Structured Data for FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Hoe werkt remote computerhulp?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Remote hulp werkt via een veilig programma dat u downloadt. Onze expert maakt dan verbinding met uw computer en lost het probleem op afstand op."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat kost computerhulp?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Onze diensten beginnen vanaf €35. De exacte prijs hangt af van het type probleem en de benodigde tijd."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Komen jullie ook aan huis?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, we bieden zowel remote hulp als aan huis service. Voor aan huis service maken we een afspraak en komen we bij u langs."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Wat betekent 'Niet opgelost = geen kosten'?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Als wij uw computerprobleem niet kunnen oplossen, betaalt u niets. Deze garantie geldt voor alle onze diensten. Uitzonderingen zijn hardware vervanging, software licenties, en problemen veroorzaakt door externe factoren."
                  }
                }
              ]
            })
          }}
        />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CodeClinic.nl",
              "url": "https://codeclinic.nl",
              "logo": "https://codeclinic.nl/logo-cc.png",
              "description": "CodeClinic: snelle en betrouwbare computerhulp voor thuis en via internet. Geen voorrijkosten in Rotterdam, niet opgelost = geen kosten.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "NL",
                "addressLocality": "Rotterdam",
                "addressRegion": "Zuid-Holland"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+31-6-24837889",
                "contactType": "customer service",
                "availableLanguage": "Dutch",
                "areaServed": "NL"
              },
              "sameAs": [
                "https://codeclinic.nl"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        {/* Simplified background gradient */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/40 via-[#2B3CA0]/20 to-[#4F4F00]/30" />
        
        {/* Simplified noise overlay */}
        <div 
          className="fixed inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none z-[9997]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px'
          }}
          aria-hidden="true"
        />

        {/* Subtle dark overlay for better readability */}
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
