const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT id, full_name, email, role, blood_group, city, is_donor FROM users WHERE id = ? AND is_active = TRUE', [decoded.id]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Admin access only' });
};

module.exports = { protect, adminOnly };
