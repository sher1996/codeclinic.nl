import React from 'react';
import dynamic from 'next/dynamic';
import DynamicImportFallback from './DynamicImportFallback';

// AppointmentCalendar with simplified dynamic import
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
    ),
    ssr: false
  }
) as React.ComponentType<{ appointmentType?: 'onsite' | 'remote' }>;

// Services component with simplified dynamic import
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
    ),
    ssr: false
  }
);

// Hero component with simplified dynamic import
export const DynamicHero = dynamic(
  () => import('./Hero'),
  {
    loading: () => (
      <div className="w-full h-[80vh] animate-pulse">
        <div className="h-full bg-gray-200/10 rounded-lg" />
      </div>
    ),
    ssr: false
  }
); 