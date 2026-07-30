import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Services from './pages/Services';
import Showcase from './pages/Showcase';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState('beranda');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  const handleAdminLoginSuccess = (user) => {
    setAdminUser(user);
    setActiveTab('admin');
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    if (activeTab === 'admin') {
      setActiveTab('beranda');
    }
  };

  return (
    <div className="app-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header & Navbar dengan Tombol Admin di Pojok */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        isAdminLoggedIn={Boolean(adminUser)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Main Page View Router */}
      <main style={{ flex: 1 }}>
        {activeTab === 'beranda' && <Home onNavigate={setActiveTab} />}
        {activeTab === 'profil' && <Profile />}
        {activeTab === 'layanan' && <Services />}
        {activeTab === 'potensi' && <Showcase />}
        {activeTab === 'admin' && (
          adminUser ? (
            <AdminDashboard adminUser={adminUser} onLogout={handleAdminLogout} />
          ) : (
            <div style={{ textCenter: 'center', padding: '5rem 1.5rem' }}>
              <h2>Akses Dibatasi</h2>
              <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0' }}>Anda harus login sebagai Admin terlebih dahulu.</p>
              <button className="btn btn-gold" onClick={() => setIsLoginModalOpen(true)}>
                Buka Login Admin
              </button>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={setActiveTab}
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
