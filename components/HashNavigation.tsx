'use client';

import { useEffect, useState } from 'react';

type ForceServicesWindow = Window & { __forceServicesVisible?: boolean };

export default function HashNavigation() {
  const [forceServicesVisible, setForceServicesVisible] = useState(false);

  // Handle hash navigation
  useEffect(() => {
    const scrollToElement = (element: Element) => {
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
    };

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#diensten') {
        // Set force visible when navigating to services
        setForceServicesVisible(true);
        
        const element = document.querySelector(hash);
        if (element) {
          scrollToElement(element);
        }
        
        // Reset after a delay
        setTimeout(() => {
          setForceServicesVisible(false);
        }, 1000);
      } else if (hash === '#contact') {
        // Special handling for contact section with dynamic loading
        const attemptScroll = (retries = 0) => {
          const element = document.querySelector(hash);
          if (element) {
            scrollToElement(element);
          } else if (retries < 20) { // Try for up to 2 seconds (20 * 100ms)
            // Wait for dynamic component to load
            setTimeout(() => attemptScroll(retries + 1), 100);
          }
        };
        
        // Also set up a MutationObserver to watch for the contact section
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              const contactElement = document.querySelector('#contact');
              if (contactElement) {
                scrollToElement(contactElement);
                observer.disconnect();
              }
            }
          });
        });
        
        // Start observing
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Also try the polling approach
        attemptScroll();
        
        // Clean up observer after 3 seconds
        setTimeout(() => observer.disconnect(), 3000);
      } else if (hash === '#services') {
        // Special handling for services section (also dynamically loaded)
        const attemptScroll = (retries = 0) => {
          const element = document.querySelector(hash);
          if (element) {
            scrollToElement(element);
          } else if (retries < 10) { // Try for up to 1 second (10 * 100ms)
            // Wait for dynamic component to load
            setTimeout(() => attemptScroll(retries + 1), 100);
          }
        };
        attemptScroll();
      } else if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          scrollToElement(element);
        }
      }
    };

    // Handle initial load with hash
    if (window.location.hash) {
      // Longer delay for dynamically loaded sections
      const delay = ['#contact', '#services'].includes(window.location.hash) ? 500 : 100;
      setTimeout(handleHashChange, delay);
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