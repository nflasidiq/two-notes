# 📝 To-List-an

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
| 📄 **Buat & Kelola Catatan** | Tambah, kunjungi, dan kelola berbagai file catatan dengan mudah. |
| ↔️ **Draggable Resizer Sidebar** | Ukuran lebar sidebar bisa diatur secara dinamis dengan menggeser garis pemisah (antara 200px hingga 480px) dan otomatis tersimpan di penyimpanan lokal. |
| 🗂️ **Sidebar Buka/Tutup (Collapsible)** | Sembunyikan sidebar untuk tampilan menulis penuh (Full Main Area) dengan transisi animasi yang mulus. |
| 📱 **Responsive & Auto-fit Layout** | Area utama (Main Area) yang responsif dan menyesuaikan ukuran secara dinamis tanpa merusak UI saat window desktop dikecilkan atau sidebar digeser. |
| ⋮ **Menu Opsi Catatan (3 Titik)** | Setiap catatan memiliki opsi terpisah untuk mengedit nama secara inline atau menghapus catatan. |
| ✏️ **Edit Nama Catatan Terfokus** | Klik "Edit Nama" dari menu opsi untuk mengganti nama secara inline dengan fokus input dan ring indikator yang rapi. |
| ⚠️ **Modal Konfirmasi Hapus** | Menghapus catatan lebih aman dengan adanya jendela popup konfirmasi agar tidak terhapus secara tidak sengaja. |
| ✍️ **Catatan Teks & To-Do List** | Tulis teks panjang sekaligus catat tugas harian menggunakan checklist interaktif di setiap catatan. |
| 💾 **Penyimpanan Lokal (Offline)** | Data catatan dan preferensi lebar sidebar tersimpan otomatis secara aman di `localStorage`. |
| 🖥️ **Aplikasi Desktop** | Berjalan secara native sebagai aplikasi desktop cross-platform melalui Electron. |

---

## 📸 Preview

> Jalankan aplikasi untuk menikmati workspace menulis yang minimalis dengan dark mode bernuansa emerald green, sidebar resizable, menu interaktif, dan to-do list ceklis.

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
│   │   ├── Sidebar.vue        # Sidebar: daftar catatan, resizer, menu opsi (3 titik), modal hapus
│   │   └── MainArea.vue       # Area utama: editor teks responsif & to-do list
│   ├── App.vue                # Root component: state management (width, toggle, notes)
│   ├── main.ts                # Entry point Vue app
│   ├── style.css              # Global styles + Tailwind directives
│   └── vite-env.d.ts          # Vite type declarations (Vue module definitions)
├── index.html                 # HTML entry point (favicon set ke app-icon.ico)
├── vite.config.ts             # Konfigurasi Vite + Electron plugin
├── tailwind.config.js         # Konfigurasi Tailwind (custom colors & utilities)
├── tsconfig.json              # Konfigurasi TypeScript (baseUrl & paths support)
├── electron-builder.json5     # Konfigurasi build Electron (custom app-icon.ico)
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

Hasil build executable (.exe, dll.) akan tersedia di folder `release/` dan dikemas menggunakan Electron Builder.

---

## 🧩 Arsitektur Komponen

```
App.vue (State Manager)
├── Sidebar.vue
│   ├── Tombol "+ Baru" → emit("create-note")
│   ├── List Catatan (Bisa di-klik namanya) → emit("select-note", id)
│   ├── Draggable Divider → Mengubah lebar sidebar & simpan ke localStorage
│   ├── Tombol "Tutup" (Panel Icon) → emit("toggle-sidebar")
│   └── Dropdown Menu (3 Titik)
│       ├── Opsi "Edit Nama" → mengaktifkan input inline nama catatan
│       └── Opsi "Hapus Catatan" → memunculkan Modal Konfirmasi → emit("delete-note", id)
│
└── MainArea.vue
    ├── Tombol Hamburger (☰) → muncul saat sidebar ditutup → emit("toggle-sidebar")
    ├── Input Judul Catatan & Textarea Konten (Auto-resize & responsive)
    ├── Input To-Do Baru → emit("add-todo", text)
    ├── Checkbox To-Do → emit("save")
    └── Tombol Hapus To-Do → emit("delete-todo", id)
```

Semua state utama (daftar catatan, status toggle sidebar, lebar sidebar) dikelola di `App.vue` dan diteruskan ke komponen anak melalui **props**. Komponen anak mengirimkan aksi kembali ke parent menggunakan **emit events**.

---

## 🛠️ IDE yang Direkomendasikan

- [VS Code](https://code.visualstudio.com/) + Extension [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-vue) (menggantikan Volar lama untuk performa lebih baik dan bebas error base path).

---

## 📄 Lisensi

Project ini dibuat untuk keperluan pribadi dan pembelajaran. Silakan gunakan dan modifikasi sesuai kebutuhan.

---

<p align="center">
  Dibuat dengan 💚 oleh <strong>Asidiq</strong>
</p>
