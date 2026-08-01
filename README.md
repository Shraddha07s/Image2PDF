# 📄 Image2PDF - Full-Stack Image to PDF Converter

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-61DAFB)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Flask%20%7C%20Pillow-000000)](https://flask.palletsprojects.com/)

**Image2PDF** is a production-ready, full-stack web application that allows users to upload, rotate, reorder, and convert multiple images (JPG, JPEG, PNG, WEBP) into customized, high-quality PDF documents with real-time settings, preview, and download capabilities.

---

## ✨ Features

- ⚡ **Drag & Drop Upload**: Upload single or multiple images effortlessly (`react-dropzone`).
- 🔄 **Drag & Drop Page Reordering**: Interactive sortable page cards using `@dnd-kit`.
- 📐 **Per-Image Rotation**: Rotate individual images by 90°, 180°, or 270° before conversion.
- ⚙️ **PDF Layout Customization**:
  - **Page Sizes**: A4, Letter, or Original Image Dimensions.
  - **Orientation**: Portrait or Landscape.
  - **Margins**: None, Small (0.25in), Medium (0.5in), or Large (0.75in).
  - **Quality Compression**: Presets (High, Medium, Low) & Custom compression slider (10% - 100%).
- 🔒 **Password Protection**: Encrypt output PDFs with a custom user password (`pypdf`).
- 🔢 **Page Numbering**: Automatic bottom-center page footer (`Page X of Y`).
- 👁️ **PDF Preview Before Download**: Embedded PDF preview modal.
- 🌙 **Dark & Light Mode**: Persistent theme toggle with smooth transitions.
- ⏱️ **Download History**: Stores past conversions locally in browser storage.
- 📱 **Responsive & Accessible**: Mobile-friendly glassmorphism UI with keyboard accessibility.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Language**: JavaScript (ES6+)
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Drag & Drop Upload**: `react-dropzone`
- **Drag & Drop Reordering**: `@dnd-kit/core`, `@dnd-kit/sortable`
- **Icons**: `lucide-react`
- **Notifications**: `react-hot-toast`

### Backend
- **Framework**: Python / Flask
- **CORS**: `Flask-CORS`
- **Image Engine**: Pillow (PIL)
- **PDF Engine**: `img2pdf` & `pypdf`
- **Environment Management**: `python-dotenv`
- **Production Server**: Gunicorn

---

## 📁 Project Structure

```
Image2PDF/
├── backend/
│   ├── app.py                # Flask REST API endpoints (/convert, /api/health, /)
│   ├── converter.py          # Pillow transformation, img2pdf rendering, pypdf encryption
│   ├── utils.py              # File validation, MIME checks, filename sanitization
│   ├── config.py             # Environment configurations and max payload limits
│   ├── requirements.txt      # Python dependencies
│   └── tests/
│       └── test_converter.py # Automated backend unit tests
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/       # Brand logo, theme toggle, health indicator
│   │   │   ├── Upload/       # Drag-and-drop file upload zone
│   │   │   ├── Preview/      # Sortable image grid, card, zoom modal, PDF preview
│   │   │   ├── Settings/     # Page size, orientation, margin, quality, password controls
│   │   │   ├── Loader/       # Converting overlay spinner & progress bar
│   │   │   └── Footer/       # Modern footer component
│   │   ├── hooks/            # Custom hook (useImageConverter)
│   │   ├── services/         # Axios API client (/convert)
│   │   ├── utils/            # Bytes formatting, PDF size estimation, blob helpers
│   │   ├── pages/            # Home page view
│   │   ├── App.jsx           # Root component with Toast container
│   │   └── index.css         # Tailwind directives & CSS variables
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.9+)

### 1. Clone & Setup Backend

```bash
cd backend

# Create virtual environment (optional)
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```
Backend will run at: `http://localhost:5000`

### 2. Setup & Run Frontend

```bash
cd frontend

# Install Node packages
npm install

# Start Vite dev server
npm run dev
```
Frontend will run at: `http://localhost:3000` (or `http://localhost:5173`)

---

## 🧪 Running Automated Tests

Run backend unit tests for image transformation, rotation, layout fitting, and PDF password encryption:

```bash
$env:PYTHONPATH="backend"; python -m unittest backend/tests/test_converter.py
```

---

## 📡 API Reference

### `GET /`
- **Response**: `{"status": "Backend Running", "message": "Image2PDF API is operational"}`

### `GET /api/health`
- **Response**: `{"status": "healthy"}`

### `POST /convert`
- **Content-Type**: `multipart/form-data`
- **Form Fields**:
  - `images`: Array of binary image files (JPG, PNG, WEBP)
  - `rotations`: JSON array of rotation angles, e.g., `[0, 90, 180]`
  - `pageSize`: `"A4" | "Letter" | "Original"`
  - `orientation`: `"portrait" | "landscape"`
  - `margin`: `"none" | "small" | "medium" | "large"`
  - `quality`: `"high" | "medium" | "low"`
  - `compressionLevel`: Integer slider (10 - 100)
  - `filename`: Custom output PDF filename (e.g., `my_document.pdf`)
  - `password`: Optional password string
  - `pageNumbers`: `"true" | "false"`
- **Response**: Binary stream with header `Content-Type: application/pdf`

---

## 🌐 Deployment Instructions

### Frontend (Vercel)
1. Push codebase to GitHub repository.
2. Log into [Vercel](https://vercel.com) and import the project.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-render-url.onrender.com`
5. Click **Deploy**.

### Backend (Render)
1. Log into [Render](https://render.com) and select **New Web Service**.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `gunicorn app:app`
6. Add Environment Variable:
   - `CORS_ORIGINS`: `https://your-frontend-vercel-url.vercel.app`
7. Click **Create Web Service**.

---

## 📄 License
This project is licensed under the MIT License.
