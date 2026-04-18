import { supabase } from '../config/supabaseClient.js';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

let mlProcess = null;
let trackingSessions = new Map(); // Course ID -> Start Timestamp

export const startLiveAttendance = async (req, res) => {
    if (mlProcess) {
        return res.status(400).json({ error: 'Live tracking is already running.' });
    }
    const { course_id } = req.body;
    const rootDir = path.resolve(process.cwd(), '..');
    const batPath = path.join(rootDir, 'ml-core', 'run_vision_server.bat');
    
    try {
        // Record session start time for accurate absentee marking later
        if (course_id) {
            trackingSessions.set(course_id, new Date().toISOString());
            console.log(`[SESSION] Tracking started for ${course_id} at ${trackingSessions.get(course_id)}`);
        }

        mlProcess = spawn('cmd.exe', ['/c', batPath], { 
            cwd: path.join(rootDir, 'ml-core'),
            env: process.env
        });
        
        mlProcess.stdout.on('data', (data) => console.log(`[ML-CORE STDOUT] ${data}`));
        mlProcess.stderr.on('data', (data) => console.error(`[ML-CORE STDERR] ${data}`));

        mlProcess.on('close', (code) => {
            console.log(`[SYSTEM] ML-Core process exited with code ${code}`);
            mlProcess = null;
        });
        
        return res.status(200).json({ message: 'Live attendance tracking started successfully.' });
    } catch (e) {
        mlProcess = null;
        return res.status(500).json({ error: 'Failed to launch ML pipeline: ' + e.message });
    }
};

export const stopLiveAttendance = async (req, res) => {
    if (!mlProcess) {
        return res.status(400).json({ error: 'Live tracking is not running.' });
    }
    
    const { course_id } = req.body;

    try {
        // 1. Terminate ML Process Tree
        spawn('taskkill', ['/pid', mlProcess.pid, '/f', '/t']);
        mlProcess = null;

        // 2. Automatic Session Finalization (Mark Absent)
        if (course_id) {
            console.log(`[SESSION] Finalizing attendance for course: ${course_id}`);
            
            const { data: enrolledStudents } = await supabase
                .from('enrollments')
                .select('student_id')
                .eq('course_id', course_id);

            if (enrolledStudents && enrolledStudents.length > 0) {
                const studentIds = enrolledStudents.map(e => e.student_id);
                
                // Use session start time if available, otherwise fallback to 12h window
                const sessionStart = trackingSessions.get(course_id);
                const queryStartTime = sessionStart || new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
                
                console.log(`[SESSION] Checking activity since: ${queryStartTime}`);

                // Find who ALREADY has ANY attendance record for this course since session start
                const { data: existingLogs } = await supabase
                    .from('attendance')
                    .select('user_id')
                    .eq('course_id', course_id)
                    .gte('timestamp', queryStartTime);

                const accountedIds = new Set(existingLogs?.map(l => l.user_id) || []);
                const absentToMark = studentIds.filter(id => !accountedIds.has(id));

                if (absentToMark.length > 0) {
                    const absentRecords = absentToMark.map(sid => ({
                        user_id: sid,
                        course_id,
                        status: 'absent',
                        timestamp: new Date().toISOString()
                    }));

                    const { error: insertError } = await supabase.from('attendance').insert(absentRecords);
                    if (insertError) {
                        console.error('[SESSION ERROR] Failed to insert absent records:', insertError);
                    } else {
                        console.log(`[SESSION] Successfully marked ${absentToMark.length} students as ABSENT.`);
                    }
                } else {
                    console.log('[SESSION] All enrolled students already have attendance records for this session.');
                }
            }
            // Cleanup session metadata
            trackingSessions.delete(course_id);
        }

        return res.status(200).json({ message: 'Live attendance tracking stopped and session finalized.' });
    } catch (e) {
        console.error('[ERROR] Session finalization failed:', e);
        return res.status(500).json({ error: 'Failed to stop ML pipeline: ' + e.message });
    }
};

export const addStudent = async (req, res) => {
    try {
        const { name, email, course_id, imageBase64 } = req.body;

        if (!name || !email || !imageBase64) {
            return res.status(400).json({ error: 'Name, email, and biometric image are required.' });
        }

        // 1. Create or Find User in `profiles` table
        // We use upsert on email to prevent duplicates
        const { data: userData, error: userError } = await supabase
            .from('profiles')
            .upsert(
                [{ full_name: name, email, role: 'student' }], 
                { onConflict: 'email', ignoreDuplicates: false }
            )
            .select()
            .single();

        if (userError) throw userError;

        // 2. Automatically enroll student in the faculty member's course
        // We need to know which faculty is adding the student (passed from frontend)
        const { faculty_id } = req.body;
        let activeCourseId = course_id; // Use provided course_id if any

        if (faculty_id && !activeCourseId) {
            const { data: facultyData } = await supabase
                .from('profiles')
                .select('course_id')
                .eq('id', faculty_id)
                .single();
            if (facultyData?.course_id) activeCourseId = facultyData.course_id;
        }

        if (activeCourseId) {
            await supabase
                .from('enrollments')
                .upsert(
                    [{ student_id: userData.id, course_id: activeCourseId }],
                    { onConflict: 'student_id,course_id' }
                );
        }

        // 3. Decode and save Base64 image to temporary drive
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const tempPath = path.join(process.cwd(), 'temp', `enroll_${userData.id}.jpg`);
        fs.writeFileSync(tempPath, buffer);

        // 3. Spawns Python indexing engine on the newly created image for 128D extraction
        const rootDir = path.resolve(process.cwd(), '..');
        const pythonExe = path.join(rootDir, '.venv', 'Scripts', 'python.exe');
        const scriptPath = path.join(rootDir, 'ml-core', 'enroll_face.py');

        const enrollProcess = spawn(pythonExe, [scriptPath, userData.id, tempPath]);

        enrollProcess.on('close', (code) => {
            console.log(`[SYSTEM] ML-Enrollment process exited with code ${code} for ${name}`);
            try {
                // Wipe biometric snapshot from local disk after extraction (GDPR/Compliance)
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            } catch(e) { console.error('Failed to clear temp file', e); }
        });

        return res.status(201).json({ 
            message: 'Student added && Biometrics queued successfully!', 
            student: userData 
        });
    } catch (err) {
        console.error('[FACULTY ERROR] Error adding student:', err);
        return res.status(500).json({ error: 'Internal Server Error adding student' });
    }
};

