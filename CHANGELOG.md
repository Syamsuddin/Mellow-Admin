# Changelog

Semua perubahan penting pada Mellow Admin dicatat di file ini. Formatnya mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/), dan penomoran versinya mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [Unreleased]

### Diubah

- Galeri README dirombak agar lebih beragam dan promotif. Bagian atas kini memakai banner hero (`hero.jpg`): Dashboard violet diapit eCommerce rose, Analytics navy gelap, dan Inbox sage gelap di layar ponsel. Galeri dibuka dengan kisi "Satu template, delapan suasana" (`themes.jpg`), yaitu Dashboard dalam 4 aksen × mode terang dan gelap, diikuti 12 screenshot halaman berbeda (Analytics, eCommerce, Deals, Inbox, Reports, Calendar, Contacts, Icon set, Advanced inputs, Lock screen, Sign in, Error 404). Tiap aksen muncul tiga kali, terang dan gelap berselang-seling. Penutupnya lima layar ponsel, termasuk menu geser yang terbuka.
- Screenshot diambil dengan Chrome headless (1440 × 900, skala 2×, animasi dimatikan). Layar mandiri diambil pada 1152 × 720 agar kartunya lebih besar di bingkai. Nama berkas kini mengikuti pola `halaman-aksen-mode.jpg`. Lima screenshot lama yang tidak dipakai lagi dihapus.
- `README.txt` dipangkas menjadi pengantar paket ZIP: langkah mulai, daftar isi paket, cara build ulang, batas cakupan, dan lisensi, ditambah rujukan ke `PANDUAN.html`, `README.md`, dan `CHANGELOG.md`. Daftar fitur yang mengulang `README.md` dan sudah mulai berbeda isinya dihapus. Uraian integrasi backend kini merujuk ke bagian 05 `PANDUAN.html`.

## [1.3.0] - 2026-11-03

Rilis fitur: halaman Icon set di kelompok UI kit, badge versi di footer, dan pengguna demo baru, Cut Rahma, dengan foto profil. Totalnya 37 layar. Screenshot galeri di README diambil ulang, ditambah screenshot Dashboard di bagian atas.

### Ditambahkan

- Halaman **Icon set** di kelompok UI kit, setelah Pages: 67 ikon komponen `Icon` dalam enam kategori, filter kategori dan ukuran, pencarian lewat kotak filter atas, navigasi tombol panah, pratinjau lima ukuran dan empat slot warna, salin JSX atau SVG, serta unduhan sprite `mellow-icons.svg`. Sidebar kini berisi 30 halaman, total 37 layar.
- Badge versi (`vX.Y.Z`) di ujung kanan footer setiap halaman dashboard. Seperti label di sidebar, nilainya dibaca dari `package.json`.

### Diubah

- Pengguna demo kini **Cut Rahma** (inisial CR, `cut.rahma@example.com`), menggantikan Mia Taylor (MT). Deal, file, proyek, dan aktivitas milik MT pindah ke CR, termasuk filter My deals.
- Avatar pengguna di sidebar, tombol profil di topbar, halaman Profile, kartu pratinjau Settings, dan lock screen kini memakai foto profil (`src/photos/cut-rahma.webp`, 240 × 240 px) alih-alih inisial.
- Data demo yang sudah tersimpan di browser masih memakai nama lama sampai Settings → Reset demo data.

## [1.2.0] - 2026-11-03

Rilis fitur: dua varian dashboard (Analytics dan eCommerce), kelompok menu Forms dengan tujuh halaman, Dashboard dan semua halaman lain dengan tata letak penuh, layar mandiri yang lebih kaya, palet lengkap per warna aksen, dan animasi masuk. Totalnya 36 layar. Data demo yang sudah tersimpan di browser tetap terbaca tanpa perlu reset, tetapi data contoh baru untuk koleksi yang sudah tersimpan, misalnya kontak keenam, baru muncul setelah Settings → Reset demo data.

### Ditambahkan

