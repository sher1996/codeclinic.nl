'use client';

import { useEffect, useState } from 'react';

interface ConsentPreferences {
  analytics: boolean;
  advertising: boolean;
  personalization: boolean;
}

export default function ConsentManager() {
  const [showBanner, setShowBanner] = useState(false);
  const [consent, setConsent] = useState<ConsentPreferences>({
    analytics: false,
    advertising: false,
    personalization: false,
  });

  useEffect(() => {
    // Check if user has already made a consent choice
    const savedConsent = localStorage.getItem('codeclinic-consent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const parsedConsent = JSON.parse(savedConsent);
      setConsent(parsedConsent);
      updateConsentMode(parsedConsent);
    }
  }, []);

  const updateConsentMode = (preferences: ConsentPreferences) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': preferences.advertising ? 'granted' : 'denied',
        'analytics_storage': preferences.analytics ? 'granted' : 'denied',
        'ad_user_data': preferences.advertising ? 'granted' : 'denied',
        'ad_personalization': preferences.personalization ? 'granted' : 'denied',
      });
    }
  };

  const handleAcceptAll = () => {
    const newConsent = {
      analytics: true,
      advertising: true,
      personalization: true,
    };
    setConsent(newConsent);
    localStorage.setItem('codeclinic-consent', JSON.stringify(newConsent));
    updateConsentMode(newConsent);
    setShowBanner(false);
  };

  const handleAcceptEssential = () => {
    const newConsent = {
      analytics: true,
      advertising: false,
      personalization: false,
    };
    setConsent(newConsent);
    localStorage.setItem('codeclinic-consent', JSON.stringify(newConsent));
    updateConsentMode(newConsent);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const newConsent = {
      analytics: false,
      advertising: false,
      personalization: false,
    };
    setConsent(newConsent);
    localStorage.setItem('codeclinic-consent', JSON.stringify(newConsent));
    updateConsentMode(newConsent);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 border-t border-gray-700">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Privacy-instellingen</h3>
            <p className="text-sm text-gray-300 mb-4">
              Wij gebruiken cookies en vergelijkbare technologieën om uw ervaring te verbeteren, 
              verkeer te analyseren en gepersonaliseerde inhoud te tonen. 
              U kunt uw voorkeuren beheren via de onderstaande opties.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              Weigeren
            </button>
            <button
              onClick={handleAcceptEssential}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Alleen noodzakelijk
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 rounded transition-colors"
            >
              Alles accepteren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
} 