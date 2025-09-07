export const measurePerformance = () => {
  if (typeof window === 'undefined') return;

  // Measure initial page load
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    console.log('Performance Metrics:');
    console.log(`- DOM Content Loaded: ${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
    console.log(`- Load Complete: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
    console.log(`- Total Load Time: ${navigation.loadEventEnd - navigation.fetchStart}ms`);
  }

  // Measure First Contentful Paint
  const paintEntries = performance.getEntriesByType('paint');
  const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  if (fcp) {
    console.log(`- First Contentful Paint: ${fcp.startTime}ms`);
  }

  // Measure Largest Contentful Paint
  const lcp = paintEntries.find(entry => entry.name === 'largest-contentful-paint');
  if (lcp) {
    console.log(`- Largest Contentful Paint: ${lcp.startTime}ms`);
  }

  // Monitor for layout shifts
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          const layoutShift = entry as PerformanceEntry & { value: number };
          if (layoutShift.value > 0.1) {
            console.warn('Layout shift detected:', layoutShift);
          }
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch {
      // Browser doesn't support layout-shift
    }
  }
};

export const logComponentLoadTime = (componentName: string, startTime: number) => {
  const loadTime = performance.now() - startTime;
  console.log(`${componentName} loaded in: ${loadTime.toFixed(2)}ms`);
};

export const measureBundleSize = () => {
  if (typeof window === 'undefined') return;

  // Estimate bundle size from performance entries
  const resources = performance.getEntriesByType('resource');
  const totalSize = resources.reduce((acc, resource) => {
    const transferSize = (resource as PerformanceResourceTiming).transferSize || 0;
    return acc + transferSize;
  }, 0);

  console.log(`Estimated total transfer size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
}; 