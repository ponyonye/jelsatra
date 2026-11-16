# Jelajah Satwa Nusantara — WebAR Satwa Langka Indonesia

Aplikasi Augmented Reality (WebAR) edukatif berbasis web yang memungkinkan pengguna melihat model 3D satwa langka Indonesia di dunia nyata melalui kamera browser smartphone tanpa perlu menginstal aplikasi native.

## Teknologi & Arsitektur

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **3D & Augmented Reality**: `@google/model-viewer` (WebXR, Scene Viewer untuk Chrome Android, Quick Look untuk iOS Safari)
- **Animasi & Interaksi**: Framer Motion & Lucide Icons
- **Multibahasa (I18n)**: react-i18next
- **Navigasi & Deep Linking**: React Router v7 (`/satwa/:slug`, `/satwa/:slug/ar`, `/kredit`, `/poc`)
- **Hosting Target**: Cloudflare Pages (`dist/`, `public/_redirects`, `public/_headers`)

---

## Struktur Direktori

```
RSM/
├── public/
│   ├── _headers            # Konfigurasi MIME type model/gltf-binary & caching
│   ├── _redirects          # Cloudflare Pages SPA rewrite (/* /index.html 200)
│   ├── icons/              # Ikon SVG favicon & PWA
│   ├── images/
│   │   └── animals/        # Foto thumbnail & hero satwa hasil kurasi desain
│   └── models/             # Model 3D format GLB/glTF (< 10 MB per model)
├── src/
│   ├── ar/                 # Komponen penampil 3D & WebAR (@google/model-viewer)
│   ├── components/         # Komponen UI reusable (badge, kartu, status IUCN)
│   ├── data/               # Sumber data statis JSON (animals.json, credits.json)
│   ├── i18n/               # Setup multibahasa Indonesia & Inggris
│   ├── pages/              # Halaman galeri, detail, AR viewer, kredit, dan PoC
│   ├── styles/             # Tailwind CSS & custom responsive styling
│   ├── types/              # Deklarasi tipe TypeScript & model-viewer Web Component
│   ├── App.tsx             # Routing & alur aplikasi
│   └── main.tsx            # Entry point aplikasi
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Cara Menjalankan Aplikasi

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Menjalankan Server Pengembangan (Local Dev)
```bash
npm run dev
```
Akses di browser: `http://localhost:3000` (atau via IP lokal pada smartphone di jaringan WiFi yang sama).

### 3. Build untuk Produksi (Cloudflare Pages)
```bash
npm run build
```
Hasil build berada di folder `dist/` dan siap dideploy langsung ke Cloudflare Pages dengan build command:
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### 4. Menjalankan Preview Build
```bash
npm run preview
```

---

## Status Konservasi IUCN

Badge status konservasi mengimplementasikan standar warna dan teks:
- **CR** — Critically Endangered (Merah)
- **EN** — Endangered (Oranye)
- **VU** — Vulnerable (Kuning)
- **NT** — Near Threatened (Hijau Muda)
- **LC** — Least Concern (Hijau)

---

## Tim Pengembang (Sesuai PRD)

- **Raihan Garuts**: Ketua / Product Manager
- **Raihan Bekasi**: Programmer / Software Engineer
- **Guna**: Assets (Model 3D & Konten)
- **Novali**: UI/UX Designer
- **Hapis**: Quality Assurance (QA)
