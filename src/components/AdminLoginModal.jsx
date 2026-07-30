import React, { useState } from 'react';
import { X, Lock, Mail, Key, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('admin@tajemsari.desa.id');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured && supabase) {
        // Try real Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Fallback to local admin check if auth fails or demo account used
          if (email === 'admin@tajemsari.desa.id' && password === 'admin123') {
            onLoginSuccess({ email, role: 'admin' });
            onClose();
          } else {
            setErrorMsg(error.message || 'Email atau password salah.');
          }
        } else {
          onLoginSuccess(data.user);
          onClose();
        }
      } else {
        // Demo Mode validation
        if (email === 'admin@tajemsari.desa.id' && password === 'admin123') {
          onLoginSuccess({ email, role: 'admin' });
          onClose();
        } else {
          setErrorMsg('Kredensial demo: Gunakan admin@tajemsari.desa.id / admin123');
        }
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat verifikasi login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-content {
          background: #ffffff;
          width: 100%;
          max-width: 440px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.4);
          animation: modalPop 0.3s ease-out;
        }

        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header-banner {
          background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
          color: #ffffff;
          padding: 1.75rem;
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
        }

        .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        .modal-body {
          padding: 2rem;
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
          left: 12px;
          color: var(--color-text-muted);
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 0.75rem 0.75rem 2.6rem;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }

        .form-input:focus {
          border-color: var(--color-primary);
          outline: none;
          box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.15);
        }

        .demo-badge-info {
          background: #fef9e7;
          border: 1px solid rgba(212, 175, 55, 0.4);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.25rem;
          font-size: 0.82rem;
          color: #8a6d13;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      `}</style>

      <div className="modal-content">
        <div className="modal-header-banner">
          <button className="modal-close-btn" onClick={onClose} id="modal-close-btn">
            <X size={18} />
          </button>
          <div style={{ width: 48, height: 48, background: '#d4af37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', color: '#ffffff' }}>
            <Lock size={24} />
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '1.4rem' }}>Portal Admin Tajemsari</h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: 4 }}>
            Login Khusus Pengurus Desa Tajemsari Tegowanu
          </p>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fca5a5', padding: '0.75rem', borderRadius: 8, fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              {errorMsg}
            </div>
          )}

          <div className="demo-badge-info">
            <Sparkles size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Mode Uji Coba (Demo Admin):</strong><br />
              Email: <code>admin@tajemsari.desa.id</code><br />
              Password: <code>admin123</code>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Admin / NIP</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  id="admin-email-input"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tajemsari.desa.id"
                  required
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="admin-submit-login-btn"
              className="btn btn-gold"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <ShieldCheck size={18} /> Masuk ke Panel Admin
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
