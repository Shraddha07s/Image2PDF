# 📄 PAGEFORGE - Professional Desktop Image to PDF Studio

> **Craft beautiful PDFs from your images.**  
> *Private. Fast. Offline. No uploads required.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind%20%7C%20Geist-61DAFB)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Flask%20%7C%20Pillow%20%7C%20img2pdf-000000)](https://flask.palletsprojects.com/)

**PAGEFORGE** is a handcrafted, professional-grade desktop workspace application for assembling, reordering, rotating, and forging high-quality PDF documents from image assets (JPG, JPEG, PNG, WEBP). 

Designed with the aesthetic precision of tools like **Figma, Linear, Notion, Raycast, and Adobe Lightroom**, PageForge avoids generic AI templates and provides a timeless, dark-mode `#0D1117` IDE experience.

---

## ✨ Design & Features

- 🖥️ **Professional Desktop IDE Layout**:
  - **Left Panel (Image Library)**: Page list with thumbnails, drag-and-drop handles, rotation, page numbers, duplicate action, delete action, and pinned "+ Add Images" button.
  - **Center Area (Live PDF Canvas)**: Real paper sheet simulation with soft drop shadow, mouse wheel zoom, zoom controls (+ / - / 100%), page navigation arrows, and a handcrafted paper stack empty state.
  - **Right Panel (PDF Settings)**: Grouped segmented controls for Document, Page, Compression, and Security.
  - **Bottom Status Bar**: Desktop software status bar showing Ready status (`Ready ✓`), image count, estimated PDF size, compression %, and local engine status.
- ⚡ **Drag & Drop Upload**: Drop images anywhere onto the workspace canvas or sidebar.
- 🔄 **Reordering & Page Actions**: Sort pages via `@dnd-kit`, duplicate pages, rotate individual pages by 90°, 180°, or 270°.
- ⚙️ **Segmented Layout Controls**:
  - **Page Sizes**: A4, Letter, or Original Image Dimensions.
  - **Orientation**: Portrait or Landscape.
  - **Margins**: None, Small (0.25in), Medium (0.5in), or Large (0.75in).
  - **Compression**: Presets (High 92%, Medium 75%, Low 50%) & Custom compression slider (10% - 100%).
- 🔒 **Password Encryption**: Protect output PDFs with custom user passwords via `pypdf`.
- 🔢 **Automatic Page Numbers**: Option for bottom-center page footers (`Page X of Y`).
- ⏳ **Progress Timeline**: Step-by-step conversion timeline during generation (`Preparing images` → `Optimizing quality` → `Generating pages` → `Compressing` → `Finalizing PDF`).
- 📱 **Responsive & Mobile Tabs**: Mobile-dedicated bottom tab navigation (`Pages` | `Preview` | `Settings`).

---

## 🎨 Color System

| Token | Hex Value |
|---|---|
| Background | `#0D1117` |
| Surface | `#151B23` |
| Panel | `#1B2430` |
| Border | `rgba(255,255,255,0.08)` |
| Primary Accent | `#3B82F6` |
| Success | `#10B981` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |
| Text Primary | `#F8FAFC` |
| Text Muted | `#94A3B8` |

---

## 📁 Project Structure

```
PageForge/
├── backend/
│   ├── app.py                # Flask REST API endpoints (/convert, /api/health, /)
│   ├── converter.py          # Pillow transformation, img2pdf rendering, pypdf encryption
│   ├── utils.py              # File validation, MIME checks, filename sanitization
│   ├── config.py             # Environment configurations and max payload limits
│   ├── requirements.txt      # Python dependencies
│   └── tests/
│       └── test_converter.py # Automated backend unit tests
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/       # Brand header, monochrome folded sheet logo, status
│   │   │   ├── Sidebar/      # LeftPanel (Image library list, reorder, duplicate)
│   │   │   ├── Canvas/       # CenterCanvas (Live paper sheet preview, zoom)
│   │   │   ├── Settings/     # SettingsSidebar (Document, Page, Compression, Security)
│   │   │   ├── StatusBar/    # Desktop bottom status bar
│   │   │   └── Loader/       # LoadingOverlay progress timeline
│   │   ├── hooks/            # Custom hook (useImageConverter)
│   │   ├── services/         # Axios API client (/convert)
│   │   ├── utils/            # Bytes formatting, PDF size estimation, blob helpers
│   │   ├── pages/            # Home page IDE workspace
│   │   ├── App.jsx           # Root component
│   │   └── index.css         # Custom desktop tokens & segmented controls
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)

### 1. Start Backend Server

```bash
# In project root directory
python backend/app.py
```
*Backend runs on `http://localhost:5000`*

### 2. Start Frontend Dev Server

```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:3000` or `http://localhost:3001`*

---

## 🧪 Automated Unit Tests

Run the backend unit test suite:

```bash
$env:PYTHONPATH="backend"; python -m unittest backend/tests/test_converter.py
```

---

## 📄 License
This project is licensed under the MIT License.
