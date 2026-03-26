/**
 * Middleware factory to guard routes by user role
 * Requires requireAuth middleware to run first
 * @param {string} requiredRole - e.g., 'faculty', 'student'
 */
export const requireRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required before checking roles' });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: `Forbidden: Requires ${requiredRole} access` });
        }

        next();
    };
};
