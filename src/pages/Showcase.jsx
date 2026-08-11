import React, { useState, useEffect } from 'react';
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
      `}</style>

      <div className="container">
        {/* Header */}
        <div className="section-header">
          <h1 className="section-title">Potensi UMKM & Agrowisata</h1>
          <p className="section-description">
            Jelajahi beragam produk unggulan warga desa serta keindahan agrowisata dan persawahan asri Desa Tajemsari, Tegowanu.
          </p>
        </div>

        {/* Section 1: Galeri UMKM */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                Katalog UMKM & Produk Warga
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

      {/* MODAL FULL CATALOG OF AN UMKM OWNER */}
      {selectedUmkmModal && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.65)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 1200, 
            backdropFilter: 'blur(5px)',
            padding: '1rem'
          }}
          onClick={() => setSelectedUmkmModal(null)}
        >
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: 24, 
              padding: '2rem', 
              maxWidth: 720, 
              width: '100%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)', 
              border: '2px solid var(--color-border)' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <div>
                <span className="badge-gold" style={{ marginBottom: '0.35rem', display: 'inline-block' }}>
                  {selectedUmkmModal.kategori}
                </span>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                  Katalog Usaha: {selectedUmkmModal.pembuat}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  {selectedUmkmModal.nama_produk} • {selectedUmkmModal.dusun || 'Desa Tajemsari'}
                </span>
              </div>
              <button 
                onClick={() => setSelectedUmkmModal(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* List of Products from this Owner */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {getOwnerProducts(selectedUmkmModal).map((prod, pIdx) => (
                <div 
                  key={prod.id || pIdx}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '140px 1fr', 
                    gap: '1.25rem', 
                    background: '#fcfdfc', 
                    border: '1px solid var(--color-border)', 
                    borderRadius: 16, 
                    padding: '1rem',
                    alignItems: 'center'
                  }}
                >
                  <img 
                    src={prod.gambar} 
                    alt={prod.nama} 
                    style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 12 }} 
                  />
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                        {prod.nama}
                      </h4>
                      <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.95rem', background: '#e8f5e9', padding: '0.2rem 0.5rem', borderRadius: 6 }}>
                        {prod.harga}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', lineHeight: '1.45' }}>
                      {prod.deskripsi}
                    </p>

                    <a 
                      href={getUmkmWaLink(selectedUmkmModal, prod)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}
                    >
                      <PhoneCall size={14} /> Pesan Produk Ini via WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'right', marginTop: '1.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setSelectedUmkmModal(null)}>
                Tutup Katalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
