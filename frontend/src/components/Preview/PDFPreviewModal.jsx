import React from 'react';
import { X, Download, FileText, CheckCircle } from 'lucide-react';
import { formatBytes } from '../../utils/fileHelpers';

const PDFPreviewModal = ({ pdfResult, onClose, onDownload }) => {
  if (!pdfResult) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                <span>PDF Ready: {pdfResult.filename}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Size: {formatBytes(pdfResult.size)} • {pdfResult.imageCount} Page{pdfResult.imageCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onDownload}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer Body */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 relative">
          <object
            data={pdfResult.url}
            type="application/pdf"
            className="w-full h-full rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800"
          >
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
              <FileText className="w-12 h-12 text-slate-400" />
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm">
                Your browser does not support embedded inline PDF previews. You can download the file directly to view it.
              </p>
              <button
                onClick={onDownload}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl shadow"
              >
                Download PDF ({formatBytes(pdfResult.size)})
              </button>
            </div>
          </object>
        </div>

      </div>
    </div>
  );
};

export default PDFPreviewModal;
