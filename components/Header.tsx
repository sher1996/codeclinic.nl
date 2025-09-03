'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import WhatsAppIcon from './WhatsAppIcon';

export default function Header() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

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

  // Handle keyboard navigation for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobileMenuOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeMobileMenu();
          mobileMenuButtonRef.current?.focus();
          break;
        case 'Tab':
          // Trap focus within mobile menu when open
          const focusableElements = mobileMenuRef.current?.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
            
            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
          break;
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Focus first focusable element in mobile menu
      const firstFocusable = mobileMenuRef.current?.querySelector('a, button') as HTMLElement;
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

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
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 sm:gap-4 min-w-[160px] sm:min-w-[220px] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md" 
          onClick={closeMobileMenu}
          aria-label="CodeClinic.nl - Ga naar homepage"
        >
          <Image
            src="/logo-cc.png"
            alt="CodeClinic.nl - Expert computerhulp en computer reparatie Rotterdam"
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
        <nav className="hidden md:flex gap-4 text-xl items-center" role="navigation" aria-label="Hoofdnavigatie">
          <Link href="/#diensten" className="nav-link" aria-label="Ga naar diensten sectie" accessKey="d">
            Diensten
          </Link>
          <Link href="/#services" className="nav-link" aria-label="Ga naar hulp die bij u past sectie" accessKey="h">
            Hulp Die Bij U Past
          </Link>
          <Link href="/#tarieven" className="nav-link" aria-label="Ga naar tarieven sectie" accessKey="t">
            Tarieven
          </Link>
          <Link href="/#contact" className="nav-link" aria-label="Ga naar contact sectie" accessKey="c">
            Contact
          </Link>
          
          {/* Prominent Phone Number for Seniors */}
                      <a 
              href="https://wa.me/31624837889" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#0066cc] text-white px-4 py-2 rounded-lg font-semibold text-lg hover:bg-[#0052a3] transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md"
              style={{ minHeight: '48px', minWidth: '48px' }}
              aria-label="WhatsApp ons direct: +31 6 24837889"
              accessKey="w"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span className="hidden lg:inline">+31 6 24837889</span>
              <span className="lg:hidden">WhatsApp</span>
            </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          ref={mobileMenuButtonRef}
          onClick={toggleMobileMenu}
          className="md:hidden p-3 text-white hover:text-primary-300 transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B] focus-visible:rounded-md"
          aria-label={isMobileMenuOpen ? "Sluit mobiel menu" : "Open mobiel menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          style={{ minHeight: '48px', minWidth: '48px' }}
        >
          {isMobileMenuOpen ? (
            <X size={28} aria-hidden="true" />
          ) : (
            <Menu size={28} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40" 
          onClick={closeMobileMenu}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu"
          aria-label="Mobiel navigatiemenu"
        >
          <div 
            ref={mobileMenuRef}
            className="absolute top-20 left-0 right-0 bg-[rgba(14,23,53,0.98)] border-b-2 border-white/20"
            id="mobile-menu"
          >
            <nav className="flex flex-col py-6" role="navigation" aria-label="Mobiele navigatie">
              <Link 
                href="/#diensten" 
                className="px-8 py-6 text-white hover:text-primary-300 transition-colors border-b-2 border-white/10 text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B]"
                onClick={closeMobileMenu}
                style={{ minHeight: '48px' }}
                aria-label="Ga naar diensten sectie"
              >
                Diensten
              </Link>
              <Link 
                href="/#services" 
                className="px-8 py-6 text-white hover:text-primary-300 transition-colors border-b-2 border-white/10 text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B]"
                onClick={closeMobileMenu}
                style={{ minHeight: '48px' }}
                aria-label="Ga naar hulp die bij u past sectie"
              >
                Hulp Die Bij U Past
              </Link>
              <Link 
                href="/#tarieven" 
                className="px-8 py-6 text-white hover:text-primary-300 transition-colors border-b-2 border-white/10 text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B]"
                onClick={closeMobileMenu}
                style={{ minHeight: '48px' }}
                aria-label="Ga naar tarieven sectie"
              >
                Tarieven
              </Link>
              <Link 
                href="/#contact" 
                className="px-8 py-6 text-white hover:text-primary-300 transition-colors border-b-2 border-white/10 text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B]"
                onClick={closeMobileMenu}
                style={{ minHeight: '48px' }}
                aria-label="Ga naar contact sectie"
              >
                Contact
              </Link>
              
              {/* Mobile Phone Number */}
                              <a 
                  href="https://wa.me/31624837889" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-6 bg-[#0066cc] text-white font-semibold text-xl flex items-center gap-3 hover:bg-[#0052a3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A4B]"
                  onClick={closeMobileMenu}
                  style={{ minHeight: '48px' }}
                  aria-label="WhatsApp ons direct: +31 6 24837889"
                >
                  <WhatsAppIcon className="w-6 h-6" />
                  +31 6 24837889
                </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 