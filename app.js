/**
 * app.js - Business Logic for Pusaka Notebook
 * Branded for: Pusaka Media ID (pusakamediaid-dotcom)
 */

// LocalStorage Keys (matching TextVault schema style)
const STORAGE_KEYS = {
  DOCUMENTS: "textvault_documents",
  THEME: "textvault_theme",
  ACTIVE_DOC: "textvault_active_doc",
  SORT_BY: "textvault_sort_by",
  SORT_DIR: "textvault_sort_dir"
};

// Document Formats and Extensions Mapping
const FORMATS_INFO = {
  plaintext: { label: "Plain Text", ext: ".txt", icon: "file-text" },
  markdown: { label: "Markdown", ext: ".md", icon: "book-open" },
  html: { label: "HTML", ext: ".html", icon: "code" },
  javascript: { label: "JavaScript", ext: ".js", icon: "braces" },
  python: { label: "Python", ext: ".py", icon: "terminal" },
  json: { label: "JSON", ext: ".json", icon: "file-json" },
  css: { label: "CSS", ext: ".css", icon: "palette" }
};

// Global State
let documents = [];
let activeDocId = null;
let currentTheme = "light";
let sortBy = "updatedAt";
let sortDirection = "desc";
let showPreview = false;
let autoSaveTimeout = null;

// Template contents for new documents
const FORMAT_TEMPLATES = {
  plaintext: `Pusaka Notebook - Berkas Teks Polos

Selamat datang di Pusaka Notebook! 
Ini adalah editor teks polos minimalis tempat Anda dapat merancang teks, draft artikel, atau catatan cepat.

Fitur Utama:
- Tersimpan otomatis secara real-time
- Ekspor berkas dalam bentuk TXT, HTML, atau PDF
- Pencarian dan pengurutan catatan yang ringkas

Didukung sepenuhnya oleh Pusaka Media ID.`,

  markdown: `# Selamat Datang di Pusaka Notebook 👋

Ini adalah dokumen **Markdown** interaktif Anda. Anda dapat menulis format teks kaya di sini dan melihat hasilnya langsung menggunakan tombol **Pratinjau** di kanan atas!

## Apa yang Bisa Anda Lakukan?

1. **Format Teks**: Tebal (**bold**), miring (*italic*), atau ~~dicoret~~.
2. **Daftar Tugas**:
   - [x] Pelajari fitur Pusaka Notebook
   - [ ] Buat catatan ebook premium
   - [ ] Push kode ke GitHub Note Book
3. **Blok Kode**:
\`\`\`javascript
// JavaScript interaktif
const author = "Pusaka Media ID";
console.log(\`Selamat berkarya bersama \${author}!\`);
\`\`\`

> "Masa depan produk digital ada di tangan kreativitas Anda sendiri." — Pusaka Media ID`,

  html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Landing Page Pusaka Media ID</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-align: center;
      padding: 50px;
      background: #fafafa;
      color: #333;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      padding: 30px;
      max-width: 500px;
      margin: 0 auto;
    }
    h1 { color: #f97316; }
    p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Pusaka Media ID</h1>
    <p>Kreator produk digital, ebook premium, dan sistem AI praktis. Membangun starter kit berkualitas tinggi untuk akselerasi masa depan digital Anda.</p>
  </div>
</body>
</html>`,

  javascript: `// JavaScript Playground - Pusaka Notebook
// Nikmati kemudahan menulis skrip langsung di browser Anda.

function hitungDiskonProduk(hargaAsli, persentaseDiskon) {
    const nilaiDiskon = hargaAsli * (persentaseDiskon / 100);
    const hargaAkhir = hargaAsli - nilaiDiskon;
    
    return {
        brand: "Pusaka Media ID",
        hargaAwal: \`Rp \${hargaAsli.toLocaleString('id-ID')}\`,
        diskon: \`\${persentaseDiskon}%\`,
        potongan: \`Rp \${nilaiDiskon.toLocaleString('id-ID')}\`,
        hargaBayar: \`Rp \${hargaAkhir.toLocaleString('id-ID')}\`
    };
}

// Simulasi diskon Paket Ebook Premium
const hasilDiskon = hitungDiskonProduk(150000, 30);
console.log(JSON.stringify(hasilDiskon, null, 2));`,

  python: `# Python Script - Pusaka Notebook
# Kode Anda bersih, ringkas, dan mudah dibaca.

class PusakaMediaID:
    def __init__(self):
        self.brand = "Pusaka Media ID"
        self.layanan = ["Ebook Premium", "Starter Kit AI", "Website Desain"]

    def sapa_pangguna(self):
        print(f"Selamat datang di {self.brand}!")
        print("Solusi digital praktis untuk pengembangan karir dan teknologi Anda.")

if __name__ == "__main__":
    pusaka = PusakaMediaID()
    pusaka.sapa_pangguna()`,

  json: `{
  "app_name": "Pusaka Notebook",
  "version": "1.0.0",
  "description": "Premium text and code editing workspace in browser",
  "author": {
    "organization": "Pusaka Media ID",
    "email": "pusaka.media.id@gmail.com",
    "github": "https://github.com/pusakamediaid-dotcom"
  },
  "features": [
    "Auto-save to LocalStorage",
    "Interactive Live Markdown Rendering",
    "One-click PDF Print Export",
    "Branded Material Styling with Tailwind"
  ]
}`,

  css: `/* Stylesheet - Pusaka Notebook */

body {
  margin: 0;
  padding: 0;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
}

/* Gradient text signature style */
.brand-signature {
  background: linear-gradient(to right, #f59e0b, #ea580c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}`
};

// Initial setup on DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  loadData();
  bindEvents();
  renderApp();
  lucide.createIcons();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme === "dark") {
    currentTheme = "dark";
    document.documentElement.classList.add("dark");
  } else {
    currentTheme = "light";
    document.documentElement.classList.remove("dark");
  }
}

