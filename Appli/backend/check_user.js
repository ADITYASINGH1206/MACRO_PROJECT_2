import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkEmail(email) {
  try {
    // Check auth.users using admin API
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log("Error fetching users:", error.message);
      return;
    }

    const authUser = data.users.find(u => u.email === email);
    
    if (authUser) {
      console.log(`✅ YES! ${email} exists in your database!`);
      console.log(`ID: ${authUser.id}, Created At: ${authUser.created_at}`);
      
      // Check user_profiles
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (profile) {
        console.log(`✅ Profile also created successfully with role: ${profile.role}`);
      } else {
        console.log(`⚠️ User is in Auth, but missing from 'user_profiles' table. (Maybe the database trigger didn't run?)`);
      }
      
    } else {
      console.log(`❌ NO. ${email} does NOT exist in the database.`);
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}

checkEmail('sharad@gmail.com');
