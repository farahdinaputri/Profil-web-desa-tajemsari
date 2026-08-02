import React, { useState, useEffect } from 'react';
import { FileText, Users, HeartPulse, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function HeroSection({ onNavigate }) {
  const [hero, setHero] = useState({
    badge: "Website Resmi Desa Tajemsari • Kec. Tegowanu",
    judul: "Selamat Datang di Portal Resmi Desa Tajemsari",
    deskripsi: "Desa Tajemsari merupakan desa paling barat di Kecamatan Tegowanu, Kabupaten Grobogan, Jawa Tengah. Wilayah desa ini terdiri dari 4 dusun: Kendalsari, Mlangi, Plosorejo, dan Tajem.",
    bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80",
    ctaPrimary: "Pengajuan Surat Online",
    ctaSecondary: "Jelajahi Potensi Desa"
  });

  useEffect(() => {
    apiService.getHero().then(data => {
      if (data) setHero(data);
    });
  }, []);

  return (
    <div className="hero-container" style={{
      backgroundImage: `linear-gradient(180deg, rgba(15, 42, 18, 0.75) 0%, rgba(27, 94, 32, 0.88) 100%), url('${hero.bgImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80'}')`
    }}>
      <style>{`
        .hero-container {
          position: relative;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
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
          font-size: 1.18rem;
          color: #e8f5e9;
          max-width: 720px;
          margin-bottom: 2.25rem;
          line-height: 1.65;
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
            font-size: 1.95rem;
          }
          .hero-description {
            font-size: 0.98rem;
            margin-bottom: 1.75rem;
          }
          .hero-container {
            padding: 3rem 0 4rem 0;
          }
          .hero-actions {
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 2.5rem;
          }
          .hero-actions .btn {
            width: 100%;
            justify-content: center;
          }
          .quick-services-bar {
            padding: 1.25rem 1rem;
          }
          .quick-services-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
          }
        }
      `}</style>

      <div className="container">
        <h1 className="hero-title">
          {hero.judul}
        </h1>

        <p className="hero-description">
          {hero.deskripsi}
        </p>

        <div className="hero-actions">
          <button 
            id="hero-btn-layanan"
            className="btn btn-gold" 
            onClick={() => onNavigate(hero.ctaPrimaryLink || 'layanan')}
          >
            <FileText size={18} /> {hero.ctaPrimary || 'Pengajuan Surat Online'}
          </button>

          <button 
            id="hero-btn-potensi"
            className="btn btn-outline" 
            style={{ color: '#ffffff', borderColor: '#ffffff' }}
            onClick={() => onNavigate(hero.ctaSecondaryLink || 'potensi')}
          >
            <Compass size={18} /> {hero.ctaSecondary || 'Jelajahi Potensi Desa'}
          </button>
        </div>

        {/* Quick Access Floating Bar */}
        <div className="quick-services-bar">
          <div className="quick-services-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.05rem' }}>
              <ShieldCheck size={20} color="var(--color-primary)" /> {hero.quickTitle || 'Akses Cepat Pelayanan Publik Tajemsari'}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {hero.quickSubtitle || 'Kec. Tegowanu • Kab. Grobogan'}
            </span>
          </div>

          <div className="quick-cards-grid">
            <div className="quick-card" onClick={() => onNavigate(hero.quickCard1Link || 'layanan')}>
              <div className="quick-icon-box" style={{ background: 'var(--color-primary)' }}>
                <FileText size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: 2 }}>{hero.quickCard1Title || 'Surat Keterangan Usaha'}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{hero.quickCard1Desc || 'SKU & Legalitas UMKM'}</span>
              </div>
            </div>

            <div className="quick-card" onClick={() => onNavigate(hero.quickCard2Link || 'layanan')}>
              <div className="quick-icon-box" style={{ background: 'var(--color-gold)' }}>
                <Users size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: 2 }}>{hero.quickCard2Title || 'Surat SKTM & KIS'}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{hero.quickCard2Desc || 'Bantuan Beasiswa & KIS'}</span>
              </div>
            </div>

            <div className="quick-card" onClick={() => onNavigate(hero.quickCard3Link || 'potensi')}>
              <div className="quick-icon-box" style={{ background: 'var(--color-primary-dark)' }}>
                <HeartPulse size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', marginBottom: 2 }}>{hero.quickCard3Title || 'Potensi & Wisata Desa'}</h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{hero.quickCard3Desc || 'Pertanian & Olahan Madu'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
