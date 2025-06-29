# Floating Testimonials Guide

## Overview
This project includes a development-only floating testimonial system that displays customer reviews as animated balloons throughout the website as users scroll. The testimonials appear like chat bubbles floating across the screen without interfering with existing content.

## Current Implementation

### Files Created
- `data/testimonials.dev.js` - Contains dummy testimonial data
- `components/FloatingTestimonials.tsx` - Floating balloon testimonials component
- `scripts/update-testimonials.js` - Helper script for updating testimonials

### Features
- ✅ Floating balloon testimonials throughout the website
- ✅ Environment-based display (hidden in production)
- ✅ Accessibility-friendly (respects reduced motion preferences)
- ✅ Scroll-responsive positioning
- ✅ Staggered appearance animations
- ✅ Non-intrusive (pointer-events-none)
- ✅ Beautiful balloon design with sparkles

## Development Usage

The floating testimonials are currently displayed in development mode only. In production, the testimonials will be hidden until real testimonials are added.

### Current Dummy Testimonials
- Lisa M. (Amsterdam) - PC speed improvement
- Karel V. (Den Haag) - OneDrive explanation
- Fatima S. (Rotterdam) - Evening service availability
- Johan B. (Utrecht) - Photo recovery

## How It Works

### Appearance
- Testimonials appear 2 seconds after page load
- Each testimonial appears with a 1.5-second stagger
- Balloons float gently with random animation delays
- Positioned randomly across 15-85% of viewport width and 20-80% height

### Animation Features
- **Gentle floating**: Subtle up/down movement with slight rotation
- **Balloon bounce**: Soft scaling animation
- **Sparkle effects**: Decorative animated dots
- **Scroll response**: Slight repositioning as user scrolls
- **Staggered entrance**: Each balloon appears individually

### Design Elements
- Blue gradient balloon with white border
- Balloon tail pointing downward
- Shine effect overlay
- Multiple colored sparkles
- Rounded corners and shadows

## Updating with Real Testimonials

### Step 1: Replace Dummy Data
Edit `data/testimonials.dev.js` and replace the `dummyTestimonials` array:

```javascript
export const testimonials = [
  {
    quote: "\"Supervriendelijk; kon meteen dezelfde dag langskomen.\"",
    author: "— Peter L. (Almere)",
  },
  // Add more real testimonials...
];
```

### Step 2: Remove Environment Check
Remove the production environment check:

```javascript
// Remove this line:
// export const testimonials = process.env.NODE_ENV === "production" ? [] : dummyTestimonials;

// Keep only:
export const testimonials = [
  // Your real testimonials here
];
```

### Step 3: Rename File
Rename `data/testimonials.dev.js` to `data/testimonials.js`

### Step 4: Update Import
Update the import in `components/FloatingTestimonials.tsx`:

```javascript
// Change from:
import { testimonials } from '@/data/testimonials.dev';

// To:
import { testimonials } from '@/data/testimonials';
```

### Step 5: Test
- Verify testimonials display correctly
- Check accessibility (reduced motion)
- Test scroll behavior
- Ensure balloons don't interfere with content

## Helper Script

Run the helper script to see current testimonials and get guidance:

```bash
node scripts/update-testimonials.js
```

## Accessibility Features

- **Reduced Motion**: All animations are disabled for users with `prefers-reduced-motion`
- **Screen Readers**: Testimonials are marked with `aria-hidden="true"` to avoid interference
- **Pointer Events**: Balloons don't interfere with clicking (`pointer-events-none`)
- **Keyboard Navigation**: No interactive elements that could interfere with navigation

## Styling Customization

The floating testimonials use these CSS classes:
- `.animate-float-gentle` - Main floating animation
- `.animate-balloon-bounce` - Balloon scaling animation
- `.animate-sparkle` - Sparkle dot animations
- `.bg-gradient-to-br` - Blue gradient background
- `.shadow-2xl` - Balloon shadow

## Best Practices

1. **Keep testimonials concise** - Aim for 1-2 sentences maximum
2. **Include location** - Helps with local credibility
3. **Use real names** - First name + last initial is sufficient
4. **Diverse feedback** - Include different types of services
5. **Regular updates** - Refresh testimonials periodically

## Troubleshooting

### Testimonials not showing
- Check if `NODE_ENV` is set to "production"
- Verify the import path is correct
- Ensure the testimonials array is not empty
- Check browser console for errors

### Animation issues
- Check if user has `prefers-reduced-motion` enabled
- Verify CSS animations are not disabled globally
- Test on different devices/browsers

### Positioning problems
- Check viewport dimensions
- Verify z-index values (z-50)
- Test on different screen sizes

### Performance issues
- Reduce number of testimonials if needed
- Check for memory leaks in scroll handlers
- Monitor animation performance on low-end devices 