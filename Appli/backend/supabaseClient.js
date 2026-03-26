import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

const isValidUrl = (str) => {
  try { return /^https?:\/\//i.test(str); } catch { return false; }
};

if (!supabaseUrl || !supabaseKey || !isValidUrl(supabaseUrl)) {
  console.warn("⚠️  SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in the .env file.");
  console.warn("⚠️  Server will start, but database operations will fail until credentials are configured.");
} else {
  // We use the Service Role Key here to bypass RLS in the backend server
  // For the frontend, you'd use the public anon key.
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default supabase;
