'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import HashNavigation from '@/components/HashNavigation';

// Lazy load non-critical components to improve initial page load
const Services = dynamic(() => import('@/components/Services'), {
  ssr: false,
  loading: () => (
    <div 
      style={{ 
        minHeight: '600px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
        Services laden...
      </div>
    </div>
  )
});

const Contact = dynamic(() => import('@/components/Contact'), {
  ssr: false,
  loading: () => (
    <div 
      style={{ 
        minHeight: '500px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
        Contact laden...
      </div>
    </div>
  )
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false,
  loading: () => (
    <div 
      style={{ 
        minHeight: '300px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
        Footer laden...
      </div>
    </div>
  )
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