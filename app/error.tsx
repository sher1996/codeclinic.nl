'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483647,
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: '#1F2C90',
          padding: '2rem',
          borderRadius: '0.5rem',
          maxWidth: '32rem',
          width: '100%',
          boxShadow: '0 0 0 4px rgba(255, 255, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.5)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg
              style={{ width: '1.5rem', height: '1.5rem', color: 'white' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
            Error
          </h2>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          {error.message || 'Something went wrong!'}
        </p>
        <button
          onClick={reset}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
} 