import { supabase } from '../config/supabaseClient.js';

export const login = async (req, res) => {
    try {
        const { email, role } = req.body;
        
        if (!email || !role) {
            return res.status(400).json({ error: 'Email and role are required.' });
        }

        // Query the Profiles table for matching credentials
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, role')
            .eq('email', email)
            .eq('role', role)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Invalid credentials or user not found.' });
        }

        // Generate a simple stateless token (base64 encoded user details for mock JWT)
        const token = Buffer.from(JSON.stringify({ id: data.id, role: data.role })).toString('base64');

        return res.status(200).json({ 
            message: 'Login successful', 
            user: data, 
            token 
        });
    } catch (err) {
        console.error('[AUTH ERROR]', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
