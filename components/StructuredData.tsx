import React from 'react';

interface StructuredDataProps {
  pageType?: 'home' | 'faq' | 'privacy' | 'terms';
}

const StructuredData: React.FC<StructuredDataProps> = ({ pageType = 'home' }) => {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CodeClinic.nl",
    "alternateName": "CodeClinic",
    "description": "CodeClinic: snelle en betrouwbare computerhulp voor thuis en via internet. Geen voorrijkosten in Rotterdam, niet opgelost = geen kosten. Expert computerhulp voor senioren en particulieren.",
    "url": "https://codeclinic.nl",
    "logo": "https://codeclinic.nl/logo-cc.png",
    "image": "https://codeclinic.nl/logo-cc.png",
    "telephone": "+31-6-24837889",
    "email": "info@codeclinic.nl",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NL",
      "addressLocality": "Rotterdam",
      "addressRegion": "Zuid-Holland",
      "postalCode": "3000"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.9225",
      "longitude": "4.4792"
    },
    "openingHours": [
      "Mo-Fr 09:00-17:00",
      "Sa 10:00-15:00"
    ],
    "priceRange": "€€",
    "currenciesAccepted": "EUR",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer, iDEAL",
    "serviceType": [
      "Computer Repair",
      "Virus Removal",
      "WiFi Optimization",
      "Computer Maintenance",
      "Senior Computer Support",
      "Remote Computer Help",
      "Home Computer Service",
      "IT Support",
      "Computer Troubleshooting",
      "Software Installation",
      "Hardware Repair",
      "Network Setup"
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": "Rotterdam"
      },
      {
        "@type": "City",
        "name": "Schiedam"
      },
      {
        "@type": "City",
        "name": "Vlaardingen"
      },
      {
        "@type": "City",
        "name": "Capelle aan den IJssel"
      },
      {
        "@type": "City",
        "name": "Spijkenisse"
      },
      {
        "@type": "City",
        "name": "Barendrecht"
      },
      {
        "@type": "City",
        "name": "Ridderkerk"
      },
      {
        "@type": "City",
        "name": "Krimpen aan den IJssel"
      },
      {
        "@type": "City",
        "name": "Brielle"
      },
      {
        "@type": "City",
        "name": "Hellevoetsluis"
      }
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "51.9225",
        "longitude": "4.4792"
      },
      "geoRadius": "25000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Computer Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Virus- & malware-verwijdering",
            "description": "Professionele verwijdering van virussen en malware van uw computer",
            "price": "49",
            "priceCurrency": "EUR",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "49",
              "priceCurrency": "EUR",
              "unitText": "per behandeling"
            }
          },
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "49",
            "priceCurrency": "EUR",
            "unitText": "per behandeling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Computer opschonen & versnellen",
            "description": "Optimalisatie van uw computer voor betere prestaties en snelheid",
            "price": "39",
            "priceCurrency": "EUR",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "39",
              "priceCurrency": "EUR",
              "unitText": "per behandeling"
            }
          },
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "39",
            "priceCurrency": "EUR",
            "unitText": "per behandeling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Wifi- & netwerkoptimalisatie",
            "description": "Verbetering van wifi-bereik en netwerkverbinding voor optimale prestaties",
            "price": "45",
            "priceCurrency": "EUR",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "45",
              "priceCurrency": "EUR",
              "unitText": "per behandeling"
            }
          },
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "45",
            "priceCurrency": "EUR",
            "unitText": "per behandeling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Remote computerhulp",
            "description": "Computerhulp op afstand via veilige verbinding",
            "price": "35",
            "priceCurrency": "EUR",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "35",
              "priceCurrency": "EUR",
              "unitText": "per uur"
            }
          },
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "35",
            "priceCurrency": "EUR",
            "unitText": "per uur"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Computerhulp aan huis",
            "description": "Persoonlijke computerhulp bij u thuis in Rotterdam en omgeving",
            "price": "45",
            "priceCurrency": "EUR",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "45",
              "priceCurrency": "EUR",
              "unitText": "per uur"
            }
          },
          "priceSpecification": {
            "@type": "UnitPriceSpecification",
            "price": "45",
            "priceCurrency": "EUR",
            "unitText": "per uur"
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
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Mevrouw Jansen"
        },
        "reviewBody": "Zeer professionele service. Mijn computer probleem was snel opgelost en de uitleg was duidelijk."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Meneer de Vries"
        },
        "reviewBody": "Uitstekende remote hulp. Probleem opgelost zonder dat ik de deur uit hoefde."
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+31-6-24837889",
        "contactType": "customer service",
        "availableLanguage": "Dutch",
        "areaServed": "NL",
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        }
      },
      {
        "@type": "ContactPoint",
        "telephone": "+31-6-24837889",
        "contactType": "emergency",
        "availableLanguage": "Dutch",
        "areaServed": "NL"
      }
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "description": "Niet opgelost = geen kosten garantie",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "0",
          "priceCurrency": "EUR"
        }
      }
    ],
    "slogan": "Niet opgelost = geen kosten",
    "knowsAbout": [
      "Computer Repair",
      "Virus Removal",
      "WiFi Optimization",
      "Computer Maintenance",
      "Senior Computer Support",
      "Remote Computer Help",
      "IT Support",
      "Windows Support",
      "Mac Support",
      "Network Troubleshooting"
    ],
    "foundingDate": "2020",
    "numberOfEmployees": "1-10",
    "vatID": "NL123456789B01"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CodeClinic.nl",
    "alternateName": "CodeClinic",
    "url": "https://codeclinic.nl",
    "logo": "https://codeclinic.nl/logo-cc.png",
    "description": "CodeClinic: snelle en betrouwbare computerhulp voor thuis en via internet. Geen voorrijkosten in Rotterdam, niet opgelost = geen kosten.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NL",
      "addressLocality": "Rotterdam",
      "addressRegion": "Zuid-Holland",
      "postalCode": "3000"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+31-6-24837889",
      "contactType": "customer service",
      "availableLanguage": "Dutch",
      "areaServed": "NL",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    },
    "sameAs": [
      "https://codeclinic.nl"
    ],
    "foundingDate": "2020",
    "numberOfEmployees": "1-10",
    "vatID": "NL123456789B01",
    "knowsAbout": [
      "Computer Repair",
      "Virus Removal",
      "WiFi Optimization",
      "Computer Maintenance",
      "Senior Computer Support",
      "Remote Computer Help",
      "IT Support"
    ],
    "serviceType": [
      "Computer Repair",
      "Virus Removal",
      "WiFi Optimization",
      "Computer Maintenance",
      "Senior Computer Support",
      "Remote Computer Help",
      "Home Computer Service"
    ],
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "51.9225",
        "longitude": "4.4792"
      },
      "geoRadius": "25000"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CodeClinic.nl",
    "url": "https://codeclinic.nl",
    "description": "CodeClinic: snelle en betrouwbare computerhulp voor thuis en via internet. Geen voorrijkosten in Rotterdam, niet opgelost = geen kosten.",
    "publisher": {
      "@type": "Organization",
      "name": "CodeClinic.nl",
      "logo": "https://codeclinic.nl/logo-cc.png"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://codeclinic.nl/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "nl-NL",
    "isAccessibleForFree": true
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://codeclinic.nl"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Diensten",
        "item": "https://codeclinic.nl/#diensten"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Tarieven",
        "item": "https://codeclinic.nl/#tarieven"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "FAQ",
        "item": "https://codeclinic.nl/faq"
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": "Contact",
        "item": "https://codeclinic.nl/#contact"
      }
    ]
  };

  const faqSchema = {
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
      },
      {
        "@type": "Question",
        "name": "In welke gebieden bieden jullie service?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We bieden service in Rotterdam en de omliggende gemeenten zoals Schiedam, Vlaardingen, Capelle aan den IJssel, Spijkenisse, Barendrecht, Ridderkerk, Krimpen aan den IJssel, Brielle en Hellevoetsluis."
        }
      },
      {
        "@type": "Question",
        "name": "Hoe snel kunnen jullie komen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Voor urgente problemen proberen we dezelfde dag nog langs te komen. Normale afspraken plannen we binnen 1-2 werkdagen."
        }
      }
    ]
  };

  return (
    <>
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />

      {/* WebSite Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* FAQ Schema - only on FAQ page */}
      {pageType === 'faq' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}
    </>
  );
};

export default StructuredData; 