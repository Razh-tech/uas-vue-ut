# SIM Bahan Ajar UT

SIM Bahan Ajar UT adalah aplikasi web sederhana untuk simulasi pengelolaan distribusi bahan ajar Universitas Terbuka. Aplikasi menyediakan dua modul:

- **Stok Bahan Ajar** — melihat stok per UPBJJ, memfilter berdasarkan wilayah dan kategori atau status persediaan, mengurutkan data, menambahkan bahan ajar, dan mengedit stok.
- **Tracking DO** — membuat Delivery Order dengan nomor otomatis, memilih paket dan layanan pengiriman, mencari arsip berdasarkan nomor DO, NIM, atau nama, serta menambahkan checkpoint perjalanan.

## Persyaratan

- Browser modern.
- Koneksi internet untuk memuat Vue 2.7.16 dari jsDelivr pada halaman stok dan tracking.
- Tidak perlu Node.js, npm, atau proses build.

## Instalasi

Unduh atau clone folder proyek, lalu buka folder tersebut. Jika menggunakan Git:

```powershell
git clone <URL-repositori>
cd uas-vue-ut
```

Tidak ada langkah instalasi dependensi. Untuk mencoba aplikasi, buka `index.html` di browser.

Atau jalankan server lokal dari folder proyek menggunakan Python:

```powershell
python -m http.server 8000
```

Kemudian buka <http://localhost:8000>.

## Cara menggunakan

1. Dari halaman **Beranda**, pilih **Stok Bahan Ajar** atau **Tracking DO**.
2. Pada **Stok Bahan Ajar**, coba pilih wilayah UPBJJ, lalu filter kategori dan status stok. Gunakan pilihan pengurutan, tombol reset, formulir tambah, atau tombol edit pada item untuk mencoba pengelolaan inventaris.
3. Pada **Tracking DO**, pilih layanan ekspedisi dan paket, isi NIM serta nama penerima, lalu terbitkan DO. Cari DO menggunakan nomor DO, NIM, atau nama, dan gunakan **Update Status Perjalanan** untuk menambahkan checkpoint.
4. Muat ulang halaman untuk mengembalikan data ke contoh awal.

## Mencoba data contoh

- Halaman stok dimulai dengan empat bahan ajar. Pilih filter **Butuh Reorder Segera** untuk melihat stok yang berada pada atau di bawah safety stock.
- Halaman tracking berisi contoh DO `DO2025-001` untuk NIM `123456789`. Cari nomor DO, NIM, atau nama penerima **Rina Wulandari**.
- Form DO menerima NIM berupa angka; kolom lainnya yang bertanda * wajib diisi.

## Catatan

Aplikasi ini merupakan prototipe sisi klien. Data awal dan perubahan disimpan sementara di memori halaman, bukan di server atau database, sehingga perubahan hilang saat halaman dimuat ulang. Perubahan data antarhalaman juga tidak disinkronkan.

---

Dibuat oleh **Radendy Bahtiar**.
