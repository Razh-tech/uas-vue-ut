/* ========================================================
   Logika Vue.js: Modul Pelacakan Delivery Order (DO)
   js/tracking-app.js
   ======================================================== */

var app = new Vue({
  el: '#app',
  data: {
    // Data Master Paket & Pengiriman
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    pengirimanList: [
      { kode: "REG", nama: "Reguler (3-5 hari)" },
      { kode: "EXP", nama: "Ekspres (1-2 hari)" }
    ],
    paket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
    ],

    // Data Awal Pelacakan DO
    tracking: {
      "DO2025-001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE - Reguler (3-5 hari)",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        total: 120000,
        perjalanan: [
          { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      }
    },

    // Model Form Entri DO
    formDO: {
      nim: "",
      nama: "",
      ekspedisi: "",
      paketKode: "",
      tanggalKirim: new Date().toISOString().split('T')[0] // Mengambil tanggal hari ini secara otomatis
    },

    // Nilai Pencarian & Status Notifikasi
    searchQuery: "",
    searchFeedback: "",
    packageChangeNotice: "",
    formErrors: {}
  },

  computed: {
    // Menghasilkan Nomor DO Otomatis: format DO + Tahun Berjalan + Sequence (3 digit)
    nextDONumber: function () {
      var currentYear = new Date().getFullYear();
      var count = Object.keys(this.tracking).length + 1;
      var seq = String(count).padStart(3, '0');
      return "DO" + currentYear + "-" + seq;
    },

    // Rincian data paket yang dipilih pada form
    selectedPackageInfo: function () {
      var self = this;
      if (!this.formDO.paketKode) return null;
      return this.paket.find(function (p) {
        return p.kode === self.formDO.paketKode;
      });
    },

    // Penyaringan DO berdasarkan keyword nomor DO atau NIM mahasiswa
    filteredTrackingList: function () {
      var self = this;
      var q = self.searchQuery.toLowerCase().trim();
      if (!q) return self.tracking;

      var result = {};
      Object.keys(self.tracking).forEach(function (key) {
        var item = self.tracking[key];
        if (key.toLowerCase().includes(q) || item.nim.includes(q) || item.nama.toLowerCase().includes(q)) {
          result[key] = item;
        }
      });
      return result;
    }
  },

  watch: {
    // WATCHER 1: Mengamati pemilihan paket pada form pembuatan DO
    // Memberikan informasi harga dan daftar modul saat paket dipilih
    "formDO.paketKode": function (newKode) {
      if (newKode) {
        var selected = this.paket.find(function (p) { return p.kode === newKode; });
        if (selected) {
          this.packageChangeNotice = "Paket '" + selected.nama + "' dipilih. Total harga otomatis disesuaikan: Rp " + selected.harga.toLocaleString('id-ID');
        }
      } else {
        this.packageChangeNotice = "";
      }
    },

    // WATCHER 2: Mengamati kotak pencarian pelacakan DO
    // Memberikan umpan balik instan jumlah data yang cocok
    searchQuery: function (newQuery) {
      var count = Object.keys(this.filteredTrackingList).length;
      if (newQuery.trim() === "") {
        this.searchFeedback = "Menampilkan seluruh arsip pengiriman (" + count + " DO).";
      } else {
        this.searchFeedback = "Ditemukan " + count + " pengiriman cocok dengan kata kunci '" + newQuery + "'.";
      }
    }
  },

  methods: {
    // Validasi form pembuatan DO
    validateForm: function () {
      this.formErrors = {};
      if (!this.formDO.nim.trim()) {
        this.formErrors.nim = "NIM mahasiswa wajib diisi.";
      } else if (!/^\d+$/.test(this.formDO.nim)) {
        this.formErrors.nim = "NIM harus berupa deretan angka.";
      }

      if (!this.formDO.nama.trim()) this.formErrors.nama = "Nama penerima wajib diisi.";
      if (!this.formDO.ekspedisi) this.formErrors.ekspedisi = "Silakan tentukan layanan pengiriman.";
      if (!this.formDO.paketKode) this.formErrors.paketKode = "Silakan pilih salah satu paket bahan ajar.";

      return Object.keys(this.formErrors).length === 0;
    },

    // Membuat entri DO baru
    createNewDO: function () {
      if (!this.validateForm()) return;

      var doNum = this.nextDONumber;
      var selectedPaket = this.selectedPackageInfo;
      var now = new Date();
      var timeStr = now.toISOString().replace('T', ' ').substring(0, 19);

      // Tambahkan data ke object tracking secara reaktif
      Vue.set(this.tracking, doNum, {
        nim: this.formDO.nim.trim(),
        nama: this.formDO.nama.trim(),
        status: "Diproses di Sentra Pengiriman",
        ekspedisi: this.formDO.ekspedisi,
        tanggalKirim: this.formDO.tanggalKirim,
        paket: selectedPaket.kode,
        total: selectedPaket.harga,
        perjalanan: [
          { waktu: timeStr, keterangan: "Order DO dibuat dan dicetak untuk mahasiswa " + this.formDO.nama }
        ]
      });

      alert("Delivery Order " + doNum + " sukses diterbitkan!");

      // Reset form
      this.formDO.nim = "";
      this.formDO.nama = "";
      this.formDO.ekspedisi = "";
      this.formDO.paketKode = "";
      this.formErrors = {};
      this.packageChangeNotice = "";
    },

    // Menambah progres/checkpoint perjalanan paket untuk simulasi pelacakan
    tambahCheckpoint: function (doNumber) {
      var pesanBaru = prompt("Masukkan keterangan checkpoint perjalanan baru:", "Tiba di Kantor Ekspedisi Tujuan");
      if (pesanBaru && pesanBaru.trim()) {
        var now = new Date();
        var timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
        this.tracking[doNumber].perjalanan.push({
          waktu: timeStr,
          keterangan: pesanBaru.trim()
        });
        this.tracking[doNumber].status = "Dalam Pengantaran Kurir";
      }
    }
  }
});