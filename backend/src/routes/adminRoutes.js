import express from 'express';
import { getFaculties, getCourses, createCourse, assignFacultyToCourse } from '../controllers/adminController.js';

const router = express.Router();

router.get('/faculties', getFaculties);
router.get('/courses', getCourses);
router.post('/create-course', createCourse);
router.post('/assign-faculty', assignFacultyToCourse);

export default router;
