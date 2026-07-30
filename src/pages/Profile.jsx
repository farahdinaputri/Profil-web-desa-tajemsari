import React from 'react';
import { History, Target, Users, PieChart, CheckCircle2, ShieldCheck, Landmark } from 'lucide-react';
import { STRUKTUR_ORGANISASI, APBDES_DATA } from '../data/mockData';

export default function Profile() {
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
            <h2 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)' }}>Sejarah Singkat Desa Tajemsari</h2>
          </div>
          <p style={{ lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '1rem', marginBottom: '1rem' }}>
            Nama <strong>Desa Tajemsari</strong> berasal dari gabungan kata <em>"Tajem"</em> yang bermakna tajam/tegas dalam memegang prinsip kebenaran, serta <em>"Sari"</em> yang berarti inti kebaikan dan keasrian alam. Terletak di dataran aluvial subur Kecamatan Tegowanu, Kabupaten Grobogan, Desa Tajemsari secara turun-temurun dikenal sebagai lumbung pangan padi dan pusat budidaya kerajinan tradisional.
          </p>
          <p style={{ lineHeight: '1.8', color: 'var(--color-text-main)', fontSize: '1rem' }}>
            Dengan hamparan persawahan seluas lebih dari 340 hektar dan sistem irigasi teknis yang terjaga, Tajemsari kini bertransformasi menjadi desa agrowisata mandiri yang memanfaatkan teknologi digital untuk pelayanan publik transparan.
          </p>
        </div>

        {/* Visi & Misi */}
        <div className="visi-misi-grid">
          <div className="visi-card">
            <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 700, display: 'block', marginBottom: '0.75rem' }}>
              Visi Pembangunan Desa
            </span>
            <h3 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '1rem', lineHeight: '1.3' }}>
              "Mewujudkan Desa Tajemsari yang Mandiri, Sejahtera, Transparan, dan Berorientasi Agrowisata Ramah Lingkungan."
            </h3>
            <p style={{ color: '#e8f5e9', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Fokus utama pada penguatan ketahanan pangan lokal, kemudahan administrasi warga via internet, serta pemberdayaan ekonomi UMKM Tajemsari.
            </p>
          </div>

          <div className="misi-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target color="var(--color-primary-dark)" size={24} />
              <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)' }}>Misi Utama Desa</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Meningkatkan kualitas pelayanan administrasi kependudukan cepat & berbasis digital.</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Mengembangkan infrastruktur jalan tani dan saluran irigasi persawahan Tegowanu.</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Mendukung pemasaran digital produk UMKM lokal Madu, Kopi, dan Kerajinan Bambu.</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.95rem' }}>
                <CheckCircle2 size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>Mewujudkan tata kelola keuangan desa (APBDes) yang terbuka dan transparan.</span>
              </li>
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
            {STRUKTUR_ORGANISASI.map((perangkat) => (
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

        {/* Transparansi APBDes */}
        <div className="apbdes-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
            <div>
              <span className="badge-gold">Tahun Anggaran {APBDES_DATA.tahun}</span>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary-dark)', marginTop: 6 }}>
                Transparansi APBDes Tajemsari
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Total Pendapatan Desa</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {APBDES_DATA.pendapatan}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {APBDES_DATA.rincian.map((item, idx) => (
              <div key={idx} style={{ background: '#f8faf8', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>
                  <span style={{ color: 'var(--color-primary-dark)' }}>{item.bidang}</span>
                  <span style={{ color: 'var(--color-gold)' }}>{item.persentase}%</span>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  Alokasi: {item.jumlah}
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${item.persentase}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