function toggleTheme() {
  if (currentTheme === "light") {
    currentTheme = "dark";
    document.documentElement.classList.add("dark");
  } else {
    currentTheme = "light";
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
}

// Load Documents from LocalStorage
function loadData() {
  // Load sorting options
  sortBy = localStorage.getItem(STORAGE_KEYS.SORT_BY) || "updatedAt";
  sortDirection = localStorage.getItem(STORAGE_KEYS.SORT_DIR) || "desc";
  
  // Set UI controls for sorting
  const sortDirOption = document.querySelector(`input[name="sort-dir"][value="${sortDirection}"]`);
  if (sortDirOption) sortDirOption.checked = true;
  
  const sortButtons = {
    updatedAt: document.getElementById("sort-by-updated"),
    createdAt: document.getElementById("sort-by-created"),
    title: document.getElementById("sort-by-name")
  };
  
  Object.keys(sortButtons).forEach(key => {
    if (sortButtons[key]) {
      if (key === sortBy) {
        sortButtons[key].className = "py-1.5 px-2 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 text-left font-medium";
      } else {
        sortButtons[key].className = "py-1.5 px-2 rounded-lg bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent text-slate-600 dark:text-slate-400 text-left";
      }
    }
  });

  // Load documents
  try {
    const rawDocs = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (rawDocs) {
      documents = JSON.parse(rawDocs);
    } else {
      // Create initial dummy documents for Pusaka Media ID
      documents = getInitialDocs();
      saveDocumentsToStorage();
    }
  } catch (e) {
    documents = getInitialDocs();
  }

  // Load active doc
  activeDocId = localStorage.getItem(STORAGE_KEYS.ACTIVE_DOC) || null;
  if (activeDocId && !documents.find(d => d.id === activeDocId)) {
    activeDocId = documents.length > 0 ? documents[0].id : null;
  }
}

// Initial default docs on fresh install
function getInitialDocs() {
  const now = new Date().toISOString();
  return [
    {
      id: "doc-welcome-md",
      title: "Selamat Datang.md",
      content: FORMAT_TEMPLATES.markdown,
      format: "markdown",
      createdAt: now,
      updatedAt: now
    },
    {
      id: "doc-sample-py",
      title: "Skrip Pengenalan.py",
      content: FORMAT_TEMPLATES.python,
      format: "python",
      createdAt: now,
      updatedAt: now
    }
  ];
}

function saveDocumentsToStorage() {
  localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
}

// Event Bindings
function bindEvents() {
  // Theme toggle click
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  // New Note buttons
  document.getElementById("btn-new-note").addEventListener("click", createNewNote);
  document.getElementById("btn-create-first").addEventListener("click", createNewNote);

  // Search input
  document.getElementById("search-input").addEventListener("input", renderDocumentList);

  // Sort toggle panel trigger
  document.getElementById("sort-toggle").addEventListener("click", () => {
    document.getElementById("sort-panel").classList.toggle("hidden");
  });
  document.getElementById("btn-close-sort").addEventListener("click", () => {
    document.getElementById("sort-panel").classList.add("hidden");
  });

  // Sort metric handlers
  document.getElementById("sort-by-updated").addEventListener("click", () => updateSortMetric("updatedAt"));
  document.getElementById("sort-by-created").addEventListener("click", () => updateSortMetric("createdAt"));
  document.getElementById("sort-by-name").addEventListener("click", () => updateSortMetric("title"));

  // Sort direction handlers
  document.querySelectorAll('input[name="sort-dir"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
      sortDirection = e.target.value;
      localStorage.setItem(STORAGE_KEYS.SORT_DIR, sortDirection);
      renderDocumentList();
    });
  });

  // Editor Inputs Auto-Save on typing
  document.getElementById("doc-title-input").addEventListener("input", handleTitleInput);
  document.getElementById("editor-textarea").addEventListener("input", handleTextareaInput);
  
  // Format select box change
  document.getElementById("doc-format-select").addEventListener("change", handleFormatChange);

  // Copy Code button
  document.getElementById("btn-copy-code").addEventListener("click", handleCopyCode);

  // Preview Toggle Button
  document.getElementById("btn-toggle-preview").addEventListener("click", togglePreviewMode);

  // Export dropdown trigger
  const exportBtn = document.getElementById("btn-export-dropdown");
  const exportMenu = document.getElementById("export-menu");
  
  exportBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    exportMenu.classList.toggle("hidden");
  });

  // Close dropdown on click outside
  document.addEventListener("click", () => {
    exportMenu.classList.add("hidden");
  });

  // Export action handlers
  document.getElementById("export-raw").addEventListener("click", exportRawFile);
  document.getElementById("export-html").addEventListener("click", exportHTMLFile);
  document.getElementById("export-pdf").addEventListener("click", exportToPDF);

  // Delete Document button
  document.getElementById("btn-delete-doc").addEventListener("click", deleteActiveDoc);

  // Keyboard Shortcuts (Ctrl + S Save and Ctrl + N New)
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      forceTriggerSave();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      createNewNote();
    }
  });
}

