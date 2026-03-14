import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAdminDashboard, getAllUsers, toggleUserStatus, deleteUser,
  getAdminRequests, getAdminCamps, createCamp, deleteCamp,
  getAdminTestimonials, approveTestimonial
} from '../utils/api';
import { Toast, Spinner } from '../components/UIComponents';

// ── Mini bar chart ─────────────────────────────────────────────────────────────
const BarChart = ({ data, maxVal }) => (
  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80, padding: '0 4px' }}>
    {data.map((d, i) => {
      const pct = maxVal ? (d.count / maxVal) * 100 : 0;
      const colors = ['#C0152A','#E63950','#8B0000','#D4465C','#FF6B6B','#B01020','#C84060','#E05070'];
      return (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 600 }}>{d.count}</div>
          <div style={{
            width: '100%', borderRadius: '4px 4px 0 0',
            background: colors[i % colors.length],
            height: `${Math.max(pct, 4)}%`,
            transition: 'height 1s ease',
            boxShadow: `0 0 8px ${colors[i % colors.length]}55`,
          }} />
          <div style={{ fontSize: '0.6rem', color: '#6B7280', fontWeight: 700 }}>{d.blood_group}</div>
        </div>
      );
    })}
  </div>
);

// ── Donut chart (SVG) ──────────────────────────────────────────────────────────
const DonutChart = ({ segments, size = 120 }) => {
  const r = 44, cx = 60, cy = 60, circ = 2 * Math.PI * r;
  const total = segments.reduce((s, d) => s + d.value, 0);
  const colors = ['#C0152A','#E63950','#8B0000','#D4465C','#FF6B6B','#B01020','#C84060','#E05070'];
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth="14" />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={colors[i % colors.length]} strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px', transition: 'stroke-dasharray 1s ease' }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="800">{total}</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#9CA3AF" fontSize="8">Donors</text>
    </svg>
  );
};

