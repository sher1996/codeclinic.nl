'use client';

import AppointmentCalendar from '@/components/AppointmentCalendar';
import { useState, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import DynamicImportFallback from '@/components/DynamicImportFallback';

export default function TestDynamicImports() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Dynamic Import Test</h1>
      
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-8"
      >
        {showCalendar ? 'Hide' : 'Show'} Calendar
      </button>

      {showCalendar && (
        <div className="border border-gray-600 p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Appointment Calendar</h2>
          <ErrorBoundary fallback={<DynamicImportFallback componentName="AppointmentCalendar" />}>
            <Suspense fallback={<DynamicImportFallback componentName="AppointmentCalendar" />}>
              <AppointmentCalendar />
            </Suspense>
          </ErrorBoundary>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h3 className="text-lg font-semibold mb-2">Console Logs</h3>
        <p className="text-sm text-gray-300">
          Check the browser console for dynamic import loading messages.
        </p>
      </div>
    </div>
  );
} 