// Sorting logic helpers
function updateSortMetric(metric) {
  sortBy = metric;
  localStorage.setItem(STORAGE_KEYS.SORT_BY, sortBy);
  
  // Update button highlights
  const sortButtons = {
    updatedAt: document.getElementById("sort-by-updated"),
    createdAt: document.getElementById("sort-by-created"),
    title: document.getElementById("sort-by-name")
  };
  
  Object.keys(sortButtons).forEach(key => {
    if (sortButtons[key]) {
      if (key === sortBy) {
        sortButtons[key].className = "py-1.5 px-2 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 text-left font-medium";
      } else {
        sortButtons[key].className = "py-1.5 px-2 rounded-lg bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent text-slate-600 dark:text-slate-400 text-left";
      }
    }
  });

  renderDocumentList();
}

// Business Functions
function renderApp() {
  renderDocumentList();
  renderActiveDocument();
}

// Render left document list panel
function renderDocumentList() {
  const docListContainer = document.getElementById("document-list");
  const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();
  
  // Filter docs based on search
  let filteredDocs = [...documents];
  if (searchQuery) {
    filteredDocs = filteredDocs.filter(d => 
      d.title.toLowerCase().includes(searchQuery) || 
      d.content.toLowerCase().includes(searchQuery)
    );
  }

  // Sort docs
  filteredDocs.sort((a, b) => {
    let itemA = a[sortBy];
    let itemB = b[sortBy];
    
    if (sortBy === "title") {
      itemA = itemA.toLowerCase();
      itemB = itemB.toLowerCase();
    }

    if (itemA < itemB) return sortDirection === "desc" ? 1 : -1;
    if (itemA > itemB) return sortDirection === "desc" ? -1 : 1;
    return 0;
  });

  // Render HTML list
  if (filteredDocs.length === 0) {
    docListContainer.innerHTML = `
      <div class="text-center py-12 text-slate-400 text-sm">
        <i data-lucide="search-code" class="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-300"></i>
        Tidak ada catatan yang cocok
      </div>`;
    lucide.createIcons();
    return;
  }

  docListContainer.innerHTML = filteredDocs.map(doc => {
    const isActive = doc.id === activeDocId;
    const formatInfo = FORMATS_INFO[doc.format] || FORMATS_INFO.plaintext;
    const formattedDate = new Date(doc.updatedAt).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    return `
      <div data-doc-id="${doc.id}" class="doc-item group p-3 rounded-xl flex items-start gap-3 cursor-pointer transition-all-200 ${
        isActive 
          ? "bg-orange-500/10 border border-orange-500/20 text-orange-950 dark:text-orange-300" 
          : "border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-300"
      }">
        <div class="w-8 h-8 rounded-lg ${isActive ? "bg-orange-500 text-white" : "bg-slate-100 dark:bg-slate-900 text-slate-400"} flex items-center justify-center shrink-0">
          <i data-lucide="${formatInfo.icon}" class="w-4.5 h-4.5"></i>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-sm truncate leading-snug">${doc.title || "Untitled Document"}</h4>
          <span class="text-[10px] text-slate-400 block mt-0.5">${formattedDate}</span>
        </div>
      </div>
    `;
  }).join("");

  // Add click listeners to items
  document.querySelectorAll(".doc-item").forEach(item => {
    item.addEventListener("click", () => {
      const docId = item.getAttribute("data-doc-id");
      selectDocument(docId);
    });
  });

  lucide.createIcons();
}

