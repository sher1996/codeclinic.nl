"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { testimonials } from '@/data/testimonials';

interface FloatingTestimonial {
  id: number;
  quote: string;
  author: string;
  x: number;
  y: number;
  isVisible: boolean;
}

export default function FloatingTestimonials() {
  const [floatingTestimonials, setFloatingTestimonials] = useState<FloatingTestimonial[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const nextIdRef = useRef(0);
  const maxTestimonials = 1; // Only one testimonial at a time

  useEffect(() => {
    // Show testimonials if we have any
    if (testimonials.length === 0) {
      return;
    }

    // Show testimonials after a shorter delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000); // Reduced from 2 seconds to 1 second

    return () => clearTimeout(timer);
  }, []);

  // Check if position overlaps with existing testimonials
  const isPositionOccupied = useCallback((x: number, y: number) => {
    return floatingTestimonials.some(testimonial => {
      const distance = Math.sqrt(
        Math.pow(testimonial.x - x, 2) + Math.pow(testimonial.y - y, 2)
      );
      return distance < 20; // Reduced minimum distance for more testimonials
    });
  }, [floatingTestimonials]);

  // Create new testimonial with phone-like positioning
  const createNewTestimonial = useCallback(() => {
    // Don't create new testimonial if we already have max
    if (floatingTestimonials.length >= maxTestimonials) {
      return;
    }

    const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];
    
    // Define a focused area for phone messages (right side, contained area)
    const zones = [
      { x: 78, y: 65 }, // Main phone position - right side, middle
      { x: 82, y: 60 }, // Slightly above main position
      { x: 75, y: 70 }, // Slightly below main position
      { x: 80, y: 55 }, // Upper area
      { x: 77, y: 75 }, // Lower area
      { x: 85, y: 65 }, // More to the right
      { x: 73, y: 60 }, // More to the left
      { x: 79, y: 80 }, // Lower area
    ];
    
    // Try to find a non-overlapping position within the focused area
    let attempts = 0;
    let x, y;
    
    do {
      const zone = zones[Math.floor(Math.random() * zones.length)];
      x = zone.x + (Math.random() - 0.5) * 6; // Slightly more randomness for variety
      y = zone.y + (Math.random() - 0.5) * 6;
      attempts++;
    } while (isPositionOccupied(x, y) && attempts < 15);
    
    // If we can't find a good position, don't create the testimonial
    if (attempts >= 15) {
      return;
    }
    
    const newTestimonial: FloatingTestimonial = {
      id: nextIdRef.current,
      quote: randomTestimonial.quote,
      author: randomTestimonial.author,
      x: x,
      y: y,
      isVisible: true,
    };

    setFloatingTestimonials(prev => [...prev, newTestimonial]);
    nextIdRef.current += 1;

    // Remove this testimonial after 8 seconds (much shorter for faster cycling)
    setTimeout(() => {
      setFloatingTestimonials(prev => prev.filter(t => t.id !== newTestimonial.id));
    }, 8000);
  }, [floatingTestimonials, isPositionOccupied]);

  // Start creating testimonials
  useEffect(() => {
    if (!isVisible) return;

    // Create first testimonial immediately
    createNewTestimonial();

    // Create new testimonials every 4 seconds (faster cycling)
    const interval = setInterval(() => {
      createNewTestimonial();
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible, createNewTestimonial]);

  if (!isVisible || testimonials.length === 0) {
    return null;
  }

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: -1 }}
    >
      {floatingTestimonials.map((testimonial) => (
        <div
          key={testimonial.id}
          className="absolute animate-phone-message-ultra-fast"
          style={{
            left: `${testimonial.x}%`,
            top: `${testimonial.y}%`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          {/* Phone-like message bubble */}
          <div className="relative">
            {/* Phone device outline */}
            <div className="absolute -bottom-8 -right-2 w-6 h-12 bg-gray-800 rounded-lg border-2 border-gray-600 shadow-lg">
              {/* Phone screen */}
              <div className="absolute inset-1 bg-gray-900 rounded-sm"></div>
              {/* Home button */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
            
            {/* Message bubble */}
            <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-lg max-w-xs border border-gray-200 relative">
              {/* Message tail pointing to phone */}
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
              
              <div className="relative z-10">
                <div className="text-sm font-medium mb-2 leading-relaxed">
                  {testimonial.quote}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {testimonial.author}
                </div>
                {/* Message time */}
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {/* Message status indicators */}
              <div className="absolute -top-1 -right-1 flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 