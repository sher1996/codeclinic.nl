'use client';

import { useEffect, useState } from 'react';

type ForceServicesWindow = Window & { __forceServicesVisible?: boolean };

export default function HashNavigation() {
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

  // Pass the state to Services component via a global variable or context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as ForceServicesWindow).__forceServicesVisible = forceServicesVisible;
    }
  }, [forceServicesVisible]);

  return null; // This component doesn't render anything
} 