// Select active document
function selectDocument(id) {
  activeDocId = id;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_DOC, id);
  showPreview = false; // Reset preview on document change
  
  renderDocumentList();
  renderActiveDocument();
}

// Render editor area details based on active document
function renderActiveDocument() {
  const landingView = document.getElementById("landing-view");
  const editorView = document.getElementById("editor-view");

  if (!activeDocId) {
    landingView.classList.remove("hidden");
    editorView.classList.add("hidden");
    return;
  }

  const doc = documents.find(d => d.id === activeDocId);
  if (!doc) {
    activeDocId = null;
    landingView.classList.remove("hidden");
    editorView.classList.add("hidden");
    return;
  }

  // Show Editor
  landingView.classList.add("hidden");
  editorView.classList.remove("hidden");

  // Populate data
  document.getElementById("doc-title-input").value = doc.title;
  document.getElementById("editor-textarea").value = doc.content;
  document.getElementById("doc-format-select").value = doc.format;
  
  const createdDate = new Date(doc.createdAt).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.getElementById("doc-meta-date").innerText = `Dibuat: ${createdDate}`;

  // Update Icon tag beside rename
  const formatInfo = FORMATS_INFO[doc.format] || FORMATS_INFO.plaintext;
  const docIcon = document.getElementById("doc-icon");
  docIcon.innerText = doc.format === "plaintext" ? "TXT" : doc.format.slice(0, 3).toUpperCase();
  
  // Show/Hide live preview button depending on format (Only for MD and HTML)
  const previewToggleBtn = document.getElementById("btn-toggle-preview");
  if (doc.format === "markdown" || doc.format === "html") {
    previewToggleBtn.classList.remove("hidden");
  } else {
    previewToggleBtn.classList.add("hidden");
    showPreview = false; // Force hide preview for non-previewable formats
  }

  updatePreviewState();
  lucide.createIcons();
}

// Create new note
function createNewNote() {
  const now = new Date().toISOString();
  const format = "plaintext"; // default new document is plain text
  const id = "doc-" + Math.random().toString(36).substr(2, 9);
  
  const newDoc = {
    id: id,
    title: "Catatan Baru.txt",
    content: FORMAT_TEMPLATES[format],
    format: format,
    createdAt: now,
    updatedAt: now
  };

  documents.unshift(newDoc);
  saveDocumentsToStorage();
  
  activeDocId = id;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_DOC, id);
  
  showPreview = false;
  
  renderApp();
  showToast("Catatan baru berhasil dibuat!");
  
  // Focus editor title input immediately
  setTimeout(() => {
    document.getElementById("doc-title-input").focus();
    document.getElementById("doc-title-input").select();
  }, 100);
}

// Title changed event
function handleTitleInput(e) {
  if (!activeDocId) return;
  const newTitle = e.target.value.trim() || "Untitled Document";
  
  // Find active doc
  const doc = documents.find(d => d.id === activeDocId);
  if (doc) {
    doc.title = newTitle;
    doc.updatedAt = new Date().toISOString();
    triggerAutoSave();
  }
}

