import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function InitialLoader() {
  const [loading, setLoading] = useState(true);
  const [fadeState, setFadeState] = useState('entering'); // 'entering' | 'fading' | 'gone'
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Simulasi progress bar halus
    const p1 = setTimeout(() => setProgress(45), 200);
    const p2 = setTimeout(() => setProgress(80), 550);
    const p3 = setTimeout(() => setProgress(100), 850);

    // Mulai animasi fade-out
    const fadeTimer = setTimeout(() => {
      setFadeState('fading');
    }, 1100);

    // Hilangkan sepenuhnya dari DOM
    const removeTimer = setTimeout(() => {
      setLoading(false);
      setFadeState('gone');
    }, 1600);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!loading || fadeState === 'gone') return null;

  return (
    <div className={`initial-loader-overlay ${fadeState === 'fading' ? 'fade-out' : ''}`}>
      <style>{`
        .initial-loader-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: radial-gradient(circle at center, #1b5e20 0%, #0f2a12 70%, #08160a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.5s ease;
          opacity: 1;
          visibility: visible;
          overflow: hidden;
        }

        .initial-loader-overlay.fade-out {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        /* Glowing background ambient lights */
        .loader-ambient-glow {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(46, 125, 50, 0.1) 60%, transparent 70%);
          filter: blur(40px);
          animation: pulseGlow 2.5s infinite ease-in-out;
        }

        @keyframes pulseGlow {
          0%, 100% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 0.9; }
        }

        /* Center Ring & Emblem */
        .loader-emblem-wrap {
          position: relative;
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .loader-spinning-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #d4af37;
          border-right-color: #4caf50;
          animation: spinRing 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .loader-spinning-ring-inner {
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          border: 2px dashed rgba(212, 175, 55, 0.4);
          animation: spinRingReverse 2s linear infinite;
        }

        .loader-emblem-center {
          width: 64px;
          height: 64px;
          background: rgba(255, 255, 255, 0.12);
          border: 1.5px solid rgba(212, 175, 55, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 24px rgba(212, 175, 55, 0.35);
          animation: badgeFloat 2s ease-in-out infinite;
          padding: 6px;
        }

        .loader-logo-img {
          width: 40px;
          height: 48px;
          object-fit: contain;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
        }

        @keyframes spinRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spinRingReverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes badgeFloat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }

        .loader-title {
          font-family: var(--font-heading, 'Inter', sans-serif);
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #ffffff;
          margin-bottom: 0.35rem;
          text-align: center;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .loader-subtitle {
          font-size: 0.88rem;
          color: rgba(232, 245, 233, 0.85);
          font-weight: 500;
          letter-spacing: 1px;
          margin-bottom: 1.75rem;
          text-align: center;
        }

        /* Progress Bar */
        .loader-progress-track {
          width: 220px;
          height: 5px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          margin-bottom: 0.85rem;
        }

        .loader-progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #d4af37, #fef9e7);
          border-radius: 10px;
          transition: width 0.3s ease-out;
          box-shadow: 0 0 10px #d4af37;
        }

        .loader-status-text {
          font-size: 0.76rem;
          color: rgba(255, 255, 255, 0.65);
          display: flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.3px;
        }
      `}</style>

      <div className="loader-ambient-glow"></div>

      <div className="loader-emblem-wrap">
        <div className="loader-spinning-ring"></div>
        <div className="loader-spinning-ring-inner"></div>
        <div className="loader-emblem-center">
          <img 
            src="/logo.png" 
            alt="Lambang Kabupaten Grobogan" 
            className="loader-logo-img" 
          />
        </div>
      </div>

      <div className="loader-title">
        Desa Tajemsari
      </div>

      <div className="loader-subtitle">
        Kec. Tegowanu • Kab. Grobogan
      </div>

      <div className="loader-progress-track">
        <div 
          className="loader-progress-bar" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="loader-status-text">
        <Sparkles size={12} color="#d4af37" /> Memuat Portal Resmi Desa...
      </div>
    </div>
  );
}
