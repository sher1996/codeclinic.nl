'use client';

import { useState, useEffect } from 'react';
import { ThemeName, palettes } from '@/lib/colorThemes';
import { Paintbrush } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>('matrix');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeName;
    if (savedTheme && savedTheme in palettes) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-black/20 transition-colors"
        aria-label="Change theme"
      >
        <Paintbrush className="w-5 h-5" style={{ color: palettes[theme][0] }} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-black/90 border border-white/10 shadow-lg py-2 z-50">
          {Object.keys(palettes).map((themeName) => (
            <button
              key={themeName}
              onClick={() => handleThemeChange(themeName as ThemeName)}
              className="w-full px-4 py-2 text-left hover:bg-white/5 flex items-center gap-2"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: palettes[themeName as ThemeName][0] }}
              />
              <span className="capitalize">{themeName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 