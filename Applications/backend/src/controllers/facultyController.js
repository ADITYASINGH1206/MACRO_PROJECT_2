import { supabase } from '../config/supabaseClient.js';

export const addStudent = async (req, res) => {
    try {
        const { name, email, course_id } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required to register a student.' });
        }

        // 1. Create User in `users` table
        // We set the role explicitly to 'student'
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([{ name, email, role: 'student' }])
            .select()
            .single();

        if (userError) throw userError;

        // 2. Enroll student in the `enrollments` table automatically
        if (course_id) {
            const { error: enrollError } = await supabase
                .from('enrollments')
                .insert([{ student_id: userData.id, course_id }]);
            
            if (enrollError) {
                console.warn('[WARNING] Student created but enrollment failed:', enrollError);
                // Non-blocking warning since user exists
            }
        }

        return res.status(201).json({ 
            message: 'Student added successfully!', 
            student: userData 
        });
    } catch (err) {
        console.error('[FACULTY ERROR] Error adding student:', err);
        return res.status(500).json({ error: 'Internal Server Error adding student' });
    }
};
