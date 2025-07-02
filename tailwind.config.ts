import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // Critical classes that might be dynamically generated
    'text-white',
    'text-black',
    'bg-white',
    'bg-black',
    'border-white',
    'border-black',
    // Animation classes
    'animate-fadeIn',
    'animate-fadeInUp',
    'animate-float',
    'animate-pulse',
    // Focus states
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-white',
    // Responsive utilities
    'sm:text-lg',
    'md:text-xl',
    'lg:text-2xl',
    'xl:text-3xl',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          50: '#eef4ff',
          100: '#e0e7ff',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857'
        },
        accent: {
          50: '#fff7ed',
          100: '#fffbeb',
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        },
        surface: {
          light: '#f9fafb',
          dark: '#1f2937',
          darker: '#111827',
          darkest: '#0f172a'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        }
      },
      opacity: {
        '0': '0',
        '10': '0.1',
        '20': '0.2',
        '40': '0.4',
        '60': '0.6',
        '80': '0.8',
        '100': '1',
      },
      borderColor: {
        DEFAULT: '#1f2937', // surface-dark
        primary: {
          50: '#eef4ff',
          100: '#e0e7ff',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        secondary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857'
        },
        accent: {
          50: '#fff7ed',
          100: '#fffbeb',
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        },
        surface: {
          light: '#f9fafb',
          dark: '#1f2937',
          darker: '#111827',
          darkest: '#0f172a'
        }
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      animation: {
        // optional access to Tailwind class if desired: animate-code-rain
        'code-rain': 'codeRain 12s linear infinite',
        // new Deep Matrix rain animation
        'matrix-rain': 'matrixRain 10s linear infinite',
        'typing': 'typing 0.6s steps(25, end) linear, blink-caret .3s step-end infinite',
      },
      keyframes: {
        // fallback if you prefer to use Tailwind class utilities instead of CSS file
        codeRain: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100vh' },
        },
        matrixRain: {
          '0%': { backgroundPosition: '0 -100vh' },
          '100%': { backgroundPosition: '0 100vh' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'white' }
        }
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwindcss-bg-patterns')
  ],
};

export default config;
