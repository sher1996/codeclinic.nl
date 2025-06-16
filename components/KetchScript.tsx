'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    ketchConfig: {
      apiKey: string;
      autostart: boolean;
      cookieOptions: {
        sameSite: string;
        secure: boolean;
      };
      purposes: {
        [key: string]: {
          name: string;
          description: string;
          required: boolean;
        };
      };
    };
  }
}

export default function KetchScript() {
  // Temporarily disabled Ketch script
  return null;
} 