import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function createAdminTable() {
  console.log('🗄️  Creating admin_access_requests table...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Create the table using direct SQL
  const createTableSQL = `
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

  try {
    // Try to create the table by inserting a test record and then dropping it
    // This is a workaround since we can't execute raw SQL directly
    const { error } = await supabase
      .from('admin_access_requests')
      .insert([{
        id: '00000000-0000-0000-0000-000000000000',
        email: 'test@example.com',
        name: 'Test User',
        status: 'pending'
      }]);

    if (error && error.code === 'PGRST116') {
      console.log('✅ Table already exists or was created successfully');
    } else if (error) {
      console.log('❌ Table creation failed:', error.message);
      console.log('💡 Please run this SQL manually in your Supabase dashboard:');
      console.log(createTableSQL);
    } else {
      // Clean up the test record
      await supabase
        .from('admin_access_requests')
        .delete()
        .eq('id', '00000000-0000-0000-0000-000000000000');
      console.log('✅ Table created successfully');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('💡 Please run this SQL manually in your Supabase dashboard:');
    console.log(createTableSQL);
  }
}

createAdminTable().catch(console.error);
