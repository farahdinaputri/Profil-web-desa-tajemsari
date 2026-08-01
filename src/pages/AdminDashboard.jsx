import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Plus, Trash2, Edit3, Check, X, FileText, Newspaper, 
  ShoppingBag, LogOut, Upload, Image as ImageIcon, Star, ArrowUp, 
  ArrowDown, Sparkles, MessageSquare, Compass, MapPin, Clock, Ticket
} from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function AdminDashboard({ adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('permohonan');
  
  // Data States
  const [permohonanList, setPermohonanList] = useState([]);
  const [beritaList, setBeritaList] = useState([]);
  const [umkmList, setUmkmList] = useState([]);
  const [wisataList, setWisataList] = useState([]);

  // --- BERITA FORM STATES (CREATE & EDIT) ---
  const [editingBeritaId, setEditingBeritaId] = useState(null);
  const [newJudul, setNewJudul] = useState('');
  const [newKategori, setNewKategori] = useState('Pembangunan');
  const [newRingkasan, setNewRingkasan] = useState('');
  const [newIsi, setNewIsi] = useState('');
  const [beritaImagesList, setBeritaImagesList] = useState([]);
  const [isDraggingBerita, setIsDraggingBerita] = useState(false);

  // --- UMKM FORM STATES (CREATE & EDIT + MULTI IMAGE) ---
  const [editingUmkmId, setEditingUmkmId] = useState(null);
  const [newProdukNama, setNewProdukNama] = useState('');
  const [newProdukKategori, setNewProdukKategori] = useState('Olahan Madu');
  const [newProdukPembuat, setNewProdukPembuat] = useState('');
  const [newProdukHarga, setNewProdukHarga] = useState('');
  const [newProdukWa, setNewProdukWa] = useState('');
  const [newProdukDesc, setNewProdukDesc] = useState('');
  const [umkmImagesList, setUmkmImagesList] = useState([]);
  const [isDraggingUmkm, setIsDraggingUmkm] = useState(false);

  // --- WISATA FORM STATES (CREATE & EDIT + MULTI IMAGE) ---
  const [editingWisataId, setEditingWisataId] = useState(null);
  const [newWisataNama, setNewWisataNama] = useState('');
  const [newWisataKategori, setNewWisataKategori] = useState('Wisata Alam');
  const [newWisataLokasi, setNewWisataLokasi] = useState('');
  const [newWisataJamBuka, setNewWisataJamBuka] = useState('');
  const [newWisataTiket, setNewWisataTiket] = useState('');
  const [newWisataDesc, setNewWisataDesc] = useState('');
  const [wisataImagesList, setWisataImagesList] = useState([]);
  const [isDraggingWisata, setIsDraggingWisata] = useState(false);

  // Status Note Modal for Permohonan
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
    const wData = await apiService.getWisata();
    setPermohonanList(pData);
    setBeritaList(bData);
    setUmkmList(uData);
    setWisataList(wData);
  };

  // ==========================================
  // BERITA MULTI-IMAGE LOGIC
  // ==========================================
  const handleBeritaFilesAdded = (files) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImg = {
            id: 'b_img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            url: e.target.result,
            caption: 'Dokumentasi kegiatan Desa Tajemsari Tegowanu',
            isCover: false
          };
          setBeritaImagesList(prev => {
            const shouldBeCover = prev.length === 0;
            return [...prev, { ...newImg, isCover: shouldBeCover }];
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleBeritaCaptionChange = (id, caption) => {
    setBeritaImagesList(prev => prev.map(img => img.id === id ? { ...img, caption } : img));
  };

  const handleBeritaSetCover = (id) => {
    setBeritaImagesList(prev => prev.map(img => ({ ...img, isCover: img.id === id })));
  };

  const handleBeritaDeleteImage = (id) => {
    setBeritaImagesList(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleBeritaMoveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= beritaImagesList.length) return;
    const updated = [...beritaImagesList];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setBeritaImagesList(updated);
  };

  const handleEditBeritaClick = (item) => {
    setEditingBeritaId(item.id);
    setNewJudul(item.judul || '');
    setNewKategori(item.kategori || 'Pembangunan');
    setNewRingkasan(item.ringkasan || '');
    setNewIsi(item.isi || '');

    if (Array.isArray(item.galeri) && item.galeri.length > 0) {
      const formatted = item.galeri.map((g, idx) => ({
        id: 'b_img_' + idx + '_' + Date.now(),
        url: typeof g === 'string' ? g : g.url,
        caption: typeof g === 'object' && g.caption ? g.caption : 'Dokumentasi Berita',
        isCover: (typeof g === 'string' ? g : g.url) === item.gambar || idx === 0
      }));
      setBeritaImagesList(formatted);
    } else if (item.gambar) {
      setBeritaImagesList([{
        id: 'b_img_0_' + Date.now(),
        url: item.gambar,
        caption: 'Foto Utama Berita',
        isCover: true
      }]);
    } else {
      setBeritaImagesList([]);
    }

    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handleCancelEditBerita = () => {
    setEditingBeritaId(null);
    setNewJudul('');
    setNewKategori('Pembangunan');
    setNewRingkasan('');
    setNewIsi('');
    setBeritaImagesList([]);
  };

  const handleSaveBerita = async (e) => {
    e.preventDefault();
    const coverObj = beritaImagesList.find(img => img.isCover) || beritaImagesList[0];
    const coverUrl = coverObj ? coverObj.url : 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80';

    const galeriObjects = beritaImagesList.map(img => ({
      url: img.url,
      caption: img.caption || 'Dokumentasi kegiatan Desa Tajemsari'
    }));

    const payload = {
      judul: newJudul,
      kategori: newKategori,
      ringkasan: newRingkasan,
      isi: newIsi,
      gambar: coverUrl,
      galeri: galeriObjects
    };

    if (editingBeritaId) {
      await apiService.updateBerita(editingBeritaId, payload);
    } else {
      await apiService.addBerita(payload);
    }

    handleCancelEditBerita();
    loadAllData();
  };

  const handleDeleteBerita = async (id) => {
    if (window.confirm('Yakin ingin menghapus berita ini secara permanen?')) {
      await apiService.deleteBerita(id);
      loadAllData();
    }
  };

  // ==========================================
  // UMKM MULTI-IMAGE & CRUD LOGIC
  // ==========================================
  const handleUmkmFilesAdded = (files) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImg = {
            id: 'u_img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            url: e.target.result,
            caption: 'Foto Produk UMKM Desa Tajemsari',
            isCover: false
          };
          setUmkmImagesList(prev => {
            const shouldBeCover = prev.length === 0;
            return [...prev, { ...newImg, isCover: shouldBeCover }];
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleUmkmCaptionChange = (id, caption) => {
    setUmkmImagesList(prev => prev.map(img => img.id === id ? { ...img, caption } : img));
  };

  const handleUmkmSetCover = (id) => {
    setUmkmImagesList(prev => prev.map(img => ({ ...img, isCover: img.id === id })));
  };

  const handleUmkmDeleteImage = (id) => {
    setUmkmImagesList(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleUmkmMoveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= umkmImagesList.length) return;
    const updated = [...umkmImagesList];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setUmkmImagesList(updated);
  };

  const handleEditUmkmClick = (item) => {
    setEditingUmkmId(item.id);
    setNewProdukNama(item.nama_produk || '');
    setNewProdukKategori(item.kategori || 'Olahan Madu');
    setNewProdukHarga(item.harga || '');
    setNewProdukPembuat(item.pembuat || '');
    setNewProdukWa(item.wa_seller || '');
    setNewProdukDesc(item.deskripsi || '');

    if (Array.isArray(item.galeri) && item.galeri.length > 0) {
      const formatted = item.galeri.map((g, idx) => ({
        id: 'u_img_' + idx + '_' + Date.now(),
        url: typeof g === 'string' ? g : g.url,
        caption: typeof g === 'object' && g.caption ? g.caption : 'Foto Produk UMKM',
        isCover: (typeof g === 'string' ? g : g.url) === item.gambar || idx === 0
      }));
      setUmkmImagesList(formatted);
    } else if (item.gambar) {
      setUmkmImagesList([{
        id: 'u_img_0_' + Date.now(),
        url: item.gambar,
        caption: 'Foto Utama Produk',
        isCover: true
      }]);
    } else {
      setUmkmImagesList([]);
    }

    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handleCancelEditUmkm = () => {
    setEditingUmkmId(null);
    setNewProdukNama('');
    setNewProdukKategori('Olahan Madu');
    setNewProdukHarga('');
    setNewProdukPembuat('');
    setNewProdukWa('');
    setNewProdukDesc('');
    setUmkmImagesList([]);
  };

  const handleSaveUmkm = async (e) => {
    e.preventDefault();
    const coverObj = umkmImagesList.find(img => img.isCover) || umkmImagesList[0];
    const coverUrl = coverObj ? coverObj.url : 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80';

    const galeriObjects = umkmImagesList.map(img => ({
      url: img.url,
      caption: img.caption || 'Foto Produk UMKM Desa Tajemsari'
    }));

    const payload = {
      nama_produk: newProdukNama,
      kategori: newProdukKategori,
      harga: newProdukHarga,
      pembuat: newProdukPembuat,
      wa_seller: newProdukWa,
      deskripsi: newProdukDesc,
      gambar: coverUrl,
      galeri: galeriObjects
    };

    if (editingUmkmId) {
      await apiService.updateUMKM(editingUmkmId, payload);
    } else {
      await apiService.addUMKM(payload);
    }

    handleCancelEditUmkm();
    loadAllData();
  };

  const handleDeleteUmkm = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk UMKM ini secara permanen?')) {
      await apiService.deleteUMKM(id);
      loadAllData();
    }
  };

  // ==========================================
  // WISATA MULTI-IMAGE & CRUD LOGIC
  // ==========================================
  const handleWisataFilesAdded = (files) => {
    const fileArray = Array.from(files);
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImg = {
            id: 'w_img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            url: e.target.result,
            caption: 'Dokumentasi Wisata Desa Tajemsari',
            isCover: false
          };
          setWisataImagesList(prev => {
            const shouldBeCover = prev.length === 0;
            return [...prev, { ...newImg, isCover: shouldBeCover }];
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleWisataCaptionChange = (id, caption) => {
    setWisataImagesList(prev => prev.map(img => img.id === id ? { ...img, caption } : img));
  };

  const handleWisataSetCover = (id) => {
    setWisataImagesList(prev => prev.map(img => ({ ...img, isCover: img.id === id })));
  };

  const handleWisataDeleteImage = (id) => {
    setWisataImagesList(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const handleWisataMoveImage = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= wisataImagesList.length) return;
    const updated = [...wisataImagesList];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setWisataImagesList(updated);
  };

  const handleEditWisataClick = (item) => {
    setEditingWisataId(item.id);
    setNewWisataNama(item.nama_tempat || '');
    setNewWisataKategori(item.kategori || 'Wisata Alam');
    setNewWisataLokasi(item.lokasi || '');
    setNewWisataJamBuka(item.jam_buka || '');
    setNewWisataTiket(item.tiket_masuk || '');
    setNewWisataDesc(item.deskripsi || '');

    if (Array.isArray(item.galeri) && item.galeri.length > 0) {
      const formatted = item.galeri.map((g, idx) => ({
        id: 'w_img_' + idx + '_' + Date.now(),
        url: typeof g === 'string' ? g : g.url,
        caption: typeof g === 'object' && g.caption ? g.caption : 'Foto Destinasi Wisata',
        isCover: (typeof g === 'string' ? g : g.url) === item.gambar || idx === 0
      }));
      setWisataImagesList(formatted);
    } else if (item.gambar) {
      setWisataImagesList([{
        id: 'w_img_0_' + Date.now(),
        url: item.gambar,
        caption: 'Foto Utama Destinasi',
        isCover: true
      }]);
    } else {
      setWisataImagesList([]);
    }

    window.scrollTo({ top: 250, behavior: 'smooth' });
  };

  const handleCancelEditWisata = () => {
    setEditingWisataId(null);
    setNewWisataNama('');
    setNewWisataKategori('Wisata Alam');
    setNewWisataLokasi('');
    setNewWisataJamBuka('');
    setNewWisataTiket('');
    setNewWisataDesc('');
    setWisataImagesList([]);
  };

  const handleSaveWisata = async (e) => {
    e.preventDefault();
    const coverObj = wisataImagesList.find(img => img.isCover) || wisataImagesList[0];
    const coverUrl = coverObj ? coverObj.url : 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80';

    const galeriObjects = wisataImagesList.map(img => ({
      url: img.url,
      caption: img.caption || 'Dokumentasi Wisata Desa Tajemsari'
    }));

    const payload = {
      nama_tempat: newWisataNama,
      kategori: newWisataKategori,
      lokasi: newWisataLokasi,
      jam_buka: newWisataJamBuka,
      tiket_masuk: newWisataTiket,
      deskripsi: newWisataDesc,
      gambar: coverUrl,
      galeri: galeriObjects
    };

    if (editingWisataId) {
      await apiService.updateWisata(editingWisataId, payload);
    } else {
      await apiService.addWisata(payload);
    }

    handleCancelEditWisata();
    loadAllData();
  };

  const handleDeleteWisata = async (id) => {
    if (window.confirm('Yakin ingin menghapus destinasi wisata ini secara permanen?')) {
      await apiService.deleteWisata(id);
      loadAllData();
    }
  };

  // ==========================================
  // PERMOHONAN STATUS MODAL LOGIC
  // ==========================================
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

  return (
    <div className="admin-page section-padding animate-fade-in" style={{ background: '#f8faf8', minHeight: '85vh' }}>
      <style>{`
        .admin-header-bar {
          background: #ffffff;
          border-radius: 20px;
          padding: 1.75rem 2rem;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .admin-nav-tabs {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid var(--color-border);
          padding-bottom: 0.75rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 0.75rem 1.4rem;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.92rem;
          color: var(--color-text-muted);
          background: transparent;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          transition: var(--transition-fast);
        }

        .tab-btn.active {
          background: var(--color-primary);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25);
        }

        .editing-banner {
          background: linear-gradient(135deg, #fef9e7 0%, #fffdf5 100%);
          border: 1.5px solid var(--color-gold);
          border-radius: 14px;
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
        }

        .dropzone-box {
          border: 2px dashed #cbd5e1;
          background: #ffffff;
          border-radius: 16px;
          padding: 1.75rem 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 1.25rem;
        }

        .dropzone-box:hover, .dropzone-box.dragging {
          border-color: var(--color-primary);
          background: var(--color-primary-soft);
        }

        .image-preview-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          margin-top: 1rem;
          margin-bottom: 1.5rem;
        }

        .image-preview-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          background: #ffffff;
          border-radius: 14px;
          padding: 0.85rem;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .image-preview-row.is-cover {
          border-color: var(--color-gold);
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.3);
          background: #fffdf5;
        }

        .preview-img-square {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
        }

        .cover-tag-badge {
          background: var(--color-gold);
          color: #ffffff;
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .admin-item-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.25rem;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .admin-item-card:hover {
          border-color: rgba(46, 125, 50, 0.3);
          box-shadow: var(--shadow-md);
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
            <div style={{ width: 48, height: 48, background: 'var(--color-gold)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)' }}>Panel Pengelolaan Desa Tajemsari</h1>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Admin Login: <strong>{adminUser?.email || 'admin@tajemsari.desa.id'}</strong></span>
                <span className="badge-gold">Super Admin</span>
              </div>
            </div>
          </div>

          <button className="btn btn-outline" style={{ borderColor: '#ef4444', color: '#ef4444' }} onClick={onLogout}>
            <LogOut size={16} /> Keluar Admin
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button className={`tab-btn ${activeTab === 'permohonan' ? 'active' : ''}`} onClick={() => setActiveTab('permohonan')}>
            <FileText size={18} /> Pengajuan Surat Warga ({permohonanList.length})
          </button>
          <button className={`tab-btn ${activeTab === 'berita' ? 'active' : ''}`} onClick={() => setActiveTab('berita')}>
            <Newspaper size={18} /> Kelola Berita Desa ({beritaList.length})
          </button>
          <button className={`tab-btn ${activeTab === 'umkm' ? 'active' : ''}`} onClick={() => setActiveTab('umkm')}>
            <ShoppingBag size={18} /> Kelola UMKM Desa ({umkmList.length})
          </button>
          <button className={`tab-btn ${activeTab === 'wisata' ? 'active' : ''}`} onClick={() => setActiveTab('wisata')}>
            <Compass size={18} /> Kelola Wisata Desa ({wisataList.length})
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
                    <th>Nama & Detail Pemohon</th>
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
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          NIK: {item.nik} • HP: {item.no_hp}<br />
                          Alamat: {item.alamat_lengkap || item.rt_rw || '-'}
                        </span>
                      </td>
                      <td>
                        <span className="badge-green">{item.jenis_surat}</span>
                      </td>
                      <td style={{ maxWidth: 220 }}>{item.keperluan}</td>
                      <td>
                        <span className={item.status === 'Selesai' ? 'badge-green' : item.status === 'Ditolak' ? 'badge-gold' : 'badge-gold'}>
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

        {/* TAB 2: KELOLA BERITA DESA (FULL CRUD & MULTI-IMAGE) */}
        {activeTab === 'berita' && (
          <div className="grid-2">
            {/* Form Create / Edit Berita */}
            <div className="card-rural">
              {editingBeritaId ? (
                <div className="editing-banner">
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8a6d13', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Edit3 size={16} /> Sedang Mengedit Berita: <strong>"{newJudul || 'Tanpa Judul'}"</strong>
                  </div>
                  <button 
                    onClick={handleCancelEditBerita}
                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.3rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Batal Edit
                  </button>
                </div>
              ) : (
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
                  ✨ Tambah Berita / Pengumuman Baru
                </h3>
              )}

              <form onSubmit={handleSaveBerita}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Judul Berita *</label>
                  <input 
                    type="text" 
                    className="form-input-custom" 
                    value={newJudul} 
                    onChange={(e) => setNewJudul(e.target.value)} 
                    placeholder="Contoh: Perbaikan Saluran Irigasi Sawah Dusun Tajem" 
                    required 
                  />
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Kategori Berita *</label>
                  <select 
                    className="form-input-custom" 
                    value={newKategori} 
                    onChange={(e) => setNewKategori(e.target.value)}
                  >
                    <option value="Pembangunan">Pembangunan</option>
                    <option value="Ekonomi">Ekonomi</option>
                    <option value="Pertanian">Pertanian</option>
                    <option value="Kesehatan">Kesehatan</option>
                  </select>
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Ringkasan Singkat (Awal) *</label>
                  <textarea 
                    className="form-input-custom" 
                    rows={2} 
                    value={newRingkasan} 
                    onChange={(e) => setNewRingkasan(e.target.value)} 
                    placeholder="Ringkasan 1-2 kalimat untuk preview..." 
                    required 
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Isi Lengkap Berita *</label>
                  <textarea 
                    className="form-input-custom" 
                    rows={5} 
                    value={newIsi} 
                    onChange={(e) => setNewIsi(e.target.value)} 
                    placeholder="Tuliskan berita lengkap..." 
                    required 
                  />
                </div>

                {/* Multiple Image Upload Zone */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'block', marginBottom: 4 }}>
                    Foto Utama & Galeri Dokumentasi (Multiple Upload)
                  </label>
                  
                  <div 
                    className={`dropzone-box ${isDraggingBerita ? 'dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingBerita(true); }}
                    onDragLeave={() => setIsDraggingBerita(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingBerita(false);
                      if (e.dataTransfer.files?.length) handleBeritaFilesAdded(e.dataTransfer.files);
                    }}
                    onClick={() => document.getElementById('berita-file-input').click()}
                  >
                    <Upload size={30} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                    <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.92rem', display: 'block' }}>
                      Tarik & Lepas foto ke sini, atau klik untuk memilih file
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Unggah beberapa foto sekaligus (JPG, PNG, WEBP)
                    </span>

                    <input 
                      id="berita-file-input"
                      type="file" 
                      multiple 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleBeritaFilesAdded(e.target.files)}
                    />
                  </div>

                  {/* List Foto Berita */}
                  {beritaImagesList.length > 0 && (
                    <div className="image-preview-list">
                      {beritaImagesList.map((img, idx) => (
                        <div key={img.id} className={`image-preview-row ${img.isCover ? 'is-cover' : ''}`}>
                          <img src={img.url} alt={`Foto ${idx+1}`} className="preview-img-square" />
                          
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {img.isCover ? (
                                <span className="cover-tag-badge">
                                  <Star size={10} fill="#fff" /> COVER UTAMA
                                </span>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => handleBeritaSetCover(img.id)}
                                  style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: '#8a6d13', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                                >
                                  Jadikan Cover
                                </button>
                              )}
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Foto #{idx+1}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <MessageSquare size={14} color="var(--color-text-muted)" />
                              <input 
                                type="text"
                                className="form-input-custom"
                                style={{ marginTop: 0, padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                                placeholder="Ketik keterangan/caption foto..."
                                value={img.caption || ''}
                                onChange={(e) => handleBeritaCaptionChange(img.id, e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 2 }}>
                              <button 
                                type="button"
                                disabled={idx === 0}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: 4, padding: '0.2rem', cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                                onClick={() => handleBeritaMoveImage(idx, -1)}
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button 
                                type="button"
                                disabled={idx === beritaImagesList.length - 1}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: 4, padding: '0.2rem', cursor: 'pointer', opacity: idx === beritaImagesList.length - 1 ? 0.3 : 1 }}
                                onClick={() => handleBeritaMoveImage(idx, 1)}
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                            <button 
                              type="button" 
                              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '0.25rem 0.4rem', cursor: 'pointer' }}
                              onClick={() => handleBeritaDeleteImage(img.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>
                  {editingBeritaId ? <><Check size={18} /> Simpan Perubahan Berita</> : <><Plus size={18} /> Publikasikan Berita</>}
                </button>
              </form>
            </div>

            {/* List Berita Terpublikasi */}
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                Daftar Berita Terpublikasi ({beritaList.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {beritaList.map((item) => (
                  <div key={item.id} className="admin-item-card">
                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flex: 1 }}>
                      <img src={item.gambar} alt={item.judul} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} />
                      <div>
                        <span className="badge-gold" style={{ fontSize: '0.72rem' }}>{item.kategori}</span>
                        <h4 style={{ fontSize: '0.98rem', color: 'var(--color-primary-dark)', marginTop: 2, marginBottom: 2 }}>{item.judul}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {item.tanggal} • {Array.isArray(item.galeri) ? item.galeri.length : 1} Foto Ber-caption
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 600 }} 
                        onClick={() => handleEditBeritaClick(item)}
                        title="Edit Berita"
                      >
                        <Edit3 size={15} /> Edit
                      </button>
                      <button 
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: 8, cursor: 'pointer' }} 
                        onClick={() => handleDeleteBerita(item.id)}
                        title="Hapus Berita"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KELOLA UMKM DESA (FULL CRUD & MULTI-IMAGE UPLOAD) */}
        {activeTab === 'umkm' && (
          <div className="grid-2">
            {/* Form Create / Edit UMKM */}
            <div className="card-rural">
              {editingUmkmId ? (
                <div className="editing-banner">
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8a6d13', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Edit3 size={16} /> Sedang Mengedit UMKM: <strong>"{newProdukNama || 'Tanpa Nama'}"</strong>
                  </div>
                  <button 
                    onClick={handleCancelEditUmkm}
                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.3rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Batal Edit
                  </button>
                </div>
              ) : (
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
                  🛍️ Tambah Produk UMKM Baru
                </h3>
              )}

              <form onSubmit={handleSaveUmkm}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Nama Produk *</label>
                  <input 
                    type="text" 
                    className="form-input-custom" 
                    value={newProdukNama} 
                    onChange={(e) => setNewProdukNama(e.target.value)} 
                    placeholder="Contoh: Madu Murni Klanceng Tajem" 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Kategori *</label>
                    <select 
                      className="form-input-custom" 
                      value={newProdukKategori} 
                      onChange={(e) => setNewProdukKategori(e.target.value)}
                    >
                      <option value="Olahan Madu">Olahan Madu</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Kerajinan">Kerajinan</option>
                      <option value="Hasil Tani">Hasil Tani</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Harga *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={newProdukHarga} 
                      onChange={(e) => setNewProdukHarga(e.target.value)} 
                      placeholder="Contoh: Rp 85.000 / 500ml" 
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Nama Pembuat / Penjual *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={newProdukPembuat} 
                      onChange={(e) => setNewProdukPembuat(e.target.value)} 
                      placeholder="Contoh: Pak Warsito" 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>No. WhatsApp Penjual (Tanpa +) *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={newProdukWa} 
                      onChange={(e) => setNewProdukWa(e.target.value)} 
                      placeholder="Contoh: 6281234567890" 
                      required 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Deskripsi Produk *</label>
                  <textarea 
                    className="form-input-custom" 
                    rows={3} 
                    value={newProdukDesc} 
                    onChange={(e) => setNewProdukDesc(e.target.value)} 
                    placeholder="Tuliskan keunggulan dan spesifikasi produk..." 
                    required 
                  />
                </div>

                {/* Multiple Image Upload Zone for UMKM */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'block', marginBottom: 4 }}>
                    Foto Produk UMKM (Multiple Image Upload)
                  </label>
                  
                  <div 
                    className={`dropzone-box ${isDraggingUmkm ? 'dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingUmkm(true); }}
                    onDragLeave={() => setIsDraggingUmkm(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingUmkm(false);
                      if (e.dataTransfer.files?.length) handleUmkmFilesAdded(e.dataTransfer.files);
                    }}
                    onClick={() => document.getElementById('umkm-file-input').click()}
                  >
                    <Upload size={30} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                    <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.92rem', display: 'block' }}>
                      Tarik & Lepas foto produk di sini, atau klik untuk memilih
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Unggah beberapa foto sekaligus untuk varian/tampilan produk
                    </span>

                    <input 
                      id="umkm-file-input"
                      type="file" 
                      multiple 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleUmkmFilesAdded(e.target.files)}
                    />
                  </div>

                  {/* List Foto UMKM Uploaded */}
                  {umkmImagesList.length > 0 && (
                    <div className="image-preview-list">
                      {umkmImagesList.map((img, idx) => (
                        <div key={img.id} className={`image-preview-row ${img.isCover ? 'is-cover' : ''}`}>
                          <img src={img.url} alt={`Foto Produk ${idx+1}`} className="preview-img-square" />
                          
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {img.isCover ? (
                                <span className="cover-tag-badge">
                                  <Star size={10} fill="#fff" /> FOTO UTAMA
                                </span>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => handleUmkmSetCover(img.id)}
                                  style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: '#8a6d13', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                                >
                                  Jadikan Utama
                                </button>
                              )}
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Foto #{idx+1}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <MessageSquare size={14} color="var(--color-text-muted)" />
                              <input 
                                type="text"
                                className="form-input-custom"
                                style={{ marginTop: 0, padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                                placeholder="Keterangan / varian produk..."
                                value={img.caption || ''}
                                onChange={(e) => handleUmkmCaptionChange(img.id, e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 2 }}>
                              <button 
                                type="button"
                                disabled={idx === 0}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: 4, padding: '0.2rem', cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                                onClick={() => handleUmkmMoveImage(idx, -1)}
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button 
                                type="button"
                                disabled={idx === umkmImagesList.length - 1}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: 4, padding: '0.2rem', cursor: 'pointer', opacity: idx === umkmImagesList.length - 1 ? 0.3 : 1 }}
                                onClick={() => handleUmkmMoveImage(idx, 1)}
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                            <button 
                              type="button" 
                              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '0.25rem 0.4rem', cursor: 'pointer' }}
                              onClick={() => handleUmkmDeleteImage(img.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>
                  {editingUmkmId ? <><Check size={18} /> Simpan Perubahan UMKM</> : <><Plus size={18} /> Tambah Katalog UMKM</>}
                </button>
              </form>
            </div>

            {/* List UMKM Terdaftar */}
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                Katalog Produk Terdaftar ({umkmList.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {umkmList.map((item) => (
                  <div key={item.id} className="admin-item-card">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                      <img src={item.gambar} alt={item.nama_produk} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <span className="badge-gold" style={{ fontSize: '0.72rem' }}>{item.kategori}</span>
                        <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-dark)', marginTop: 2, marginBottom: 2 }}>{item.nama_produk}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 800 }}>{item.harga}</span> • <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Oleh: {item.pembuat}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 600 }} 
                        onClick={() => handleEditUmkmClick(item)}
                        title="Edit Produk UMKM"
                      >
                        <Edit3 size={15} /> Edit
                      </button>
                      <button 
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: 8, cursor: 'pointer' }} 
                        onClick={() => handleDeleteUmkm(item.id)}
                        title="Hapus UMKM"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KELOLA DESTINASI WISATA DESA (FULL CRUD & MULTI-IMAGE UPLOAD) */}
        {activeTab === 'wisata' && (
          <div className="grid-2">
            {/* Form Create / Edit Wisata */}
            <div className="card-rural">
              {editingWisataId ? (
                <div className="editing-banner">
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8a6d13', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Edit3 size={16} /> Sedang Mengedit Destinasi: <strong>"{newWisataNama || 'Tanpa Nama'}"</strong>
                  </div>
                  <button 
                    onClick={handleCancelEditWisata}
                    style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.3rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Batal Edit
                  </button>
                </div>
              ) : (
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.25rem' }}>
                  🏞️ Tambah Destinasi Wisata Baru
                </h3>
              )}

              <form onSubmit={handleSaveWisata}>
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Nama Tempat / Destinasi *</label>
                  <input 
                    type="text" 
                    className="form-input-custom" 
                    value={newWisataNama} 
                    onChange={(e) => setNewWisataNama(e.target.value)} 
                    placeholder="Contoh: Agrowisata Sunset Sawah Tajemsari" 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Kategori *</label>
                    <select 
                      className="form-input-custom" 
                      value={newWisataKategori} 
                      onChange={(e) => setNewWisataKategori(e.target.value)}
                    >
                      <option value="Wisata Alam">Wisata Alam</option>
                      <option value="Wisata Edukasi">Wisata Edukasi</option>
                      <option value="Wisata Budaya">Wisata Budaya</option>
                      <option value="Kuliner Desa">Kuliner Desa</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Tiket Masuk *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={newWisataTiket} 
                      onChange={(e) => setNewWisataTiket(e.target.value)} 
                      placeholder="Contoh: Gratis / Rp 5.000" 
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Lokasi / Dusun *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={newWisataLokasi} 
                      onChange={(e) => setNewWisataLokasi(e.target.value)} 
                      placeholder="Contoh: Dusun Tajemsari RT 02 / RW 01" 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Jam Buka *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={newWisataJamBuka} 
                      onChange={(e) => setNewWisataJamBuka(e.target.value)} 
                      placeholder="Contoh: 06.00 - 18.00 WIB" 
                      required 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Deskripsi Destinasi Wisata *</label>
                  <textarea 
                    className="form-input-custom" 
                    rows={3} 
                    value={newWisataDesc} 
                    onChange={(e) => setNewWisataDesc(e.target.value)} 
                    placeholder="Tuliskan keindahan dan fasilitas wisata..." 
                    required 
                  />
                </div>

                {/* Multiple Image Upload Zone for Wisata */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'block', marginBottom: 4 }}>
                    Foto Destinasi & Dokumentasi (Multiple Upload)
                  </label>
                  
                  <div 
                    className={`dropzone-box ${isDraggingWisata ? 'dragging' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingWisata(true); }}
                    onDragLeave={() => setIsDraggingWisata(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingWisata(false);
                      if (e.dataTransfer.files?.length) handleWisataFilesAdded(e.dataTransfer.files);
                    }}
                    onClick={() => document.getElementById('wisata-file-input').click()}
                  >
                    <Upload size={30} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                    <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.92rem', display: 'block' }}>
                      Tarik & Lepas foto destinasi wisata ke sini, atau klik untuk memilih
                    </strong>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Unggah beberapa foto lokasi wisata sekaligus
                    </span>

                    <input 
                      id="wisata-file-input"
                      type="file" 
                      multiple 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleWisataFilesAdded(e.target.files)}
                    />
                  </div>

                  {/* List Foto Wisata Uploaded */}
                  {wisataImagesList.length > 0 && (
                    <div className="image-preview-list">
                      {wisataImagesList.map((img, idx) => (
                        <div key={img.id} className={`image-preview-row ${img.isCover ? 'is-cover' : ''}`}>
                          <img src={img.url} alt={`Foto Wisata ${idx+1}`} className="preview-img-square" />
                          
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {img.isCover ? (
                                <span className="cover-tag-badge">
                                  <Star size={10} fill="#fff" /> FOTO UTAMA
                                </span>
                              ) : (
                                <button 
                                  type="button"
                                  onClick={() => handleWisataSetCover(img.id)}
                                  style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: '#8a6d13', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                                >
                                  Jadikan Utama
                                </button>
                              )}
                              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Foto #{idx+1}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <MessageSquare size={14} color="var(--color-text-muted)" />
                              <input 
                                type="text"
                                className="form-input-custom"
                                style={{ marginTop: 0, padding: '0.35rem 0.65rem', fontSize: '0.82rem' }}
                                placeholder="Keterangan foto lokasi..."
                                value={img.caption || ''}
                                onChange={(e) => handleWisataCaptionChange(img.id, e.target.value)}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: 2 }}>
                              <button 
                                type="button"
                                disabled={idx === 0}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: 4, padding: '0.2rem', cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                                onClick={() => handleWisataMoveImage(idx, -1)}
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button 
                                type="button"
                                disabled={idx === wisataImagesList.length - 1}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: 4, padding: '0.2rem', cursor: 'pointer', opacity: idx === wisataImagesList.length - 1 ? 0.3 : 1 }}
                                onClick={() => handleWisataMoveImage(idx, 1)}
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                            <button 
                              type="button" 
                              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '0.25rem 0.4rem', cursor: 'pointer' }}
                              onClick={() => handleWisataDeleteImage(img.id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%' }}>
                  {editingWisataId ? <><Check size={18} /> Simpan Perubahan Wisata</> : <><Plus size={18} /> Tambah Destinasi Wisata</>}
                </button>
              </form>
            </div>

            {/* List Wisata Terdaftar */}
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                Katalog Wisata Terdaftar ({wisataList.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {wisataList.map((item) => (
                  <div key={item.id} className="admin-item-card">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                      <img src={item.gambar} alt={item.nama_tempat} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <span className="badge-green" style={{ fontSize: '0.72rem' }}>{item.kategori}</span>
                        <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-dark)', marginTop: 2, marginBottom: 2 }}>{item.nama_tempat}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700 }}>Tiket: {item.tiket_masuk}</span> • <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.lokasi}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button 
                        style={{ background: '#3b82f6', color: '#ffffff', border: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 600 }} 
                        onClick={() => handleEditWisataClick(item)}
                        title="Edit Destinasi Wisata"
                      >
                        <Edit3 size={15} /> Edit
                      </button>
                      <button 
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: 8, cursor: 'pointer' }} 
                        onClick={() => handleDeleteWisata(item.id)}
                        title="Hapus Wisata"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Status Note untuk Permohonan Surat */}
      {selectedPermohonan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
          <div style={{ background: '#ffffff', borderRadius: 20, padding: '2rem', maxWidth: 480, width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Ubah Status Tiket #{selectedPermohonan.nomor_tiket}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Status baru: <strong style={{ color: 'var(--color-primary)' }}>{targetStatus}</strong>
            </p>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Catatan Petugas (Tampil pada Lacak Warga)</label>
              <textarea 
                className="form-input-custom" 
                rows={3} 
                value={catatanText} 
                onChange={(e) => setCatatanText(e.target.value)} 
                placeholder="Contoh: Berkas telah disetujui Kades. Silakan ambil di Balai Desa..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setSelectedPermohonan(null)}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={handleUpdatePermohonanStatus}>
                Simpan Status Tiket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
