'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import HashNavigation from '@/components/HashNavigation';

// Lazy load non-critical components to improve initial page load
const Services = dynamic(() => import('@/components/Services'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '400px' }} /> // Prevent layout shift
});

const Contact = dynamic(() => import('@/components/Contact'), {
  ssr: false,
  loading: () => <div id="contact" style={{ minHeight: '300px' }} /> // Prevent layout shift and ensure ID exists
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '200px' }} /> // Prevent layout shift
});

const PerformanceMonitor = dynamic(() => import('@/components/PerformanceMonitor'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="flex-grow">
      <HashNavigation />
      <PerformanceMonitor />
      <Hero />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}