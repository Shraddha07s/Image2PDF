import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Eye, Edit3, Trash2, AlertTriangle, FileText } from 'lucide-react';
import { formatBytes } from '../../utils/fileHelpers';

const SuccessModal = ({ pdfResult, onClose, onDownload, onCreateAnother }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInlinePreview, setShowInlinePreview] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Store previous focused element & restore focus on unmount
  useEffect(() => {
    previousFocusRef.current = document.activeElement;
    
    // Focus modal container on mount
    if (modalRef.current) {
      modalRef.current.focus();
    }

    return () => {
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Handle smooth close with fade out
  const handleSmoothClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 150);
  };

  // Keyboard Navigation: ESC to close, Enter to Download
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (showConfirmation) {
          setShowConfirmation(false);
        } else {
          handleSmoothClose();
        }
      } else if (e.key === 'Enter' && !showConfirmation) {
        e.preventDefault();
        onDownload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showConfirmation, onDownload]);

  // Trap focus inside modal
  const handleFocusTrap = (e) => {
    if (!modalRef.current) return;
    const focusables = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;

    const firstElement = focusables[0];
    const lastElement = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };

  if (!pdfResult) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0D1117]/80 backdrop-blur-sm p-4 select-none transition-opacity duration-150 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onKeyDown={handleFocusTrap}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-[#151B23] border border-[rgba(255,255,255,0.12)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 animate-fade-in outline-none"
      >
        {/* Top Right Close (×) Button */}
        <button
          onClick={handleSmoothClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1B2430] border border-transparent hover:border-[rgba(255,255,255,0.08)] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header: Animated Checkmark & Metadata */}
        <div className="text-center space-y-3 pt-2">
          {/* Animated Checkmark SVG */}
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="space-y-1">
            <h3 className="font-mono text-base font-bold text-white tracking-wide">
              PDF Created Successfully
            </h3>
            <p className="font-mono text-xs font-semibold text-blue-400 truncate max-w-xs mx-auto">
              {pdfResult.filename}
            </p>
            <p className="text-xs text-slate-400 font-mono pt-1">
              {pdfResult.imageCount} Page{pdfResult.imageCount > 1 ? 's' : ''} • {formatBytes(pdfResult.size)} • Generated in 0.4 sec
            </p>
          </div>
        </div>

        {/* Action Buttons Hierarchy */}
        <div className="space-y-2 font-mono">
          {/* Primary: Download PDF */}
          <button
            onClick={onDownload}
            className="hover-lift w-full py-2.5 px-4 rounded-xl bg-[#3B82F6] hover:bg-blue-600 border border-blue-500/50 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-sm focus:ring-2 focus:ring-blue-400/50"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF (Enter ↵)</span>
          </button>

          {/* Secondary: Open Preview */}
          <button
            onClick={() => setShowInlinePreview(!showInlinePreview)}
            className="hover-lift w-full py-2 px-4 rounded-xl bg-[#1B2430] hover:bg-[#253244] border border-[rgba(255,255,255,0.1)] text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4 text-blue-400" />
            <span>{showInlinePreview ? 'Hide Preview' : 'Open Preview'}</span>
          </button>

          {/* Tertiary: Continue Editing */}
          <button
            onClick={handleSmoothClose}
            className="hover-lift w-full py-2 px-4 rounded-xl bg-transparent hover:bg-[#1B2430] border border-[rgba(255,255,255,0.08)] text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-2"
          >
            <Edit3 className="w-4 h-4 text-slate-400" />
            <span>Continue Editing</span>
          </button>

          {/* Danger: Create New Document */}
          <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
            <button
              onClick={() => setShowConfirmation(true)}
              className="w-full py-2 px-4 rounded-xl bg-transparent hover:bg-red-950/20 text-red-400 hover:text-red-300 text-xs font-semibold flex items-center justify-center space-x-2 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>Create New Document</span>
            </button>
          </div>
        </div>

        {/* Optional Inline Preview */}
        {showInlinePreview && (
          <div className="h-64 bg-[#0D1117] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden">
            <object
              data={pdfResult.url}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="p-4 text-center text-xs text-slate-400">Inline PDF Preview</div>
            </object>
          </div>
        )}

        {/* Double-Confirmation Dialog for "Create New Document" */}
        {showConfirmation && (
          <div className="absolute inset-0 z-20 bg-[#151B23] rounded-2xl p-6 flex flex-col justify-between border border-[rgba(255,255,255,0.16)] shadow-2xl animate-fade-in">
            <div className="space-y-3 text-center pt-2">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h4 className="font-mono text-base font-bold text-white">
                Start a New Document?
              </h4>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                This will remove all current images and settings. This action cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 font-mono">
              <button
                onClick={() => setShowConfirmation(false)}
                className="py-2.5 px-4 rounded-xl bg-[#1B2430] hover:bg-[#253244] border border-[rgba(255,255,255,0.1)] text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowConfirmation(false);
                  onCreateAnother();
                }}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-sm"
              >
                Start New Document
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SuccessModal;
