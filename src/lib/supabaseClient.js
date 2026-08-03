import { createClient } from '@supabase/supabase-js';
import { 
  INITIAL_BERITA, 
  INITIAL_UMKM, 
  INITIAL_WISATA, 
  INITIAL_PERMOHONAN,
  INITIAL_HERO,
  INITIAL_PROFIL,
  INITIAL_FOOTER,
  INITIAL_SETTINGS,
  INITIAL_STATISTIK
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
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('hero_section').select('*').eq('id', 1).single();
        if (!error && data) {
          return {
            ...INITIAL_HERO,
            badge: data.badge || INITIAL_HERO.badge,
            judul: data.judul || INITIAL_HERO.judul,
            deskripsi: data.deskripsi || INITIAL_HERO.deskripsi,
            bgImage: data.bg_image || INITIAL_HERO.bgImage,
            kadesNama: data.kades_nama || INITIAL_HERO.kadesNama,
            kadesJabatan: data.kades_jabatan || INITIAL_HERO.kadesJabatan,
            kadesPeriode: data.kades_periode || INITIAL_HERO.kadesPeriode,
            kadesFoto: data.kades_foto || INITIAL_HERO.kadesFoto,
            kadesSambutan: data.kades_sambutan || INITIAL_HERO.kadesSambutan,
            statPenduduk: data.stat_penduduk || INITIAL_HERO.statPenduduk,
            statRtRw: data.stat_rt_rw || INITIAL_HERO.statRtRw,
            statUmkm: data.stat_umkm || INITIAL_HERO.statUmkm,
          };
        }
      } catch (e) {
        console.error("Supabase getHero error:", e);
      }
    }
    const stored = getStorageItem('hero', INITIAL_HERO);
    return { ...INITIAL_HERO, ...(stored || {}) };
  },

  async updateHero(heroData) {
    const merged = { ...INITIAL_HERO, ...(heroData || {}) };
    if (isSupabaseConfigured) {
      try {
        await supabase.from('hero_section').upsert([{
          id: 1,
          badge: merged.badge,
          judul: merged.judul,
          deskripsi: merged.deskripsi,
          bg_image: merged.bgImage,
          kades_nama: merged.kadesNama,
          kades_jabatan: merged.kadesJabatan,
          kades_periode: merged.kadesPeriode,
          kades_foto: merged.kadesFoto,
          kades_sambutan: merged.kadesSambutan,
          stat_penduduk: merged.statPenduduk,
          stat_rt_rw: merged.statRtRw,
          stat_umkm: merged.statUmkm,
          updated_at: new Date().toISOString()
        }]);
      } catch (e) {
        console.error("Supabase updateHero error:", e);
      }
    }
    setStorageItem('hero', merged);
    return merged;
  },

  // --- STATISTIK BERANDA (CRUD) ---
  async getStatistik() {
    const stored = getStorageItem('statistik', INITIAL_STATISTIK);
    return (Array.isArray(stored) && stored.length > 0) ? stored : INITIAL_STATISTIK;
  },
  async addStatistik(statItem) {
    const current = await this.getStatistik();
    const item = { ...statItem, id: Date.now() };
    const updated = [...current, item];
    setStorageItem('statistik', updated);
    return item;
  },
  async updateStatistik(id, updatedStat) {
    const current = await this.getStatistik();
    const updated = current.map(s => s.id === id ? { ...s, ...updatedStat } : s);
    setStorageItem('statistik', updated);
    return true;
  },
  async deleteStatistik(id) {
    const current = await this.getStatistik();
    const updated = current.filter(s => s.id !== id);
    setStorageItem('statistik', updated);
    return true;
  },

  // --- CMS PROFIL DESA ---
  async getProfil() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('profil_desa').select('*').eq('id', 1).single();
        if (!error && data) {
          return {
            ...INITIAL_PROFIL,
            sejarahJudul: data.sejarah_judul || INITIAL_PROFIL.sejarahJudul,
            sejarahParagraf1: data.sejarah_paragraf1 || INITIAL_PROFIL.sejarahParagraf1,
            sejarahParagraf2: data.sejarah_paragraf2 || INITIAL_PROFIL.sejarahParagraf2,
            visiJudul: data.visi_judul || INITIAL_PROFIL.visiJudul,
            visiDeskripsi: data.visi_deskripsi || INITIAL_PROFIL.visiDeskripsi,
            misiList: data.misi_list || INITIAL_PROFIL.misiList,
          };
        }
      } catch (e) {
        console.error("Supabase getProfil error:", e);
      }
    }
    return getStorageItem('profil', INITIAL_PROFIL);
  },

  async updateProfil(profilData) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('profil_desa').upsert([{
          id: 1,
          sejarah_judul: profilData.sejarahJudul,
          sejarah_paragraf1: profilData.sejarahParagraf1,
          sejarah_paragraf2: profilData.sejarahParagraf2,
          visi_judul: profilData.visiJudul,
          visi_deskripsi: profilData.visiDeskripsi,
          misi_list: profilData.misiList,
          updated_at: new Date().toISOString()
        }]);
      } catch (e) {
        console.error("Supabase updateProfil error:", e);
      }
    }
    setStorageItem('profil', profilData);
    return profilData;
  },

  // --- CMS FOOTER ---
  async getFooter() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('footer_info').select('*').eq('id', 1).single();
        if (!error && data) {
          return {
            ...INITIAL_FOOTER,
            alamat: data.alamat || INITIAL_FOOTER.alamat,
            telepon: data.telepon || INITIAL_FOOTER.telepon,
            whatsapp: data.whatsapp || INITIAL_FOOTER.whatsapp,
            email: data.email || INITIAL_FOOTER.email,
            jamPelayanan: data.jam_pelayanan || INITIAL_FOOTER.jamPelayanan,
            mapsUrl: data.maps_url || INITIAL_FOOTER.mapsUrl,
            facebook: data.facebook || INITIAL_FOOTER.facebook,
            instagram: data.instagram || INITIAL_FOOTER.instagram,
            youtube: data.youtube || INITIAL_FOOTER.youtube,
          };
        }
      } catch (e) {
        console.error("Supabase getFooter error:", e);
      }
    }
    return getStorageItem('footer', INITIAL_FOOTER);
  },

  async updateFooter(footerData) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('footer_info').upsert([{
          id: 1,
          alamat: footerData.alamat,
          telepon: footerData.telepon,
          whatsapp: footerData.whatsapp,
          email: footerData.email,
          jam_pelayanan: footerData.jamPelayanan,
          maps_url: footerData.mapsUrl,
          facebook: footerData.facebook,
          instagram: footerData.instagram,
          youtube: footerData.youtube,
          updated_at: new Date().toISOString()
        }]);
      } catch (e) {
        console.error("Supabase updateFooter error:", e);
      }
    }
    setStorageItem('footer', footerData);
    return footerData;
  },

  // --- CMS SETTINGS ---
  async getSettings() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('website_settings').select('*').eq('id', 1).single();
        if (!error && data) {
          return {
            ...INITIAL_SETTINGS,
            namaDesa: data.nama_desa || INITIAL_SETTINGS.namaDesa,
            kecamatan: data.kecamatan || INITIAL_SETTINGS.kecamatan,
            kabupaten: data.kabupaten || INITIAL_SETTINGS.kabupaten,
            provinsi: data.provinsi || INITIAL_SETTINGS.provinsi,
            emailAdmin: data.email_admin || INITIAL_SETTINGS.emailAdmin,
            teleponKantor: data.telepon_kantor || INITIAL_SETTINGS.teleponKantor,
            runningText: data.running_text || INITIAL_SETTINGS.runningText,
          };
        }
      } catch (e) {
        console.error("Supabase getSettings error:", e);
      }
    }
    return getStorageItem('settings', INITIAL_SETTINGS);
  },

  async updateSettings(settingsData) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('website_settings').upsert([{
          id: 1,
          nama_desa: settingsData.namaDesa,
          kecamatan: settingsData.kecamatan,
          kabupaten: settingsData.kabupaten,
          provinsi: settingsData.provinsi,
          email_admin: settingsData.emailAdmin,
          telepon_kantor: settingsData.teleponKantor,
          running_text: settingsData.runningText,
          updated_at: new Date().toISOString()
        }]);
      } catch (e) {
        console.error("Supabase updateSettings error:", e);
      }
    }
    setStorageItem('settings', settingsData);
    return settingsData;
  },

  // --- AUTHENTICATION ADMIN ---
  async verifyAdminLogin(identifier, password) {
    const cleanId = String(identifier || '').trim();
    const cleanPass = String(password || '').trim();

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .or(`username.eq.${cleanId},email.eq.${cleanId}`)
          .eq('password', cleanPass);
        
        if (!error && data && data.length > 0) {
          return { success: true, user: data[0] };
        }
      } catch (err) {
        console.error("Supabase Admin Auth error:", err);
      }
    }

    // Default Fallback Admin Check
    if ((cleanId === 'admin' || cleanId === 'admin@tajemsari.desa.id') && cleanPass === 'admin123') {
      return { success: true, user: { username: 'admin', email: 'admin@tajemsari.desa.id', role: 'Admin Utama' } };
    }

    return { success: false, message: 'Username/Email atau Kata Sandi yang Anda masukkan salah.' };
  }
};
