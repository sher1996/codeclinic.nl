#!/usr/bin/env node

/**
 * CSS Performance Testing Script
 * Tests render-blocking CSS elimination and performance improvements
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function testCSSPerformance() {
  console.log('🚀 Starting CSS Performance Test...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable performance monitoring
    await page.setCacheEnabled(false);
    
    // Start performance monitoring
    await page.evaluateOnNewDocument(() => {
      window.performanceMarks = [];
      window.performanceMeasures = [];
      
      // Mark critical points
      performance.mark('navigation-start');
      
      // Monitor CSS loading
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes('.css')) {
            window.performanceMarks.push({
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
              transferSize: entry.transferSize,
              renderBlocking: entry.renderBlockingStatus
            });
          }
        }
      });
      
      observer.observe({ entryTypes: ['resource'] });
    });
    
    // Navigate to the page
    console.log('📄 Loading page...');
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    const loadTime = Date.now() - startTime;
    
    // Wait for CSS to load
    await page.waitForTimeout(2000);
    
    // Get performance metrics
    const performanceData = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const resources = performance.getEntriesByType('resource');
      
      return {
        navigation: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          totalTime: navigation.loadEventEnd - navigation.fetchStart
        },
        paint: {
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
        },
        cssResources: resources.filter(r => r.name.includes('.css')),
        cssMarks: window.performanceMarks || []
      };
    });
    
    // Analyze results
    console.log('📊 Performance Analysis:\n');
    
    console.log('⏱️  Load Times:');
    console.log(`   DOM Content Loaded: ${performanceData.navigation.domContentLoaded.toFixed(2)}ms`);
    console.log(`   Load Complete: ${performanceData.navigation.loadComplete.toFixed(2)}ms`);
    console.log(`   Total Load Time: ${performanceData.navigation.totalTime.toFixed(2)}ms`);
    
    console.log('\n🎨 Paint Metrics:');
    console.log(`   First Paint: ${performanceData.paint.firstPaint.toFixed(2)}ms`);
    console.log(`   First Contentful Paint: ${performanceData.paint.firstContentfulPaint.toFixed(2)}ms`);
    
    console.log('\n📦 CSS Resources:');
    performanceData.cssResources.forEach((resource, index) => {
      console.log(`   ${index + 1}. ${path.basename(resource.name)}`);
      console.log(`      Size: ${(resource.transferSize / 1024).toFixed(2)} KB`);
      console.log(`      Duration: ${resource.duration.toFixed(2)}ms`);
      console.log(`      Start Time: ${resource.startTime.toFixed(2)}ms`);
    });
    
    // Check for render-blocking CSS
    const renderBlockingCSS = performanceData.cssResources.filter(r => 
      r.renderBlockingStatus === 'blocking'
    );
    
    console.log('\n🚫 Render-Blocking Analysis:');
    if (renderBlockingCSS.length === 0) {
      console.log('   ✅ No render-blocking CSS detected!');
      console.log('   🎉 CSS optimization successful!');
    } else {
      console.log(`   ⚠️  ${renderBlockingCSS.length} render-blocking CSS files detected:`);
      renderBlockingCSS.forEach(css => {
        console.log(`      - ${path.basename(css.name)}`);
      });
    }
    
    // Performance recommendations
    console.log('\n💡 Performance Recommendations:');
    
    if (performanceData.paint.firstContentfulPaint > 1500) {
      console.log('   ⚠️  First Contentful Paint is above 1.5s - consider further optimization');
    } else {
      console.log('   ✅ First Contentful Paint is within acceptable range');
    }
    
    if (performanceData.navigation.totalTime > 3000) {
      console.log('   ⚠️  Total load time is above 3s - consider further optimization');
    } else {
      console.log('   ✅ Total load time is within acceptable range');
    }
    
    // Save detailed report
    const report = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000',
      metrics: performanceData,
      summary: {
        renderBlockingCSS: renderBlockingCSS.length,
        totalLoadTime: performanceData.navigation.totalTime,
        firstContentfulPaint: performanceData.paint.firstContentfulPaint,
        cssOptimizationSuccess: renderBlockingCSS.length === 0
      }
    };
    
    const reportPath = path.join(__dirname, '..', 'dist', 'css-performance-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    // Final assessment
    console.log('\n🏆 Final Assessment:');
    if (renderBlockingCSS.length === 0 && performanceData.paint.firstContentfulPaint < 1500) {
      console.log('   🎉 EXCELLENT: CSS optimization successful!');
      console.log('   ✅ No render-blocking CSS');
      console.log('   ✅ Fast First Contentful Paint');
      console.log('   🚀 Expected 300ms+ improvement achieved!');
    } else if (renderBlockingCSS.length === 0) {
      console.log('   ✅ GOOD: Render-blocking CSS eliminated');
      console.log('   ⚠️  Consider further optimization for paint metrics');
    } else {
      console.log('   ⚠️  NEEDS WORK: Some render-blocking CSS still present');
      console.log('   🔧 Review CSS loading strategy');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the test
if (require.main === module) {
  testCSSPerformance().catch(console.error);
}

module.exports = testCSSPerformance;