export const getStudents = async (req, res) => {
    try {
        const { faculty_id } = req.query; // Expect faculty_id from frontend
        
        let query = supabase
            .from('profiles')
            .select(`
                id, 
                full_name, 
                email, 
                avatar_url,
                enrollments!inner(course_id, courses!inner(faculty_id))
            `)
            .eq('role', 'student');

        if (faculty_id) {
            query = query.eq('enrollments.courses.faculty_id', faculty_id);
        }

        const { data, error } = await query;

        if (error) throw error;
        
        // Flatten the response while preserving the enrollment mapping
        const students = data.map(s => ({
            id: s.id,
            full_name: s.full_name,
            email: s.email,
            avatar_url: s.avatar_url,
            course_ids: s.enrollments.map(e => e.course_id)
        }));

        return res.status(200).json(students);
    } catch (err) {
        console.error('[FACULTY ERROR] Error fetching students:', err);
        return res.status(500).json({ error: 'Internal Server Error fetching students' });
    }
};

export const getAttendanceLogs = async (req, res) => {
    try {
        const { faculty_id } = req.query;

        let query = supabase
            .from('attendance')
            .select(`
                id,
                timestamp,
                status,
                course_id,
                profiles:user_id (full_name, email),
                courses!inner(name, code, faculty_id)
            `);

        if (faculty_id) {
            query = query.eq('courses.faculty_id', faculty_id);
        }

        const { data, error } = await query.order('timestamp', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
    } catch (err) {
        console.error('[FACULTY ERROR] Error fetching attendance logs:', err);
        return res.status(500).json({ error: 'Internal Server Error fetching logs' });
    }
};

export const markManualAttendance = async (req, res) => {
    try {
        const { student_id, status, timestamp } = req.body;

        if (!student_id || !status) {
            return res.status(400).json({ error: 'Student ID and status are required.' });
        }

        const { data, error } = await supabase
            .from('attendance')
            .insert([{
                user_id: student_id,
                course_id: req.body.course_id, // include course_id if provided
                status,
                timestamp: timestamp || new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json({ message: 'Manual attendance marked', data });
    } catch (err) {
        console.error('[FACULTY ERROR] Error marking manual attendance:', err);
        return res.status(500).json({ error: 'Internal Server Error marking attendance' });
    }
};

export const markBulkAttendance = async (req, res) => {
    try {
        const { attendanceRecords } = req.body; // Expect array of { student_id, status, course_id, timestamp }

        if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
            return res.status(400).json({ error: 'Valid attendance records are required.' });
        }

        const formattedRecords = attendanceRecords.map(r => ({
            user_id: r.student_id,
            course_id: r.course_id,
            status: r.status,
            timestamp: r.timestamp || new Date().toISOString()
        }));

        const { data, error } = await supabase
            .from('attendance')
            .insert(formattedRecords)
            .select();

        if (error) throw error;
        return res.status(201).json({ message: `Successfully marked ${data.length} records manually.`, data });
    } catch (err) {
        console.error('[FACULTY ERROR] Error marking bulk attendance:', err);
        return res.status(500).json({ error: 'Internal Server Error marking bulk attendance' });
    }
};
export const getFacultyCourses = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('faculty_id', id);

        if (error) throw error;
        return res.status(200).json(data);
    } catch (err) {
        console.error('[FACULTY ERROR] Error fetching faculty courses:', err);
        return res.status(500).json({ error: 'Internal Server Error fetching courses' });
    }
};

export const createCourse = async (req, res) => {
    try {
        const { name, code, faculty_id } = req.body;
        if (!name || !code || !faculty_id) {
            return res.status(400).json({ error: 'Course name, code, and faculty_id are required.' });
        }

        // Fetch faculty name for the course record legacy field
        const { data: faculty } = await supabase.from('profiles').select('full_name').eq('id', faculty_id).single();

        const { data, error } = await supabase
            .from('courses')
            .insert([{ 
                name, 
                code, 
                faculty_id,
                faculty_name: faculty?.full_name || 'Assigned Faculty'
            }])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json({ message: 'Course created successfully', course: data });
    } catch (err) {
        console.error('[FACULTY ERROR] Error creating course:', err);
        return res.status(500).json({ error: 'Internal Server Error creating course' });
    }
};
