import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { testimonials } from '@/data/testimonials';

interface TextAnimationProps {
  className?: string;
}

interface ContentItem {
  type: 'text' | 'testimonial';
  content: string;
  author?: string;
}

export default function TextAnimation({ className = '' }: TextAnimationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const isLowEnd = typeof window !== 'undefined' ? window.navigator.hardwareConcurrency <= 4 : false;
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  // Create content array with texts and testimonials
  const contentItems: ContentItem[] = [
    { 
      type: 'testimonial', 
      content: 'Direct professionele hulp bij al uw computerproblemen in Rotterdam.',
      author: '— Onze belofte'
    },
    { 
      type: 'testimonial', 
      content: '90% van de problemen opgelost in één keer - geen voorrijkosten in Rotterdam.',
      author: '— Onze garantie'
    },
    ...testimonials.slice(0, 8).map(testimonial => ({
      type: 'testimonial' as const,
      content: testimonial.quote,
      author: testimonial.author
    }))
  ];

  useEffect(() => {
    if (isLowEnd || prefersReducedMotion) {
      // For low-end devices or reduced motion preference, just show the first text
      return;
    }

    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % contentItems.length);
        setIsVisible(true);
      }, 300); // Fade out duration
    }, 4000); // Change content every 4 seconds

    return () => clearInterval(interval);
  }, [isLowEnd, prefersReducedMotion, contentItems.length]);

  const currentItem = contentItems[currentIndex];

  return (
    <div className={`relative ${className}`}>
      <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl lg:max-w-[18ch] mb-10">
        Expert computerhulp
      </h1>
      
      <div 
        className="text-lg leading-[1.6] text-white/90 max-w-[45ch] mb-16 min-h-[3em] transition-opacity duration-300 ease-in-out senior-description"
        style={{ 
          opacity: isVisible ? 1 : 0,
          transition: isLowEnd ? 'none' : 'opacity 0.3s ease-in-out'
        }}
      >
        <p className="text-white/95 mb-2 italic">&ldquo;{currentItem.content}&rdquo;</p>
        <p className="text-white/70 text-sm font-medium">{currentItem.author}</p>
      </div>
      
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