# Keyboard Navigation & Accessibility Test Guide

## Overview
This guide provides a comprehensive testing checklist to ensure the CodeClinic.nl website is fully accessible via keyboard navigation and meets WCAG 2.1 AA standards.

## Pre-Test Setup
1. **Disable mouse/trackpad** or use only keyboard
2. **Enable screen reader** (NVDA, JAWS, or VoiceOver)
3. **Set browser zoom** to 100% initially, then test at 200%
4. **Enable high contrast mode** in OS settings

## Test Checklist

### 1. Skip Link Navigation
- [ ] Press Tab on page load - skip link should appear
- [ ] Press Enter on skip link - should jump to main content
- [ ] Skip link should be visible when focused
- [ ] Skip link should announce "Spring naar hoofdinhoud"

### 2. Header Navigation
- [ ] Tab through all navigation links
- [ ] Each link should have visible focus indicator
- [ ] Logo link should be focusable and announce "CodeClinic.nl - Ga naar homepage"
- [ ] Phone number should be focusable and announce "Bel ons direct: +31 6 24837889"
- [ ] Mobile menu button should announce "Open mobiel menu" / "Sluit mobiel menu"
- [ ] Mobile menu should trap focus when open
- [ ] Escape key should close mobile menu
- [ ] Tab navigation should work within mobile menu

### 3. Hero Section
- [ ] All interactive elements should be focusable
- [ ] Focus indicators should be visible against gradient background
- [ ] Text should be readable with screen reader

### 4. Services Section
- [ ] Tab through all service cards
- [ ] Each card should announce service title and description
- [ ] Press Enter/Space on service card - should expand/collapse
- [ ] Focus should move to expanded content
- [ ] "Plan een Afspraak" buttons should be focusable
- [ ] All buttons should have proper ARIA labels

### 5. Calendar Component (Critical)
- [ ] Tab to calendar navigation buttons
- [ ] Previous/Next month buttons should work with Enter/Space
- [ ] Tab to calendar grid
- [ ] Arrow keys should navigate between days
- [ ] Home/End keys should jump to first/last day
- [ ] Enter/Space should select date
- [ ] Screen reader should announce:
  - Current month/year
  - Day numbers and availability
  - Selected date
  - Past dates as "Verstreken datum"

### 6. Time Selection
- [ ] Tab to time grid after date selection
- [ ] Arrow keys should navigate between time slots
- [ ] Enter/Space should select time
- [ ] Screen reader should announce:
  - Available times
  - Selected time
  - Booked times as unavailable

### 7. Booking Form
- [ ] Tab through all form fields
- [ ] Each field should have proper label association
- [ ] Required fields should announce "required"
- [ ] Error messages should be announced
- [ ] Submit button should announce status
- [ ] Form validation should work with keyboard

### 8. Contact Section
- [ ] Phone contact section should be prominent
- [ ] Phone number should be large and focusable
- [ ] Alternative contact methods should be accessible
- [ ] Appointment type selection should work with keyboard

### 9. Footer
- [ ] All links should be focusable
- [ ] Phone and email should be clickable
- [ ] Focus indicators should be visible

### 10. General Keyboard Navigation
- [ ] Tab order should be logical and intuitive
- [ ] No focus traps (except intentional ones like modals)
- [ ] All interactive elements should be reachable
- [ ] Focus indicators should be visible and high contrast

## Screen Reader Testing

### NVDA (Windows)
1. **Install NVDA** and enable it
2. **Navigate with Tab** - should announce focusable elements
3. **Use arrow keys** in calendar - should announce dates
4. **Use Enter/Space** - should announce actions
5. **Check landmarks** - should announce sections properly

### VoiceOver (Mac)
1. **Enable VoiceOver** (Cmd+F5)
2. **Navigate with VO+Arrow keys**
3. **Use VO+Space** to activate elements
4. **Check rotor** for headings and landmarks

### JAWS (Windows)
1. **Install JAWS** and enable it
2. **Use Tab** for navigation
3. **Use Enter** to activate
4. **Check virtual cursor** for reading content

## High Contrast Testing
1. **Enable high contrast mode** in OS
2. **Verify all text** is readable
3. **Check focus indicators** are visible
4. **Test all interactive elements**

## Zoom Testing
1. **Zoom to 200%** - layout should remain usable
2. **Zoom to 400%** - horizontal scrolling should be minimal
3. **Check text size** - should remain readable
4. **Test navigation** at different zoom levels

## Color Contrast Testing
1. **Use browser dev tools** to check contrast ratios
2. **All text** should have 4.5:1 contrast minimum
3. **Large text** should have 3:1 contrast minimum
4. **Focus indicators** should have 3:1 contrast minimum

## Mobile Accessibility Testing
1. **Test on mobile device** with screen reader
2. **Use TalkBack** (Android) or VoiceOver (iOS)
3. **Test touch targets** - minimum 44px
4. **Check gesture navigation**

## Automated Testing Tools
1. **axe-core** - Run automated accessibility tests
2. **Lighthouse** - Check accessibility score
3. **WAVE** - Web accessibility evaluation tool
4. **Color Contrast Analyzer** - Check color ratios

## Common Issues to Check
- [ ] Missing alt text on images
- [ ] Improper heading hierarchy
- [ ] Missing form labels
- [ ] Insufficient color contrast
- [ ] Keyboard traps
- [ ] Missing ARIA labels
- [ ] Non-semantic HTML
- [ ] Missing focus indicators

## Success Criteria
- [ ] All functionality accessible via keyboard
- [ ] Screen reader announces all content properly
- [ ] Focus indicators visible and high contrast
- [ ] No keyboard traps
- [ ] Logical tab order
- [ ] Proper ARIA implementation
- [ ] WCAG 2.1 AA compliance

## Notes
- Test with different browsers (Chrome, Firefox, Safari, Edge)
- Test with different screen readers
- Test with different zoom levels
- Test with high contrast mode
- Document any issues found
- Retest after fixes are implemented

## Phone Contact Prominence
The phone contact option is now highly visible with:
- Large, prominent phone number display
- High contrast styling
- Clear call-to-action
- Multiple contact points throughout the site
- Keyboard accessible phone links
- Screen reader announcements

This ensures users who find the calendar difficult have a clear, accessible alternative contact method. 