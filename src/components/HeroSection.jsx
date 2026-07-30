import React from 'react';
import { FileText, Users, HeartPulse, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export default function HeroSection({ onNavigate }) {
  return (
    <div className="hero-container">
      <style>{`
        .hero-container {
          position: relative;
          background: linear-gradient(180deg, rgba(15, 42, 18, 0.72) 0%, rgba(27, 94, 32, 0.85) 100%),
                      url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat;
          color: #ffffff;
          padding: 6rem 0 7rem 0;
          overflow: hidden;
        }

        .hero-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid var(--color-gold);
          color: #fef9e7;
          padding: 0.4rem 1.1rem;
          border-radius: var(--radius-full);
          font-size: 0.88rem;
          font-weight: 600;
          backdrop-filter: blur(8px);
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: 3.2rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          text-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .hero-title span {
          color: var(--color-gold);
        }

        .hero-description {
          font-size: 1.2rem;
          color: #e8f5e9;
          max-width: 680px;
          margin-bottom: 2.25rem;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 3.5rem;
        }

        .quick-services-bar {
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 1.75rem 2rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: var(--color-text-main);
          margin-top: 1rem;
        }

        .quick-services-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .quick-services-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-primary-dark);
        }

        .quick-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }

        .quick-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8faf8;
          border: 1px solid var(--color-border);
          border-radius: 14px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .quick-card:hover {
          background: var(--color-primary-soft);
          border-color: var(--color-primary);
          transform: translateY(-3px);
        }

        .quick-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }
          .hero-container {
            padding: 4rem 0 5rem 0;
          }
        }
      `}</style>

      <div className="container">
        <div className="hero-badge-pill">
          <Compass size={16} /> Website Resmi Desa Tajemsari • Kec. Tegowanu, Grobogan
        </div>

        <h1 className="hero-title">
          Harmoni Alam & <span>Kemajuan Desa Tajemsari</span>
        </h1>

        <p className="hero-description">
          Selamat datang di gapura digital Desa Tajemsari. Pusat transparansi informasi publik, layanan administrasi kependudukan cepat, serta promosi potensi UMKM & persawahan asri Tegowanu.
        </p>

        <div className="hero-actions">
          <button 
            id="hero-btn-layanan"
            className="btn btn-gold" 
            onClick={() => onNavigate('layanan')}
          >
            <FileText size={18} /> Pengajuan Surat Online
          </button>

          <button 
            id="hero-btn-potensi"
            className="btn btn-outline" 
            style={{ color: '#ffffff', borderColor: '#ffffff' }}
            onClick={() => onNavigate('potensi')}
          >
            <Compass size={18} /> Jelajahi UMKM & Wisata
          </button>
        </div>

        {/* Akses Cepat Layanan (Kependudukan, Surat, Kesehatan) */}
        <div className="quick-services-bar">
          <div className="quick-services-header">
            <div className="quick-services-title">Akses Cepat Layanan Administrasi & Informasi</div>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              Sistem Desain Rural Harmony
            </span>
          </div>

          <div className="quick-cards-grid">
            <div className="quick-card" onClick={() => onNavigate('layanan')}>
              <div className="quick-icon-box" style={{ background: 'linear-gradient(135deg, #2e7d32, #1b5e20)' }}>
                <Users size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
                  Kependudukan
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Pengantar KTP, KK & Pindah
                </span>
              </div>
            </div>

            <div className="quick-card" onClick={() => onNavigate('layanan')}>
              <div className="quick-icon-box" style={{ background: 'linear-gradient(135deg, #d4af37, #b89628)' }}>
                <FileText size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
                  Surat Keterangan
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  SKU, SKTM, & Surat Domisili
                </span>
              </div>
            </div>

            <div className="quick-card" onClick={() => onNavigate('layanan')}>
              <div className="quick-icon-box" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}>
                <HeartPulse size={22} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.95rem', color: 'var(--color-primary-dark)' }}>
                  Kesehatan & BLT
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Jadwal Posyandu & Bantuan
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
