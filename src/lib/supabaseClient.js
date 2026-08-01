import { createClient } from '@supabase/supabase-js';
import { 
  INITIAL_BERITA, 
  INITIAL_UMKM, 
  INITIAL_WISATA, 
  INITIAL_PERMOHONAN,
  INITIAL_HERO,
  INITIAL_PROFIL,
  INITIAL_FOOTER,
  INITIAL_SETTINGS
} from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// True if user supplied valid Supabase credentials
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project-id')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// LocalStorage Helper for Seamless Demo / Hybrid Mode
const getStorageItem = (key, fallback) => {
  try {
    const data = localStorage.getItem(`tajemsari_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(`tajemsari_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

// Data API Handlers (Supports both Supabase Cloud & Local Fallback Mode)
export const apiService = {
  // --- BERITA ---
  async getBerita() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('berita').select('*').order('tanggal', { ascending: false });
      if (!error && data?.length) return data;
    }
    return getStorageItem('berita', INITIAL_BERITA);
  },

  async addBerita(newBerita) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('berita').insert([newBerita]).select();
      if (!error) return data[0];
    }
    const current = getStorageItem('berita', INITIAL_BERITA);
    const item = { ...newBerita, id: Date.now(), tanggal: new Date().toISOString().split('T')[0] };
    const updated = [item, ...current];
    setStorageItem('berita', updated);
    return item;
  },

  async updateBerita(id, updatedBerita) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('berita').update(updatedBerita).eq('id', id).select();
      if (!error && data?.length) return data[0];
    }
    const current = getStorageItem('berita', INITIAL_BERITA);
    const updated = current.map(b => b.id === id ? { ...b, ...updatedBerita } : b);
    setStorageItem('berita', updated);
    return true;
  },

  async deleteBerita(id) {
    if (isSupabaseConfigured) {
      await supabase.from('berita').delete().eq('id', id);
    }
    const current = getStorageItem('berita', INITIAL_BERITA);
    const updated = current.filter(b => b.id !== id);
    setStorageItem('berita', updated);
    return true;
  },

  // --- PERMOHONAN SURAT ---
  async getPermohonan() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('permohonan_surat').select('*').order('tanggal_pengajuan', { ascending: false });
      if (!error && data?.length) return data;
    }
    return getStorageItem('permohonan', INITIAL_PERMOHONAN);
  },

  async createPermohonan(form) {
    const tiket = `TJM-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const newPermohonan = {
      ...form,
      nomor_tiket: tiket,
      status: 'Menunggu',
      tanggal_pengajuan: new Date().toLocaleString('id-ID')
    };

    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('permohonan_surat').insert([newPermohonan]).select();
      if (!error && data?.length) return data[0];
    }

    const current = getStorageItem('permohonan', INITIAL_PERMOHONAN);
    const updated = [newPermohonan, ...current];
    setStorageItem('permohonan', updated);
    return newPermohonan;
  },

  async updateStatusPermohonan(id, status, catatan) {
    if (isSupabaseConfigured) {
      await supabase.from('permohonan_surat').update({ status, catatan_admin: catatan }).eq('id', id);
    }
    const current = getStorageItem('permohonan', INITIAL_PERMOHONAN);
    const updated = current.map(p => p.id === id ? { ...p, status, catatan_admin: catatan } : p);
    setStorageItem('permohonan', updated);
    return true;
  },

  // --- UMKM ---
  async getUMKM() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('umkm').select('*');
      if (!error && data?.length) return data;
    }
    return getStorageItem('umkm', INITIAL_UMKM);
  },

  async addUMKM(newProduct) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('umkm').insert([newProduct]).select();
      if (!error) return data[0];
    }
    const current = getStorageItem('umkm', INITIAL_UMKM);
    const item = { ...newProduct, id: Date.now() };
    const updated = [...current, item];
    setStorageItem('umkm', updated);
    return item;
  },

  async updateUMKM(id, updatedProduct) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('umkm').update(updatedProduct).eq('id', id).select();
      if (!error && data?.length) return data[0];
    }
    const current = getStorageItem('umkm', INITIAL_UMKM);
    const updated = current.map(u => u.id === id ? { ...u, ...updatedProduct } : u);
    setStorageItem('umkm', updated);
    return true;
  },

  async deleteUMKM(id) {
    if (isSupabaseConfigured) {
      await supabase.from('umkm').delete().eq('id', id);
    }
    const current = getStorageItem('umkm', INITIAL_UMKM);
    const updated = current.filter(u => u.id !== id);
    setStorageItem('umkm', updated);
    return true;
  },

  // --- WISATA ---
  async getWisata() {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('wisata').select('*');
      if (!error && data?.length) return data;
    }
    return getStorageItem('wisata', INITIAL_WISATA);
  },

  async addWisata(newSpot) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('wisata').insert([newSpot]).select();
      if (!error) return data[0];
    }
    const current = getStorageItem('wisata', INITIAL_WISATA);
    const item = { ...newSpot, id: Date.now() };
    const updated = [...current, item];
    setStorageItem('wisata', updated);
    return item;
  },

  async updateWisata(id, updatedSpot) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('wisata').update(updatedSpot).eq('id', id).select();
      if (!error && data?.length) return data[0];
    }
    const current = getStorageItem('wisata', INITIAL_WISATA);
    const updated = current.map(w => w.id === id ? { ...w, ...updatedSpot } : w);
    setStorageItem('wisata', updated);
    return true;
  },

  async deleteWisata(id) {
    if (isSupabaseConfigured) {
      await supabase.from('wisata').delete().eq('id', id);
    }
    const current = getStorageItem('wisata', INITIAL_WISATA);
    const updated = current.filter(w => w.id !== id);
    setStorageItem('wisata', updated);
    return true;
  },

  // --- CMS HERO SECTION ---
  async getHero() {
    return getStorageItem('hero', INITIAL_HERO);
  },
  async updateHero(heroData) {
    setStorageItem('hero', heroData);
    return heroData;
  },

  // --- CMS PROFIL DESA ---
  async getProfil() {
    return getStorageItem('profil', INITIAL_PROFIL);
  },
  async updateProfil(profilData) {
    setStorageItem('profil', profilData);
    return profilData;
  },

  // --- CMS FOOTER ---
  async getFooter() {
    return getStorageItem('footer', INITIAL_FOOTER);
  },
  async updateFooter(footerData) {
    setStorageItem('footer', footerData);
    return footerData;
  },

  // --- CMS SETTINGS ---
  async getSettings() {
    return getStorageItem('settings', INITIAL_SETTINGS);
  },
  async updateSettings(settingsData) {
    setStorageItem('settings', settingsData);
    return settingsData;
  }
};
