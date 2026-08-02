import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, Leaf, UserCheck, Lock } from 'lucide-react';

export default function Navbar({ onOpenAdminLogin, isAdminLoggedIn, onLogoutAdmin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', path: '/', label: 'Beranda' },
    { id: 'profil', path: '/profil', label: 'Profil Desa' },
    { id: 'layanan', path: '/layanan', label: 'Layanan Publik' },
    { id: 'potensi', path: '/potensi', label: 'Potensi & Wisata' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  return (
    <header className="navbar-container">
      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(46, 125, 50, 0.15);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 76px;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          cursor: pointer;
        }

        .logo-icon-wrap {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(46, 125, 50, 0.25);
          border: 2px solid #d4af37;
        }

        .brand-text-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          color: #1b5e20;
          line-height: 1.1;
          letter-spacing: -0.2px;
        }

        .brand-text-subtitle {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
        }

        .nav-item-btn {
          padding: 0.55rem 1.1rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.92rem;
          color: var(--color-text-main);
          background: transparent;
          transition: var(--transition-fast);
        }

        .nav-item-btn:hover {
          color: var(--color-primary);
          background: var(--color-primary-soft);
        }

        .nav-item-btn.active {
          color: var(--color-primary-dark);
          background: var(--color-primary-soft);
          border-bottom: 2px solid var(--color-gold);
          font-weight: 700;
        }

        .admin-corner-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.95rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 700;
          font-family: var(--font-heading);
          transition: var(--transition-fast);
          cursor: pointer;
        }

        .admin-corner-btn.login {
          background: #fef9e7;
          border: 1px solid var(--color-gold);
          color: #8a6d13;
        }

        .admin-corner-btn.login:hover {
          background: var(--color-gold);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }

        .admin-corner-btn.dashboard {
          background: var(--color-primary);
          color: #ffffff;
          border: 1px solid var(--color-primary-dark);
        }

        .admin-corner-btn.dashboard:hover {
          background: var(--color-primary-dark);
        }

        .hamburger-btn {
          display: none;
          background: transparent;
          color: var(--color-primary-dark);
          padding: 0.5rem;
        }

        .mobile-only-admin-link {
          display: none;
        }

        @media (max-width: 920px) {
          .brand-text-subtitle {
            display: none !important;
          }
          .admin-corner-wrap {
            display: none !important;
          }
          .mobile-only-admin-link {
            display: block !important;
          }
          .nav-links {
            display: none;
          }
          .nav-links.open {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 76px;
            left: 0;
            right: 0;
            background: #ffffff;
            padding: 1.5rem;
            border-bottom: 2px solid var(--color-primary);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }
          .hamburger-btn {
            display: block;
          }
        }
      `}</style>

      <div className="container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <div className="brand-logo" onClick={() => handleNavClick('/')}>
            <div className="logo-icon-wrap">
              <Leaf size={24} />
            </div>
            <div>
              <div className="brand-text-title">DESA TAJEMSARI</div>
              <div className="brand-text-subtitle">Kec. Tegowanu, Kab. Grobogan</div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  id={`nav-link-${item.id}`}
                  className={`nav-item-btn ${isCurrentActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.path)}
                >
                  {item.label}
                </button>
              </li>
            ))}

            {isAdminLoggedIn && (
              <li>
                <button
                  id="nav-link-admin-panel"
                  className={`nav-item-btn ${location.pathname === '/admin' ? 'active' : ''}`}
                  onClick={() => handleNavClick('/admin')}
                  style={{ color: '#d4af37', fontWeight: 700 }}
                >
                  <ShieldCheck size={16} style={{ display: 'inline', marginRight: 4 }} />
                  Panel Admin
                </button>
              </li>
            )}

            {/* Mobile Only Admin Login Link inside Drawer */}
            <li className="mobile-only-admin-link" style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
              {isAdminLoggedIn ? (
                <button
                  className="nav-item-btn"
                  onClick={() => handleNavClick('/admin')}
                  style={{ color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}
                >
                  <UserCheck size={16} /> Dashboard Admin
                </button>
              ) : (
                <button
                  className="nav-item-btn"
                  onClick={() => { setMobileMenuOpen(false); onOpenAdminLogin(); }}
                  style={{ color: '#8a6d13', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, width: '100%', background: '#fef9e7', border: '1px solid var(--color-gold)' }}
                >
                  <Lock size={16} /> Admin Login
                </button>
              )}
            </li>
          </ul>

          {/* Admin Login Corner Action (Desktop Only via admin-corner-wrap class) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="admin-corner-wrap">
              {isAdminLoggedIn ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    id="admin-dashboard-shortcut-btn"
                    className="admin-corner-btn dashboard"
                    onClick={() => handleNavClick('/admin')}
                  >
                    <UserCheck size={14} /> Admin Mode
                  </button>
                  <button
                    id="admin-logout-btn"
                    onClick={onLogoutAdmin}
                    style={{ background: '#fee2e2', color: '#991b1b', padding: '0.4rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600 }}
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <button
                  id="corner-admin-login-btn"
                  className="admin-corner-btn login"
                  onClick={onOpenAdminLogin}
                  title="Login Pengurus / Admin Desa"
                >
                  <Lock size={14} /> Admin Login
                </button>
              )}
            </div>

            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
