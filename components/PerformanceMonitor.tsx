'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

// Add LayoutShift interface for type safety
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and if PerformanceObserver is available
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
      return;
    }

    const metrics: PerformanceMetrics = {
      fcp: 0,
      lcp: 0,
      fid: 0,
      cls: 0,
      ttfb: 0,
    };

    // Track First Contentful Paint (FCP)
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries[entries.length - 1];
        if (fcpEntry) {
          metrics.fcp = fcpEntry.startTime;
          console.log(`🎨 FCP: ${metrics.fcp.toFixed(2)}ms`);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    }

    // Track Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        if (lcpEntry) {
          metrics.lcp = lcpEntry.startTime;
          console.log(`📊 LCP: ${metrics.lcp.toFixed(2)}ms`);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Track First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input') {
            metrics.fid = entry.processingStart - entry.startTime;
            console.log(`⚡ FID: ${metrics.fid.toFixed(2)}ms`);
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }

    // Track Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          // Type guard for LayoutShift
          if ('hadRecentInput' in entry && 'value' in entry) {
            const layoutShift = entry as LayoutShift;
            // @ts-expect-error: hadRecentInput is not in the base type, but is present on LayoutShift
            if (!layoutShift.hadRecentInput) {
              clsValue += layoutShift.value;
              metrics.cls = clsValue;
              console.log(`📐 CLS: ${clsValue.toFixed(4)}`);
            }
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }

    // Track Time to First Byte (TTFB)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      console.log(`🌐 TTFB: ${metrics.ttfb.toFixed(2)}ms`);
    }

    // Log performance summary after page load
    const logPerformanceSummary = () => {
      console.log('🚀 Performance Summary:');
      console.log(`   FCP: ${metrics.fcp.toFixed(2)}ms ${metrics.fcp < 1800 ? '✅' : '⚠️'}`);
      console.log(`   LCP: ${metrics.lcp.toFixed(2)}ms ${metrics.lcp < 2500 ? '✅' : '⚠️'}`);
      console.log(`   FID: ${metrics.fid.toFixed(2)}ms ${metrics.fid < 100 ? '✅' : '⚠️'}`);
      console.log(`   CLS: ${metrics.cls.toFixed(4)} ${metrics.cls < 0.1 ? '✅' : '⚠️'}`);
      console.log(`   TTFB: ${metrics.ttfb.toFixed(2)}ms ${metrics.ttfb < 600 ? '✅' : '⚠️'}`);

      // Send to analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'performance_metrics', {
          fcp: metrics.fcp,
          lcp: metrics.lcp,
          fid: metrics.fid,
          cls: metrics.cls,
          ttfb: metrics.ttfb,
        });
      }
    };

    // Log summary after a delay to capture all metrics
    setTimeout(logPerformanceSummary, 5000);

    // Cleanup observers
    return () => {
      if ('PerformanceObserver' in window) {
        // PerformanceObserver cleanup is automatic
      }
    };
  }, []);

  // This component doesn't render anything
  return null;
} 