// Textarea value changed event
function handleTextareaInput(e) {
  if (!activeDocId) return;
  const content = e.target.value;
  
  // Find active doc
  const doc = documents.find(d => d.id === activeDocId);
  if (doc) {
    doc.content = content;
    doc.updatedAt = new Date().toISOString();
    triggerAutoSave();
    
    // Live update preview if active
    if (showPreview) {
      updatePreviewContent();
    }
  }
}

// Format drop down changed event
function handleFormatChange(e) {
  if (!activeDocId) return;
  const newFormat = e.target.value;
  
  const doc = documents.find(d => d.id === activeDocId);
  if (doc) {
    const oldFormat = doc.format;
    doc.format = newFormat;
    
    // Auto-rename extension if present in title
    let title = doc.title;
    const oldInfo = FORMATS_INFO[oldFormat];
    const newInfo = FORMATS_INFO[newFormat];
    
    if (oldInfo && newInfo && title.endsWith(oldInfo.ext)) {
      title = title.substring(0, title.length - oldInfo.ext.length) + newInfo.ext;
      doc.title = title;
      document.getElementById("doc-title-input").value = title;
    }
    
    // Load format templates if content is empty or standard default
    if (doc.content === FORMAT_TEMPLATES[oldFormat] || doc.content.trim() === "") {
      doc.content = FORMAT_TEMPLATES[newFormat];
      document.getElementById("editor-textarea").value = doc.content;
    }

    doc.updatedAt = new Date().toISOString();
    triggerAutoSave();
    renderApp();
  }
}

// Toggle Live Preview Panel
function togglePreviewMode() {
  showPreview = !showPreview;
  updatePreviewState();
}

function updatePreviewState() {
  const textPane = document.getElementById("textarea-pane");
  const divider = document.getElementById("preview-divider");
  const previewPane = document.getElementById("preview-pane");
  const toggleBtn = document.getElementById("btn-toggle-preview");

  if (showPreview) {
    // Show split screen layout
    divider.classList.remove("hidden");
    previewPane.classList.remove("hidden");
    toggleBtn.classList.add("bg-orange-500/10", "text-orange-600", "border-orange-500/20");
    updatePreviewContent();
  } else {
    // Fullscreen editor
    divider.classList.add("hidden");
    previewPane.classList.add("hidden");
    toggleBtn.classList.remove("bg-orange-500/10", "text-orange-600", "border-orange-500/20");
  }
}

// Render content of Markdown/HTML in real time
function updatePreviewContent() {
  const doc = documents.find(d => d.id === activeDocId);
  if (!doc) return;

  const outputContainer = document.getElementById("preview-output");
  const placeholder = document.getElementById("preview-placeholder");

  if (!doc.content || doc.content.trim() === "") {
    outputContainer.classList.add("hidden");
    placeholder.classList.remove("hidden");
    return;
  }

  placeholder.classList.add("hidden");
  outputContainer.classList.remove("hidden");

  if (doc.format === "markdown") {
    // Parse Markdown
    outputContainer.innerHTML = marked.parse(doc.content);
  } else if (doc.format === "html") {
    // Safely render HTML in sandbox style or just inject
    outputContainer.innerHTML = `<div class="p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-auto">${doc.content}</div>`;
  }
}

// Debounced auto-save handler
function triggerAutoSave() {
  const indicator = document.getElementById("auto-save-indicator");
  indicator.innerHTML = `<i data-lucide="loader-2" class="w-3.5 h-3.5 inline animate-spin"></i> Menyimpan...`;
  lucide.createIcons();

  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    saveDocumentsToStorage();
    renderDocumentList();
    
    indicator.innerHTML = `<i data-lucide="cloud-check" class="w-3.5 h-3.5 inline text-emerald-500"></i> Tersimpan otomatis`;
    lucide.createIcons();
  }, 800);
}

// Manual immediate save triggers
function forceTriggerSave() {
  clearTimeout(autoSaveTimeout);
  saveDocumentsToStorage();
  renderDocumentList();
  
  const indicator = document.getElementById("auto-save-indicator");
  indicator.innerHTML = `<i data-lucide="cloud-check" class="w-3.5 h-3.5 inline text-emerald-500"></i> Disimpan manual`;
  lucide.createIcons();
  
  showToast("Catatan Anda berhasil disimpan!");
}

// Copy Document Content to Clipboard
function handleCopyCode() {
  const textarea = document.getElementById("editor-textarea");
  textarea.select();
  document.execCommand("copy");
  
  // Alert visual
  showToast("Konten berhasil disalin!");
}

