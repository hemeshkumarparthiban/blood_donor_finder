import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/UIComponents';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm_password: '',
    phone: '', blood_group: '', city: '', state: '', age: '', gender: '', is_donor: false, address: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const nextStep = e => {
    e.preventDefault();
    if (step === 1) {
      if (!form.full_name || !form.email || !form.password || !form.confirm_password) {
        return setToast({ message: 'Please fill all required fields', type: 'error' });
      }
      if (form.password !== form.confirm_password) {
        return setToast({ message: 'Passwords do not match', type: 'error' });
      }
      if (form.password.length < 6) {
        return setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      }
    }
    setStep(s => s + 1);
  };

  const submit = async e => {
    e.preventDefault();
    if (!form.blood_group) return setToast({ message: 'Please select your blood group', type: 'error' });
    setLoading(true);
    try {
      await register(form);
      setToast({ message: 'Registration successful! Welcome to BloodConnect 🎉', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Registration failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 12, boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)',
    color: 'white', fontSize: '0.92rem', outline: 'none', transition: 'border-color 0.25s',
    fontFamily: 'DM Sans, sans-serif'
  };

  const labelStyle = { color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 7 };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D0D1A 0%, #1A0A0E 50%, #2C0A14 100%)',
      padding: '24px', paddingTop: '90px', position: 'relative'
    }}>
      <div style={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 2 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #C0152A, #8B0000)', borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ transform: 'rotate(45deg)', fontSize: 20 }}>🩸</span>
            </div>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '1.5rem', color: 'white' }}>BloodConnect</span>
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.45)', marginTop: 8, fontSize: '0.88rem' }}>Join our community of life-savers</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 32 }}>
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= s ? 'linear-gradient(135deg, #C0152A, #8B0000)' : 'rgba(255,255,255,0.1)',
                color: 'white', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.3s',
                boxShadow: step >= s ? '0 4px 12px rgba(192,21,42,0.4)' : 'none'
              }}>{s}</div>
              {s < 2 && <div style={{ width: 60, height: 2, background: step > s ? '#C0152A' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: '36px 32px',
          animation: 'fadeIn 0.5s ease'
        }}>
          <h2 style={{ color: 'white', fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', marginBottom: 24, textAlign: 'center' }}>
            {step === 1 ? '👤 Account Details' : '🩸 Medical & Location Info'}
          </h2>

          {step === 1 ? (
            <form onSubmit={nextStep}>
              <div style={{ display: 'grid', gap: 18 }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input name="full_name" value={form.full_name} onChange={handle} required placeholder="Your full name" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@example.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="+91 9876543210" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Password *</label>
                    <input name="password" type="password" value={form.password} onChange={handle} required placeholder="Min. 6 chars" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password *</label>
                    <input name="confirm_password" type="password" value={form.confirm_password} onChange={handle} required placeholder="Repeat password" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                </div>
                <button type="submit" style={{
                  width: '100%', padding: '13px', borderRadius: 50, marginTop: 4,
                  background: 'linear-gradient(135deg, #C0152A, #8B0000)', color: 'white',
                  fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: 'pointer',
                  boxShadow: '0 5px 18px rgba(192,21,42,0.4)'
                }}>Continue →</button>
              </div>
            </form>
          ) : (
            <form onSubmit={submit}>
              <div style={{ display: 'grid', gap: 18 }}>
                <div>
                  <label style={labelStyle}>Blood Group *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {BLOOD_GROUPS.map(bg => (
                      <button key={bg} type="button" onClick={() => setForm(f => ({ ...f, blood_group: bg }))} style={{
                        padding: '10px 6px', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem',
                        border: '2px solid', borderColor: form.blood_group === bg ? '#C0152A' : 'rgba(255,255,255,0.15)',
                        background: form.blood_group === bg ? 'rgba(192,21,42,0.3)' : 'rgba(255,255,255,0.05)',
                        color: form.blood_group === bg ? '#F87171' : 'rgba(255,255,255,0.6)',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}>{bg}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Age</label>
                    <input name="age" type="number" min="18" max="65" value={form.age} onChange={handle} placeholder="Your age" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select name="gender" value={form.gender} onChange={handle} style={{ ...inputStyle, cursor: 'pointer' }}
                      onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}>
                      <option value="" style={{ background: '#1A0A0E' }}>Select</option>
                      {['Male', 'Female', 'Other'].map(g => <option key={g} value={g} style={{ background: '#1A0A0E' }}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input name="city" value={form.city} onChange={handle} required placeholder="Your city" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                  <div>
                    <label style={labelStyle}>State</label>
                    <input name="state" value={form.state} onChange={handle} placeholder="State" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
                  </div>
                </div>
                {/* Donor toggle */}
                <div style={{ background: 'rgba(192,21,42,0.08)', border: '1px solid rgba(192,21,42,0.2)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => setForm(f => ({ ...f, is_donor: !f.is_donor }))}>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>🩸 Register as Blood Donor</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginTop: 2 }}>Your profile will be visible to those in need</div>
                  </div>
                  <div style={{
                    width: 48, height: 26, borderRadius: 13,
                    background: form.is_donor ? '#C0152A' : 'rgba(255,255,255,0.15)',
                    transition: 'all 0.3s', position: 'relative', flexShrink: 0
                  }}>
                    <div style={{
                      position: 'absolute', top: 3, left: form.is_donor ? 25 : 3,
                      width: 20, height: 20, borderRadius: '50%', background: 'white', transition: 'all 0.3s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <button type="button" onClick={() => setStep(1)} style={{
                    flex: 0.4, padding: '13px', borderRadius: 50, background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)', fontWeight: 600, border: 'none', cursor: 'pointer'
                  }}>← Back</button>
                  <button type="submit" disabled={loading} style={{
                    flex: 1, padding: '13px', borderRadius: 50,
                    background: loading ? 'rgba(192,21,42,0.5)' : 'linear-gradient(135deg, #C0152A, #8B0000)',
                    color: 'white', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 5px 18px rgba(192,21,42,0.4)'
                  }}>{loading ? '⏳ Creating account...' : '🎉 Create Account'}</button>
                </div>
              </div>
            </form>
          )}

          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', marginTop: 20 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#F87171', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
