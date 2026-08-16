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

  const filteredBerita = (beritaList || []).filter((b) => {
    const matchesCategory = activeCategory === 'Semua' || b.kategori === activeCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = query === '' || 
      (b.judul || '').toLowerCase().includes(query) ||
      (b.ringkasan || '').toLowerCase().includes(query) ||
      (b.isi || '').toLowerCase().includes(query);

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
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          padding: 2px 0;
        }

        .category-pills-row::-webkit-scrollbar {
          display: none;
        }

        .news-segmented-bar {
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

        .news-segmented-bar::-webkit-scrollbar {
          display: none;
        }

        .cat-pill-btn {
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

        .cat-pill-btn:hover:not(.active) {
          color: var(--color-primary-dark);
          background: rgba(255, 255, 255, 0.6);
        }

        .cat-pill-btn.active {
          background: var(--color-primary);
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(46, 125, 50, 0.28);
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
          <h1 className="section-title">Kabar & Berita Desa Tajemsari</h1>
          <p className="section-description">
            Informasi pembangunan, pertanian, kesehatan, dan agenda kemasyarakatan Desa Tajemsari.
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
            <div className="news-segmented-bar">
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
                {item.gambar ? (
                  <img src={item.gambar} alt={item.judul} className="news-card-img" />
                ) : (
                  <div style={{ width: '100%', height: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: '#d4af37' }}>
                    <Newspaper size={48} />
                    <span style={{ fontSize: '0.78rem', color: '#ffffff', marginTop: 6, opacity: 0.9 }}>Dokumentasi Berita</span>
                  </div>
                )}
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
