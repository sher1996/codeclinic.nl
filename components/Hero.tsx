"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import TextAnimation from './TextAnimation';

export default function Hero() {
  const [showContent, setShowContent] = useState(true);
  const [startWriting, setStartWriting] = useState(true);
  const [showIllustration, setShowIllustration] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
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

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`relative isolate overflow-hidden ${isLowEnd ? 'bg-[#1F2C90]/20' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20'} min-h-screen flex items-center`}
      aria-label="Hero section"
      onMouseMove={handleMouseMove}
      style={{ willChange: isLowEnd ? 'auto' : 'transform', transform: isLowEnd ? 'none' : 'translateZ(0)' }}
    >
      {/* Content */}
      <div
        className="transition-all duration-700 relative mx-auto max-w-7xl px-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-8 w-full opacity-100 scale-100 z-50"
      >
        {/* Left column — copy */}
        <div className="text-white lg:col-span-12">
          <TextAnimation startWriting={startWriting} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-500 z-40 opacity-100 translate-y-0"
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