// ── Stat card ──────────────────────────────────────────────────────────────────
const StatBox = ({ icon, label, value, color, sub, delay = 0 }) => (
  <div style={{
    background: 'white', borderRadius: 20, padding: '24px 22px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: `1px solid ${color}22`,
    animation: `slideUp 0.6s ease ${delay}s both`, transition: 'all 0.3s',
    borderTop: `4px solid ${color}`,
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${color}22`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)'; }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
      {sub !== undefined && (
        <span style={{ fontSize: '0.75rem', color: sub >= 0 ? '#10B981' : '#EF4444', fontWeight: 700, background: sub >= 0 ? '#ECFDF5' : '#FEF2F2', padding: '3px 8px', borderRadius: 20 }}>
          {sub >= 0 ? '↑' : '↓'} {Math.abs(sub)}
        </span>
      )}
    </div>
    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#111827', fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>{(value ?? 0).toLocaleString()}</div>
    <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: 4, fontWeight: 500 }}>{label}</div>
  </div>
);

// ── Activity row ───────────────────────────────────────────────────────────────
const ActivityItem = ({ icon, title, sub, time, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F9FAFB' }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
      <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{sub}</div>
    </div>
    <div style={{ fontSize: '0.75rem', color: '#D1D5DB', whiteSpace: 'nowrap' }}>{time}</div>
  </div>
);

const tabs = ['Dashboard', 'Users', 'Requests', 'Blood Camps', 'Testimonials'];
const urgencyColor = { Critical: '#C0152A', Urgent: '#E07B00', Normal: '#10B981' };
const statusColor  = { Open: '#1565C0',  Fulfilled: '#10B981', Closed: '#9CA3AF' };

export default function AdminPanel() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [camps, setCamps] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [search, setSearch] = useState('');
  const [showCampForm, setShowCampForm] = useState(false);
  const [campForm, setCampForm] = useState({ organizer_name: '', camp_name: '', location: '', city: '', state: '', camp_date: '', start_time: '', end_time: '', contact_phone: '', description: '' });

  useEffect(() => { if (!isAdmin) navigate('/'); }, [isAdmin, navigate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try { const r = await getAdminDashboard(); setDashData(r.data.dashboard); }
      catch (e) {}
      finally { setLoading(false); }
    })();
  }, []);

  const loadTab = async (t) => {
    setTab(t); setLoading(true);
    try {
      if (t === 'Users')       { const r = await getAllUsers();           setUsers(r.data.users); }
      if (t === 'Requests')    { const r = await getAdminRequests();      setRequests(r.data.requests); }
      if (t === 'Blood Camps') { const r = await getAdminCamps();         setCamps(r.data.camps); }
      if (t === 'Testimonials'){ const r = await getAdminTestimonials();  setTestimonials(r.data.testimonials); }
    } catch (e) {}
    finally { setLoading(false); }
  };

  const handleToggleUser = async (id) => {
    try { await toggleUserStatus(id); const r = await getAllUsers(); setUsers(r.data.users); setToast({ message: 'User status updated', type: 'success' }); }
    catch { setToast({ message: 'Failed', type: 'error' }); }
  };
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try { await deleteUser(id); setUsers(u => u.filter(x => x.id !== id)); setToast({ message: 'User deleted', type: 'success' }); }
    catch { setToast({ message: 'Failed', type: 'error' }); }
  };
  const handleCreateCamp = async e => {
    e.preventDefault();
    try { await createCamp(campForm); setToast({ message: 'Camp created!', type: 'success' }); setShowCampForm(false); const r = await getAdminCamps(); setCamps(r.data.camps); }
    catch { setToast({ message: 'Failed to create camp', type: 'error' }); }
  };
  const handleDeleteCamp = async (id) => {
    if (!window.confirm('Delete this camp?')) return;
    try { await deleteCamp(id); setCamps(c => c.filter(x => x.id !== id)); setToast({ message: 'Deleted', type: 'success' }); }
    catch { setToast({ message: 'Failed', type: 'error' }); }
  };
  const handleApprove = async (id) => {
    try { await approveTestimonial(id); setTestimonials(t => t.map(x => x.id === id ? { ...x, is_approved: true } : x)); setToast({ message: 'Approved!', type: 'success' }); }
    catch { setToast({ message: 'Failed', type: 'error' }); }
  };

  const inp = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif', background: 'white', color: '#1F2937' };
  const filtered = users.filter(u => u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const maxBG = dashData?.bloodGroupStats ? Math.max(...dashData.bloodGroupStats.map(b => b.count), 1) : 1;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9FB', fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 240, background: 'linear-gradient(180deg, #0D0D1A 0%, #1A0A0E 100%)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#C0152A,#8B0000)', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(192,21,42,0.4)' }}>
              <span style={{ transform: 'rotate(45deg)', fontSize: 18 }}>🩸</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.1rem', color: 'white' }}>BloodConnect</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', letterSpacing: 2 }}>ADMIN</div>
            </div>
          </div>
        </div>

        {/* Admin info */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#C0152A,#8B0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>
            {user?.full_name?.charAt(0) || 'A'}
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', fontWeight: 600 }}>{user?.full_name || 'Admin'}</div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>Super Admin</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {[
            { t: 'Dashboard', icon: '📊' },
            { t: 'Users',     icon: '👥' },
            { t: 'Requests',  icon: '🆘' },
            { t: 'Blood Camps', icon: '🏕️' },
            { t: 'Testimonials', icon: '⭐' },
          ].map(({ t, icon }) => (
            <button key={t} onClick={() => t === 'Dashboard' ? loadTab(t) && setTab(t) : loadTab(t)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 12, border: 'none',
              background: tab === t ? 'linear-gradient(135deg,rgba(192,21,42,0.35),rgba(139,0,0,0.2))' : 'transparent',
              color: tab === t ? 'white' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif', fontWeight: tab === t ? 700 : 400,
              marginBottom: 2, borderLeft: tab === t ? '3px solid #C0152A' : '3px solid transparent',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { if (tab !== t) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
              onMouseLeave={e => { if (tab !== t) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
            >
              <span style={{ fontSize: 18 }}>{icon}</span> {t}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            width: '100%', padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
            background: 'transparent', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            fontSize: '0.85rem', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#E63950'; e.currentTarget.style.borderColor = 'rgba(192,21,42,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
          >🚪 Sign Out</button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, overflow: 'auto' }}>

        {/* Top bar */}
        <div style={{ background: 'white', padding: '18px 32px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
          <div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', color: '#111827', margin: 0 }}>{tab}</h1>
            <p style={{ fontSize: '0.8rem', color: '#9CA3AF', margin: 0 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>System Online</span>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
              <Spinner />
            </div>
          ) : (

            /* ══════════════════════════════════════════════════════════════
               DASHBOARD TAB
            ══════════════════════════════════════════════════════════════ */
            tab === 'Dashboard' ? (
              <div>
                {/* Stat boxes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18, marginBottom: 28 }}>
                  <StatBox icon="👥" label="Total Users"      value={dashData?.totalUsers}      color="#1565C0" delay={0}   />
                  <StatBox icon="🩸" label="Active Donors"    value={dashData?.totalDonors}     color="#C0152A" delay={0.1} />
                  <StatBox icon="🆘" label="Open Requests"    value={dashData?.openRequests}    color="#E07B00" delay={0.2} />
                  <StatBox icon="💉" label="Total Donations"  value={dashData?.totalDonations}  color="#10B981" delay={0.3} />
                  <StatBox icon="🏕️" label="Active Camps"     value={dashData?.totalCamps}      color="#7C3AED" delay={0.4} />
                  <StatBox icon="📋" label="Total Requests"   value={dashData?.totalRequests}   color="#0891B2" delay={0.5} />
                </div>

                {/* Charts row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18, marginBottom: 28 }}>

                  {/* Blood group bar chart */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', animation: 'slideUp 0.6s ease 0.3s both', gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <div>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', color: '#111827', margin: 0 }}>Donors by Blood Group</h3>
                        <p style={{ fontSize: '0.78rem', color: '#9CA3AF', margin: '2px 0 0' }}>Distribution across all registered donors</p>
                      </div>
                      <div style={{ background: '#FEF2F2', color: '#C0152A', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
                        {dashData?.bloodGroupStats?.reduce((s, b) => s + b.count, 0) || 0} total
                      </div>
                    </div>
                    {dashData?.bloodGroupStats?.length ? (
                      <BarChart data={dashData.bloodGroupStats} maxVal={maxBG} />
                    ) : (
                      <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: '0.85rem' }}>No data yet</div>
                    )}
                  </div>

                  {/* Donut */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', animation: 'slideUp 0.6s ease 0.35s both', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#111827', margin: '0 0 16px', alignSelf: 'flex-start' }}>Blood Mix</h3>
                    {dashData?.bloodGroupStats?.length ? (
                      <>
                        <DonutChart segments={dashData.bloodGroupStats.map(b => ({ value: b.count, label: b.blood_group }))} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12, justifyContent: 'center' }}>
                          {dashData.bloodGroupStats.slice(0, 4).map((b, i) => {
                            const clrs = ['#C0152A','#E63950','#8B0000','#D4465C'];
                            return (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: clrs[i % 4] }} />
                                <span style={{ fontSize: '0.7rem', color: '#6B7280' }}>{b.blood_group}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>No data</div>
                    )}
                  </div>
                </div>

                {/* Availability progress bars */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }}>

                  {/* Donor availability */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', animation: 'slideUp 0.6s ease 0.4s both' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#111827', marginBottom: 18 }}>Donor Availability</h3>
                    {[
                      { label: 'Available Now',     value: dashData?.availableDonors || 0,                                         total: dashData?.totalDonors || 1, color: '#10B981' },
                      { label: 'Registered Donors', value: dashData?.totalDonors || 0,                                             total: dashData?.totalUsers || 1,  color: '#C0152A' },
                      { label: 'Requests Fulfilled',value: (dashData?.totalRequests || 0) - (dashData?.openRequests || 0),         total: dashData?.totalRequests || 1, color: '#1565C0' },
                    ].map((row, i) => {
                      const pct = Math.round((row.value / row.total) * 100) || 0;
                      return (
                        <div key={i} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <span style={{ fontSize: '0.82rem', color: '#374151', fontWeight: 500 }}>{row.label}</span>
                            <span style={{ fontSize: '0.82rem', color: row.color, fontWeight: 700 }}>{row.value} <span style={{ color: '#9CA3AF', fontWeight: 400 }}>({pct}%)</span></span>
                          </div>
                          <div style={{ height: 8, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: row.color, borderRadius: 4, transition: 'width 1.2s ease', boxShadow: `0 0 6px ${row.color}55` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Urgency breakdown */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', animation: 'slideUp 0.6s ease 0.45s both' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#111827', marginBottom: 18 }}>Request Overview</h3>
                    {[
                      { label: 'Open Requests',  value: dashData?.openRequests || 0,  color: '#1565C0', bg: '#EFF6FF', icon: '📬' },
                      { label: 'Total Requests', value: dashData?.totalRequests || 0, color: '#C0152A', bg: '#FEF2F2', icon: '📋' },
                      { label: 'Donations Made', value: dashData?.totalDonations || 0,color: '#10B981', bg: '#ECFDF5', icon: '💉' },
                      { label: 'Active Camps',   value: dashData?.totalCamps || 0,    color: '#7C3AED', bg: '#F5F3FF', icon: '🏕️' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 3 ? '1px solid #F9FAFB' : 'none' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{item.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>{item.label}</div>
                        </div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: item.color, fontFamily: 'Playfair Display, serif' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent activity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

                  {/* Recent requests */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', animation: 'slideUp 0.6s ease 0.5s both' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#111827', marginBottom: 16 }}>Recent Blood Requests</h3>
                    {dashData?.recentRequests?.length ? dashData.recentRequests.map((r, i) => (
                      <ActivityItem key={i}
                        icon="🆘"
                        title={`${r.blood_group} • ${r.hospital_city}`}
                        sub={`${r.requester_name} — ${r.patient_name}`}
                        time={new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        color={urgencyColor[r.urgency] || '#C0152A'}
                      />
                    )) : <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>No recent requests</p>}
                  </div>

                  {/* Recent users */}
                  <div style={{ background: 'white', borderRadius: 20, padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', animation: 'slideUp 0.6s ease 0.55s both' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#111827', marginBottom: 16 }}>Recent Registrations</h3>
                    {dashData?.recentUsers?.length ? dashData.recentUsers.map((u, i) => (
                      <ActivityItem key={i}
                        icon={u.is_donor ? '💉' : '👤'}
                        title={u.full_name}
                        sub={`${u.blood_group} • ${u.city || 'Unknown'} ${u.is_donor ? '· Donor' : ''}`}
                        time={new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        color="#1565C0"
                      />
                    )) : <p style={{ color: '#9CA3AF', fontSize: '0.85rem' }}>No recent users</p>}
                  </div>
                </div>
              </div>

            /* ══════════════════════════════════════════════════════════════
               USERS TAB
            ══════════════════════════════════════════════════════════════ */
            ) : tab === 'Users' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <p style={{ color: '#6B7280', fontSize: '0.88rem' }}>{filtered.length} users found</p>
                  <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
                    style={{ ...inp, width: 280 }}
                    onFocus={e => e.target.style.borderColor = '#C0152A'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>
                <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 2px 16px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
                    <thead>
                      <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                        {['Name', 'Email', 'Blood', 'City', 'Role', 'Donor', 'Status', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#6B7280', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((u, i) => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #F9FAFB', animation: `slideUp 0.4s ease ${i * 0.04}s both` }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#111827' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#C0152A,#8B0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{u.full_name?.charAt(0)}</div>
                              <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#6B7280', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ background: '#FEF2F2', color: '#C0152A', padding: '3px 10px', borderRadius: 20, fontWeight: 700, fontSize: '0.78rem' }}>{u.blood_group}</span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#6B7280' }}>{u.city || '—'}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ background: u.role === 'admin' ? '#FEF9EF' : '#F0F9FF', color: u.role === 'admin' ? '#D4AF37' : '#1565C0', padding: '2px 8px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{u.role}</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ color: u.is_donor ? '#10B981' : '#9CA3AF', fontWeight: 600, fontSize: '0.82rem' }}>{u.is_donor ? '✓ Yes' : '✗ No'}</span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ background: u.is_active ? '#ECFDF5' : '#FEF2F2', color: u.is_active ? '#10B981' : '#EF4444', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                              {u.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button onClick={() => handleToggleUser(u.id)} style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', fontSize: '0.78rem', color: '#374151' }}>
                                {u.is_active ? '🔒' : '🔓'}
                              </button>
                              {u.role !== 'admin' && (
                                <button onClick={() => handleDeleteUser(u.id)} style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid #FEE2E2', background: '#FEF2F2', cursor: 'pointer', fontSize: '0.78rem', color: '#EF4444' }}>🗑</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!filtered.length && <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>No users found</div>}
                </div>
              </div>

            /* ══════════════════════════════════════════════════════════════
               REQUESTS TAB
            ══════════════════════════════════════════════════════════════ */
            ) : tab === 'Requests' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 18 }}>
                {requests.map((r, i) => (
                  <div key={r.id} style={{ background: 'white', borderRadius: 18, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', borderLeft: `4px solid ${urgencyColor[r.urgency] || '#9CA3AF'}`, animation: `slideUp 0.4s ease ${i * 0.05}s both` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ background: '#FEF2F2', color: '#C0152A', padding: '3px 12px', borderRadius: 20, fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '0.95rem' }}>{r.blood_group}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span style={{ background: `${urgencyColor[r.urgency]}15`, color: urgencyColor[r.urgency], padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{r.urgency}</span>
                        <span style={{ background: `${statusColor[r.status]}15`, color: statusColor[r.status], padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{r.status}</span>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4 }}>{r.patient_name}</div>
                    <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 2 }}>🏥 {r.hospital_name}, {r.hospital_city}</div>
                    <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 2 }}>👤 {r.requester_name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#9CA3AF', marginTop: 10 }}>{new Date(r.created_at).toLocaleDateString('en-IN')}</div>
                  </div>
                ))}
                {!requests.length && <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9CA3AF', padding: 60 }}>No requests found</div>}
              </div>

            /* ══════════════════════════════════════════════════════════════
               BLOOD CAMPS TAB
            ══════════════════════════════════════════════════════════════ */
            ) : tab === 'Blood Camps' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                  <button onClick={() => setShowCampForm(!showCampForm)} style={{ padding: '10px 22px', borderRadius: 50, background: 'linear-gradient(135deg,#C0152A,#8B0000)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 14px rgba(192,21,42,0.3)' }}>
                    {showCampForm ? '✕ Cancel' : '+ Create Camp'}
                  </button>
                </div>
                {showCampForm && (
                  <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', marginBottom: 24, animation: 'slideUp 0.3s ease' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20 }}>New Blood Camp</h3>
                    <form onSubmit={handleCreateCamp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      {[['organizer_name','Organizer *'],['camp_name','Camp Name *'],['location','Location *'],['city','City *'],['state','State'],['contact_phone','Phone']].map(([key, label]) => (
                        <div key={key}>
                          <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.82rem', marginBottom: 5 }}>{label}</label>
                          <input required={label.endsWith('*')} value={campForm[key]} onChange={e => setCampForm(f => ({ ...f, [key]: e.target.value }))} style={inp}
                            onFocus={e => e.target.style.borderColor = '#C0152A'}
                            onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                        </div>
                      ))}
                      {[['camp_date','Date *','date',true],['start_time','Start','time',false],['end_time','End','time',false]].map(([key,label,type,req]) => (
                        <div key={key}>
                          <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.82rem', marginBottom: 5 }}>{label}</label>
                          <input type={type} required={req} value={campForm[key]} onChange={e => setCampForm(f => ({ ...f, [key]: e.target.value }))} style={inp}
                            onFocus={e => e.target.style.borderColor = '#C0152A'}
                            onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                        </div>
                      ))}
                      <div style={{ gridColumn: '1/-1' }}>
                        <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.82rem', marginBottom: 5 }}>Description</label>
                        <textarea value={campForm.description} onChange={e => setCampForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inp, resize: 'vertical' }}
                          onFocus={e => e.target.style.borderColor = '#C0152A'}
                          onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                      </div>
                      <div style={{ gridColumn: '1/-1' }}>
                        <button type="submit" style={{ padding: '12px 32px', borderRadius: 50, background: 'linear-gradient(135deg,#C0152A,#8B0000)', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(192,21,42,0.3)' }}>🏕️ Create Camp</button>
                      </div>
                    </form>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
                  {camps.map((c, i) => (
                    <div key={c.id} style={{ background: 'white', borderRadius: 18, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', animation: `slideUp 0.4s ease ${i * 0.05}s both` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <div style={{ fontWeight: 700, color: '#111827', flex: 1, paddingRight: 8 }}>{c.camp_name}</div>
                        <button onClick={() => handleDeleteCamp(c.id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: 8, padding: '4px 8px', color: '#EF4444', cursor: 'pointer', fontSize: 13 }}>🗑</button>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 4 }}>👤 {c.organizer_name}</div>
                      <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 4 }}>📍 {c.location}, {c.city}</div>
                      <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 4 }}>📅 {new Date(c.camp_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      {c.start_time && <div style={{ fontSize: '0.82rem', color: '#6B7280' }}>🕐 {c.start_time} – {c.end_time}</div>}
                    </div>
                  ))}
                  {!camps.length && <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9CA3AF', padding: 60 }}>No camps found</div>}
                </div>
              </div>

            /* ══════════════════════════════════════════════════════════════
               TESTIMONIALS TAB
            ══════════════════════════════════════════════════════════════ */
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
                {testimonials.map((t, i) => (
                  <div key={t.id} style={{ background: 'white', borderRadius: 18, padding: 22, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', animation: `slideUp 0.4s ease ${i * 0.05}s both`, borderTop: `3px solid ${t.is_approved ? '#10B981' : '#E5E7EB'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, color: '#111827' }}>{t.author_name}</span>
                      <span style={{ color: '#F59E0B', fontSize: '0.9rem' }}>{'★'.repeat(t.rating || 5)}</span>
                    </div>
                    <p style={{ color: '#6B7280', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 14 }}>{t.message}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ background: t.is_approved ? '#ECFDF5' : '#FEF9EF', color: t.is_approved ? '#10B981' : '#D97706', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                        {t.is_approved ? '✓ Approved' : '⏳ Pending'}
                      </span>
                      {!t.is_approved && (
                        <button onClick={() => handleApprove(t.id)} style={{ padding: '5px 14px', borderRadius: 20, background: 'linear-gradient(135deg,#10B981,#059669)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Approve</button>
                      )}
                    </div>
                  </div>
                ))}
                {!testimonials.length && <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9CA3AF', padding: 60 }}>No testimonials</div>}
              </div>
            )
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
