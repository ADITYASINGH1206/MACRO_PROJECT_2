import { supabase } from '../config/supabaseClient.js';

export const addStudent = async (req, res) => {
    try {
        const { name, email, course_id } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required to register a student.' });
        }

        // 1. Create User in `profiles` table
        // We set the role explicitly to 'student'
        const { data: userData, error: userError } = await supabase
            .from('profiles')
            .insert([{ full_name: name, email, role: 'student' }])
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

export const getStudents = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url')
            .eq('role', 'student');

        if (error) throw error;
        return res.status(200).json(data);
    } catch (err) {
        console.error('[FACULTY ERROR] Error fetching students:', err);
        return res.status(500).json({ error: 'Internal Server Error fetching students' });
    }
};

export const getAttendanceLogs = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('attendance')
            .select(`
                id,
                timestamp,
                status,
                profiles:user_id (full_name, email)
            `)
            .order('timestamp', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
    } catch (err) {
        console.error('[FACULTY ERROR] Error fetching attendance logs:', err);
        return res.status(500).json({ error: 'Internal Server Error fetching logs' });
    }
};

export const markManualAttendance = async (req, res) => {
    try {
        const { student_id, status, timestamp } = req.body;

        if (!student_id || !status) {
            return res.status(400).json({ error: 'Student ID and status are required.' });
        }

        const { data, error } = await supabase
            .from('attendance')
            .insert([{
                user_id: student_id,
                status,
                timestamp: timestamp || new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json({ message: 'Manual attendance marked', data });
    } catch (err) {
        console.error('[FACULTY ERROR] Error marking manual attendance:', err);
        return res.status(500).json({ error: 'Internal Server Error marking attendance' });
    }
};

