'use client';

import React from 'react';

interface DynamicImportFallbackProps {
  componentName: string;
  onRetry?: () => void;
}

export default function DynamicImportFallback({ componentName, onRetry }: DynamicImportFallbackProps) {
  return (
    <div className="w-full p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Component niet geladen
          </h3>
          <p className="text-white/60 text-sm mb-4">
            Er was een probleem bij het laden van {componentName}. Dit kan een tijdelijke storing zijn.
          </p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Opnieuw proberen
          </button>
        )}
      </div>
    </div>
  );
} 