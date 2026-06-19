---
title: Smart Content Purifier & Summary Hub
emoji: 📚
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 4.44.0
python_version: 3.11
app_file: app.py
pinned: false
license: mit
---

# 📚 Smart Content Purifier & Summary Hub

Aplikasi AI praktis untuk membersihkan, meringkas, dan mengubah teks mentah menjadi konten siap pakai berkualitas tinggi untuk ebook, catatan belajar, caption media sosial, dan produk digital berharga lainnya.

Proyek ini dibangun menggunakan **Python** dan kerangka kerja antarmuka **Gradio**, yang dirancang agar sangat portabel, aman, dan dapat dideploy dengan mudah di **HuggingFace Spaces**.

---

## 🌐 Live Demo & Website Portofolio

Aplikasi interaktif notebook portofolio ini dapat diakses secara langsung melalui tautan publik berikut:

1. **GitHub Pages (Static Notebook UI)**:  
   👉 **[https://pusakamediaid-dotcom.github.io/Note-Book/](https://pusakamediaid-dotcom.github.io/Note-Book/)**

2. **Hugging Face Spaces (Interactive AI App)**:  
   👉 **[https://huggingface.co/spaces/pusakamediaid123/note-book-smart-content-purifier](https://huggingface.co/spaces/pusakamediaid123/note-book-smart-content-purifier)**

---

## 🚀 Fitur Utama

- **🧹 Heuristic Text Cleaner**: Membersihkan draf tulisan kotor, transkrip video otomatis, atau salinan web berantakan dari tag HTML gantung, timestamp log `[00:00:00]`, metadata berlebih, spasi ganda, dan baris kosong ganda secara lokal.
- **🧠 Hybrid AI Processing Modes**:
  - *Executive Summary*: Rangkuman eksekutif ringkas untuk menyaring argumen inti.
  - *Bullet Points Extract*: Ekstraksi butir-butir poin penting tindakan (actionable insights).
  - *Ebook Chapter Drafting*: Merestrukturisasi catatan mentah yang acak menjadi draf struktur bab ebook yang terorganisir.
- **📂 Multi-Format Exporter Engine**: Mengekspor hasil akhir ke dalam format standar Markdown (`.md`), Plaintext (`.txt`), atau payload skema JSON (`.json`) yang siap diintegrasikan dengan database eksternal.
- **💻 Demo Interface Modern**: Antarmuka interaktif responsif berbasis Gradio dengan pengaturan parameter lanjutan seperti penyesuaian slider panjang rangkuman minimum/maksimum.

---

## 🛠️ Struktur Repositori

Repositori portofolio ini dirancang agar sangat modular, bersih, dan mudah dipahami:

```text
Note-Book/
├── app.py                 # Titik masuk aplikasi utama (Antarmuka Gradio UI)
├── requirements.txt       # Kebutuhan library Python (Gradio, dll.)
├── LICENSE                # Lisensi MIT resmi
├── core/                  # Folder Logika Inti Aplikasi
│   ├── __init__.py        # Inisialisasi package core
│   ├── cleaner.py         # Penghapusan noise teks dan standardisasi baris
│   ├── processor.py       # Pemrosesan AI dan logika Heuristic Fallback
│   └── exporter.py        # Pemformatan akhir (Markdown, JSON, Plaintext)
├── config/                # Konfigurasi Aplikasi
│   ├── __init__.py
│   └── modes.py           # Daftar mode pemrosesan dan format ekspor
├── examples/              # Contoh Berkas Penggunaan
│   ├── sample_input.txt   # Teks mentah berantakan sebelum dibersihkan
│   └── sample_output.md   # Hasil akhir rapi dalam format Markdown (.md)
└── docs/                  # Dokumentasi Lengkap Proyek
    ├── blueprint.md       # Desain arsitektur sistem dan diagram alur
    ├── roadmap.md         # Rencana peta jalan pengembangan ke depan
    └── changelog.md       # Riwayat pembaruan dan rilis versi
```

---

## 🔌 Cara Menjalankan Aplikasi Secara Lokal

### Prasyarat
Pastikan komputer Anda sudah terinstal **Python 3.8** atau versi yang lebih tinggi.

### Langkah-langkah
1. **Kloning Repositori**:
   ```bash
   git clone https://github.com/pusakamediaid-dotcom/Note-Book.git
   cd Note-Book
   ```

2. **Instal Dependensi**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Jalankan Aplikasi**:
   ```bash
   python app.py
   ```

4. **Buka Browser**:
   Akses aplikasi secara visual melalui tautan lokal berikut:  
   👉 `http://localhost:7860`

---

## 🎯 Peta Jalan Pengembangan (Roadmap) Singkat

- [x] Rilis awal struktur modular portofolio dan fungsionalitas pembersihan lokal.
- [ ] Integrasi API OpenAI (`gpt-4o-mini`) dan HuggingFace Inference API lokal gratis.
- [ ] Implementasi pengunggahan file langsung (`.docx`, `.pdf`, `.txt`).
- [ ] Deployment instan demo ke platform **HuggingFace Spaces**.

---

Sistem Aplikasi oleh **[Pusaka Media ID](https://github.com/pusakamediaid-dotcom)**
Dibuat dengan dedikasi tinggi untuk portofolio kreator digital yang terstruktur dan berdampak.
