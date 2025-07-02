import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    tailwindcss,
    autoprefixer,
    ...(process.env.NODE_ENV === 'production' ? [
      ['@fullhuman/postcss-purgecss', {
        content: [
          './app/**/*.{js,ts,jsx,tsx,mdx}',
          './components/**/*.{js,ts,jsx,tsx,mdx}',
          './src/**/*.{js,ts,jsx,tsx,mdx}',
          './lib/**/*.{js,ts,jsx,tsx,mdx}',
          './utils/**/*.{js,ts,jsx,tsx,mdx}',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: [
          // Critical classes that are dynamically generated
          'text-white',
          'text-black',
          'bg-white',
          'bg-black',
          // Essential animation classes
          'animate-fadeIn',
          'animate-fadeInUp',
          'animate-pulse',
          // Critical focus states
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-white',
          // Responsive utilities
          'sm:text-lg',
          'md:text-xl',
          'lg:text-2xl',
          'xl:text-3xl',
          // Common utility patterns
          /^text-/,
          /^bg-/,
          /^border-/,
          /^p[xy]?-/,
          /^m[xy]?-/,
          /^grid-cols-/,
          /^gap-/,
          /^flex-/,
          /^items-/,
          /^justify-/,
          /^w-/,
          /^h-/,
          /^max-w-/,
          /^min-h-/,
          /^rounded-/,
          /^shadow-/,
          /^transition-/,
          /^duration-/,
          /^ease-/,
          /^opacity-/,
          /^z-/,
          /^relative$/,
          /^absolute$/,
          /^fixed$/,
          /^sticky$/,
          /^block$/,
          /^inline$/,
          /^inline-block$/,
          /^hidden$/,
          /^visible$/,
          /^sr-only$/,
        ],
      }],
      ['cssnano', {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          discardUnused: true,
          mergeIdents: false,
          reduceIdents: false,
          zindex: false,
        }],
      }],
    ] : []),
  ],
};

export default config;
