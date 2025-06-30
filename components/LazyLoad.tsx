'use client';

import { useEffect, useState, useCallback } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  delay?: number;
  fallback?: React.ReactNode;
}

export default function LazyLoad({ children, delay = 1000, fallback = null }: LazyLoadProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    try {
      setShouldLoad(true);
    } catch (error) {
      console.error('LazyLoad error:', error);
      setHasError(true);
    }
  }, []);

  useEffect(() => {
    // Check if we should load immediately (no delay or delay is 0)
    if (delay <= 0) {
      handleLoad();
      return;
    }

    const timer = setTimeout(handleLoad, delay);
    return () => clearTimeout(timer);
  }, [delay, handleLoad]);

  // If there's an error, render fallback or children directly
  if (hasError) {
    return <>{children}</>;
  }

  if (!shouldLoad) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 