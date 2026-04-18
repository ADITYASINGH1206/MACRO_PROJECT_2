import express from 'express';
import { addStudent, getStudents, getAttendanceLogs, markManualAttendance, markBulkAttendance, startLiveAttendance, stopLiveAttendance, getFacultyCourses, createCourse } from '../controllers/facultyController.js';

const router = express.Router();

router.post('/add-student', addStudent);
router.post('/create-course', createCourse);
router.get('/students', getStudents);
router.get('/courses/:id', getFacultyCourses);
router.get('/attendance-logs', getAttendanceLogs);
router.post('/mark-attendance', markManualAttendance);
router.post('/mark-bulk-attendance', markBulkAttendance);
router.post('/start-live-tracking', startLiveAttendance);
router.post('/stop-live-tracking', stopLiveAttendance);


export default router;
