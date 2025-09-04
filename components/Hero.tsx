"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load SimpleSentenceSwitcher to improve LCP
const SimpleSentenceSwitcher = dynamic(() => import('./SimpleSentenceSwitcher'), {
  ssr: false,
  loading: () => (
    <p className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-8">
      Direct professionele hulp bij al uw computerproblemen in Rotterdam.
    </p>
  )
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Optimize hardware detection with requestIdleCallback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use requestIdleCallback to defer non-critical work
      const detectHardware = () => {
        setIsLowEnd(window.navigator.hardwareConcurrency <= 4);
        setIsVisible(true);
      };
      
      if ('requestIdleCallback' in window) {
        requestIdleCallback(detectHardware, { timeout: 100 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(detectHardware, 0);
      }
    }
  }, []);

  // Optimized intersection observer with passive listeners
  useEffect(() => {
    if (isLowEnd || !heroRef.current) {
      return;
    }

    // Use passive intersection observer for better performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start observing earlier
      }
    );

    // Defer observer creation to avoid blocking main thread
    requestIdleCallback(() => {
      if (heroRef.current) {
        observer.observe(heroRef.current);
      }
    }, { timeout: 100 });

    return () => observer.disconnect();
  }, [isLowEnd]);

  return (
    <div className="relative isolate overflow-hidden bg-[#1F2C90]/20" style={{ 
      background: isLowEnd ? '#1F2C90' : 'radial-gradient(ellipse at center, #1F2C90 0%, #2B3CA0 20%, #4F4F00 100%)',
      willChange: 'transform',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden'
    }}>
      {/* Optimized overlay for better readability */}
      <div className="absolute inset-0 -bottom-16 bg-black/10 mix-blend-overlay pointer-events-none" style={{ 
        willChange: 'transform', 
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}></div>
      
      <section
        ref={heroRef}
        id="hero"
        className="relative py-48 sm:py-56 lg:py-64"
        aria-label="Hero section"
        style={{ 
          minHeight: '100vh',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-1 md:col-span-12">
              <div className="text-white py-24 sm:py-32 lg:py-40 w-full">
                <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl lg:max-w-[18ch] mb-6" style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}>
                  Expert computerhulp
                </h1>
                {isVisible && <SimpleSentenceSwitcher />}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll indicator - optimized for CLS */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 z-40" 
        style={{ 
          position: 'absolute', 
          bottom: '1.5rem', 
          left: '50%', 
          transform: 'translateX(-50%)',
          width: '120px',
          height: '60px',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="scroll-indicator" style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}>
          <span className="scroll-indicator-text">Scroll om meer te zien</span>
          <div className="scroll-indicator-arrow">
            <div className="scroll-indicator-dot" style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}