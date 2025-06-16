'use client';

import { useEffect, useState } from 'react';

const TEST_HUES = [0, 60, 120, 180, 240, 300]; // Red, Yellow, Lime, Cyan, Blue, Magenta

export default function ContrastTest() {
  const [currentHueIndex, setCurrentHueIndex] = useState(0);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (!isTesting) return;

    const root = document.documentElement;
    root.classList.add('test-contrast-hues');
    
    const testHue = TEST_HUES[currentHueIndex];
    root.style.setProperty('--test-hue', `${testHue}deg`);

    const interval = setInterval(() => {
      setCurrentHueIndex((prev) => (prev + 1) % TEST_HUES.length);
    }, 2000); // Change hue every 2 seconds

    return () => {
      clearInterval(interval);
      root.classList.remove('test-contrast-hues');
      root.style.removeProperty('--test-hue');
    };
  }, [isTesting, currentHueIndex]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={() => setIsTesting(!isTesting)}
        className="px-4 py-2 bg-black/80 text-white rounded-lg shadow-lg hover:bg-black/90 transition-colors"
      >
        {isTesting ? 'Stop Contrast Test' : 'Start Contrast Test'}
      </button>
      {isTesting && (
        <div className="mt-2 text-sm text-white bg-black/80 p-2 rounded-lg">
          Current Hue: {TEST_HUES[currentHueIndex]}°
        </div>
      )}
    </div>
  );
} 