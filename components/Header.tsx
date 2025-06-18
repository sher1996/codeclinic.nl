'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

const linkBase =
  'relative after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-primary-500 after:transition-transform hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md';

export default function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled
          ? 'bg-[rgba(14,23,53,0.85)]'
          : 'bg-black/35'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-4 min-w-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md">
          <Image
            src="/logo-cc.png"
            alt="CodeClinic.nl logo"
            width={48}
            height={48}
            priority
            className="object-contain"
          />
          <span className="text-white font-mono text-2xl drop-shadow-sm leading-none">
            CodeClinic.nl
          </span>
        </Link>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-8">
          <nav className="flex gap-4 md:gap-6 text-base md:text-lg items-center">
            <Link href="#diensten" className="py-2 px-3 rounded-md text-white hover:text-primary-200 transition-colors">
              Diensten
            </Link>
            <Link href="#services" className="py-2 px-3 rounded-md text-white hover:text-primary-200 transition-colors">
              Hulp Die Bij U Past
            </Link>
            <Link href="#tarieven" className="py-2 px-3 rounded-md text-white hover:text-primary-200 transition-colors">
              Tarieven
            </Link>
            <Link href="#contact" className="py-2 px-3 rounded-md text-white hover:text-primary-200 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 