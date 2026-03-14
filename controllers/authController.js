const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @POST /api/auth/register
exports.register = async (req, res) => {
  const { full_name, email, password, phone, blood_group, city, state, age, gender, is_donor, address } = req.body;
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password, phone, blood_group, city, state, age, gender, is_donor, address, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, email, hashed, phone, blood_group, city, state, age || null, gender || null, is_donor || false, address || null, is_donor || false]
    );
    const token = generateToken(result.insertId);
    res.status(201).json({ success: true, message: 'Registration successful', token, user: { id: result.insertId, full_name, email, role: 'user', blood_group, city, is_donor } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND is_active = TRUE', [email]);
    if (!rows.length) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const token = generateToken(user.id);
    res.json({
      success: true, message: 'Login successful', token,
      user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, blood_group: user.blood_group, city: user.city, is_donor: user.is_donor, is_available: user.is_available }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, full_name, email, phone, blood_group, city, state, address, age, gender, is_donor, is_available, last_donation_date, role, created_at FROM users WHERE id = ?', [req.user.id]);
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  const { full_name, phone, city, state, address, age, gender, is_donor, is_available, last_donation_date } = req.body;
  try {
    await pool.query(
      `UPDATE users SET full_name=?, phone=?, city=?, state=?, address=?, age=?, gender=?, is_donor=?, is_available=?, last_donation_date=? WHERE id=?`,
      [full_name, phone, city, state, address, age, gender, is_donor, is_available, last_donation_date || null, req.user.id]
    );
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  try {
    const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(current_password, rows[0].password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password incorrect' });
    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
