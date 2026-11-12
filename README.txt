MELLOW ADMIN 1.3.2
Template Dashboard Admin React, Clay & Glass Edition

Baca berkas ini lebih dulu. Panduan lengkap ada di PANDUAN.html, pengenalan
fitur dan galeri di README.md, dan riwayat perubahan di CHANGELOG.md.

MULAI
1. Ekstrak seluruh ZIP ke satu folder.
2. Buka index.html di peramban. Folder assets/ harus tetap di sebelahnya.
3. Atau buka Mellow-Admin-Standalone.html, seluruh aplikasi dalam satu berkas.
Tidak perlu npm, server, CDN, atau koneksi internet untuk mencobanya.

Penyimpanan localStorage pada file:// berbeda-beda antar peramban. Agar data
demo tersimpan konsisten, jalankan server lokal dari folder ini:
  python3 -m http.server 8080
lalu buka http://localhost:8080.

ISI PAKET
index.html                     Halaman utama, siap dibuka
Mellow-Admin-Standalone.html   Versi satu berkas: CSS, JS, dan font tertanam
assets/                        CSS dan JavaScript hasil build, favicon, dan
                               lisensi bundle
dist/                          index.html dan assets/ siap unggah ke hosting
src/App.jsx                    Shell, navigasi, state bersama, halaman Deals
src/pages.jsx                  Halaman lain dan layar mandiri (login, error)
src/forms.jsx                  Tujuh halaman kelompok Forms
src/components.jsx             Komponen UI: ikon, tombol, menu, modal, grafik
src/data.js                    Data contoh dan format angka
src/styles.css                 Token desain, tema, animasi, dan gaya cetak
src/photos/                    Foto kontak contoh (fiktif, dibuat dengan AI) dan
                               foto profil pengguna demo
build.mjs                      Skrip build esbuild
package.json                   Dependensi dan perintah build
package-lock.json              Versi dependensi terkunci untuk npm ci
PANDUAN.html                   Panduan lengkap berbahasa Indonesia
README.md                      Pengenalan, fitur, galeri, dan kustomisasi
README.txt                     Berkas ini
CHANGELOG.md                   Riwayat perubahan per versi
QA.txt                         Hasil dan batas pemeriksaan rilis ini
docs/screenshots/              Gambar galeri untuk README.md
LICENSE.txt                    Lisensi MIT kode template
THIRD-PARTY-NOTICES.txt        Lisensi React, React DOM, Scheduler, Nunito Sans

PENGEMBANGAN
Ubah berkas di src/, lalu build ulang dengan Node.js 20 atau lebih baru:
  npm ci
  npm run build
Build menulis ulang berkas app.* di assets/, folder dist/, dan
Mellow-Admin-Standalone.html, jadi jangan mengedit ketiganya langsung.
Muat ulang peramban setelah build selesai.

BATAS CAKUPAN
- Template frontend dengan data demo, bukan CRM jadi. Belum ada login server,
  hak akses, database, pengiriman email, atau payment gateway.
- Layar login, daftar, dan billing hanya tampilan. Tidak ada data yang
  diperiksa, dikirim, atau disimpan.
- Data tersimpan di localStorage peramban. Jangan memasukkan data sensitif
  sebelum backend dan kontrol akses siap.
- Diuji di Chrome, termasuk lebar ponsel 390 px. Safari, Firefox, dan
  perangkat fisik belum diuji secara khusus.
Cara menyambungkan ke Laravel atau backend lain ada di PANDUAN.html bagian 05.

LISENSI
Kode template (c) 2026 Syams Ideris, dirilis dengan lisensi MIT (LICENSE.txt).
Desain dibuat dari referensi visual yang diberikan dan tidak memuat kode
sumber, logo, foto, atau watermark milik produk pada gambar referensi.
