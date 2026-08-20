import React, { useState, useEffect } from 'react';
import { History, Target, Users, CheckCircle2, Landmark, User, Quote, Sparkles, Shield, Award, Wheat, HeartHandshake } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function Profile() {
  const [profil, setProfil] = useState(() => apiService.getProfilCached());

  useEffect(() => {
    document.title = "Profil Desa Tajemsari - Sejarah, Visi Misi, Perangkat & Lembaga Desa";
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
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.75rem;
        }

        .org-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 1.15rem;
          text-align: center;
          border: 1.5px solid var(--color-border);
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .org-card:hover {
          transform: translateY(-6px);
          border-color: var(--color-gold);
          box-shadow: 0 16px 32px rgba(46, 125, 50, 0.12);
        }

        .org-avatar-wrap {
          width: 100%;
          aspect-ratio: 3 / 4;
          max-height: 310px;
          border-radius: 14px;
          overflow: hidden;
          background: linear-gradient(180deg, #f0fdf4 0%, #e2efe4 100%);
          border: 2px solid rgba(212, 175, 55, 0.4);
          position: relative;
          margin-bottom: 1.15rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .org-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.4s ease;
          display: block;
        }

        .org-card:hover .org-img {
          transform: scale(1.04);
        }

        .org-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-primary-dark);
          padding: 1.5rem;
          background: radial-gradient(circle at 50% 35%, #eefbf0 0%, #d8edd9 100%);
          gap: 0.75rem;
        }

        .org-placeholder-icon {
          width: 72px;
          height: 72px;
          border-radius: 16px;
          background: #ffffff;
          border: 2px solid rgba(212, 175, 55, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          box-shadow: 0 4px 14px rgba(46, 125, 50, 0.1);
        }

        .org-placeholder-label {
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--color-primary-dark);
          background: rgba(255, 255, 255, 0.85);
          padding: 0.25rem 0.65rem;
          border-radius: 12px;
          border: 1px solid rgba(46, 125, 50, 0.2);
        }

        .org-info-wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          justify-content: space-between;
          gap: 0.65rem;
        }

        .org-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          line-height: 1.3;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .org-role-badge {
          width: 100%;
          min-height: 42px;
          background: linear-gradient(135deg, #1b5e20 0%, #112a14 100%);
          color: #ffffff;
          border: 1px solid rgba(212, 175, 55, 0.5);
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.4px;
          padding: 0.45rem 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          line-height: 1.35;
          box-shadow: 0 2px 6px rgba(17, 42, 20, 0.15);
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
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem;
          }
          .lembaga-grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
          .lembaga-card {
            padding: 1.4rem !important;
          }
        }

        .lembaga-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .lembaga-card {
          padding: 1.75rem 1.6rem;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--color-border);
          box-shadow: 0 3px 14px rgba(0,0,0,0.03);
          transition: all 0.25s ease;
          display: flex;
          flex-direction: column;
        }

        .lembaga-card:hover {
          transform: translateY(-3px);
          border-color: var(--color-primary);
          box-shadow: 0 8px 22px rgba(46, 125, 50, 0.08);
        }

        .lembaga-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          line-height: 1.35;
          margin-bottom: 0.5rem;
        }

        .lembaga-ketua-info {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          color: var(--color-primary-dark);
          background: #f8faf8;
          border-left: 3px solid var(--color-gold);
          padding: 0.35rem 0.7rem;
          border-radius: 0 8px 8px 0;
          margin-bottom: 0.85rem;
          font-weight: 600;
        }

        .lembaga-desc {
          font-size: 0.92rem;
          color: var(--color-text-main);
          line-height: 1.65;
          margin: 0;
          flex: 1;
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
                    <img 
                      src={perangkat.foto} 
                      alt={perangkat.nama} 
                      className="org-img" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="org-placeholder">
                      <div className="org-placeholder-icon">
                        <User size={36} />
                      </div>
                      <span className="org-placeholder-label">Aparatur Desa</span>
                    </div>
                  )}
                </div>

                <div className="org-info-wrap">
                  <div className="org-name">
                    {perangkat.nama || '-'}
                  </div>
                  <div className="org-role-badge">
                    {perangkat.jabatan || '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Struktur Lembaga Desa */}
        <div style={{ marginTop: '5rem' }}>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">Struktur Lembaga Desa</h2>
            <p className="section-description">
              Lembaga Kemasyarakatan Desa (LKD) dan mitra strategis Pemerintah Desa Tajemsari dalam pembangunan dan kemasyarakatan.
            </p>
          </div>

          <div className="lembaga-grid">
            {(profil.lembagaList || []).map((lembaga) => (
              <div key={lembaga.id} className="profile-card lembaga-card">
                <h3 className="lembaga-title">
                  {lembaga.nama_lembaga || lembaga.nama}
                </h3>

                <div className="lembaga-ketua-info">
                  <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Ketua:</span>
                  <strong>{lembaga.ketua || '-'}</strong>
                </div>

                <p className="lembaga-desc">
                  {lembaga.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
