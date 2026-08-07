import React, { useState } from 'react';
import { FileText, Send, Search, CheckCircle, Clock, AlertCircle, ShieldCheck, Download, ArrowRight, Check, FileCheck, MapPin } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function Services() {
  // Form State
  const [namaWarga, setNamaWarga] = useState('');
  const [nik, setNik] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamatLengkap, setAlamatLengkap] = useState('');
  const [jenisSurat, setJenisSurat] = useState('Surat Keterangan Usaha (SKU)');
  const [keperluan, setKeperluan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  // Tracking State
  const [searchTicket, setSearchTicket] = useState('');
  const [trackedItem, setTrackedItem] = useState(null);
  const [trackingSearched, setTrackingSearched] = useState(false);

  const catalogSurat = [
    { title: "Surat Keterangan Usaha (SKU)", desc: "Untuk kelengkapan pengajuan pinjaman modal usaha/KUR dan legalitas UMKM.", syarat: "KTP, KK, & Keterangan jenis usaha" },
    { title: "Surat Keterangan Tidak Mampu (SKTM)", desc: "Diperlukan untuk beasiswa sekolah/kuliah serta KIS/BPJS Kesehatan.", syarat: "KTP, KK, & Surat rekomendasi RT/RW" },
    { title: "Surat Keterangan Domisili", desc: "Surat bukti tempat tinggal sementara atau tetap bagi warga Tajemsari.", syarat: "KTP, KK, & Alamat domisili lengkap" },
    { title: "Pengantar KTP & Kartu Keluarga (KK)", desc: "Pengantar penerbitan baru atau perbaikan data ke Kantor Camat Tegowanu.", syarat: "KK Lama / Akta Kelahiran" },
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await apiService.createPermohonan({
        nama_warga: namaWarga,
        nik,
        no_hp: noHp,
        alamat_lengkap: alamatLengkap,
        jenis_surat: jenisSurat,
        keperluan,
      });

      setSuccessResult(result);
      setNamaWarga('');
      setNik('');
      setNoHp('');
      setAlamatLengkap('');
      setKeperluan('');
    } catch (err) {
      alert("Gagal mengirimkan pengajuan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrackTicket = async (e) => {
    e.preventDefault();
    setTrackingSearched(true);
    const list = await apiService.getPermohonan();
    const found = list.find(p => p.nomor_tiket?.toLowerCase() === searchTicket.trim().toLowerCase());
    setTrackedItem(found || null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Siap Diunduh': return { bg: '#dcfce7', color: '#15803d', label: '🟢 Siap Diunduh (Digital)' };
      case 'Siap Diambil di Balai Desa': return { bg: '#fef3c7', color: '#b45309', label: '📜 Siap Diambil di Balai Desa' };
      case 'Sedang Diproses': return { bg: '#dbeafe', color: '#1d4ed8', label: '🔵 Sedang Diproses' };
      case 'Menunggu Tanda Tangan': return { bg: '#f3e8ff', color: '#7e22ce', label: '🟣 Menunggu Tanda Tangan' };
      case 'Ditolak': return { bg: '#fee2e2', color: '#b91c1c', label: '🔴 Ditolak' };
      default: return { bg: '#fef9c3', color: '#a16207', label: '🟡 Menunggu Verifikasi' };
    }
  };

  return (
    <div className="services-page animate-fade-in section-padding">
      <style>{`
        .workflow-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .step-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.75rem 1.25rem;
          text-align: center;
          border: 1px solid var(--color-border);
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .step-number {
          width: 38px;
          height: 38px;
          background: var(--color-gold);
          color: #ffffff;
          font-weight: 800;
          font-family: var(--font-heading);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem auto;
          box-shadow: 0 4px 10px rgba(212, 175, 55, 0.3);
        }

        .catalog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .catalog-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.75rem;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-fast);
        }

        .catalog-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-3px);
        }

        .form-section-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 2.5rem;
          border: 2px solid rgba(46, 125, 50, 0.2);
          box-shadow: var(--shadow-md);
        }

        .form-input-custom {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.95rem;
          margin-top: 0.35rem;
          font-family: var(--font-body);
        }

        .form-input-custom:focus {
          border-color: var(--color-primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.15);
        }
      `}</style>

      <div className="container">
        {/* Page Header */}
        <div className="section-header">
          <h1 className="section-title">Katalog & Pengajuan Surat Online</h1>
          <p className="section-description">
            Ajukan permohonan surat keterangan kependudukan dari rumah tanpa perlu mengantre lama di Balai Desa Tajemsari Tegowanu.
          </p>
        </div>

        {/* Alur Prosedur Layanan (Workflow) */}
        <div style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem', textAlign: 'center' }}>
            Alur Prosedur Pengajuan Surat Kependudukan
          </h3>

          <div className="workflow-steps">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: 6 }}>Isi Form Online</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Lengkapi data NIK, Nama, Alamat, dan jenis surat yang Anda butuhkan.</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: 6 }}>Dapatkan Tiket</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Simpan Kode Tiket unik untuk melacak status pengerjaan.</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: 6 }}>Verifikasi Admin</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Perangkat Desa memeriksa berkas & memproses dokumen surat.</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--color-primary-dark)', marginBottom: 6 }}>Unduh / Ambil Surat</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Unduh PDF surat langsung atau ambil fisik surat di Balai Desa Tajemsari.</p>
            </div>
          </div>
        </div>

        {/* Katalog Surat Layanan */}
        <div style={{ marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '1.5rem' }}>
            Katalog Dokumen Administrasi
          </h3>
          <div className="catalog-grid">
            {catalogSurat.map((surat, idx) => (
              <div key={idx} className="catalog-card">
                <span className="badge-green" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>Layanan Terpadu</span>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>{surat.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>{surat.desc}</p>
                <div style={{ background: '#f8faf8', padding: '0.65rem', borderRadius: 8, fontSize: '0.8rem', border: '1px border var(--color-border)' }}>
                  <strong>Syarat Berkas:</strong> {surat.syarat}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout: Form Pengajuan & Tracking Tiket */}
        <div className="grid-2">
          {/* Form Pengajuan Surat */}
          <div className="form-section-card">
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Formulir Permohonan Surat Online
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Isi data diri Anda sesuai KTP untuk mengajukan surat keterangan resmi.
            </p>

            {successResult ? (
              <div style={{ background: '#f0fdf4', border: '2px solid var(--color-primary)', padding: '1.5rem', borderRadius: 16, textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, background: 'var(--color-primary)', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <CheckCircle size={32} />
                </div>
                <h4 style={{ color: 'var(--color-primary-dark)', fontSize: '1.25rem', marginBottom: 4 }}>Pengajuan Berhasil Dikirim!</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  Nomor Tiket Lacak Anda:
                </p>
                <div style={{ background: '#ffffff', border: '2px dashed var(--color-gold)', padding: '0.75rem 1.25rem', borderRadius: 10, fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-dark)', display: 'inline-block', marginBottom: '1.25rem' }}>
                  {successResult.nomor_tiket}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
                  Harap catat atau simpan nomor tiket di atas untuk mengecek status pemrosesan surat.
                </p>
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSuccessResult(null)}>
                  Buat Pengajuan Baru
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    Nama Lengkap (Sesuai KTP) *
                  </label>
                  <input 
                    type="text" 
                    className="form-input-custom" 
                    value={namaWarga} 
                    onChange={(e) => setNamaWarga(e.target.value)} 
                    placeholder="Contoh: Budi Santoso" 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      NIK (16 Digit) *
                    </label>
                    <input 
                      type="text" 
                      className="form-input-custom" 
                      value={nik} 
                      onChange={(e) => setNik(e.target.value)} 
                      placeholder="331508xxxxxx" 
                      required 
                      maxLength={16} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      No. WhatsApp / HP *
                    </label>
                    <input 
                      type="tel" 
                      className="form-input-custom" 
                      value={noHp} 
                      onChange={(e) => setNoHp(e.target.value)} 
                      placeholder="08123456789" 
                      required 
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    Alamat Lengkap *
                  </label>
                  <textarea 
                    className="form-input-custom" 
                    rows={2} 
                    value={alamatLengkap} 
                    onChange={(e) => setAlamatLengkap(e.target.value)} 
                    placeholder="Contoh: Dusun Krajan, RT 01/RW 02, Desa Tajemsari, Kecamatan Tegowanu" 
                    required 
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    Jenis Surat *
                  </label>
                  <select 
                    className="form-input-custom" 
                    value={jenisSurat} 
                    onChange={(e) => setJenisSurat(e.target.value)}
                  >
                    <option value="Surat Keterangan Usaha (SKU)">Surat Keterangan Usaha (SKU)</option>
                    <option value="Surat Keterangan Tidak Mampu (SKTM)">Surat Keterangan Tidak Mampu (SKTM)</option>
                    <option value="Surat Keterangan Domisili">Surat Keterangan Domisili</option>
                    <option value="Pengantar KTP & KK">Pengantar KTP & KK</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    Keperluan Pengajuan *
                  </label>
                  <textarea 
                    className="form-input-custom" 
                    rows={3} 
                    value={keperluan} 
                    onChange={(e) => setKeperluan(e.target.value)} 
                    placeholder="Tuliskan alasan/keperluan pembuatan surat..." 
                    required 
                  />
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%' }} disabled={submitting}>
                  {submitting ? 'Mengirim Data...' : <><Send size={18} /> Kirim Pengajuan Surat</>}
                </button>
              </form>
            )}
          </div>

          {/* Tracking Status Surat */}
          <div className="card-rural" style={{ height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              Lacak Status Permohonan Surat
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Masukkan Kode Tiket Anda (Contoh: <code>TJM-202607-001</code>) untuk mengecek status pengerjaan.
            </p>

            <form onSubmit={handleTrackTicket} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                className="form-input-custom" 
                style={{ marginTop: 0 }}
                placeholder="Masukkan Nomor Tiket..."
                value={searchTicket}
                onChange={(e) => setSearchTicket(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
                <Search size={18} />
              </button>
            </form>

            {trackingSearched && (
              trackedItem ? (
                <div style={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: 16, padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>#{trackedItem.nomor_tiket}</span>
                    {(() => {
                      const badgeInfo = getStatusBadgeClass(trackedItem.status);
                      return (
                        <span style={{ background: badgeInfo.bg, color: badgeInfo.color, padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
                          {badgeInfo.label}
                        </span>
                      );
                    })()}
                  </div>

                  <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>{trackedItem.jenis_surat}</h4>
                  
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                    Pemohon: <strong>{trackedItem.nama_warga}</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                    Alamat: <strong>{trackedItem.alamat_lengkap || trackedItem.rt_rw}</strong>
                  </div>

                  {trackedItem.catatan_admin && (
                    <div style={{ marginTop: '0.85rem', background: '#f8faf8', borderLeft: '4px solid var(--color-gold)', padding: '0.75rem 1rem', borderRadius: '0 10px 10px 0', fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
                      <strong>Catatan Petugas:</strong> {trackedItem.catatan_admin}
                    </div>
                  )}

                  {/* DIGITAL DOWNLOAD BOX IF STATUS IS "Siap Diunduh" */}
                  {trackedItem.status === 'Siap Diunduh' && trackedItem.file_surat_url ? (
                    <div style={{ marginTop: '1.25rem', background: '#f0fdf4', border: '2px solid #10b981', borderRadius: 14, padding: '1.25rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#065f46', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <CheckCircle size={20} color="#10b981" /> Surat Resmi PDF Siap Diunduh!
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#047857', marginBottom: '1rem' }}>
                        Dokumen surat Anda telah selesai ditandatangani dan siap diunduh secara digital.
                      </p>
                      <a 
                        href={trackedItem.file_surat_url} 
                        download={trackedItem.file_surat_name || `Surat_${trackedItem.nomor_tiket}.pdf`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1.25rem', textDecoration: 'none', background: '#10b981', borderColor: '#10b981' }}
                      >
                        <Download size={18} /> Unduh File Surat PDF ({trackedItem.file_surat_name || 'Dokumen_Surat.pdf'})
                      </a>
                    </div>
                  ) : trackedItem.status === 'Siap Diambil di Balai Desa' ? (
                    <div style={{ marginTop: '1.25rem', background: '#fffdf5', border: '2px solid var(--color-gold)', borderRadius: 14, padding: '1.25rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#8a6d13', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <MapPin size={20} color="var(--color-gold)" /> Surat Fisik Siap Diambil
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#78350f' }}>
                        Dokumen fisik surat keterangan Anda telah dicap stempel desa & ditandatangani basah oleh Kades. Silakan ambil di Kantor Balai Desa Tajemsari pada jam kerja.
                      </p>
                    </div>
                  ) : trackedItem.status === 'Ditolak' ? (
                    <div style={{ marginTop: '1.25rem', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '1rem', color: '#991b1b', fontSize: '0.85rem' }}>
                      Mohon maaf, pengajuan surat Anda ditolak. Silakan baca catatan petugas di atas.
                    </div>
                  ) : (
                    <div style={{ marginTop: '1.25rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '1rem', color: '#1e40af', fontSize: '0.85rem', textAlign: 'center' }}>
                      <Clock size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Surat Anda sedang diproses oleh petugas Balai Desa Tajemsari. Silakan cek kembali secara berkala.
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ background: '#fef2f2', color: '#991b1b', padding: '1rem', borderRadius: 10, fontSize: '0.88rem' }}>
                  Nomor Tiket <strong>"{searchTicket}"</strong> tidak ditemukan. Pastikan format tiket benar.
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
