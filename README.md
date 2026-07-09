# 🇮🇩 Acara 17an Blok C Serpong Lagoon

Website pendaftaran digital lomba 17 Agustus warga Blok C Pelican, Serpong Lagoon. Dibangun dengan Next.js (App Router) + Tailwind CSS.

## Fitur

- **Halaman Utama** — rundown acara "Gerak Cepat", grid jenis lomba per kategori umur, dan daftar peserta yang diperbarui otomatis (polling tiap 15 detik).
- **Pendaftaran Anak (publik)** — pop-up form: nama, umur (dibatasi 4–12 tahun), blok rumah (input teks, divalidasi C1–C11), nomor rumah. Kategori (PAUD-TK / SD Kecil / SD Besar) ditentukan otomatis dari umur.
- **Tambah Jenis Lomba (khusus panitia)** — tombol hanya muncul jika panitia sudah login; tersedia di halaman utama dan dashboard.
- **Login & Dashboard Panitia** (`/login`, `/admin`) — tabel data lengkap peserta dengan tombol 🗑️ Hapus Peserta untuk membersihkan data ganda / salah input / pembatalan.

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Login Panitia

Kredensial default (bisa diubah lewat environment variable, lihat `.env.example`):

- Email: `panitia@blokc.id`
- Password: `merdeka17`

> ⚠️ Ubah `ADMIN_EMAIL`, `ADMIN_PASSWORD`, dan `AUTH_SECRET` sebelum dipakai di produksi.

## Penyimpanan Data

Data peserta dan lomba disimpan di **Firebase Realtime Database** (project `sl-blokc`, URL `https://sl-blokc-default-rtdb.firebaseio.com`) dengan struktur:

- `/competitions/{id}` — jenis lomba (`name`, `category`, `description`). Sudah terisi 9 lomba bawaan dari blueprint (`l-1` … `l-9`).
- `/participants/{id}` — peserta terdaftar (`name`, `age`, `block`, `houseNumber`, `category`, `registeredAt`).

Nilai `category` tetap memakai istilah acara ("PAUD-TK", "SD Kecil", "SD Besar", "Bapak", "Ibu", "Pasangan") karena merupakan konten domain, bukan nama atribut.

Semua akses database dilakukan dari server (API routes), sehingga aturan hapus peserta & tambah lomba tetap dijaga oleh sesi login panitia. Karena tidak lagi bergantung filesystem, aplikasi ini aman di-deploy ke Vercel/serverless.

> ⚠️ Security Rules RTDB saat ini terbuka (test mode). Sebelum produksi, batasi minimal `".write": false` untuk klien publik atau pindah ke Firebase Admin SDK dengan service account.

## Struktur Penting

- `lib/firebase.ts` — inisialisasi Firebase app & Realtime Database
- `lib/db.ts` — operasi baca/tulis lomba & peserta ke RTDB
- `lib/auth.ts` — sesi login panitia berbasis cookie
- `app/api/peserta`, `app/api/lomba`, `app/api/auth` — API routes
- `components/HomeClient.tsx` — halaman utama interaktif
- `components/AdminClient.tsx` — dashboard panitia
