import express from 'express';
import supabase from '../supabaseClient.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// @route POST /api/attendance/live
// @desc Receive live attendance payload from Python ML Core
router.post('/live', async (req, res) => {
    // Basic API Key check to prevent unauthorized payloads
    const apiKey = req.headers['x-api-key'];
    const ML_CORE_API_KEY = process.env.ML_CORE_API_KEY || 'default_ml_secret_key';
    
    if (apiKey !== ML_CORE_API_KEY) {
        return res.status(401).json({ error: "Unauthorized ML Core payload" });
    }

    try {
        const { student_id, course_id, timestamp, status } = req.body;
        
        if (!student_id || !course_id) {
            return res.status(400).json({ error: "Missing required fields: student_id, course_id" });
        }

        const { data, error } = await supabase
            .from('attendance_logs')
            .insert([
                { 
                    student_id, 
                    course_id, 
                    timestamp: timestamp || new Date().toISOString(), 
                    status: status || 'present' 
                }
            ]);

        if (error) throw error;

        res.status(201).json({ message: "Attendance logged successfully", data });
    } catch (err) {
        console.error("Error logging attendance:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// @route GET /api/attendance/history/:student_id
// @desc Get attendance history for a specific student
router.get('/history/:student_id', requireAuth, async (req, res) => {
    try {
        // Authorization: Students can only view their own history.
        // Faculty can view any student's history.
        if (req.user.role === 'student' && req.user.id !== req.params.student_id) {
            return res.status(403).json({ error: "Forbidden: You can only view your own attendance history" });
        }

        const { data, error } = await supabase
            .from('attendance_logs')
            .select(`
                *,
                courses ( course_name, course_code )
            `)
            .eq('student_id', req.params.student_id)
            .order('timestamp', { ascending: false });

        if (error) throw error;
        
        res.status(200).json(data);
    } catch (err) {
        console.error("Error fetching history:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;
