const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY must be defined');
}

const clientKey = supabaseServiceRoleKey || supabaseKey;

if (!clientKey) {
  throw new Error('A Supabase key must be defined (SUPABASE_KEY or service role key)');
}

const supabase = createClient(supabaseUrl, clientKey);

module.exports = supabase;
