const adminMiddleware = (req, res, next) => {
  // Check if user object exists and has admin role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // If not, return 403 Forbidden
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

module.exports = adminMiddleware;
