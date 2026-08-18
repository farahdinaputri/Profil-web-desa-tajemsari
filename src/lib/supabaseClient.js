import { createClient } from '@supabase/supabase-js';
import { 
  INITIAL_BERITA, 
  INITIAL_UMKM, 
  INITIAL_WISATA, 
  INITIAL_HERO,
  INITIAL_PROFIL,
  INITIAL_LEMBAGA,
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

// =========================================================================
// SUPABASE STORAGE — Upload Image & Get Public URL
// Bucket: "desa-tajemsari" (must be set as Public in Supabase Dashboard)
// =========================================================================
export const uploadImage = async (file, folder = 'umum') => {
  if (!isSupabaseConfigured || !supabase) {
    // Fallback: return a local blob URL (only valid in current browser session)
    return URL.createObjectURL(file);
  }

  try {
    const ext = file.name.split('.').pop().toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 8);
    const fileName = `${folder}/${timestamp}_${random}.${ext}`;

    const { data, error } = await supabase.storage
      .from('desa-tajemsari')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      // Fallback ke blob URL lokal jika upload gagal
      return URL.createObjectURL(file);
    }

    // Dapatkan public URL dari file yang berhasil diupload
    const { data: urlData } = supabase.storage
      .from('desa-tajemsari')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (e) {
    console.error('uploadImage error:', e);
    return URL.createObjectURL(file);
  }
};

// =========================================================================
// LocalStorage Helper for Seamless Demo / Hybrid Mode
// =========================================================================
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

