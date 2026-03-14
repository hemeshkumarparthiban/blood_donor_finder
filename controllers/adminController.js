const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// @GET /api/admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [[totalUsers]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE role='user'");
    const [[totalDonors]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE is_donor=TRUE");
    const [[totalRequests]] = await pool.query("SELECT COUNT(*) as count FROM blood_requests");
    const [[openRequests]] = await pool.query("SELECT COUNT(*) as count FROM blood_requests WHERE status='Open'");
    const [[totalDonations]] = await pool.query("SELECT COUNT(*) as count FROM donations");
    const [[totalCamps]] = await pool.query("SELECT COUNT(*) as count FROM blood_camps WHERE is_active=TRUE");
    const [recentRequests] = await pool.query(
      `SELECT br.*, u.full_name as requester_name FROM blood_requests br JOIN users u ON br.requester_id=u.id ORDER BY br.created_at DESC LIMIT 5`
    );
    const [recentUsers] = await pool.query("SELECT id, full_name, email, blood_group, city, is_donor, created_at FROM users WHERE role='user' ORDER BY created_at DESC LIMIT 5");
    const [bloodGroupStats] = await pool.query("SELECT blood_group, COUNT(*) as count FROM users WHERE is_donor=TRUE GROUP BY blood_group ORDER BY count DESC");
    res.json({ success: true, dashboard: { totalUsers: totalUsers.count, totalDonors: totalDonors.count, totalRequests: totalRequests.count, openRequests: openRequests.count, totalDonations: totalDonations.count, totalCamps: totalCamps.count, recentRequests, recentUsers, bloodGroupStats } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 15, search, role } = req.query;
  const offset = (page - 1) * limit;
  let where = [];
  let params = [];
  if (search) { where.push('(u.full_name LIKE ? OR u.email LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
  if (role) { where.push('u.role = ?'); params.push(role); }
  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  try {
    const [users] = await pool.query(`SELECT id, full_name, email, phone, blood_group, city, state, is_donor, is_available, role, is_active, created_at FROM users u ${whereStr} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), parseInt(offset)]);
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM users u ${whereStr}`, params);
    res.json({ success: true, users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @PUT /api/admin/users/:id/toggle-status
exports.toggleUserStatus = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT is_active FROM users WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [!rows[0].is_active, req.params.id]);
    res.json({ success: true, message: `User ${rows[0].is_active ? 'deactivated' : 'activated'} successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ? AND role != "admin"', [req.params.id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @GET /api/admin/requests
exports.getAllRequests = async (req, res) => {
  const { page = 1, limit = 15, status } = req.query;
  const offset = (page - 1) * limit;
  let where = status ? 'WHERE br.status = ?' : '';
  let params = status ? [status] : [];
  try {
    const [requests] = await pool.query(`SELECT br.*, u.full_name as requester_name FROM blood_requests br JOIN users u ON br.requester_id=u.id ${where} ORDER BY br.created_at DESC LIMIT ? OFFSET ?`, [...params, parseInt(limit), parseInt(offset)]);
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM blood_requests br ${where}`, params);
    res.json({ success: true, requests, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Camps CRUD
exports.getCamps = async (req, res) => {
  try {
    const [camps] = await pool.query('SELECT * FROM blood_camps ORDER BY camp_date ASC');
    res.json({ success: true, camps });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createCamp = async (req, res) => {
  const { organizer_name, camp_name, location, city, state, camp_date, start_time, end_time, contact_phone, contact_email, description } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO blood_camps (organizer_name, camp_name, location, city, state, camp_date, start_time, end_time, contact_phone, contact_email, description, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [organizer_name, camp_name, location, city, state, camp_date, start_time, end_time, contact_phone, contact_email, description, req.user.id]
    );
    res.status(201).json({ success: true, message: 'Camp created', campId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteCamp = async (req, res) => {
  try {
    await pool.query('DELETE FROM blood_camps WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Camp deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json({ success: true, testimonials: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.approveTestimonial = async (req, res) => {
  try {
    await pool.query('UPDATE testimonials SET is_approved = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Testimonial approved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
