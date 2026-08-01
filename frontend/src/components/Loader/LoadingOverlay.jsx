import React from 'react';
import { Loader2, Sparkles, FileCheck2 } from 'lucide-react';

const LoadingOverlay = ({ isConverting, progress = 0 }) => {
  if (!isConverting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
        
        {/* Animated Icon */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-slate-800"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"
          ></div>
          <FileCheck2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
        </div>

        {/* Status Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center justify-center space-x-2">
            <span>Converting Images...</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Please wait while we process, compress, and compile your pages into a PDF
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 px-1">
            <span>{progress < 100 ? 'Uploading Files' : 'Building PDF Document'}</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(10, progress)}%` }}
            ></div>
          </div>
        </div>

        <div className="inline-flex items-center space-x-1.5 text-[11px] text-slate-400 dark:text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>High quality Pillow & img2pdf conversion</span>
        </div>

      </div>
    </div>
  );
};

export default LoadingOverlay;
