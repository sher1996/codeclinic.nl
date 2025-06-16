import React from 'react';

export default function PricingSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Computer Help Services",
    "provider": {
      "@type": "Organization",
      "name": "Computer Help",
      "legalName": "Computer Help B.V.",
      "vatID": "NL001234567B01",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "NL"
      }
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Remote Computer Support",
        "description": "Directe computerhulp op afstand",
        "price": "11.00",
        "priceCurrency": "EUR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "11.00",
          "priceCurrency": "EUR",
          "unitCode": "MIN",
          "unitText": "per 15 minuten"
        }
      },
      {
        "@type": "Offer",
        "name": "Virus & Malware Scan Bundle",
        "description": "Complete virus- en malwareverwijdering",
        "price": "99.00",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "name": "Computer Tune-up Bundle",
        "description": "Complete computer optimalisatie",
        "price": "79.00",
        "priceCurrency": "EUR"
      },
      {
        "@type": "Offer",
        "name": "On-Site Computer Support",
        "description": "Computerhulp aan huis",
        "price": "50.00",
        "priceCurrency": "EUR",
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": "50.00",
          "priceCurrency": "EUR",
          "unitCode": "HUR",
          "unitText": "per uur"
        }
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Netherlands"
    },
    "serviceType": "Computer Repair and Support",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Computer Help Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Remote Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Remote Computer Support",
                "description": "Directe computerhulp op afstand"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Service Bundles",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Virus & Malware Scan",
                "description": "Complete virus- en malwareverwijdering"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Computer Tune-up",
                "description": "Complete computer optimalisatie"
              }
            }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "On-Site Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Computerhulp aan huis",
                "description": "Persoonlijke computerhulp bij u thuis"
              }
            }
          ]
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 