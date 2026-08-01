import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, ChevronRight, Clock, Check, Bookmark } from 'lucide-react';
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
    
    const found = allBerita.find(b => String(b.id) === String(id) || b.slug === id);
    if (found) {
      setBerita(found);
      const rest = allBerita.filter(b => String(b.id) !== String(found.id));
      setOtherBerita(rest.slice(0, 6));
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
        <div style={{ color: 'var(--color-primary)', fontSize: '1.15rem', fontWeight: 600 }}>
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
    <div className="news-portal-container animate-fade-in">
      <style>{`
        .news-portal-container {
          background: #ffffff;
          padding: 2.5rem 0 5rem 0;
        }

        .news-portal-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 3.5rem;
          align-items: start;
        }

        /* Left Main Column */
        .article-main-col {
          max-width: 780px;
        }

        /* Top Breadcrumb & Back Action */
        .news-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .back-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          color: var(--color-primary-dark);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          padding: 0;
          transition: var(--transition-fast);
        }

        .back-link-btn:hover {
          color: var(--color-gold);
          transform: translateX(-3px);
        }

        .news-breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--color-text-muted);
        }

        .breadcrumb-item {
          cursor: pointer;
          color: var(--color-primary);
          font-weight: 600;
        }

        .breadcrumb-item:hover {
          text-decoration: underline;
        }

        /* Article Header */
        .article-category-badge {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #8a6d13;
          background: #fef9e7;
          border: 1px solid rgba(212, 175, 55, 0.4);
          padding: 0.25rem 0.85rem;
          border-radius: 20px;
          margin-bottom: 0.75rem;
        }

        .article-title {
          font-family: var(--font-heading);
          font-size: 2.35rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          line-height: 1.25;
          letter-spacing: -0.3px;
          margin-bottom: 1rem;
        }

        .article-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          margin-bottom: 1.75rem;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.88rem;
          color: var(--color-text-muted);
          flex-wrap: wrap;
          gap: 1rem;
        }

        /* Featured Hero Image (16:9 ratio, clean border-radius) */
        .article-featured-image {
          width: 100%;
          aspect-ratio: 16 / 9;
          max-height: 440px;
          object-fit: cover;
          border-radius: 12px;
          display: block;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        /* Article Body Text Flow (No card, no borders) */
        .article-content-flow {
          font-family: var(--font-body);
          font-size: 1.1rem;
          line-height: 1.85;
          color: #1e293b;
        }

        .article-content-flow p {
          margin-bottom: 1.6rem;
        }

        .article-lead-summary {
          font-size: 1.12rem;
          font-weight: 600;
          line-height: 1.7;
          color: var(--color-primary-dark);
          border-left: 4px solid var(--color-gold);
          padding-left: 1.25rem;
          margin-bottom: 2rem;
          font-style: italic;
        }

        /* Share Actions Bar at Bottom of Article */
        .article-share-footer {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 2rem;
          margin-top: 3rem;
          border-top: 1px solid #e2e8f0;
        }

        /* Right Sidebar Column (Sticky, 30% width) */
        .news-sidebar-col {
          position: sticky;
          top: 96px;
        }

        .sidebar-heading {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-primary-dark);
          padding-bottom: 0.65rem;
          border-bottom: 2.5px solid var(--color-gold);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sidebar-news-list {
          display: flex;
          flex-direction: column;
        }

        .sidebar-news-item {
          display: flex;
          gap: 0.85rem;
          padding: 0.85rem 0;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 8px;
        }

        .sidebar-news-item:hover {
          background: #f8faf8;
          padding-left: 0.4rem;
          padding-right: 0.4rem;
        }

        .sidebar-news-thumb {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .sidebar-news-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
        }

        .sidebar-news-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin-bottom: 0.2rem;
        }

        .sidebar-news-title {
          font-family: var(--font-heading);
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          line-height: 1.35;
          margin-bottom: 0.35rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .sidebar-news-date {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 992px) {
          .news-portal-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .news-sidebar-col {
            position: static;
            margin-top: 1rem;
            border-top: 2px solid #e2e8f0;
            padding-top: 2rem;
          }
          .article-title {
            font-size: 1.85rem;
          }
          .article-main-col {
            max-width: 100%;
          }
        }
      `}</style>

      <div className="container">
        {/* Unified 2-Column Portal Grid */}
        <div className="news-portal-grid">

          {/* LEFT COLUMN: Main Article Stream (~70%) */}
          <article className="article-main-col">
            {/* Top Bar: Back Action & Breadcrumb */}
            <div className="news-top-bar">
              <button className="back-link-btn" onClick={() => navigate('/')}>
                <ArrowLeft size={16} /> Kembali ke Berita
              </button>

              <div className="news-breadcrumb">
                <span className="breadcrumb-item" onClick={() => navigate('/')}>Beranda</span>
                <ChevronRight size={13} />
                <span className="breadcrumb-item" onClick={() => navigate('/')}>Berita Desa</span>
                <ChevronRight size={13} />
                <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{berita.kategori}</span>
              </div>
            </div>

            {/* Article Category & Title */}
            <div>
              <span className="article-category-badge">{berita.kategori}</span>
              <h1 className="article-title">{berita.judul}</h1>
            </div>

            {/* Author & Published Metadata Row */}
            <div className="article-meta-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <User size={15} color="var(--color-primary)" />
                  <span>Oleh: <strong>{berita.penulis || 'Admin Desa Tajemsari'}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={15} color="var(--color-gold)" />
                  <span>{berita.tanggal}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={15} color="var(--color-text-muted)" />
                  <span>3 mnt baca</span>
                </div>
              </div>

              {/* Quick Share Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleShareWhatsApp}
                  style={{ background: '#25D366', color: '#fff', border: 'none', padding: '0.35rem 0.8rem', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                >
                  <Share2 size={13} /> WA
                </button>
                <button 
                  onClick={handleCopyLink}
                  style={{ background: '#f1f5f9', color: 'var(--color-text-main)', border: 'none', padding: '0.35rem 0.8rem', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                >
                  {copied ? <Check size={13} color="#16a34a" /> : <Share2 size={13} />}
                  {copied ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            {/* Main Featured Image (16:9, proportional height) */}
            <img src={berita.gambar} alt={berita.judul} className="article-featured-image" />

            {/* Article Content Stream (No card box, natural article flow) */}
            <div className="article-content-flow">
              {berita.ringkasan && (
                <div className="article-lead-summary">
                  "{berita.ringkasan}"
                </div>
              )}

              <div>
                {berita.isi.split('\n').map((paragraph, index) => (
                  paragraph.trim() ? <p key={index}>{paragraph}</p> : null
                ))}
              </div>
            </div>

            {/* Bottom Article Footer / Share Bar */}
            <div className="article-share-footer">
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                Bagikan artikel ini:
              </span>
              <button 
                onClick={handleShareWhatsApp}
                className="btn btn-primary"
                style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
              >
                WhatsApp
              </button>
              <button 
                onClick={handleCopyLink}
                className="btn btn-outline"
                style={{ padding: '0.45rem 1.1rem', fontSize: '0.85rem' }}
              >
                {copied ? 'Tautan Tersalin!' : 'Salin Tautan'}
              </button>
            </div>
          </article>

          {/* RIGHT COLUMN: Sidebar "Berita Lainnya" (~30%, starts parallel at top) */}
          <aside className="news-sidebar-col">
            <div className="sidebar-heading">
              <span>Berita Lainnya</span>
              <Bookmark size={18} color="var(--color-gold)" />
            </div>

            <div className="sidebar-news-list">
              {otherBerita.map((item) => (
                <div 
                  key={item.id} 
                  className="sidebar-news-item"
                  onClick={() => navigate(`/berita/${item.id}`)}
                >
                  <img src={item.gambar} alt={item.judul} className="sidebar-news-thumb" />
                  <div className="sidebar-news-info">
                    <span className="sidebar-news-badge">{item.kategori}</span>
                    <h4 className="sidebar-news-title">{item.judul}</h4>
                    <span className="sidebar-news-date">
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
