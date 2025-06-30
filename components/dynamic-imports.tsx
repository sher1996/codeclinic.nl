import React from 'react';
import dynamic from 'next/dynamic';

// Optimized loading component with minimal footprint
const MinimalLoader = () => (
  <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl min-h-[600px] flex items-center justify-center">
    <div className="text-white/60">Laden...</div>
  </div>
);

// Calendar loading skeleton
const CalendarSkeleton = () => (
  <div className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-xl p-6 shadow-xl min-h-[600px]">
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200/10 rounded w-1/3" />
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-200/10 rounded" />
        ))}
      </div>
    </div>
  </div>
);

// AppointmentCalendar - Load only when needed with FullCalendar split
export const DynamicAppointmentCalendar = dynamic(
  () => import('./AppointmentCalendar').then(mod => ({
    default: mod.default
  })),
  {
    loading: () => <CalendarSkeleton />,
    ssr: false
  }
) as React.ComponentType<{ appointmentType?: 'onsite' | 'remote' }>;

// Admin components - heavy components that should load on demand
export const DynamicAdminCalendar = dynamic(
  () => import('./AdminCalendar'),
  {
    loading: () => <MinimalLoader />,
    ssr: false
  }
);

export const DynamicAdminStats = dynamic(
  () => import('./AdminStats'),
  {
    loading: () => <MinimalLoader />,
    ssr: false
  }
);

// PricingSchema - Load separately as it's used conditionally
export const DynamicPricingSchema = dynamic(
  () => import('./PricingSchema'),
  {
    loading: () => null,
    ssr: false
  }
);

// FloatingTestimonials - Visual enhancement, can load later
export const DynamicFloatingTestimonials = dynamic(
  () => import('./FloatingTestimonials'),
  {
    loading: () => null,
    ssr: false
  }
);

// FAQ Component - Content heavy, load on interaction
export const DynamicFAQ = dynamic(
  () => import('./FAQ'),
  {
    loading: () => (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-white/60">FAQ wordt geladen...</div>
      </div>
    ),
    ssr: false
  }
);

// Lazy loading wrapper for heavy animations
export const DynamicTextAnimation = dynamic(
  () => import('./TextAnimation'),
  {
    loading: () => (
      <div className="text-center py-20">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white mb-8">
          Computerhulp op Afstand & Aan Huis
        </h1>
        <div className="text-xl text-white/80 max-w-3xl mx-auto">
          Professionele computerhulp in Rotterdam - snel, betrouwbaar en persoonlijk
        </div>
      </div>
    ),
    ssr: false
  }
);

// Contact form - can be loaded on scroll
export const DynamicContact = dynamic(
  () => import('./Contact'),
  {
    loading: () => (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-white/60">Contact formulier wordt geladen...</div>
      </div>
    ),
    ssr: false
  }
);

// Optional: Preload critical components on user interaction
export const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload appointment calendar when user shows intent
    const preloadCalendar = () => {
      import('./AppointmentCalendar');
    };

    // Preload on hover over appointment buttons
    document.addEventListener('mouseover', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[href="#contact"]') || target.closest('#contact')) {
        preloadCalendar();
      }
    }, { once: true });

    // Preload on scroll to services section
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          preloadCalendar();
          observer.disconnect();
        }
      });
    });

    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
      observer.observe(servicesSection);
    }
  }
}; 