'use client';

import React from 'react';
import ParticlesBackground from './ParticlesBackground';

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1E3A8A]/40 via-[#1E40AF]/30 to-[#1E3A8A]/20 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.015] mix-blend-soft-light pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '150px 150px'
      }} aria-hidden="true" />
      <ParticlesBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GradientBackground; 