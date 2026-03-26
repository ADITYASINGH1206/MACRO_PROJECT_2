import express from 'express';
import supabase from '../supabaseClient.js';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleGuard.js';

const router = express.Router();

// @route GET /api/courses/:id/roster
// @desc Get roster of a specific course along with student profiles
// @access Private (Faculty only)
router.get('/:id/roster', requireAuth, requireRole('faculty'), async (req, res) => {
    try {
        const courseId = req.params.id;

        const { data: enrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select(`
                student_id,
                student_profiles (
                    student_id_number,
                    user_profiles ( first_name, last_name, email )
                )
            `)
            .eq('course_id', courseId);

        if (enrollError) throw enrollError;

        res.status(200).json(enrollments);
    } catch (err) {
        console.error("Error fetching roster:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;
