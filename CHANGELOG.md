# Changelog

Semua perubahan penting pada Mellow Admin dicatat di file ini. Formatnya mengikuti [Keep a Changelog](https://keepachangelog.com/id-ID/1.1.0/), dan penomoran versinya mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [Belum dirilis]

### Ditambahkan

- Animasi masuk "clay pop" pada konten setiap kali halaman dibuka. Kartu statistik, panel, dan kolom kanban naik sambil membesar dengan pantulan kecil. Ikon kartu statistik memantul. Baris tabel, task, timeline, pesan, dan kartu deal bergeser dari kiri. Batang grafik tumbuh dari bawah dan progress bar terisi dari kiri. Elemen muncul berurutan dari atas ke bawah, dan seluruh animasi selesai dalam kurang dari 2 detik. Sidebar dan topbar tidak dianimasikan.
- Jeda berurutan hanya berlaku selama 2 detik setelah pindah halaman. Elemen yang muncul sesudahnya, misalnya record baru, kartu yang dipindah, atau hasil Undo, langsung muncul dengan pop tanpa jeda.
- Token gerak `--ease-out` dan `--ease-spring` di `src/styles.css`. Animasi otomatis mati bila pengguna mengaktifkan pengaturan "kurangi gerakan" (`prefers-reduced-motion`).

### Diubah

- Warna aksen kini mengubah seluruh warna yang berkaitan, bukan hanya tombol dan sidebar. Rose, sage, dan navy masing-masing punya palet lengkap untuk mode terang dan gelap: latar belakang, permukaan (blush untuk violet dan rose, ivory untuk sage, linen untuk navy), teks, badge netral, batang grafik, kartu statistik dan ikonnya, chip kalender, avatar, bayangan, backdrop modal, dan confetti. Palet violet tidak berubah.
- Kartu statistik dan avatar memakai slot warna. Slot pertama mengikuti aksen. Slot pendamping yang terlalu mirip aksen diganti: rose memakai mint dan lavender, sage memakai lavender, dan navy memakai mint dan lavender. `StatCard` kini menerima `tone="s1"`…`"s4"`, bukan nama warna.
- Swatch di Settings menampilkan gradien sidebar aksen yang sebenarnya, dan warna `theme-color` browser mengikuti aksen.
- Token baru di `src/styles.css`: `--bg-glow/-a/-b`, `--shade`, `--shade-deep`, `--bar`, `--bar-active`, `--stat-1…4` (dengan `-icon` dan `-fg`), serta `--tone-0…3` (dengan `-fg`). `--stat-lavender/coral/peach/blue` dihapus.

### Diperbaiki

- Di mode gelap, sidebar, latar belakang, dan `--accent-light` selalu ungu, apa pun aksen yang dipilih.
- Di mode gelap, track switch dalam posisi mati hampir tidak terlihat.

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

[1.1.0]: https://github.com/Syamsuddin/theme-mellow/releases/tag/v1.1.0
