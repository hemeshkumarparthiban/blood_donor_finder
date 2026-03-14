const pool = require('../config/db');

// @GET /api/donors - Search donors
exports.getDonors = async (req, res) => {
  const { blood_group, city, state, page = 1, limit = 12 } = req.query;
  const offset = (page - 1) * limit;
  let where = ['u.is_donor = TRUE', 'u.is_active = TRUE'];
  let params = [];

  if (blood_group) { where.push('u.blood_group = ?'); params.push(blood_group); }
  if (city) { where.push('u.city LIKE ?'); params.push(`%${city}%`); }
  if (state) { where.push('u.state LIKE ?'); params.push(`%${state}%`); }

  const whereStr = where.length ? 'WHERE ' + where.join(' AND ') : '';
  try {
    const [donors] = await pool.query(
      `SELECT u.id, u.full_name, u.blood_group, u.city, u.state, u.phone, u.age, u.gender, u.is_available, u.last_donation_date,
       (SELECT COUNT(*) FROM donations d WHERE d.donor_id = u.id) AS total_donations
       FROM users u ${whereStr} ORDER BY u.is_available DESC, u.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM users u ${whereStr}`, params);
    res.json({ success: true, donors, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @GET /api/donors/:id
exports.getDonorById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.blood_group, u.city, u.state, u.phone, u.age, u.gender, u.is_available, u.last_donation_date, u.created_at,
       (SELECT COUNT(*) FROM donations d WHERE d.donor_id = u.id) AS total_donations
       FROM users u WHERE u.id = ? AND u.is_donor = TRUE AND u.is_active = TRUE`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Donor not found' });
    res.json({ success: true, donor: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @GET /api/donors/stats/overview
exports.getDonorStats = async (req, res) => {
  try {
    const [[totalDonors]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE is_donor=TRUE AND is_active=TRUE");
    const [[availableDonors]] = await pool.query("SELECT COUNT(*) as count FROM users WHERE is_donor=TRUE AND is_available=TRUE AND is_active=TRUE");
    const [[totalDonations]] = await pool.query("SELECT COUNT(*) as count FROM donations");
    const [[openRequests]] = await pool.query("SELECT COUNT(*) as count FROM blood_requests WHERE status='Open'");
    const [bloodGroupStats] = await pool.query("SELECT blood_group, COUNT(*) as count FROM users WHERE is_donor=TRUE AND is_active=TRUE GROUP BY blood_group");
    res.json({ success: true, stats: { totalDonors: totalDonors.count, availableDonors: availableDonors.count, totalDonations: totalDonations.count, openRequests: openRequests.count, bloodGroupStats } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
