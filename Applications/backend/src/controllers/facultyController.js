import { supabase } from '../config/supabaseClient.js';

export const addStudent = async (req, res) => {
    try {
        const { name, email, course_id } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required to register a student.' });
        }

        // 1. Create User in `profiles` table
        // We set the role explicitly to 'Student'
        const { data: userData, error: userError } = await supabase
            .from('profiles')
            .insert([{ full_name: name, email, role: 'Student' }])
            .select()
            .single();

        if (userError) throw userError;

        return res.status(201).json({ 
            message: 'Student added successfully!', 
            student: userData 
        });
    } catch (err) {
        console.error('[FACULTY ERROR] Error adding student:', err);
        return res.status(500).json({ error: 'Internal Server Error adding student' });
    }
};
