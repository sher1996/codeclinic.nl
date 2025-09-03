'use client';

import { useEffect } from 'react';

interface CSSLoaderProps {
  href: string;
  media?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: 'high' | 'low';
}

export default function CSSLoader({ 
  href, 
  media = 'all', 
  onLoad, 
  onError,
  priority = 'low'
}: CSSLoaderProps) {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = media;
    
    if (onLoad) {
      link.onload = onLoad;
    }
    
    if (onError) {
      link.onerror = onError;
    }
    
    // Load CSS based on priority
    if (priority === 'high') {
      // Load immediately for critical CSS
      document.head.appendChild(link);
    } else {
      // Defer non-critical CSS loading
      const timer = setTimeout(() => {
        document.head.appendChild(link);
      }, 100);
      
      return () => {
        clearTimeout(timer);
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [href, media, onLoad, onError, priority]);
  
  return null;
}

// Component for loading multiple CSS files
export function CSSLoaderManager() {
  useEffect(() => {
    // Load globals.css with medium priority (after critical CSS)
    const globalsLink = document.createElement('link');
    globalsLink.rel = 'stylesheet';
    globalsLink.href = '/globals.css';
    globalsLink.media = 'all';
    globalsLink.crossOrigin = 'anonymous';
    
    // Load calendar.css with low priority (only when needed)
    const calendarLink = document.createElement('link');
    calendarLink.rel = 'stylesheet';
    calendarLink.href = '/calendar.css';
    calendarLink.media = 'all';
    calendarLink.crossOrigin = 'anonymous';
    
    // Load globals.css after a short delay to avoid blocking critical path
    const loadGlobals = () => {
      if (!document.head.contains(globalsLink)) {
        document.head.appendChild(globalsLink);
      }
    };
    
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadGlobals, { timeout: 100 });
    } else {
      setTimeout(loadGlobals, 50);
    }
    
    // Load calendar.css only when calendar component is in viewport
    const loadCalendarCSS = () => {
      const calendarElement = document.querySelector('.appointment-calendar, [data-calendar-container]');
      if (calendarElement && !document.head.contains(calendarLink)) {
        document.head.appendChild(calendarLink);
      }
    };
    
    // Check if calendar is in viewport with optimized observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadCalendarCSS();
          observer.disconnect();
        }
      });
    }, {
      rootMargin: '50px', // Start loading 50px before element is visible
      threshold: 0.1
    });
    
    // Look for calendar container with multiple selectors
    const calendarContainer = document.querySelector('[data-calendar-container], .appointment-calendar, #contact');
    if (calendarContainer) {
      observer.observe(calendarContainer);
    } else {
      // Fallback: load calendar CSS after a delay if no calendar found
      setTimeout(() => {
        const fallbackCalendar = document.querySelector('[data-calendar-container], .appointment-calendar, #contact');
        if (fallbackCalendar) {
          observer.observe(fallbackCalendar);
        } else {
          // Load calendar CSS anyway after 2 seconds as fallback
          setTimeout(loadCalendarCSS, 2000);
        }
      }, 1000);
    }
    
    return () => {
      if (document.head.contains(globalsLink)) {
        document.head.removeChild(globalsLink);
      }
      if (document.head.contains(calendarLink)) {
        document.head.removeChild(calendarLink);
      }
      observer.disconnect();
    };
  }, []);
  
  return null;
}

// Component for loading calendar CSS only when needed
export function CalendarCSSLoader() {
  // Calendar CSS is already imported in the app, no need to load dynamically
  return null;
}

// Component for loading additional styles
export function AdditionalCSSLoader() {
  // Additional CSS is already imported in the app, no need to load dynamically
  return null;
} 