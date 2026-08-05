import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Plus, Trash2, Edit3, Check, X, FileText, Newspaper, 
  ShoppingBag, LogOut, Upload, Image as ImageIcon, Star, ArrowUp, 
  ArrowDown, Sparkles, MessageSquare, Compass, MapPin, Clock, Ticket, 
  Tag, DollarSign, User, Phone, LayoutDashboard, Settings as SettingsIcon, 
  Globe, Eye, Menu, ChevronRight, AlertCircle, Save, CheckCircle, RefreshCw, Mail, Download, FileCheck,
  BarChart3, Wheat, Building, Users, History, Target, Calendar, Loader
} from 'lucide-react';
import { apiService, uploadImage } from '../lib/supabaseClient';

export default function AdminDashboard({ adminUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Data States
  const [permohonanList, setPermohonanList] = useState([]);
  const [beritaList, setBeritaList] = useState([]);
  const [umkmList, setUmkmList] = useState([]);
  const [wisataList, setWisataList] = useState([]);

  // CMS Form States
  const [heroState, setHeroState] = useState({
    badge: '', judul: '', deskripsi: '', bgImage: '', ctaPrimary: '', ctaSecondary: ''
  });
  const [heroBgFileName, setHeroBgFileName] = useState('');

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
  const [newPenulis, setNewPenulis] = useState('Sekretariat Desa Tajemsari');
  const [newTanggal, setNewTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [newRingkasan, setNewRingkasan] = useState('');
  const [newIsi, setNewIsi] = useState('');
  const [beritaImagesList, setBeritaImagesList] = useState([]);
  const [isDraggingBerita, setIsDraggingBerita] = useState(false);

  // --- UMKM FORM STATES (CREATE & EDIT) ---
  const [editingUmkmId, setEditingUmkmId] = useState(null);
  const [newProdukNama, setNewProdukNama] = useState('');
  const [newProdukKategori, setNewProdukKategori] = useState('Kuliner');
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

  // Permohonan Status & Upload PDF Modal States
  const [selectedPermohonan, setSelectedPermohonan] = useState(null);
  const [catatanText, setCatatanText] = useState('');
  const [targetStatus, setTargetStatus] = useState('Sedang Diproses');
  const [modalFileUrl, setModalFileUrl] = useState('');
  const [modalFileName, setModalFileName] = useState('');
  const [modalMetode, setModalMetode] = useState('Digital');

  // Statistik Beranda CRUD States
  const [statistikList, setStatistikList] = useState([]);
  const [showStatModal, setShowStatModal] = useState(false);
  const [editingStatId, setEditingStatId] = useState(null);
  const [statForm, setStatForm] = useState({
    angka: '',
    label: '',
    icon: 'Users',
    colorBg: '#e8f5e9',
    colorText: '#2e7d32'
  });

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
    const stData = await apiService.getStatistik();

    setPermohonanList(pData || []);
    setBeritaList(bData || []);
    setUmkmList(uData || []);
    setWisataList(wData || []);
    setStatistikList(stData || []);
    if (hData) setHeroState(hData);
    if (prData) setProfilState(prData);
    if (fData) setFooterState(fData);
    if (sData) setSettingsState(sData);
  };

  const handleOpenStatModal = (statItem = null) => {
    if (statItem) {
      setEditingStatId(statItem.id);
      setStatForm({
        angka: statItem.angka || '',
        label: statItem.label || '',
        icon: statItem.icon || 'Users',
        colorBg: statItem.colorBg || '#e8f5e9',
        colorText: statItem.colorText || '#2e7d32'
      });
    } else {
      setEditingStatId(null);
      setStatForm({
        angka: '',
        label: '',
        icon: 'Users',
        colorBg: '#e8f5e9',
        colorText: '#2e7d32'
      });
    }
    setShowStatModal(true);
  };

  const handleSaveStatistikItem = async (e) => {
    e.preventDefault();
    if (!statForm.angka || !statForm.label) {
      alert('Mohon isi angka/jumlah dan label statistik.');
      return;
    }
    if (editingStatId) {
      await apiService.updateStatistik(editingStatId, statForm);
      showToast('Kartu statistik berhasil diperbarui!');
    } else {
      await apiService.addStatistik(statForm);
      showToast('Kartu statistik baru berhasil ditambahkan!');
    }
    setShowStatModal(false);
    const updated = await apiService.getStatistik();
    setStatistikList(updated || []);
  };

  const handleDeleteStatistikItem = async (id) => {
    if (window.confirm('Hapus kartu statistik ini dari website?')) {
      await apiService.deleteStatistik(id);
      showToast('Kartu statistik berhasil dihapus!');
      const updated = await apiService.getStatistik();
      setStatistikList(updated || []);
    }
  };

  // --- PROFIL DESA SUB-STATES & HANDLERS (Misi, Perangkat, APBDes) ---
  const [newMisiText, setNewMisiText] = useState('');

  // Perangkat Modal State
  const [showPerangkatModal, setShowPerangkatModal] = useState(false);
  const [editingPerangkatId, setEditingPerangkatId] = useState(null);
  const [perangkatForm, setPerangkatForm] = useState({ nama: '', jabatan: '', foto: '' });

  // APBDes Modal State
  const [showApbdesModal, setShowApbdesModal] = useState(false);
  const [editingApbdesId, setEditingApbdesId] = useState(null);
  const [apbdesForm, setApbdesForm] = useState({ bidang: '', jumlah: '', persentase: 0 });

  // Misi Handlers
  const handleAddMisi = () => {
    if (!newMisiText.trim()) return;
    setProfilState(prev => ({
      ...prev,
      misiList: [...(prev.misiList || []), newMisiText.trim()]
    }));
    setNewMisiText('');
  };

  const handleDeleteMisi = (index) => {
    setProfilState(prev => ({
      ...prev,
      misiList: (prev.misiList || []).filter((_, idx) => idx !== index)
    }));
  };

  // Perangkat Handlers
  const handleOpenPerangkatModal = (item = null) => {
    if (item) {
      setEditingPerangkatId(item.id);
      setPerangkatForm({ nama: item.nama || '', jabatan: item.jabatan || '', foto: item.foto || '' });
    } else {
      setEditingPerangkatId(null);
      setPerangkatForm({ nama: '', jabatan: '', foto: '' });
    }
    setShowPerangkatModal(true);
  };

  const handlePerangkatFotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
        alert('Format file tidak didukung! Mohon pilih gambar JPG, JPEG, PNG, atau WebP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal ukuran file adalah 5 MB.');
        return;
      }
      setUploadingImage(true);
      try {
        const url = await uploadImage(file, 'profil');
        setPerangkatForm(prev => ({ ...prev, foto: url }));
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSavePerangkatItem = (e) => {
    e.preventDefault();
    if (!perangkatForm.nama || !perangkatForm.jabatan) {
      alert('Mohon isi nama lengkap dan jabatan perangkat desa.');
      return;
    }
    if (editingPerangkatId) {
      setProfilState(prev => ({
        ...prev,
        perangkatList: (prev.perangkatList || []).map(p => p.id === editingPerangkatId ? { ...p, ...perangkatForm } : p)
      }));
      showToast('Data Perangkat Desa berhasil diperbarui!');
    } else {
      const newItem = { ...perangkatForm, id: Date.now() };
      setProfilState(prev => ({
        ...prev,
        perangkatList: [...(prev.perangkatList || []), newItem]
      }));
      showToast('Perangkat Desa baru berhasil ditambahkan!');
    }
    setShowPerangkatModal(false);
  };

  const handleDeletePerangkatItem = (id) => {
    if (window.confirm('Hapus perangkat desa ini dari daftar?')) {
      setProfilState(prev => ({
        ...prev,
        perangkatList: (prev.perangkatList || []).filter(p => p.id !== id)
      }));
      showToast('Perangkat Desa berhasil dihapus!');
    }
  };

  // APBDes Handlers
  const handleOpenApbdesModal = (item = null) => {
    if (item) {
      setEditingApbdesId(item.id);
      setApbdesForm({ bidang: item.bidang || '', jumlah: item.jumlah || '', persentase: item.persentase || 0 });
    } else {
      setEditingApbdesId(null);
      setApbdesForm({ bidang: '', jumlah: '', persentase: 0 });
    }
    setShowApbdesModal(true);
  };

  const handleSaveApbdesItem = (e) => {
    e.preventDefault();
    if (!apbdesForm.bidang || !apbdesForm.jumlah) {
      alert('Mohon isi bidang alokasi dan jumlah nominal APBDes.');
      return;
    }
    if (editingApbdesId) {
      setProfilState(prev => ({
        ...prev,
        apbdesRincian: (prev.apbdesRincian || []).map(a => a.id === editingApbdesId ? { ...a, ...apbdesForm } : a)
      }));
      showToast('Alokasi APBDes berhasil diperbarui!');
    } else {
      const newItem = { ...apbdesForm, id: Date.now() };
      setProfilState(prev => ({
        ...prev,
        apbdesRincian: [...(prev.apbdesRincian || []), newItem]
      }));
      showToast('Alokasi APBDes baru berhasil ditambahkan!');
    }
    setShowApbdesModal(false);
  };

  const handleDeleteApbdesItem = (id) => {
    if (window.confirm('Hapus alokasi APBDes ini dari daftar?')) {
      setProfilState(prev => ({
        ...prev,
        apbdesRincian: (prev.apbdesRincian || []).filter(a => a.id !== id)
      }));
      showToast('Alokasi APBDes berhasil dihapus!');
    }
  };

  // ==========================================
  // ==========================================
  // HERO BG UPLOAD HANDLERS
  // ==========================================
  const handleHeroBgUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format file tidak didukung! Mohon pilih gambar berformat JPG, JPEG, PNG, atau WebP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal ukuran file adalah 5 MB.');
        return;
      }
      setHeroBgFileName(file.name);
      setUploadingImage(true);
      try {
        const url = await uploadImage(file, 'hero');
        setHeroState(prev => ({ ...prev, bgImage: url }));
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleHeroBgDelete = () => {
    if (window.confirm('Hapus / reset gambar background Hero ke gambar standar desa?')) {
      setHeroState(prev => ({ ...prev, bgImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80' }));
      setHeroBgFileName('');
      showToast('Gambar background Hero telah diriset ke standar.');
    }
  };

  const handleKadesFotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format file tidak didukung! Mohon pilih gambar berformat JPG, JPEG, PNG, atau WebP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal ukuran file adalah 5 MB.');
        return;
      }
      setUploadingImage(true);
      try {
        const url = await uploadImage(file, 'hero');
        setHeroState(prev => ({ ...prev, kadesFoto: url }));
      } finally {
        setUploadingImage(false);
      }
    }
  };

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
  const handleBeritaFilesAdded = async (files) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!fileArray.length) return;
    setUploadingImage(true);
    try {
      for (const file of fileArray) {
        const url = await uploadImage(file, 'berita');
        const newImg = {
          id: 'b_img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          url,
          caption: 'Dokumentasi kegiatan Desa Tajemsari Tegowanu',
          isCover: false
        };
        setBeritaImagesList(prev => {
          const shouldBeCover = prev.length === 0;
          return [...prev, { ...newImg, isCover: shouldBeCover }];
        });
      }
    } finally {
      setUploadingImage(false);
    }
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

  const generateBeritaSlug = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleEditBeritaClick = (item) => {
    setEditingBeritaId(item.id);
    setNewJudul(item.judul || '');
    setNewKategori(item.kategori || 'Pembangunan');
    setNewPenulis(item.penulis || 'Sekretariat Desa Tajemsari');
    setNewTanggal(item.tanggal || new Date().toISOString().split('T')[0]);
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
    setNewPenulis('Sekretariat Desa Tajemsari');
    setNewTanggal(new Date().toISOString().split('T')[0]);
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

    const computedSlug = generateBeritaSlug(newJudul) || `berita-${Date.now()}`;

    const payload = {
      judul: newJudul,
      slug: computedSlug,
      kategori: newKategori,
      penulis: newPenulis || 'Sekretariat Desa Tajemsari',
      tanggal: newTanggal || new Date().toISOString().split('T')[0],
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
  const handleUmkmFilesAdded = async (files) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!fileArray.length) return;
    setUploadingImage(true);
    try {
      for (const file of fileArray) {
        const url = await uploadImage(file, 'umkm');
        const newImg = {
          id: 'u_img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          url,
          caption: 'Foto Produk UMKM Desa Tajemsari',
          isCover: false
        };
        setUmkmImagesList(prev => {
          const shouldBeCover = prev.length === 0;
          return [...prev, { ...newImg, isCover: shouldBeCover }];
        });
      }
    } finally {
      setUploadingImage(false);
    }
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
    setNewProdukKategori(item.kategori || 'Kuliner');
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
    setNewProdukKategori('Kuliner');
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
  const handleWisataFilesAdded = async (files) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!fileArray.length) return;
    setUploadingImage(true);
    try {
      for (const file of fileArray) {
        const url = await uploadImage(file, 'wisata');
        const newImg = {
          id: 'w_img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          url,
          caption: 'Dokumentasi Wisata Desa Tajemsari',
          isCover: false
        };
        setWisataImagesList(prev => {
          const shouldBeCover = prev.length === 0;
          return [...prev, { ...newImg, isCover: shouldBeCover }];
        });
      }
    } finally {
      setUploadingImage(false);
    }
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
  // PERMOHONAN STATUS & UPLOAD PDF MODAL LOGIC
  // ==========================================
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Siap Diunduh': return { bg: '#dcfce7', color: '#15803d', label: '🟢 Siap Diunduh' };
      case 'Siap Diambil di Balai Desa': return { bg: '#fef3c7', color: '#b45309', label: '📜 Siap Diambil di Balai Desa' };
      case 'Sedang Diproses': return { bg: '#dbeafe', color: '#1d4ed8', label: '🔵 Sedang Diproses' };
      case 'Menunggu Tanda Tangan': return { bg: '#f3e8ff', color: '#7e22ce', label: '🟣 Menunggu Tanda Tangan' };
      case 'Ditolak': return { bg: '#fee2e2', color: '#b91c1c', label: '🔴 Ditolak' };
      default: return { bg: '#fef9c3', color: '#a16207', label: '🟡 Menunggu Verifikasi' };
    }
  };

  const handleOpenStatusModal = (item) => {
    setSelectedPermohonan(item);
    setTargetStatus(item.status || 'Menunggu Verifikasi');
    setCatatanText(item.catatan_admin || '');
    setModalFileUrl(item.file_surat_url || '');
    setModalFileName(item.file_surat_name || '');
    setModalMetode(item.metode_pengambilan || 'Digital');
  };

  const handlePdfFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('File harus berformat PDF!');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setModalFileUrl(event.target.result);
        setModalFileName(file.name);
        if (targetStatus !== 'Siap Diambil di Balai Desa') {
          setTargetStatus('Siap Diunduh');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePdfFile = () => {
    setModalFileUrl('');
    setModalFileName('');
    if (targetStatus === 'Siap Diunduh') {
      setTargetStatus('Sedang Diproses');
    }
  };

  const handlePreviewPdfFile = () => {
    if (!modalFileUrl) return;
    const win = window.open();
    if (win) {
      win.document.write(`<iframe width="100%" height="100%" style="border:none;" src="${modalFileUrl}"></iframe>`);
    }
  };

  const handleUpdatePermohonanStatus = async () => {
    if (!selectedPermohonan) return;
    await apiService.updateStatusPermohonan(selectedPermohonan.id, targetStatus, catatanText, {
      file_surat_url: modalFileUrl,
      file_surat_name: modalFileName,
      metode_pengambilan: modalMetode
    });
    showToast(`Permohonan #${selectedPermohonan.nomor_tiket} berhasil diperbarui!`);
    setSelectedPermohonan(null);
    loadAllData();
  };

  // Navigation Items Definition
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'UTAMA' },
    { id: 'permohonan', label: 'Pengajuan Surat', icon: FileText, count: permohonanList.length, category: 'PELAYANAN' },
    { id: 'hero', label: 'Kelola Hero Section', icon: ImageIcon, category: 'KONTEN WEBSITE' },
    { id: 'profil', label: 'Kelola Profil Desa', icon: Globe, category: 'KONTEN WEBSITE' },
    { id: 'berita', label: 'Kelola Berita', icon: Newspaper, count: beritaList.length, category: 'MODUL UTAMA' },
    { id: 'umkm', label: 'Kelola UMKM', icon: ShoppingBag, count: umkmList.length, category: 'MODUL UTAMA' },
    { id: 'wisata', label: 'Kelola Wisata', icon: Compass, count: wisataList.length, category: 'MODUL UTAMA' },
    { id: 'footer', label: 'Kelola Footer', icon: MapPin, category: 'KONTEN WEBSITE' },
    { id: 'settings', label: 'Pengaturan Website', icon: SettingsIcon, category: 'SISTEM' },
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
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1000;
          box-shadow: 4px 0 20px rgba(0,0,0,0.15);
          border-right: 1px solid rgba(212, 175, 55, 0.25);
          overflow: hidden;
        }

        .sidebar-brand {
          padding: 1.25rem 1rem;
          display: flex;
          align-items: center;
          gap: 0.85rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background-color: #0c1f0f !important;
          flex-shrink: 0;
          height: 70px;
          box-sizing: border-box;
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
          min-height: 0;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1rem 0.65rem;
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
          padding: 1rem 0.75rem;
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
          flex-shrink: 0;
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
            top: 0;
            bottom: 0;
            left: ${mobileMenuOpen ? '0' : '-300px'};
            width: 280px;
            z-index: 2500;
          }
          .sidebar-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(2px);
            z-index: 2400;
          }
          .admin-topbar {
            padding: 0 0.85rem;
            height: 64px;
          }
          .topbar-subtitle {
            display: none !important;
          }
          .admin-content-area {
            padding: 1rem 0.85rem;
          }
          .form-grid-2col {
            grid-template-columns: 1fr;
          }
          .admin-form-card {
            padding: 1.25rem 1rem;
            border-radius: 16px;
          }
        }

        @media (max-width: 600px) {
          .user-info-text {
            display: none !important;
          }
          .btn-web-text {
            display: none !important;
          }
          .topbar-website-btn {
            padding: 0.4rem 0.55rem !important;
            border-radius: 20px !important;
          }
          .topbar-user-profile {
            padding-left: 0.4rem !important;
            border-left: none !important;
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

      {/* MOBILE SIDEBAR BACKDROP OVERLAY */}
      {mobileMenuOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="admin-main">
        {/* Topbar Header */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
            <button
              aria-label="Toggle Navigation Sidebar"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, padding: 4 }}
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

            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {menuItems.find(m => m.id === activeTab)?.label}
              </h2>
              <span className="topbar-subtitle" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Pemerintah Desa Tajemsari Tegowanu
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="topbar-website-btn"
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 700, background: '#f0fdf4', padding: '0.4rem 0.75rem', borderRadius: 20, border: '1px solid rgba(46,125,50,0.25)', whiteSpace: 'nowrap' }}
            >
              <Globe size={15} /> <span className="btn-web-text">Lihat Website Public</span>
            </a>

            <div className="topbar-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '0.6rem' }}>
              <div style={{ width: 34, height: 34, background: 'var(--color-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.88rem', flexShrink: 0 }}>
                A
              </div>
              <div className="user-info-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-dark)', lineHeight: 1.1 }}>Admin Tajemsari</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Super Admin CMS</span>
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
                <div className="card-rural">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>Permohonan Surat Terbaru</h4>
                    <button className="btn btn-outline" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }} onClick={() => setActiveTab('permohonan')}>
                      Lihat Semua
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {permohonanList.slice(0, 4).map((p) => {
                      const badgeInfo = getStatusBadgeStyle(p.status);
                      return (
                        <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '0.85rem 1rem', borderRadius: 12, border: '1px solid var(--color-border)' }}>
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>{p.nama_warga}</strong>
                            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{p.jenis_surat} • {p.nomor_tiket}</div>
                          </div>
                          <span style={{ background: badgeInfo.bg, color: badgeInfo.color, padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.72rem', fontWeight: 700 }}>
                            {badgeInfo.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

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

          {/* TAB 2: KELOLA HERO SECTION (FULL CMS BANNER & BERANDA HEADER) */}
          {activeTab === 'hero' && (
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ImageIcon size={22} color="var(--color-gold)" /> Pengaturan Banner Hero & Header Beranda (CMS)
              </h3>

              <form onSubmit={handleSaveHero}>
                {/* SECTION 1: HERO UTAMA */}
                <div style={{ background: '#f8faf8', border: '1px solid var(--color-border)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Compass size={18} color="var(--color-primary)" /> 1. Konten Hero Utama
                  </h4>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Judul Utama Hero Section *</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={heroState.judul || ''} 
                      onChange={(e) => setHeroState({ ...heroState, judul: e.target.value })} 
                      required 
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Deskripsi Singkat Profil Desa *</label>
                    <textarea 
                      className="form-input-custom" 
                      rows={3} 
                      value={heroState.deskripsi || ''} 
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
                        value={heroState.ctaPrimary || ''} 
                        onChange={(e) => setHeroState({ ...heroState, ctaPrimary: e.target.value })} 
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Link Tujuan Tombol Utama (CTA 1)</label>
                      <select 
                        className="form-input-custom" 
                        value={heroState.ctaPrimaryLink || 'layanan'} 
                        onChange={(e) => setHeroState({ ...heroState, ctaPrimaryLink: e.target.value })}
                      >
                        <option value="layanan">Halaman Layanan Surat Online (/layanan)</option>
                        <option value="potensi">Halaman Potensi & Wisata (/potensi)</option>
                        <option value="profil">Halaman Profil Desa (/profil)</option>
                        <option value="berita">Halaman Berita Desa (/berita)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Label Tombol Sekunder (CTA 2)</label>
                      <input 
                        type="text" 
                        className="form-input-custom" 
                        value={heroState.ctaSecondary || ''} 
                        onChange={(e) => setHeroState({ ...heroState, ctaSecondary: e.target.value })} 
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Link Tujuan Tombol Sekunder (CTA 2)</label>
                      <select 
                        className="form-input-custom" 
                        value={heroState.ctaSecondaryLink || 'potensi'} 
                        onChange={(e) => setHeroState({ ...heroState, ctaSecondaryLink: e.target.value })}
                      >
                        <option value="potensi">Halaman Potensi & Wisata (/potensi)</option>
                        <option value="layanan">Halaman Layanan Surat Online (/layanan)</option>
                        <option value="profil">Halaman Profil Desa (/profil)</option>
                        <option value="berita">Halaman Berita Desa (/berita)</option>
                      </select>
                    </div>
                  </div>

                  {/* UPLOAD GAMBAR BACKGROUND HERO */}
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ImageIcon size={16} color="var(--color-gold)" /> Upload Gambar Background Hero Section (JPG, PNG, WebP)
                    </label>

                    <div 
                      className="dropzone-box"
                      style={{ padding: '1.25rem 1rem', textAlign: 'center', cursor: 'pointer', marginBottom: '0.75rem' }}
                      onClick={() => document.getElementById('hero-bg-file-input').click()}
                    >
                      <Upload size={28} color="var(--color-primary)" style={{ margin: '0 auto 0.35rem auto', display: 'block' }} />
                      <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.9rem' }}>
                        Klik untuk Pilih / Unggah Gambar Background Baru (Browse File)
                      </strong>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        Format didukung: JPG, JPEG, PNG, WebP • Ukuran Maksimal: 5 MB
                      </span>
                      <input 
                        id="hero-bg-file-input" 
                        type="file" 
                        accept="image/jpeg,image/png,image/webp,image/jpg" 
                        style={{ display: 'none' }} 
                        onChange={handleHeroBgUpload} 
                      />
                    </div>

                    {/* PREVIEW & METADATA CARD */}
                    <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ImageIcon size={14} color="var(--color-primary)" /> Preview Background Hero
                        </span>
                        {heroBgFileName ? (
                          <span className="badge-gold" style={{ fontSize: '0.72rem' }}>File: {heroBgFileName}</span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Gambar Aktif</span>
                        )}
                      </div>

                      <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', height: 140, border: '2px solid var(--color-gold)' }}>
                        <img 
                          src={heroState.bgImage || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80'} 
                          alt="Hero Background Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          type="button" 
                          className="btn btn-outline" 
                          style={{ flex: 1, padding: '0.4rem', fontSize: '0.78rem', justifyContent: 'center' }}
                          onClick={() => document.getElementById('hero-bg-file-input').click()}
                        >
                          <Upload size={13} /> Upload / Ganti Foto
                        </button>
                        <button 
                          type="button" 
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.4rem 0.75rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          onClick={handleHeroBgDelete}
                        >
                          <Trash2 size={13} /> Hapus Foto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: KARTU AKSES CEPAT */}
                <div style={{ background: '#f8faf8', border: '1px solid var(--color-border)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={18} color="var(--color-primary)" /> 2. Pengaturan Kartu Akses Cepat
                  </h4>

                  <div className="form-grid-2col">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Judul Bar Akses Cepat</label>
                      <input 
                        type="text" 
                        className="form-input-custom" 
                        value={heroState.quickTitle || ''} 
                        onChange={(e) => setHeroState({ ...heroState, quickTitle: e.target.value })} 
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Subtitle Bar Akses Cepat</label>
                      <input 
                        type="text" 
                        className="form-input-custom" 
                        value={heroState.quickSubtitle || ''} 
                        onChange={(e) => setHeroState({ ...heroState, quickSubtitle: e.target.value })} 
                      />
                    </div>
                  </div>

                  {/* Card 1 */}
                  <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.85rem', marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)' }}>Kartu 1 (Surat Usaha)</strong>
                    <div className="form-grid-2col" style={{ marginTop: '0.5rem' }}>
                      <input type="text" className="form-input-custom" placeholder="Judul Kartu 1" value={heroState.quickCard1Title || ''} onChange={(e) => setHeroState({ ...heroState, quickCard1Title: e.target.value })} />
                      <input type="text" className="form-input-custom" placeholder="Deskripsi Singkat Kartu 1" value={heroState.quickCard1Desc || ''} onChange={(e) => setHeroState({ ...heroState, quickCard1Desc: e.target.value })} />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.85rem', marginBottom: '0.75rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)' }}>Kartu 2 (SKTM & KIS)</strong>
                    <div className="form-grid-2col" style={{ marginTop: '0.5rem' }}>
                      <input type="text" className="form-input-custom" placeholder="Judul Kartu 2" value={heroState.quickCard2Title || ''} onChange={(e) => setHeroState({ ...heroState, quickCard2Title: e.target.value })} />
                      <input type="text" className="form-input-custom" placeholder="Deskripsi Singkat Kartu 2" value={heroState.quickCard2Desc || ''} onChange={(e) => setHeroState({ ...heroState, quickCard2Desc: e.target.value })} />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.85rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary-dark)' }}>Kartu 3 (Potensi & Wisata)</strong>
                    <div className="form-grid-2col" style={{ marginTop: '0.5rem' }}>
                      <input type="text" className="form-input-custom" placeholder="Judul Kartu 3" value={heroState.quickCard3Title || ''} onChange={(e) => setHeroState({ ...heroState, quickCard3Title: e.target.value })} />
                      <input type="text" className="form-input-custom" placeholder="Deskripsi Singkat Kartu 3" value={heroState.quickCard3Desc || ''} onChange={(e) => setHeroState({ ...heroState, quickCard3Desc: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: KELOLA KARTU STATISTIK BERANDA (CRUD) */}
                <div style={{ background: '#f8faf8', border: '1px solid var(--color-border)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                      <BarChart3 size={18} color="var(--color-primary)" /> 3. Kelola Kartu Statistik Beranda (CRUD)
                    </h4>
                    <button 
                      type="button" 
                      className="btn btn-gold" 
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                      onClick={() => handleOpenStatModal()}
                    >
                      <Plus size={15} /> Tambah Kartu Statistik
                    </button>
                  </div>

                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                    Admin dapat menambah, mengedit, atau menghapus kartu statistik (seperti Jiwa Penduduk, Wilayah Dusun, UMKM, Luas Persawahan, dll) secara fleksibel.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
                    {statistikList.map((stat) => (
                      <div key={stat.id} style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.65rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 42, height: 42, borderRadius: 10, background: stat.colorBg || '#e8f5e9', color: stat.colorText || '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {stat.icon === 'Wheat' ? <Wheat size={22} /> : stat.icon === 'Building' ? <Building size={22} /> : stat.icon === 'Sparkles' ? <Sparkles size={22} /> : <Users size={22} />}
                          </div>
                          <div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)', lineHeight: 1 }}>{stat.angka}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 3 }}>{stat.label}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid #f0f0f0' }}>
                          <button 
                            type="button" 
                            className="btn btn-outline" 
                            style={{ flex: 1, padding: '0.35rem', fontSize: '0.78rem', justifyContent: 'center' }}
                            onClick={() => handleOpenStatModal(stat)}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                          <button 
                            type="button" 
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.35rem 0.65rem', borderRadius: 8, fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                            onClick={() => handleDeleteStatistikItem(stat.id)}
                          >
                            <Trash2 size={13} /> Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 4: SAMBUTAN KEPALA DESA */}
                <div style={{ background: '#f8faf8', border: '1px solid var(--color-border)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <User size={18} color="var(--color-primary)" /> 4. Pengaturan Kartu Sambutan Kepala Desa
                  </h4>

                  <div className="form-grid-2col">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Nama Kepala Desa *</label>
                      <input 
                        type="text" 
                        className="form-input-custom" 
                        value={heroState.kadesNama || ''} 
                        onChange={(e) => setHeroState({ ...heroState, kadesNama: e.target.value })} 
                        placeholder="H. Suhartono, S.Sos" 
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Jabatan</label>
                      <input 
                        type="text" 
                        className="form-input-custom" 
                        value={heroState.kadesJabatan || ''} 
                        onChange={(e) => setHeroState({ ...heroState, kadesJabatan: e.target.value })} 
                        placeholder="Kepala Desa Tajemsari Tegowanu" 
                      />
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Badge Top Sambutan</label>
                      <input 
                        type="text" 
                        className="form-input-custom" 
                        value={heroState.kadesBadge || ''} 
                        onChange={(e) => setHeroState({ ...heroState, kadesBadge: e.target.value })} 
                        placeholder="Sambutan Kepala Desa Tajemsari" 
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Periode Jabatan</label>
                      <input 
                        type="text" 
                        className="form-input-custom" 
                        value={heroState.kadesPeriode || ''} 
                        onChange={(e) => setHeroState({ ...heroState, kadesPeriode: e.target.value })} 
                        placeholder="Periode 2021 - 2027" 
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Judul Utama Sambutan Kades</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={heroState.kadesJudul || ''} 
                      onChange={(e) => setHeroState({ ...heroState, kadesJudul: e.target.value })} 
                      placeholder='"Terwujudnya Desa Tajemsari Berdikari, Sejahtera & Asri"' 
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Isi Naskah Sambutan Kepala Desa</label>
                    <textarea 
                      className="form-input-custom" 
                      rows={4} 
                      value={heroState.kadesSambutan || ''} 
                      onChange={(e) => setHeroState({ ...heroState, kadesSambutan: e.target.value })} 
                      placeholder="Assalamu’alaikum Warahmatullahi Wabarakatuh..." 
                    />
                  </div>

                  {/* UPLOAD FOTO KEPALA DESA */}
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Upload Foto Kepala Desa (JPG, PNG, WebP)</label>
                    <div 
                      className="dropzone-box"
                      style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', marginBottom: '0.65rem' }}
                      onClick={() => document.getElementById('kades-foto-input').click()}
                    >
                      <Upload size={24} color="var(--color-primary)" style={{ margin: '0 auto 0.25rem auto', display: 'block' }} />
                      <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.88rem' }}>Klik untuk Upload Foto Kepala Desa Baru</strong>
                      <input id="kades-foto-input" type="file" accept="image/jpeg,image/png,image/webp,image/jpg" style={{ display: 'none' }} onChange={handleKadesFotoUpload} />
                    </div>

                    {heroState.kadesFoto && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                        <img src={heroState.kadesFoto} alt="Foto Kades" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Foto Kepala Desa Terpasang</span>
                        <button type="button" style={{ marginLeft: 'auto', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.3rem 0.65rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => setHeroState({ ...heroState, kadesFoto: '' })}>
                          Hapus Foto
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '0.9rem 2.5rem', width: '100%', fontSize: '1rem' }}>
                  <Save size={20} /> Simpan Seluruh Perubahan Hero & Beranda
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: KELOLA PROFIL DESA (FULL CMS & CRUD SEJARAH, VISI MISI, PERANGKAT, APBDES) */}
          {activeTab === 'profil' && (
            <div className="admin-form-card">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Globe size={22} color="var(--color-gold)" /> Pengaturan Lengkap Katalog Profil Desa (CMS & CRUD)
              </h3>

              <form onSubmit={handleSaveProfil}>
                {/* 1. SEJARAH SINGKAT DESA */}
                <div style={{ background: '#f8faf8', border: '1px solid var(--color-border)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <History size={18} color="var(--color-primary)" /> 1. Sejarah Singkat Desa
                  </h4>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Judul Section Sejarah</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={profilState.sejarahJudul || ''} 
                      onChange={(e) => setProfilState({ ...profilState, sejarahJudul: e.target.value })} 
                      placeholder="Sejarah Singkat Desa Tajemsari" 
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Paragraf 1 (Asal-usul Nama & Geografis)</label>
                    <textarea 
                      className="form-input-custom" 
                      rows={3} 
                      value={profilState.sejarahParagraf1 || ''} 
                      onChange={(e) => setProfilState({ ...profilState, sejarahParagraf1: e.target.value })} 
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label className="admin-form-label">Paragraf 2 (Transformasi & Agrowisata)</label>
                    <textarea 
                      className="form-input-custom" 
                      rows={3} 
                      value={profilState.sejarahParagraf2 || ''} 
                      onChange={(e) => setProfilState({ ...profilState, sejarahParagraf2: e.target.value })} 
                    />
                  </div>
                </div>

                {/* 2. VISI & MISI DESA */}
                <div style={{ background: '#f8faf8', border: '1px solid var(--color-border)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Target size={18} color="var(--color-primary)" /> 2. Visi & Misi Pembangunan Desa
                  </h4>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Teks Visi Utama Desa Tajemsari</label>
                    <textarea 
                      className="form-input-custom" 
                      rows={2} 
                      value={profilState.visiJudul || ''} 
                      onChange={(e) => setProfilState({ ...profilState, visiJudul: e.target.value })} 
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Deskripsi Singkat Visi</label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={profilState.visiDeskripsi || ''} 
                      onChange={(e) => setProfilState({ ...profilState, visiDeskripsi: e.target.value })} 
                    />
                  </div>

                  {/* MISI DINAMIS (CRUD LIST) */}
                  <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1rem' }}>
                    <label className="admin-form-label" style={{ marginBottom: '0.75rem' }}>Daftar Poin Misi Utama Desa (CRUD)</label>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                      <input 
                        type="text" 
                        className="form-input-custom" 
                        placeholder="Tuliskan poin misi desa baru..." 
                        value={newMisiText} 
                        onChange={(e) => setNewMisiText(e.target.value)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMisi(); } }}
                      />
                      <button type="button" className="btn btn-gold" style={{ padding: '0.6rem 1.25rem', flexShrink: 0 }} onClick={handleAddMisi}>
                        <Plus size={16} /> Tambah Misi
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {(profilState.misiList || []).map((misi, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#f8faf8', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.6rem 0.85rem' }}>
                          <CheckCircle size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                          <span style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', flex: 1 }}>{misi}</span>
                          <button type="button" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', width: 26, height: 26, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => handleDeleteMisi(idx)} title="Hapus Misi">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. STRUKTUR ORGANISASI PERANGKAT DESA (CRUD LIST) */}
                <div style={{ background: '#f8faf8', border: '1px solid var(--color-border)', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
                      <User size={18} color="var(--color-primary)" /> 3. Kelola Perangkat Desa (CRUD Upload Foto & Jabatan)
                    </h4>
                    <button 
                      type="button" 
                      className="btn btn-gold" 
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                      onClick={() => handleOpenPerangkatModal()}
                    >
                      <Plus size={15} /> Tambah Perangkat Desa
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                    {(profilState.perangkatList || []).map((p) => (
                      <div key={p.id} style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 12, padding: '1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '0.65rem' }}>
                        <img src={p.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'} alt={p.nama} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gold)' }} />
                        <div>
                          <h5 style={{ fontSize: '0.95rem', color: 'var(--color-primary-dark)', margin: 0 }}>{p.nama}</h5>
                          <span className="badge-gold" style={{ fontSize: '0.72rem', marginTop: 4, display: 'inline-block' }}>{p.jabatan}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', width: '100%', marginTop: '0.25rem' }}>
                          <button type="button" className="btn btn-outline" style={{ flex: 1, padding: '0.3rem', fontSize: '0.75rem', justifyContent: 'center' }} onClick={() => handleOpenPerangkatModal(p)}>
                            <Edit3 size={12} /> Edit
                          </button>
                          <button type="button" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.3rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => handleDeletePerangkatItem(p.id)}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '0.9rem 2.5rem', width: '100%', fontSize: '1rem' }}>
                  <Save size={20} /> Simpan Seluruh Katalog Profil Desa
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
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#8a6d13' }}>
                      Sedang Mengedit Berita: <strong>"{newJudul}"</strong>
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

                  <div className="form-grid-2col">
                    <div className="admin-form-group">
                      <label className="admin-form-label"><Tag size={15} /> Kategori Berita *</label>
                      <select className="form-input-custom" value={newKategori} onChange={(e) => setNewKategori(e.target.value)}>
                        <option value="Pembangunan">Pembangunan</option>
                        <option value="Ekonomi">Ekonomi</option>
                        <option value="Pertanian">Pertanian</option>
                        <option value="Kesehatan">Kesehatan</option>
                        <option value="Pengumuman">Pengumuman</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label"><User size={15} /> Penulis / Redaksi *</label>
                      <input type="text" className="form-input-custom" value={newPenulis} onChange={(e) => setNewPenulis(e.target.value)} placeholder="Sekretariat Desa Tajemsari" required />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label"><Calendar size={15} /> Tanggal Publikasi *</label>
                    <input type="date" className="form-input-custom" value={newTanggal} onChange={(e) => setNewTanggal(e.target.value)} required />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label"><MessageSquare size={15} /> Ringkasan Singkat (Awal) *</label>
                    <textarea className="form-input-custom" rows={2} value={newRingkasan} onChange={(e) => setNewRingkasan(e.target.value)} placeholder="Ringkasan 1-2 kalimat..." required />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label"><FileText size={15} /> Isi Lengkap Berita *</label>
                    <textarea className="form-input-custom" rows={5} value={newIsi} onChange={(e) => setNewIsi(e.target.value)} placeholder="Tuliskan berita lengkap..." required />
                  </div>

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
                      <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.92rem' }}>Tarik & Lepas foto ke sini, atau klik untuk memilih</strong>
                      <input id="berita-file-input" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => handleBeritaFilesAdded(e.target.files)} />
                    </div>

                    {beritaImagesList.length > 0 && (
                      <div className="image-preview-list">
                        {beritaImagesList.map((img, idx) => (
                          <div key={img.id} className={`image-preview-row ${img.isCover ? 'is-cover' : ''}`}>
                            <img src={img.url} alt={`Foto ${idx+1}`} className="preview-img-square" />
                            <div style={{ flex: 1 }}>
                              {img.isCover ? <span className="cover-tag-badge"><Star size={10} fill="#fff" /> COVER UTAMA</span> : <button type="button" onClick={() => handleBeritaSetCover(img.id)} style={{ background: 'transparent', border: '1px solid var(--color-gold)', color: '#8a6d13', fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: 4, cursor: 'pointer' }}>Jadikan Cover</button>}
                            </div>
                            <button type="button" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '0.25rem 0.4rem', cursor: 'pointer' }} onClick={() => handleBeritaDeleteImage(img.id)}><Trash2 size={14} /></button>
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
                          <h4 style={{ fontSize: '0.98rem', color: 'var(--color-primary-dark)', marginTop: 2 }}>{item.judul}</h4>
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
                        <option value="Kuliner">Kuliner</option>
                        <option value="Kerajinan">Kerajinan</option>
                        <option value="Jasa">Jasa</option>
                        <option value="Pertanian">Pertanian</option>
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
                            <button type="button" style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 4, padding: '0.25rem 0.4rem', cursor: 'pointer' }} onClick={() => handleDeleteWisata(img.id)}><Trash2 size={14} /></button>
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

          {/* TAB 7: PENGAJUAN SURAT WARGA & UPLOAD SURAT JADI (PDF) */}
          {activeTab === 'permohonan' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)' }}>
                    Kelola Seluruh Pengajuan Surat Masyarakat Tajemsari
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Verifikasi berkas, ubah status pengerjaan, dan unggah file surat PDF yang sudah jadi untuk diunduh warga.
                  </p>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Tiket & Tanggal</th>
                      <th>Detail Pemohon</th>
                      <th>Jenis Surat</th>
                      <th>Keperluan</th>
                      <th>Status & Metode</th>
                      <th>Dokumen PDF</th>
                      <th>Aksi Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permohonanList.map((item) => {
                      const badgeInfo = getStatusBadgeStyle(item.status);
                      return (
                        <tr key={item.id}>
                          <td>
                            <strong>#{item.nomor_tiket}</strong><br />
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
                          <td style={{ maxWidth: 200 }}>{item.keperluan}</td>
                          <td>
                            <span style={{ background: badgeInfo.bg, color: badgeInfo.color, padding: '0.3rem 0.65rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, display: 'inline-block', marginBottom: 4 }}>
                              {badgeInfo.label}
                            </span><br />
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                              Metode: <strong>{item.metode_pengambilan || 'Digital'}</strong>
                            </span>
                          </td>
                          <td>
                            {item.file_surat_url ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <FileCheck size={14} /> PDF Terunggah
                                </span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.file_surat_name || 'Dokumen_Surat.pdf'}
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', italic: 'true' }}>
                                Belum Ada File PDF
                              </span>
                            )}
                          </td>
                          <td>
                            <button 
                              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #1b5e20 100%)', color: '#fff', border: 'none', padding: '0.5rem 0.85rem', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 6px rgba(46,125,50,0.25)' }}
                              onClick={() => handleOpenStatusModal(item)}
                            >
                              <Upload size={14} /> Kelola & Upload PDF
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
                  <textarea className="form-input-custom" rows={2} value={footerState.alamat} onChange={(e) => setFooterState({ ...footerState, alamat: e.target.value })} required />
                </div>

                <div className="form-grid-2col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">No. Telepon Kantor</label>
                    <input type="text" className="form-input-custom" value={footerState.telepon} onChange={(e) => setFooterState({ ...footerState, telepon: e.target.value })} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">WhatsApp Official Desa</label>
                    <input type="text" className="form-input-custom" value={footerState.whatsapp} onChange={(e) => setFooterState({ ...footerState, whatsapp: e.target.value })} />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email Resmi Desa</label>
                    <input type="email" className="form-input-custom" value={footerState.email} onChange={(e) => setFooterState({ ...footerState, email: e.target.value })} />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Jam Pelayanan Kantor</label>
                    <input type="text" className="form-input-custom" value={footerState.jamPelayanan} onChange={(e) => setFooterState({ ...footerState, jamPelayanan: e.target.value })} />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Tautan Google Maps Desa Tajemsari</label>
                  <input type="text" className="form-input-custom" value={footerState.mapsUrl} onChange={(e) => setFooterState({ ...footerState, mapsUrl: e.target.value })} />
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
                    <input type="text" className="form-input-custom" value={settingsState.namaDesa} onChange={(e) => setSettingsState({ ...settingsState, namaDesa: e.target.value })} required />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Kecamatan *</label>
                    <input type="text" className="form-input-custom" value={settingsState.kecamatan} onChange={(e) => setSettingsState({ ...settingsState, kecamatan: e.target.value })} required />
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Kabupaten *</label>
                    <input type="text" className="form-input-custom" value={settingsState.kabupaten} onChange={(e) => setSettingsState({ ...settingsState, kabupaten: e.target.value })} required />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email Admin Login</label>
                    <input type="email" className="form-input-custom" value={settingsState.emailAdmin} onChange={(e) => setSettingsState({ ...settingsState, emailAdmin: e.target.value })} />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Pengumuman / Teks Berjalan Running Text</label>
                  <textarea className="form-input-custom" rows={2} value={settingsState.runningText} onChange={(e) => setSettingsState({ ...settingsState, runningText: e.target.value })} />
                </div>

                <button type="submit" className="btn btn-gold" style={{ padding: '0.85rem 2rem' }}>
                  <Save size={18} /> Simpan Pengaturan Umum
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* MODAL KELOLA PERMOHONAN & UPLOAD SURAT PDF */}
      {selectedPermohonan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#ffffff', borderRadius: 24, padding: '2rem', maxWidth: 560, width: '92%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', border: '2px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary-dark)', margin: 0 }}>
                  Kelola Surat #{selectedPermohonan.nomor_tiket}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Pemohon: <strong>{selectedPermohonan.nama_warga}</strong> • {selectedPermohonan.jenis_surat}
                </span>
              </div>
              <button onClick={() => setSelectedPermohonan(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Pilihan Status Pengajuan */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                <Tag size={15} /> Update Status Permohonan *
              </label>
              <select className="form-input-custom" value={targetStatus} onChange={(e) => setTargetStatus(e.target.value)}>
                <option value="Menunggu Verifikasi">🟡 Menunggu Verifikasi</option>
                <option value="Sedang Diproses">🔵 Sedang Diproses</option>
                <option value="Menunggu Tanda Tangan">🟣 Menunggu Tanda Tangan</option>
                <option value="Siap Diunduh">🟢 Siap Diunduh (Digital PDF)</option>
                <option value="Siap Diambil di Balai Desa">📜 Siap Diambil di Balai Desa (Fisik)</option>
                <option value="Ditolak">🔴 Ditolak</option>
              </select>
            </div>

            {/* Metode Pengambilan */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                <FileCheck size={15} /> Metode Layanan Hasil Surat *
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <label style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="metode" 
                    value="Digital" 
                    checked={modalMetode === 'Digital'} 
                    onChange={() => setModalMetode('Digital')} 
                  />
                  <span>Digital (Warga Unduh PDF Online)</span>
                </label>
                <label style={{ fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="metode" 
                    value="Fisik" 
                    checked={modalMetode === 'Fisik'} 
                    onChange={() => {
                      setModalMetode('Fisik');
                      setTargetStatus('Siap Diambil di Balai Desa');
                    }} 
                  />
                  <span>Fisik (Dokumen di Balai Desa)</span>
                </label>
              </div>
            </div>

            {/* Section Upload File Surat PDF Jadi */}
            <div className="admin-form-group" style={{ background: '#f8faf8', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1.25rem' }}>
              <label className="admin-form-label" style={{ marginBottom: '0.5rem' }}>
                <Upload size={16} /> Unggah File Surat Selesai (Format PDF)
              </label>

              {modalFileUrl ? (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #10b981', borderRadius: 12, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                    <div style={{ width: 40, height: 40, background: '#10b981', borderRadius: 10, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={22} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={{ fontSize: '0.88rem', color: '#065f46', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {modalFileName || 'Surat_Jadi.pdf'}
                      </strong>
                      <span style={{ fontSize: '0.75rem', color: '#047857' }}>Format PDF Terunggah</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button 
                      type="button" 
                      onClick={handlePreviewPdfFile}
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.4rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      title="Lihat PDF"
                    >
                      <Eye size={14} /> Lihat PDF
                    </button>
                    <button 
                      type="button" 
                      onClick={() => document.getElementById('pdf-file-change-input').click()}
                      style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '0.4rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      title="Ganti File"
                    >
                      <RefreshCw size={14} /> Ganti
                    </button>
                    <button 
                      type="button" 
                      onClick={handleRemovePdfFile}
                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.4rem 0.5rem', borderRadius: 8, cursor: 'pointer' }}
                      title="Hapus File PDF"
                    >
                      <Trash2 size={14} />
                    </button>

                    <input 
                      id="pdf-file-change-input"
                      type="file" 
                      accept="application/pdf" 
                      style={{ display: 'none' }} 
                      onChange={handlePdfFileChange}
                    />
                  </div>
                </div>
              ) : (
                <div 
                  className="dropzone-box" 
                  style={{ marginBottom: 0, padding: '1.25rem 1rem' }}
                  onClick={() => document.getElementById('pdf-file-input').click()}
                >
                  <Upload size={28} color="var(--color-primary)" style={{ margin: '0 auto 0.35rem auto', display: 'block' }} />
                  <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.9rem', display: 'block' }}>
                    Klik untuk Unggah Berkas Surat PDF
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Format file harus .pdf (Maksimal 10MB)
                  </span>

                  <input 
                    id="pdf-file-input"
                    type="file" 
                    accept="application/pdf" 
                    style={{ display: 'none' }} 
                    onChange={handlePdfFileChange}
                  />
                </div>
              )}
            </div>

            {/* Catatan Petugas Admin */}
            <div className="admin-form-group">
              <label className="admin-form-label"><MessageSquare size={15} /> Catatan Petugas (Tampil pada Lacak Warga)</label>
              <textarea 
                className="form-input-custom" 
                rows={3} 
                value={catatanText} 
                onChange={(e) => setCatatanText(e.target.value)} 
                placeholder="Contoh: Berkas Surat Keterangan telah terverifikasi dan ditandatangani..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button className="btn btn-outline" onClick={() => setSelectedPermohonan(null)}>
                Batal
              </button>
              <button className="btn btn-primary" onClick={handleUpdatePermohonanStatus} style={{ padding: '0.75rem 1.5rem' }}>
                <Save size={16} /> Simpan & Perbarui Tiket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT KARTU STATISTIK */}
      {showStatModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-scale-up" style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                <BarChart3 size={20} color="var(--color-gold)" /> {editingStatId ? 'Edit Kartu Statistik' : 'Tambah Kartu Statistik Baru'}
              </h3>
              <button onClick={() => setShowStatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStatistikItem}>
              <div className="admin-form-group">
                <label className="admin-form-label">Angka / Jumlah Nominal *</label>
                <input 
                  type="text" 
                  className="form-input-custom" 
                  placeholder="Contoh: 2.845 Jiwa, 4 RT / 2 RW, 12 UMKM, 340 Ha" 
                  value={statForm.angka} 
                  onChange={(e) => setStatForm({ ...statForm, angka: e.target.value })} 
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Label / Keterangan Indikator *</label>
                <input 
                  type="text" 
                  className="form-input-custom" 
                  placeholder="Contoh: Jiwa Penduduk, Wilayah Dusun, Produk Unggulan" 
                  value={statForm.label} 
                  onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} 
                  required 
                />
              </div>

              <div className="form-grid-2col">
                <div className="admin-form-group">
                  <label className="admin-form-label">Pilihan Ikon</label>
                  <select 
                    className="form-input-custom" 
                    value={statForm.icon} 
                    onChange={(e) => setStatForm({ ...statForm, icon: e.target.value })}
                  >
                    <option value="Users">👥 Users (Penduduk)</option>
                    <option value="Building">🏢 Building (Dusun / Wilayah)</option>
                    <option value="Sparkles">✨ Sparkles (UMKM / Unggulan)</option>
                    <option value="Wheat">🌾 Wheat (Pertanian)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Warna Ikon & Background</label>
                  <select 
                    className="form-input-custom" 
                    value={statForm.colorBg} 
                    onChange={(e) => {
                      const bg = e.target.value;
                      let txt = '#2e7d32';
                      if (bg === '#fef9e7') txt = '#d4af37';
                      if (bg === '#e0f2fe') txt = '#0284c7';
                      setStatForm({ ...statForm, colorBg: bg, colorText: txt });
                    }}
                  >
                    <option value="#e8f5e9">🟢 Hijau Soft (Utama)</option>
                    <option value="#fef9e7">🟡 Emas Soft (Pertanian/Spesial)</option>
                    <option value="#e0f2fe">🔵 Biru Soft (UMKM/Layanan)</option>
                  </select>
                </div>
              </div>

              {/* Preview Card */}
              <div style={{ background: '#f8faf8', border: '1px solid var(--color-border)', borderRadius: 12, padding: '0.85rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>PREVIEW TAMPILAN KARTU</span>
                <div className="stat-card" style={{ background: '#ffffff', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 14, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: statForm.colorBg, color: statForm.colorText, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem auto' }}>
                    {statForm.icon === 'Wheat' ? <Wheat size={22} /> : statForm.icon === 'Building' ? <Building size={22} /> : statForm.icon === 'Sparkles' ? <Sparkles size={22} /> : <Users size={22} />}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>{statForm.angka || 'Angka Stat'}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>{statForm.label || 'Label Stat'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowStatModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-gold" style={{ padding: '0.75rem 1.5rem' }}>
                  <Save size={16} /> {editingStatId ? 'Simpan Perubahan' : 'Tambah Kartu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT PERANGKAT DESA */}
      {showPerangkatModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-scale-up" style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                <User size={20} color="var(--color-gold)" /> {editingPerangkatId ? 'Edit Perangkat Desa' : 'Tambah Perangkat Desa Baru'}
              </h3>
              <button onClick={() => setShowPerangkatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePerangkatItem}>
              <div className="admin-form-group">
                <label className="admin-form-label">Nama Lengkap & Gelar *</label>
                <input 
                  type="text" 
                  className="form-input-custom" 
                  placeholder="Contoh: Bambang Wijaya, S.T" 
                  value={perangkatForm.nama} 
                  onChange={(e) => setPerangkatForm({ ...perangkatForm, nama: e.target.value })} 
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Jabatan Aparatur *</label>
                <input 
                  type="text" 
                  className="form-input-custom" 
                  placeholder="Contoh: Sekretaris Desa / Kaur Keuangan / Kasi Pelayanan" 
                  value={perangkatForm.jabatan} 
                  onChange={(e) => setPerangkatForm({ ...perangkatForm, jabatan: e.target.value })} 
                  required 
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Upload Foto Perangkat (JPG, PNG, WebP)</label>
                <div 
                  className="dropzone-box"
                  style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', marginBottom: '0.75rem' }}
                  onClick={() => document.getElementById('perangkat-foto-file-input').click()}
                >
                  <Upload size={24} color="var(--color-primary)" style={{ margin: '0 auto 0.25rem auto', display: 'block' }} />
                  <strong style={{ color: 'var(--color-primary-dark)', fontSize: '0.88rem' }}>Klik untuk Unggah Foto Perangkat Baru</strong>
                  <input id="perangkat-foto-file-input" type="file" accept="image/jpeg,image/png,image/webp,image/jpg" style={{ display: 'none' }} onChange={handlePerangkatFotoUpload} />
                </div>

                {perangkatForm.foto && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#f8faf8', padding: '0.6rem 0.85rem', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                    <img src={perangkatForm.foto} alt="Perangkat" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Foto Terpasang</span>
                    <button type="button" style={{ marginLeft: 'auto', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '0.3rem 0.6rem', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }} onClick={() => setPerangkatForm({ ...perangkatForm, foto: '' })}>
                      Hapus Foto
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowPerangkatModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn btn-gold" style={{ padding: '0.75rem 1.5rem' }}>
                  <Save size={16} /> {editingPerangkatId ? 'Simpan Perubahan' : 'Tambah Perangkat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Global Upload Loading Overlay */}
      {uploadingImage && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(10, 20, 12, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: '#ffffff',
          pointerEvents: 'all'
        }}>
          <div style={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #2e7d32, #d4af37)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'spin 1s linear infinite',
            boxShadow: '0 0 25px rgba(212,175,55,0.5)'
          }}>
            <Loader size={28} color="#ffffff" />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: 4 }}>Mengupload Foto...</div>
            <div style={{ fontSize: '0.88rem', color: '#a7f3d0', opacity: 0.85 }}>Foto sedang disimpan ke Supabase Storage</div>
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </div>
  );
}
