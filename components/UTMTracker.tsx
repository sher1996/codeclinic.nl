'use client';

import { useEffect } from 'react';
import { extractUTMParameters, storeUTMParameters, getCurrentUTMParameters, trackUTMInGA4 } from '@/lib/utm-tracking';

/**
 * UTM Parameter Tracking Component
 * Captures UTM parameters on page load and tracks them in GA4
 */
export default function UTMTracker() {
  useEffect(() => {
    // Extract UTM parameters from URL
    const utmParams = extractUTMParameters();
    
    // If we found UTM parameters, store them and track in GA4
    if (Object.keys(utmParams).length > 0) {
      console.log('[UTM Tracker] UTM parameters detected:', utmParams);
      
      // Store UTM parameters for persistence
      storeUTMParameters(utmParams);
      
      // Track UTM parameters in GA4
      trackUTMInGA4(utmParams);
    } else {
      // Check if we have stored UTM parameters from previous page
      const storedUTMs = getCurrentUTMParameters();
      if (Object.keys(storedUTMs).length > 0) {
        console.log('[UTM Tracker] Using stored UTM parameters:', storedUTMs);
        trackUTMInGA4(storedUTMs);
      }
    }
  }, []);

  // This component doesn't render anything
  return null;
}
