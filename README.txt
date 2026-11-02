MELLOW ADMIN 1.1.0
Template Dashboard Admin, Clay & Glass Edition

MULAI
1. Ekstrak seluruh ZIP ke satu folder.
2. Buka index.html di Chrome, Edge, Firefox, atau Safari modern.
3. Tidak perlu npm, CDN, koneksi internet, atau server untuk mencoba hasil build.
4. Buka PANDUAN.html untuk petunjuk lengkap.
5. Alternatif satu file: buka Mellow-Admin-Standalone.html.

ISI
index.html                     Halaman utama siap buka
assets/app.js                  React dan aplikasi hasil build, semua lokal
assets/app.css                 CSS hasil build
assets/favicon.svg             Ikon aplikasi
Mellow-Admin-Standalone.html    Versi satu HTML dengan CSS dan JS tertanam
src/App.jsx                    Halaman, state, navigasi, dan interaksi
src/components.jsx             Komponen UI reusable
src/pages.jsx                  Halaman tambahan dan layar mandiri (login, error)
src/data.js                    Data contoh, tahap, dan format angka
src/styles.css                 Desain, breakpoint, tema, dan cetak
build.mjs                      Build sumber React dan versi standalone
package.json                   Dependensi terkunci versinya
package-lock.json              Lockfile untuk npm ci
PANDUAN.html                    Panduan berbahasa Indonesia
LICENSE.txt                    Lisensi kode template
THIRD-PARTY-NOTICES.txt         Lisensi dependensi
QA.txt                         Cakupan pemeriksaan
CHANGELOG.md                   Riwayat perubahan per versi

FITUR
20 halaman dalam sidebar berkelompok:
Overview: Dashboard, Reports, Activity. CRM: Contacts, Deals, Inbox,
Calendar, Tasks. Commerce: Products, Orders, Invoices. Workspace: Projects,
Files, Team. Account: Profile, Billing, Settings, Help. UI kit: Components, Pages.
7 layar mandiri tanpa sidebar: Sign in, Sign up, Forgot password, Lock screen,
Error 404, Error 500, Maintenance. URL tak dikenal menampilkan Error 404.
Layar login/daftar hanya tampilan demo, tidak memeriksa atau menyimpan kredensial.
Clay UI dengan design token: skala tipografi, spasi kelipatan 4 px, empat radius,
warna semantik, dan tiga tingkat bayangan. Kontras teks lolos WCAG AA.
Font Nunito Sans tertanam (lisensi OFL), jadi tampilan sama di semua OS.
Sidebar menempel dengan grup menu yang bisa dilipat. Layout responsif.
CRUD deal, kontak, tugas, dan agenda. Kanban drag-and-drop di desktop.
Pemindahan tahap lewat select atau modal untuk ponsel dan keyboard.
Ringkasan pipeline dihitung dari data. Grafik revenue historis adalah ilustrasi.
Filter per halaman (tekan /), ekspor CSV, tandai invoice dibayar, cetak invoice.
Menu aksi per kartu. Hapus record langsung dengan tombol Undo pada toast.
Balasan inbox disimpan lokal. Tema gelap, 3 warna aksen, mode kartu ringkas.

PENGEMBANGAN
Gunakan Node.js 20 atau lebih baru dan npm.
  npm ci
  npm run build
Buka kembali index.html setelah build selesai.
Untuk server lokal opsional:
  python3 -m http.server 8080
Buka http://localhost:8080 di peramban.

BATAS CAKUPAN
Ini template frontend dengan data demonstrasi, bukan backend CRM.
Tidak ada login server, hak akses, database, pengiriman email, atau payment gateway.
Data disimpan pada localStorage per origin/peramban. Jika storage diblokir,
perubahan hanya bertahan selama sesi. Perlakuan localStorage pada file://
bergantung pada peramban. Gunakan server lokal untuk penyimpanan yang konsisten.
Jangan memakai data sensitif sebelum melengkapi backend dan kontrol akses.
Data default memakai November 2026 dan mata uang USD mengikuti contoh visual.
Grafik historis merupakan data ilustratif dan terpisah dari total pipeline hidup.

INTEGRASI PHP / LARAVEL
Sajikan index.html dan assets/ sebagai frontend. Ganti operasi state lokal dengan
pemanggilan API server di src/App.jsx. Terapkan validasi, autentikasi, otorisasi,
CSRF untuk cookie session, dan audit di server. Kredensial database hanya di server.
Pembagian halaman menggunakan hash URL sehingga tidak perlu aturan rewrite.

Desain dibuat dari referensi visual yang diberikan. Tidak berisi kode sumber,
logo, foto, atau watermark milik produk pada gambar referensi.