- Kelompok menu **Forms** di sidebar dengan tujuh halaman, mengikuti pembagian bagian formulir di template admin seperti Falcon dan AdminLTE. Semua kode ada di `src/forms.jsx`:
  - Form elements: input teks, select bergrup, datalist, multi-select, textarea berpenghitung, checkbox dengan status campuran, radio dan kartu radio, switch, range, warna, tanggal dan waktu, ukuran, input group, dan status kolom.
  - Advanced inputs: tag input, multi-select dengan pencarian, slider dua pegangan, stepper, rating bintang, masker input dengan cek Luhn, rentang tanggal, chip pilihan, pemilih warna dengan cek kontras, dan kolom rahasia.
  - Form layouts: vertikal, horizontal, label mengambang, inline, dan multi-kolom bersegmen dengan bilah simpan yang menempel.
  - Validation: validasi saat keluar kolom lalu langsung saat mengetik, ringkasan galat, cek ketersediaan username, dan galat dari server.
  - Wizard: onboarding klien empat langkah yang membuat kontak, deal, dan tugas kickoff, dengan satu tombol Undo.
  - Editors: rich text, Markdown dengan pratinjau aman, komentar dengan @mention, dan batas karakter.
  - File upload: drop zone dengan validasi, pratinjau, progres simulasi, foto profil, dan lampiran. Save to Files menambahkan record ke halaman Files.
- Kelompok Forms terlipat secara bawaan untuk pengguna baru, seperti UI kit. Panel Form controls di Components punya tautan ke halaman-halaman Forms.
- `update(key, list)` kini juga menerima fungsi, misalnya `update("tasks", (xs) => [...xs, task])`, agar timer dan Undo tidak menulis salinan data yang sudah usang.
- Dashboard didesain ulang menjadi grid bento 12 kolom dengan sepuluh panel:
  - kartu statistik dengan sparkline tren 8 minggu dan chip perubahan mingguan (contoh);
  - grafik area pendapatan vs target dengan crosshair, tooltip, label ujung, dan pilihan periode 3M/6M/12M (contoh);
  - sales funnel per tahap dengan tingkat konversi dari tahap sebelumnya;
  - gauge setengah lingkaran target Q4: nilai won ditambah forecast tertimbang;
  - papan peringkat pemilik deal dengan batang bertumpuk won/open;
  - koleksi invoice: persentase tertagih dan batang tersegmentasi Paid/Pending/Overdue;
  - heatmap keterlibatan tim per hari dengan rata-rata per hari kerja (contoh);
  - tugas dengan cincin progres, aktivitas terbaru, tabel deal dengan batang probabilitas, dan kesehatan proyek dengan cincin progres.
- Contacts: setiap kartu kontak kini berfoto. Foto realistis ini dibuat dengan AI dan tidak menggambarkan orang nyata. Ditambahkan kontak keenam, Arif Hidayat (Head of Digital Banking, Summit Bank). Kontak tanpa foto, misalnya yang ditambahkan pengguna, tetap memakai inisial.
- Grid kartu kontak kini 6, 3, atau 2 kolom sesuai lebar area konten (container query; 6 kolom mulai lebar 1080 px), sehingga enam kartu selalu mengisi baris penuh. Ringkasan deal di kartu sempit tersusun ke bawah, dan tombol View contact sejajar di dasar kartu.
- Panel yang memakai data live mengikuti kotak filter di topbar. Grafik dan heatmap bisa dipakai dengan keyboard: fokus, lalu tombol panah.
- Semua halaman lain kini memakai tata letak penuh: kartu statistik di atas, lalu grid 12 kolom berisi panel utama dan panel insight di sisinya.
  - Reports: grafik pendapatan 3M/6M/12M, tabel laporan pipeline, deal per prioritas, perkiraan closing per minggu, nilai per pemilik, dan klien teratas.
  - Activity: timeline, rekap per jenis dan per orang, serta heatmap keterlibatan.
  - Contacts: kartu kontak dengan ringkasan deal akunnya, tabel akun, akun teratas, dan daftar akun yang belum punya kontak (tombol Add mengisi nama perusahaan).
  - Deals: tabel "Closing soon" dan komposisi pipeline per tahap di bawah papan kanban.
  - Inbox: filter All/Unread dan kolom ketiga berisi kartu kontak pengirim, deal terkait, dan status percakapan.
  - Calendar: tugas dan tanggal closing deal ikut tampil di kalender, plus ringkasan bulan dan agenda.
  - Tasks: daftar dikelompokkan Overdue/Today/Upcoming/Completed, tautan ke deal terkait, cincin progres, dan beban 7 hari ke depan.
  - Products: meter stok, nilai stok, komposisi katalog, peringatan restok dengan tombol +50, produk teratas, dan titik harga.
  - Orders: status fulfilment, pendapatan harian, metode pembayaran, dan pelanggan teratas.
  - Invoices: kartu tagihan/tertagih/outstanding/overdue, jatuh tempo relatif, tombol Remind, komposisi koleksi, aging, dan klien.
  - Projects: timeline pengiriman bergaya Gantt, status portofolio, dan beban kerja anggota.
  - Files: statistik penyimpanan, komposisi per tipe file, dan kontributor.
  - Team: pipeline dan proyek per anggota, masa kerja, status tim, dan peran.
  - Profile: pipeline pribadi, gauge target pribadi, tabel deal, heatmap, dan proyek.
  - Billing: cincin pemakaian, ringkasan biaya, dan grafik pengeluaran.
  - Settings: tata letak dua kolom, pratinjau profil, notifikasi, jumlah record per koleksi, unduh cadangan JSON, dan daftar pintasan keyboard.
  - Help: empat tautan cepat, pintasan keyboard, dan status workspace.
  - Components: etalase semua komponen, termasuk grafik.
  - Pages: thumbnail tiruan tiap layar.
