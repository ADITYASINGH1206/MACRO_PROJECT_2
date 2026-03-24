import express from 'express';
import { addStudent, getStudents, getAttendanceLogs, markManualAttendance } from '../controllers/facultyController.js';

const router = express.Router();

router.post('/add-student', addStudent);
router.get('/students', getStudents);
router.get('/attendance-logs', getAttendanceLogs);
router.post('/mark-attendance', markManualAttendance);


export default router;
