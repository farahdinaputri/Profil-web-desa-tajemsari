import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { Newspaper, ArrowRight, Calendar, User, Eye, Wheat, Users, Building, Sparkles } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function Home() {
  const navigate = useNavigate();
  const [beritaList, setBeritaList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    loadBerita();
  }, []);

  const loadBerita = async () => {
    const data = await apiService.getBerita();
    setBeritaList(data);
  };

  const categories = ['Semua', 'Ekonomi', 'Pertanian', 'Kesehatan'];

  const filteredBerita = activeCategory === 'Semua' 
    ? beritaList 
    : beritaList.filter(b => b.kategori === activeCategory);

  return (
    <div className="home-page animate-fade-in">
      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-top: -3.5rem;
          position: relative;
          z-index: 10;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid rgba(212, 175, 55, 0.4);
          box-shadow: 0 10px 25px rgba(0,0,0,0.06);
          transition: var(--transition-fast);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 35px rgba(46, 125, 50, 0.12);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          background: var(--color-primary-soft);
          color: var(--color-primary-dark);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem auto;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          line-height: 1;
          margin-bottom: 0.35rem;
        }

        .stat-label {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        .sambutan-card {
          background: linear-gradient(135deg, #ffffff 0%, #f4f9f4 100%);
          border-radius: 24px;
          padding: 3rem;
          border: 1px solid rgba(46, 125, 50, 0.2);
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2.5rem;
          align-items: center;
          box-shadow: var(--shadow-md);
        }

        .kades-img-wrap {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 4px solid #ffffff;
        }

        .kades-img {
          width: 100%;
          height: 320px;
          object-fit: cover;
          display: block;
        }

        .berita-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-normal);
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .berita-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
          border-color: rgba(212, 175, 55, 0.4);
        }

        .berita-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .berita-content {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        @media (max-width: 850px) {
          .sambutan-card {
            grid-template-columns: 1fr;
            padding: 2rem;
          }
          .kades-img {
            height: 260px;
          }
        }
      `}</style>

      {/* Hero Banner */}
      <HeroSection onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)} />

      {/* Live Statistics Counter */}
      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={26} />
            </div>
            <div className="stat-number">2.845</div>
            <div className="stat-label">Jiwa Penduduk</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef9e7', color: '#d4af37' }}>
              <Wheat size={26} />
            </div>
            <div className="stat-number">340 Ha</div>
            <div className="stat-label">Luas Persawahan Padi</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Building size={26} />
            </div>
            <div className="stat-number">4 RT / 2 RW</div>
            <div className="stat-label">Wilayah Dusun Tajemsari</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Sparkles size={26} />
            </div>
            <div className="stat-number">12 UMKM</div>
            <div className="stat-label">Produk Unggulan Desa</div>
          </div>
        </div>
      </div>

      {/* Sambutan Kepala Desa */}
      <section className="section-padding">
        <div className="container">
          <div className="sambutan-card">
            <div className="kades-img-wrap">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" 
                alt="Kepala Desa Tajemsari" 
                className="kades-img" 
              />
            </div>

            <div>
              <div className="section-subtitle">
                <Sparkles size={14} /> Sambutan Kepala Desa Tajemsari
              </div>
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--color-primary-dark)' }}>
                "Terwujudnya Desa Tajemsari Berdikari, Sejahtera & Asri"
              </h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: '1.7' }}>
                <em>Assalamu’alaikum Warahmatullahi Wabarakatuh.</em><br />
                Selamat datang warga dan tamu Desa Tajemsari, Kecamatan Tegowanu. Peluncuran website resmi ini merupakan wujud keterbukaan informasi publik serta komitmen kami dalam mempermudah layanan kependudukan secara modern tanpa meninggalkan keramahan khas pedesaan Grobogan.
              </p>
              <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>
                H. Suhartono, S.Sos
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Kepala Desa Tajemsari Tegowanu (Periode 2021 - 2027)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berita Terkini & Pengumuman Desa */}
      <section className="section-padding" style={{ background: '#ffffff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <Newspaper size={14} /> Informasi Kunci & Kegiatan
            </span>
            <h2 className="section-title">Berita & Kabar Desa Tajemsari</h2>
            <p className="section-description">
              Simak berita kegiatan pembangunan, penyaluran bantuan, kesehatan, dan perkembangan hasil panen terkini di Tegowanu.
            </p>

            {/* Category Filter */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.4rem 1.1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-border)',
                    background: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
                    color: activeCategory === cat ? '#ffffff' : 'var(--color-text-main)',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-3">
            {filteredBerita.map((item) => (
              <div 
                key={item.id} 
                className="berita-card"
                onClick={() => navigate(`/berita/${item.id}`)}
              >
                <img src={item.gambar} alt={item.judul} className="berita-img" />
                <div className="berita-content">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="badge-gold">{item.kategori}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} /> {item.tanggal}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', lineHeight: '1.35', color: 'var(--color-primary-dark)' }}>
                    {item.judul}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: 1.5 }}>
                    {item.ringkasan}
                  </p>

                  <button 
                    className="btn btn-outline"
                    style={{ width: '100%', padding: '0.55rem', fontSize: '0.85rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/berita/${item.id}`);
                    }}
                  >
                    <Eye size={16} /> Baca Selengkapnya <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