- Tujuh layar mandiri kini lebih kaya komponen dan bergerak:
  - Sign in: tata letak terbelah dengan panel showcase. Carousel tiga sorotan (kartu mini pipeline dengan sparkline, cincin target, dan foto kontak) berganti tiap 5 detik, berhenti saat disorot kursor atau difokus, dan punya tombol jeda. Ditambah tombol single sign-on dan tautan email (demo), kolom berikon, tombol tampilkan sandi, peringatan Caps Lock, dan tombol dengan spinner.
  - Sign up: pilihan paket dari data `plans`, meter kekuatan sandi empat tingkat dengan daftar syarat yang langsung tercentang, serta panel berisi daftar manfaat dan kutipan pelanggan fiktif.
  - Forgot password: alur tiga langkah (email, kode 6 digit, sandi baru) dengan stepper. Kotak kode maju otomatis dan menerima tempel, tombol kirim ulang muncul setelah hitung mundur 30 detik, konfirmasi sandi diperiksa, dan tanda centang tergambar saat selesai. Panel samping mengikuti langkah aktif.
  - Lock screen: jam besar yang berjalan, avatar dengan riak, lama terkunci, dan ringkasan selama ditinggal (pesan belum dibaca, tugas jatuh tempo, jadwal berikutnya) dari data live.
  - Error 404: angka 404 melayang dengan orb dan satelit, alamat yang tidak ditemukan, pencarian halaman, empat tautan cepat, dan tombol Go back.
  - Error 500: status layanan dengan titik berdenyut, percobaan ulang otomatis tiap 20 detik dengan cincin hitung mundur, tombol Retry now, nomor referensi yang bisa disalin, dan skenario pulih pada percobaan ketiga.
  - Maintenance: roda gigi berputar, hitung mundur jam/menit/detik, progress bar bergaris, daftar langkah upgrade, dan formulir "Notify me" (demo).
  - Isi kartu muncul berurutan saat layar dibuka, dan latar memiliki gumpalan warna yang bergeser pelan. Dengan "kurangi gerakan", semua animasi mati dan carousel tidak berganti sendiri.
