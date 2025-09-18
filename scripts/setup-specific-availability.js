import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSpecificAvailabilityTable() {
  console.log('🚀 Setting up worker_specific_availability table...');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'database', 'worker_specific_availability.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Error executing SQL:', error.message);
      
      // Try alternative approach - execute SQL directly
      console.log('🔄 Trying alternative approach...');
      
      // Split SQL into individual statements
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        if (stmtError) {
          console.error(`❌ Error executing statement: ${stmtError.message}`);
          console.error(`Statement: ${statement}`);
        } else {
          console.log('✅ Statement executed successfully');
        }
      }
    } else {
      console.log('✅ worker_specific_availability table created successfully');
    }

    // Verify the table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'worker_specific_availability');

    if (tablesError) {
      console.error('❌ Error checking table existence:', tablesError.message);
    } else if (tables && tables.length > 0) {
      console.log('✅ worker_specific_availability table verified');
    } else {
      console.log('⚠️  Table may not have been created properly');
    }

    // Test inserting a sample record
    console.log('🧪 Testing table functionality...');
    const { data: workers } = await supabase
      .from('workers')
      .select('id')
      .limit(1);

    if (workers && workers.length > 0) {
      const testRecord = {
        worker_id: workers[0].id,
        availability_date: '2025-08-13',
        start_time: '09:00',
        end_time: '17:00',
        is_available: true,
        reason: 'Test record'
      };

      const { data: insertData, error: insertError } = await supabase
        .from('worker_specific_availability')
        .insert([testRecord])
        .select();

      if (insertError) {
        console.error('❌ Error testing insert:', insertError.message);
      } else {
        console.log('✅ Test insert successful');
        
        // Clean up test record
        await supabase
          .from('worker_specific_availability')
          .delete()
          .eq('id', insertData[0].id);
        console.log('🧹 Test record cleaned up');
      }
    } else {
      console.log('⚠️  No workers found to test with');
    }

    console.log('🎉 Setup completed!');
    console.log('');
    console.log('You can now use the "Specifieke Datums" tab in the admin interface');
    console.log('to add specific date availability like "August 13, 2025 9:00-17:00"');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupSpecificAvailabilityTable();
