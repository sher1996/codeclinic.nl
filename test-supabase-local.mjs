// Test Supabase connection locally
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Testing Supabase connection locally...\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? '✅ Set' : '❌ Missing');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
console.log('');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('❌ Missing required Supabase environment variables!');
  process.exit(1);
}

// Test Supabase connection
async function testSupabase() {
  try {
    console.log('🔌 Creating Supabase client...');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    console.log('✅ Supabase client created successfully');

    console.log('📊 Testing database connection...');
    const { data, error } = await supabase
      .from('bookings')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Database query failed:', error);
      return;
    }

    console.log('✅ Database connection successful!');
    console.log('📈 Data:', data);

    // Test inserting a sample booking
    console.log('\n🧪 Testing booking insertion...');
    const testBooking = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '0612345678',
      date: '2025-01-15',
      time: '10:00',
      notes: 'Local test booking',
      appointment_type: 'onsite'
    };

    const { data: inserted, error: insertError } = await supabase
      .from('bookings')
      .insert([testBooking])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Booking insertion failed:', insertError);
      return;
    }

    console.log('✅ Test booking inserted successfully!');
    console.log('📝 Inserted booking:', inserted);

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('email', 'test@example.com');

    if (deleteError) {
      console.log('⚠️ Failed to clean up test data:', deleteError);
    } else {
      console.log('✅ Test data cleaned up');
    }

  } catch (error) {
    console.log('❌ Unexpected error:', error);
  }
}

testSupabase();
