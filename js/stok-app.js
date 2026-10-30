/* ========================================================
   Logika Vue.js: Modul Stok Bahan Ajar
   js/stok-app.js
   ======================================================== */

var app = new Vue({
  el: '#app',
  data: {
    // Data Master yang Disediakan
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    
    // Dataset Awal Inventaris Bahan Ajar
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>"
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
      }
    ],

    // Nilai Model Filter & Sortir
    selectedUpbjj: "",
    selectedKategori: "",
    stockFilter: "ALL", // Opsi: ALL, LOW, EMPTY, REORDER
    sortBy: "judul",
    sortOrder: "asc",

    // Status UI Form Tambah & Modal Edit
    showAddForm: false,
    editingItem: null,
    notificationMessage: "",
    criticalStockAlert: false,

    // Model Form Entri Baru
    newEntry: {
      kode: "",
      judul: "",
      kategori: "",
      upbjj: "",
      lokasiRak: "",
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: ""
    },

    // Penampung Pesan Kesalahan Validasi
    errors: {}
  },

  computed: {
    // Computed property: menyaring dan mengurutkan stok secara reaktif tanpa komputasi manual berulang
    filteredAndSortedStok: function () {
      var self = this;
      var hasil = self.stok.filter(function (item) {
        // 1. Filter Regional Office (UPBJJ)
        if (self.selectedUpbjj && item.upbjj !== self.selectedUpbjj) {
          return false;
        }

        // 2. Filter Kategori (Dependent Filter)
        if (self.selectedKategori && item.kategori !== self.selectedKategori) {
          return false;
        }

        // 3. Filter Status Stok
        if (self.stockFilter === "LOW") {
          return item.qty > 0 && item.qty < item.safety;
        } else if (self.stockFilter === "EMPTY") {
          return item.qty === 0;
        } else if (self.stockFilter === "REORDER") {
          return item.qty <= item.safety;
        }

        return true;
      });

      // Logika Pengurutan (Sorting)
      hasil.sort(function (a, b) {
        var faktor = self.sortOrder === 'asc' ? 1 : -1;
        if (self.sortBy === 'judul') {
          return a.judul.localeCompare(b.judul) * faktor;
        } else if (self.sortBy === 'qty') {
          return (a.qty - b.qty) * faktor;
        } else if (self.sortBy === 'harga') {
          return (a.harga - b.harga) * faktor;
        }
        return 0;
      });

      return hasil;
    }
  },

  watch: {
    // WATCHER 1: Mengamati pemilihan UPBJJ
    // Ketika UPBJJ berganti, reset Kategori & beri pesan konfirmasi dependensi
    selectedUpbjj: function (newVal, oldVal) {
      this.selectedKategori = "";
      if (newVal) {
        this.notificationMessage = "Wilayah aktif diubah ke " + newVal + ". Filter kategori disesuaikan.";
      } else {
        this.notificationMessage = "Menampilkan bahan ajar dari seluruh UPBJJ.";
      }

      // Hapus pesan info otomatis setelah 4 detik
      var self = this;
      setTimeout(function () {
        self.notificationMessage = "";
      }, 4000);
    },

    // WATCHER 2: Memantau dataset stok secara mendalam (deep watcher)
    // Mendeteksi jika ada stok bahan ajar yang menyentuh angka 0
    stok: {
      handler: function (val) {
        var adaKosong = val.some(function (item) {
          return item.qty === 0;
        });
        this.criticalStockAlert = adaKosong;
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    // Reset seluruh kontrol filter dan sorting
    resetFilters: function () {
      this.selectedUpbjj = "";
      this.selectedKategori = "";
      this.stockFilter = "ALL";
      this.sortBy = "judul";
      this.sortOrder = "asc";
    },

    // Validasi form tambah data bahan ajar
    validateForm: function () {
      this.errors = {};
      if (!this.newEntry.kode.trim()) this.errors.kode = "Kode bahan ajar wajib diisi.";
      if (!this.newEntry.judul.trim()) this.errors.judul = "Judul bahan ajar wajib diisi.";
      if (!this.newEntry.kategori) this.errors.kategori = "Pilih kategori mata kuliah.";
      if (!this.newEntry.upbjj) this.errors.upbjj = "Pilih wilayah UPBJJ.";
      if (!this.newEntry.lokasiRak.trim()) this.errors.lokasiRak = "Lokasi rak wajib diisi.";
      if (this.newEntry.harga <= 0) this.errors.harga = "Harga harus bernilai positif.";
      if (this.newEntry.qty < 0) this.errors.qty = "Stok awal tidak boleh bernilai negatif.";
      if (this.newEntry.safety <= 0) this.errors.safety = "Safety stock minimal bernilai 1.";

      return Object.keys(this.errors).length === 0;
    },

    // Submit entri bahan ajar baru
    submitNewMaterial: function () {
      if (!this.validateForm()) return;

      this.stok.push({
        kode: this.newEntry.kode.toUpperCase().trim(),
        judul: this.newEntry.judul.trim(),
        kategori: this.newEntry.kategori,
        upbjj: this.newEntry.upbjj,
        lokasiRak: this.newEntry.lokasiRak.toUpperCase().trim(),
        harga: this.newEntry.harga,
        qty: this.newEntry.qty,
        safety: this.newEntry.safety,
        catatanHTML: this.newEntry.catatanHTML || "<em>Reguler</em>"
      });

      alert("Data bahan ajar berhasil ditambahkan!");
      this.resetNewForm();
      this.showAddForm = false;
    },

    // Bersihkan formulir penambahan
    resetNewForm: function () {
      this.newEntry = {
        kode: "",
        judul: "",
        kategori: "",
        upbjj: "",
        lokasiRak: "",
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ""
      };
      this.errors = {};
    },

    // Buka dialog popup modal untuk mengedit data stok
    openEditModal: function (item) {
      // Salin referensi objek ke clone untuk pengeditan aman
      this.editingItem = JSON.parse(JSON.stringify(item));
    },

    // Tutup modal edit tanpa menyimpan
    closeEditModal: function () {
      this.editingItem = null;
    },

    // Simpan hasil pengeditan kembali ke array utama
    saveEditModal: function () {
      if (!this.editingItem) return;

      var self = this;
      var targetIndex = this.stok.findIndex(function (i) {
        return i.kode === self.editingItem.kode;
      });

      if (targetIndex !== -1) {
        // Vue 2 Reactivity Setter
        Vue.set(this.stok, targetIndex, this.editingItem);
        alert("Perubahan stok bahan ajar berhasil disimpan!");
      }
      this.editingItem = null;
    }
  }
});