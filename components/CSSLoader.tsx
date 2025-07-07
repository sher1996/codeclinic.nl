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
    
    // Load calendar.css with low priority (only when needed)
    const calendarLink = document.createElement('link');
    calendarLink.rel = 'stylesheet';
    calendarLink.href = '/calendar.css';
    calendarLink.media = 'all';
    
    // Load globals.css after a short delay
    setTimeout(() => {
      document.head.appendChild(globalsLink);
    }, 50);
    
    // Load calendar.css only when calendar component is in viewport
    const loadCalendarCSS = () => {
      const calendarElement = document.querySelector('.appointment-calendar');
      if (calendarElement && !document.head.contains(calendarLink)) {
        document.head.appendChild(calendarLink);
      }
    };
    
    // Check if calendar is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadCalendarCSS();
          observer.disconnect();
        }
      });
    });
    
    const calendarContainer = document.querySelector('[data-calendar-container]');
    if (calendarContainer) {
      observer.observe(calendarContainer);
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