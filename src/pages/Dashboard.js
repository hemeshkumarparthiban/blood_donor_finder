import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe, getMyRequests, getMyDonations, updateProfile, recordDonation } from '../utils/api';
import { Toast, Spinner } from '../components/UIComponents';

const tabs = ['Overview', 'My Requests', 'My Donations', 'Edit Profile'];

export default function Dashboard() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState('Overview');
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [donationForm, setDonationForm] = useState({ donation_date: '', blood_group: '', hospital_name: '', city: '', units_donated: 1, notes: '' });
  const [showDonationForm, setShowDonationForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profRes, reqRes, donRes] = await Promise.all([getMe(), getMyRequests(), getMyDonations()]);
        setProfile(profRes.data.user);
        setEditForm(profRes.data.user);
        setRequests(reqRes.data.requests);
        setDonations(donRes.data.donations);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const saveProfile = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(editForm);
      setProfile(editForm);
      setUser(prev => ({ ...prev, ...editForm }));
      setToast({ message: 'Profile updated successfully! ✅', type: 'success' });
    } catch (err) { setToast({ message: 'Failed to update profile', type: 'error' }); }
    finally { setSaving(false); }
  };

  const submitDonation = async e => {
    e.preventDefault();
    try {
      await recordDonation({ ...donationForm, blood_group: donationForm.blood_group || profile.blood_group });
      setToast({ message: 'Donation recorded! Thank you 🩸', type: 'success' });
      setShowDonationForm(false);
      const donRes = await getMyDonations();
      setDonations(donRes.data.donations);
    } catch (err) { setToast({ message: 'Failed to record donation', type: 'error' }); }
  };

  if (loading) return <div style={{ paddingTop: 90 }}><Spinner center /></div>;

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', color: '#1F2937', background: 'white', transition: 'border-color 0.25s' };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: '#FAF9F7' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1A0A0E, #2C0A14)', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'linear-gradient(135deg, #C0152A, #8B0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '1.8rem', fontFamily: 'Playfair Display, serif', flexShrink: 0, boxShadow: '0 6px 20px rgba(192,21,42,0.4)' }}>
            {profile?.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '1.8rem', marginBottom: 4 }}>{profile?.full_name}</h1>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(192,21,42,0.3)', color: '#F87171', padding: '3px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 700 }}>🩸 {profile?.blood_group}</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '3px 12px', borderRadius: 20, fontSize: '0.82rem' }}>📍 {profile?.city}</span>
              {profile?.is_donor && <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34D399', padding: '3px 12px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 600 }}>✅ Donor</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #F3F4F6', position: 'sticky', top: 70, zIndex: 100 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: tab === t ? 700 : 500, fontSize: '0.9rem', whiteSpace: 'nowrap',
              color: tab === t ? '#C0152A' : '#6B7280',
              borderBottom: `3px solid ${tab === t ? '#C0152A' : 'transparent'}`,
              transition: 'all 0.2s', fontFamily: 'DM Sans, sans-serif'
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'Overview' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18, marginBottom: 36 }}>
              {[
                { icon: '📋', label: 'My Requests', value: requests.length, color: '#3B82F6' },
                { icon: '💉', label: 'Donations Made', value: donations.length, color: '#10B981' },
                { icon: '🏥', label: 'Active Requests', value: requests.filter(r => r.status === 'Open').length, color: '#EF4444' },
                { icon: '✅', label: 'Fulfilled', value: requests.filter(r => r.status === 'Fulfilled').length, color: '#8B5CF6' },
              ].map(({ icon, label, value, color }) => (
                <div key={label} style={{ background: 'white', borderRadius: 16, padding: '24px 20px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color, fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>{value}</div>
                  <div style={{ color: '#6B7280', fontSize: '0.82rem', marginTop: 6 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Profile card */}
            <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', color: '#1F2937', marginBottom: 20 }}>Profile Summary</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                {[
                  { label: 'Email', value: profile?.email },
                  { label: 'Phone', value: profile?.phone || 'Not set' },
                  { label: 'Blood Group', value: profile?.blood_group },
                  { label: 'City', value: profile?.city || 'Not set' },
                  { label: 'Age', value: profile?.age || 'Not set' },
                  { label: 'Gender', value: profile?.gender || 'Not set' },
                  { label: 'Donor Status', value: profile?.is_donor ? 'Registered Donor' : 'Not a donor' },
                  { label: 'Availability', value: profile?.is_available ? 'Available' : 'Not available' },
                  { label: 'Last Donation', value: profile?.last_donation_date ? new Date(profile.last_donation_date).toLocaleDateString() : 'Never' },
                  { label: 'Member Since', value: new Date(profile?.created_at).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#F9FAFB', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ color: '#9CA3AF', fontSize: '0.78rem', fontWeight: 500, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                    <div style={{ color: '#1F2937', fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/requests" style={{ padding: '11px 24px', borderRadius: 50, background: 'linear-gradient(135deg, #C0152A, #8B0000)', color: 'white', fontWeight: 600, textDecoration: 'none' }}>🆘 Post Blood Request</Link>
              {profile?.is_donor && (
                <button onClick={() => setShowDonationForm(true)} style={{ padding: '11px 24px', borderRadius: 50, background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>💉 Record Donation</button>
              )}
              <button onClick={() => setTab('Edit Profile')} style={{ padding: '11px 24px', borderRadius: 50, background: '#F3F4F6', color: '#4B5563', fontWeight: 600, border: 'none', cursor: 'pointer' }}>✏️ Edit Profile</button>
            </div>
          </div>
        )}

        {/* ── MY REQUESTS ── */}
        {tab === 'My Requests' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1F2937' }}>My Blood Requests ({requests.length})</h2>
              <Link to="/requests" style={{ padding: '10px 22px', borderRadius: 50, background: 'linear-gradient(135deg, #C0152A, #8B0000)', color: 'white', fontWeight: 600, textDecoration: 'none', fontSize: '0.88rem' }}>+ Post New</Link>
            </div>
            {requests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#6B7280', marginBottom: 8 }}>No Requests Yet</h3>
                <p>You haven't posted any blood requests.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {requests.map(req => {
                  const urgencyColor = { Critical: '#DC2626', Urgent: '#D97706', Normal: '#059669' }[req.urgency];
                  const statusBg = { Open: '#DBEAFE', Fulfilled: '#D1FAE5', Closed: '#F3F4F6' }[req.status];
                  const statusColor = { Open: '#1D4ED8', Fulfilled: '#059669', Closed: '#6B7280' }[req.status];
                  return (
                    <div key={req.id} style={{ background: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #C0152A, #8B0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.82rem' }}>{req.blood_group}</div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <span style={{ color: urgencyColor, background: `${urgencyColor}18`, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{req.urgency}</span>
                          <span style={{ color: statusColor, background: statusBg, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>{req.status}</span>
                        </div>
                      </div>
                      <h4 style={{ fontFamily: 'Playfair Display, serif', color: '#1F2937', marginBottom: 6 }}>{req.patient_name}</h4>
                      <p style={{ fontSize: '0.83rem', color: '#6B7280', marginBottom: 8 }}>🏥 {req.hospital_name}, {req.hospital_city}</p>
                      <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>🗓 {new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MY DONATIONS ── */}
        {tab === 'My Donations' && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1F2937' }}>Donation History ({donations.length})</h2>
              {profile?.is_donor && (
                <button onClick={() => setShowDonationForm(true)} style={{ padding: '10px 22px', borderRadius: 50, background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.88rem' }}>+ Record Donation</button>
              )}
            </div>
            {donations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>💉</div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#6B7280', marginBottom: 8 }}>No Donations Yet</h3>
                <p>{profile?.is_donor ? 'Record your first donation above.' : 'Register as a donor in Edit Profile to start donating.'}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
                {donations.map(d => (
                  <div key={d.id} style={{ background: 'white', borderRadius: 16, padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6', borderLeft: '4px solid #10B981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ background: 'linear-gradient(135deg, #C0152A, #8B0000)', color: 'white', width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>{d.blood_group}</span>
                      <span style={{ color: '#10B981', background: '#D1FAE5', padding: '3px 10px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 600 }}>✅ Donated</span>
                    </div>
                    <p style={{ fontWeight: 600, color: '#1F2937', marginBottom: 4 }}>🏥 {d.hospital_name || 'N/A'}</p>
                    <p style={{ fontSize: '0.83rem', color: '#6B7280', marginBottom: 4 }}>📍 {d.city || 'N/A'}</p>
                    <p style={{ fontSize: '0.83rem', color: '#6B7280', marginBottom: 4 }}>🩸 {d.units_donated} unit(s)</p>
                    <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>📅 {new Date(d.donation_date).toLocaleDateString()}</p>
                    {d.notes && <p style={{ fontSize: '0.8rem', color: '#9CA3AF', marginTop: 6, fontStyle: 'italic' }}>{d.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── EDIT PROFILE ── */}
        {tab === 'Edit Profile' && (
          <div style={{ animation: 'fadeIn 0.4s ease', maxWidth: 680 }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#1F2937', marginBottom: 28 }}>Edit Profile</h2>
            <form onSubmit={saveProfile} style={{ background: 'white', borderRadius: 20, padding: '32px 28px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                {[
                  { key: 'full_name', label: 'Full Name', type: 'text' },
                  { key: 'phone', label: 'Phone', type: 'tel' },
                  { key: 'city', label: 'City', type: 'text' },
                  { key: 'state', label: 'State', type: 'text' },
                  { key: 'age', label: 'Age', type: 'number' },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>{label}</label>
                    <input type={type} value={editForm[key] || ''} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                      style={inputStyle} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Gender</label>
                  <select value={editForm.gender || ''} onChange={e => setEditForm(f => ({ ...f, gender: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select</option>
                    {['Male', 'Female', 'Other'].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F9FAFB', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setEditForm(f => ({ ...f, is_donor: !f.is_donor }))}>
                  <div style={{ width: 44, height: 24, borderRadius: 12, background: editForm.is_donor ? '#C0152A' : '#E5E7EB', position: 'relative', transition: 'all 0.3s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 2, left: editForm.is_donor ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'all 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                  <span style={{ fontWeight: 500, color: '#4B5563', fontSize: '0.88rem' }}>🩸 Register as Donor</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F9FAFB', borderRadius: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => setEditForm(f => ({ ...f, is_available: !f.is_available }))}>
                  <div style={{ width: 44, height: 24, borderRadius: 12, background: editForm.is_available ? '#10B981' : '#E5E7EB', position: 'relative', transition: 'all 0.3s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 2, left: editForm.is_available ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'all 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                  <span style={{ fontWeight: 500, color: '#4B5563', fontSize: '0.88rem' }}>✅ Available to Donate</span>
                </div>
              </div>
              <div style={{ marginTop: 18 }}>
                <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Last Donation Date</label>
                <input type="date" value={editForm.last_donation_date ? editForm.last_donation_date.split('T')[0] : ''} onChange={e => setEditForm(f => ({ ...f, last_donation_date: e.target.value }))} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <button type="submit" disabled={saving} style={{ marginTop: 24, padding: '13px 36px', borderRadius: 50, background: saving ? 'rgba(192,21,42,0.5)' : 'linear-gradient(135deg, #C0152A, #8B0000)', color: 'white', fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(192,21,42,0.35)', fontSize: '0.95rem' }}>
                {saving ? '⏳ Saving...' : '✅ Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Record Donation Modal */}
      {showDonationForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 24, padding: '32px 28px', width: '100%', maxWidth: 480, animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: '#1F2937' }}>💉 Record Donation</h3>
              <button onClick={() => setShowDonationForm(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, color: '#6B7280' }}>×</button>
            </div>
            <form onSubmit={submitDonation} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Donation Date *</label>
                <input type="date" required value={donationForm.donation_date} onChange={e => setDonationForm(f => ({ ...f, donation_date: e.target.value }))} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Hospital Name</label>
                  <input value={donationForm.hospital_name} onChange={e => setDonationForm(f => ({ ...f, hospital_name: e.target.value }))} placeholder="Hospital" style={inputStyle} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>City</label>
                  <input value={donationForm.city} onChange={e => setDonationForm(f => ({ ...f, city: e.target.value }))} placeholder="City" style={inputStyle} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 6 }}>Notes</label>
                <textarea value={donationForm.notes} onChange={e => setDonationForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Any additional notes..." style={{ ...inputStyle, resize: 'vertical' }} onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
              </div>
              <button type="submit" style={{ padding: '12px', borderRadius: 50, background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.35)' }}>
                💉 Record Donation
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
