import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupDefaultWorkers() {
  console.log('🧹 Cleaning up default workers...');

  try {
    // Find and delete the default worker
    const { data: defaultWorker, error: findError } = await supabase
      .from('workers')
      .select('id, name, email')
      .eq('email', 'worker@example.com')
      .single();

    if (findError && findError.code !== 'PGRST116') {
      console.error('❌ Error finding default worker:', findError.message);
      return;
    }

    if (!defaultWorker) {
      console.log('✅ No default worker found - nothing to clean up');
      return;
    }

    console.log(`📋 Found default worker: ${defaultWorker.name} (${defaultWorker.email})`);

    // Delete associated availability records first
    const { error: availabilityError } = await supabase
      .from('worker_availability')
      .delete()
      .eq('worker_id', defaultWorker.id);

    if (availabilityError) {
      console.error('❌ Error deleting availability records:', availabilityError.message);
      return;
    }

    console.log('✅ Deleted availability records');

    // Delete associated time-off records
    const { error: timeOffError } = await supabase
      .from('worker_time_off')
      .delete()
      .eq('worker_id', defaultWorker.id);

    if (timeOffError) {
      console.error('❌ Error deleting time-off records:', timeOffError.message);
      return;
    }

    console.log('✅ Deleted time-off records');

    // Delete the worker
    const { error: workerError } = await supabase
      .from('workers')
      .delete()
      .eq('id', defaultWorker.id);

    if (workerError) {
      console.error('❌ Error deleting worker:', workerError.message);
      return;
    }

    console.log('✅ Deleted default worker');
    console.log('🎉 Cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

cleanupDefaultWorkers().catch(console.error);
