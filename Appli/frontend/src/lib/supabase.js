import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️  VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in the .env file.");
}

// Ensure the URL is valid before creating the client to prevent crashes
const isValidUrl = (str) => {
  try { return /^https?:\/\//i.test(str); } catch { return false; }
};

export const supabase = (supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl)) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
