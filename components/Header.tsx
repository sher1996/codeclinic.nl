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
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 sm:gap-4 min-w-[160px] sm:min-w-[220px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md" onClick={closeMobileMenu}>
          <Image
            src="/logo-cc.png"
            alt="CodeClinic.nl logo"
            width={48}
            height={48}
            className="w-10 h-10 sm:w-14 sm:h-14 object-contain"
            priority
          />
          <span className="text-white font-mono text-xl sm:text-3xl drop-shadow-sm leading-none font-bold">
            CodeClinic.nl
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 text-xl items-center">
          <Link href="#diensten" className="nav-link">
            Diensten
          </Link>
          <Link href="#services" className="nav-link">
            Hulp Die Bij U Past
          </Link>
          <Link href="#tarieven" className="nav-link">
            Tarieven
          </Link>
          <Link href="#contact" className="nav-link">
            Contact
          </Link>
          
          {/* Prominent Phone Number for Seniors */}
          <a 
            href="tel:+31624837889" 
            className="flex items-center gap-2 bg-[#00d4ff] text-white px-4 py-2 rounded-lg font-semibold text-lg hover:bg-[#00b8e6] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md"
            style={{ minHeight: '48px', minWidth: '48px' }}
            aria-label="Bel ons direct: +31 6 24837889"
          >
            <Phone className="w-5 h-5" />
            <span className="hidden lg:inline">+31 6 24837889</span>
            <span className="lg:hidden">Bel ons</span>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-3 text-white hover:text-primary-300 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md"
          aria-label="Toggle mobile menu"
          style={{ minHeight: '48px', minWidth: '48px' }}
        >
          {isMobileMenuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40" onClick={closeMobileMenu}>
          <div className="absolute top-20 left-0 right-0 bg-[rgba(14,23,53,0.98)] border-b-2 border-white/20">
            <nav className="flex flex-col py-6">
              <Link 
                href="#diensten" 
                className="px-8 py-6 text-white hover:text-primary-300 transition-colors border-b-2 border-white/10 text-xl font-semibold"
                onClick={closeMobileMenu}
                style={{ minHeight: '48px' }}
              >
                Diensten
              </Link>
              <Link 
                href="#services" 
                className="px-8 py-6 text-white hover:text-primary-300 transition-colors border-b-2 border-white/10 text-xl font-semibold"
                onClick={closeMobileMenu}
                style={{ minHeight: '48px' }}
              >
                Hulp Die Bij U Past
              </Link>
              <Link 
                href="#tarieven" 
                className="px-8 py-6 text-white hover:text-primary-300 transition-colors border-b-2 border-white/10 text-xl font-semibold"
                onClick={closeMobileMenu}
                style={{ minHeight: '48px' }}
              >
                Tarieven
              </Link>
              <Link 
                href="#contact" 
                className="px-8 py-6 text-white hover:text-primary-300 transition-colors border-b-2 border-white/10 text-xl font-semibold"
                onClick={closeMobileMenu}
                style={{ minHeight: '48px' }}
              >
                Contact
              </Link>
              
              {/* Mobile Phone Number */}
              <a 
                href="tel:+31624837889" 
                className="px-8 py-6 bg-[#00d4ff] text-white font-semibold text-xl flex items-center gap-3 hover:bg-[#00b8e6] transition-colors"
                onClick={closeMobileMenu}
                style={{ minHeight: '48px' }}
                aria-label="Bel ons direct: +31 6 24837889"
              >
                <Phone className="w-6 h-6" />
                +31 6 24837889
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 