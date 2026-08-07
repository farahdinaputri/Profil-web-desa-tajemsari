import React, { useState, useEffect } from 'react';
import { FileText, Compass } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function HeroSection({ onNavigate }) {
  const [hero, setHero] = useState(() => apiService.getHeroCached());

  useEffect(() => {
    apiService.getHero().then(data => {
      if (data) setHero(data);
    });
  }, []);

  const heroBgStyle = hero.bgImage 
    ? `linear-gradient(180deg, rgba(15, 42, 18, 0.75) 0%, rgba(27, 94, 32, 0.88) 100%), url('${hero.bgImage}')`
    : `linear-gradient(135deg, #1b5e20 0%, #0f2a12 100%)`;

  return (
    <div className="hero-container" style={{
      backgroundImage: heroBgStyle
    }}>
      <style>{`
        .hero-container {
          position: relative;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          color: #ffffff;
          padding: 6.5rem 0 6.5rem 0;
          overflow: hidden;
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
          max-width: 760px;
          margin-bottom: 2.25rem;
          line-height: 1.65;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 0;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.05rem;
          }
          .hero-description {
            font-size: 1rem;
            margin-bottom: 1.75rem;
          }
          .hero-container {
            padding: 4rem 0 4.5rem 0;
          }
          .hero-actions {
            flex-direction: column;
            gap: 0.75rem;
          }
          .hero-actions .btn {
            width: 100%;
            justify-content: center;
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
      </div>
    </div>
  );
}
