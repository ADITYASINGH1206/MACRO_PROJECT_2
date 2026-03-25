import { supabase } from './src/config/supabaseClient.js';

async function checkSchema() {
    console.log('--- Checking Supabase Schema ---');
    
    // Check tables by trying to select from them
    const tables = ['profiles', 'attendance', 'courses', 'faculty_courses', 'departments'];
    
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`[TABLE] ${table}: ERROR - ${error.message}`);
        } else {
            console.log(`[TABLE] ${table}: EXISTS (${data.length} rows sample)`);
            if (data.length > 0) {
                console.log(`[COLUMNS] ${table}:`, Object.keys(data[0]));
            }
        }
    }
}

checkSchema();
