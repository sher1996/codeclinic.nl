'use client';

import { useEffect } from 'react';

export default function CSSLoader() {
  useEffect(() => {
    // Load non-critical CSS after the page has loaded
    const loadNonCriticalCSS = () => {
      // Load globals.css
      const globalsLink = document.createElement('link');
      globalsLink.rel = 'stylesheet';
      globalsLink.href = '/_next/static/css/app/globals.css';
      document.head.appendChild(globalsLink);

      // Load calendar.css
      const calendarLink = document.createElement('link');
      calendarLink.rel = 'stylesheet';
      calendarLink.href = '/_next/static/css/app/calendar.css';
      document.head.appendChild(calendarLink);
    };

    // Load CSS after a short delay to prioritize critical content
    const timer = setTimeout(loadNonCriticalCSS, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
} 