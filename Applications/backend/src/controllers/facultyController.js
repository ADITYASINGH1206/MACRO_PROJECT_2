import { supabase } from '../config/supabaseClient.js';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

let mlProcess = null;

export const startLiveAttendance = async (req, res) => {
    if (mlProcess) {
        return res.status(400).json({ error: 'Live tracking is already running.' });
    }
    
    const rootDir = path.resolve(process.cwd(), '..', '..');
    const batPath = path.join(rootDir, 'Applications', 'ml-core', 'run_ml_core.bat');
    
    try {
        mlProcess = spawn('cmd.exe', ['/c', batPath], { cwd: path.join(rootDir, 'Applications', 'ml-core'), detached: false });
        
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
    
    try {
        // Using taskkill to kill process tree cleanly on Windows
        spawn('taskkill', ['/pid', mlProcess.pid, '/f', '/t']);
        mlProcess = null;
        return res.status(200).json({ message: 'Live attendance tracking stopped.' });
    } catch (e) {
        return res.status(500).json({ error: 'Failed to stop ML pipeline: ' + e.message });
    }
};

export const addStudent = async (req, res) => {
    try {
        const { name, email, course_id, imageBase64 } = req.body;

        if (!name || !email || !imageBase64) {
            return res.status(400).json({ error: 'Name, email, and biometric image are required.' });
        }

        // 1. Create User in `profiles` table
        // We set the role explicitly to 'student'
        const { data: userData, error: userError } = await supabase
            .from('profiles')
            .insert([{ full_name: name, email, role: 'student' }])
            .select()
            .single();

        if (userError) throw userError;

        // 2. Decode and save Base64 image to temporary drive
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const tempPath = path.join(process.cwd(), 'temp', `enroll_${userData.id}.jpg`);
        fs.writeFileSync(tempPath, buffer);

        // 3. Spawns Python indexing engine on the newly created image for 128D extraction
        const rootDir = path.resolve(process.cwd(), '..', '..');
        const pythonExe = path.join(rootDir, '.venv', 'Scripts', 'python.exe');
        const scriptPath = path.join(rootDir, 'Applications', 'ml-core', 'enroll_face.py');

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
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url')
            .eq('role', 'student');

        if (error) throw error;
        return res.status(200).json(data);
    } catch (err) {
        console.error('[FACULTY ERROR] Error fetching students:', err);
        return res.status(500).json({ error: 'Internal Server Error fetching students' });
    }
};

export const getAttendanceLogs = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('attendance')
            .select(`
                id,
                timestamp,
                status,
                profiles:user_id (full_name, email)
            `)
            .order('timestamp', { ascending: false });

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

