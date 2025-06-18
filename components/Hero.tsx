"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import TextAnimation from './TextAnimation';

export default function Hero() {
  const [showLogo, setShowLogo] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showIllustration, setShowIllustration] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [startWriting, setStartWriting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isLowEnd = typeof window !== 'undefined' ? window.navigator.hardwareConcurrency <= 4 : false;
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 || window.devicePixelRatio > 2 : false;

  // Intersection Observer for fade-in effect
  useEffect(() => {
    if (isLowEnd) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, [isLowEnd]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isLowEnd) return;
    requestAnimationFrame(() => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 10;
      const y = (clientY / window.innerHeight - 0.5) * 10;
      setMousePosition({ x, y });
    });
  }, [isLowEnd]);

  useEffect(() => {
    // Smooth timing for fluid animations
    const timer1 = setTimeout(() => setShowLogo(true), 10);
    const timer2 = setTimeout(() => {
      setShowLogo(false);
      setShowContent(true);
    }, 1000); // Increased from 800ms for smoother transition
    const timer3 = setTimeout(() => setStartWriting(true), 1200); // Increased from 1000ms
    const timer4 = setTimeout(() => {
      setShowIllustration(true);
      setShowMetrics(true);
      setShowScrollIndicator(true);
    }, 1400); // Increased from 1200ms

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`relative isolate overflow-hidden ${isLowEnd ? 'bg-[#1F2C90]/20' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20 backdrop-blur-sm'} min-h-screen flex items-center`}
      aria-label="Hero section"
      onMouseMove={handleMouseMove}
      style={{ willChange: isLowEnd ? 'auto' : 'transform', transform: isLowEnd ? 'none' : 'translateZ(0)' }}
    >
      {!isLowEnd && (
        <>
          <div className="absolute inset-0 bg-black/30 mix-blend-overlay pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>

          {/* Noise overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-[1]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '200px 200px',
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
            aria-hidden="true"
          />

          {/* Radial spotlight effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/40 via-transparent to-transparent opacity-60 mix-blend-soft-light pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }} />
        </>
      )}

      {/* Logo and writing - Always show this section */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ease-out z-30
          ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ willChange: 'opacity, transform' }}
      >
        <img 
          src="/logo-cc.png" 
          alt="CodeClinic Logo" 
          className="w-48 h-48 object-contain mb-4 transition-transform duration-300 ease-out"
        />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white">
            <span 
              className={`inline-block whitespace-nowrap transition-all duration-300 ease-out ${
                prefersReducedMotion ? 'w-auto' : 'animate-typing'
              }`}
            >
              codeclinic.nl
            </span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-700 relative mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 w-full
          ${showContent ? 'opacity-100 scale-100 z-50' : 'opacity-0 scale-95 pointer-events-none z-0'}`}
      >
        {/* Left column — copy */}
        <div className="text-white lg:col-span-12">
          <TextAnimation startWriting={startWriting} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 z-40
          ${showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2">Scroll om meer te zien</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}