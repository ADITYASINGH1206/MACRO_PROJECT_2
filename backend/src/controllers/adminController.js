import { supabase } from '../config/supabaseClient.js';

export const getFaculties = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'faculty');

        if (error) throw error;
        return res.status(200).json(data);
    } catch (err) {
        console.error('[ADMIN ERROR] Error fetching faculties:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getCourses = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('courses')
            .select('*');

        if (error) throw error;
        return res.status(200).json(data);
    } catch (err) {
        console.error('[ADMIN ERROR] Error fetching courses:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createCourse = async (req, res) => {
    try {
        const { name, code, department } = req.body;
        const { data, error } = await supabase
            .from('courses')
            .insert([{ name, code, department }])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json(data);
    } catch (err) {
        console.error('[ADMIN ERROR] Error creating course:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const assignFacultyToCourse = async (req, res) => {
    try {
        const { faculty_id, course_id } = req.body;
        const { data, error } = await supabase
            .from('profiles')
            .update({ course_id })
            .eq('id', faculty_id)
            .eq('role', 'faculty')
            .select()
            .single();

        if (error) throw error;
        return res.status(200).json({ message: 'Faculty assigned to course', data });
    } catch (err) {
        console.error('[ADMIN ERROR] Error assigning faculty:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
