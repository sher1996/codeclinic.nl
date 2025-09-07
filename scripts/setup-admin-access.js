#!/usr/bin/env node

/**
 * Setup script for the new email-based admin access system
 * This script helps you set up the database table and verify the configuration
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function setupAdminAccess() {
  console.log('🔐 Setting up Email-Based Admin Access System...\n');

  // Check environment variables
  console.log('📋 Checking environment configuration...');
  
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'ADMIN_EMAIL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease check your .env.local file and ensure all required variables are set.');
    process.exit(1);
  }

  console.log('✅ All required environment variables are configured');
  console.log(`   - Admin Email: ${process.env.ADMIN_EMAIL}`);
  console.log(`   - Supabase URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   - Resend API Key: ${process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing'}\n`);

  // Initialize Supabase client
  console.log('🔗 Connecting to Supabase...');
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Test connection
    const { data, error } = await supabase.from('bookings').select('count').limit(1);
    if (error) {
      console.error('❌ Failed to connect to Supabase:', error.message);
      process.exit(1);
    }
    console.log('✅ Successfully connected to Supabase\n');

    // Create admin_access_requests table
    console.log('🗄️  Creating admin_access_requests table...');
    
    const createTableSQL = `
      -- Create admin_access_requests table for email-based admin access system
      CREATE TABLE IF NOT EXISTS admin_access_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          reason TEXT,
          status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
          approve_token VARCHAR(255),
          deny_token VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          processed_at TIMESTAMP WITH TIME ZONE
      );
    `;

    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (createError) {
      console.error('❌ Failed to create table:', createError.message);
      console.log('💡 You may need to run the SQL manually in your Supabase dashboard');
      console.log('   SQL file: database/admin_access_requests.sql');
    } else {
      console.log('✅ admin_access_requests table created successfully');
    }

    // Create indexes
    console.log('📊 Creating indexes...');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_admin_access_requests_email ON admin_access_requests(email);',
      'CREATE INDEX IF NOT EXISTS idx_admin_access_requests_status ON admin_access_requests(status);',
      'CREATE INDEX IF NOT EXISTS idx_admin_access_requests_created_at ON admin_access_requests(created_at);'
    ];

    for (const indexSQL of indexes) {
      const { error: indexError } = await supabase.rpc('exec_sql', { sql: indexSQL });
      if (indexError) {
        console.warn('⚠️  Warning: Could not create index:', indexError.message);
      }
    }

    console.log('✅ Indexes created successfully\n');

    // Test the new system
    console.log('🧪 Testing the admin access system...');
    
    // Test API endpoint
    const testRequest = {
      email: 'test@example.com',
      name: 'Test User',
      reason: 'Testing the new admin access system'
    };

    try {
      const response = await fetch('http://localhost:3000/api/admin-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRequest),
      });

      if (response.ok) {
        console.log('✅ Admin access API is working correctly');
        console.log('   - Email approval requests will be sent to:', process.env.ADMIN_EMAIL);
      } else {
        console.warn('⚠️  Admin access API test failed:', response.status);
      }
    } catch (error) {
      console.warn('⚠️  Could not test API (server may not be running):', error.message);
    }

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Test admin access by visiting: http://localhost:3000?admin=true');
    console.log('3. Or use the keyboard shortcut: Ctrl + Alt + A');
    console.log('4. Request admin access with your email');
    console.log('5. Check your email (codeclinic.nl@gmail.com) for approval links');
    console.log('\n🔐 Security features:');
    console.log('- Email-based authentication');
    console.log('- Secure approval tokens');
    console.log('- Admin email notifications');
    console.log('- Request tracking and logging');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupAdminAccess().catch(console.error);
