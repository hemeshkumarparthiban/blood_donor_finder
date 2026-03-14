const pool = require('../config/db');

// @GET /api/camps (public)
exports.getPublicCamps = async (req, res) => {
  try {
    const [camps] = await pool.query("SELECT * FROM blood_camps WHERE is_active=TRUE AND camp_date >= CURDATE() ORDER BY camp_date ASC");
    res.json({ success: true, camps });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @GET /api/testimonials (public approved)
exports.getApprovedTestimonials = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM testimonials WHERE is_approved=TRUE ORDER BY created_at DESC LIMIT 10");
    res.json({ success: true, testimonials: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @POST /api/testimonials
exports.submitTestimonial = async (req, res) => {
  const { author_name, message, rating } = req.body;
  try {
    await pool.query(
      'INSERT INTO testimonials (user_id, author_name, message, rating) VALUES (?, ?, ?, ?)',
      [req.user?.id || null, author_name, message, rating || 5]
    );
    res.status(201).json({ success: true, message: 'Testimonial submitted for review' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @POST /api/donations
exports.recordDonation = async (req, res) => {
  const { donation_date, blood_group, units_donated, hospital_name, city, request_id, notes } = req.body;
  try {
    await pool.query(
      'INSERT INTO donations (donor_id, request_id, donation_date, blood_group, units_donated, hospital_name, city, notes) VALUES (?,?,?,?,?,?,?,?)',
      [req.user.id, request_id || null, donation_date, blood_group, units_donated || 1, hospital_name, city, notes]
    );
    await pool.query('UPDATE users SET last_donation_date = ?, is_available = FALSE WHERE id = ?', [donation_date, req.user.id]);
    res.status(201).json({ success: true, message: 'Donation recorded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @GET /api/donations/my
exports.getMyDonations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM donations WHERE donor_id = ? ORDER BY donation_date DESC', [req.user.id]);
    res.json({ success: true, donations: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
