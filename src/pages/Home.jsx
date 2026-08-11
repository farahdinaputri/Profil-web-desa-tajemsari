import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { Newspaper, ArrowRight, Calendar, Eye, Wheat, Users, Building, Sparkles, ChevronRight, ShoppingBag, PhoneCall } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';
import { getUmkmWaLink } from '../utils/whatsapp';

export default function Home() {
  const navigate = useNavigate();
  const [beritaList, setBeritaList] = useState([]);
  const [umkmList, setUmkmList] = useState([]);
  const [heroData, setHeroData] = useState(() => apiService.getHeroCached());
  const [statistikList, setStatistikList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    const [beritaData, umkmData, hData, sData] = await Promise.all([
      apiService.getBerita(),
      apiService.getUMKM(),
      apiService.getHero(),
      apiService.getStatistik()
    ]);
    setBeritaList(beritaData || []);
    setUmkmList(umkmData || []);
    if (hData) setHeroData(hData);
    setStatistikList(sData || []);
  };

  const countTotalUmkmProducts = (list) => {
    if (!Array.isArray(list)) return 0;
    return list.reduce((total, item) => {
      if (Array.isArray(item.produk_list) && item.produk_list.length > 0) {
        return total + item.produk_list.length;
      }
      if (Array.isArray(item.galeri) && item.galeri.length > 0) {
        return total + item.galeri.length;
      }
      return total + 1;
    }, 0);
  };

  const getDisplayStatAngka = (stat) => {
    const isUmkm = stat.icon === 'Sparkles' || 
      (stat.label && stat.label.toLowerCase().includes('umkm')) || 
      (stat.label && stat.label.toLowerCase().includes('produk')) ||
      (stat.angka && typeof stat.angka === 'string' && stat.angka.toLowerCase().includes('umkm'));
    if (isUmkm) {
      const totalProducts = countTotalUmkmProducts(umkmList);
      return `${totalProducts} UMKM`;
    }
    return stat.angka;
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
            scroll-behavior: smooth;
            scroll-padding-inline: calc(50vw - 140px);
            gap: 1.25rem;
            margin-top: -2.5rem;
            padding: 0.75rem calc(50vw - 140px) 1.5rem calc(50vw - 140px);
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .stats-grid::-webkit-scrollbar {
            display: none;
          }
          .stat-card {
            flex: 0 0 280px !important;
            width: 280px !important;
            max-width: 280px !important;
            scroll-snap-align: center;
            scroll-snap-stop: always;
            box-shadow: 0 12px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
          }
        }

        .stat-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 1.6rem 1.25rem;
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

        /* Segmented Category Filter Bar */
        .category-filter-wrap {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
          width: 100%;
          overflow-x: auto;
          padding: 4px 0;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .category-filter-wrap::-webkit-scrollbar {
          display: none;
        }

        .category-segmented-bar {
          display: inline-flex;
          align-items: center;
          background: #f1f5f9;
          padding: 4px;
          border-radius: 30px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
          max-width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          gap: 2px;
          flex-wrap: nowrap;
        }

        .category-segmented-bar::-webkit-scrollbar {
          display: none;
        }

        .category-segmented-btn {
          border: none;
          background: transparent;
          color: var(--color-text-muted);
          padding: 0.45rem 1.15rem;
          border-radius: 24px;
          font-size: 0.86rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .category-segmented-btn:hover:not(.active) {
          color: var(--color-primary-dark);
          background: rgba(255, 255, 255, 0.6);
        }

        .category-segmented-btn.active {
          background: var(--color-primary);
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(46, 125, 50, 0.28);
        }

        .berita-content, .product-body-home {
          padding: 1.35rem 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .umkm-card-actions {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 0.5rem;
          margin-top: auto;
          align-items: stretch;
        }

        .umkm-card-actions .btn {
          padding: 0.65rem 0.35rem !important;
          font-size: 0.82rem !important;
          white-space: nowrap !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 5px !important;
          border-radius: 12px !important;
          text-decoration: none !important;
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
              <div className="stat-number">{getDisplayStatAngka(stat)}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sambutan Kepala Desa */}
      <section className="section-padding">
        <div className="container">
          <div className="sambutan-card">
            {heroData.kadesFoto ? (
              <div className="kades-img-wrap">
                <img 
                  src={heroData.kadesFoto} 
                  alt={heroData.kadesNama || "Kepala Desa Tajemsari"} 
                  className="kades-img" 
                />
              </div>
            ) : null}

            <div>
              <h2 style={{ fontSize: '1.85rem', marginBottom: '1rem', color: 'var(--color-primary-dark)', lineHeight: '1.3' }}>
                {heroData.kadesJudul || '"Terwujudnya Desa Tajemsari Berdikari, Sejahtera & Asri"'}
              </h2>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {heroData.kadesSambutan || `Assalamu’alaikum Warahmatullahi Wabarakatuh.\nSelamat datang di website resmi Desa Tajemsari, Kecamatan Tegowanu, Kabupaten Grobogan. Website ini kami hadirkan sebagai media komunikasi dan informasi bagi seluruh masyarakat.`}
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>
                {heroData.kadesNama || 'H. Suhartono, S.Sos'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {heroData.kadesJabatan || 'Kepala Desa Tajemsari'} ({heroData.kadesPeriode || 'Periode 2021 - 2027'})
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Berita Terkini Section */}
      <section className="section-padding" style={{ background: '#ffffff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Berita Terkini Desa Tajemsari</h2>
            <p className="section-description">
              Informasi seputar pembangunan, pertanian, dan kegiatan kemasyarakatan di Desa Tajemsari.
            </p>

            {/* Category Filter - Segmented Straight Bar */}
            <div className="category-filter-wrap">
              <div className="category-segmented-bar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-segmented-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`grid-3 ${homeBeritaList.length === 1 ? 'has-single-item' : ''}`} style={{ marginBottom: '2.5rem' }}>
            {homeBeritaList.map((item) => (
              <div 
                key={item.id} 
                className="berita-card"
                onClick={() => navigate(`/berita/${item.slug || item.id}`)}
              >
                {item.gambar ? (
                  <img src={item.gambar} alt={item.judul} className="berita-img" />
                ) : (
                  <div style={{ width: '100%', height: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: '#d4af37' }}>
                    <Newspaper size={48} />
                    <span style={{ fontSize: '0.78rem', color: '#ffffff', marginTop: 6, opacity: 0.9 }}>Dokumentasi Berita</span>
                  </div>
                )}
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
            <h2 className="section-title">Produk Unggulan Warga</h2>
            <p className="section-description">
              Dukung perekonomian warga dengan berbelanja produk asli hasil olahan dan kerajinan Desa Tajemsari.
            </p>
          </div>

          <div className={`grid-3 ${homeUmkmList.length === 1 ? 'has-single-item' : ''}`} style={{ marginBottom: '2.5rem' }}>
            {homeUmkmList.map((item) => {
              const count = Array.isArray(item.produk_list) ? item.produk_list.length : (Array.isArray(item.galeri) ? item.galeri.length : 1);
              return (
                <div key={item.id} className="product-card-home" onClick={() => navigate('/potensi')} style={{ cursor: 'pointer' }}>
                  <div style={{ position: 'relative', width: '100%', height: 210, overflow: 'hidden', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)' }}>
                    {item.gambar ? (
                      <img 
                        src={item.gambar} 
                        alt={item.nama_produk} 
                        className="product-img-home" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#d4af37' }}>
                        <ShoppingBag size={42} />
                        <span style={{ fontSize: '0.78rem', color: '#ffffff', marginTop: 6, opacity: 0.9 }}>Produk UMKM</span>
                      </div>
                    )}
                    <span className="badge-gold" style={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
                      {item.kategori}
                    </span>
                    {count > 1 && (
                      <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(17,42,20,0.85)', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: 14, fontSize: '0.72rem', fontWeight: 700, backdropFilter: 'blur(4px)', border: '1px solid rgba(212,175,55,0.4)', zIndex: 2 }}>
                        📦 {count} Produk
                      </span>
                    )}
                  </div>
                  <div className="product-body-home">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        Pemilik: <strong>{item.pembuat}</strong>
                      </span>
                      <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>
                        {item.harga}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                      {item.nama_produk}
                    </h3>

                    <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
                      {item.deskripsi}
                    </p>

                    <div className="umkm-card-actions">
                      <a 
                        href={getUmkmWaLink(item)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        onClick={(e) => e.stopPropagation()}
                        title={`Beli ${item.nama_produk} via WhatsApp`}
                      >
                        <PhoneCall size={14} /> Pesan WA
                      </a>

                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/potensi');
                        }}
                      >
                        <ShoppingBag size={14} /> Katalog
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
