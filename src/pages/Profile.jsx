import React, { useState, useEffect } from 'react';
import { History, Target, Users, CheckCircle2, Landmark, User, Quote, Sparkles } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function Profile() {
  const [profil, setProfil] = useState(() => apiService.getProfilCached());

  useEffect(() => {
    apiService.getProfil().then(data => {
      if (data) setProfil(data);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="profile-page section-padding animate-fade-in" style={{ background: '#f8faf8', minHeight: '85vh' }}>
      <style>{`
        .profile-header {
          text-align: center;
          max-width: 780px;
          margin: 0 auto 3.5rem auto;
        }

        .profile-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          transition: var(--transition-normal);
        }

        .sejarah-card {
          padding: 3rem;
          margin-bottom: 3rem;
        }

        .sejarah-quote-box {
          background: #fef9e7;
          border-left: 4px solid var(--color-gold);
          border-radius: 0 14px 14px 0;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .sejarah-text {
          font-size: 1rem;
          line-height: 1.85;
          color: var(--color-text-main);
          margin-bottom: 1.25rem;
          white-space: pre-line;
        }

        .sejarah-text:last-child {
          margin-bottom: 0;
        }

        .visi-misi-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .visi-card {
          background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
          color: #ffffff;
          border-radius: 20px;
          padding: 2.75rem 2.5rem;
          box-shadow: 0 8px 25px rgba(27, 94, 32, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .visi-tag {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #fef08a;
          font-weight: 700;
          display: block;
          margin-bottom: 1rem;
        }

        .visi-title {
          font-size: 1.55rem;
          color: #ffffff;
          line-height: 1.4;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .visi-desc {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          color: #e8f5e9;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        .misi-card {
          padding: 2.75rem 2.5rem;
          display: flex;
          flex-direction: column;
        }

        .misi-tag {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--color-primary);
          font-weight: 700;
          display: block;
          margin-bottom: 0.5rem;
        }

        .misi-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
        }

        .misi-item {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          font-size: 0.95rem;
          color: var(--color-text-main);
          line-height: 1.6;
        }

        .org-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.5rem;
        }

        .org-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 2rem 1.25rem;
          text-align: center;
          border: 1px solid var(--color-border);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          transition: all 0.25s ease;
        }

        .org-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-gold);
          box-shadow: 0 10px 25px rgba(46, 125, 50, 0.1);
        }

        .org-avatar-wrap {
          margin-bottom: 1.25rem;
        }

        .org-img {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto;
          border: 3px solid var(--color-gold);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
          display: block;
        }

        .org-placeholder {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: var(--color-primary-soft);
          color: var(--color-primary-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 3px solid var(--color-border);
        }

        .org-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin-bottom: 0.4rem;
        }

        @media (max-width: 850px) {
          .visi-misi-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
          }
          .sejarah-card {
            padding: 1.75rem 1.5rem;
            margin-bottom: 2rem;
          }
          .visi-card, .misi-card {
            padding: 2rem 1.5rem;
          }
          .profile-header {
            margin-bottom: 2.5rem;
          }
          .org-grid {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>

      <div className="container">
        {/* Header Profil Desa */}
        <div className="profile-header">
          <h1 className="section-title">Profil Desa Tajemsari</h1>
          <p className="section-description">
            Sejarah, Visi Misi Pembangunan, dan Struktur Organisasi Pemerintah Desa Tajemsari, Kecamatan Tegowanu, Kabupaten Grobogan.
          </p>
        </div>

        {/* Sejarah Desa Card */}
        <div className="profile-card sejarah-card">
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', fontWeight: 700, marginBottom: '1.5rem' }}>
            {profil.sejarahJudul || 'Sejarah Singkat Desa Tajemsari'}
          </h2>

          <div className="sejarah-quote-box">
            <Quote size={22} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.92rem', display: 'block', marginBottom: 2 }}>
                Filosofi Nama Tajemsari
              </strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Berasal dari kata <strong>"Tajem"</strong> (tegas memegang prinsip kebenaran) serta <strong>"Sari"</strong> (keasrian alam dan inti kebaikan).
              </span>
            </div>
          </div>

          <p className="sejarah-text">
            {profil.sejarahParagraf1}
          </p>
          {profil.sejarahParagraf2 && (
            <p className="sejarah-text">
              {profil.sejarahParagraf2}
            </p>
          )}
        </div>

        {/* Visi & Misi Grid */}
        <div className="visi-misi-grid">
          <div className="visi-card">
            <div>
              <span className="visi-tag">Visi Desa</span>
              <div className="visi-title">
                {profil.visiJudul || '"Mewujudkan Desa Tajemsari yang Mandiri, Sejahtera, Transparan, dan Berorientasi Agrowisata Ramah Lingkungan."'}
              </div>
            </div>

            <div className="visi-desc">
              <strong style={{ display: 'block', color: '#ffffff', marginBottom: 3, fontSize: '0.82rem' }}>
                Fokus Utama:
              </strong>
              {profil.visiDeskripsi || 'Fokus utama pada penguatan ketahanan pangan lokal, kemudahan administrasi warga, serta pemberdayaan ekonomi UMKM Tajemsari.'}
            </div>
          </div>

          <div className="profile-card misi-card">
            <div>
              <span className="misi-tag">Misi Pembangunan</span>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                Prioritas & Fokus Kerja
              </h3>
            </div>

            <ul className="misi-list">
              {(profil.misiList || []).map((misiItem, idx) => (
                <li key={idx} className="misi-item">
                  <CheckCircle2 size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 3 }} />
                  <span>{misiItem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Struktur Pemerintahan Desa */}
        <div>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">Struktur Pemerintah Desa</h2>
            <p className="section-description">
              Jajaran aparatur Pemerintah Desa Tajemsari, Kecamatan Tegowanu, Kabupaten Grobogan.
            </p>
          </div>

          <div className="org-grid">
            {(profil.perangkatList || []).map((perangkat) => (
              <div key={perangkat.id} className="org-card">
                <div className="org-avatar-wrap">
                  {perangkat.foto ? (
                    <img src={perangkat.foto} alt={perangkat.nama} className="org-img" />
                  ) : (
                    <div className="org-placeholder">
                      <User size={42} />
                    </div>
                  )}
                </div>

                <div className="org-name">
                  {perangkat.nama}
                </div>
                <div className="badge-gold" style={{ display: 'inline-block', marginTop: 4 }}>
                  {perangkat.jabatan}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
