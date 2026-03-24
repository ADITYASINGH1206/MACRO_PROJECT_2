import express from 'express';
import { getStudentDashboard, getStudentCourses, getStudentHistory } from '../controllers/studentController.js';

const router = express.Router();

// GET /api/student/dashboard/:id
router.get('/dashboard/:id', getStudentDashboard);

// GET /api/student/courses/:id
router.get('/courses/:id', getStudentCourses);

// GET /api/student/history/:id
router.get('/history/:id', getStudentHistory);

export default router;
