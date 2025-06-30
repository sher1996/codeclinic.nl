'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';

interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  loadOnInteraction?: boolean;
}

export default function LazyComponent({ 
  children, 
  fallback = null, 
  threshold = 0.1,
  loadOnInteraction = false 
}: LazyComponentProps) {
  const [shouldLoad, setShouldLoad] = useState(!loadOnInteraction);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (!loadOnInteraction) {
            setShouldLoad(true);
          }
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [shouldLoad, threshold, loadOnInteraction]);

  useEffect(() => {
    if (!loadOnInteraction || !isInView) return;

    const handleInteraction = () => {
      setShouldLoad(true);
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };

    document.addEventListener('mousemove', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, [loadOnInteraction, isInView]);

  return (
    <div ref={ref}>
      {shouldLoad ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

// Higher-order component for dynamic imports with lazy loading
export function withLazyLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallbackComponent?: React.ReactNode
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <LazyComponent fallback={fallbackComponent} loadOnInteraction>
        <WrappedComponent {...props} />
      </LazyComponent>
    );
  };
}

// Dynamic import wrapper with better error handling
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = dynamic(importFn, {
    ssr: false,
    loading: () => <>{fallback}</>,
  });

  return function OptimizedComponent(props: P) {
    return (
      <LazyComponent 
        fallback={fallback}
        loadOnInteraction
      >
        <LazyComponent {...props} />
      </LazyComponent>
    );
  };
} 