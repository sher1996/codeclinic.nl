'use client';

import { useEffect } from 'react';
import { measurePerformance, measureBundleSize } from '@/utils/performance';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Measure performance after page load
    const timer = setTimeout(() => {
      measurePerformance();
      measureBundleSize();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
} 