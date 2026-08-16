import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag, Compass, MapPin, PhoneCall, Clock, Tag, ExternalLink, Sparkles, ChevronLeft, ChevronRight, Eye, X, Check, Store, Package } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';
import { getUmkmWaLink } from '../utils/whatsapp';

export default function Showcase() {
  const [umkmList, setUmkmList] = useState([]);
  const [wisataList, setWisataList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  // State to track which product/photo is active on each UMKM card
  const [activeProductIdxMap, setActiveProductIdxMap] = useState({});

  // Modal State for Full Owner Catalog
  const [selectedUmkmModal, setSelectedUmkmModal] = useState(null);

  // Lock body scroll and allow ESC key to close modal when opened
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedUmkmModal(null);
      }
    };
    if (selectedUmkmModal) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedUmkmModal]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const umkmData = await apiService.getUMKM();
    const wisataData = await apiService.getWisata();
    setUmkmList(umkmData || []);
    setWisataList(wisataData || []);
  };

  const categories = ['Semua', 'Kuliner', 'Kerajinan', 'Pertanian', 'Jasa'];

  const filteredUmkm = activeCategory === 'Semua' 
    ? umkmList 
    : umkmList.filter(u => u.kategori === activeCategory);

  // Helper to extract normalized products list from an UMKM owner item
  const getOwnerProducts = (item) => {
    if (Array.isArray(item.produk_list) && item.produk_list.length > 0) {
      return item.produk_list.map((p, idx) => ({
        id: p.id || `prod_${idx}`,
        nama: p.nama || p.nama_produk || (idx === 0 ? item.nama_produk : `Produk #${idx + 1}`),
        harga: p.harga || item.harga || 'Hubungi Penjual',
        gambar: p.gambar || p.foto || p.url || item.gambar,
        deskripsi: p.deskripsi || p.caption || item.deskripsi
      }));
    }

    if (Array.isArray(item.galeri) && item.galeri.length > 0) {
      return item.galeri.map((g, idx) => ({
        id: `gal_${idx}`,
        nama: typeof g === 'object' && g.nama ? g.nama : (idx === 0 ? item.nama_produk : `Varian Produk #${idx + 1}`),
        harga: typeof g === 'object' && g.harga ? g.harga : item.harga,
        gambar: typeof g === 'string' ? g : g.url,
        deskripsi: typeof g === 'object' && g.caption ? g.caption : item.deskripsi
      }));
    }

    return [{
      id: 'main_1',
      nama: item.nama_produk || 'Produk UMKM',
      harga: item.harga || 'Hubungi Penjual',
      gambar: item.gambar,
      deskripsi: item.deskripsi
    }];
  };

  const handleSelectProduct = (umkmId, idx) => {
    setActiveProductIdxMap(prev => ({ ...prev, [umkmId]: idx }));
  };

  const handleNextProduct = (umkmId, total) => {
    const current = activeProductIdxMap[umkmId] || 0;
    setActiveProductIdxMap(prev => ({ ...prev, [umkmId]: (current + 1) % total }));
  };

  const handlePrevProduct = (umkmId, total) => {
    const current = activeProductIdxMap[umkmId] || 0;
    setActiveProductIdxMap(prev => ({ ...prev, [umkmId]: (current - 1 + total) % total }));
  };

  return (
    <div className="showcase-page animate-fade-in section-padding">
      <style>{`
        .product-card {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: 0 8px 25px rgba(0,0,0,0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(46, 125, 50, 0.12);
          border-color: rgba(212, 175, 55, 0.5);
        }

        .card-img-container {
          position: relative;
          width: 100%;
          height: 230px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .product-img-main {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-img-main {
          transform: scale(1.04);
        }

        .photo-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          color: var(--color-primary-dark);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: all 0.2s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          z-index: 5;
        }

        .photo-nav-btn:hover {
          background: #ffffff;
          color: var(--color-gold);
          transform: translateY(-50%) scale(1.1);
        }

        .photo-nav-btn.prev {
          left: 10px;
        }

        .photo-nav-btn.next {
          right: 10px;
        }

        .badge-count-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(17, 42, 20, 0.85);
          color: #ffffff;
          padding: 0.25rem 0.65rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          z-index: 4;
        }

        .category-badge-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #fef9e7;
          color: #8a6d13;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          border: 1px solid rgba(212, 175, 55, 0.5);
          z-index: 4;
        }

        .product-thumbnails-bar {
          display: flex;
          gap: 0.45rem;
          padding: 0.6rem 1.25rem;
          background: #fbfdfb;
          border-bottom: 1px solid var(--color-border);
          overflow-x: auto;
          scrollbar-width: none;
        }

        .product-thumbnails-bar::-webkit-scrollbar {
          display: none;
        }

        .thumb-btn {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          flex-shrink: 0;
          padding: 0;
          background: #e2e8f0;
          transition: all 0.2s ease;
        }

        .thumb-btn.active {
          border-color: var(--color-gold);
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.5);
          transform: scale(1.05);
        }

        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-body {
          padding: 1.35rem 1.5rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .product-chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-bottom: 1rem;
        }

        .prod-chip {
          background: #f1f8f3;
          color: var(--color-primary-dark);
          border: 1px solid rgba(46, 125, 50, 0.25);
          padding: 0.25rem 0.65rem;
          border-radius: 14px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .prod-chip.active {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary-dark);
          box-shadow: 0 2px 6px rgba(46, 125, 50, 0.25);
        }

        .prod-chip:hover:not(.active) {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }

        .wisata-card-banner {
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          margin-bottom: 2.5rem;
          transition: transform 0.3s ease;
        }

        .wisata-card-banner:hover {
          transform: translateY(-4px);
          border-color: rgba(212, 175, 55, 0.4);
        }

        .wisata-img {
          width: 100%;
          height: 100%;
          min-height: 280px;
          object-fit: cover;
        }

        /* Segmented Category Filter Bar */
        .showcase-category-wrap {
          display: flex;
          align-items: center;
          max-width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
          padding: 2px 0;
        }

        .showcase-category-wrap::-webkit-scrollbar {
          display: none;
        }

        .showcase-segmented-bar {
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

        .showcase-segmented-bar::-webkit-scrollbar {
          display: none;
        }

        .showcase-segmented-btn {
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

        .showcase-segmented-btn:hover:not(.active) {
          color: var(--color-primary-dark);
          background: rgba(255, 255, 255, 0.6);
        }

        .showcase-segmented-btn.active {
          background: linear-gradient(135deg, #d4af37 0%, #b89628 100%);
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(212, 175, 55, 0.35);
        }

        @media (max-width: 800px) {
          .wisata-card-banner {
            grid-template-columns: 1fr;
          }
        }

        /* ========================================================
           MODAL KATALOG SEMUA USAHA PEMILIK (RESPONSIVE & MODERN)
           ======================================================== */
        .catalog-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 1.25rem;
          box-sizing: border-box;
          animation: modalOverlayFadeIn 0.25s ease-out forwards;
        }

        @keyframes modalOverlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalCardPop {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(0);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .catalog-modal-card {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 680px;
          max-height: 85vh;
          max-height: 85dvh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.25);
          border: 1px solid rgba(226, 232, 240, 0.9);
          overflow: hidden;
          margin: auto;
          animation: modalCardPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Modal Header */
        .catalog-modal-header {
          padding: 1.25rem 1.5rem;
          background: linear-gradient(135deg, #fbfdfa 0%, #f4fbf5 100%);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .catalog-header-badges {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.4rem;
        }

        .catalog-modal-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin: 0 0 0.25rem 0;
          line-height: 1.3;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .catalog-modal-subtitle {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .catalog-close-btn {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .catalog-close-btn:hover {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fecaca;
          transform: rotate(90deg);
        }

        /* Modal Body */
        .catalog-modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #f8faf8;
        }

        /* Custom Scrollbar */
        .catalog-modal-body::-webkit-scrollbar {
          width: 6px;
        }

        .catalog-modal-body::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .catalog-modal-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .catalog-modal-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Catalog Product Card */
        .catalog-item-card {
          background: #ffffff;
          border-radius: 18px;
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
          padding: 1.15rem;
          display: grid;
          grid-template-columns: 160px 1fr;
          gap: 1.25rem;
          align-items: center;
          transition: all 0.25s ease;
          position: relative;
        }

        .catalog-item-card:hover {
          border-color: rgba(46, 125, 50, 0.4);
          box-shadow: 0 8px 24px rgba(46, 125, 50, 0.08);
          transform: translateY(-2px);
        }

        .catalog-item-img-wrap {
          width: 100%;
          height: 140px;
          border-radius: 14px;
          overflow: hidden;
          background: #f1f5f9;
          position: relative;
          flex-shrink: 0;
        }

        .catalog-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .catalog-item-card:hover .catalog-item-img {
          transform: scale(1.04);
        }

        .catalog-item-number {
          position: absolute;
          top: 8px;
          left: 8px;
          background: rgba(17, 42, 20, 0.85);
          color: var(--color-gold);
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 12px;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(212, 175, 55, 0.4);
        }

        .catalog-item-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          min-width: 0;
        }

        .catalog-item-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .catalog-item-name {
          font-size: 1.12rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin: 0;
          line-height: 1.35;
          word-break: break-word;
        }

        .catalog-item-price {
          font-weight: 800;
          color: var(--color-primary);
          font-size: 1.02rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 0.25rem 0.65rem;
          border-radius: 8px;
          white-space: nowrap;
          flex-shrink: 0;
          display: inline-block;
        }

        .catalog-item-desc {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin: 0;
          word-break: break-word;
        }

        .catalog-item-btn-wa {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #25D366 0%, #1b8a43 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.6rem 1.15rem;
          border-radius: 10px;
          text-decoration: none;
          width: fit-content;
          box-shadow: 0 3px 10px rgba(37, 211, 102, 0.25);
          transition: all 0.2s ease;
          margin-top: 0.25rem;
        }

        .catalog-item-btn-wa:hover {
          background: linear-gradient(135deg, #22bf5b 0%, #166e35 100%);
          transform: translateY(-1.5px);
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.35);
          color: #ffffff;
        }

        /* Modal Footer */
        .catalog-modal-footer {
          padding: 0.9rem 1.5rem;
          background: #ffffff;
          border-top: 1px solid var(--color-border);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          position: sticky;
          bottom: 0;
          z-index: 10;
        }

        /* Responsive Breakpoints for Mobile */
        @media (max-width: 640px) {
          .catalog-modal-overlay {
            padding: 1rem 0.75rem;
            display: flex;
            align-items: center !important;
            justify-content: center !important;
          }

          .catalog-modal-card {
            max-height: 80vh;
            max-height: 80dvh;
            border-radius: 20px;
            margin: auto !important;
          }

          .catalog-modal-header {
            padding: 1rem 1.15rem;
          }

          .catalog-modal-title {
            font-size: 1.15rem;
          }

          .catalog-modal-subtitle {
            font-size: 0.78rem;
          }

          .catalog-modal-body {
            padding: 0.85rem;
            gap: 0.85rem;
          }

          .catalog-item-card {
            grid-template-columns: 1fr;
            gap: 0.85rem;
            padding: 0.9rem;
            border-radius: 16px;
          }

          .catalog-item-img-wrap {
            width: 100%;
            height: 180px;
            border-radius: 12px;
          }

          .catalog-item-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.35rem;
          }

          .catalog-item-name {
            font-size: 1.05rem;
          }

          .catalog-item-price {
            font-size: 0.95rem;
            padding: 0.2rem 0.55rem;
          }

          .catalog-item-desc {
            font-size: 0.82rem;
          }

          .catalog-item-btn-wa {
            width: 100%;
            padding: 0.7rem 1rem;
            font-size: 0.88rem;
            text-align: center;
            border-radius: 10px;
            margin-top: 0.35rem;
          }

          .catalog-modal-footer {
            padding: 0.75rem 1rem;
            display: flex;
            justify-content: center;
          }

          .catalog-modal-footer .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="section-header">
          <h1 className="section-title">Produk UMKM & Wisata</h1>
          <p className="section-description">
            Jelajahi beragam produk unggulan warga desa serta keindahan wisata dan persawahan asri Desa Tajemsari, Tegowanu.
          </p>
        </div>

        {/* Section 1: Galeri UMKM */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                Produk UMKM
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Dukung pengusaha lokal Tajemsari dengan memesan langsung ke kontak resmi WhatsApp penjual.
              </span>
            </div>

            {/* Filter Buttons - Segmented Straight Bar */}
            <div className="showcase-category-wrap">
              <div className="showcase-segmented-bar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`showcase-segmented-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`grid-3 ${filteredUmkm.length === 1 ? 'has-single-item' : ''}`}>
            {filteredUmkm.map((item) => {
              const products = getOwnerProducts(item);
              const activeIdx = activeProductIdxMap[item.id] || 0;
              const safeIdx = activeIdx < products.length ? activeIdx : 0;
              const currentProduct = products[safeIdx] || products[0];

              return (
                <div key={item.id} className="product-card">
                  {/* Photo Header with Carousel & Multi-Product Navigation */}
                  <div className="card-img-container">
                    {(currentProduct.gambar || item.gambar) ? (
                      <img 
                        src={currentProduct.gambar || item.gambar} 
                        alt={currentProduct.nama} 
                        className="product-img-main" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: '#d4af37' }}>
                        <ShoppingBag size={48} />
                        <span style={{ fontSize: '0.78rem', color: '#ffffff', marginTop: 6, opacity: 0.9 }}>Foto Produk Belum Diunggah</span>
                      </div>
                    )}

                    {/* Count Badge Overlay */}
                    <div className="badge-count-overlay">
                      <Package size={13} color="var(--color-gold)" />
                      <span>{products.length} Usaha / Produk</span>
                    </div>

                    {/* Category Badge Overlay */}
                    <div className="category-badge-overlay">
                      {item.kategori || 'UMKM'}
                    </div>

                    {/* Left & Right Arrow Buttons if > 1 Product */}
                    {products.length > 1 && (
                      <>
                        <button 
                          className="photo-nav-btn prev"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrevProduct(item.id, products.length);
                          }}
                          title="Lihat produk sebelumnya"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button 
                          className="photo-nav-btn next"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNextProduct(item.id, products.length);
                          }}
                          title="Lihat produk berikutnya"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Row if > 1 Product */}
                  {products.length > 1 && (
                    <div className="product-thumbnails-bar">
                      {products.map((p, pIdx) => (
                        <button
                          key={p.id || pIdx}
                          className={`thumb-btn ${safeIdx === pIdx ? 'active' : ''}`}
                          onClick={() => handleSelectProduct(item.id, pIdx)}
                          title={`${p.nama} (${p.harga})`}
                        >
                          <img src={p.gambar} alt={p.nama} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="product-body">
                    {/* Owner Name & Location */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Store size={14} color="var(--color-primary)" />
                        <span>Pemilik: <strong>{item.pembuat}</strong></span>
                      </div>
                      {item.dusun && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {item.dusun}
                        </span>
                      )}
                    </div>

                    {/* Active Product Name & Active Price */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.18rem', color: 'var(--color-primary-dark)', margin: 0, lineHeight: 1.3 }}>
                        {currentProduct.nama}
                      </h3>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.15rem', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.2rem 0.65rem', borderRadius: 8, display: 'inline-block' }}>
                        {currentProduct.harga}
                      </span>
                    </div>

                    {/* Owner's Products Quick Switcher Chips */}
                    {products.length > 1 && (
                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Pilihan Varian / Usaha ({products.length}):
                        </div>
                        <div className="product-chips-list">
                          {products.map((p, pIdx) => (
                            <button
                              key={p.id || pIdx}
                              className={`prod-chip ${safeIdx === pIdx ? 'active' : ''}`}
                              onClick={() => handleSelectProduct(item.id, pIdx)}
                            >
                              {p.nama}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <p style={{ fontSize: '0.86rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.55' }}>
                      {currentProduct.deskripsi || item.deskripsi}
                    </p>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                      {/* WhatsApp Direct Order Button */}
                      <a 
                        href={getUmkmWaLink(item, currentProduct)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', fontSize: '0.9rem' }}
                        title={`Pesan ${currentProduct.nama} via WhatsApp`}
                      >
                        <PhoneCall size={16} /> Pesan "{currentProduct.nama}" via WA
                      </a>

                      {/* View All Products of this Owner Modal Trigger */}
                      {products.length > 1 && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ width: '100%', padding: '0.55rem', fontSize: '0.82rem', justifyContent: 'center', gap: 6, color: 'var(--color-primary-dark)', borderColor: 'var(--color-primary-soft)' }}
                          onClick={() => setSelectedUmkmModal(item)}
                        >
                          <Eye size={14} /> Lihat Semua Usaha {item.pembuat} ({products.length} Produk)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Destinasi Wisata */}
        <div>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">Destinasi Wisata & Budaya</h2>
            <p className="section-description">
              Keindahan alam persawahan terbentang luas, embung penampungan air, dan kearifan lokal warga Tajemsari Tegowanu.
            </p>
          </div>

          {wisataList.map((spot) => (
            <div key={spot.id} className="wisata-card-banner">
              {spot.gambar ? (
                <img src={spot.gambar} alt={spot.nama_tempat} className="wisata-img" />
              ) : (
                <div style={{ minHeight: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: '#d4af37' }}>
                  <Compass size={60} />
                  <span style={{ fontSize: '0.85rem', color: '#ffffff', marginTop: 8, opacity: 0.9 }}>Foto Destinasi Wisata</span>
                </div>
              )}
              <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span className="badge-green" style={{ display: 'inline-block', width: 'fit-content', marginBottom: '0.75rem' }}>
                  {spot.kategori}
                </span>
                <h3 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
                  {spot.nama_tempat}
                </h3>
                <p style={{ lineHeight: '1.7', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  {spot.deskripsi}
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--color-text-main)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={18} color="var(--color-gold)" />
                    <span>{spot.lokasi}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={18} color="var(--color-gold)" />
                    <span>{spot.jam_buka}</span>
                  </div>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fef9e7', padding: '0.5rem 1rem', borderRadius: 10, width: 'fit-content', border: '1px solid var(--color-gold)', fontSize: '0.88rem', color: '#8a6d13', fontWeight: 700 }}>
                  Tiket Masuk: {spot.tiket_masuk}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL FULL CATALOG OF AN UMKM OWNER (Rendered via Portal for perfect center alignment) */}
      {selectedUmkmModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="catalog-modal-overlay"
          onClick={() => setSelectedUmkmModal(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-catalog-title"
        >
          <div 
            className="catalog-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="catalog-modal-header">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="catalog-header-badges">
                  <span className="badge-gold">
                    {selectedUmkmModal.kategori || 'UMKM Desa'}
                  </span>
                  <span className="badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Package size={12} />
                    {getOwnerProducts(selectedUmkmModal).length} Usaha / Produk
                  </span>
                </div>
                <h3 id="modal-catalog-title" className="catalog-modal-title">
                  <Store size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                  <span>Katalog Usaha: {selectedUmkmModal.pembuat}</span>
                </h3>
                <div className="catalog-modal-subtitle">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={13} color="var(--color-gold)" />
                    {selectedUmkmModal.dusun || 'Desa Tajemsari, Kec. Tegowanu'}
                  </span>
                  {selectedUmkmModal.nama_produk && (
                    <>
                      <span>•</span>
                      <span>{selectedUmkmModal.nama_produk}</span>
                    </>
                  )}
                </div>
              </div>
              <button 
                type="button"
                className="catalog-close-btn"
                onClick={() => setSelectedUmkmModal(null)}
                title="Tutup Katalog (Esc)"
                aria-label="Tutup Katalog"
              >
                <X size={18} />
              </button>
            </div>

            {/* List of Products from this Owner */}
            <div className="catalog-modal-body">
              {getOwnerProducts(selectedUmkmModal).map((prod, pIdx) => (
                <div 
                  key={prod.id || pIdx}
                  className="catalog-item-card"
                >
                  <div className="catalog-item-img-wrap">
                    {prod.gambar ? (
                      <img 
                        src={prod.gambar} 
                        alt={prod.nama} 
                        className="catalog-item-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)', color: '#d4af37' }}>
                        <ShoppingBag size={32} />
                        <span style={{ fontSize: '0.7rem', color: '#ffffff', marginTop: 4 }}>Foto Produk</span>
                      </div>
                    )}
                    <span className="catalog-item-number">
                      #{pIdx + 1}
                    </span>
                  </div>

                  <div className="catalog-item-details">
                    <div className="catalog-item-top">
                      <h4 className="catalog-item-name">
                        {prod.nama}
                      </h4>
                      <span className="catalog-item-price">
                        {prod.harga}
                      </span>
                    </div>

                    <p className="catalog-item-desc">
                      {prod.deskripsi || selectedUmkmModal.deskripsi || 'Produk unggulan berkualitas dari warga Desa Tajemsari.'}
                    </p>

                    <a 
                      href={getUmkmWaLink(selectedUmkmModal, prod)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="catalog-item-btn-wa"
                      title={`Pesan ${prod.nama} via WhatsApp`}
                    >
                      <PhoneCall size={15} />
                      <span>Pesan Produk Ini via WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="catalog-modal-footer">
              <button 
                type="button"
                className="btn btn-outline" 
                onClick={() => setSelectedUmkmModal(null)}
                style={{ padding: '0.55rem 1.4rem', fontSize: '0.88rem' }}
              >
                Tutup Katalog
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
