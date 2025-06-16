import React from 'react';

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative min-h-screen ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/80 via-blue-400/80 to-blue-500/80 backdrop-blur-sm" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GradientBackground; 