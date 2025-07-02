/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  // Enable source maps for production builds
  productionBrowserSourceMaps: true,
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
    esmExternals: true,
    optimizeCss: true, // Enable CSS optimization
    optimizeServerReact: true, // Optimize server-side React rendering
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.teamviewer.com',
        port: '',
        pathname: '/resources/badges/**',
      },
    ],
  },
  // Reduce bundle size
  webpack: (config, { dev, isServer }) => {
    // Ensure the alias map exists and add our project-root alias
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    };

    // Better tree shaking for production
    if (!dev) {
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // More aggressive code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          // Separate Framer Motion chunk (large library)
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 30,
          },
          // Separate Lucide React chunk
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide-icons',
            chunks: 'all',
            priority: 25,
          },
          // Separate FullCalendar chunks (only loaded when needed)
          fullcalendar: {
            test: /[\\/]node_modules[\\/]@fullcalendar[\\/]/,
            name: 'fullcalendar',
            chunks: 'async', // Only load when imported
            priority: 20,
          },
          // Common React chunk
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 15,
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig; 