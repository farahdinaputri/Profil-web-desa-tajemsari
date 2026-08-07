import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 1. Otomatis menggulir layar ke paling atas (top: 0) setiap kali rute/halaman berubah.
 * 2. Otomatis menggulir ke atas saat halaman di-refresh.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Matikan scroll restoration bawaan browser agar saat refresh selalu mulai dari atas
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Gulir ke paling atas saat pindah halaman atau saat refresh
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
