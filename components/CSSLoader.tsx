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
  // Calendar CSS is already imported in the app, no need to load dynamically
  return null;
}

// Component for loading additional styles
export function AdditionalCSSLoader() {
  // Additional CSS is already imported in the app, no need to load dynamically
  return null;
} 