import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { Newspaper, ArrowRight, Calendar, Eye, Wheat, Users, Building, Sparkles, ChevronRight, ShoppingBag, PhoneCall } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function Home() {
  const navigate = useNavigate();
  const [beritaList, setBeritaList] = useState([]);
  const [umkmList, setUmkmList] = useState([]);
  const [heroData, setHeroData] = useState({});
  const [statistikList, setStatistikList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    const beritaData = await apiService.getBerita();
    const umkmData = await apiService.getUMKM();
    const hData = await apiService.getHero();
    const sData = await apiService.getStatistik();
    setBeritaList(beritaData || []);
    setUmkmList(umkmData || []);
    if (hData) setHeroData(hData);
    setStatistikList(sData || []);
  };

  const getStatIcon = (iconName) => {
    switch (iconName) {
      case 'Wheat': return <Wheat size={26} />;
      case 'Building': return <Building size={26} />;
      case 'Sparkles': return <Sparkles size={26} />;
      default: return <Users size={26} />;
    }
  };

  const categories = ['Semua', 'Ekonomi', 'Pertanian', 'Kesehatan'];

  const filteredBerita = activeCategory === 'Semua' 
    ? beritaList 
    : beritaList.filter(b => b.kategori === activeCategory);

  // Home page displays up to 3 items
  const homeBeritaList = filteredBerita.slice(0, 3);
  const homeUmkmList = umkmList.slice(0, 3);

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

        @media (max-width: 768px) {
          .stats-grid {
            display: flex !important;
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
            gap: 1rem;
            margin-top: -2.5rem;
            padding: 0.5rem 0.25rem 1rem 0.25rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .stats-grid::-webkit-scrollbar {
            display: none;
          }
          .stat-card {
            flex: 0 0 80% !important;
            min-width: 240px !important;
            max-width: 280px !important;
            scroll-snap-align: start;
            box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          }
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

        .berita-card, .product-card-home {
          background: #ffffff;
          border-radius: 18px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-normal);
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .berita-card:hover, .product-card-home:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
          border-color: rgba(212, 175, 55, 0.4);
        }

        .berita-img, .product-img-home {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .berita-content, .product-body-home {
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

      {/* Live Statistics Counter (Dynamic CRUD Grid) */}
      <div className="container">
        <div className="stats-grid">
          {statistikList.map((stat) => (
            <div key={stat.id} className="stat-card">
              <div className="stat-icon" style={{ background: stat.colorBg || 'var(--color-primary-soft)', color: stat.colorText || 'var(--color-primary-dark)' }}>
                {getStatIcon(stat.icon)}
              </div>
              <div className="stat-number">{stat.angka}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sambutan Kepala Desa */}
      <section className="section-padding">
        <div className="container">
          <div className="sambutan-card">
            <div className="kades-img-wrap">
              <img 
                src={heroData.kadesFoto || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80"} 
                alt={heroData.kadesNama || "Kepala Desa Tajemsari"} 
                className="kades-img" 
              />
            </div>

            <div>
              <div className="section-subtitle">
                <Sparkles size={14} /> {heroData.kadesBadge || 'Sambutan Kepala Desa Tajemsari'}
              </div>
              <h2 style={{ fontSize: '1.85rem', marginBottom: '1rem', color: 'var(--color-primary-dark)', lineHeight: '1.3' }}>
                {heroData.kadesJudul || '"Terwujudnya Desa Tajemsari Berdikari, Sejahtera & Asri"'}
              </h2>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {heroData.kadesSambutan || `Assalamu’alaikum Warahmatullahi Wabarakatuh.\nSelamat datang warga dan tamu Desa Tajemsari, Kecamatan Tegowanu. Peluncuran website resmi ini merupakan wujud keterbukaan informasi publik serta komitmen kami dalam mempermudah layanan kependudukan secara modern tanpa meninggalkan keramahan khas pedesaan Grobogan.`}
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>
                {heroData.kadesNama || 'H. Suhartono, S.Sos'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {heroData.kadesJabatan || 'Kepala Desa Tajemsari Tegowanu'} ({heroData.kadesPeriode || 'Periode 2021 - 2027'})
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berita Terkini Section */}
      <section className="section-padding" style={{ background: '#ffffff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <Newspaper size={14} /> Informasi Kunci & Kegiatan
            </span>
            <h2 className="section-title">Berita Terkini Desa Tajemsari</h2>
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

          <div className={`grid-3 ${homeBeritaList.length === 1 ? 'has-single-item' : ''}`} style={{ marginBottom: '2.5rem' }}>
            {homeBeritaList.map((item) => (
              <div 
                key={item.id} 
                className="berita-card"
                onClick={() => navigate(`/berita/${item.slug || item.id}`)}
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
                      navigate(`/berita/${item.slug || item.id}`);
                    }}
                  >
                    <Eye size={16} /> Baca Selengkapnya <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Button "Lihat Berita Lainnya" -> /berita */}
          <div style={{ textAlign: 'center' }}>
            <button 
              id="home-all-news-btn"
              className="btn btn-gold" 
              style={{ padding: '0.85rem 2.2rem', fontSize: '0.95rem', borderRadius: '30px' }}
              onClick={() => navigate('/berita')}
            >
              <Newspaper size={18} /> Lihat Berita Lainnya <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Produk Unggulan UMKM Section */}
      <section className="section-padding" style={{ background: '#f8faf8', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">
              <ShoppingBag size={14} /> Produk Lokal & Usaha Warga
            </span>
            <h2 className="section-title">Produk Unggulan UMKM Tajemsari</h2>
            <p className="section-description">
              Dukung produk lokal berkualitas karya warga Desa Tajemsari, dari olahan madu murni hingga beras organik dan kerajinan bambu.
            </p>
          </div>

          <div className={`grid-3 ${homeUmkmList.length === 1 ? 'has-single-item' : ''}`} style={{ marginBottom: '2.5rem' }}>
            {homeUmkmList.map((item) => (
              <div key={item.id} className="product-card-home" onClick={() => navigate('/potensi')}>
                <img src={item.gambar} alt={item.nama_produk} className="product-img-home" />
                <div className="product-body-home">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge-gold">{item.kategori}</span>
                    <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>
                      {item.harga}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                    {item.nama_produk}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Produsen: <strong>{item.pembuat}</strong>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
                    {item.deskripsi}
                  </p>

                  <a 
                    href={`https://wa.me/${item.wa_seller}?text=Halo%20${encodeURIComponent(item.pembuat)},%20saya%20tertarik%20membeli%20produk%20${encodeURIComponent(item.nama_produk)}%20dari%20website%20Desa%20Tajemsari.`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PhoneCall size={16} /> Beli via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Button "Lihat UMKM Lainnya" -> /potensi */}
          <div style={{ textAlign: 'center' }}>
            <button 
              id="home-all-umkm-btn"
              className="btn btn-gold" 
              style={{ padding: '0.85rem 2.2rem', fontSize: '0.95rem', borderRadius: '30px' }}
              onClick={() => navigate('/potensi')}
            >
              <ShoppingBag size={18} /> Lihat UMKM Lainnya <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
