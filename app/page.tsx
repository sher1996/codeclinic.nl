'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [forceServicesVisible, setForceServicesVisible] = useState(false);

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#diensten') {
        // Set force visible when navigating to services
        setForceServicesVisible(true);
        
        const element = document.querySelector(hash);
        if (element) {
          // Force the animation to trigger by temporarily scrolling the element into view
          const elementRect = element.getBoundingClientRect();
          const isInView = elementRect.top >= 0 && elementRect.bottom <= window.innerHeight;
          
          if (!isInView) {
            // First, scroll the element into view to trigger the animation
            element.scrollIntoView({ behavior: 'instant', block: 'start' });
            
            // Then after a short delay, scroll to the correct position
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          } else {
            // If already in view, just scroll smoothly
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        
        // Reset after a delay
        setTimeout(() => {
          setForceServicesVisible(false);
        }, 1000);
      } else {
        const element = document.querySelector(hash);
        if (element) {
          // Force the animation to trigger by temporarily scrolling the element into view
          const elementRect = element.getBoundingClientRect();
          const isInView = elementRect.top >= 0 && elementRect.bottom <= window.innerHeight;
          
          if (!isInView) {
            // First, scroll the element into view to trigger the animation
            element.scrollIntoView({ behavior: 'instant', block: 'start' });
            
            // Then after a short delay, scroll to the correct position
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          } else {
            // If already in view, just scroll smoothly
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    // Handle initial load with hash
    if (window.location.hash) {
      // Small delay to ensure components are mounted
      setTimeout(handleHashChange, 100);
    }

    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Test function for debugging
  const testScrollToServices = () => {
    const element = document.querySelector('#diensten');
    if (element) {
      console.log('Testing scroll to services...');
      console.log('Element found:', element);
      console.log('Element rect:', element.getBoundingClientRect());
      
      // Force the animation to trigger
      element.scrollIntoView({ behavior: 'instant', block: 'start' });
      
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        console.log('Scroll completed');
      }, 100);
    } else {
      console.log('Services element not found');
    }
  };

  return (
    <main className="flex-grow">
      <Hero />
      
      {/* Debug button - remove after testing */}
      <div className="fixed top-20 right-4 z-50">
        <button 
          onClick={testScrollToServices}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm"
        >
          Test Scroll
        </button>
      </div>

      {/* <TrustBar /> */}
      <Services forceVisible={forceServicesVisible} />
      {/* <HowItWorks /> */}
      <Contact />
      <Footer />
    </main>
  );
}