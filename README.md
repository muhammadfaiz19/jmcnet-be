# JMCNET - Backend API (Express.js & Prisma SQLite)

Layanan RESTful API backend untuk **JMCNET** yang menangani otentikasi admin, manajemen paket internet, FAQ, testimoni, unggah dokumen (PDF/Word), dan Chatbot RAG AI terintegrasi menggunakan LLM Groq.

---

## 🛠️ Cara Setup & Menjalankan

### 1. Prasyarat (Prerequisites)
- **Node.js** (v18 ke atas)
- **PNPM** atau **NPM**

### 2. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env` di root folder `jmcnet-be/`:
```bash
cp .env.example .env
```
Sesuaikan variabel environment berikut:
```env
PORT=9091
DATABASE_URL="file:./dev.db"
JWT_SECRET="jmcnet-super-secret-key-123!"
GROQ_API_KEY="gsk_xxxx..." # Masukkan API Key Groq Anda untuk fitur Chatbot AI
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Setup Database & Seeding (Prisma SQLite)
Jalankan migrasi database dan masukkan data bawaan (paket internet, settings, FAQ, & chatbot context default):
```bash
# Buat database & migrasi tabel
npx prisma migrate dev --name init

# Masukkan data bawaan (seeding)
npx prisma db seed
```

### 5. Jalankan Server Dev
Jalankan backend API pada mode development:
```bash
npm run dev
```
API akan berjalan di [http://localhost:9091](http://localhost:9091).

---

## 🔒 Akun Akses Admin Bawaan
Setelah proses database seed berhasil dijalankan, Anda dapat login menggunakan akun administrator default:
- **Email**: `admin@jmcnet.id`
- **Password**: `jmcnet2026`

---

## 🔍 Troubleshooting (Pemecahan Masalah)

- **Chatbot AI Tidak Menjawab / Error**:
  - *Penyebab*: Kunci `GROQ_API_KEY` kosong atau kedaluwarsa.
  - *Solusi*: Masukkan API key Groq yang aktif di file `.env`. Chatbot AI memanfaatkan Groq SDK untuk memproses RAG dengan data snapshot database Anda.
- **Gagal Upload Berkas Dokumen**:
  - *Penyebab*: Mengunggah file di luar format yang diizinkan.
  - *Solusi*: Pastikan berkas logo berupa gambar (`image/*`), sedangkan formulir pendaftaran serta kontrak berlangganan berupa **PDF (.pdf) atau Word (.doc, .docx)**.
