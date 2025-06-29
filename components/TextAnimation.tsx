import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TextAnimationProps {
  className?: string;
  startWriting?: boolean;
}

export default function TextAnimation({ className = '', startWriting = false }: TextAnimationProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const isLowEnd = typeof window !== 'undefined' ? window.navigator.hardwareConcurrency <= 4 : false;
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  const texts = useMemo(() => [
    'Direct professionele hulp bij al uw computerproblemen in Rotterdam.',
    '90% van de problemen opgelost in één keer - geen voorrijkosten in Rotterdam.'
  ], []);

  // Start typing when startWriting becomes true
  useEffect(() => {
    if (startWriting && !isTyping) {
      setIsTyping(true);
      setDisplayText(''); // Reset text when starting
      setCurrentIndex(0); // Reset to first text
      setOpacity(1); // Reset opacity
    }
  }, [startWriting, isTyping]);

  useEffect(() => {
    if (isLowEnd || prefersReducedMotion) {
      // For low-end devices or reduced motion preference, just show the text immediately
      setDisplayText(texts[0]);
      return;
    }

    if (!isTyping) return; // Don't start animation if not typing

    // Original smooth typing animation for high-end devices
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;

      if (displayText === texts[currentIndex]) {
        if (elapsed >= 3000) { // Wait 3 seconds before fade out
          setOpacity(0);
          if (elapsed >= 3800) { // After 800ms fade out
            setDisplayText('');
            setCurrentIndex((prev) => (prev + 1) % texts.length);
            setOpacity(1);
            lastTimeRef.current = timestamp;
          }
        }
      } else {
        // Smoother typing with consistent timing
        const typingSpeed = 50; // Slightly slower for better readability
        if (elapsed >= typingSpeed) {
          setDisplayText((prev) => texts[currentIndex].slice(0, prev.length + 1));
          lastTimeRef.current = timestamp;
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [displayText, currentIndex, texts, isLowEnd, prefersReducedMotion, isTyping]);

  return (
    <div className={`relative ${className}`}>
      <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl lg:max-w-[18ch] mb-10">
        Expert computerhulp
      </h1>
      <p 
        className="text-lg leading-[1.6] text-white/90 max-w-[45ch] mb-16 min-h-[3em] transition-opacity duration-500 ease-in-out senior-description"
        style={{ 
          opacity,
          transition: isLowEnd ? 'none' : 'opacity 0.3s ease-in-out'
        }}
      >
        {displayText}
      </p>
      <motion.a 
        href="#contact"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="group relative inline-flex items-center gap-3 bg-[#00d4ff] text-white font-medium px-8 py-4 rounded-lg transition-all duration-300 hover:bg-[#00b8e6] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
      >
        <span className="relative z-10">Plan een afspraak</span>
        <ChevronRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
      </motion.a>
    </div>
  );
} 