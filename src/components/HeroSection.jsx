import React, { useState, useEffect } from 'react';
import { Globe, Compass } from 'lucide-react';
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

        .btn-hero-primary {
          background: linear-gradient(135deg, #d4af37 0%, #b89628 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 4px 18px rgba(212, 175, 55, 0.45);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .btn-hero-primary:hover {
          filter: brightness(1.12);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.6);
        }

        .btn-hero-secondary {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: #ffffff !important;
          border: 1.5px solid rgba(255, 255, 255, 0.5) !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }

        .btn-hero-secondary:hover {
          background: rgba(255, 255, 255, 0.24) !important;
          border-color: rgba(255, 255, 255, 0.95) !important;
          color: #ffffff !important;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
        }

        .btn-hero-secondary:active, .btn-hero-primary:active {
          transform: translateY(-1px);
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
            id="hero-btn-profil"
            className="btn btn-hero-primary" 
            onClick={() => onNavigate(hero.ctaPrimaryLink || 'profil')}
          >
            <Globe size={18} /> {hero.ctaPrimary || 'Profil Desa Tajemsari'}
          </button>

          <button 
            id="hero-btn-potensi"
            className="btn btn-hero-secondary" 
            onClick={() => onNavigate(hero.ctaSecondaryLink || 'potensi')}
          >
            <Compass size={18} /> {hero.ctaSecondary || 'Jelajahi Potensi Desa'}
          </button>
        </div>
      </div>
    </div>
  );
}
