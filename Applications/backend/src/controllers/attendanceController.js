import { supabase } from '../config/supabaseClient.js';

export const logAttendance = async (req, res) => {
    try {
        const { student_id, timestamp, status, confidence } = req.body;

        if (!student_id) {
            return res.status(400).json({ error: 'Missing student_id in payload.' });
        }

        const logTime = timestamp || new Date().toISOString();

        const { data, error } = await supabase
            .from('attendance')
            .insert([{
                user_id: student_id,
                timestamp: logTime,
                status: status || 'present'
            }])
            .select();
        
        if (error) {
            if (error.code === '23505') {
                 return res.status(409).json({ message: 'Attendance sequence already recorded', details: error.message });
            }
            throw error;
        }

        console.log(`[SUCCESS] Attendance logged for student ${student_id} at ${logTime}`);
        return res.status(201).json({ message: 'Attendance logged successfully', data });
    } catch (err) {
        console.error('[ERROR] Error logging attendance:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getLiveAttendance = async (req, res) => {
    try {
        // Without course_id, we count all live attendances today for the dashboard
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('attendance')
            .select('user_id')
            .gte('timestamp', today.toISOString());

        if (error) throw error;

        const uniqueStudents = new Set(data.map(log => log.user_id));
        
        return res.status(200).json({ live_count: uniqueStudents.size, total_logs: data.length });
    } catch (err) {
        console.error('[ERROR] Error fetching live attendance summary:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
