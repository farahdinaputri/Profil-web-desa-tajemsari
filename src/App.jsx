import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Services from './pages/Services';
import Showcase from './pages/Showcase';
import NewsDetail from './pages/NewsDetail';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const handleAdminLoginSuccess = (user) => {
    setAdminUser(user);
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    navigate('/');
  };

  return (
    <div className="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header & Navbar dengan Routing */}
      <Navbar 
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        isAdminLoggedIn={Boolean(adminUser)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Main Page View Routes */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/layanan" element={<Services />} />
          <Route path="/potensi" element={<Showcase />} />
          <Route path="/berita/:id" element={<NewsDetail />} />
          <Route 
            path="/admin" 
            element={
              adminUser ? (
                <AdminDashboard adminUser={adminUser} onLogout={handleAdminLogout} />
              ) : (
                <div style={{ textAlign: 'center', padding: '5rem 1.5rem', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <h2 style={{ color: 'var(--color-primary-dark)', fontSize: '2rem', marginBottom: '1rem' }}>Akses Dibatasi</h2>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Anda harus login sebagai Admin untuk mengakses Panel Pengelolaan Desa.</p>
                  <button className="btn btn-gold" onClick={() => setIsLoginModalOpen(true)}>
                    Buka Modal Login Admin
                  </button>
                </div>
              )
            } 
          />
          {/* Fallback 404 Route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer 
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        isAdminLoggedIn={Boolean(adminUser)}
      />

      {/* Admin Login Modal Pop-up */}
      <AdminLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
