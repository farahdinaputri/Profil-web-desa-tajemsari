import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, Leaf, UserCheck, Lock } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';
import { INITIAL_SETTINGS } from '../data/mockData';

export default function Navbar({ onOpenAdminLogin, isAdminLoggedIn, onLogoutAdmin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('tajemsari_settings');
      return stored ? JSON.parse(stored) : INITIAL_SETTINGS;
    } catch (e) {
      return INITIAL_SETTINGS;
    }
  });

  useEffect(() => {
    apiService.getSettings().then(data => {
      if (data) setSettings(data);
    });
  }, []);

  useEffect(() => {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      
      // Deteksi apakah navbar sudah lewat dari posisi paling atas
      setIsScrolled(currentScrollY > 15);

      // Jika menu mobile sedang dibuka, jangan sembunyikan navbar
      if (mobileMenuOpen) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      // Jika masih di area atas halaman (<= 60px), selalu tampilkan
      if (currentScrollY <= 60) {
        setIsVisible(true);
      } 
      // Jika scroll ke bawah dan melewati threshold, sembunyikan navbar
      else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
        setIsVisible(false);
      } 
      // Jika scroll ke atas, munculkan kembali navbar secara instan dan halus
      else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 6) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'beranda', path: '/', label: 'Beranda' },
    { id: 'profil', path: '/profil', label: 'Profil Desa' },
    { id: 'potensi', path: '/potensi', label: 'Produk UMKM & Wisata' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setIsVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  const getCleanBrandTitle = () => {
    if (!settings.namaDesa) return 'DESA TAJEMSARI';
    const clean = settings.namaDesa.trim();
    return clean.toUpperCase().startsWith('DESA') ? clean.toUpperCase() : `DESA ${clean.toUpperCase()}`;
  };

  const getCleanBrandSubtitle = () => {
    const rawKec = settings.kecamatan || 'Tegowanu';
    const rawKab = settings.kabupaten || 'Grobogan';
    const cleanKec = rawKec.toLowerCase().startsWith('kecamatan')
      ? rawKec
      : (rawKec.toLowerCase().startsWith('kec.') ? rawKec : `Kec. ${rawKec}`);
    const cleanKab = rawKab.toLowerCase().startsWith('kabupaten')
      ? rawKab
      : (rawKab.toLowerCase().startsWith('kab.') ? rawKab : `Kab. ${rawKab}`);
    return `${cleanKec}, ${cleanKab}`;
  };

  return (
    <header className={`navbar-container ${!isVisible ? 'nav-hidden' : ''} ${isScrolled ? 'nav-scrolled' : ''}`}>
      <style>{`
        .navbar-container {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(46, 125, 50, 0.15);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, box-shadow 0.3s ease;
          will-change: transform;
        }

        .navbar-container.nav-hidden {
          transform: translateY(-100%);
          box-shadow: none;
        }

        .navbar-container.nav-scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
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
              <div className="brand-text-title">{getCleanBrandTitle()}</div>
              <div className="brand-text-subtitle">{getCleanBrandSubtitle()}</div>
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

            {/* Mobile Only Admin Link inside Drawer (Only when logged in) */}
            {isAdminLoggedIn && (
              <li className="mobile-only-admin-link" style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                <button
                  className="nav-item-btn"
                  onClick={() => handleNavClick('/admin')}
                  style={{ color: 'var(--color-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}
                >
                  <ShieldCheck size={16} color="var(--color-gold)" /> Dashboard Admin
                </button>
              </li>
            )}
          </ul>

          {/* Admin Corner Action (Shows Clean Panel Admin & Keluar when logged in) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAdminLoggedIn && (
              <div className="admin-corner-wrap" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <button
                  id="admin-dashboard-shortcut-btn"
                  onClick={() => handleNavClick('/admin')}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6, 
                    background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', 
                    color: '#ffffff', 
                    border: '1.5px solid var(--color-gold)', 
                    padding: '0.45rem 1rem', 
                    borderRadius: '24px', 
                    fontSize: '0.82rem', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    boxShadow: '0 2px 10px rgba(27,94,32,0.25)',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  title="Kembali ke Dashboard Admin"
                >
                  <ShieldCheck size={15} color="#fef08a" />
                  <span>Panel Admin</span>
                </button>
                <button
                  id="admin-logout-btn"
                  onClick={onLogoutAdmin}
                  style={{ 
                    background: '#fee2e2', 
                    color: '#dc2626', 
                    border: '1px solid #fecaca', 
                    padding: '0.45rem 0.8rem', 
                    borderRadius: '24px', 
                    fontSize: '0.8rem', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease' 
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#fecaca'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                  title="Keluar dari Akun Admin"
                >
                  Keluar
                </button>
              </div>
            )}

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
