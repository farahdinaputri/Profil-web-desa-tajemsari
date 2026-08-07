import React, { useState, useEffect } from 'react';
import { ShoppingBag, Compass, MapPin, PhoneCall, Clock, Tag, ExternalLink, Sparkles } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';
import { getUmkmWaLink } from '../utils/whatsapp';

export default function Showcase() {
  const [umkmList, setUmkmList] = useState([]);
  const [wisataList, setWisataList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const umkmData = await apiService.getUMKM();
    const wisataData = await apiService.getWisata();
    setUmkmList(umkmData);
    setWisataList(wisataData);
  };

  const categories = ['Semua', 'Kuliner', 'Kerajinan', 'Jasa', 'Pertanian'];

  const filteredUmkm = activeCategory === 'Semua' 
    ? umkmList 
    : umkmList.filter(u => u.kategori === activeCategory);

  return (
    <div className="showcase-page animate-fade-in section-padding">
      <style>{`
        .product-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-normal);
          display: flex;
          flex-direction: column;
        }

        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
          border-color: rgba(212, 175, 55, 0.5);
        }

        .product-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }

        .product-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
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
        }

        .wisata-img {
          width: 100%;
          height: 100%;
          min-height: 280px;
          object-fit: cover;
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
            Jelajahi produk olahan warga lokal serta keindahan destinasi wisata dan persawahan Desa Tajemsari.
          </p>
        </div>

        {/* Section 1: Galeri UMKM */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary-dark)' }}>
              Produk UMKM Tajemsari
            </h2>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: activeCategory === cat ? 'var(--color-gold)' : 'var(--color-border)',
                    background: activeCategory === cat ? 'var(--color-gold)' : '#ffffff',
                    color: activeCategory === cat ? '#ffffff' : 'var(--color-text-main)',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className={`grid-3 ${filteredUmkm.length === 1 ? 'has-single-item' : ''}`}>
            {filteredUmkm.map((item) => (
              <div key={item.id} className="product-card">
                <img src={item.gambar} alt={item.nama_produk} className="product-img" />
                <div className="product-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span className="badge-gold">{item.kategori}</span>
                    <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>
                      {item.harga}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.4rem' }}>
                    {item.nama_produk}
                  </h3>

                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                    Produsen: <strong>{item.pembuat}</strong>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
                    {item.deskripsi}
                  </p>

                  <a 
                    href={getUmkmWaLink(item)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none' }}
                    title={`Beli ${item.nama_produk} via WhatsApp`}
                  >
                    <PhoneCall size={16} /> Beli via WhatsApp Penjual
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Destinasi Wisata */}
        <div>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">Destinasi Wisata Desa</h2>
          </div>

          {wisataList.map((spot) => (
            <div key={spot.id} className="wisata-card-banner">
              <img src={spot.gambar} alt={spot.nama_tempat} className="wisata-img" />
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
    </div>
  );
}