- Pages: kartu statistik, filter All/Authentication/System yang juga mengikuti kotak filter topbar, thumbnail yang bergerak saat disorot, label fitur per layar, diagram alur sign-in yang simpulnya bisa diklik, dan panel komponen bersama.
- Ikon baru: `tick`, `eyeOff`, `refresh`, `shield`, `pause`, `play`, `copy`, `key`, dan `sparkle`.
- Komponen baru di `src/components.jsx`: `TrendChart`, `Gauge`, `Ring`, `SegmentBar`, `Heatmap`, `Columns`, `BarList`, dan `Breakdown`. `RevenueChart` kini menerima `months` dan `values`. `StatCard` menerima prop opsional `trend` dan `delta`.
- Data contoh baru di `src/data.js`: `revenue`, `trends`, `engagement`, dan `quarterTarget`.
- Dua varian dashboard baru di grup Overview:
  - **Analytics** (`#analytics`): dashboard trafik situs web. Kartu pengunjung, page view, rata-rata durasi sesi, dan tingkat sign-up dengan sparkline 12 minggu dan perubahan terhadap 30 hari sebelumnya. Grafik pengunjung harian 7D/30D/90D dibandingkan periode sebelumnya, panel "Active right now" yang diperbarui tiap 4 detik, sumber trafik, perangkat dengan cincin, jam tersibuk, halaman teratas, negara teratas, audiens baru vs kembali dengan jumlah kunjungan per pengunjung, dan tabel kampanye (klik, sign-up, konversi, biaya per sign-up). Tombol ekspor CSV mengikuti periode grafik. Semua angka adalah data contoh; tabel dan daftar mengikuti kotak filter.
  - **eCommerce** (`#ecommerce`): dashboard toko. Kartu penjualan bersih, pesanan, nilai pesanan rata-rata, dan tingkat konversi. Grafik penjualan harian 7D/30D/90D, funnel checkout dengan tingkat cart abandonment, target bulanan berbentuk gauge dengan proyeksi akhir bulan, produk terlaris, penjualan per kategori, dan tabel penjualan per wilayah (data contoh). Antrean fulfilment, pesanan terbaru, dan sisa stok dalam hari (dengan tombol restok +50) memakai data live dan mengikuti kotak filter.
- Data contoh baru di `src/data.js`: `store` (180 hari penjualan, unit terjual per produk, funnel, wilayah, target) dan `traffic` (180 hari trafik, kanal, perangkat, jam, halaman, negara, kampanye). Total 30 hari `store` disamakan dengan unit terjual × harga seed produk.
- Ikon baru: `globe` dan `bag`.
- `TrendChart` menerima `zero` (label sumbu nol, default `$0`) dan `tick` (jarak minimum label sumbu X, default 34 px), dan skala sumbu Y kini menyesuaikan nilai sekecil atau sebesar apa pun. `StatCard` menerima `vs` untuk teks pembanding pada chip perubahan. `Range` di `pages.jsx` menerima pilihan periode sendiri.
- Token `--series` (warna seri grafik; `--accent` di mode terang, `--accent-deep` di mode gelap) serta `--fill-success`, `--fill-warning`, dan `--fill-danger` untuk isian status pada grafik. Ketiganya sudah diperiksa terhadap buta warna di kedua mode.
- Animasi masuk "clay pop" pada konten setiap kali halaman dibuka. Kartu statistik, panel, dan kolom kanban naik sambil membesar dengan pantulan kecil. Ikon kartu statistik memantul. Baris tabel, task, timeline, pesan, dan kartu deal bergeser dari kiri. Batang grafik tumbuh dari bawah dan progress bar terisi dari kiri. Elemen muncul berurutan dari atas ke bawah, dan seluruh animasi selesai dalam kurang dari 2 detik. Sidebar dan topbar tidak dianimasikan.
- Jeda berurutan hanya berlaku selama 2 detik setelah pindah halaman. Elemen yang muncul sesudahnya, misalnya record baru, kartu yang dipindah, atau hasil Undo, langsung muncul dengan pop tanpa jeda.
- Token gerak `--ease-out` dan `--ease-spring` di `src/styles.css`. Animasi otomatis mati bila pengguna mengaktifkan pengaturan "kurangi gerakan" (`prefers-reduced-motion`).

### Diubah

