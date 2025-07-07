"use client";

import { useEffect, useRef } from 'react';
import SimpleSentenceSwitcher from './SimpleSentenceSwitcher';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const isLowEnd = typeof window !== 'undefined' ? window.navigator.hardwareConcurrency <= 4 : false;

  // Simplified intersection observer for fade-in effect
  useEffect(() => {
    if (isLowEnd || !heroRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [isLowEnd]);

  return (
    <div className={`relative isolate overflow-hidden ${isLowEnd ? 'bg-[#1F2C90]/20' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20'}`}>
      {/* Subtle dark overlay for better readability - extended beyond boundaries */}
      <div className="absolute inset-0 -bottom-16 bg-black/10 mix-blend-overlay pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>
      
      <section
        ref={heroRef}
        id="hero"
        className="relative py-48 sm:py-56 lg:py-64"
        aria-label="Hero section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-1 md:col-span-12">
              <div className="text-white py-24 sm:py-32 lg:py-40 w-full">
                <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl lg:max-w-[18ch] mb-6">
                  Expert computerhulp
                </h1>
                <SimpleSentenceSwitcher />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="absolute left-1/2 transform -translate-x-1/2 z-40" style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="scroll-indicator">
          <span className="scroll-indicator-text">Scroll om meer te zien</span>
          <div className="scroll-indicator-arrow">
            <div className="scroll-indicator-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
}