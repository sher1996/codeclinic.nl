#!/usr/bin/env node

/**
 * Testimonials Management Script
 * 
 * This script helps you manage the floating testimonials in your website.
 * Run with: node scripts/update-testimonials.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testimonialsPath = path.join(__dirname, '..', 'data', 'testimonials.dev.js');

console.log('🎈 Floating Testimonials Manager\n');

// Check if testimonials file exists
if (!fs.existsSync(testimonialsPath)) {
  console.log('❌ Testimonials file not found at:', testimonialsPath);
  console.log('Please create the file first.');
  process.exit(1);
}

// Read current testimonials
try {
  const testimonialsContent = fs.readFileSync(testimonialsPath, 'utf8');
  
  // Extract testimonials using regex (simple approach)
  const testimonialMatches = testimonialsContent.match(/quote:\s*"([^"]+)"/g);
  const authorMatches = testimonialsContent.match(/author:\s*"([^"]+)"/g);
  
  console.log('📋 Current Testimonials:');
  console.log('========================\n');
  
  if (testimonialMatches && authorMatches) {
    testimonialMatches.forEach((match, index) => {
      const quote = match.match(/quote:\s*"([^"]+)"/)?.[1];
      const author = authorMatches[index]?.match(/author:\s*"([^"]+)"/)?.[1];
      
      if (quote && author) {
        console.log(`${index + 1}. ${quote}`);
        console.log(`   ${author}\n`);
      }
    });
  } else {
    // Try alternative approach - look for the array structure
    const arrayMatch = testimonialsContent.match(/dummyTestimonials\s*=\s*\[([\s\S]*?)\];/);
    if (arrayMatch) {
      const arrayContent = arrayMatch[1];
      const quoteMatches = arrayContent.match(/quote:\s*"([^"]+)"/g);
      const authorMatches = arrayContent.match(/author:\s*"([^"]+)"/g);
      
      if (quoteMatches && authorMatches) {
        quoteMatches.forEach((match, index) => {
          const quote = match.match(/quote:\s*"([^"]+)"/)?.[1];
          const author = authorMatches[index]?.match(/author:\s*"([^"]+)"/)?.[1];
          
          if (quote && author) {
            console.log(`${index + 1}. ${quote}`);
            console.log(`   ${author}\n`);
          }
        });
      } else {
        console.log('No testimonials found in the array.');
      }
    } else {
      console.log('No testimonials found in the file.');
    }
  }
  
  console.log('📝 How to Update Testimonials:');
  console.log('==============================\n');
  console.log('1. Edit the file: data/testimonials.dev.js');
  console.log('2. Replace the dummyTestimonials array with real testimonials');
  console.log('3. Remove the environment check for production');
  console.log('4. Rename the file to testimonials.js');
  console.log('5. Update the import in FloatingTestimonials.tsx\n');
  
  console.log('💡 Best Practices:');
  console.log('==================\n');
  console.log('• Keep testimonials concise (1-2 sentences max)');
  console.log('• Include location for local credibility');
  console.log('• Use real names (first name + last initial)');
  console.log('• Include diverse feedback types');
  console.log('• Update regularly\n');
  
  console.log('🔧 Current Status:');
  console.log('==================\n');
  
  if (testimonialsContent.includes('process.env.NODE_ENV === "production"')) {
    console.log('⚠️  Environment check is active - testimonials hidden in production');
    console.log('   Remove this check when ready for production\n');
  } else {
    console.log('✅ Environment check removed - ready for production\n');
  }
  
  console.log('📁 File location:', testimonialsPath);
  console.log('🔗 Component: components/FloatingTestimonials.tsx');
  
} catch (error) {
  console.error('❌ Error reading testimonials file:', error.message);
  process.exit(1);
} 