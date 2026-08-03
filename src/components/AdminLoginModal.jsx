import React, { useState } from 'react';
import { X, Lock, User, Key, ShieldCheck, AlertCircle } from 'lucide-react';
import { apiService } from '../lib/supabaseClient';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await apiService.verifyAdminLogin(identifier, password);
      if (res.success) {
        onLoginSuccess(res.user);
        onClose();
        setIdentifier('');
        setPassword('');
      } else {
        setErrorMsg(res.message || 'Kredensial login tidak ditemukan atau salah.');
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat memverifikasi kredensial login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-content {
          background: #ffffff;
          width: 100%;
          max-width: 420px;
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.5);
          animation: modalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .modal-header-banner {
          background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
          color: #ffffff;
          padding: 1.75rem 1.5rem 1.5rem 1.5rem;
          text-align: center;
          position: relative;
        }

        .modal-close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #ffffff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        .modal-header-icon-wrap {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, #d4af37 0%, #aa820a 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem auto;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .modal-body {
          padding: 1.75rem 1.5rem 1.75rem 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          margin-bottom: 0.4rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #64748b;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 0.8rem 0.8rem 0.8rem 2.8rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          font-size: 0.95rem;
          color: #0f172a;
          background-color: #f8fafc;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          border-color: var(--color-primary);
          background-color: #ffffff;
          outline: none;
          box-shadow: 0 0 0 3.5px rgba(46, 125, 50, 0.15);
        }

        /* Responsive Mobile Adjustments */
        @media (max-width: 480px) {
          .modal-overlay {
            padding: 0.75rem;
          }
          .modal-content {
            border-radius: 16px;
          }
          .modal-header-banner {
            padding: 1.5rem 1.25rem 1.25rem 1.25rem;
          }
          .modal-body {
            padding: 1.25rem 1.25rem 1.5rem 1.25rem;
          }
          .form-input {
            padding: 0.75rem 0.75rem 0.75rem 2.6rem;
            font-size: 0.9rem;
          }
        }
      `}</style>

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-banner">
          <button className="modal-close-btn" onClick={onClose} id="modal-close-btn" aria-label="Tutup">
            <X size={18} />
          </button>
          <div className="modal-header-icon-wrap">
            <Lock size={24} />
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Portal Pengurus Desa</h3>
          <p style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: 4, marginBottom: 0 }}>
            Pemerintah Desa Tajemsari • Tegowanu Grobogan
          </p>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', padding: '0.75rem 1rem', borderRadius: 10, fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 500 }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username / Email Admin</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="admin-email-input"
                  className="form-input"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Masukkan Username atau Email"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Kata Sandi</label>
              <div className="input-wrapper">
                <Key size={18} className="input-icon" />
                <input
                  type="password"
                  id="admin-password-input"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Kata Sandi"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="admin-submit-login-btn"
              className="btn btn-gold"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', borderRadius: 12, fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <span>Memverifikasi Akses...</span>
              ) : (
                <>
                  <ShieldCheck size={19} /> Masuk Portal Admin
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