- Warna aksen kini mengubah seluruh warna yang berkaitan, bukan hanya tombol dan sidebar. Rose, sage, dan navy masing-masing punya palet lengkap untuk mode terang dan gelap: latar belakang, permukaan (blush untuk violet dan rose, ivory untuk sage, linen untuk navy), teks, badge netral, batang grafik, kartu statistik dan ikonnya, chip kalender, avatar, bayangan, backdrop modal, dan confetti. Palet violet tidak berubah.
- Kartu statistik dan avatar memakai slot warna. Slot pertama mengikuti aksen. Slot pendamping yang terlalu mirip aksen diganti: rose memakai mint dan lavender, sage memakai lavender, dan navy memakai mint dan lavender. `StatCard` kini menerima `tone="s1"`…`"s4"`, bukan nama warna.
- Swatch di Settings menampilkan gradien sidebar aksen yang sebenarnya, dan warna `theme-color` browser mengikuti aksen.
- Token baru di `src/styles.css`: `--bg-glow/-a/-b`, `--shade`, `--shade-deep`, `--bar`, `--bar-active`, `--stat-1…4` (dengan `-icon` dan `-fg`), serta `--tone-0…3` (dengan `-fg`). `--stat-lavender/coral/peach/blue` dihapus.
- Label versi di bawah sidebar kini dibaca dari `package.json`, sehingga selalu sama dengan versi paket, dan memakai versi lengkap (`V1.2.0`). Jarak hurufnya dirapatkan dari 0,9 px ke 0,5 px agar tetap satu baris.
- Lisensi MIT kini atas nama Syams Ideris. Berkas `LICENSE` yang isinya dobel dihapus; `LICENSE.txt` menjadi satu-satunya berkas lisensi.
- Dokumentasi: `README.md`, `README.txt`, `PANDUAN.html`, dan `QA.txt` diperbarui ke versi 1.2.0, termasuk ukuran berkas, daftar halaman, perilaku hapus dengan Undo, dan screenshot galeri.

### Diperbaiki

- Di layar ponsel, grafik Monthly revenue di Reports pada rentang 12M melebar keluar panel dan membuat halaman bisa digeser ke samping. Di lebar 760 px ke bawah, jarak antarbatang kini lebih rapat, dan bila ada lebih dari delapan batang hanya label bulan selang-seling yang ditampilkan, dihitung dari bulan terakhir.
- Di mode gelap, sidebar, latar belakang, dan `--accent-light` selalu ungu, apa pun aksen yang dipilih.
- Di mode gelap, track switch dalam posisi mati hampir tidak terlihat.
- Di layar mandiri, tulisan "mellow." pada logo hilang di lebar 1000 px ke bawah.
- Di layar sempit, teks khusus pembaca layar di dalam tabel (misalnya kolom aksi di Products) lolos dari area gulir tabel dan membuat halaman bisa digeser ke samping. `.table-wrap` kini `position: relative`.

## [1.1.0] - 2026-11-03

Rilis perbaikan UI/UX hasil audit desain, mencakup keterbacaan, navigasi, design token, keramaian visual, dan petunjuk interaksi. Data demo yang sudah tersimpan di browser tetap terbaca tanpa perlu reset.

### Ditambahkan

- Design token di `src/styles.css`:
  - skala tipografi `--fs-*` (11–28 px) dan radius `--r-*`;
  - warna semantik `--success`, `--warning`, `--danger`, `--info`, dan `--neutral`, masing-masing dengan varian `-bg`;
  - `--surface-2` dan latar kartu statistik `--stat-*`;
  - tiga tingkat bayangan;
  - `--primary-a/b` dan `--sidebar-a/b` untuk tiap warna aksen.
- Font Nunito Sans (variable, subset Latin) tertanam di CSS melalui paket `@fontsource-variable/nunito-sans`. Lisensi OFL-nya ditambahkan ke `THIRD-PARTY-NOTICES.txt`.
- Grup menu sidebar yang bisa dilipat. Statusnya tersimpan di `settings.navCollapsed`, dan grup UI kit terlipat sejak awal.
- Menu aksi "•••" yang bisa dipakai dengan keyboard, di kartu deal, kontak, tugas, dan proyek. Isinya: Edit, pindah ke tahap berikutnya, tandai selesai, kirim email, dan hapus.
- Menghapus satu record langsung terjadi, lalu toast menawarkan tombol Undo (fungsi `remove`).
- Tiga jenis toast: sukses, info, dan error.
- Shortcut `/` untuk membuka filter halaman, dan Esc untuk mengosongkannya.
- Kalender: penanda hari ini, klik sel kosong untuk menambah event, serta daftar agenda di layar mobile.
- Keterangan konteks pada kartu statistik, misalnya "9 open deals" dan "By stage probability".
- Tombol "+" di dock mobile yang menyesuaikan halaman: deal, kontak, tugas, event, produk, proyek, atau anggota.

