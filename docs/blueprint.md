# 🗺️ Arsitektur Blueprint: Smart Content Purifier & Summary Hub

Proyek ini dirancang sebagai sistem pemrosesan teks hibrida (Hybrid Text Processing) yang menggabungkan metode pembersihan lokal (heuristic-based regex) dengan model pemrosesan bahasa alami (LLM API / HuggingFace Transformers) untuk mengubah teks mentah menjadi produk digital berkualitas tinggi.

```
+--------------------+
| 1. Raw Text Input  |  --> Transkrip Kasar, Catatan Acak, Salinan Web
+--------------------+
          |
          v
+--------------------+
| 2. Text Cleaner    |  --> regex, pembersihan spasi, penghapusan tag HTML (lokal)
+--------------------+
          |
          v
+--------------------+
| 3. AI Processor    |  --> API LLM (OpenAI) / Heuristic Fallback
+--------------------+
          |
          v
+--------------------+
| 4. Exporter Engine |  --> Formatter Markdown, JSON, Text
+--------------------+
          |
          v
+--------------------+
| 5. Output Preview  |  --> Antarmuka Gradio (HuggingFace Spaces)
+--------------------+
```

## Detail Komponen

1. **Text Cleaner (`core/cleaner.py`)**: Bertanggung jawab membuang sampah teks (noise) seperti timestamp transkrip, halaman metadata, spasi ganda, tag HTML, dan duplikasi baris kosong. Berjalan cepat secara lokal tanpa biaya komputasi API.
2. **Content Processor (`core/processor.py`)**: Otak pengolah teks. Mengatur mode pemrosesan (rangkuman eksekutif, poin penting, bab ebook, catatan studi). Menggunakan fallback berbasis aturan lokal yang cerdas jika tidak ada koneksi API.
3. **Content Exporter (`core/exporter.py`)**: Mengemas teks hasil pemrosesan ke dalam format akhir yang siap dikonsumsi oleh pengguna atau sistem eksternal (Markdown, JSON Schema, Plaintext).
