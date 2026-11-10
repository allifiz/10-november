# A Little Universe for You ✦

Sebuah website ucapan ulang tahun yang hangat dan artistik, terinspirasi dari langit malam, bulan, dan tekstur watercolor. Dibuat sebagai hadiah untuk seorang teman, tanpa nuansa romantis berlebihan.

## ✨ Pengalaman di dalamnya

- **The Invitation**: halaman pembuka dengan langit dan lukisan bertema malam.
- **The Little Gallery**: tiga lukisan SVG orisinal, masing-masing dengan pesan tersembunyi.
- **Little Constellations**: tiga bintang interaktif berisi harapan.
- **A Letter for You**: surat yang dibuka dengan mengetuk segel.
- **Make a Little Wish**: tulis harapan, lalu lepaskan ke langit dalam animasi bintang.
- **The Final Painting**: ucapan penutup dan tombol mengunduh lukisan pribadi sebagai PNG.
- Audio ambience opsional, **mati secara default**.

## 🚀 Publish via GitHub Pages

Repo ini merupakan website **HTML/CSS/JavaScript murni**, jadi tidak memerlukan Node.js, npm, Vite, React, backend, maupun build step.

1. Buka repo: https://github.com/allifiz/10-november
2. Masuk **Settings → Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pada **Branch**, pilih **main** dan folder **/(root)**, kemudian **Save**.
5. Saat deployment Pages berhasil, buka:
   **https://allifiz.github.io/10-november/**

> GitHub Pages bisa memerlukan sedikit waktu untuk mempublikasikan perubahan. URL di atas belum tentu langsung aktif sebelum setting Pages disimpan dan deployment sukses.

## 💌 Personalisasi nama

Buka file **main.js** dan ubah objek di bagian paling atas:

\`\`\`js
const BIRTHDAY = {
  recipientName: "nama temanmu",
  senderName: "namamu"
};
\`\`\`

Nama akan muncul otomatis pada surat dan halaman penutup, termasuk gambar PNG yang diunduh. Isi pesan lukisan dapat diedit pada objek \`ART\`; pesan bintang pada \`STARS\`. Surat utama berada di \`index.html\`, bagian \`letter-hidden\`.

> Desain ini dibuat untuk tanggal **10 November**. Jika tanggalnya berbeda, ubah teks tanggal yang muncul di \`index.html\`, \`main.js\` (pada PNG), dan \`README.md\`.

## 🧪 Tes lokal

Cukup jalankan server statis dari root proyek:

\`\`\`bash
python3 -m http.server 8080
\`\`\`

Lalu buka **http://localhost:8080**.

Jangan mengandalkan \`file://\` untuk fitur **download PNG** karena pengamanan browser sering memblokir pemuatan aset ke canvas dari file lokal. Gunakan localhost atau GitHub Pages.

## 🔐 Privasi

Fitur wish tidak mengirimkan input ke server. Wish disimpan menggunakan \`localStorage\` **di browser yang sama saja**, bukan dibagikan ke perangkat lain dan bukan disimpan publik. Jika data browser dihapus, wish ikut hilang.

Website ini tidak mengumpulkan data lewat backend. Font dimuat dari Google Fonts dan merupakan satu-satunya ketergantungan jaringan eksternal; jika offline, browser memakai font fallback.

## 🗂️ Struktur

\`\`\`text
.
├── index.html
├── style.css
├── main.js
├── assets/
│   ├── painted-sky.svg
│   ├── painted-garden.svg
│   └── painted-moon.svg
└── README.md
\`\`\`

Ilustrasi dalam folder \`assets\` merupakan SVG orisinal yang dibuat untuk proyek ini. Tidak diperlukan izin atau hotlink gambar pihak ketiga.
