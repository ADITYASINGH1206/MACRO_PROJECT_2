import { supabase } from '../config/supabaseClient.js';

export const getStudentDashboard = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: 'Student ID is required.' });
        }

        // 1. Get Student Profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, email, avatar_url')
            .eq('id', id)
            .single();

        if (profileError) throw profileError;

        // 2. Get Enrolled Courses with Faculty Names
        const { data: enrollmentData, error: coursesError } = await supabase
            .from('enrollments')
            .select('course_id, courses(*)')
            .eq('student_id', id);

        if (coursesError) throw coursesError;

        // 3. Get Full Attendance History with Course Names
        const { data: allHistory, error: historyError } = await supabase
            .from('attendance')
            .select('*, courses(name, code)')
            .eq('user_id', id)
            .order('timestamp', { ascending: false });

        if (historyError) throw historyError;

        // 4. Calculate Dynamic Stats Per Course
        const courses = enrollmentData.map(e => {
            const course = e.courses;
            const courseLogs = allHistory.filter(h => h.course_id === course.id);
            const presentCount = courseLogs.filter(h => h.status === 'present').length;
            
            // For denominator, we'll use a conservative estimate based on the unique days 
            // any attendance was logged for this course in the system (proxy for sessions held)
            // If No sessions held, we assume 100% (ideal state)
            const attendance_rate = courseLogs.length > 0 ? ((presentCount / courseLogs.length) * 100).toFixed(1) : "100.0";
            
            return {
                ...course,
                attendance_rate
            };
        });

        // Identify lowest performing course
        const lowestCourse = courses.length > 0 ? [...courses].sort((a, b) => parseFloat(a.attendance_rate) - parseFloat(b.attendance_rate))[0] : null;

        // Calculate Average Overall Attendance
        const overall_attendance = courses.length > 0 
            ? (courses.reduce((acc, current) => acc + parseFloat(current.attendance_rate), 0) / courses.length).toFixed(1)
            : "100.0";

        return res.status(200).json({
            profile: { ...profile, lowest_performing: lowestCourse, overall_attendance },
            courses,
            history: allHistory.slice(0, 10) 
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
