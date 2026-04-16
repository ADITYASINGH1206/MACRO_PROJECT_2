import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  const migrationPath = path.resolve('supabase/migrations/03_normalize_roles.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  console.log("Running migration...");

  // Supabase JS doesn't have a direct 'execute raw sql' for the public API,
  // but we can try to use rpc or multiple queries if it's restricted.
  // Actually, for raw DDL, we often use the SQL editor or a proxy.
  // Instead of raw SQL, we can use the JS client to update roles.
  
  try {
    // Stage 1: Update roles to lowercase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'faculty' })
      .eq('role', 'Faculty');

    const { error: updateError2 } = await supabase
      .from('profiles')
      .update({ role: 'student' })
      .eq('role', 'Student');

    if (updateError || updateError2) {
      console.error("Error updating roles:", updateError || updateError2);
    } else {
      console.log("Roles updated to lowercase successfully.");
    }
    
    console.log("Note: CHECK constraint changes must be done manually via Supabase Dashboard if this fails.");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

runMigration();
