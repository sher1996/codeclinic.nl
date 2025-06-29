# Structured Data Implementation Guide

## Overview

This guide explains the structured data (schema markup) implementation for CodeClinic.nl, which helps search engines understand the business information and improves local SEO visibility.

## What is Structured Data?

Structured data is a standardized format for providing information about a page and classifying the page content. It helps search engines understand:
- What your business is
- Where you're located
- What services you offer
- Your contact information
- Your business hours
- Customer reviews and ratings

## Implemented Schema Types

### 1. LocalBusiness Schema
The primary schema that defines CodeClinic as a local business in Rotterdam.

**Key Information Included:**
- Business name and description
- Contact information (phone, email)
- Address and geographic coordinates
- Opening hours
- Service types and pricing
- Service area (Rotterdam and surrounding cities)
- Customer reviews and ratings
- "No cure no pay" guarantee

**Benefits:**
- Appears in Google Maps results
- Shows in local search results
- Displays business information in knowledge panels
- Improves local SEO rankings

### 2. Organization Schema
Provides general organizational information about CodeClinic.

**Key Information Included:**
- Company details
- Contact points
- Service areas
- Business expertise

### 3. WebSite Schema
Defines the website structure and search capabilities.

**Key Information Included:**
- Website metadata
- Search functionality
- Language settings

### 4. BreadcrumbList Schema
Helps search engines understand the website navigation structure.

**Key Information Included:**
- Page hierarchy
- Navigation structure

### 5. FAQPage Schema (FAQ page only)
Structures frequently asked questions for better search visibility.

**Key Information Included:**
- Questions and answers
- Helps with featured snippets in search results

## File Structure

```
components/
├── StructuredData.tsx          # Main structured data component
└── ...

app/
├── layout.tsx                  # Uses StructuredData for home page
├── faq/
│   └── page.tsx               # Uses StructuredData with FAQ schema
└── ...
```

## How to Update Structured Data

### 1. Business Information Updates

To update business information, edit the `StructuredData.tsx` component:

```typescript
// Update business details
const localBusinessSchema = {
  "name": "CodeClinic.nl",
  "telephone": "+31-6-24837889",
  "email": "info@codeclinic.nl",
  // ... other fields
};
```

### 2. Service Updates

To add or modify services, update the `hasOfferCatalog` section:

```typescript
"hasOfferCatalog": {
  "@type": "OfferCatalog",
  "name": "Computer Services",
  "itemListElement": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "New Service Name",
        "description": "Service description",
        "price": "50",
        "priceCurrency": "EUR"
      }
    }
    // ... other services
  ]
}
```

### 3. Service Area Updates

To modify the service area, update the `areaServed` array:

```typescript
"areaServed": [
  {
    "@type": "City",
    "name": "Rotterdam"
  },
  {
    "@type": "City", 
    "name": "New City"
  }
  // ... other cities
]
```

### 4. FAQ Updates

To add new FAQ items, update the `faqSchema` in the component:

```typescript
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "New Question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text here."
      }
    }
    // ... other questions
  ]
};
```

## Important Fields to Keep Updated

### Contact Information
- Phone number: `+31-6-24837889`
- Email: `info@codeclinic.nl`
- Address: Rotterdam, Zuid-Holland

### Business Hours
```typescript
"openingHours": [
  "Mo-Fr 09:00-17:00",
  "Sa 10:00-15:00"
]
```

### Service Area
Currently includes: Rotterdam, Schiedam, Vlaardingen, Capelle aan den IJssel, Spijkenisse, Barendrecht, Ridderkerk, Krimpen aan den IJssel, Brielle, Hellevoetsluis

### Pricing Information
Keep service prices updated to match current rates:
- Virus removal: €49
- Computer optimization: €39
- WiFi optimization: €45
- Remote help: €35/hour
- Home service: €45/hour

## Testing Structured Data

### 1. Google's Rich Results Test
Visit: https://search.google.com/test/rich-results
- Enter your URL or paste the structured data code
- Check for errors and warnings
- Verify that all schemas are recognized

### 2. Google's Structured Data Testing Tool
Visit: https://search.google.com/structured-data/testing-tool
- Test individual schema implementations
- Validate JSON-LD format

### 3. Schema.org Validator
Visit: https://validator.schema.org/
- Validate schema markup
- Check for syntax errors

## Best Practices

### 1. Keep Information Accurate
- Update contact information immediately when it changes
- Ensure business hours are current
- Keep service prices up to date

### 2. Use Specific Data
- Include exact prices with currency
- Specify service areas precisely
- Use proper geographic coordinates

### 3. Maintain Consistency
- Ensure NAP (Name, Address, Phone) consistency across all platforms
- Keep information consistent with Google My Business listing
- Update all schema types when business information changes

### 4. Monitor Performance
- Use Google Search Console to monitor rich results
- Track local search performance
- Monitor knowledge panel appearances

## Troubleshooting

### Common Issues

1. **Schema Not Appearing in Search Results**
   - Check for syntax errors
   - Verify schema is properly implemented
   - Allow time for Google to crawl and index

2. **Incorrect Business Information**
   - Update all schema types
   - Clear cache and re-crawl
   - Verify with Google's testing tools

3. **Missing Rich Results**
   - Ensure schema markup is valid
   - Check for conflicting schema types
   - Verify page is indexed by Google

### Validation Checklist

- [ ] All required fields are present
- [ ] JSON-LD syntax is valid
- [ ] Schema types are appropriate
- [ ] Business information is accurate
- [ ] Contact information is current
- [ ] Service information is up to date
- [ ] Geographic information is correct

## Future Enhancements

### Potential Additions

1. **Review Schema**
   - Add more customer reviews
   - Include review dates and ratings

2. **Event Schema**
   - For special promotions or events
   - Seasonal service offerings

3. **Article Schema**
   - For blog posts or service guides
   - Technical articles and tips

4. **Service Schema**
   - More detailed service descriptions
   - Service availability and scheduling

## Resources

- [Schema.org Documentation](https://schema.org/)
- [Google's Structured Data Guidelines](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)
- [LocalBusiness Schema Reference](https://schema.org/LocalBusiness)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

## Support

For questions about structured data implementation or updates, refer to this guide or consult with the development team. Regular maintenance and updates are essential for optimal local SEO performance. 