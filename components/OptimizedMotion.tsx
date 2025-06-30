'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load framer-motion only when complex animations are needed
const FramerMotion = dynamic(() => import('framer-motion').then(mod => ({
  default: { motion: mod.motion, AnimatePresence: mod.AnimatePresence }
})), {
  ssr: false,
  loading: () => null
});

// Simple CSS-based animations for better performance
export interface SimpleMotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  type?: 'fadeIn' | 'slideUp' | 'slideIn' | 'scale';
}

export function SimpleMotion({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 0.5,
  type = 'fadeIn' 
}: SimpleMotionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    switch (type) {
      case 'fadeIn':
        return isVisible ? 'opacity-100' : 'opacity-0';
      case 'slideUp':
        return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
      case 'slideIn':
        return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8';
      case 'scale':
        return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
      default:
        return isVisible ? 'opacity-100' : 'opacity-0';
    }
  };

  return (
    <div 
      className={`transition-all ease-out ${getAnimationClass()} ${className}`}
      style={{ 
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
}

// Intersection Observer based animation for scroll effects
export function ScrollMotion({ 
  children, 
  className = '', 
  type = 'fadeIn',
  threshold = 0.1 
}: SimpleMotionProps & { threshold?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  const getAnimationClass = () => {
    switch (type) {
      case 'fadeIn':
        return isVisible ? 'opacity-100' : 'opacity-0';
      case 'slideUp':
        return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';
      case 'slideIn':
        return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8';
      case 'scale':
        return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95';
      default:
        return isVisible ? 'opacity-100' : 'opacity-0';
    }
  };

  return (
    <div 
      ref={setRef}
      className={`transition-all duration-700 ease-out ${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
}

// Complex motion wrapper that loads framer-motion only when needed
export function ComplexMotion({ children, ...props }: any) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Only load framer-motion for complex animations when user interacts
    const handleInteraction = () => {
      setShouldLoad(true);
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('mousemove', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('mousemove', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  if (!shouldLoad) {
    return <div className="transition-all duration-300">{children}</div>;
  }

  return (
    <FramerMotion>
      {({ motion }: any) => (
        <motion.div {...props}>
          {children}
        </motion.div>
      )}
    </FramerMotion>
  );
} 