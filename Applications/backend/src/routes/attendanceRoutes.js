import express from 'express';
import { logAttendance, getLiveAttendance } from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/', logAttendance);
router.get('/live/:course_id', getLiveAttendance);

export default router;
