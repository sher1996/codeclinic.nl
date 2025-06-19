'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Phone, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const linkBase =
  'relative after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:scale-x-0 after:bg-primary-500 after:transition-transform hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md';

export default function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled
          ? 'bg-[rgba(14,23,53,0.95)]'
          : 'bg-black/35'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-2 sm:gap-4 min-w-[140px] sm:min-w-[200px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md" onClick={closeMobileMenu}>
          <Image
            src="/logo-cc.png"
            alt="CodeClinic.nl logo"
            width={40}
            height={40}
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
            priority
          />
          <span className="text-white font-mono text-lg sm:text-2xl drop-shadow-sm leading-none">
            CodeClinic.nl
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-lg items-center">
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

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 text-white hover:text-primary-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={closeMobileMenu}>
          <div className="absolute top-16 left-0 right-0 bg-[rgba(14,23,53,0.98)] border-b border-white/10">
            <nav className="flex flex-col py-4">
              <Link 
                href="#diensten" 
                className="px-6 py-4 text-white hover:text-primary-200 transition-colors border-b border-white/10"
                onClick={closeMobileMenu}
              >
                Diensten
              </Link>
              <Link 
                href="#services" 
                className="px-6 py-4 text-white hover:text-primary-200 transition-colors border-b border-white/10"
                onClick={closeMobileMenu}
              >
                Hulp Die Bij U Past
              </Link>
              <Link 
                href="#tarieven" 
                className="px-6 py-4 text-white hover:text-primary-200 transition-colors border-b border-white/10"
                onClick={closeMobileMenu}
              >
                Tarieven
              </Link>
              <Link 
                href="#contact" 
                className="px-6 py-4 text-white hover:text-primary-200 transition-colors"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 