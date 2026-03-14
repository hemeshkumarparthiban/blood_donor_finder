const pool = require('../config/db');

// @GET /api/requests
exports.getRequests = async (req, res) => {
  const { blood_group, city, urgency, status = 'Open', page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  let where = ['br.status = ?'];
  let params = [status];
  if (blood_group) { where.push('br.blood_group = ?'); params.push(blood_group); }
  if (city) { where.push('br.hospital_city LIKE ?'); params.push(`%${city}%`); }
  if (urgency) { where.push('br.urgency = ?'); params.push(urgency); }
  const whereStr = 'WHERE ' + where.join(' AND ');
  try {
    const [requests] = await pool.query(
      `SELECT br.*, u.full_name as requester_name, u.phone as requester_phone FROM blood_requests br
       JOIN users u ON br.requester_id = u.id ${whereStr} ORDER BY FIELD(br.urgency,'Critical','Urgent','Normal'), br.created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM blood_requests br JOIN users u ON br.requester_id = u.id ${whereStr}`, params);
    res.json({ success: true, requests, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @POST /api/requests
exports.createRequest = async (req, res) => {
  const { patient_name, blood_group, units_required, hospital_name, hospital_city, hospital_state, contact_phone, urgency, description, required_by } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO blood_requests (requester_id, patient_name, blood_group, units_required, hospital_name, hospital_city, hospital_state, contact_phone, urgency, description, required_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, patient_name, blood_group, units_required || 1, hospital_name, hospital_city, hospital_state, contact_phone, urgency || 'Normal', description, required_by || null]
    );
    res.status(201).json({ success: true, message: 'Blood request created successfully', requestId: result.insertId });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// @GET /api/requests/my
exports.getMyRequests = async (req, res) => {
  try {
    const [requests] = await pool.query('SELECT * FROM blood_requests WHERE requester_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @PUT /api/requests/:id/status
exports.updateRequestStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM blood_requests WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Request not found' });
    if (rows[0].requester_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await pool.query('UPDATE blood_requests SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Request status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @DELETE /api/requests/:id
exports.deleteRequest = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blood_requests WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Request not found' });
    if (rows[0].requester_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });
    await pool.query('DELETE FROM blood_requests WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
