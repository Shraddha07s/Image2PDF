import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import UploadZone from '../components/Upload/UploadZone';
import ImagePreviewGrid from '../components/Preview/ImagePreviewGrid';
import SettingsSidebar from '../components/Settings/SettingsSidebar';
import PDFPreviewModal from '../components/Preview/PDFPreviewModal';
import ZoomModal from '../components/Preview/ZoomModal';
import LoadingOverlay from '../components/Loader/LoadingOverlay';
import Footer from '../components/Footer/Footer';

import { useImageConverter } from '../hooks/useImageConverter';
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Sparkles,
  ArrowRight,
  History,
  Check,
  Shield,
  Layers,
} from 'lucide-react';
import { formatBytes } from '../utils/fileHelpers';

const Home = () => {
  const {
    theme,
    toggleTheme,
    images,
    addImages,
    removeImage,
    clearAllImages,
    rotateImage,
    reorderImages,
    settings,
    updateSetting,
    resetSettings,
    isConverting,
    uploadProgress,
    pdfResult,
    setPdfResult,
    previewZoomImage,
    setPreviewZoomImage,
    convert,
    handleDownload,
    history,
  } = useImageConverter();

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      
      {/* Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner Section */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-200/60 dark:border-blue-800/50 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Convert JPG, PNG, WEBP to PDF in Seconds</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Transform Images into{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
              Clean PDF Documents
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Reorder pages with drag & drop, rotate orientations, customize margin & page size, and export password-protected PDFs.
          </p>
        </div>

        {/* Upload Zone */}
        <UploadZone onFilesSelected={addImages} imageCount={images.length} />

        {/* Main Workspace: 2-Column Grid when images are present */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
            
            {/* Left Column: Image Cards Grid & Actions */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Image Preview & Sortable Grid */}
              <ImagePreviewGrid
                images={images}
                onReorder={reorderImages}
                onRotate={rotateImage}
                onZoom={setPreviewZoomImage}
                onRemove={removeImage}
                onClearAll={clearAllImages}
              />

              {/* Action Buttons Bar */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={convert}
                    disabled={isConverting || images.length === 0}
                    className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-xl shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <FileText className="w-5 h-5" />
                    <span>{isConverting ? 'Processing...' : 'Convert to PDF Now'}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {pdfResult && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="inline-flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition"
                    >
                      <Eye className="w-4 h-4 text-blue-500" />
                      <span>Preview PDF</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Settings Sidebar */}
            <div className="lg:col-span-4 sticky top-24 space-y-6">
              <SettingsSidebar
                settings={settings}
                updateSetting={updateSetting}
                resetSettings={resetSettings}
                images={images}
              />
            </div>

          </div>
        ) : (
          /* Empty State Display when no images uploaded */
          <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700/80 shadow-sm max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center border border-blue-100 dark:border-slate-800">
              <Layers className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                No images added yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Drag and drop your photos into the dropzone above to start arranging pages.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  ⚡ Fast & Local
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Instant processing with Pillow engine.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  🎨 Customizable Layout
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  A4, Letter, Margins & Quality control.
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  🔒 Password Lock
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Protect sensitive PDFs with encryption.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Conversion History Drawer */}
        {history.length > 0 && (
          <div className="max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-blue-500" />
                <span>Recent Download History ({history.length})</span>
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                {showHistory ? 'Hide' : 'Show'}
              </span>
            </button>

            {showHistory && (
              <div className="mt-3 space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.filename}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {item.imageCount} pages • {formatBytes(item.size)}
                        </div>
                      </div>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modals & Overlays */}
      {showPreviewModal && pdfResult && (
        <PDFPreviewModal
          pdfResult={pdfResult}
          onClose={() => setShowPreviewModal(false)}
          onDownload={handleDownload}
        />
      )}

      {previewZoomImage && (
        <ZoomModal
          image={previewZoomImage}
          onClose={() => setPreviewZoomImage(null)}
          onRotate={rotateImage}
        />
      )}

      <LoadingOverlay isConverting={isConverting} progress={uploadProgress} />

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default Home;
