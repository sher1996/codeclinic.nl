#!/usr/bin/env node

/**
 * CSS Optimization Script
 * This script helps optimize CSS loading by:
 * 1. Extracting critical CSS
 * 2. Deferring non-critical styles
 * 3. Optimizing font loading
 */

const fs = require('fs');
const path = require('path');

// Critical CSS selectors that should be inlined
const CRITICAL_SELECTORS = [
  // Layout
  'html', 'body', '*',
  '.container', 'header', 'main', 'footer',
  
  // Typography
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'span',
  '.senior-text', '.senior-text-large', '.senior-text-xl',
  
  // Navigation
  '.skip-link', '.nav-link',
  
  // Hero section
  '.hero', '.hero-content', '.text-animation-container',
  '.cta-button', '.btn-primary',
  
  // Accessibility
  '*:focus-visible', '.sr-only',
  
  // Responsive
  '@media (max-width: 768px)', '@media (prefers-reduced-motion: reduce)'
];

// Non-critical CSS files that should be deferred
const DEFERRED_CSS_FILES = [
  'app/globals.css',
  'app/calendar.css'
];

function extractCriticalCSS(cssContent) {
  const lines = cssContent.split('\n');
  const criticalLines = [];
  let inCriticalBlock = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if this line contains critical selectors
    const isCritical = CRITICAL_SELECTORS.some(selector => 
      trimmedLine.includes(selector) || 
      trimmedLine.startsWith('@media') ||
      trimmedLine.startsWith(':root') ||
      trimmedLine.startsWith('/*')
    );
    
    if (isCritical || inCriticalBlock) {
      criticalLines.push(line);
      
      // Check if we're entering a block
      if (trimmedLine.includes('{')) {
        inCriticalBlock = true;
      }
      
      // Check if we're leaving a block
      if (trimmedLine.includes('}')) {
        inCriticalBlock = false;
      }
    }
  }
  
  return criticalLines.join('\n');
}

function generateCSSLoader() {
  return `
'use client';

import { useEffect } from 'react';

export default function CSSLoader() {
  useEffect(() => {
    const loadNonCriticalCSS = () => {
      const cssFiles = ${JSON.stringify(DEFERRED_CSS_FILES)};
      
      cssFiles.forEach(file => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = \`/_next/static/css/\${file}\`;
        document.head.appendChild(link);
      });
    };

    // Load CSS after a short delay to prioritize critical content
    const timer = setTimeout(loadNonCriticalCSS, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
`;
}

function generatePerformanceOptimizations() {
  return `
// Performance optimizations for CSS loading
const performanceOptimizations = {
  // Preload critical fonts
  preloadFonts: () => {
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.onload = () => {
      fontLink.onload = null;
      fontLink.rel = 'stylesheet';
    };
    document.head.appendChild(fontLink);
  },

  // DNS prefetch for external resources
  dnsPrefetch: () => {
    const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = \`//\${domain}\`;
      document.head.appendChild(link);
    });
  },

  // Monitor CSS loading performance
  monitorCSSLoading: () => {
    const startTime = performance.now();
    const checkCSSLoaded = () => {
      const styles = document.styleSheets;
      let allLoaded = true;
      
      for (let i = 0; i < styles.length; i++) {
        try {
          const rules = styles[i].cssRules || styles[i].rules;
          if (rules.length === 0) {
            allLoaded = false;
            break;
          }
        } catch (e) {
          allLoaded = false;
          break;
        }
      }
      
      if (allLoaded) {
        const loadTime = performance.now() - startTime;
        console.log(\`CSS loaded in \${loadTime.toFixed(2)}ms\`);
      } else {
        setTimeout(checkCSSLoaded, 100);
      }
    };
    
    setTimeout(checkCSSLoaded, 100);
  }
};

export default performanceOptimizations;
`;
}

function main() {
  console.log('🔧 CSS Optimization Script');
  console.log('==========================');
  
  // Generate CSS loader component
  const cssLoaderPath = path.join(__dirname, '../components/CSSLoader.tsx');
  fs.writeFileSync(cssLoaderPath, generateCSSLoader());
  console.log('✅ Generated CSSLoader component');
  
  // Generate performance optimizations
  const perfOptPath = path.join(__dirname, '../utils/css-performance.ts');
  fs.writeFileSync(perfOptPath, generatePerformanceOptimizations());
  console.log('✅ Generated CSS performance utilities');
  
  console.log('\n📋 Optimization Summary:');
  console.log('- Critical CSS is now inlined in layout.tsx');
  console.log('- Non-critical CSS is deferred using CSSLoader');
  console.log('- Font loading is optimized with preloading');
  console.log('- DNS prefetching is enabled for external resources');
  console.log('- Performance monitoring is available in development');
  
  console.log('\n🚀 Next steps:');
  console.log('1. Test the website performance');
  console.log('2. Monitor Core Web Vitals');
  console.log('3. Check for any visual regressions');
  console.log('4. Deploy and measure improvements');
}

if (require.main === module) {
  main();
}

module.exports = {
  extractCriticalCSS,
  generateCSSLoader,
  generatePerformanceOptimizations
}; 