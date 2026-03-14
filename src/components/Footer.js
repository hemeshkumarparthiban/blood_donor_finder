import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: '#1A1A2E', color: '#9CA3AF', paddingTop: 60 }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, paddingBottom: 48 }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #C0152A, #8B0000)', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ transform: 'rotate(45deg)', fontSize: 16 }}>🩸</span>
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.25rem', color: 'white' }}>BloodConnect</span>
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, marginBottom: 20 }}>
            Connecting blood donors with those in need. Every drop of blood is a gift of life.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {['📘', '🐦', '📸', '▶️'].map((icon, i) => (
              <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16, transition: 'all 0.25s' }}
              onMouseEnter={e => e.target.parentNode.style.background='rgba(192,21,42,0.3)'}
              onMouseLeave={e => e.target.parentNode.style.background='rgba(255,255,255,0.08)'}
              >{icon}</div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20 }}>Quick Links</h4>
          {[
            { to: '/', label: 'Home' },
            { to: '/donors', label: 'Find Donors' },
            { to: '/requests', label: 'Blood Requests' },
            { to: '/camps', label: 'Blood Camps' },
            { to: '/register', label: 'Become a Donor' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{ display: 'block', color: '#9CA3AF', marginBottom: 10, fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.25s' }}
            onMouseEnter={e => e.target.style.color='#C0152A'}
            onMouseLeave={e => e.target.style.color='#9CA3AF'}
            >→ {label}</Link>
          ))}
        </div>

        {/* Blood Groups */}
        <div>
          <h4 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20 }}>Blood Groups</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <div key={bg} style={{ background: 'rgba(192,21,42,0.15)', border: '1px solid rgba(192,21,42,0.3)', borderRadius: 8, padding: '6px', textAlign: 'center', color: '#F87171', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.target.style.background='rgba(192,21,42,0.35)'; e.target.style.color='white'; }}
              onMouseLeave={e => { e.target.style.background='rgba(192,21,42,0.15)'; e.target.style.color='#F87171'; }}
              >{bg}</div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20 }}>Contact Us</h4>
          {[
            { icon: '📍', text: 'Chennai, Tamil Nadu, India' },
            { icon: '📞', text: '+91 1800-XXX-XXXX' },
            { icon: '✉️', text: 'help@bloodconnect.in' },
            { icon: '🕐', text: '24/7 Emergency Support' },
          ].map(({ icon, text }, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: '0.85rem' }}>© 2025 BloodConnect. Made with ❤️ to save lives.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy Policy', 'Terms of Use', 'Cookie Policy'].map(label => (
            <span key={label} style={{ fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color='#C0152A'}
            onMouseLeave={e => e.target.style.color='#9CA3AF'}
            >{label}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
