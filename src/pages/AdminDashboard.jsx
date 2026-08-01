import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Trash2, Edit3, Check, X, FileText, Newspaper, ShoppingBag, LogOut, Upload, Image as ImageIcon, Star, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { apiService, isSupabaseConfigured } from '../lib/supabaseClient';

export default function AdminDashboard({ adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('permohonan');
  
  // Data States
  const [permohonanList, setPermohonanList] = useState([]);
  const [beritaList, setBeritaList] = useState([]);
  const [umkmList, setUmkmList] = useState([]);

  // Multiple Image Upload State for Berita
  const [newJudul, setNewJudul] = useState('');
  const [newKategori, setNewKategori] = useState('Pembangunan');
  const [newRingkasan, setNewRingkasan] = useState('');
  const [newIsi, setNewIsi] = useState('');
  
  // Image List: Array of objects { id, url, isCover }
  const [imagesList, setImagesList] = useState([]);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Form States for UMKM
  const [newProdukNama, setNewProdukNama] = useState('');
  const [newProdukKategori, setNewProdukKategori] = useState('Olahan Madu');
  const [newProdukPembuat, setNewProdukPembuat] = useState('');
  const [newProdukHarga, setNewProdukHarga] = useState('');
  const [newProdukWa, setNewProdukWa] = useState('');
  const [newProdukGambar, setNewProdukGambar] = useState('');
  const [newProdukDesc, setNewProdukDesc] = useState('');

  // Status Note Modal
  const [selectedPermohonan, setSelectedPermohonan] = useState(null);
  const [catatanText, setCatatanText] = useState('');
  const [targetStatus, setTargetStatus] = useState('Diproses');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const pData = await apiService.getPermohonan();
    const bData = await apiService.getBerita();
    const uData = await apiService.getUMKM();
    setPermohonanList(pData);
    setBeritaList(bData);
    setUmkmList(uData);
  };

  // --- MULTIPLE IMAGE HANDLING LOGIC ---
  const handleFilesAdded = (files) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImg = {
            id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            url: e.target.result,
            isCover: false
          };
          setImagesList(prev => {
            // If it's the very first image, set as cover automatically
            const shouldBeCover = prev.length === 0;
            return [...prev, { ...newImg, isCover: shouldBeCover }];
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    const newImg = {
      id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      url: manualUrlInput.trim(),
      isCover: imagesList.length === 0
    };
    setImagesList(prev => [...prev, newImg]);
    setManualUrlInput('');
  };

  const handleSetCover = (id) => {
    setImagesList(prev => prev.map(img => ({
      ...img,
      isCover: img.id === id
    })));
  };

  const handleDeleteImage = (id) => {
    setImagesList(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // If deleted image was cover and there are remaining images, set first as cover
      if (filtered.length > 0 && !filtered.some(img => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleMoveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= imagesList.length) return;
    const updated = [...imagesList];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setImagesList(updated);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  // --- BERITA CREATE ACTION ---
  const handleCreateBerita = async (e) => {
    e.preventDefault();

    // Determine Cover Image & Gallery Array
    const coverObj = imagesList.find(img => img.isCover) || imagesList[0];
    const coverUrl = coverObj ? coverObj.url : 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80';
    const galeriUrls = imagesList.map(img => img.url);

    await apiService.addBerita({
      judul: newJudul,
      kategori: newKategori,
      ringkasan: newRingkasan,
      isi: newIsi,
      gambar: coverUrl,
      galeri: galeriUrls.length > 0 ? galeriUrls : [coverUrl],
      penulis: 'Admin Tajemsari'
    });

    // Reset Form
    setNewJudul('');
    setNewRingkasan('');
    setNewIsi('');
    setImagesList([]);
    loadAllData();
  };

  const handleDeleteBerita = async (id) => {
    if (window.confirm("Yakin ingin menghapus berita ini?")) {
      await apiService.deleteBerita(id);
      loadAllData();
    }
  };

  // Permohonan Action
  const handleOpenStatusModal = (item, status) => {
    setSelectedPermohonan(item);
    setTargetStatus(status);
    setCatatanText(item.catatan_admin || '');
  };

  const handleUpdatePermohonanStatus = async () => {
    if (!selectedPermohonan) return;
    await apiService.updateStatusPermohonan(selectedPermohonan.id, targetStatus, catatanText);
    setSelectedPermohonan(null);
    loadAllData();
  };

  // UMKM Action
  const handleCreateUMKM = async (e) => {
    e.preventDefault();
    await apiService.addUMKM({
      nama_produk: newProdukNama,
      kategori: newProdukKategori,
      pembuat: newProdukPembuat,
      harga: newProdukHarga,
      wa_seller: newProdukWa,
      deskripsi: newProdukDesc,
      gambar: newProdukGambar || 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80'
    });
    setNewProdukNama('');
    setNewProdukPembuat('');
    setNewProdukHarga('');
    setNewProdukWa('');
    setNewProdukDesc('');
    setNewProdukGambar('');
    loadAllData();
  };

  return (
    <div className="admin-page section-padding animate-fade-in" style={{ background: '#f8faf8', minHeight: '80vh' }}>
      <style>{`
        .admin-header-bar {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .admin-nav-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid var(--color-border);
          padding-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 0.65rem 1.25rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          background: transparent;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab-btn.active {
          background: var(--color-primary);
          color: #ffffff;
        }

        .dropzone-box {
          border: 2px dashed #cbd5e1;
          background: #f8faf8;
          border-radius: 14px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 1.25rem;
        }

        .dropzone-box.dragging {
          border-color: var(--color-primary);
          background: var(--color-primary-soft);
        }

        .image-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
        }

        .image-preview-card {
          position: relative;
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }

        .image-preview-card.is-cover {
          border-color: var(--color-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.3);
        }

        .preview-img-thumb {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }

        .cover-tag-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: var(--color-gold);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .preview-card-actions {
          padding: 0.4rem;
          background: #f8faf8;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #f1f5f9;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
        }

        .data-table th {
          background: #f1f5f9;
          color: var(--color-primary-dark);
          text-align: left;
          padding: 1rem;
          font-size: 0.88rem;
          font-family: var(--font-heading);
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.88rem;
        }
      `}</style>

      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 52, height: 52, background: 'var(--color-gold)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)' }}>Panel Pengelolaan Desa Tajemsari</h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Login sebagai: <strong>{adminUser?.email || 'admin@tajemsari.desa.id'}</strong></span>
                <span className="badge-gold">
                  {isSupabaseConfigured ? 'Cloud Supabase' : 'Local Demo Mode'}
                </span>
              </div>
            </div>
          </div>

          <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#dc2626' }} onClick={onLogout}>
            <LogOut size={16} /> Keluar Admin
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button className={`tab-btn ${activeTab === 'permohonan' ? 'active' : ''}`} onClick={() => setActiveTab('permohonan')}>
            <FileText size={18} /> Pengajuan Surat Warga ({permohonanList.length})
          </button>
          <button className={`tab-btn ${activeTab === 'berita' ? 'active' : ''}`} onClick={() => setActiveTab('berita')}>
            <Newspaper size={18} /> Kelola Berita Desa
          </button>
          <button className={`tab-btn ${activeTab === 'umkm' ? 'active' : ''}`} onClick={() => setActiveTab('umkm')}>
            <ShoppingBag size={18} /> Kelola UMKM Desa
          </button>
        </div>

        {/* TAB 1: PERMOHONAN SURAT */}
        {activeTab === 'permohonan' && (
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
              Daftar Masuk Permohonan Surat Warga
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tiket & Tanggal</th>
                    <th>Nama & NIK Warga</th>
                    <th>Jenis Surat</th>
                    <th>Keperluan</th>
                    <th>Status</th>
                    <th>Aksi Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {permohonanList.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.nomor_tiket}</strong><br />
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.tanggal_pengajuan}</span>
                      </td>
                      <td>
                        <strong>{item.nama_warga}</strong><br />
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>NIK: {item.nik} • HP: {item.no_hp}</span>
                      </td>
                      <td>
                        <span className="badge-green">{item.jenis_surat}</span>
                      </td>
                      <td style={{ maxWidth: 220 }}>{item.keperluan}</td>
                      <td>
                        <span className={item.status === 'Selesai' ? 'badge-green' : 'badge-gold'}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button 
                            style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer' }}
                            onClick={() => handleOpenStatusModal(item, 'Diproses')}
                          >
                            Proses
                          </button>
                          <button 
                            style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer' }}
                            onClick={() => handleOpenStatusModal(item, 'Selesai')}
                          >
                            Setujui
                          </button>
                          <button 
                            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer' }}
                            onClick={() => handleOpenStatusModal(item, 'Ditolak')}
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: KELOLA BERITA (MULTIPLE IMAGE UPLOAD SUPPORT) */}
        {activeTab === 'berita' && (
          <div className="grid-2">
            <div className="card-rural">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
                Tambah Berita / Pengumuman Baru
              </h3>
              <form onSubmit={handleCreateBerita}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Judul Berita</label>
                  <input type="text" className="form-input-custom" value={newJudul} onChange={(e) => setNewJudul(e.target.value)} placeholder="Contoh: Perbaikan Saluran Irigasi Sawah Tajem" required />
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Kategori</label>
                  <select className="form-input-custom" value={newKategori} onChange={(e) => setNewKategori(e.target.value)}>
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Ekonomi">Ekonomi & BLT</option>
                    <option value="Pertanian">Pertanian</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Ringkasan Singkat</label>
                  <textarea className="form-input-custom" rows={2} value={newRingkasan} onChange={(e) => setNewRingkasan(e.target.value)} required />
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Isi Lengkap Berita</label>
                  <textarea className="form-input-custom" rows={4} value={newIsi} onChange={(e) => setNewIsi(e.target.value)} required />
                </div>

                {/* --- MULTIPLE IMAGE UPLOAD ZONE --- */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'block', marginBottom: '0.4rem' }}>
                    Foto Utama & Galeri Dokumentasi (Multiple Image Upload)
                  </label>

                  {/* Drag & Drop Box */}
                  <div 
                    className={`dropzone-box ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('multi-file-input').click()}
                  >
                    <Upload size={32} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      Tarik & Lepas beberapa foto ke sini, atau klik untuk memilih
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Mendukung JPG, PNG, WEBP (Bisa pilih lebih dari 1 foto sekaligus)
                    </span>
                    <input 
                      type="file" 
                      id="multi-file-input" 
                      multiple 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFilesAdded(e.target.files)}
                    />
                  </div>

                  {/* Input Manual URL Foto jika tidak via Upload */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input 
                      type="url" 
                      className="form-input-custom" 
                      style={{ marginTop: 0 }}
                      placeholder="Atau tempel URL gambar (https://...)" 
                      value={manualUrlInput}
                      onChange={(e) => setManualUrlInput(e.target.value)}
                    />
                    <button 
                      type="button" 
                      className="btn btn-outline" 
                      style={{ padding: '0 0.85rem', fontSize: '0.8rem' }}
                      onClick={handleAddManualUrl}
                    >
                      + Tambah URL
                    </button>
                  </div>

                  {/* Uploaded Images Preview Grid & Reorder Controls */}
                  {imagesList.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                        Daftar Foto Terunggah ({imagesList.length}): Klik bintang untuk menjadikan Cover Utama
                      </div>

                      <div className="image-preview-grid">
                        {imagesList.map((img, idx) => (
                          <div key={img.id} className={`image-preview-card ${img.isCover ? 'is-cover' : ''}`}>
                            <img src={img.url} alt={`Foto ${idx+1}`} className="preview-img-thumb" />
                            
                            {img.isCover && (
                              <div className="cover-tag-badge">
                                <Star size={10} fill="#fff" /> COVER UTAMA
                              </div>
                            )}

                            <div className="preview-card-actions">
                              {!img.isCover && (
                                <button 
                                  type="button" 
                                  title="Jadikan Cover Utama"
                                  style={{ background: 'transparent', border: 'none', color: 'var(--color-gold)', cursor: 'pointer' }}
                                  onClick={() => handleSetCover(img.id)}
                                >
                                  <Star size={14} />
                                </button>
                              )}

                              <div style={{ display: 'flex', gap: 2 }}>
                                <button 
                                  type="button"
                                  disabled={idx === 0}
                                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                                  onClick={() => handleMoveImage(idx, -1)}
                                >
                                  <ArrowUp size={14} />
                                </button>
                                <button 
                                  type="button"
                                  disabled={idx === imagesList.length - 1}
                                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: idx === imagesList.length - 1 ? 0.3 : 1 }}
                                  onClick={() => handleMoveImage(idx, 1)}
                                >
                                  <ArrowDown size={14} />
                                </button>
                              </div>

                              <button 
                                type="button" 
                                title="Hapus Gambar"
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                onClick={() => handleDeleteImage(img.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Plus size={18} /> Terbitkan Berita Baru
                </button>
              </form>
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                Daftar Berita Terpublikasi
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {beritaList.map((item) => (
                  <div key={item.id} style={{ background: '#fff', padding: '1rem', borderRadius: 12, border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                      <img src={item.gambar} alt={item.judul} style={{ width: 54, height: 54, borderRadius: 8, objectFit: 'cover' }} />
                      <div>
                        <span className="badge-gold" style={{ fontSize: '0.72rem' }}>{item.kategori}</span>
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', marginTop: 2 }}>{item.judul}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {item.tanggal} • {item.galeri ? item.galeri.length : 1} Foto
                        </span>
                      </div>
                    </div>
                    <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: 8, cursor: 'pointer' }} onClick={() => handleDeleteBerita(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KELOLA UMKM */}
        {activeTab === 'umkm' && (
          <div className="grid-2">
            <div className="card-rural">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
                Tambah Produk UMKM Desa
              </h3>
              <form onSubmit={handleCreateUMKM}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Nama Produk</label>
                  <input type="text" className="form-input-custom" value={newProdukNama} onChange={(e) => setNewProdukNama(e.target.value)} placeholder="Kopi Robusta Sawah Tajem" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Kategori</label>
                    <select className="form-input-custom" value={newProdukKategori} onChange={(e) => setNewProdukKategori(e.target.value)}>
                      <option value="Olahan Madu">Olahan Madu</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Kerajinan">Kerajinan</option>
                      <option value="Hasil Tani">Hasil Tani</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Harga</label>
                    <input type="text" className="form-input-custom" value={newProdukHarga} onChange={(e) => setNewProdukHarga(e.target.value)} placeholder="Rp 25.000" required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Nama Pembuat / Penjual</label>
                    <input type="text" className="form-input-custom" value={newProdukPembuat} onChange={(e) => setNewProdukPembuat(e.target.value)} placeholder="Pak Warsito" required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>No. WhatsApp (Tanpa +)</label>
                    <input type="text" className="form-input-custom" value={newProdukWa} onChange={(e) => setNewProdukWa(e.target.value)} placeholder="6281234567890" required />
                  </div>
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Deskripsi Produk</label>
                  <textarea className="form-input-custom" rows={3} value={newProdukDesc} onChange={(e) => setNewProdukDesc(e.target.value)} required />
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>
                  <Plus size={18} /> Tambah Katalog UMKM
                </button>
              </form>
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                Katalog Produk Terdaftar
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {umkmList.map((item) => (
                  <div key={item.id} style={{ background: '#fff', padding: '1rem', borderRadius: 12, border: '1px solid var(--color-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={item.gambar} alt={item.nama_produk} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-dark)' }}>{item.nama_produk}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700 }}>{item.harga}</span> • <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Oleh: {item.pembuat}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Status Note */}
      {selectedPermohonan && (
        <div className="modal-overlay" onClick={() => setSelectedPermohonan(null)}>
          <div className="modal-content" style={{ padding: '1.75rem', maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Ubah Status Pengajuan ({selectedPermohonan.nomor_tiket})
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Status baru: <strong style={{ color: 'var(--color-primary)' }}>{targetStatus}</strong>
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Catatan Petugas (Tampil untuk warga)</label>
              <textarea 
                className="form-input-custom"
                rows={3}
                value={catatanText}
                onChange={(e) => setCatatanText(e.target.value)}
                placeholder="Contoh: Berkas siap diambil di loket Balai Desa..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdatePermohonanStatus}>
                Simpan Perubahan
              </button>
              <button className="btn btn-outline" onClick={() => setSelectedPermohonan(null)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
