import { supabase } from '../config/supabaseClient.js';

export const getStudentDashboard = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Student ID is required.' });
        }

        // 1. Get Student Profile & Stats
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*, academic_records(*)')
            .eq('id', id)
            .single();

        if (profileError) throw profileError;

        // 2. Get Enrolled Courses
        const { data: courses, error: coursesError } = await supabase
            .from('enrollments')
            .select('courses(*)')
            .eq('student_id', id);

        if (coursesError) throw coursesError;

        // 3. Get Recent Attendance
        const { data: history, error: historyError } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', id)
            .order('timestamp', { ascending: false })
            .limit(10);

        if (historyError) throw historyError;

        return res.status(200).json({
            profile,
            courses: courses.map(e => e.courses),
            history
        });

    } catch (err) {
        console.error('[STUDENT ERROR]', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getStudentCourses = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('enrollments')
            .select('courses(*)')
            .eq('student_id', id);

        if (error) throw error;
        return res.status(200).json(data.map(e => e.courses));
    } catch (err) {
        console.error('[STUDENT ERROR]', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getStudentHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('user_id', id)
            .order('timestamp', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
    } catch (err) {
        console.error('[STUDENT ERROR]', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
