# 📝 Two Notes

Aplikasi catatan pribadi desktop yang simpel, cepat, dan elegan — dibangun dengan **Vue 3**, **Electron**, dan **Tailwind CSS**. Semua catatan tersimpan secara lokal di perangkatmu, tanpa perlu internet atau akun.

![Vue](https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js&logoColor=white&style=flat-square)
![Electron](https://img.shields.io/badge/Electron-30-47848F?logo=electron&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&style=flat-square)

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|---|---|
| 📄 **Buat & Kelola Catatan** | Tambah, edit judul, dan hapus catatan dengan mudah |
| ✍️ **Catatan Teks Panjang** | Tulis catatan bebas di area teks yang luas |
| ✅ **To-Do List** | Setiap catatan punya checklist to-do sendiri |
| 🎨 **Dark Mode Elegan** | Tampilan gelap modern dengan aksen hijau emerald |
| 💾 **Penyimpanan Lokal** | Data tersimpan otomatis di `localStorage` — privat & offline |
| ✏️ **Edit Judul Inline** | Rename catatan langsung dari sidebar tanpa modal |
| 🖥️ **Aplikasi Desktop** | Berjalan sebagai app native via Electron |

---

## 📸 Preview

> Jalankan aplikasi untuk melihat tampilan dark mode yang elegan dengan sidebar catatan di kiri dan area editor di kanan.

---

## 🏗️ Tech Stack

- **Frontend Framework** — [Vue 3](https://vuejs.org/) dengan Composition API (`<script setup>`)
- **Desktop Runtime** — [Electron](https://www.electronjs.org/) 30
- **Build Tool** — [Vite](https://vitejs.dev/) 5
- **Styling** — [Tailwind CSS](https://tailwindcss.com/) 3.4 dengan custom dark theme
- **Language** — [TypeScript](https://www.typescriptlang.org/)

---

## 📁 Struktur Project

```
two-notes/
├── electron/                  # Electron main & preload process
│   ├── main.ts                # Entry point Electron (BrowserWindow)
│   ├── preload.ts             # Preload script (IPC bridge)
│   └── electron-env.d.ts      # Type declarations Electron
├── src/
│   ├── components/
│   │   ├── Sidebar.vue        # Sidebar: daftar catatan, tambah, hapus
│   │   └── MainArea.vue       # Area utama: editor teks & to-do list
│   ├── App.vue                # Root component: state management
│   ├── main.ts                # Entry point Vue app
│   ├── style.css              # Global styles + Tailwind directives
│   └── vite-env.d.ts          # Vite type declarations
├── index.html                 # HTML entry point
├── vite.config.ts             # Konfigurasi Vite + Electron plugin
├── tailwind.config.js         # Konfigurasi Tailwind (custom colors)
├── tsconfig.json              # Konfigurasi TypeScript
├── electron-builder.json5     # Konfigurasi build Electron
└── package.json               # Dependencies & scripts
```

---

## 🚀 Cara Menjalankan

### Prasyarat

- [Node.js](https://nodejs.org/) versi 18 atau lebih baru
- [npm](https://www.npmjs.com/) (biasanya sudah terinstall bersama Node.js)

### Instalasi

```bash
# 1. Clone repository
git clone https://github.com/username/two-notes.git
cd two-notes

# 2. Install dependencies
npm install

# 3. Jalankan dalam mode development
npm run dev
```

Aplikasi Electron akan terbuka secara otomatis setelah Vite selesai compile. 🎉

### Build untuk Produksi

```bash
npm run build
```

Hasil build akan tersedia di folder `dist-electron/` dan bisa di-package menjadi installer menggunakan Electron Builder.

---

## 🧩 Arsitektur Komponen

```
App.vue (State Manager)
├── Sidebar.vue
│   ├── Tombol "+ Baru" → emit("create-note")
│   ├── List Catatan → emit("select-note", id)
│   ├── Input Edit Judul → emit("save")
│   └── Tombol Hapus → emit("delete-note", id)
│
└── MainArea.vue
    ├── Input Judul Catatan → emit("save")
    ├── Textarea Konten → emit("save")
    ├── Input To-Do Baru → emit("add-todo", text)
    ├── Checkbox To-Do → emit("save")
    └── Tombol Hapus To-Do → emit("delete-todo", id)
```

Semua state dikelola di `App.vue` dan diteruskan ke komponen anak melalui **props**. Komponen anak berkomunikasi balik ke parent melalui **emit events**.

---

## 🛠️ IDE yang Direkomendasikan

- [VS Code](https://code.visualstudio.com/) + Extension [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-vue)

---

## 📄 Lisensi

Project ini dibuat untuk keperluan pribadi dan pembelajaran. Silakan gunakan dan modifikasi sesuai kebutuhan.

---

<p align="center">
  Dibuat dengan 💚 oleh <strong>Asidiq</strong>
</p>
