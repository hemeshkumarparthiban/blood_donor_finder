// ─── Blood Camps Page ─────────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import { getCamps } from '../utils/api';
import { Spinner } from '../components/UIComponents';

export function CampsPage() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCamps().then(r => setCamps(r.data.camps || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: '#FAF9F7' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A0A0E, #2C0A14)', padding: '50px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(192,21,42,0.12) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'white', marginBottom: 12 }}>
            🏕️ Blood Donation <span style={{ background: 'linear-gradient(135deg, #C0152A, #E63950)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Camps</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem' }}>Upcoming donation drives near you</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        {loading ? <Spinner center /> : camps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>🏕️</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#6B7280', marginBottom: 8 }}>No Upcoming Camps</h3>
            <p>Check back soon for blood donation camps near you.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {camps.map((camp, i) => (
              <div key={camp.id} style={{
                background: 'white', borderRadius: 20, overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1px solid #F3F4F6',
                animation: `fadeIn 0.5s ease ${i * 0.1}s both`, transition: 'all 0.3s'
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(192,21,42,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}
              >
                <div style={{ background: 'linear-gradient(135deg, #C0152A, #8B0000)', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', color: 'white', fontSize: '1.15rem', flex: 1 }}>{camp.camp_name}</h3>
                    <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '6px 12px', textAlign: 'center', flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', lineHeight: 1 }}>
                        {new Date(camp.camp_date).getDate()}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                        {new Date(camp.camp_date).toLocaleString('default', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {[
                      { icon: '📍', label: `${camp.location}, ${camp.city}${camp.state ? `, ${camp.state}` : ''}` },
                      { icon: '👤', label: camp.organizer_name },
                      ...(camp.start_time ? [{ icon: '🕐', label: `${camp.start_time} – ${camp.end_time}` }] : []),
                      ...(camp.contact_phone ? [{ icon: '📞', label: camp.contact_phone }] : []),
                    ].map(({ icon, label }) => (
                      <div key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.88rem', color: '#6B7280' }}>
                        <span style={{ flexShrink: 0 }}>{icon}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  {camp.description && (
                    <p style={{ fontSize: '0.85rem', color: '#9CA3AF', marginTop: 14, lineHeight: 1.7, borderTop: '1px solid #F9FAFB', paddingTop: 14 }}>
                      {camp.description}
                    </p>
                  )}
                  {camp.contact_phone && (
                    <a href={`tel:${camp.contact_phone}`} style={{
                      display: 'block', textAlign: 'center', marginTop: 16,
                      padding: '10px', borderRadius: 50, background: 'linear-gradient(135deg, #C0152A, #8B0000)',
                      color: 'white', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none'
                    }}>📞 Register / Contact</a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────
export function AboutPage() {
  return (
    <div style={{ paddingTop: 90, minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1A0A0E, #2C0A14)', padding: '70px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(192,21,42,0.12) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 60, marginBottom: 20, animation: 'heartbeat 2s ease-in-out infinite' }}>🩸</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white', marginBottom: 20 }}>
            About <span style={{ background: 'linear-gradient(135deg, #C0152A, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>BloodConnect</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.15rem', maxWidth: 600, margin: '0 auto' }}>
            A mission-driven platform connecting blood donors with those in critical need, saving lives one donation at a time.
          </p>
        </div>
      </div>

      <section style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#1A1A2E', marginBottom: 20 }}>Our Mission</h2>
              <p style={{ color: '#6B7280', lineHeight: 1.9, fontSize: '1.05rem', marginBottom: 20 }}>
                BloodConnect was founded with one simple but powerful mission: to eliminate the tragic loss of life caused by lack of blood supply. We bridge the gap between willing donors and patients in need through technology.
              </p>
              <p style={{ color: '#6B7280', lineHeight: 1.9, fontSize: '1.05rem' }}>
                Every second, someone in India needs blood. Our platform ensures that the right donor can be found in minutes, not hours.
              </p>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #FFF0F1, #FAF9F7)', borderRadius: 24, padding: 40, textAlign: 'center' }}>
              {[['1 Donation', 'Saves 3 Lives', '#C0152A'], ['Every 2 Sec', 'Someone needs blood', '#D97706'], ['4.5M Units', 'Needed annually in India', '#10B981']].map(([title, sub, color]) => (
                <div key={title} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', fontWeight: 700, color, marginBottom: 4 }}>{title}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.88rem' }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: '#FAF9F7' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: '#1A1A2E', marginBottom: 48, textAlign: 'center' }}>Why Choose BloodConnect?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {[
              { icon: '⚡', title: 'Instant Match', desc: 'Find compatible donors in your city within seconds using our smart search.' },
              { icon: '🔒', title: 'Safe & Verified', desc: 'All donors are registered users. Contact only verified, willing donors.' },
              { icon: '📱', title: 'Mobile Ready', desc: 'Access our platform from any device, anytime, anywhere.' },
              { icon: '🆓', title: 'Completely Free', desc: 'Our platform is free for donors and recipients. No hidden charges.' },
              { icon: '📊', title: 'Real-Time Data', desc: 'Live availability status, donation history, and camp updates.' },
              { icon: '❤️', title: 'Community', desc: 'Join thousands of donors committed to saving lives together.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'white', borderRadius: 18, padding: '28px 22px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>
                <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: '#1F2937', marginBottom: 8 }}>{title}</h4>
                <p style={{ color: '#9CA3AF', fontSize: '0.88rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, #C0152A, #8B0000)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'white', marginBottom: 14 }}>Ready to Save a Life?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>Register as a donor or find blood now</p>
        <a href="/register" style={{ display: 'inline-block', background: 'white', color: '#C0152A', padding: '14px 40px', borderRadius: 50, fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none' }}>Get Started →</a>
      </section>

      <style>{`@keyframes heartbeat { 0%, 100% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.3); } 70% { transform: scale(1); } }`}</style>
    </div>
  );
}
