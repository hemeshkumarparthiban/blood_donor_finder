import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// ─── Toast ────────────────────────────────────────────────────────────────────
export const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = { success: '#10B981', error: '#C0152A', info: '#1A1A2E', warning: '#D97706' };
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: colors[type] || colors.success, color: 'white',
      padding: '14px 20px 14px 16px', borderRadius: 12,
      boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      display: 'flex', alignItems: 'center', gap: 12, maxWidth: 360,
      animation: 'slideInRight 0.4s ease', fontWeight: 500, fontSize: '0.9rem'
    }}>
      <span style={{ fontSize: 20 }}>
        {type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: 0 }}>×</button>
    </div>
  );
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
export const Spinner = ({ size = 40, center = false }) => (
  <div style={center ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 } : {}}>
    <div style={{
      width: size, height: size,
      border: `3px solid #E5E7EB`, borderTopColor: '#C0152A',
      borderRadius: '50%', animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ─── DonorCard ────────────────────────────────────────────────────────────────
export const DonorCard = ({ donor }) => {
  const daysSinceDonation = donor.last_donation_date
    ? Math.floor((new Date() - new Date(donor.last_donation_date)) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div style={{
      background: 'white', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'all 0.3s ease',
      border: '1px solid #F3F4F6', cursor: 'default'
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(192,21,42,0.15)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
    >
      {/* Card top accent */}
      <div style={{ height: 5, background: 'linear-gradient(90deg, #C0152A, #D4AF37)' }} />

      <div style={{ padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #C0152A, #8B0000)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '1.2rem',
              fontFamily: 'Playfair Display, serif', flexShrink: 0
            }}>
              {donor.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.05rem', color: '#1F2937', marginBottom: 2 }}>
                {donor.full_name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: '0.82rem' }}>
                <span>📍</span>
                <span>{donor.city}{donor.state ? `, ${donor.state}` : ''}</span>
              </div>
            </div>
          </div>
          {/* Blood group badge */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'linear-gradient(135deg, #C0152A, #8B0000)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(192,21,42,0.35)', flexShrink: 0
          }}>
            {donor.blood_group}
          </div>
        </div>

        {/* Info chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {donor.age && (
            <span style={{ background: '#F3F4F6', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', color: '#6B7280' }}>
              Age: {donor.age}
            </span>
          )}
          {donor.gender && (
            <span style={{ background: '#F3F4F6', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', color: '#6B7280' }}>
              {donor.gender}
            </span>
          )}
          {donor.total_donations > 0 && (
            <span style={{ background: '#FFF0F1', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', color: '#C0152A', fontWeight: 600 }}>
              🩸 {donor.total_donations} donation{donor.total_donations > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Last donation */}
        {daysSinceDonation !== null && (
          <div style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '0.82rem', color: '#6B7280' }}>
            Last donated: <strong style={{ color: '#1F2937' }}>{daysSinceDonation}d ago</strong>
            {daysSinceDonation < 90 && <span style={{ color: '#D97706', marginLeft: 8 }}>⚠️ Recent donation</span>}
          </div>
        )}

        {/* Status + Contact */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 9, height: 9, borderRadius: '50%',
              background: donor.is_available ? '#10B981' : '#9CA3AF',
              boxShadow: donor.is_available ? '0 0 6px #10B981' : 'none'
            }} />
            <span style={{ fontSize: '0.85rem', color: donor.is_available ? '#10B981' : '#9CA3AF', fontWeight: 600 }}>
              {donor.is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>
          {donor.phone && (
            <a href={`tel:${donor.phone}`} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: donor.is_available ? 'linear-gradient(135deg, #C0152A, #8B0000)' : '#E5E7EB',
              color: donor.is_available ? 'white' : '#9CA3AF',
              padding: '7px 14px', borderRadius: 30, fontSize: '0.82rem', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.25s',
              pointerEvents: donor.is_available ? 'auto' : 'none'
            }}>
              📞 Contact
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── RequestCard ──────────────────────────────────────────────────────────────
export const RequestCard = ({ request, onStatusChange, showActions = false }) => {
  const urgencyStyle = {
    Critical: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
    Urgent: { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
    Normal: { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
  }[request.urgency] || {};

  const statusStyle = {
    Open: { bg: '#DBEAFE', color: '#1D4ED8' },
    Fulfilled: { bg: '#D1FAE5', color: '#059669' },
    Closed: { bg: '#F3F4F6', color: '#6B7280' },
  }[request.status] || {};

  return (
    <div style={{
      background: 'white', borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6',
      transition: 'all 0.3s'
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
    >
      {/* Urgency stripe */}
      <div style={{ height: 4, background: urgencyStyle.color || '#9CA3AF' }} />

      <div style={{ padding: '22px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, #C0152A, #8B0000)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 800, fontSize: '0.85rem'
              }}>{request.blood_group}</div>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', color: '#1F2937' }}>
                  {request.patient_name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>Req by: {request.requester_name}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span style={{ background: urgencyStyle.bg, color: urgencyStyle.color, border: `1px solid ${urgencyStyle.border}`, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
              {request.urgency}
            </span>
            <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
              {request.status}
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#6B7280', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginBottom: 14 }}>
          <div>🏥 <strong style={{ color: '#374151' }}>{request.hospital_name}</strong></div>
          <div>📍 {request.hospital_city}{request.hospital_state ? `, ${request.hospital_state}` : ''}</div>
          <div>🩸 Units: <strong style={{ color: '#C0152A' }}>{request.units_required}</strong></div>
          {request.required_by && <div>📅 By: {new Date(request.required_by).toLocaleDateString()}</div>}
        </div>

        {request.description && (
          <p style={{ fontSize: '0.85rem', color: '#6B7280', background: '#F9FAFB', padding: '10px 12px', borderRadius: 10, marginBottom: 14, lineHeight: 1.6 }}>
            {request.description.length > 100 ? request.description.slice(0, 100) + '...' : request.description}
          </p>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>
            {new Date(request.created_at).toLocaleDateString()}
          </span>
          <a href={`tel:${request.contact_phone}`} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: request.status === 'Open' ? 'linear-gradient(135deg, #C0152A, #8B0000)' : '#E5E7EB',
            color: request.status === 'Open' ? 'white' : '#9CA3AF',
            padding: '7px 14px', borderRadius: 30, fontSize: '0.82rem', fontWeight: 600,
            textDecoration: 'none', pointerEvents: request.status === 'Open' ? 'auto' : 'none'
          }}>
            📞 {request.contact_phone}
          </a>
        </div>

        {showActions && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 12, borderTop: '1px solid #F3F4F6' }}>
            {request.status === 'Open' && (
              <button onClick={() => onStatusChange(request.id, 'Fulfilled')} style={{
                flex: 1, padding: '8px', borderRadius: 10, background: '#D1FAE5', color: '#059669',
                border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem'
              }}>✅ Mark Fulfilled</button>
            )}
            <button onClick={() => onStatusChange(request.id, 'Closed')} style={{
              flex: 1, padding: '8px', borderRadius: 10, background: '#F3F4F6', color: '#6B7280',
              border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem'
            }}>✕ Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── StatsCard ────────────────────────────────────────────────────────────────
export const StatsCard = ({ icon, label, value, color = '#C0152A', delay = 0 }) => (
  <div style={{
    background: 'white', borderRadius: 20, padding: '28px 24px', textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6',
    animation: `fadeIn 0.6s ease ${delay}s both`, transition: 'all 0.3s'
  }}
  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 30px ${color}25`; }}
  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
  >
    <div style={{ fontSize: 40, marginBottom: 12, lineHeight: 1 }}>{icon}</div>
    <div style={{ fontSize: '2rem', fontWeight: 800, color, fontFamily: 'Playfair Display, serif', lineHeight: 1, marginBottom: 6 }}>
      {value?.toLocaleString()}
    </div>
    <div style={{ fontSize: '0.88rem', color: '#6B7280', fontWeight: 500 }}>{label}</div>
  </div>
);

export default { Toast, Spinner, DonorCard, RequestCard, StatsCard };
