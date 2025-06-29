'use client';

import { useEffect, useState } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  delay?: number;
  fallback?: React.ReactNode;
}

export default function LazyLoad({ children, delay = 1000, fallback = null }: LazyLoadProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!shouldLoad) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
} 