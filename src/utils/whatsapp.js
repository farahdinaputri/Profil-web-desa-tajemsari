/**
 * Utility functions for WhatsApp links and formatting
 */

/**
 * Format nomor telepon / WhatsApp ke format internasional standar Indonesia (62xxx)
 * Menangani input: 08xxx, +62xxx, 62xxx, 8xxx, atau format dengan spasi & tanda hubung.
 */
export function formatWaNumber(phone) {
  if (!phone) return '6281234567890';
  
  // Hapus semua karakter selain angka
  let cleaned = String(phone).replace(/\D/g, '');
  
  // Jika diawali dengan '0', ganti dengan '62' (misal: 08123 -> 628123)
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  } 
  // Jika diawali langsung dengan '8', tambahkan '62' di depan (misal: 8123 -> 628123)
  else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  
  return cleaned || '6281234567890';
}

/**
 * Buat link WhatsApp langsung dengan pesan otomatis pemesanan produk UMKM
 */
export function getUmkmWaLink(item) {
  if (!item) return '#';
  
  const phone = formatWaNumber(item.wa_seller || item.no_hp || '6281234567890');
  const sellerName = item.pembuat ? item.pembuat.trim() : 'Penjual';
  const productName = item.nama_produk ? item.nama_produk.trim() : 'Produk UMKM';
  const price = item.harga ? ` (Harga: ${item.harga.trim()})` : '';

  const message = `Halo Kak ${sellerName},\n\nSaya melihat produk *"${productName}"*${price} di Website Resmi Desa Tajemsari dan berminat untuk memesan.\n\nApakah produk ini masih tersedia?\nTerima kasih.`;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}
