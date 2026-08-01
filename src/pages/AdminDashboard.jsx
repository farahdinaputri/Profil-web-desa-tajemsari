import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Plus, Trash2, Edit3, Check, X, FileText, Newspaper, 
  ShoppingBag, LogOut, Upload, Image as ImageIcon, Star, ArrowUp, 
  ArrowDown, Sparkles, MessageSquare, Compass, MapPin, Clock, Ticket, 
  Tag, DollarSign, User, Phone, LayoutDashboard, Settings as SettingsIcon, 
  Globe, Eye, Menu, ChevronRight, AlertCircle, Save, CheckCircle, RefreshCw, Mail
} from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function AdminDashboard({ adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Data States
  const [permohonanList, setPermohonanList] = useState([]);
  const [beritaList, setBeritaList] = useState([]);
  const [umkmList, setUmkmList] = useState([]);
  const [wisataList, setWisataList] = useState([]);

  // CMS Form States
  const [heroState, setHeroState] = useState({
    badge: '', judul: '', deskripsi: '', bgImage: '', ctaPrimary: '', ctaSecondary: ''
  });

  const [profilState, setProfilState] = useState({
    namaKades: '', jabatanKades: '', sambutanKades: '', fotoKades: '', visi: '', misi: []
  });

  const [footerState, setFooterState] = useState({
    alamat: '', telepon: '', whatsapp: '', email: '', jamPelayanan: '', mapsUrl: '', facebook: '', instagram: '', youtube: ''
  });

  const [settingsState, setSettingsState] = useState({
    namaDesa: '', kecamatan: '', kabupaten: '', provinsi: '', emailAdmin: '', teleponKantor: '', runningText: '', passwordLama: '', passwordBaru: ''
  });

  // --- BERITA FORM STATES (CREATE & EDIT) ---
  const [editingBeritaId, setEditingBeritaId] = useState(null);
  const [newJudul, setNewJudul] = useState('');
  const [newKategori, setNewKategori] = useState('Pembangunan');
  const [newRingkasan, setNewRingkasan] = useState('');
  const [newIsi, setNewIsi] = useState('');
  const [beritaImagesList, setBeritaImagesList] = useState([]);
  const [isDraggingBerita, setIsDraggingBerita] = useState(false);

  // --- UMKM FORM STATES (CREATE & EDIT) ---
  const [editingUmkmId, setEditingUmkmId] = useState(null);
  const [newProdukNama, setNewProdukNama] = useState('');
  const [newProdukKategori, setNewProdukKategori] = useState('Olahan Madu');
  const [newProdukPembuat, setNewProdukPembuat] = useState('');
  const [newProdukHarga, setNewProdukHarga] = useState('');
  const [newProdukWa, setNewProdukWa] = useState('');
  const [newProdukDesc, setNewProdukDesc] = useState('');
  const [umkmImagesList, setUmkmImagesList] = useState([]);
  const [isDraggingUmkm, setIsDraggingUmkm] = useState(false);

  // --- WISATA FORM STATES (CREATE & EDIT) ---
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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    const pData = await apiService.getPermohonan();
    const bData = await apiService.getBerita();
    const uData = await apiService.getUMKM();
    const wData = await apiService.getWisata();
    const hData = await apiService.getHero();
    const prData = await apiService.getProfil();
    const fData = await apiService.getFooter();
    const sData = await apiService.getSettings();

    setPermohonanList(pData || []);
    setBeritaList(bData || []);
    setUmkmList(uData || []);
    setWisataList(wData || []);
    if (hData) setHeroState(hData);
    if (prData) setProfilState(prData);
    if (fData) setFooterState(fData);
    if (sData) setSettingsState(sData);
  };

  // ==========================================
  // SAVE CMS HANDLERS
  // ==========================================
  const handleSaveHero = async (e) => {
    e.preventDefault();
    await apiService.updateHero(heroState);
    showToast('Hero Section berhasil diperbarui!');
  };

  const handleSaveProfil = async (e) => {
    e.preventDefault();
    await apiService.updateProfil(profilState);
    showToast('Profil Desa berhasil diperbarui!');
  };

  const handleSaveFooter = async (e) => {
    e.preventDefault();
    await apiService.updateFooter(footerState);
    showToast('Footer Desa berhasil diperbarui!');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    await apiService.updateSettings(settingsState);
    showToast('Pengaturan umum berhasil disimpan!');
  };

  // ==========================================
  // BERITA MULTI-IMAGE LOGIC & CRUD
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

    window.scrollTo({ top: 100, behavior: 'smooth' });
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
      showToast('Berita berhasil diperbarui!');
    } else {
      await apiService.addBerita(payload);
      showToast('Berita baru berhasil dipublikasikan!');
    }

    handleCancelEditBerita();
    loadAllData();
  };

  const handleDeleteBerita = async (id) => {
    if (window.confirm('Yakin ingin menghapus berita ini secara permanen?')) {
      await apiService.deleteBerita(id);
      showToast('Berita berhasil dihapus!');
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

    window.scrollTo({ top: 100, behavior: 'smooth' });
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
      showToast('Produk UMKM berhasil diperbarui!');
    } else {
      await apiService.addUMKM(payload);
      showToast('Produk UMKM baru berhasil ditambahkan!');
    }

    handleCancelEditUmkm();
    loadAllData();
  };

  const handleDeleteUmkm = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk UMKM ini secara permanen?')) {
      await apiService.deleteUMKM(id);
      showToast('Produk UMKM berhasil dihapus!');
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

    window.scrollTo({ top: 100, behavior: 'smooth' });
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
      showToast('Destinasi wisata berhasil diperbarui!');
    } else {
      await apiService.addWisata(payload);
      showToast('Destinasi wisata baru berhasil ditambahkan!');
    }

    handleCancelEditWisata();
    loadAllData();
  };

  const handleDeleteWisata = async (id) => {
    if (window.confirm('Yakin ingin menghapus destinasi wisata ini secara permanen?')) {
      await apiService.deleteWisata(id);
      showToast('Destinasi wisata berhasil dihapus!');
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
    showToast(`Status tiket #${selectedPermohonan.nomor_tiket} diubah ke '${targetStatus}'!`);
    setSelectedPermohonan(null);
    loadAllData();
  };

  // Navigation Items Definition
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'UTAMA' },
    { id: 'hero', label: 'Kelola Hero Section', icon: ImageIcon, category: 'KONTEN WEBSITE' },
    { id: 'profil', label: 'Kelola Profil Desa', icon: Globe, category: 'KONTEN WEBSITE' },
    { id: 'berita', label: 'Kelola Berita', icon: Newspaper, count: beritaList.length, category: 'MODUL UTAMA' },
    { id: 'umkm', label: 'Kelola UMKM', icon: ShoppingBag, count: umkmList.length, category: 'MODUL UTAMA' },
    { id: 'wisata', label: 'Kelola Wisata', icon: Compass, count: wisataList.length, category: 'MODUL UTAMA' },
    { id: 'permohonan', label: 'Pengajuan Surat', icon: FileText, count: permohonanList.length, category: 'PELAYANAN' },
    { id: 'footer', label: 'Kelola Footer', icon: MapPin, category: 'KONTEN WEBSITE' },
    { id: 'settings', label: 'Pengaturan', icon: SettingsIcon, category: 'SISTEM' },
  ];

  return (
    <div className="admin-cms-layout">
      <style>{`
        .admin-cms-layout {
          display: flex;
          height: 100vh;
          max-height: 100vh;
          width: 100vw;
          overflow: hidden;
          background: #f4f7f4;
          font-family: var(--font-body);
        }

        /* SIDEBAR STYLES */
        .admin-sidebar {
          width: ${sidebarCollapsed ? '80px' : '280px'};
          background-color: #112a14 !important;
          color: #ffffff;
          position: relative;
          height: 100vh;
          max-height: 100vh;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          box-shadow: 4px 0 20px rgba(0,0,0,0.15);
          border-right: 1px solid rgba(212, 175, 55, 0.25);
          overflow: hidden;
        }

        .sidebar-brand {
          padding: 1.5rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background-color: #0c1f0f !important;
          flex-shrink: 0;
        }

        .sidebar-brand-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, var(--color-gold) 0%, #b89428 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);
        }

        .sidebar-nav-container {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1rem 0.75rem;
          background-color: #112a14 !important;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        .sidebar-nav-container::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav-container::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.5);
          border-radius: 10px;
        }

        .sidebar-nav-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-category-title {
          font-size: 0.7rem;
          font-weight: 800;
          color: #d4af37 !important;
          letter-spacing: 1px;
          padding: 1rem 0.75rem 0.4rem 0.75rem;
          text-transform: uppercase;
          display: ${sidebarCollapsed ? 'none' : 'block'};
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: #ecfdf5 !important;
          font-size: 0.9rem;
          font-weight: 600;
          background: transparent;
          border: none;
          width: 100%;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 0.25rem;
          text-align: left;
          position: relative;
        }

        .sidebar-nav-item:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          color: #ffffff !important;
        }

        .sidebar-nav-item.active {
          background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%) !important;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(46, 125, 50, 0.4);
          border-left: 4px solid #d4af37;
          font-weight: 700;
        }

        .sidebar-badge {
          background: var(--color-gold);
          color: #ffffff;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.15rem 0.55rem;
          border-radius: 20px;
          margin-left: auto;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background-color: #0c1f0f !important;
          flex-shrink: 0;
          z-index: 10;
        }

        /* MAIN CONTENT STYLES */
        .admin-main {
          flex: 1;
          min-width: 0;
          height: 100vh;
          max-height: 100vh;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          -webkit-overflow-scrolling: touch;
        }

        .admin-topbar {
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 900;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
        }

        .admin-content-area {
          padding: 2rem;
          flex: 1;
        }

        .dash-stat-card {
          background: #ffffff;
          border-radius: 18px;
          padding: 1.5rem;
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          display: flex;
          align-items: center;
          gap: 1.25rem;
          transition: transform 0.2s ease;
        }

        .dash-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.06);
        }

        .dash-stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        .admin-form-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 2rem;
          border: 1.5px solid var(--color-border);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          margin-bottom: 2rem;
        }

        .admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
          width: 100%;
        }

        .admin-form-label {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .form-input-custom {
          width: 100%;
          display: block;
          box-sizing: border-box;
          padding: 0.8rem 1rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: var(--font-body);
          background: #ffffff;
          color: var(--color-text-main);
          transition: var(--transition-fast);
        }

        .form-input-custom:focus {
          border-color: var(--color-primary);
          outline: none;
          box-shadow: 0 0 0 3.5px rgba(46, 125, 50, 0.15);
        }

        select.form-input-custom {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232e7d32' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1.1rem;
          padding-right: 2.5rem;
        }

        textarea.form-input-custom {
          resize: vertical;
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

        .form-grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .toast-notification {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: var(--color-primary-dark);
          color: #ffffff;
          padding: 0.9rem 1.5rem;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          z-index: 2000;
          border-left: 5px solid var(--color-gold);
          animation: slideInRight 0.3s ease;
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @media (max-width: 992px) {
          .admin-sidebar {
            position: fixed;
            left: ${mobileMenuOpen ? '0' : '-300px'};
            width: 280px;
          }
          .admin-topbar {
            padding: 0 1rem;
          }
          .admin-content-area {
            padding: 1.25rem;
          }
          .form-grid-2col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="toast-notification">
          <CheckCircle size={20} color="var(--color-gold)" />
          <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="admin-sidebar">
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="sidebar-brand-icon">
              <ShieldCheck size={24} />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
                  Desa Tajemsari
                </h2>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 700 }}>
                  PANEL CMS ADMINISTRASI
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items (Independent Vertical Scroll) */}
        <div className="sidebar-nav-container">
          {['UTAMA', 'PELAYANAN', 'KONTEN WEBSITE', 'MODUL UTAMA', 'SISTEM'].map((cat) => {
            const catItems = menuItems.filter(m => m.category === cat);
            if (!catItems.length) return null;
            return (
              <div key={cat} style={{ marginBottom: '1rem' }}>
                <div className="sidebar-category-title">{cat}</div>
                {catItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      title={item.label}
                      style={{
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        padding: sidebarCollapsed ? '0.75rem' : '0.75rem 1rem'
                      }}
                    >
                      <IconComp size={20} style={{ flexShrink: 0 }} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                      {!sidebarCollapsed && item.count !== undefined && (
                        <span className="sidebar-badge">{item.count}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer Logout Button */}
        <div className="sidebar-footer">
          <button
            className="sidebar-nav-item"
            style={{ 
              color: '#fca5a5', 
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              padding: sidebarCollapsed ? '0.75rem' : '0.75rem 1rem' 
            }}
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="admin-main">
        {/* Topbar Header */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => {
                if (window.innerWidth <= 992) {
                  setMobileMenuOpen(!mobileMenuOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
            >
              <Menu size={22} color="var(--color-primary-dark)" />
            </button>

            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
                {menuItems.find(m => m.id === activeTab)?.label}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                Portal Kelola Pemerintah Desa Tajemsari Tegowanu Grobogan
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 700, background: '#f0fdf4', padding: '0.4rem 0.85rem', borderRadius: 20, border: '1px solid rgba(46,125,50,0.2)' }}
            >
              <Globe size={15} /> Lihat Website Public
            </a>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '1.25rem' }}>
              <div style={{ width: 36, height: 36, background: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>
                A
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Admin Tajemsari</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Super Admin CMS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area Body */}
        <div className="admin-content-area animate-fade-in">
          {/* TAB 1: DASHBOARD RINGKASAN */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                  Selamat Datang Kembali, Admin! 👋
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  Berikut adalah ringkasan statistik dan aktivitas pengelolaan portal Desa Tajemsari Tegowanu.
                </p>
              </div>

              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: '#3b82f6' }}>
                    <Newspaper size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Berita Terpublikasi</span>
                    <h3 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', lineHeight: 1.1, marginTop: 2 }}>{beritaList.length}</h3>
                  </div>
                </div>

                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: 'var(--color-gold)' }}>
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Katalog UMKM</span>
                    <h3 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', lineHeight: 1.1, marginTop: 2 }}>{umkmList.length}</h3>
                  </div>
                </div>

                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: '#10b981' }}>
                    <Compass size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Destinasi Wisata</span>
                    <h3 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', lineHeight: 1.1, marginTop: 2 }}>{wisataList.length}</h3>
                  </div>
                </div>

                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: '#8b5cf6' }}>
                    <FileText size={28} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Pengajuan Surat</span>
                    <h3 style={{ fontSize: '1.8rem', color: 'var(--color-primary-dark)', lineHeight: 1.1, marginTop: 2 }}>{permohonanList.length}</h3>
                  </div>
                </div>
              </div>

              {/* Two Column Layout for Dashboard Widgets */}
              <div className="grid-2">
                {/* Permohonan Terbaru */}
                <div className="card-rural">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>Permohonan Surat Terbaru</h4>
                    <button className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }} onClick={() => setActiveTab('permohonan')}>
                      Lihat Semua
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {permohonanList.slice(0, 4).map((p) => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid var(--color-border)' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>{p.nama_warga}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{p.jenis_surat} • {p.nomor_tiket}</div>
                        </div>
                        <span className={p.status === 'Selesai' ? 'badge-green' : 'badge-gold'}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action CMS Cards */}
                <div className="card-rural">
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>Aksi Cepat CMS Admin</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button className="btn btn-primary" style={{ justifyContent: 'flex-start', padding: '0.85rem 1.25rem' }} onClick={() => setActiveTab('berita')}>
                      <Plus size={18} /> Tambah / Publikasikan Berita Baru
                    </button>
                    <button className="btn btn-gold" style={{ justifyContent: 'flex-start', padding: '0.85rem 1.25rem' }} onClick={() => setActiveTab('umkm')}>
                      <Plus size={18} /> Tambah Produk UMKM Baru
                    </button>
                    <button className="btn btn-outline" style={{ justifyContent: 'flex-start', padding: '0.85rem 1.25rem' }} onClick={() => setActiveTab('hero')}>
                      <Edit3 size={18} /> Edit Konten Hero Section
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KELOLA HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ImageIcon size={22} color="var(--color-gold)" /> Pengaturan Banner Hero Section
              </h3>

              <form onSubmit={handleSaveHero}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Teks Badge Top (Pill Badge)</label>
                  <input 
                    type="text" 
                    className="form-input-custom" 
                    value={heroState.badge} 
                    onChange={(e) => setHeroState({ ...heroState, badge: e.target.value })} 
                    placeholder="Contoh: Website Resmi Desa Tajemsari • Kec. Tegowanu" 
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Judul Utama Hero Section *</label>
                  <input 
                    type="text" 
                    className="form-input-custom" 
                    value={heroState.judul} 
                    onChange={(e) => setHeroState({ ...heroState, judul: e.target.value })} 
                    required 
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Deskripsi Singkat Profil Desa *</label>
                  <textarea 
                    className="form-input-custom" 
                    rows={4} 
                    value={heroState.deskripsi} 
                    onChange={(e) => setHeroState({ ...heroState, deskripsi: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-grid-2col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Label Tombol Utama (CTA 1)</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={heroState.ctaPrimary} 
                      onChange={(e) => setHeroState({ ...heroState, ctaPrimary: e.target.value })} 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Label Tombol Sekunder (CTA 2)</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={heroState.ctaSecondary} 
                      onChange={(e) => setHeroState({ ...heroState, ctaSecondary: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">URL Gambar Background Hero</label>
                  <input 
                    type="text" 
                    className="form-input-custom" 
                    value={heroState.bgImage} 
                    onChange={(e) => setHeroState({ ...heroState, bgImage: e.target.value })} 
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '0.85rem 2rem' }}>
                  <Save size={18} /> Simpan Perubahan Hero Section
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: KELOLA PROFIL DESA */}
          {activeTab === 'profil' && (
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={22} color="var(--color-gold)" /> Pengaturan Profil, Visi & Misi Desa
              </h3>

              <form onSubmit={handleSaveProfil}>
                <div className="form-grid-2col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Nama Kepala Desa *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={profilState.namaKades} 
                      onChange={(e) => setProfilState({ ...profilState, namaKades: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Jabatan *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={profilState.jabatanKades} 
                      onChange={(e) => setProfilState({ ...profilState, jabatanKades: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Naskah Sambutan Kepala Desa *</label>
                  <textarea 
                    className="form-input-custom" 
                    rows={4} 
                    value={profilState.sambutanKades} 
                    onChange={(e) => setProfilState({ ...profilState, sambutanKades: e.target.value })} 
                    required 
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Teks Visi Desa Tajemsari *</label>
                  <textarea 
                    className="form-input-custom" 
                    rows={2} 
                    value={profilState.visi} 
                    onChange={(e) => setProfilState({ ...profilState, visi: e.target.value })} 
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '0.85rem 2rem' }}>
                  <Save size={18} /> Simpan Profil & Visi Misi
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: KELOLA BERITA */}
          {activeTab === 'berita' && (
            <div className="grid-2">
              <div className="admin-form-card">
                {editingBeritaId ? (
                  <div className="editing-banner">
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8a6d13', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Edit3 size={16} /> Sedang Mengedit Berita: <strong>"{newJudul || 'Tanpa Judul'}"</strong>
                    </div>
                    <button onClick={handleCancelEditBerita} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.3rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                      Batal Edit
                    </button>
                  </div>
                ) : (
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={20} color="var(--color-gold)" /> Tambah Berita / Pengumuman Baru
                  </h3>
                )}

                <form onSubmit={handleSaveBerita}>
                  <div className="admin-form-group">
                    <label className="admin-form-label"><FileText size={15} /> Judul Berita *</label>
                    <input type="text" className="form-input-custom" value={newJudul} onChange={(e) => setNewJudul(e.target.value)} placeholder="Contoh: Perbaikan Saluran Irigasi Sawah Tajem" required />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label"><Tag size={15} /> Kategori Berita *</label>
                    <select className="form-input-custom" value={newKategori} onChange={(e) => setNewKategori(e.target.value)}>
                      <option value="Pembangunan">Pembangunan</option>
                      <option value="Ekonomi">Ekonomi</option>
                      <option value="Pertanian">Pertanian</option>
                      <option value="Kesehatan">Kesehatan</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label"><MessageSquare size={15} /> Ringkasan Singkat (Awal) *</label>
                    <textarea className="form-input-custom" rows={2} value={newRingkasan} onChange={(e) => setNewRingkasan(e.target.value)} placeholder="Ringkasan 1-2 kalimat..." required />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label"><FileText size={15} /> Isi Lengkap Berita *</label>
                    <textarea className="form-input-custom" rows={5} value={newIsi} onChange={(e) => setNewIsi(e.target.value)} placeholder="Tuliskan berita lengkap..." required />
                  </div>

                  {/* Multiple Image Upload Zone */}
                  <div className="admin-form-group">
                    <label className="admin-form-label"><ImageIcon size={15} /> Foto Utama & Galeri Dokumentasi (Multiple Upload)</label>
                    <div 
                      className={`dropzone-box ${isDraggingBerita ? 'dragging' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingBerita(true); }}
                      onDragLeave={() => setIsDraggingBerita(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDraggingBerita(false); if (e.dataTransfer.files?.length) handleBeritaFilesAdded(e.dataTransfer.files); }}
                      onClick={() => document.getElementById('berita-file-input').click()}
                    >
                      <Upload size={30} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                      <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.92rem', display: 'block' }}>Tarik & Lepas foto ke sini, atau klik untuk memilih file</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Mendukung multiple upload (JPG, PNG, WEBP)</span>
                      <input id="berita-file-input" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => handleBeritaFilesAdded(e.target.files)} />
                    </div>

                    {beritaImagesList.length > 0 && (
                      <div className="image-preview-list">
                        {beritaImagesList.map((img, idx) => (
                          <div key={img.id} className={`image-preview-row ${img.isCover ? 'is-cover' : ''}`}>
                            <img src={img.url} alt={`Foto ${idx+1}`} className="preview-img-square" />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {img.isCover ? (
                                  <span className="cover-tag-badge"><Star size={10} fill="#fff" /> COVER UTAMA</span>
                                ) : (
                                  <button type="button" onClick={() => handleBeritaSetCover(img.id)} style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: '#8a6d13', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>
                                    Jadikan Cover
                                  </button>
                                )}
                              </div>
                              <input type="text" className="form-input-custom" style={{ marginTop: 0, padding: '0.35rem 0.65rem', fontSize: '0.82rem' }} placeholder="Caption foto..." value={img.caption || ''} onChange={(e) => handleBeritaCaptionChange(img.id, e.target.value)} />
                            </div>
                            <button type="button" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '0.25rem 0.4rem', cursor: 'pointer' }} onClick={() => handleBeritaDeleteImage(img.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.9rem' }}>
                    {editingBeritaId ? <><Check size={18} /> Simpan Perubahan Berita</> : <><Plus size={18} /> Publikasikan Berita</>}
                  </button>
                </form>
              </div>

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
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{item.tanggal}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, cursor: 'pointer' }} onClick={() => handleEditBeritaClick(item)}>
                          <Edit3 size={15} /> Edit
                        </button>
                        <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: 8, cursor: 'pointer' }} onClick={() => handleDeleteBerita(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KELOLA UMKM */}
          {activeTab === 'umkm' && (
            <div className="grid-2">
              <div className="admin-form-card">
                {editingUmkmId ? (
                  <div className="editing-banner">
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8a6d13' }}>
                      Sedang Mengedit UMKM: <strong>"{newProdukNama}"</strong>
                    </div>
                    <button onClick={handleCancelEditUmkm} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.3rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer' }}>
                      Batal Edit
                    </button>
                  </div>
                ) : (
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShoppingBag size={20} color="var(--color-gold)" /> Tambah Produk UMKM Baru
                  </h3>
                )}

                <form onSubmit={handleSaveUmkm}>
                  <div className="admin-form-group">
                    <label className="admin-form-label"><ShoppingBag size={15} /> Nama Produk *</label>
                    <input type="text" className="form-input-custom" value={newProdukNama} onChange={(e) => setNewProdukNama(e.target.value)} placeholder="Contoh: Madu Murni Klanceng Tajem" required />
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-form-group">
                      <label className="admin-form-label"><Tag size={15} /> Kategori *</label>
                      <select className="form-input-custom" value={newProdukKategori} onChange={(e) => setNewProdukKategori(e.target.value)}>
                        <option value="Olahan Madu">Olahan Madu</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Kerajinan">Kerajinan</option>
                        <option value="Hasil Tani">Hasil Tani</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label"><DollarSign size={15} /> Harga *</label>
                      <input type="text" className="form-input-custom" value={newProdukHarga} onChange={(e) => setNewProdukHarga(e.target.value)} placeholder="Rp 85.000 / 500ml" required />
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-form-group">
                      <label className="admin-form-label"><User size={15} /> Pembuat / Penjual *</label>
                      <input type="text" className="form-input-custom" value={newProdukPembuat} onChange={(e) => setNewProdukPembuat(e.target.value)} placeholder="Pak Warsito" required />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label"><Phone size={15} /> WhatsApp (Tanpa +) *</label>
                      <input type="text" className="form-input-custom" value={newProdukWa} onChange={(e) => setNewProdukWa(e.target.value)} placeholder="6281234567890" required />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label"><FileText size={15} /> Deskripsi Produk *</label>
                    <textarea className="form-input-custom" rows={3} value={newProdukDesc} onChange={(e) => setNewProdukDesc(e.target.value)} placeholder="Deskripsi produk..." required />
                  </div>

                  {/* Multiple Upload UMKM */}
                  <div className="admin-form-group">
                    <label className="admin-form-label"><ImageIcon size={15} /> Foto Produk UMKM (Multiple Upload)</label>
                    <div 
                      className={`dropzone-box ${isDraggingUmkm ? 'dragging' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingUmkm(true); }}
                      onDragLeave={() => setIsDraggingUmkm(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDraggingUmkm(false); if (e.dataTransfer.files?.length) handleUmkmFilesAdded(e.dataTransfer.files); }}
                      onClick={() => document.getElementById('umkm-file-input').click()}
                    >
                      <Upload size={30} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                      <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.92rem' }}>Upload Foto Produk</strong>
                      <input id="umkm-file-input" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => handleUmkmFilesAdded(e.target.files)} />
                    </div>

                    {umkmImagesList.length > 0 && (
                      <div className="image-preview-list">
                        {umkmImagesList.map((img, idx) => (
                          <div key={img.id} className={`image-preview-row ${img.isCover ? 'is-cover' : ''}`}>
                            <img src={img.url} alt={`Foto UMKM ${idx+1}`} className="preview-img-square" />
                            <div style={{ flex: 1 }}>
                              {img.isCover ? <span className="cover-tag-badge"><Star size={10} fill="#fff" /> UTAMA</span> : <button type="button" onClick={() => handleUmkmSetCover(img.id)} style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: '#8a6d13', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 4, cursor: 'pointer' }}>Jadikan Utama</button>}
                            </div>
                            <button type="button" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '0.25rem 0.4rem', cursor: 'pointer' }} onClick={() => handleUmkmDeleteImage(img.id)}><Trash2 size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.9rem' }}>
                    {editingUmkmId ? <><Check size={18} /> Simpan Perubahan UMKM</> : <><Plus size={18} /> Tambah Produk UMKM</>}
                  </button>
                </form>
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                  Katalog UMKM Terdaftar ({umkmList.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {umkmList.map((item) => (
                    <div key={item.id} className="admin-item-card">
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                        <img src={item.gambar} alt={item.nama_produk} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} />
                        <div>
                          <span className="badge-gold" style={{ fontSize: '0.72rem' }}>{item.kategori}</span>
                          <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-dark)' }}>{item.nama_produk}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 800 }}>{item.harga}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, cursor: 'pointer' }} onClick={() => handleEditUmkmClick(item)}>
                          <Edit3 size={15} /> Edit
                        </button>
                        <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: 8, cursor: 'pointer' }} onClick={() => handleDeleteUmkm(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: KELOLA WISATA */}
          {activeTab === 'wisata' && (
            <div className="grid-2">
              <div className="admin-form-card">
                {editingWisataId ? (
                  <div className="editing-banner">
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8a6d13' }}>
                      Sedang Mengedit Destinasi: <strong>"{newWisataNama}"</strong>
                    </div>
                    <button onClick={handleCancelEditWisata} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '0.3rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer' }}>
                      Batal Edit
                    </button>
                  </div>
                ) : (
                  <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Compass size={20} color="var(--color-gold)" /> Tambah Destinasi Wisata Baru
                  </h3>
                )}

                <form onSubmit={handleSaveWisata}>
                  <div className="admin-form-group">
                    <label className="admin-form-label"><Compass size={15} /> Nama Tempat / Destinasi *</label>
                    <input type="text" className="form-input-custom" value={newWisataNama} onChange={(e) => setNewWisataNama(e.target.value)} placeholder="Contoh: Agrowisata Sunset Sawah Tajemsari" required />
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-form-group">
                      <label className="admin-form-label"><Tag size={15} /> Kategori *</label>
                      <select className="form-input-custom" value={newWisataKategori} onChange={(e) => setNewWisataKategori(e.target.value)}>
                        <option value="Wisata Alam">Wisata Alam</option>
                        <option value="Wisata Edukasi">Wisata Edukasi</option>
                        <option value="Wisata Budaya">Wisata Budaya</option>
                        <option value="Kuliner Desa">Kuliner Desa</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label"><Ticket size={15} /> Tiket Masuk *</label>
                      <input type="text" className="form-input-custom" value={newWisataTiket} onChange={(e) => setNewWisataTiket(e.target.value)} placeholder="Gratis / Rp 5.000" required />
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-form-group">
                      <label className="admin-form-label"><MapPin size={15} /> Lokasi / Dusun *</label>
                      <input type="text" className="form-input-custom" value={newWisataLokasi} onChange={(e) => setNewWisataLokasi(e.target.value)} placeholder="Dusun Tajemsari RT 02 / RW 01" required />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label"><Clock size={15} /> Jam Buka *</label>
                      <input type="text" className="form-input-custom" value={newWisataJamBuka} onChange={(e) => setNewWisataJamBuka(e.target.value)} placeholder="06.00 - 18.00 WIB" required />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label"><FileText size={15} /> Deskripsi Destinasi *</label>
                    <textarea className="form-input-custom" rows={3} value={newWisataDesc} onChange={(e) => setNewWisataDesc(e.target.value)} placeholder="Tuliskan keindahan lokasi..." required />
                  </div>

                  {/* Multiple Upload Wisata */}
                  <div className="admin-form-group">
                    <label className="admin-form-label"><ImageIcon size={15} /> Foto Destinasi (Multiple Upload)</label>
                    <div 
                      className={`dropzone-box ${isDraggingWisata ? 'dragging' : ''}`}
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingWisata(true); }}
                      onDragLeave={() => setIsDraggingWisata(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDraggingWisata(false); if (e.dataTransfer.files?.length) handleWisataFilesAdded(e.dataTransfer.files); }}
                      onClick={() => document.getElementById('wisata-file-input').click()}
                    >
                      <Upload size={30} color="var(--color-primary)" style={{ margin: '0 auto 0.5rem auto', display: 'block' }} />
                      <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.92rem' }}>Upload Foto Wisata</strong>
                      <input id="wisata-file-input" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => handleWisataFilesAdded(e.target.files)} />
                    </div>

                    {wisataImagesList.length > 0 && (
                      <div className="image-preview-list">
                        {wisataImagesList.map((img, idx) => (
                          <div key={img.id} className={`image-preview-row ${img.isCover ? 'is-cover' : ''}`}>
                            <img src={img.url} alt={`Foto Wisata ${idx+1}`} className="preview-img-square" />
                            <div style={{ flex: 1 }}>
                              {img.isCover ? <span className="cover-tag-badge"><Star size={10} fill="#fff" /> UTAMA</span> : <button type="button" onClick={() => handleWisataSetCover(img.id)} style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: '#8a6d13', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 4, cursor: 'pointer' }}>Jadikan Utama</button>}
                            </div>
                            <button type="button" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '0.25rem 0.4rem', cursor: 'pointer' }} onClick={() => handleWisataDeleteImage(img.id)}><Trash2 size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.9rem' }}>
                    {editingWisataId ? <><Check size={18} /> Simpan Perubahan Wisata</> : <><Plus size={18} /> Tambah Destinasi Wisata</>}
                  </button>
                </form>
              </div>

              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                  Katalog Wisata Terdaftar ({wisataList.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {wisataList.map((item) => (
                    <div key={item.id} className="admin-item-card">
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                        <img src={item.gambar} alt={item.nama_tempat} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover' }} />
                        <div>
                          <span className="badge-green" style={{ fontSize: '0.72rem' }}>{item.kategori}</span>
                          <h4 style={{ fontSize: '1rem', color: 'var(--color-primary-dark)' }}>{item.nama_tempat}</h4>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700 }}>Tiket: {item.tiket_masuk}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.5rem 0.75rem', borderRadius: 8, cursor: 'pointer' }} onClick={() => handleEditWisataClick(item)}>
                          <Edit3 size={15} /> Edit
                        </button>
                        <button style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.5rem', borderRadius: 8, cursor: 'pointer' }} onClick={() => handleDeleteWisata(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PENGAJUAN SURAT WARGA */}
          {activeTab === 'permohonan' && (
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1rem' }}>
                Kelola Seluruh Pengajuan Surat Masyarakat Tajemsari
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tiket & Tanggal</th>
                      <th>Detail Pemohon</th>
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
                        <td><span className="badge-green">{item.jenis_surat}</span></td>
                        <td style={{ maxWidth: 220 }}>{item.keperluan}</td>
                        <td>
                          <span className={item.status === 'Selesai' ? 'badge-green' : item.status === 'Ditolak' ? 'badge-gold' : 'badge-gold'}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer' }} onClick={() => handleOpenStatusModal(item, 'Diproses')}>
                              Proses
                            </button>
                            <button style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer' }} onClick={() => handleOpenStatusModal(item, 'Selesai')}>
                              Setujui
                            </button>
                            <button style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.35rem 0.65rem', borderRadius: 6, fontSize: '0.78rem', cursor: 'pointer' }} onClick={() => handleOpenStatusModal(item, 'Ditolak')}>
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

          {/* TAB 8: KELOLA FOOTER */}
          {activeTab === 'footer' && (
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={22} color="var(--color-gold)" /> Pengaturan Informasi Footer & Google Maps
              </h3>

              <form onSubmit={handleSaveFooter}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Alamat Lengkap Balai Desa *</label>
                  <textarea 
                    className="form-input-custom" 
                    rows={2} 
                    value={footerState.alamat} 
                    onChange={(e) => setFooterState({ ...footerState, alamat: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-grid-2col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">No. Telepon Kantor</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={footerState.telepon} 
                      onChange={(e) => setFooterState({ ...footerState, telepon: e.target.value })} 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">WhatsApp Official Desa</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={footerState.whatsapp} 
                      onChange={(e) => setFooterState({ ...footerState, whatsapp: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email Resmi Desa</label>
                    <input 
                      type="email" 
                      className="form-input-custom" 
                      value={footerState.email} 
                      onChange={(e) => setFooterState({ ...footerState, email: e.target.value })} 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Jam Pelayanan Kantor</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={footerState.jamPelayanan} 
                      onChange={(e) => setFooterState({ ...footerState, jamPelayanan: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Tautan Google Maps Desa Tajemsari</label>
                  <input 
                    type="text" 
                    className="form-input-custom" 
                    value={footerState.mapsUrl} 
                    onChange={(e) => setFooterState({ ...footerState, mapsUrl: e.target.value })} 
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '0.85rem 2rem' }}>
                  <Save size={18} /> Simpan Pengaturan Footer
                </button>
              </form>
            </div>
          )}

          {/* TAB 9: PENGATURAN UMUM */}
          {activeTab === 'settings' && (
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <SettingsIcon size={22} color="var(--color-gold)" /> Pengaturan Umum Sistem & Website
              </h3>

              <form onSubmit={handleSaveSettings}>
                <div className="form-grid-2col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Nama Desa *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={settingsState.namaDesa} 
                      onChange={(e) => setSettingsState({ ...settingsState, namaDesa: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Kecamatan *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={settingsState.kecamatan} 
                      onChange={(e) => setSettingsState({ ...settingsState, kecamatan: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Kabupaten *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={settingsState.kabupaten} 
                      onChange={(e) => setSettingsState({ ...settingsState, kabupaten: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email Admin Login</label>
                    <input 
                      type="email" 
                      className="form-input-custom" 
                      value={settingsState.emailAdmin} 
                      onChange={(e) => setSettingsState({ ...settingsState, emailAdmin: e.target.value })} 
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Pengumuman / Teks Berjalan Running Text</label>
                  <textarea 
                    className="form-input-custom" 
                    rows={2} 
                    value={settingsState.runningText} 
                    onChange={(e) => setSettingsState({ ...settingsState, runningText: e.target.value })} 
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '0.85rem 2rem' }}>
                  <Save size={18} /> Simpan Pengaturan Umum
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

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

            <div className="admin-form-group">
              <label className="admin-form-label">Catatan Petugas (Tampil pada Lacak Warga)</label>
              <textarea 
                className="form-input-custom" 
                rows={3} 
                value={catatanText} 
                onChange={(e) => setCatatanText(e.target.value)} 
                placeholder="Contoh: Berkas telah disetujui Kades. Silakan ambil di Balai Desa..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
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
