import React, { useState, useEffect } from 'react';
import { History, Target, Users, CheckCircle2, Landmark } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';
import { INITIAL_PROFIL } from '../data/mockData';

export default function Profile() {
  const [profil, setProfil] = useState(INITIAL_PROFIL);

  useEffect(() => {
    apiService.getProfil().then(data => {
      if (data) setProfil(data);
    });
  }, []);
  return (
    <div className="profile-page animate-fade-in section-padding">
      <style>{`
        .profile-hero {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem auto;
        }

        .timeline-box {
          background: #ffffff;
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          margin-bottom: 4rem;
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
          padding: 2.5rem;
          box-shadow: var(--shadow-md);
        }

        .misi-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2.5rem;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .org-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-fast);
        }

        .org-card:hover {
          transform: translateY(-4px);
          border-color: var(--color-gold);
          box-shadow: var(--shadow-md);
        }

        .org-img {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 1rem auto;
          border: 3px solid var(--color-gold);
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .apbdes-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2.5rem;
          border: 2px solid var(--color-gold);
          box-shadow: var(--shadow-md);
        }

        .progress-bar-bg {
          height: 12px;
          background: #e2e8f0;
          border-radius: 10px;
          overflow: hidden;
          margin-top: 0.4rem;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-gold) 100%);
        }

        @media (max-width: 768px) {
          .visi-misi-grid {
            grid-template-columns: 1fr;
            margin-bottom: 2.5rem;
          }
          .profile-hero {
            margin-bottom: 2.5rem;
          }
          .timeline-box, .visi-card, .misi-card, .apbdes-card {
            padding: 1.5rem;
            margin-bottom: 2.5rem;
          }
        }
      `}</style>

      <div className="container">
        {/* Page Header */}
        <div className="profile-hero">
          <span className="section-subtitle">
            <Landmark size={14} /> Keterbukaan Informasi Publik
          </span>
          <h1 className="section-title">Profil & Transparansi Desa Tajemsari</h1>
          <p className="section-description">
            Mengenal Sejarah, Visi Misi Pembangunan, Struktur Organisasi Perangkat Desa, serta Akuntabilitas Anggaran Desa Tajemsari Tegowanu Grobogan.
          </p>
        </div>

        {/* Sejarah Desa */}
        <div className="timeline-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ background: 'var(--color-primary-soft)', padding: '0.6rem', borderRadius: '12px', color: 'var(--color-primary-dark)' }}>
              <History size={24} />
            </div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)' }}>{profil.sejarahJudul || 'Sejarah Singkat Desa Tajemsari'}</h2>
          </div>
          <p style={{ lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '1rem', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
            {profil.sejarahParagraf1}
          </p>
          {profil.sejarahParagraf2 && (
            <p style={{ lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '1rem', whiteSpace: 'pre-line' }}>
              {profil.sejarahParagraf2}
            </p>
          )}
        </div>

        {/* Visi & Misi */}
        <div className="visi-misi-grid">
          <div className="visi-card">
            <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
              Visi Pembangunan Desa
            </span>
            <h3 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '1rem', lineHeight: '1.3' }}>
              {profil.visiJudul || '"Mewujudkan Desa Tajemsari yang Mandiri, Sejahtera, Transparan, dan Berorientasi Agrowisata Ramah Lingkungan."'}
            </h3>
            <p style={{ color: '#e8f5e9', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {profil.visiDeskripsi || 'Fokus utama pada penguatan ketahanan pangan lokal, kemudahan administrasi warga via internet, serta pemberdayaan ekonomi UMKM Tajemsari.'}
            </p>
          </div>

          <div className="misi-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target color="var(--color-primary-dark)" size={24} />
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)' }}>Misi Utama Desa</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {(profil.misiList || []).map((misiItem, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}>
                  <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{misiItem}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Struktur Organisasi Perangkat Desa */}
        <div style={{ marginBottom: '4rem' }}>
          <div className="section-header">
            <span className="section-subtitle">
              <Users size={14} /> Pelayan Masyarakat
            </span>
            <h2 className="section-title">Struktur Organisasi Perangkat Desa</h2>
            <p className="section-description">
              Jajaran aparatur Pemerintah Desa Tajemsari yang siap melayani kebutuhan warga Tegowanu Grobogan.
            </p>
          </div>

          <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {(profil.perangkatList || []).map((perangkat) => (
              <div key={perangkat.id} className="org-card">
                <img src={perangkat.foto} alt={perangkat.nama} className="org-img" />
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>
                  {perangkat.nama}
                </h4>
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
