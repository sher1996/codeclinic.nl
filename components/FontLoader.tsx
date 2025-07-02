'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // Load Inter font
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);

    return () => {
      // Cleanup if needed
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return null;
} 