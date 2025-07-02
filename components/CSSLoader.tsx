'use client';

import { useEffect } from 'react';

interface CSSLoaderProps {
  href: string;
  media?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function CSSLoader({ 
  href, 
  media = 'all', 
  onLoad, 
  onError 
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
    
    // Load CSS after a short delay to prioritize critical content
    const timer = setTimeout(() => {
      document.head.appendChild(link);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [href, media, onLoad, onError]);
  
  return null;
}

// Component for loading calendar CSS only when needed
export function CalendarCSSLoader() {
  return (
    <CSSLoader 
      href="/_next/static/css/app/calendar.css"
      onLoad={() => console.log('Calendar CSS loaded')}
      onError={() => console.error('Failed to load calendar CSS')}
    />
  );
}

// Component for loading additional styles
export function AdditionalCSSLoader() {
  return (
    <CSSLoader 
      href="/_next/static/css/app/additional.css"
      onLoad={() => console.log('Additional CSS loaded')}
      onError={() => console.error('Failed to load additional CSS')}
    />
  );
} 