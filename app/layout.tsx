import './globals.css';
import './calendar.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import ContrastTest from '@/components/ContrastTest';
import ParticlesBackground from '@/components/ParticlesBackground';
import KetchScript from '@/components/KetchScript';
import ErrorOverlay from '@/components/ErrorOverlay';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Computer Help',
  description: 'Professional computer help and support services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <link
          rel="preload"
          href="/logo-cc.png"
          as="image"
          type="image/png"
        />
        <link
          rel="preconnect"
          href="https://assets.calendly.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`}>
        {/* Background gradient */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/40 via-[#2B3CA0]/20 to-[#4F4F00]/30 backdrop-blur-sm animate-slow-gradient" />
        
        {/* Noise overlay */}
        <div 
          className="fixed inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none z-[9997] rounded-[var(--radius-lg)]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px'
          }}
          aria-hidden="true"
        />
        
        {/* Particles */}
        <div className="fixed inset-0 z-0">
          <ParticlesBackground />
        </div>

        {/* Global scrim layer for consistent contrast */}
        <div 
          className="fixed inset-0 bg-black/25 mix-blend-overlay pointer-events-none z-[9998]"
          aria-hidden="true"
        />
        
        {/* Main content */}
        <div className="relative z-[9999] min-h-screen">
          <Header />
          <main className="pt-16">
            {children}
          </main>
        </div>

        {/* Error overlay - rendered at root level */}
        <div id="error-overlay-root" style={{ position: 'relative', zIndex: 2147483647 }} />

        {/* Contrast test component */}
        {process.env.NODE_ENV !== 'production' && <ContrastTest />}

        <ErrorOverlay />
      </body>
    </html>
  );
}
