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
import { apiService } from './lib/supabaseClient';

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
                <div style={{ background: 'linear-gradient(135deg, #112a14 0%, #1e4620 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                  <div style={{ background: '#ffffff', maxWidth: 420, width: '100%', borderRadius: 24, boxShadow: '0 25px 50px rgba(0,0,0,0.3)', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.4)' }}>
                    <div style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: '#ffffff', padding: '2rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ width: 60, height: 60, background: '#d4af37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', color: '#112a14', fontWeight: 900, fontSize: '1.4rem', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                        TJ
                      </div>
                      <h2 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 700 }}>Panel Admin Desa Tajemsari</h2>
                      <p style={{ fontSize: '0.82rem', margin: '0.35rem 0 0 0', opacity: 0.85 }}>Kec. Tegowanu, Kab. Grobogan</p>
                    </div>

                    <form 
                      style={{ padding: '1.75rem' }}
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const idVal = e.target.elements.identifier.value;
                        const passVal = e.target.elements.password.value;
                        const errBox = document.getElementById('admin-inline-error');
                        if (errBox) errBox.style.display = 'none';

                        try {
                          const res = await apiService.verifyAdminLogin(idVal, passVal);
                          if (res.success) {
                            handleAdminLoginSuccess(res.user);
                          } else {
                            if (errBox) {
                              errBox.innerText = res.message || 'Kredensial login tidak ditemukan atau salah.';
                              errBox.style.display = 'block';
                            }
                          }
                        } catch (err) {
                          if (errBox) {
                            errBox.innerText = 'Terjadi kesalahan saat memverifikasi kredensial.';
                            errBox.style.display = 'block';
                          }
                        }
                      }}
                    >
                      <div id="admin-inline-error" style={{ display: 'none', background: '#fee2e2', color: '#991b1b', padding: '0.65rem 0.85rem', borderRadius: 8, fontSize: '0.82rem', marginBottom: '1rem', border: '1px solid #fecaca' }}></div>

                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                          Email atau Username Admin *
                        </label>
                        <input 
                          name="identifier"
                          type="text" 
                          className="form-input-custom" 
                          placeholder="admin@tajemsari.desa.id" 
                          defaultValue="admin@tajemsari.desa.id"
                          required 
                        />
                      </div>

                      <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                          Kata Sandi (Password) *
                        </label>
                        <input 
                          name="password"
                          type="password" 
                          className="form-input-custom" 
                          placeholder="••••••••" 
                          defaultValue="tajemsari2026"
                          required 
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-gold" 
                        style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center' }}
                      >
                        Masuk ke Dashboard Admin
                      </button>

                      <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                        <button 
                          type="button" 
                          style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.82rem', cursor: 'pointer' }}
                          onClick={() => navigate('/')}
                        >
                          ← Kembali ke Beranda Website
                        </button>
                      </div>
                    </form>
                  </div>
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
