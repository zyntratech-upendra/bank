const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'banking_secure_super_jwt_secret_key_2026_xyz');
    
    // Check if user still exists if DB connected, or decode payload
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // In-memory or fallback
    }

    req.user = user || {
      _id: decoded.id,
      id: decoded.id,
      role: decoded.role || 'user',
      name: decoded.name || 'Admin',
      email: decoded.email || 'admin@bankingservices.com'
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
      return next();
    }
    return res.status(403).json({ 
      message: 'Access denied: Administrator privileges required',
      currentRole: req.user ? req.user.role : 'none'
    });
  });
};

module.exports = {
  verifyToken,
  verifyAdmin
};
