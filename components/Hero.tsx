"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import TextAnimation from './TextAnimation';
import BinaryMorphParticles from './BinaryMorphParticles';

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  const particles = Array.from({ length: PARTICLE_COUNT });

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isLowEnd || isLowMemory) return; // Skip mouse move effects on low-end devices
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

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

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero content */}
      <div className="relative z-10 text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          Computer Hulp
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-white/80 mb-8"
        >
          Professionele computerhulp bij u thuis
        </motion.p>
      </div>

      {/* Background particles */}
      {!isLoading && (
        <div className="absolute inset-0">
          {/* Particle system will be rendered here */}
        </div>
      )}
    </div>
  );
}