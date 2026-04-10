const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Access the authorization header
  const authHeader = req.headers.authorization;

  // Check if token exists and has 'Bearer ' prefix
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  // Extract the actual token
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed (e.g., expired or invalid signature)
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
