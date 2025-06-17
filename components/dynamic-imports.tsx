import React from 'react';
import dynamic from 'next/dynamic';

// BinaryMorphParticles with loading fallback
export const DynamicBinaryMorphParticles = dynamic(
  () => import('./BinaryMorphParticles'),
  {
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse bg-gray-200/10 rounded-lg w-full h-full" />
      </div>
    ),
    ssr: false // Disable server-side rendering for Three.js component
  }
);

// AppointmentCalendar with loading fallback
export const DynamicAppointmentCalendar = dynamic(
  () => import('./AppointmentCalendar'),
  {
    loading: () => (
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
    )
  }
);

// Services component with loading fallback
export const DynamicServices = dynamic(
  () => import('./Services'),
  {
    loading: () => (
      <div className="w-full space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-8 bg-gray-200/10 rounded w-1/4 mb-4" />
            <div className="h-32 bg-gray-200/10 rounded" />
          </div>
        ))}
      </div>
    )
  }
);

// Hero component with loading fallback
export const DynamicHero = dynamic(
  () => import('./Hero'),
  {
    loading: () => (
      <div className="w-full h-[80vh] animate-pulse">
        <div className="h-full bg-gray-200/10 rounded-lg" />
      </div>
    )
  }
); 