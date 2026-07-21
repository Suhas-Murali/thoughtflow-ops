/**
 * Express middleware factory. Returns a middleware that only allows
 * requests through if req.user.role is in the allowedRoles list.
 * Must run AFTER authenticateJWT, since it relies on req.user being set.
 */
function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required before role check.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}.`,
      });
    }

    next();
  };
}

module.exports = requireRole;