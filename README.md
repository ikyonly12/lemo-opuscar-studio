# Lemo-Opuscar Web Studio & Cloud Render Farm

Studio animasi berbasis web dan cloud render farm untuk **Lemo-Opuscar**. Menghasilkan animasi deterministik berbasis kode murni (Three.js 3D PBR, Canvas 2D, WebGL Shaders) tanpa model generatif probabilistik (No Sora/Runway/Kling).

---

## 🌟 Fitur Utama
1. **Katalog 66 Visual Styles**: Pilihan visual langsung dengan poster pratinjau, filter engine, dan pencarian cepat.
2. **AI Story Generator**: Menghasilkan 3 ide cerita unik berbasis rumus Lemo-Opuscar (objek sehari-hari + asal-usul sejarah tak terduga + mekanisme sains) dengan pencegahan duplikasi (`history.json`).
3. **Voice & BGM Suite**: Pemilih suara neural (Edge-TTS Indonesia/Inggris & ElevenLabs) dengan 4-layer BGM mix balancer (Bass, Harmony, Melody, Rhythm).
4. **Interactive Scrubber Viewport**: Simulasi visual timeline deterministik $render(t)$ dengan tombol ganti rasio 16:9 Landscape vs 9:16 Portrait Shorts.
5. **Cloud Render Farm (GitHub Actions)**: Render video beresolusi tinggi di server cloud Linux 4 vCPU 16GB RAM tanpa membebani laptop.

---

## 🚀 Cara Menjalankan Studio Lokal

### 1. Jalankan Server Backend
```bash
cd server
npm start
```
*Backend berjalan di `http://localhost:3001`.*

### 2. Jalankan Frontend Web App
```bash
cd client
npm run dev
```
*Frontend studio terbuka di `http://localhost:3000`.*

---

## ☁️ Menjalankan Cloud Render Farm di GitHub Actions

1. Repositori ini sudah dilengkapi alur kerja `.github/workflows/render.yml`.
2. Di antarmuka Web App, klik tombol **"Render di Cloud"**.
3. Masukkan GitHub Username dan Personal Access Token (PAT).
4. Server GitHub Actions akan langsung merender film frame demi frame dan menyediakan file MP4 master yang siap diunduh!

