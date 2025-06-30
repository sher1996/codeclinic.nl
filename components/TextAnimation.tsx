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
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
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

    // Simplified animation using setTimeout instead of requestAnimationFrame
    const animate = () => {
      if (displayText === texts[currentIndex]) {
        // Wait 3 seconds before fade out
        timeoutRef.current = setTimeout(() => {
          setOpacity(0);
          // After 800ms fade out, move to next text
          timeoutRef.current = setTimeout(() => {
            setDisplayText('');
            setCurrentIndex((prev) => (prev + 1) % texts.length);
            setOpacity(1);
            animate(); // Continue animation
          }, 800);
        }, 3000);
      } else {
        // Type one character at a time
        const typingSpeed = 50;
        timeoutRef.current = setTimeout(() => {
          setDisplayText((prev) => texts[currentIndex].slice(0, prev.length + 1));
          animate(); // Continue animation
        }, typingSpeed);
      }
    };

    animate();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
        className="group relative inline-flex items-center gap-3 bg-[#0066cc] text-white font-medium px-8 py-4 rounded-lg transition-all duration-300 hover:bg-[#0052a3] hover:shadow-[0_0_20px_rgba(0,102,204,0.3)]"
      >
        <span className="relative z-10">Plan een afspraak</span>
        <ChevronRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
      </motion.a>
    </div>
  );
} 