// Delete Active Document
function deleteActiveDoc() {
  if (!activeDocId) return;
  
  const doc = documents.find(d => d.id === activeDocId);
  if (!doc) return;

  if (confirm(`Apakah Anda yakin ingin menghapus catatan "${doc.title}"?`)) {
    documents = documents.filter(d => d.id !== activeDocId);
    saveDocumentsToStorage();
    
    activeDocId = documents.length > 0 ? documents[0].id : null;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_DOC, activeDocId || "");
    
    renderApp();
    showToast("Catatan berhasil dihapus!");
  }
}

// Visual Toast System
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  
  toastMsg.innerText = message;
  toast.classList.remove("translate-y-20", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-20", "opacity-0");
  }, 2500);
}

// EXPORTS UTILITIES

// 1. Export Raw format download
function exportRawFile() {
  const doc = documents.find(d => d.id === activeDocId);
  if (!doc) return;

  const ext = FORMATS_INFO[doc.format]?.ext || ".txt";
  const blob = new Blob([doc.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.title.endsWith(ext) ? doc.title : doc.title + ext}`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
  showToast("File berhasil diunduh!");
}

// 2. Export HTML format
function exportHTMLFile() {
  const doc = documents.find(d => d.id === activeDocId);
  if (!doc) return;

  const titleHtml = doc.title;
  const contentHtml = doc.content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
  const template = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titleHtml}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 24px;
      color: #1e293b;
      line-height: 1.65;
      background: #f8fafc;
    }
    .wrapper {
      background: #ffffff;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      border: 1px solid #e2e8f0;
    }
    h1 {
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 12px;
      color: #0f172a;
      margin-top: 0;
    }
    .meta {
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 24px;
    }
    pre {
      background: #0f172a;
      color: #e2e8f0;
      padding: 20px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 14px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #f1f5f9;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <h1>${titleHtml}</h1>
    <div class="meta">Format: ${doc.format.toUpperCase()} | Dibuat: ${new Date(doc.createdAt).toLocaleDateString()}</div>
    <pre><code>${contentHtml}</code></pre>
    <div class="footer">
      Diekspor dari Pusaka Notebook &mdash; Pusaka Media ID
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([template], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `${doc.title.replace(/\.[^/.]+$/, "")}.html`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
  showToast("Berkas HTML berhasil diekspor!");
}

// 3. Print / Save as PDF (Utilizing identical print strategy as TextVault's window.print inside subwindow)
function exportToPDF() {
  const doc = documents.find(d => d.id === activeDocId);
  if (!doc) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast("Gagal membuka jendela cetak. Izinkan pop-up panyungsi Anda.");
    return;
  }

  // Format pre HTML code
  const escapedContent = doc.content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")
    .replace(/ {2}/g, "&nbsp;&nbsp;");

  const printedHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${doc.title}</title>
      <style>
        @page { margin: 2cm; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
          color: #1e293b;
          line-height: 1.7;
          font-size: 13px;
          max-width: 100%;
          padding: 0;
          margin: 0;
        }
        .header {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }
        .header h1 {
          font-size: 24px;
          margin: 0 0 6px 0;
          color: #0f172a;
          font-weight: 700;
        }
        .header .meta {
          font-size: 11px;
          color: #64748b;
        }
        .content {
          font-family: 'Consolas', 'Courier New', monospace;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-size: 12px;
          line-height: 1.6;
          color: #334155;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          font-size: 10px;
          color: #94a3b8;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${doc.title}</h1>
        <div class="meta">
          Format: ${doc.format.toUpperCase()} &nbsp;|&nbsp;
          Dibuat: ${new Date(doc.createdAt).toLocaleDateString("id-ID")} &nbsp;|&nbsp;
          Diperbarui: ${new Date(doc.updatedAt).toLocaleDateString("id-ID")}
        </div>
      </div>
      <div class="content">${escapedContent}</div>
      <div class="footer">
        Diekspor dari Pusaka Notebook &mdash; Pusaka Media ID &mdash; ${new Date().toLocaleDateString("id-ID")} ${new Date().toLocaleTimeString("id-ID")}
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(printedHtml);
  printWindow.document.close();
  
  // Delay slightly to load and then call Print
  setTimeout(() => {
    printWindow.print();
  }, 400);

  showToast("Layar cetak/PDF dibuka!");
}
