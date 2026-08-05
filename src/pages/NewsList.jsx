import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Search, Calendar, User, Eye, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function NewsList() {
  const navigate = useNavigate();
  const [beritaList, setBeritaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    loadAllBerita();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadAllBerita = async () => {
    setLoading(true);
    const data = await apiService.getBerita();
    setBeritaList(data || []);
    setLoading(false);
  };

  const categories = ['Semua', 'Pembangunan', 'Ekonomi', 'Pertanian', 'Kesehatan'];

  const filteredBerita = beritaList.filter((b) => {
    const matchesCategory = activeCategory === 'Semua' || b.kategori === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      b.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.ringkasan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.isi.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="news-list-page section-padding animate-fade-in" style={{ background: '#f8faf8', minHeight: '80vh' }}>
      <style>{`
        .news-header-banner {
          text-align: center;
          max-width: 760px;
          margin: 0 auto 3rem auto;
        }

        .search-filter-box {
          background: #ffffff;
          border-radius: 20px;
          padding: 1.5rem 2rem;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          margin-bottom: 3rem;
        }

        .search-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .search-input-icon {
          position: absolute;
          left: 16px;
          color: var(--color-primary);
        }

        .search-input-field {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 3rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          font-size: 1rem;
          font-family: var(--font-body);
          transition: var(--transition-fast);
        }

        .search-input-field:focus {
          border-color: var(--color-primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.15);
        }

        .category-pills-row {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .cat-pill-btn {
          padding: 0.45rem 1.1rem;
          border-radius: 20px;
          font-size: 0.88rem;
          font-weight: 600;
          border: 1px solid var(--color-border);
          background: #ffffff;
          color: var(--color-text-main);
          transition: var(--transition-fast);
          cursor: pointer;
        }

        .cat-pill-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .cat-pill-btn.active {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }

        .news-card-item {
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

        .news-card-item:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
          border-color: rgba(212, 175, 55, 0.5);
        }

        .news-card-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }

        .news-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
      `}</style>

      <div className="container">
        {/* Banner Header */}
        <div className="news-header-banner">
          <span className="section-subtitle">
            <Newspaper size={14} /> Informasi Kunci & Kegiatan Tegowanu
          </span>
          <h1 className="section-title">Semua Berita & Kabar Desa Tajemsari</h1>
          <p className="section-description">
            Arsip lengkap berita kegiatan pembangunan, penyaluran bantuan sosial, informasi pertanian, dan agenda masyarakat Desa Tajemsari.
          </p>
        </div>

        {/* Search & Category Filter Box */}
        <div className="search-filter-box">
          <div className="search-input-wrap">
            <Search size={22} className="search-input-icon" />
            <input 
              type="text"
              className="search-input-field"
              placeholder="Cari judul berita, kata kunci kegiatan, atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="category-pills-row">
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: 4, marginRight: '0.5rem' }}>
              <Filter size={16} /> Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid Listing */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-primary)', fontWeight: 600 }}>
            Memuat daftar berita Desa Tajemsari...
          </div>
        ) : filteredBerita.length > 0 ? (
          <div className={`grid-3 ${filteredBerita.length === 1 ? 'has-single-item' : ''}`}>
            {filteredBerita.map((item) => (
              <div 
                key={item.id} 
                className="news-card-item"
                onClick={() => navigate(`/berita/${item.slug || item.id}`)}
              >
                <img src={item.gambar} alt={item.judul} className="news-card-img" />
                <div className="news-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span className="badge-gold">{item.kategori}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} /> {item.tanggal}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', lineHeight: '1.35', color: 'var(--color-primary-dark)' }}>
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
        ) : (
          <div style={{ background: '#ffffff', padding: '3rem', borderRadius: 20, textAlign: 'center', border: '1px solid var(--color-border)' }}>
            <h3 style={{ color: 'var(--color-primary-dark)', fontSize: '1.4rem', marginBottom: '0.5rem' }}>
              Tidak Ada Berita Ditemukan
            </h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Coba cari dengan kata kunci lain atau ubah filter kategori.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