### Diubah

- Kontras teks lolos WCAG AA (4,5:1) di mode terang dan gelap, serta di keempat warna aksen. Ini mencakup `--muted`, tombol utama, sidebar, badge, avatar, dan label kecil.
- Ukuran teks minimal 12 px. Ukuran 11 px hanya untuk label huruf kapital, badge, angka penghitung, dan inisial.
- Sidebar menempel saat halaman di-scroll, dan hanya daftar menunya yang di-scroll. Blok profil diringkas menjadi satu baris.
- Halaman awal (hash kosong) sekarang Dashboard, bukan Deals.
- Satu judul per halaman: H1 di topbar dan subjudul fungsional di bawahnya. Label "WORKSPACE / …" dan slogan dihapus. `pageHead(sub, actions)` kini hanya menerima subjudul dan aksi.
- Spasi memakai kelipatan 4 px, dan radius sudut memakai empat tingkat plus bentuk pil.
- Bayangan dibagi tiga tingkat: wadah, elemen interaktif, dan overlay. Blur dihapus dari panel, dan efek hover tidak lagi menggeser tombol dan item menu.
- Dark mode dibangun ulang di atas token. Kartu statistik, sidebar, badge, toast, dan segmented control kini gelap dan konsisten.
- Dock bawah hanya tampil di mobile.
- Kotak pencarian menjadi filter halaman ("Filter deals…"). Filter hanya mencocokkan teks yang tampil, termasuk tanggal ("nov 2") serta nomor invoice dan pesanan.
- Kartu statistik yang tidak bisa diklik tampil sebagai elemen biasa, tanpa panah.
- Konfirmasi hanya muncul untuk aksi massal, dengan label tombol yang spesifik: "Reset data", "Clear log", dan "Switch to …".
- Format angka: nilai di bawah 1.000 ditulis lengkap ("$0", bukan "$0K"). Angka ringkas dipakai di kartu, angka lengkap di tabel.
- Ikon: Contacts memakai ikon buku alamat dan Team memakai ikon grup. Tombol profil di topbar menampilkan inisial.
- Dropdown notifikasi bisa ditutup dengan Esc atau klik di luar.
- Dokumentasi: README.md dan kelima screenshot galeri diperbarui ke tampilan 1.1.0, `README.txt` dan `PANDUAN.html` ditandai versi 1.1.0, dan `CLAUDE.md` menjelaskan token serta API baru.

### Diperbaiki

- Kotak pencarian tidak menampilkan tanda fokus keyboard.
- Di lebar 761–1000 px, tombol menu tidak punya nama aksesibel dan label grup terpotong ("OVERVIE").
- Sudut kanan bawah sidebar menyembul di bawah panel utama.
- Badge di halaman Tasks melebar memenuhi baris.
- Target sentuh yang terlalu kecil kini minimal 24×24 px: tombol "•••", pilihan "Move to", angka tanggal, swatch warna, dan tombol tutup toast.
- Segmented control tidak memakai `aria-pressed`, dan pesan belum dibaca hanya ditandai dengan warna.

## [1.0.0] - 2026-11-02

Rilis awal: template dashboard CRM React 19 bergaya clay & glass, dengan 20 halaman, 7 layar mandiri, data demo di `localStorage`, tema gelap, empat warna aksen, ekspor CSV, dan versi standalone satu file.

[Unreleased]: https://github.com/Syamsuddin/theme-mellow/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/Syamsuddin/theme-mellow/releases/tag/v1.3.0
[1.2.0]: https://github.com/Syamsuddin/theme-mellow/releases/tag/v1.2.0
[1.1.0]: https://github.com/Syamsuddin/theme-mellow/releases/tag/v1.1.0
