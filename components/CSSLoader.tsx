'use client';

import { useEffect } from 'react';

interface CSSLoaderProps {
  href: string;
  media?: string;
  onLoad?: () => void;
}

export default function CSSLoader({ href, media = 'all', onLoad }: CSSLoaderProps) {
  useEffect(() => {
    // Check if CSS is already loaded
    const existingLink = document.querySelector(`link[href*="${href.split('/').pop()}"]`);
    if (existingLink) {
      onLoad?.();
      return;
    }

    // Create link element for non-critical CSS
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.media = 'print';
    
    // Convert to stylesheet after load
    link.onload = () => {
      link.rel = 'stylesheet';
      link.media = media;
      link.onload = null;
      onLoad?.();
    };

    // Fallback for browsers that don't support preload
    link.onerror = () => {
      link.rel = 'stylesheet';
      link.media = media;
      onLoad?.();
    };

    // Add to head
    document.head.appendChild(link);

    // Cleanup function
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    };
  }, [href, media, onLoad]);

  return null;
}
