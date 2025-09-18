/**
 * UTM Parameter Tracking Utility
 * Captures and manages UTM parameters for Google Ads campaign tracking
 */

export interface UTMParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Extract UTM parameters from current URL
 */
export function extractUTMParameters(): UTMParameters {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: UTMParameters = {};
  
  // Extract all UTM parameters
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  
  utmKeys.forEach(key => {
    const value = urlParams.get(key);
    if (value) {
      utmParams[key as keyof UTMParameters] = value;
    }
  });
  
  return utmParams;
}

/**
 * Store UTM parameters in sessionStorage for persistence across page loads
 */
export function storeUTMParameters(utmParams: UTMParameters): void {
  if (typeof window === 'undefined') return;
  
  // Only store if we have UTM parameters
  if (Object.keys(utmParams).length > 0) {
    sessionStorage.setItem('utm_parameters', JSON.stringify(utmParams));
    console.log('[UTM Tracking] Stored UTM parameters:', utmParams);
  }
}

/**
 * Retrieve stored UTM parameters from sessionStorage
 */
export function getStoredUTMParameters(): UTMParameters {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = sessionStorage.getItem('utm_parameters');
    if (stored) {
      const utmParams = JSON.parse(stored);
      console.log('[UTM Tracking] Retrieved stored UTM parameters:', utmParams);
      return utmParams;
    }
  } catch (error) {
    console.error('[UTM Tracking] Error retrieving stored UTM parameters:', error);
  }
  
  return {};
}

/**
 * Get current UTM parameters (either from URL or stored)
 */
export function getCurrentUTMParameters(): UTMParameters {
  // First try to get from current URL
  const urlUTMs = extractUTMParameters();
  
  // If we have UTM parameters in URL, use those and store them
  if (Object.keys(urlUTMs).length > 0) {
    storeUTMParameters(urlUTMs);
    return urlUTMs;
  }
  
  // Otherwise, return stored parameters
  return getStoredUTMParameters();
}

/**
 * Create UTM parameter query string for URLs
 */
export function createUTMQueryString(utmParams: UTMParameters): string {
  const params = new URLSearchParams();
  
  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });
  
  return params.toString();
}

/**
 * Track UTM parameters in GA4 as custom parameters
 */
export function trackUTMInGA4(utmParams: UTMParameters): void {
  if (typeof window === 'undefined' || !('gtag' in window)) return;
  
  const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
  
  // Set UTM parameters as custom dimensions in GA4
  Object.entries(utmParams).forEach(([key, value]) => {
    if (value) {
      gtag('config', 'G-8VM2Y5JZEM', {
        [key]: value
      });
    }
  });
  
  console.log('[UTM Tracking] Tracked UTM parameters in GA4:', utmParams);
}
