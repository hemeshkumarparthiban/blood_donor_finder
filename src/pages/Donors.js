import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getDonors } from '../utils/api';
import { DonorCard, Spinner } from '../components/UIComponents';

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function Donors() {
  const [searchParams] = useSearchParams();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    blood_group: searchParams.get('blood_group') || '',
    city: searchParams.get('city') || '',
    state: '',
  });
  const [tempFilters, setTempFilters] = useState({ ...filters });

  const fetchDonors = useCallback(async (f = filters, p = page) => {
    setLoading(true);
    try {
      const params = { ...f, page: p, limit: 12 };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await getDonors(params);
      setDonors(res.data.donors);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchDonors(filters, 1); setPage(1); }, []);

  const applyFilters = e => {
    e.preventDefault();
    setFilters(tempFilters);
    setPage(1);
    fetchDonors(tempFilters, 1);
  };

  const resetFilters = () => {
    const empty = { blood_group: '', city: '', state: '' };
    setFilters(empty);
    setTempFilters(empty);
    setPage(1);
    fetchDonors(empty, 1);
  };

  const changePage = (p) => { setPage(p); fetchDonors(filters, p); window.scrollTo(0, 0); };

  return (
    <div style={{ paddingTop: 90, minHeight: '100vh', background: '#FAF9F7' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1A0A0E, #2C0A14)',
        padding: '50px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(192,21,42,0.12) 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'white', marginBottom: 12 }}>
            🔍 Find Blood <span style={{ background: 'linear-gradient(135deg, #C0152A, #E63950)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Donors</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.05rem' }}>
            {total > 0 ? `${total} donors found` : 'Search for available blood donors near you'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Filter bar */}
        <form onSubmit={applyFilters} style={{
          background: 'white', borderRadius: 20, padding: '24px 28px', marginBottom: 36,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6',
          display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end'
        }}>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 7 }}>Blood Group</label>
            <select value={tempFilters.blood_group} onChange={e => setTempFilters(f => ({ ...f, blood_group: e.target.value }))}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.92rem', background: 'white', cursor: 'pointer', outline: 'none', color: '#1F2937' }}>
              <option value="">All Groups</option>
              {BLOOD_GROUPS.slice(1).map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 7 }}>City</label>
            <input value={tempFilters.city} onChange={e => setTempFilters(f => ({ ...f, city: e.target.value }))}
              placeholder="Search by city..." style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', color: '#1F2937' }}
              onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <label style={{ display: 'block', fontWeight: 500, color: '#6B7280', fontSize: '0.85rem', marginBottom: 7 }}>State</label>
            <input value={tempFilters.state} onChange={e => setTempFilters(f => ({ ...f, state: e.target.value }))}
              placeholder="State..." style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', color: '#1F2937' }}
              onFocus={e => e.target.style.borderColor = '#C0152A'} onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ padding: '11px 24px', borderRadius: 50, background: 'linear-gradient(135deg, #C0152A, #8B0000)', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(192,21,42,0.3)' }}>
              🔍 Search
            </button>
            <button type="button" onClick={resetFilters} style={{ padding: '11px 20px', borderRadius: 50, background: '#F3F4F6', color: '#6B7280', fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
              Reset
            </button>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <Spinner center />
        ) : donors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9CA3AF' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🩸</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: '#6B7280', marginBottom: 10 }}>No Donors Found</h3>
            <p>Try adjusting your filters or search in a different area.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20, color: '#6B7280', fontSize: '0.9rem' }}>
              Showing <strong style={{ color: '#1F2937' }}>{donors.length}</strong> of <strong style={{ color: '#1F2937' }}>{total}</strong> donors
              {filters.blood_group && <> • Blood group: <strong style={{ color: '#C0152A' }}>{filters.blood_group}</strong></>}
              {filters.city && <> • City: <strong style={{ color: '#C0152A' }}>{filters.city}</strong></>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 22 }}>
              {donors.map((donor, i) => (
                <div key={donor.id} style={{ animation: `fadeIn 0.5s ease ${i * 0.06}s both` }}>
                  <DonorCard donor={donor} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 40 }}>
                <button onClick={() => changePage(page - 1)} disabled={page === 1} style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid #E5E7EB', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#9CA3AF' : '#4B5563', fontWeight: 500 }}>← Prev</button>
                {[...Array(Math.min(pages, 7))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button key={p} onClick={() => changePage(p)} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid', borderColor: page === p ? '#C0152A' : '#E5E7EB', background: page === p ? '#C0152A' : 'white', color: page === p ? 'white' : '#4B5563', fontWeight: page === p ? 700 : 400, cursor: 'pointer' }}>{p}</button>
                  );
                })}
                <button onClick={() => changePage(page + 1)} disabled={page === pages} style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid #E5E7EB', background: 'white', cursor: page === pages ? 'not-allowed' : 'pointer', color: page === pages ? '#9CA3AF' : '#4B5563', fontWeight: 500 }}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
