import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail, Clock, Lock, ExternalLink, Compass } from 'lucide-react';

export default function Footer({ onOpenAdminLogin, isAdminLoggedIn }) {
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrap">
      <style>{`
        .footer-wrap {
          background: #112a14;
          color: #e8f5e9;
          padding: 4.5rem 0 2rem 0;
          border-top: 4px solid var(--color-gold);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 0.9fr 1.1fr 1.1fr 1.4fr;
          gap: 2rem;
          margin-bottom: 3.5rem;
        }

        .footer-brand-title {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .footer-desc {
          color: #a7f3d0;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .footer-col-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-gold);
          margin-bottom: 1.2rem;
        }

        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .footer-link-item {
          font-size: 0.9rem;
          color: #cbd5e1;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .footer-link-item:hover {
          color: var(--color-gold);
          transform: translateX(3px);
        }

        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.88rem;
          color: #cbd5e1;
          margin-bottom: 0.85rem;
        }

        .footer-map-embed {
          width: 100%;
          height: 180px;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          margin-bottom: 0.75rem;
        }

        .footer-maps-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid var(--color-gold);
          color: #fef9e7;
          padding: 0.4rem 0.85rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .footer-maps-link:hover {
          background: var(--color-gold);
          color: #ffffff;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #94a3b8;
          flex-wrap: wrap;
          gap: 1rem;
        }

        @media (max-width: 1100px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 650px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-brand-title">
              <Leaf color="#d4af37" size={26} /> DESA TAJEMSARI
            </div>
            <p className="footer-desc">
              Pemerintah Desa Tajemsari, Kecamatan Tegowanu, Kabupaten Grobogan. Mengedepankan transparansi tata kelola, inovasi pelayanan publik, dan pelestarian nilai budaya persawahan Jawa.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h4 className="footer-col-title">Navigasi Utama</h4>
            <ul className="footer-links-list">
              <li className="footer-link-item" onClick={() => handleNavClick('/')}>Beranda Utama</li>
              <li className="footer-link-item" onClick={() => handleNavClick('/profil')}>Profil & Struktur Desa</li>
              <li className="footer-link-item" onClick={() => handleNavClick('/layanan')}>Katalog Layanan Publik</li>
              <li className="footer-link-item" onClick={() => handleNavClick('/potensi')}>Potensi UMKM & Wisata</li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div>
            <h4 className="footer-col-title">Jam Pelayanan</h4>
            <div className="footer-contact-item">
              <Clock size={18} color="#d4af37" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Senin - Kamis:</strong><br />
                08.00 - 15.30 WIB
              </div>
            </div>
            <div className="footer-contact-item">
              <Clock size={18} color="#d4af37" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Jumat:</strong><br />
                08.00 - 11.30 WIB
              </div>
            </div>
          </div>

          {/* Address & Contact */}
          <div>
            <h4 className="footer-col-title">Kontak & Alamat</h4>
            <div className="footer-contact-item">
              <MapPin size={18} color="#d4af37" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                Jl. Raya Tajemsari No. 01, Tegowanu, Kab. Grobogan, Jawa Tengah 58165
              </div>
            </div>
            <div className="footer-contact-item">
              <Phone size={18} color="#d4af37" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>(0292) 7654-321 / WA: 0812-3456-7890</div>
            </div>
            <div className="footer-contact-item">
              <Mail size={18} color="#d4af37" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>pemdes@tajemsari.desa.id</div>
            </div>
          </div>

          {/* Google Maps Location Section (Far Right on Desktop, Bottom on Mobile) */}
          <div>
            <h4 className="footer-col-title">Lokasi Desa</h4>
            <iframe 
              className="footer-map-embed"
              title="Lokasi Desa Tajemsari Tegowanu"
              src="https://maps.google.com/maps?q=Desa%20Tajemsari,%20Tegowanu,%20Grobogan&t=&z=14&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <a 
              href="https://maps.app.goo.gl/3VuZdA1hyBNbtZpn8" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-maps-link"
            >
              <ExternalLink size={14} /> Buka di Google Maps
            </a>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © 2026 Pemerintah Desa Tajemsari, Tegowanu, Grobogan. Hak Cipta Dilindungi.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!isAdminLoggedIn && (
              <button 
                id="footer-admin-login-link"
                onClick={onOpenAdminLogin}
                style={{ background: 'transparent', border: 'none', color: '#d4af37', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'underline' }}
              >
                <Lock size={14} /> Login Portal Admin
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
