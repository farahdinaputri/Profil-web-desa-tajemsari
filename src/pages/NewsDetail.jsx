import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Tag, ChevronRight, Eye, Bookmark, Clock, Check } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [berita, setBerita] = useState(null);
  const [otherBerita, setOtherBerita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadNewsData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const loadNewsData = async () => {
    setLoading(true);
    const allBerita = await apiService.getBerita();
    
    // Find current news item by id or slug
    const found = allBerita.find(b => String(b.id) === String(id) || b.slug === id);
    if (found) {
      setBerita(found);
      // Filter out current item to populate sidebar "Berita Lainnya"
      const rest = allBerita.filter(b => String(b.id) !== String(found.id));
      setOtherBerita(rest.slice(0, 5));
    }
    setLoading(false);
  };

  const handleShareWhatsApp = () => {
    const url = window.location.href;
    const text = `Baca Berita Desa Tajemsari: "${berita?.judul}"\n${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-primary)', fontSize: '1.2rem', fontWeight: 600 }}>
          Memuat Berita Desa Tajemsari...
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center', minHeight: '60vh', padding: '5rem 1.5rem' }}>
        <h2 style={{ color: 'var(--color-primary-dark)', fontSize: '2rem', marginBottom: '1rem' }}>
          Berita Tidak Ditemukan
        </h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Maaf, artikel berita yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="news-detail-page section-padding animate-fade-in" style={{ background: '#f8faf8' }}>
      <style>{`
        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.88rem;
          color: var(--color-text-muted);
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .breadcrumb-link {
          color: var(--color-primary);
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .breadcrumb-link:hover {
          color: var(--color-primary-dark);
          text-decoration: underline;
        }

        .back-btn-top {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          background: #ffffff;
          border: 1px solid var(--color-border);
          color: var(--color-primary-dark);
          font-size: 0.88rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-fast);
        }

        .back-btn-top:hover {
          background: var(--color-primary-soft);
          border-color: var(--color-primary);
          transform: translateX(-3px);
        }

        .news-header-meta {
          margin-bottom: 1.75rem;
        }

        .news-header-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          line-height: 1.25;
          margin: 0.75rem 0 1.25rem 0;
          letter-spacing: -0.5px;
        }

        .news-author-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 1rem 0;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }

        .hero-image-wrap {
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          margin-bottom: 2.5rem;
          border: 1px solid rgba(46, 125, 50, 0.15);
          background: #000;
        }

        .news-hero-img {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          display: block;
        }

        .news-layout-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 3rem;
          align-items: start;
        }

        .article-body-text {
          font-family: var(--font-body);
          font-size: 1.08rem;
          line-height: 1.85;
          color: var(--color-text-main);
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 20px;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .article-body-text p {
          margin-bottom: 1.5rem;
        }

        .article-body-text p:first-of-type::first-letter {
          font-size: 3.2rem;
          font-family: var(--font-heading);
          float: left;
          line-height: 1;
          padding-right: 0.75rem;
          color: var(--color-primary-dark);
          font-weight: 800;
        }

        .share-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--color-border);
        }

        .sidebar-panel {
          position: sticky;
          top: 100px;
        }

        .sidebar-card-title {
          font-size: 1.25rem;
          color: var(--color-primary-dark);
          margin-bottom: 1.25rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--color-gold);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sidebar-item-card {
          display: flex;
          gap: 1rem;
          background: #ffffff;
          padding: 0.85rem;
          border-radius: 14px;
          border: 1px solid var(--color-border);
          margin-bottom: 1rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .sidebar-item-card:hover {
          border-color: var(--color-gold);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }

        .sidebar-item-img {
          width: 84px;
          height: 84px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .sidebar-item-title {
          font-family: var(--font-heading);
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          line-height: 1.35;
          margin-bottom: 0.35rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 992px) {
          .news-layout-grid {
            grid-template-columns: 1fr;
          }
          .sidebar-panel {
            position: static;
            margin-top: 2rem;
          }
          .news-header-title {
            font-size: 1.85rem;
          }
          .article-body-text {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="container">
        {/* Navigation Top: Breadcrumbs & Back Button */}
        <div>
          <button className="back-btn-top" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Kembali ke Berita Desa
          </button>

          <div className="breadcrumb-nav">
            <span className="breadcrumb-link" onClick={() => navigate('/')}>Beranda</span>
            <ChevronRight size={14} />
            <span className="breadcrumb-link" onClick={() => navigate('/')}>Berita Desa</span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{berita.kategori}</span>
          </div>
        </div>

        {/* News Header Section */}
        <div className="news-header-meta">
          <span className="badge-gold" style={{ fontSize: '0.85rem', padding: '0.35rem 1rem' }}>
            {berita.kategori}
          </span>

          <h1 className="news-header-title">{berita.judul}</h1>

          <div className="news-author-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} color="var(--color-primary)" />
                <span>Dipublikasikan oleh: <strong>{berita.penulis || 'Admin Desa Tajemsari'}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color="var(--color-gold)" />
                <span>{berita.tanggal}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--color-text-muted)" />
                <span>3 menit baca</span>
              </div>
            </div>

            {/* Quick Share */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={handleShareWhatsApp}
                style={{ background: '#25D366', color: '#fff', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
              >
                <Share2 size={14} /> Bagikan WA
              </button>
              <button 
                onClick={handleCopyLink}
                style={{ background: '#e2e8f0', color: 'var(--color-text-main)', border: 'none', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
              >
                {copied ? <Check size={14} color="#16a34a" /> : <Share2 size={14} />}
                {copied ? 'Tersalin!' : 'Salin Link'}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="hero-image-wrap">
          <img src={berita.gambar} alt={berita.judul} className="news-hero-img" />
        </div>

        {/* Content Layout Grid (Article Left + Sidebar Right) */}
        <div className="news-layout-grid">
          {/* Main Article Content */}
          <article className="article-body-text">
            {berita.ringkasan && (
              <div style={{ background: 'var(--color-primary-soft)', borderLeft: '4px solid var(--color-primary)', padding: '1.25rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: '2rem', lineHeight: '1.6' }}>
                {berita.ringkasan}
              </div>
            )}

            <div>
              {berita.isi.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index}>{paragraph}</p> : null
              ))}
            </div>

            {/* Bottom Article Metadata & Tags */}
            <div className="share-box">
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>Bagikan Artikel:</span>
              <button 
                onClick={handleShareWhatsApp}
                className="btn btn-primary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
              >
                WhatsApp
              </button>
              <button 
                onClick={handleCopyLink}
                className="btn btn-outline"
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
              >
                {copied ? 'Link Tersalin!' : 'Salin Tautan'}
              </button>
            </div>
          </article>

          {/* Right Sidebar: Berita Lainnya */}
          <aside className="sidebar-panel">
            <h3 className="sidebar-card-title">
              <Bookmark size={20} color="var(--color-gold)" /> Berita Terkait Lainnya
            </h3>

            <div>
              {otherBerita.map((item) => (
                <div 
                  key={item.id} 
                  className="sidebar-item-card"
                  onClick={() => navigate(`/berita/${item.id}`)}
                >
                  <img src={item.gambar} alt={item.judul} className="sidebar-item-img" />
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span className="badge-green" style={{ width: 'fit-content', fontSize: '0.72rem', padding: '0.15rem 0.5rem', marginBottom: 4 }}>
                      {item.kategori}
                    </span>
                    <h4 className="sidebar-item-title">{item.judul}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Calendar size={12} /> {item.tanggal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
