import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  RotateCw,
} from 'lucide-react';

const CenterCanvas = ({
  images,
  selectedPageIndex,
  onSelectPage,
  onAddFiles,
  onRotate,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const containerRef = useRef(null);

  // Handle Drag and Drop anywhere on canvas
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onAddFiles(acceptedFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: images.length > 0, // Click opens browse only if no images or via button
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: true,
  });

  const activeImage = images[selectedPageIndex] || images[0];

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 25, 250));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  // Handle Mouse Wheel Zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  return (
    <div
      {...getRootProps()}
      ref={containerRef}
      onWheel={handleWheel}
      className={`flex-1 relative bg-[#0D1117] flex flex-col justify-between overflow-hidden select-none ${
        isDragActive ? 'ring-2 ring-blue-500 bg-[#0D1117]/90' : ''
      }`}
    >
      <input {...getInputProps()} />

      {/* Drag Active Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-50 bg-[#0D1117]/90 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-blue-500 p-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#1B2430] border border-blue-500/50 flex items-center justify-center text-blue-400 mb-4 animate-bounce">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white font-mono">Drop images to forge PDF</h3>
          <p className="text-xs text-slate-400 mt-1">Supports JPG, JPEG, PNG, WEBP</p>
        </div>
      )}

      {/* Empty State: Handcrafted Paper Stack Illustration */}
      {images.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
          <div className="relative group cursor-pointer" onClick={() => containerRef.current?.querySelector('input')?.click()}>
            
            {/* Paper Stack SVG Illustration */}
            <div className="w-32 h-40 relative mx-auto transform transition duration-300 group-hover:scale-105">
              {/* Back Sheet */}
              <div className="absolute inset-0 rounded-xl bg-[#1B2430] border border-[rgba(255,255,255,0.06)] transform -rotate-6 transition duration-300 group-hover:-rotate-12 shadow-lg"></div>
              {/* Middle Sheet */}
              <div className="absolute inset-0 rounded-xl bg-[#18202A] border border-[rgba(255,255,255,0.08)] transform rotate-3 transition duration-300 group-hover:rotate-6 shadow-md"></div>
              {/* Top Sheet */}
              <div className="absolute inset-0 rounded-xl bg-[#151B23] border border-[rgba(255,255,255,0.12)] p-4 flex flex-col items-center justify-center text-center space-y-2 shadow-2xl">
                <svg className="w-8 h-8 text-blue-400 stroke-1 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="w-12 h-1 bg-[rgba(255,255,255,0.1)] rounded-full"></div>
                <div className="w-8 h-1 bg-[rgba(255,255,255,0.08)] rounded-full"></div>
              </div>
            </div>

          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-sm font-semibold text-slate-200">
              Drop images anywhere or{' '}
              <button
                type="button"
                onClick={() => containerRef.current?.querySelector('input')?.click()}
                className="text-blue-400 hover:underline font-semibold"
              >
                browse files
              </button>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Craft clean, multi-page PDFs locally in your browser.
            </p>
          </div>
        </div>
      ) : (
        /* Real Sheet of Paper Canvas View */
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 relative">
          <div
            style={{ transform: `scale(${zoomLevel / 100})` }}
            className="transition-transform duration-150 ease-out max-w-full max-h-full flex items-center justify-center"
          >
            {/* Paper Sheet Container */}
            <div className="bg-white rounded-md paper-canvas-shadow p-6 relative max-w-xl max-h-[70vh] flex items-center justify-center overflow-hidden border border-slate-300">
              <img
                src={activeImage.previewUrl}
                alt={activeImage.name}
                style={{ transform: `rotate(${activeImage.rotation}deg)` }}
                className="max-h-[60vh] max-w-full object-contain transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Canvas Bottom Controls Bar */}
      {images.length > 0 && (
        <div className="h-11 bg-[#151B23] border-t border-[rgba(255,255,255,0.08)] px-4 flex items-center justify-between select-none">
          
          {/* Left: Page Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelectPage(Math.max(0, selectedPageIndex - 1))}
              disabled={selectedPageIndex === 0}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-[#1B2430]"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-medium text-slate-300">
              Page {selectedPageIndex + 1} of {images.length}
            </span>

            <button
              onClick={() => onSelectPage(Math.min(images.length - 1, selectedPageIndex + 1))}
              disabled={selectedPageIndex === images.length - 1}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-[#1B2430]"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Rotation Quick Action */}
          <button
            onClick={() => onRotate(activeImage.id, 'clockwise')}
            className="p-1.5 text-xs text-slate-400 hover:text-white hover:bg-[#1B2430] rounded flex items-center space-x-1 font-mono"
            title="Rotate Page"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rotate 90°</span>
          </button>

          {/* Right: Zoom Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleZoomOut}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#1B2430]"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetZoom}
              className="px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-300 hover:text-white rounded hover:bg-[#1B2430]"
              title="Reset Zoom"
            >
              {zoomLevel}%
            </button>

            <button
              onClick={handleZoomIn}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#1B2430]"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default CenterCanvas;
