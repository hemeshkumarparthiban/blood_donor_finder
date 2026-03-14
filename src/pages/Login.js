import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/UIComponents';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      setToast({ message: `Welcome back, ${data.user.full_name}! 🎉`, type: 'success' });
      setTimeout(() => navigate(data.user.role === 'admin' ? '/admin' : '/dashboard'), 800);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Login failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D0D1A 0%, #1A0A0E 50%, #2C0A14 100%)',
      padding: '24px', paddingTop: '80px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background blobs */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: [400, 300, 350][i], height: [400, 300, 350][i],
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(192,21,42,${[0.1, 0.06, 0.08][i]}) 0%, transparent 70%)`,
          top: [`-10%`, `60%`, `20%`][i], left: [`-5%`, `70%`, `60%`][i],
          pointerEvents: 'none', animation: `float ${[5, 6, 4][i]}s ease-in-out infinite`
        }} />
      ))}

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 2 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #C0152A, #8B0000)', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(192,21,42,0.4)' }}>
              <span style={{ transform: 'rotate(45deg)', fontSize: 22 }}>🩸</span>
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.6rem', color: 'white' }}>BloodConnect</span>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 8, fontSize: '0.9rem' }}>Welcome back! Sign in to continue</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '40px 36px',
          animation: 'fadeIn 0.6s ease'
        }}>
          

          <form onSubmit={submit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handle} required
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '13px 16px', borderRadius: 12, boxSizing: 'border-box',
                  background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)',
                  color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.25s'
                }}
                onFocus={e => e.target.style.borderColor = '#C0152A'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', fontWeight: 500, display: 'block', marginBottom: 8 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handle} required
                  placeholder="Enter your password"
                  style={{
                    width: '100%', padding: '13px 44px 13px 16px', borderRadius: 12, boxSizing: 'border-box',
                    background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)',
                    color: 'white', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.25s'
                  }}
                  onFocus={e => e.target.style.borderColor = '#C0152A'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16
                }}>{showPass ? '🙈' : '👁️'}</button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 50,
              background: loading ? 'rgba(192,21,42,0.5)' : 'linear-gradient(135deg, #C0152A, #8B0000)',
              color: 'white', fontWeight: 700, fontSize: '1rem', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(192,21,42,0.4)', transition: 'all 0.3s'
            }}>
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginTop: 24 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#F87171', fontWeight: 600, textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
