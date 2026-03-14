import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Donors from './pages/Donors';
import Requests from './pages/Requests';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import { CampsPage, AboutPage } from './pages/OtherPages';
import './index.css';

const Loader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D1A' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 48, height: 48, border: '3px solid rgba(192,21,42,0.2)', borderTopColor: '#C0152A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Loading...</div>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Redirect logged-in users away from login/register
const PublicRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loader />;
  if (user) return <Navigate to={isAdmin ? '/admin' : '/home'} />;
  return children;
};

// Require login
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" />;
};

// Require admin
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/home" />;
  return children;
};

// Hide navbar/footer on auth pages and admin
const noShellRoutes = ['/', '/login', '/register', '/admin'];

function AppInner() {
  const location = useLocation();
  const hideShell = noShellRoutes.includes(location.pathname) || location.pathname.startsWith('/admin');

  return (
    <>
      {!hideShell && <Navbar />}
      <main>
        <Routes>
          {/* Root = landing (login + register cards) */}
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected user pages */}
          <Route path="/home"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/donors"    element={<ProtectedRoute><Donors /></ProtectedRoute>} />
          <Route path="/requests"  element={<ProtectedRoute><Requests /></ProtectedRoute>} />
          <Route path="/camps"     element={<ProtectedRoute><CampsPage /></ProtectedRoute>} />
          <Route path="/about"     element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
          <Route path="/admin/*" element={<AdminRoute><AdminPanel /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {!hideShell && <Footer />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppInner />
      </Router>
    </AuthProvider>
  );
}

export default App;