// =========================================================================
// Data API Handlers (Supports both Supabase Cloud & Local Fallback Mode)
// =========================================================================
export const apiService = {
  // --- BERITA ---
  async getBerita() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('berita').select('*').order('tanggal', { ascending: false }).order('id', { ascending: false });
        if (!error && data) {
          setStorageItem('berita', data);
          return data;
        }
        console.error('Supabase getBerita error:', error);
      } catch (e) {
        console.error('Supabase getBerita exception:', e);
      }
    }
    return getStorageItem('berita', INITIAL_BERITA);
  },

  async addBerita(newBerita) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('berita').insert([newBerita]).select();
        if (!error && data?.length) {
          const current = getStorageItem('berita', []);
          const updated = [data[0], ...current.filter(b => b.id !== data[0].id)];
          setStorageItem('berita', updated);
          return data[0];
        }
        console.error('Supabase addBerita error:', error);
      } catch (e) {
        console.error('Supabase addBerita exception:', e);
      }
    }
    const current = getStorageItem('berita', INITIAL_BERITA);
    const item = { ...newBerita, id: Date.now(), tanggal: new Date().toISOString().split('T')[0] };
    const updated = [item, ...current];
    setStorageItem('berita', updated);
    return item;
  },

  async updateBerita(id, updatedBerita) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('berita').update(updatedBerita).eq('id', id).select();
        if (!error && data?.length) {
          const current = getStorageItem('berita', []);
          const updated = current.map(b => b.id === id ? data[0] : b);
          setStorageItem('berita', updated);
          return data[0];
        }
        console.error('Supabase updateBerita error:', error);
      } catch (e) {
        console.error('Supabase updateBerita exception:', e);
      }
    }
    const current = getStorageItem('berita', INITIAL_BERITA);
    const updated = current.map(b => b.id === id ? { ...b, ...updatedBerita } : b);
    setStorageItem('berita', updated);
    return true;
  },

  async deleteBerita(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('berita').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteBerita error:', e);
      }
    }
    const current = getStorageItem('berita', INITIAL_BERITA);
    const updated = current.filter(b => b.id !== id);
    setStorageItem('berita', updated);
    return true;
  },

  // --- UMKM ---
  async getUMKM() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('umkm').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setStorageItem('umkm', data);
          return data;
        }
        console.error('Supabase getUMKM error:', error);
      } catch (e) {
        console.error('Supabase getUMKM exception:', e);
      }
    }
    return getStorageItem('umkm', INITIAL_UMKM);
  },

  async addUMKM(newProduct) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('umkm').insert([newProduct]).select();
        if (!error && data?.length) {
          const current = getStorageItem('umkm', []);
          const updated = [data[0], ...current.filter(u => u.id !== data[0].id)];
          setStorageItem('umkm', updated);
          return data[0];
        }
        console.error('Supabase addUMKM error:', error);
      } catch (e) {
        console.error('Supabase addUMKM exception:', e);
      }
    }
    const current = getStorageItem('umkm', INITIAL_UMKM);
    const item = { ...newProduct, id: Date.now() };
    const updated = [...current, item];
    setStorageItem('umkm', updated);
    return item;
  },

  async updateUMKM(id, updatedProduct) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('umkm').update(updatedProduct).eq('id', id).select();
        if (!error && data?.length) {
          const current = getStorageItem('umkm', []);
          const updated = current.map(u => u.id === id ? data[0] : u);
          setStorageItem('umkm', updated);
          return data[0];
        }
        console.error('Supabase updateUMKM error:', error);
      } catch (e) {
        console.error('Supabase updateUMKM exception:', e);
      }
    }
    const current = getStorageItem('umkm', INITIAL_UMKM);
    const updated = current.map(u => u.id === id ? { ...u, ...updatedProduct } : u);
    setStorageItem('umkm', updated);
    return true;
  },

  async deleteUMKM(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('umkm').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteUMKM error:', e);
      }
    }
    const current = getStorageItem('umkm', INITIAL_UMKM);
    const updated = current.filter(u => u.id !== id);
    setStorageItem('umkm', updated);
    return true;
  },

  // --- WISATA ---
  async getWisata() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('wisata').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          setStorageItem('wisata', data);
          return data;
        }
        console.error('Supabase getWisata error:', error);
      } catch (e) {
        console.error('Supabase getWisata exception:', e);
      }
    }
    return getStorageItem('wisata', INITIAL_WISATA);
  },

  async addWisata(newSpot) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('wisata').insert([newSpot]).select();
        if (!error && data?.length) {
          const current = getStorageItem('wisata', []);
          const updated = [data[0], ...current.filter(w => w.id !== data[0].id)];
          setStorageItem('wisata', updated);
          return data[0];
        }
        console.error('Supabase addWisata error:', error);
      } catch (e) {
        console.error('Supabase addWisata exception:', e);
      }
    }
    const current = getStorageItem('wisata', INITIAL_WISATA);
    const item = { ...newSpot, id: Date.now() };
    const updated = [...current, item];
    setStorageItem('wisata', updated);
    return item;
  },

  async updateWisata(id, updatedSpot) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('wisata').update(updatedSpot).eq('id', id).select();
        if (!error && data?.length) {
          const current = getStorageItem('wisata', []);
          const updated = current.map(w => w.id === id ? data[0] : w);
          setStorageItem('wisata', updated);
          return data[0];
        }
        console.error('Supabase updateWisata error:', error);
      } catch (e) {
        console.error('Supabase updateWisata exception:', e);
      }
    }
    const current = getStorageItem('wisata', INITIAL_WISATA);
    const updated = current.map(w => w.id === id ? { ...w, ...updatedSpot } : w);
    setStorageItem('wisata', updated);
    return true;
  },

  async deleteWisata(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('wisata').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteWisata error:', e);
      }
    }
    const current = getStorageItem('wisata', INITIAL_WISATA);
    const updated = current.filter(w => w.id !== id);
    setStorageItem('wisata', updated);
    return true;
  },

  // --- CMS HERO SECTION (Synchronous Cache + Supabase Sync) ---
  getHeroCached() {
    const stored = getStorageItem('hero', INITIAL_HERO);
    return { ...INITIAL_HERO, ...(stored || {}) };
  },

  async getHero() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('hero_section').select('*').eq('id', 1).maybeSingle();
        if (!error && data) {
          const result = {
            ...INITIAL_HERO,
            badge: data.badge ?? INITIAL_HERO.badge,
            judul: data.judul ?? INITIAL_HERO.judul,
            deskripsi: data.deskripsi ?? INITIAL_HERO.deskripsi,
            bgImage: data.bg_image ?? INITIAL_HERO.bgImage,
            kadesNama: data.kades_nama ?? INITIAL_HERO.kadesNama,
            kadesJabatan: data.kades_jabatan ?? INITIAL_HERO.kadesJabatan,
            kadesPeriode: data.kades_periode ?? INITIAL_HERO.kadesPeriode,
            kadesFoto: data.kades_foto ?? INITIAL_HERO.kadesFoto,
            kadesSambutan: data.kades_sambutan ?? INITIAL_HERO.kadesSambutan,
            statPenduduk: data.stat_penduduk ?? INITIAL_HERO.statPenduduk,
            statRtRw: data.stat_rt_rw ?? INITIAL_HERO.statRtRw,
            statUmkm: data.stat_umkm ?? INITIAL_HERO.statUmkm,
            ctaPrimary: data.cta_primary ?? INITIAL_HERO.ctaPrimary,
            ctaPrimaryLink: data.cta_primary_link ?? INITIAL_HERO.ctaPrimaryLink,
            ctaSecondary: data.cta_secondary ?? INITIAL_HERO.ctaSecondary,
            ctaSecondaryLink: data.cta_secondary_link ?? INITIAL_HERO.ctaSecondaryLink,
          };
          // Simpan ke local cache agar load berikutnya instan tanpa flicker
          setStorageItem('hero', result);
          return result;
        }
      } catch (e) {
        console.error("Supabase getHero error:", e);
      }
    }
    const stored = getStorageItem('hero', INITIAL_HERO);
    return { ...INITIAL_HERO, ...(stored || {}) };
  },

  async updateHero(heroData) {
    if (isSupabaseConfigured) {
      try {
        const payload = {
          badge: heroData.badge,
          judul: heroData.judul,
          deskripsi: heroData.deskripsi,
          bg_image: heroData.bgImage,
          kades_nama: heroData.kadesNama,
          kades_jabatan: heroData.kadesJabatan,
          kades_periode: heroData.kadesPeriode,
          kades_foto: heroData.kadesFoto,
          kades_sambutan: heroData.kadesSambutan,
          cta_primary: heroData.ctaPrimary,
          cta_primary_link: heroData.ctaPrimaryLink,
          cta_secondary: heroData.ctaSecondary,
          cta_secondary_link: heroData.ctaSecondaryLink,
          updated_at: new Date().toISOString()
        };
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        await supabase.from('hero_section').update(payload).eq('id', 1);
      } catch (e) {
        console.error("Supabase updateHero error:", e);
      }
    }
    const current = getStorageItem('hero', INITIAL_HERO);
    const merged = { ...current, ...(heroData || {}) };
    setStorageItem('hero', merged);
    return merged;
  },

  // --- STATISTIK BERANDA (CRUD + SUPABASE PERSISTENCE) ---
  async getStatistik() {
    let stats = null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('hero_section').select('*').eq('id', 1).maybeSingle();
        if (!error && data) {
          if (Array.isArray(data.statistik_cards) && data.statistik_cards.length > 0) {
            stats = data.statistik_cards;
          } else if (typeof data.stat_penduduk === 'string' && data.stat_penduduk.trim().startsWith('[')) {
            try {
              const parsed = JSON.parse(data.stat_penduduk);
              if (Array.isArray(parsed) && parsed.length > 0) {
                stats = parsed;
              }
            } catch (e) {}
          }

          if (!stats && (data.stat_penduduk || data.stat_rt_rw)) {
            stats = [
              {
                id: 1,
                angka: data.stat_penduduk ? data.stat_penduduk.replace(/\s*jiwa\s*$/i, '') : '3.090',
                label: 'Jiwa Penduduk',
                icon: 'Users',
                colorBg: '#e8f5e9',
                colorText: '#2e7d32'
              },
              {
                id: 2,
                angka: data.stat_rt_rw || '12 RT / 4 RW',
                label: 'Wilayah Dusun Tajemsari',
                icon: 'Building',
                colorBg: '#e8f5e9',
                colorText: '#2e7d32'
              },
              {
                id: 3,
                angka: data.stat_umkm || 'Produk Unggulan',
                label: 'Produk Unggulan Desa',
                icon: 'Sparkles',
                colorBg: '#e8f5e9',
                colorText: '#2e7d32'
              }
            ];
          }
        }
      } catch (e) {
        console.error("Supabase getStatistik error:", e);
      }
    }

    if (!stats) {
      const stored = getStorageItem('statistik', INITIAL_STATISTIK);
      stats = (Array.isArray(stored) && stored.length > 0) ? stored : INITIAL_STATISTIK;
    }

    setStorageItem('statistik', stats);

    const umkms = await this.getUMKM();
    const totalProducts = Array.isArray(umkms)
      ? umkms.reduce((total, item) => {
          if (Array.isArray(item.produk_list) && item.produk_list.length > 0) {
            return total + item.produk_list.length;
          }
          if (Array.isArray(item.galeri) && item.galeri.length > 0) {
            return total + item.galeri.length;
          }
          return total + 1;
        }, 0)
      : 0;

    return stats.map(s => {
      const isUmkm = s.icon === 'Sparkles' || 
        (s.label && s.label.toLowerCase().includes('umkm')) || 
        (s.label && s.label.toLowerCase().includes('produk')) ||
        (s.angka && typeof s.angka === 'string' && s.angka.toLowerCase().includes('umkm'));
      if (isUmkm) {
        return { ...s, angka: `${totalProducts} UMKM` };
      }
      return s;
    });
  },

  async saveStatistikList(newList) {
    setStorageItem('statistik', newList);
    if (isSupabaseConfigured && supabase) {
      try {
        const jsonStr = JSON.stringify(newList);
        const card2 = newList[1]?.angka || '12 RT / 4 RW';
        const card3 = newList[2]?.angka || '12 UMKM';

        await supabase.from('hero_section').update({
          stat_penduduk: jsonStr,
          stat_rt_rw: card2,
          stat_umkm: card3,
          updated_at: new Date().toISOString()
        }).eq('id', 1);
      } catch (e) {
        console.error("Supabase saveStatistikList error:", e);
      }
    }
    return newList;
  },

  async addStatistik(statItem) {
    const rawStored = getStorageItem('statistik', INITIAL_STATISTIK);
    const current = (Array.isArray(rawStored) && rawStored.length > 0) ? rawStored : INITIAL_STATISTIK;
    const item = { ...statItem, id: Date.now() };
    const updated = [...current, item];
    await this.saveStatistikList(updated);
    return item;
  },

  async updateStatistik(id, updatedStat) {
    const rawStored = getStorageItem('statistik', INITIAL_STATISTIK);
    const current = (Array.isArray(rawStored) && rawStored.length > 0) ? rawStored : INITIAL_STATISTIK;
    const updated = current.map(s => s.id === id ? { ...s, ...updatedStat } : s);
    await this.saveStatistikList(updated);
    return true;
  },

  async deleteStatistik(id) {
    const rawStored = getStorageItem('statistik', INITIAL_STATISTIK);
    const current = (Array.isArray(rawStored) && rawStored.length > 0) ? rawStored : INITIAL_STATISTIK;
    const updated = current.filter(s => s.id !== id);
    await this.saveStatistikList(updated);
    return true;
  },

  // --- CMS PROFIL DESA (Synchronous Cache + Supabase Sync) ---
  getProfilCached() {
    const stored = getStorageItem('profil', INITIAL_PROFIL);
    return { ...INITIAL_PROFIL, ...(stored || {}) };
  },

  async getProfil() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('profil_desa').select('*').eq('id', 1).maybeSingle();
        if (!error && data) {
          let perangkatClean = [];
          let lembagaClean = [];

          if (Array.isArray(data.perangkat_list)) {
            perangkatClean = data.perangkat_list.filter(p => p.tipe !== 'lembaga');
            const embeddedLembaga = data.perangkat_list.filter(p => p.tipe === 'lembaga');
            if (embeddedLembaga.length > 0) {
              lembagaClean = embeddedLembaga;
            }
          }

          if (Array.isArray(data.lembaga_list) && data.lembaga_list.length > 0) {
            lembagaClean = data.lembaga_list;
          }

          if (lembagaClean.length === 0) {
            const localStored = getStorageItem('profil', INITIAL_PROFIL);
            lembagaClean = (Array.isArray(localStored.lembagaList) && localStored.lembagaList.length > 0) ? localStored.lembagaList : INITIAL_LEMBAGA;
          }

          const result = {
            ...INITIAL_PROFIL,
            sejarahJudul: data.sejarah_judul ?? INITIAL_PROFIL.sejarahJudul,
            sejarahParagraf1: data.sejarah_paragraf1 ?? INITIAL_PROFIL.sejarahParagraf1,
            sejarahParagraf2: data.sejarah_paragraf2 ?? INITIAL_PROFIL.sejarahParagraf2,
            visiJudul: data.visi_judul ?? INITIAL_PROFIL.visiJudul,
            visiDeskripsi: data.visi_deskripsi ?? INITIAL_PROFIL.visiDeskripsi,
            misiList: data.misi_list ?? INITIAL_PROFIL.misiList,
            perangkatList: perangkatClean.length > 0 ? perangkatClean : (data.perangkat_list ?? INITIAL_PROFIL.perangkatList),
            lembagaList: lembagaClean.length > 0 ? lembagaClean : INITIAL_LEMBAGA,
          };
          setStorageItem('profil', result);
          return result;
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
        const perangkatList = Array.isArray(profilData.perangkatList) 
          ? profilData.perangkatList.map(p => ({ ...p, tipe: 'pemerintah' })) 
          : [];
        const lembagaList = Array.isArray(profilData.lembagaList) 
          ? profilData.lembagaList.map(l => ({ ...l, tipe: 'lembaga' })) 
          : [];
        
        const mergedPerangkatAndLembaga = [...perangkatList, ...lembagaList];

        await supabase.from('profil_desa').upsert([{
          id: 1,
          sejarah_judul: profilData.sejarahJudul,
          sejarah_paragraf1: profilData.sejarahParagraf1,
          sejarah_paragraf2: profilData.sejarahParagraf2,
          visi_judul: profilData.visiJudul,
          visi_deskripsi: profilData.visiDeskripsi,
          misi_list: profilData.misiList,
          perangkat_list: mergedPerangkatAndLembaga,
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
