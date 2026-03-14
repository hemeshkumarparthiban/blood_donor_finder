import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 6 + 3,
  x: Math.random() * 100,
  y: Math.random() * 100,
  dur: Math.random() * 8 + 6,
  delay: Math.random() * 5,
  opacity: Math.random() * 0.25 + 0.06,
}));

const FACTS = [
  { icon: '💉', text: 'Every 2 seconds someone needs blood' },
  { icon: '❤️', text: 'One donation saves up to 3 lives' },
  { icon: '🩸', text: 'Blood cannot be manufactured — only donated' },
  { icon: '🌍', text: '118.5 million donations collected globally each year' },
  { icon: '⏱️', text: 'Whole blood donation takes only 8–10 minutes' },
];

export default function Home() {
  const [factIdx, setFactIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setFactIdx(i => (i + 1) % FACTS.length);
        setVisible(true);
      }, 400);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #0A0612 0%, #150818 30%, #1A0A0E 60%, #200810 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>

      {/* Animated blood-drop particles */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size * 1.25,
          borderRadius: '50% 50% 50% 0',
          transform: 'rotate(-45deg)',
          background: `rgba(192,21,42,${p.opacity})`,
          animation: `floatPart ${p.dur}s ease-in-out ${p.delay}s infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* Glow orbs */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(192,21,42,0.12) 0%, transparent 70%)', top: '-10%', left: '-10%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,0,30,0.1) 0%, transparent 70%)', bottom: '-5%', right: '-5%', pointerEvents: 'none' }} />

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1000, padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeDown 0.8s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 64, height: 64,
              background: 'linear-gradient(135deg, #C0152A, #8B0000)',
              borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px rgba(192,21,42,0.5)',
              animation: 'heartbeat 2s ease-in-out infinite',
            }}>
              <span style={{ transform: 'rotate(45deg)', fontSize: 28 }}>🩸</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: '2.2rem', color: 'white', lineHeight: 1, letterSpacing: '-0.02em' }}>
                Blood<span style={{ color: '#E63950' }}>Connect</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: 4, textTransform: 'uppercase', marginTop: 3 }}>
                Saving Lives Together
              </div>
            </div>
          </div>

          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: 'white', fontWeight: 700, lineHeight: 1.3, marginBottom: 14 }}>
            Find a Donor. <span style={{ color: '#E63950' }}>Save a Life.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', maxWidth: 460, margin: '0 auto' }}>
            Connect with blood donors in your city instantly. Every second matters.
          </p>
        </div>

        {/* Fact ticker */}
        <div style={{
          background: 'rgba(192,21,42,0.12)', border: '1px solid rgba(192,21,42,0.25)',
          borderRadius: 50, padding: '10px 24px', marginBottom: 52,
          opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
          animation: 'fadeDown 0.8s ease 0.2s both',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.88rem' }}>
            {FACTS[factIdx].icon} &nbsp;{FACTS[factIdx].text}
          </span>
        </div>

        {/* ── LOGIN + REGISTER CARDS ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 28, width: '100%', maxWidth: 720,
          animation: 'fadeUp 0.8s ease 0.3s both',
        }}>

          {/* Login Card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24, padding: '40px 36px',
            textAlign: 'center', transition: 'all 0.35s',
            cursor: 'default',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(192,21,42,0.4)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(192,21,42,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(192,21,42,0.25), rgba(139,0,0,0.35))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid rgba(192,21,42,0.3)', fontSize: 30 }}>🔐</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '1.5rem', marginBottom: 10 }}>Welcome Back</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.6 }}>
              Sign in to access your donor profile, view blood requests, and manage your account.
            </p>
            <Link to="/login" style={{
              display: 'block', padding: '14px 0', borderRadius: 50,
              background: 'linear-gradient(135deg, #C0152A, #8B0000)',
              color: 'white', fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none', boxShadow: '0 6px 24px rgba(192,21,42,0.4)',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(192,21,42,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(192,21,42,0.4)'; }}
            >
              Sign In →
            </Link>
          </div>

          {/* Register Card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 24, padding: '40px 36px',
            textAlign: 'center', transition: 'all 0.35s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 24px 60px rgba(212,175,55,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '2px solid rgba(212,175,55,0.3)', fontSize: 30 }}>💉</div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '1.5rem', marginBottom: 10 }}>Become a Hero</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.6 }}>
              Register as a donor and start saving lives. Your blood today is someone's tomorrow.
            </p>
            <Link to="/register" style={{
              display: 'block', padding: '14px 0', borderRadius: 50,
              background: 'linear-gradient(135deg, #D4AF37, #B8960C)',
              color: '#1A0A0E', fontWeight: 700, fontSize: '0.95rem',
              textDecoration: 'none', boxShadow: '0 6px 24px rgba(212,175,55,0.3)',
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(212,175,55,0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(212,175,55,0.3)'; }}
            >
              Create Account →
            </Link>
          </div>
        </div>

        {/* Blood group strip */}
        <div style={{ display: 'flex', gap: 10, marginTop: 52, flexWrap: 'wrap', justifyContent: 'center', animation: 'fadeUp 0.8s ease 0.5s both' }}>
          {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bg, i) => (
            <div key={bg} style={{
              width: 44, height: 44, borderRadius: '50%',
              background: i % 2 === 0 ? 'rgba(192,21,42,0.2)' : 'rgba(192,21,42,0.1)',
              border: '1.5px solid rgba(192,21,42,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontWeight: 700,
              fontFamily: 'Playfair Display, serif',
              animation: `fadeUp 0.5s ease ${0.5 + i * 0.05}s both`,
              transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(192,21,42,0.4)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'scale(1.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = i % 2 === 0 ? 'rgba(192,21,42,0.2)' : 'rgba(192,21,42,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >{bg}</div>
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem', marginTop: 20, animation: 'fadeUp 0.8s ease 0.7s both' }}>
          All 8 blood types supported · Donors across India
        </p>
      </div>

      <style>{`
        @keyframes fadeDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatPart { 0%, 100% { transform: rotate(-45deg) translateY(0px); } 50% { transform: rotate(-45deg) translateY(-18px); } }
        @keyframes heartbeat { 0%, 100% { transform: rotate(-45deg) scale(1); } 14% { transform: rotate(-45deg) scale(1.18); } 28% { transform: rotate(-45deg) scale(1); } 42% { transform: rotate(-45deg) scale(1.12); } 70% { transform: rotate(-45deg) scale(1); } }
      `}</style>
    </div>
  );
}
