import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
      transition: 'all 0.4s ease',
      borderBottom: scrolled ? '1px solid rgba(229,231,235,0.5)' : 'none',
      padding: '0 24px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #C0152A, #8B0000)',
            borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(192,21,42,0.35)',
            animation: 'heartbeat 2s ease-in-out infinite'
          }}>
            <span style={{ transform: 'rotate(45deg)', color: 'white', fontSize: 18 }}>🩸</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.25rem', color: '#C0152A', lineHeight: 1 }}>BloodConnect</div>
            <div style={{ fontSize: '0.65rem', color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase' }}>Save Lives</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, '@media(max-width:768px)': { display: 'none' } }} className="nav-links">
          {[
            { path: '/home', label: 'Home' },
            { path: '/donors', label: 'Find Donors' },
            { path: '/requests', label: 'Blood Requests' },
            { path: '/camps', label: 'Blood Camps' },
            { path: '/about', label: 'About' },
          ].map(({ path, label }) => (
            <Link key={path} to={path} style={{
              padding: '8px 16px', borderRadius: 30, fontWeight: 500, fontSize: '0.9rem',
              color: isActive(path) ? '#C0152A' : '#4B5563',
              background: isActive(path) ? 'rgba(192,21,42,0.08)' : 'transparent',
              transition: 'all 0.25s', textDecoration: 'none',
            }}
            onMouseEnter={e => { if (!isActive(path)) { e.target.style.color = '#C0152A'; e.target.style.background = 'rgba(192,21,42,0.05)'; } }}
            onMouseLeave={e => { if (!isActive(path)) { e.target.style.color = '#4B5563'; e.target.style.background = 'transparent'; } }}
            >{label}</Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {isAdmin && (
                <Link to="/admin" style={{
                  padding: '8px 16px', borderRadius: 30, fontWeight: 600, fontSize: '0.85rem',
                  background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#1A1A2E',
                  textDecoration: 'none', transition: 'all 0.25s'
                }}>Admin Panel</Link>
              )}
              <Link to="/dashboard" style={{
                padding: '8px 16px', borderRadius: 30, fontWeight: 500, fontSize: '0.9rem',
                color: '#4B5563', textDecoration: 'none', border: '1px solid #E5E7EB',
                display: 'flex', alignItems: 'center', gap: 6, background: 'white'
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #C0152A, #8B0000)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name?.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} style={{
                padding: '8px 16px', borderRadius: 30, fontWeight: 500, fontSize: '0.9rem',
                background: 'transparent', color: '#9CA3AF', border: '1px solid #E5E7EB', cursor: 'pointer',
                transition: 'all 0.25s'
              }}
              onMouseEnter={e => { e.target.style.color = '#C0152A'; e.target.style.borderColor = '#C0152A'; }}
              onMouseLeave={e => { e.target.style.color = '#9CA3AF'; e.target.style.borderColor = '#E5E7EB'; }}
              >Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '9px 20px', borderRadius: 30, fontWeight: 500, fontSize: '0.9rem',
                color: '#C0152A', border: '2px solid #C0152A', textDecoration: 'none', transition: 'all 0.25s'
              }}>Login</Link>
              <Link to="/register" style={{
                padding: '9px 20px', borderRadius: 30, fontWeight: 600, fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #C0152A, #8B0000)', color: 'white', textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(192,21,42,0.35)', transition: 'all 0.25s'
              }}>Register</Link>
            </>
          )}

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            display: 'none', flexDirection: 'column', gap: 5, background: 'none', border: 'none', cursor: 'pointer', padding: 6
          }} className="hamburger">
            {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 2, background: '#4B5563', borderRadius: 2, transition: 'all 0.3s' }} />)}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'white', padding: '20px 24px', borderTop: '1px solid #F3F4F6',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)', animation: 'fadeIn 0.3s ease'
        }}>
          {[
            { path: '/home', label: 'Home' },
            { path: '/donors', label: 'Find Donors' },
            { path: '/requests', label: 'Blood Requests' },
            { path: '/camps', label: 'Blood Camps' },
            { path: '/about', label: 'About' },
            ...(user ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
            ...(isAdmin ? [{ path: '/admin', label: 'Admin Panel' }] : []),
          ].map(({ path, label }) => (
            <Link key={path} to={path} style={{
              display: 'block', padding: '12px 0', color: isActive(path) ? '#C0152A' : '#4B5563',
              fontWeight: isActive(path) ? 600 : 400, borderBottom: '1px solid #F3F4F6', textDecoration: 'none'
            }}>{label}</Link>
          ))}
          {user ? (
            <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 0', color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Logout</button>
          ) : (
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <Link to="/login" style={{ flex: 1, textAlign: 'center', padding: '10px', border: '2px solid #C0152A', borderRadius: 30, color: '#C0152A', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
              <Link to="/register" style={{ flex: 1, textAlign: 'center', padding: '10px', background: '#C0152A', borderRadius: 30, color: 'white', textDecoration: 'none', fontWeight: 600 }}>Register</Link>
            </div>
          )}
        </div>
      )}
      <style>{`
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
