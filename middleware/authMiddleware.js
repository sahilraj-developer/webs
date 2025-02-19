const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Check if the Authorization header is provided
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    // Extract the token from the "Bearer <token>" format
    const token = authHeader.split(' ')[1];

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload to the request object
    req.user = verified;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: Token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = auth;
