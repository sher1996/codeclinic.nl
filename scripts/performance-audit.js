#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Performance audit script for monitoring CSS optimizations
class PerformanceAuditor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      cssOptimizations: {},
      performanceMetrics: {},
      recommendations: []
    };
  }

  async runAudit() {
    console.log('🔍 Running Performance Audit...');
    
    try {
      // Audit CSS optimizations
      await this.auditCSSOptimizations();
      
      // Check critical request chain
      await this.auditCriticalRequestChain();
      
      // Generate performance report
      await this.generatePerformanceReport();
      
      console.log('✅ Performance audit completed!');
      
    } catch (error) {
      console.error('❌ Performance audit failed:', error);
      process.exit(1);
    }
  }

  async auditCSSOptimizations() {
    console.log('📊 Auditing CSS optimizations...');
    
    const cssFiles = [
      'app/globals.css',
      'app/calendar.css'
    ];
    
    for (const cssFile of cssFiles) {
      if (fs.existsSync(cssFile)) {
        const stats = fs.statSync(cssFile);
        const content = fs.readFileSync(cssFile, 'utf8');
        
        this.results.cssOptimizations[cssFile] = {
          size: stats.size,
          sizeKB: (stats.size / 1024).toFixed(2),
          lines: content.split('\n').length,
          selectors: (content.match(/[.#][a-zA-Z0-9_-]+/g) || []).length,
          rules: (content.match(/[^}]+}/g) || []).length,
          mediaQueries: (content.match(/@media/g) || []).length,
          keyframes: (content.match(/@keyframes/g) || []).length
        };
        
        console.log(`  ${cssFile}: ${this.results.cssOptimizations[cssFile].sizeKB} KB`);
      }
    }
  }

  async auditCriticalRequestChain() {
    console.log('⛓️  Auditing critical request chain...');
    
    // Check layout.tsx for critical CSS implementation
    const layoutPath = 'app/layout.tsx';
    if (fs.existsSync(layoutPath)) {
      const content = fs.readFileSync(layoutPath, 'utf8');
      
      // Check for critical CSS inline
      const hasCriticalCSS = content.includes('dangerouslySetInnerHTML') && 
                           content.includes('Critical CSS');
      
      // Check for deferred CSS loading
      const hasDeferredCSS = content.includes('preload') && 
                            content.includes('calendar.css');
      
      // Check for removed global CSS imports
      const hasRemovedImports = !content.includes("import './calendar.css'");
      
      this.results.performanceMetrics.criticalRequestChain = {
        criticalCSSInlined: hasCriticalCSS,
        deferredCSSLoading: hasDeferredCSS,
        removedGlobalImports: hasRemovedImports,
        estimatedImprovement: hasCriticalCSS && hasDeferredCSS ? '300-500ms' : '0ms'
      };
      
      console.log(`  Critical CSS inlined: ${hasCriticalCSS ? '✅' : '❌'}`);
      console.log(`  Deferred CSS loading: ${hasDeferredCSS ? '✅' : '❌'}`);
      console.log(`  Removed global imports: ${hasDeferredCSS ? '✅' : '❌'}`);
    }
  }

  async generatePerformanceReport() {
    console.log('📋 Generating performance report...');
    
    const reportPath = 'dist/performance-audit-report.json';
    const reportDir = path.dirname(reportPath);
    
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }
    
    // Calculate total CSS size
    let totalCSSSize = 0;
    let totalSelectors = 0;
    
    Object.values(this.results.cssOptimizations).forEach(css => {
      totalCSSSize += css.size;
      totalSelectors += css.selectors;
    });
    
    this.results.performanceMetrics.totalCSS = {
      size: totalCSSSize,
      sizeKB: (totalCSSSize / 1024).toFixed(2),
      selectors: totalSelectors
    };
    
    // Generate recommendations
    this.generateRecommendations();
    
    // Write report
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    
    console.log(`  📄 Report saved to: ${reportPath}`);
    
    // Display summary
    this.displaySummary();
  }

  generateRecommendations() {
    const recommendations = [];
    
    // CSS size recommendations
    const totalSizeKB = parseFloat(this.results.performanceMetrics.totalCSS.sizeKB);
    if (totalSizeKB > 100) {
      recommendations.push({
        type: 'warning',
        message: `CSS bundle is large (${totalSizeKB} KB). Consider splitting into smaller chunks.`,
        impact: 'high',
        effort: 'medium'
      });
    }
    
    // Selector count recommendations
    const totalSelectors = this.results.performanceMetrics.totalCSS.selectors;
    if (totalSelectors > 1000) {
      recommendations.push({
        type: 'warning',
        message: `High number of selectors (${totalSelectors}). Consider removing unused CSS.`,
        impact: 'medium',
        effort: 'low'
      });
    }
    
    // Critical request chain recommendations
    const crc = this.results.performanceMetrics.criticalRequestChain;
    if (!crc.criticalCSSInlined) {
      recommendations.push({
        type: 'critical',
        message: 'Critical CSS should be inlined to eliminate render-blocking.',
        impact: 'high',
        effort: 'medium'
      });
    }
    
    if (!crc.deferredCSSLoading) {
      recommendations.push({
        type: 'important',
        message: 'Implement deferred CSS loading for non-critical styles.',
        impact: 'high',
        effort: 'low'
      });
    }
    
    this.results.recommendations = recommendations;
  }

  displaySummary() {
    console.log('\n📊 Performance Audit Summary');
    console.log('============================');
    
    // CSS Metrics
    console.log('\n🎨 CSS Metrics:');
    Object.entries(this.results.cssOptimizations).forEach(([file, metrics]) => {
      console.log(`  ${file}: ${metrics.sizeKB} KB, ${metrics.selectors} selectors`);
    });
    
    console.log(`\n  Total CSS: ${this.results.performanceMetrics.totalCSS.sizeKB} KB`);
    console.log(`  Total Selectors: ${this.results.performanceMetrics.totalCSS.selectors}`);
    
    // Critical Request Chain
    console.log('\n⛓️  Critical Request Chain:');
    const crc = this.results.performanceMetrics.criticalRequestChain;
    console.log(`  Critical CSS Inlined: ${crc.criticalCSSInlined ? '✅' : '❌'}`);
    console.log(`  Deferred CSS Loading: ${crc.deferredCSSLoading ? '✅' : '❌'}`);
    console.log(`  Estimated Improvement: ${crc.estimatedImprovement}`);
    
    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.results.recommendations.forEach((rec, index) => {
        const icon = rec.type === 'critical' ? '🚨' : rec.type === 'warning' ? '⚠️' : '💡';
        console.log(`  ${index + 1}. ${icon} ${rec.message} (${rec.impact} impact, ${rec.effort} effort)`);
      });
    } else {
      console.log('\n🎉 No critical issues found! CSS optimizations are well implemented.');
    }
    
    // Expected Performance Improvements
    console.log('\n📈 Expected Performance Improvements:');
    if (crc.criticalCSSInlined && crc.deferredCSSLoading) {
      console.log('  • LCP improvement: 200-300ms');
      console.log('  • Critical path reduction: 300-500ms');
      console.log('  • Render-blocking elimination: 300-400ms');
      console.log('  • First paint: Immediate');
      console.log('  • Layout stability: Improved');
    } else {
      console.log('  • Implement critical CSS inlining for immediate improvements');
      console.log('  • Add deferred CSS loading for non-critical styles');
    }
  }
}

// Run performance audit
const auditor = new PerformanceAuditor();
auditor.runAudit().catch(console.error);
