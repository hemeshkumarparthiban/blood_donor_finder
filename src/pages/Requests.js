import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getRequests, createRequest, updateRequestStatus } from '../utils/api';
import { RequestCard, Spinner, Toast } from '../components/UIComponents';
import { useAuth } from '../context/AuthContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ blood_group: '', city: '', urgency: '', status: 'Open' });
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ patient_name: '', blood_group: '', units_required: 1, hospital_name: '', hospital_city: '', hospital_state: '', contact_phone: '', urgency: 'Normal', description: '', required_by: '' });
  const { user } = useAuth();

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await getRequests(params);
      setRequests(res.data.requests);
      setTotal(res.data.total);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchRequests(); }, [filters]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.blood_group) return setToast({ message: 'Please select blood group', type: 'error' });
    setSubmitting(true);
    try {
      await createRequest(form);
      setToast({ message: 'Blood request posted successfully! 🩸', type: 'success' });
      setShowForm(false);
      setForm({ patient_name: '', blood_group: '', units_required: 1, hospital_name: '', hospital_city: '', hospital_state: '', contact_phone: '', urgency: 'Normal', description: '', required_by: '' });
      fetchRequests();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to post request', type: 'error' });
    } finally { setSubmitting(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateRequestStatus(id, status);
      fetchRequests();
      setToast({ message: `Request marked as ${status}`, type: 'success' });
    } catch (err) { setToast({ message: 'Update failed', type: 'error' }); }
  };

  const inputCls = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', transition: 'border-color 0.25s', color: '#1F2937', background: 'white' };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: '#FAF9F7' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1A0A0E, #2C0A14)', padding: '50px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(192,21,42,0.12) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'white', marginBottom: 8 }}>
              🆘 Blood <span style={{ background: 'linear-gradient(135deg, #C0152A, #E63950)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Requests</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>{total} active request{total !== 1 ? 's' : ''} found</p>
          </div>
          {user ? (
            <button onClick={() => setShowForm(true)} style={{
              padding: '13px 28px', borderRadius: 50, background: 'linear-gradient(135deg, #C0152A, #8B0000)',
              color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.95rem',
              boxShadow: '0 6px 20px rgba(192,21,42,0.4)'
            }}>+ Post Request</button>
          ) : (
            <Link to="/login" style={{ padding: '13px 28px', borderRadius: 50, background: 'linear-gradient(135deg, #C0152A, #8B0000)', color: 'white', fontWeight: 700, textDecoration: 'none' }}>Login to Post</Link>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 24px' }}>
        {/* Filters */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px 24px', marginBottom: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} style={{ ...inputCls, flex: '0 1 130px', cursor: 'pointer' }}>
            {['Open', 'Fulfilled', 'Closed'].map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filters.blood_group} onChange={e => setFilters(f => ({ ...f, blood_group: e.target.value }))} style={{ ...inputCls, flex: '0 1 130px', cursor: 'pointer' }}>
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
          </select>
          <select value={filters.urgency} onChange={e => setFilters(f => ({ ...f, urgency: e.target.value }))} style={{ ...inputCls, flex: '0 1 130px', cursor: 'pointer' }}>
            <option value="">All Urgency</option>
            {['Critical', 'Urgent', 'Normal'].map(u => <option key={u}>{u}</option>)}
          </select>
          <input value={filters.city} onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
            placeholder="Filter by city..." style={{ ...inputCls, flex: '1 1 160px' }}
            onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
          {(filters.blood_group || filters.city || filters.urgency) && (
            <button onClick={() => setFilters({ blood_group: '', city: '', urgency: '', status: 'Open' })} style={{ padding: '10px 18px', borderRadius: 50, background: '#F3F4F6', color: '#6B7280', border: 'none', cursor: 'pointer', fontWeight: 600 }}>✕ Clear</button>
          )}
        </div>

        {/* Urgency legend */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          {[{ label: 'Critical – Immediate need', color: '#DC2626', bg: '#FEE2E2' }, { label: 'Urgent – Within 24hrs', color: '#D97706', bg: '#FEF3C7' }, { label: 'Normal – Planned', color: '#059669', bg: '#D1FAE5' }].map(({ label, color, bg }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, background: bg, color, padding: '5px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              {label}
            </div>
          ))}
        </div>

        {loading ? <Spinner center /> : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📋</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#6B7280', marginBottom: 10 }}>No Requests Found</h3>
            <p>No blood requests match your current filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
            {requests.map((req, i) => (
              <div key={req.id} style={{ animation: `fadeIn 0.5s ease ${i * 0.05}s both` }}>
                <RequestCard request={req} showActions={user && req.requester_id === user.id} onStatusChange={handleStatusChange} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Request Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(4px)' }}
          onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div style={{ background: 'white', borderRadius: 24, padding: '36px 32px', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#1F2937' }}>🆘 Post Blood Request</h2>
              <button onClick={() => setShowForm(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 18, color: '#6B7280' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Patient Name *</label>
                  <input required value={form.patient_name} onChange={e => setForm(f => ({ ...f, patient_name: e.target.value }))} placeholder="Patient name" style={inputCls} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Blood Group *</label>
                  <select required value={form.blood_group} onChange={e => setForm(f => ({ ...f, blood_group: e.target.value }))} style={{ ...inputCls, cursor: 'pointer' }}>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Units Required</label>
                  <input type="number" min="1" value={form.units_required} onChange={e => setForm(f => ({ ...f, units_required: e.target.value }))} style={inputCls} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Urgency</label>
                  <select value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))} style={{ ...inputCls, cursor: 'pointer' }}>
                    {['Normal', 'Urgent', 'Critical'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Hospital Name *</label>
                <input required value={form.hospital_name} onChange={e => setForm(f => ({ ...f, hospital_name: e.target.value }))} placeholder="Hospital name" style={inputCls} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>City *</label>
                  <input required value={form.hospital_city} onChange={e => setForm(f => ({ ...f, hospital_city: e.target.value }))} placeholder="City" style={inputCls} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Contact Phone *</label>
                  <input required value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} placeholder="Phone number" style={inputCls} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>State</label>
                  <input value={form.hospital_state} onChange={e => setForm(f => ({ ...f, hospital_state: e.target.value }))} placeholder="State" style={inputCls} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Required By</label>
                  <input type="date" value={form.required_by} onChange={e => setForm(f => ({ ...f, required_by: e.target.value }))} style={inputCls} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Additional Details</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Any important details..." rows={3} style={{ ...inputCls, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <button type="submit" disabled={submitting} style={{ padding: '13px', borderRadius: 50, background: submitting ? 'rgba(192,21,42,0.5)' : 'linear-gradient(135deg, #C0152A, #8B0000)', color: 'white', fontWeight: 700, border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(192,21,42,0.35)', marginTop: 6 }}>
                {submitting ? '⏳ Posting...' : '🆘 Post Blood Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
