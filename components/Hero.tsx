"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import TextAnimation from './TextAnimation';
import BinaryMorphParticles from './BinaryMorphParticles';

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
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  const isLowEnd = typeof window !== 'undefined' ? window.navigator.hardwareConcurrency <= 4 : false;
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 || window.devicePixelRatio > 2 : false;
  const isLowMemory = typeof window !== 'undefined' ? 
    (window.navigator.hardwareConcurrency <= 2 || window.devicePixelRatio > 2) : false;

  const PARTICLE_COUNT = isLowMemory ? 50 : (isLowEnd ? 100 : (isMobile ? 150 : 200));
  const MAX_SIZE = isLowMemory ? 2 : (isLowEnd ? 3 : (isMobile ? 4 : 5));

  // Reduce animation complexity for low-end devices
  const animationDuration = isLowMemory ? 0.2 : (isLowEnd ? 0.3 : 0.5);
  const animationDelay = isLowMemory ? 0 : (isLowEnd ? 0.1 : 0.2);

  const particles = useMemo(() => Array.from({ length: PARTICLE_COUNT }), [PARTICLE_COUNT]);

  // Intersection Observer for fade-in effect
  useEffect(() => {
    if (isLowEnd || isLowMemory) {
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
  }, [isLowEnd, isLowMemory]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isLowEnd || isLowMemory) return; // Skip mouse move effects on low-end devices
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  }, [isLowEnd, isLowMemory]);

  useEffect(() => {
    setIsLoaded(true);
    // Reduce animation sequence timing for low-end devices
    const baseDelay = isLowMemory ? 500 : (isLowEnd ? 750 : 1000);
    
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
      setTimeout(() => {
        setShowContent(true);
        setTimeout(() => {
          setShowParticles(true);
          setTimeout(() => {
            setShowIllustration(true);
            setTimeout(() => {
              setShowMetrics(true);
              setTimeout(() => {
                setStartWriting(true);
                setTimeout(() => {
                  setShowScrollIndicator(true);
                }, baseDelay);
              }, baseDelay / 2);
            }, baseDelay / 2);
          }, baseDelay);
        }, baseDelay / 2);
      }, baseDelay / 2);
    }, baseDelay);
    return () => clearTimeout(logoTimer);
  }, [isLowEnd, isLowMemory]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20 backdrop-blur-sm min-h-screen flex items-center"
      aria-label="Hero section"
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 bg-black/30 mix-blend-overlay pointer-events-none"></div>

      {/* Binary Morph Particles */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${showParticles ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute right-0 top-0 w-[40%] h-full">
          <BinaryMorphParticles startAnimation={showParticles} />
        </div>
      </div>

      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
        aria-hidden="true"
      />

      {/* Particle layer */}
      <div className="absolute inset-0 overflow-hidden z-0" aria-hidden="true">
        {particles.map((_, i) => {
          const size = 3 + (i % 3);
          const top = (i * 20) % 100;
          const left = (i * 15) % 100;
          const hue = (i * 60) % 360;
          const delay = i * 0.5;
          const duration = 8 + (i % 4);
          
          return (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                backgroundColor: `hsla(${hue}, 70%, 50%, 0.05)`,
                ['--duration' as string]: `${duration}s`,
                ['--delay' as string]: `${delay}s`
              }}
            />
          );
        })}
      </div>

      {/* Radial spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/40 via-transparent to-transparent opacity-60 mix-blend-soft-light pointer-events-none" />

      {/* Logo */}
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
              width: '0',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              animation: 'typing 0.8s ease-out forwards',
              willChange: 'width'
            }}>
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