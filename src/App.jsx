import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';
import InitialLoader from './components/InitialLoader';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Showcase from './pages/Showcase';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tajemsari_admin_auth');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleAdminLoginSuccess = (user) => {
    localStorage.setItem('tajemsari_admin_auth', JSON.stringify(user));
    setAdminUser(user);
    navigate('/admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('tajemsari_admin_auth');
    setAdminUser(null);
    navigate('/');
  };

  return (
    <div className="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Otomatis Scroll ke Paling Atas Saat Refresh & Ganti Halaman/Katalog */}
      <ScrollToTop />

      {/* Animasi Layar Awal Website (Initial Screen Loader) */}
      <InitialLoader />

      {/* Tampilkan Navbar Publik Hanya Jika BUKAN Halaman Admin */}
      {!isAdminRoute && (
        <Navbar 
          onOpenAdminLogin={() => setIsLoginModalOpen(true)}
          isAdminLoggedIn={Boolean(adminUser)}
          onLogoutAdmin={handleAdminLogout}
        />
      )}

      {/* Main Page View Routes */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/berita" element={<NewsList />} />
          <Route path="/berita/:id" element={<NewsDetail />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/potensi" element={<Showcase />} />
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

      {/* Tampilkan Footer Publik Hanya Jika BUKAN Halaman Admin */}
      {!isAdminRoute && (
        <Footer 
          onOpenAdminLogin={() => setIsLoginModalOpen(true)}
          isAdminLoggedIn={Boolean(adminUser)}
        />
      )}

      {/* Admin Login Modal Pop-up */}
      <AdminLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
    </div>
  );
}
