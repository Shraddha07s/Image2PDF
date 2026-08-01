import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import LeftPanel from '../components/Sidebar/LeftPanel';
import CenterCanvas from '../components/Canvas/CenterCanvas';
import SettingsSidebar from '../components/Settings/SettingsSidebar';
import StatusBar from '../components/StatusBar/StatusBar';
import LoadingOverlay from '../components/Loader/LoadingOverlay';
import SuccessModal from '../components/Preview/SuccessModal';
import ZoomModal from '../components/Preview/ZoomModal';

import { useImageConverter } from '../hooks/useImageConverter';
import { Layers, Eye, Sliders } from 'lucide-react';

const Home = () => {
  const {
    theme,
    images,
    addImages,
    duplicateImage,
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
  } = useImageConverter();

  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [mobileTab, setMobileTab] = useState('canvas'); // 'pages' | 'canvas' | 'settings'

  const handleCreateAnother = () => {
    setPdfResult(null);
    clearAllImages();
  };

  return (
    <div className="h-screen w-screen bg-[#0D1117] text-[#F8FAFC] flex flex-col overflow-hidden font-sans select-none">
      
      {/* Top Navbar */}
      <Navbar
        onConvert={convert}
        canConvert={images.length > 0}
        isConverting={isConverting}
        pdfResult={pdfResult}
        onDownload={handleDownload}
      />

      {/* Desktop 3-Column IDE Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Image Library */}
        <div className={`hidden md:block h-full ${mobileTab === 'pages' ? '!block w-full absolute inset-0 z-30' : ''}`}>
          <LeftPanel
            images={images}
            onReorder={reorderImages}
            onRotate={rotateImage}
            onDuplicate={duplicateImage}
            onRemove={removeImage}
            onClearAll={clearAllImages}
            onAddFiles={addImages}
            onZoom={setPreviewZoomImage}
            selectedPageIndex={selectedPageIndex}
            onSelectPage={setSelectedPageIndex}
          />
        </div>

        {/* Center Canvas: Real Paper Preview */}
        <div className={`flex-1 h-full flex flex-col ${mobileTab === 'canvas' ? 'block' : 'hidden md:flex'}`}>
          <CenterCanvas
            images={images}
            selectedPageIndex={selectedPageIndex}
            onSelectPage={setSelectedPageIndex}
            onAddFiles={addImages}
            onRotate={rotateImage}
          />
        </div>

        {/* Right Panel: Settings Sidebar */}
        <div className={`hidden md:block h-full ${mobileTab === 'settings' ? '!block w-full absolute inset-0 z-30' : ''}`}>
          <SettingsSidebar
            settings={settings}
            updateSetting={updateSetting}
            resetSettings={resetSettings}
            images={images}
          />
        </div>

      </div>

      {/* Bottom Status Bar (Desktop) */}
      <div className="hidden md:block">
        <StatusBar
          images={images}
          settings={settings}
          isConverting={isConverting}
        />
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden h-12 bg-[#151B23] border-t border-[rgba(255,255,255,0.08)] flex items-center justify-around font-mono text-xs text-slate-400">
        <button
          onClick={() => setMobileTab('pages')}
          className={`flex items-center space-x-1 py-1 px-3 rounded ${mobileTab === 'pages' ? 'text-blue-400 bg-[#1B2430]' : ''}`}
        >
          <Layers className="w-4 h-4" />
          <span>Pages ({images.length})</span>
        </button>

        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex items-center space-x-1 py-1 px-3 rounded ${mobileTab === 'canvas' ? 'text-blue-400 bg-[#1B2430]' : ''}`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>

        <button
          onClick={() => setMobileTab('settings')}
          className={`flex items-center space-x-1 py-1 px-3 rounded ${mobileTab === 'settings' ? 'text-blue-400 bg-[#1B2430]' : ''}`}
        >
          <Sliders className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Modals & Overlays */}
      {pdfResult && (
        <SuccessModal
          pdfResult={pdfResult}
          onClose={() => setPdfResult(null)}
          onDownload={handleDownload}
          onCreateAnother={handleCreateAnother}
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

    </div>
  );
};

export default Home;
