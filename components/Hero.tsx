"use client";

import { useEffect, useState, useCallback, useRef, useMemo, lazy, Suspense } from 'react';
import TextAnimation from './TextAnimation';
const BinaryMorphParticles = lazy(() => import('./BinaryMorphParticles'));

export default function Hero() {
  const [showLogo, setShowLogo] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showIllustration, setShowIllustration] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [startWriting, setStartWriting] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isParticlesVisible, setIsParticlesVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isLowEnd = typeof window !== 'undefined' ? window.navigator.hardwareConcurrency <= 4 : false;
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 || window.devicePixelRatio > 2 : false;

  const PARTICLE_COUNT = useMemo(() => {
    if (prefersReducedMotion || isLowEnd) return 0;
    return isMobile ? 10 : 15;
  }, [prefersReducedMotion, isLowEnd, isMobile]);

  const MAX_SIZE = useMemo(() => isLowEnd ? 4 : 6, [isLowEnd]);

  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }), [PARTICLE_COUNT]);

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

  // Intersection Observer for particles visibility
  useEffect(() => {
    if (!particlesContainerRef.current || isLowEnd) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsParticlesVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(particlesContainerRef.current);
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
    if (isLowEnd) {
      // For low-end devices, show everything immediately with minimal animations
      setShowLogo(true);
      setShowContent(true);
      setStartWriting(true);
      setShowParticles(false);
      setShowIllustration(true);
      setShowMetrics(true);
      setShowScrollIndicator(true);
      return;
    }

    // For high-end devices, keep the smooth animation sequence
    const timer1 = setTimeout(() => setShowLogo(true), 100);
    const timer2 = setTimeout(() => {
      setShowLogo(false);
      setShowContent(true);
    }, 2000);
    const timer3 = setTimeout(() => setStartWriting(true), 2500);
    const timer4 = setTimeout(() => {
      setShowParticles(true);
      setShowIllustration(true);
      setShowMetrics(true);
      setShowScrollIndicator(true);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isLowEnd]);

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

      {/* Binary Morph Particles with lazy loading or static circles for low-end */}
      {!isLowEnd && (
        <div ref={particlesContainerRef} className={`absolute inset-0 z-10 transition-opacity duration-500 ${showParticles ? 'opacity-100' : 'opacity-0'}`} style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
          <div className="absolute right-0 top-0 w-[40%] h-full">
            {isParticlesVisible && !prefersReducedMotion && (
              <Suspense fallback={null}>
                <BinaryMorphParticles startAnimation={showParticles} />
              </Suspense>
            )}
          </div>
        </div>
      )}

      {/* Logo and writing */}
      {!isLowEnd && (
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 z-30
            ${showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        >
          <img 
            src="/logo-cc.png" 
            alt="CodeClinic Logo" 
            className="w-48 h-48 object-contain mb-4"
          />
          <div className="relative">
            <h1 className="text-2xl font-bold text-white">
              <span style={{
                display: 'inline-block',
                width: isLowEnd ? 'auto' : '0',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                animation: isLowEnd ? 'none' : 'typing 0.8s ease-out forwards',
                willChange: 'width'
              }}>
                codeclinic.nl
              </span>
            </h1>
          </div>
        </div>
      )}

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
        className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 transition-all duration-500 ${
          showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span className="text-sm text-white/60 font-medium">Scroll naar beneden</span>
        <svg 
          className="w-6 h-6 text-white/80 hover:text-white transition-colors cursor-pointer animate-scroll-chevron" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          aria-label="Scroll naar beneden"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}