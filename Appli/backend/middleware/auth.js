import supabase from '../supabaseClient.js';

/**
 * Middleware to verify Supabase JWT
 * Extracts token from Authorization: Bearer <token>
 * and attaches user object to req.user
 */
export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token', details: error?.message });
        }

        // Fetch user profile to get role
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return res.status(403).json({ error: 'User profile not found' });
        }

        req.user = profile; // Contains id, email, role, etc.
        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
