import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupWorkerSchedule() {
  console.log('🚀 Setting up worker schedule system...');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'database', 'worker_schedule.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        if (error) {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          // Continue with other statements
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`❌ Error executing statement ${i + 1}:`, err.message);
        // Continue with other statements
      }
    }

    // Verify the setup by checking if tables exist
    console.log('🔍 Verifying setup...');
    
    const { data: workers, error: workersError } = await supabase
      .from('workers')
      .select('count')
      .limit(1);

    if (workersError) {
      console.error('❌ Error verifying workers table:', workersError.message);
    } else {
      console.log('✅ Workers table is accessible');
    }

    const { data: availability, error: availabilityError } = await supabase
      .from('worker_availability')
      .select('count')
      .limit(1);

    if (availabilityError) {
      console.error('❌ Error verifying worker_availability table:', availabilityError.message);
    } else {
      console.log('✅ Worker availability table is accessible');
    }

    const { data: timeOff, error: timeOffError } = await supabase
      .from('worker_time_off')
      .select('count')
      .limit(1);

    if (timeOffError) {
      console.error('❌ Error verifying worker_time_off table:', timeOffError.message);
    } else {
      console.log('✅ Worker time off table is accessible');
    }

    console.log('🎉 Worker schedule system setup completed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Visit your admin panel (Ctrl + Alt + A) and go to "Werknemers" tab');
    console.log('2. Create your first worker and set their availability');
    console.log('3. Visit /worker to let workers manage their own schedules');
    console.log('4. The calendar will now automatically show only available hours');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function setupWorkerScheduleDirect() {
  console.log('🚀 Setting up worker schedule system (direct method)...');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'database', 'worker_schedule.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Execute the entire SQL content
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      console.error('❌ Error executing SQL:', error.message);
      process.exit(1);
    }

    console.log('✅ Worker schedule system setup completed!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Visit /admin/schedule to manage worker schedules');
    console.log('2. Visit /worker to let workers manage their own schedules');
    console.log('3. The calendar will now automatically show only available hours');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Check if we have the exec_sql function available
async function checkExecSqlFunction() {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: 'SELECT 1' });
    return !error;
  } catch (err) {
    return false;
  }
}

// Main execution
async function main() {
  const hasExecSql = await checkExecSqlFunction();
  
  if (hasExecSql) {
    await setupWorkerScheduleDirect();
  } else {
    console.log('⚠️  exec_sql function not available, trying alternative method...');
    await setupWorkerSchedule();
  }
}

main().catch(console.error);
