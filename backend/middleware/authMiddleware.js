// We import jsonwebtoken to verify the token sent by the user.
// Remember — after login, React stores the token and sends it
// with every request. This middleware checks if that token is valid.
const jwt = require('jsonwebtoken');

// We import our User model to fetch the full user data from database
const User = require('../models/User');

// ─────────────────────────────────────────
// PROTECT MIDDLEWARE
// This function runs BEFORE the actual route handler.
// Think of it as a security check at the door —
// if you don't have a valid token, you don't get in.
// ─────────────────────────────────────────
const protect = async (req, res, next) => {
  try {
    let token;

    // The token is sent in the request 'Authorization' header like this:
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
    // 'Bearer' is just a standard prefix — we only need the part after it.
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Split "Bearer tokenstring" by space and take the second part
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token was found in the header, block the request.
    // Status 401 means "Unauthorized" — you need to log in first.
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // jwt.verify() checks two things:
    // 1. Was this token created by our server? (using our JWT_SECRET)
    // 2. Has the token expired? (we set 7 days expiry on login)
    // If both pass, it returns the payload we stored: { id, role }
    // If either fails, it throws an error caught by our catch block.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // We use the id from the token to find the full user in the database.
    // .select('-password') means fetch everything EXCEPT the password field.
    // We never want the password floating around in memory unnecessarily.
    req.user = await User.findById(decoded.id).select('-password');

    // If user was deleted from DB but token still exists, block them.
    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // 'next()' is the key — it tells Express to move on to the actual
    // route handler. Without calling next(), the request would hang forever.
    // This is how middleware works — it sits in the middle of the pipeline.
    next();
  } catch (error) {
    // If token is invalid or expired, jwt.verify() throws an error.
    // We catch it here and return 401 Unauthorized.
    console.log('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// ─────────────────────────────────────────
// ADMIN MIDDLEWARE
// This runs AFTER protect middleware.
// Even if you're logged in, some routes are admin-only.
// Example: approving/rejecting item listings.
// ─────────────────────────────────────────
const adminOnly = (req, res, next) => {
  // By this point, protect middleware already ran and set req.user.
  // We just check if that user's role is 'admin'.
  if (req.user && req.user.role === 'admin') {
    // User is admin — allow them through
    next();
  } else {
    // User is logged in but not admin — block them.
    // Status 403 means "Forbidden" — you're authenticated but not allowed.
    // 401 = not logged in, 403 = logged in but no permission
    res.status(403).json({ message: 'Access denied, admins only' });
  }
};

// Export both middleware functions
module.exports = { protect, adminOnly };