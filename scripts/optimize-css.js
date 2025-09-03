#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSS optimization script for better performance
class CSSOptimizer {
  constructor() {
    this.cssFiles = [
      'app/globals.css',
      'app/calendar.css'
    ];
    this.outputDir = 'dist/optimized-css';
  }

  async optimize() {
    console.log('🚀 Starting CSS optimization...');
    
    try {
      // Create output directory
      if (!fs.existsSync(this.outputDir)) {
        fs.mkdirSync(this.outputDir, { recursive: true });
      }

      // Analyze current CSS files
      await this.analyzeCSS();
      
      // Optimize each CSS file
      for (const cssFile of this.cssFiles) {
        await this.optimizeCSSFile(cssFile);
      }
      
      // Generate critical CSS
      await this.generateCriticalCSS();
      
      console.log('✅ CSS optimization completed!');
      
  } catch (error) {
      console.error('❌ CSS optimization failed:', error);
      process.exit(1);
    }
  }

  async analyzeCSS() {
    console.log('📊 Analyzing CSS files...');
    
    for (const cssFile of this.cssFiles) {
      if (fs.existsSync(cssFile)) {
        const stats = fs.statSync(cssFile);
        const content = fs.readFileSync(cssFile, 'utf8');
        const sizeKB = (stats.size / 1024).toFixed(2);
        
        console.log(`  ${cssFile}: ${sizeKB} KB`);
        
        // Count CSS rules
        const ruleCount = (content.match(/[^}]+}/g) || []).length;
        console.log(`    Rules: ${ruleCount}`);
        
        // Count unused selectors (basic check)
        const selectorCount = (content.match(/[.#][a-zA-Z0-9_-]+/g) || []).length;
        console.log(`    Selectors: ${selectorCount}`);
      }
    }
  }

  async optimizeCSSFile(cssFile) {
    console.log(`🔧 Optimizing ${cssFile}...`);
    
    if (!fs.existsSync(cssFile)) {
      console.log(`  ⚠️  File not found: ${cssFile}`);
      return;
    }

    const content = fs.readFileSync(cssFile, 'utf8');
    
    // Basic CSS optimizations
    let optimized = content
      // Remove comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove empty rules
      .replace(/[^}]+{\s*}/g, '')
      // Remove extra whitespace
      .replace(/\s+/g, ' ')
      // Remove trailing semicolons
      .replace(/;}/g, '}')
      // Remove unnecessary spaces
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*:\s*/g, ':')
      .replace(/\s*;\s*/g, ';')
      .replace(/\s*,\s*/g, ',')
      .trim();

    // Write optimized CSS
    const outputPath = path.join(this.outputDir, path.basename(cssFile));
    fs.writeFileSync(outputPath, optimized);
    
    const originalSize = (content.length / 1024).toFixed(2);
    const optimizedSize = (optimized.length / 1024).toFixed(2);
    const savings = ((content.length - optimized.length) / content.length * 100).toFixed(1);
    
    console.log(`  📉 Size: ${originalSize} KB → ${optimizedSize} KB (${savings}% reduction)`);
  }

  async generateCriticalCSS() {
    console.log('🎯 Generating critical CSS...');
    
    // This would typically use a tool like critical or penthouse
    // For now, we'll create a basic critical CSS template
    const criticalCSS = `
/* Critical CSS - Above the fold styles only */
:root {
  --c-primary-700: #1d4ed8;
  --c-secondary-700: #047857;
  --elderly-font-size-base: 20px;
  --elderly-line-height: 1.8;
  --elderly-min-touch-target: 48px;
  --elderly-high-contrast: #FFFFFF;
}

html {
  font-size: var(--elderly-font-size-base);
  background: #0f172a;
  overflow-y: scroll;
  scroll-behavior: smooth;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFFFFF;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: relative;
  z-index: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,.8);
  min-height: 100vh;
  line-height: var(--elderly-line-height);
  margin: 0;
}

/* Essential hero styles */
.relative { position: relative; }
.isolate { isolation: isolate; }
.overflow-hidden { overflow: hidden; }
.absolute { position: absolute; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.text-white { color: rgb(255 255 255); }
.w-full { width: 100%; }

/* Critical typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700;
  letter-spacing: -.025em;
  color: rgb(255 255 255);
  text-shadow: 0 2px 4px rgba(0,0,0,.8);
  line-height: var(--elderly-line-height);
  margin: 0;
}

h1 { font-size: clamp(2.5rem, 5vw, 4rem); }
h2 { font-size: clamp(2rem, 4vw, 3.5rem); }
h3 { font-size: clamp(1.75rem, 3.5vw, 3rem); }

p {
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgb(255 255 255);
  text-shadow: 0 2px 4px rgba(0,0,0,.8);
  line-height: var(--elderly-line-height);
  max-width: 45ch;
  margin: 0;
}

/* Essential layout */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.text-center { text-align: center; }
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

/* Responsive breakpoints */
@media (min-width: 640px) {
  .sm\\:text-lg { font-size: var(--elderly-font-size-large) !important; }
  .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
`;

    const criticalPath = path.join(this.outputDir, 'critical.css');
    fs.writeFileSync(criticalPath, criticalCSS);
    
    const sizeKB = (criticalCSS.length / 1024).toFixed(2);
    console.log(`  📄 Critical CSS generated: ${sizeKB} KB`);
  }

  generateReport() {
    console.log('\n📋 CSS Optimization Report:');
    console.log('========================');
    
    const reportPath = path.join(this.outputDir, 'optimization-report.txt');
    let report = 'CSS Optimization Report\n';
    report += '========================\n\n';
    
    for (const cssFile of this.cssFiles) {
      if (fs.existsSync(cssFile)) {
        const originalContent = fs.readFileSync(cssFile, 'utf8');
        const originalSize = (originalContent.length / 1024).toFixed(2);
        
        const optimizedPath = path.join(this.outputDir, path.basename(cssFile));
        if (fs.existsSync(optimizedPath)) {
          const optimizedContent = fs.readFileSync(optimizedPath, 'utf8');
          const optimizedSize = (optimizedContent.length / 1024).toFixed(2);
          const savings = ((originalContent.length - optimizedContent.length) / originalContent.length * 100).toFixed(1);
          
          report += `${cssFile}:\n`;
          report += `  Original: ${originalSize} KB\n`;
          report += `  Optimized: ${optimizedSize} KB\n`;
          report += `  Savings: ${savings}%\n\n`;
        }
      }
    }
    
    fs.writeFileSync(reportPath, report);
    console.log(`  📄 Report saved to: ${reportPath}`);
  }
}

// Run optimization
const optimizer = new CSSOptimizer();
optimizer.optimize().then(() => {
  optimizer.generateReport();
}).catch(console.error); 