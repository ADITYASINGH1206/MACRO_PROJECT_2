import express from 'express';
import { addStudent, getStudents, getAttendanceLogs, markManualAttendance, startLiveAttendance, stopLiveAttendance } from '../controllers/facultyController.js';

const router = express.Router();

router.post('/add-student', addStudent);
router.get('/students', getStudents);
router.get('/attendance-logs', getAttendanceLogs);
router.post('/mark-attendance', markManualAttendance);
router.post('/start-live-tracking', startLiveAttendance);
router.post('/stop-live-tracking', stopLiveAttendance);


export default router;
