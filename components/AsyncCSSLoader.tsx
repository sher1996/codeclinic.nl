'use client';

import { useEffect } from 'react';

interface AsyncCSSLoaderProps {
  cssFiles: string[];
}

export default function AsyncCSSLoader({ cssFiles }: AsyncCSSLoaderProps) {
  useEffect(() => {
    // Function to load CSS asynchronously
    const loadCSS = (href: string): Promise<void> => {
      return new Promise((resolve) => {
        // Check if CSS is already loaded
        const existingLink = document.querySelector(`link[href*="${href.split('/').pop()}"]`);
        if (existingLink) {
          resolve();
          return;
        }

        // Create link element
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        link.media = 'print';
        
        // Convert to stylesheet after load
        link.onload = () => {
          link.rel = 'stylesheet';
          link.media = 'all';
          link.onload = null;
          resolve();
        };

        // Fallback for browsers that don't support preload
        link.onerror = () => {
          link.rel = 'stylesheet';
          link.media = 'all';
          resolve();
        };

        // Add to head
        document.head.appendChild(link);
      });
    };

    // Load all CSS files asynchronously
    const loadAllCSS = async () => {
      try {
        await Promise.all(cssFiles.map(loadCSS));
        console.log('✅ All non-critical CSS loaded successfully');
      } catch (error) {
        console.warn('⚠️ Some CSS files failed to load:', error);
      }
    };

    // Load CSS after a short delay to ensure critical CSS is applied first
    const timeoutId = setTimeout(loadAllCSS, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [cssFiles]);

  return null;
}
