import React from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

const UploadZone = ({ onFilesSelected, imageCount = 0 }) => {
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    multiple: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 scale-[1.01] shadow-xl shadow-blue-500/10'
          : isDragReject
          ? 'border-red-500 bg-red-50/50 dark:bg-red-950/30'
          : 'border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 shadow-sm'
      }`}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Animated Upload Icon Box */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
            isDragActive
              ? 'bg-blue-600 text-white animate-bounce'
              : 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-slate-700'
          }`}
        >
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Headline & Description */}
        <div className="space-y-1 max-w-md">
          <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
            {isDragActive ? (
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">Drop your images here...</span>
            ) : (
              <span>
                Drag & Drop images here, or{' '}
                <span className="text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4 font-semibold hover:text-blue-700">
                  browse
                </span>
              </span>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upload multiple JPG, JPEG, PNG, or WEBP images to compile into a single PDF
          </p>
        </div>

        {/* Format & Size Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {['JPG', 'PNG', 'WEBP'].map((fmt) => (
            <span
              key={fmt}
              className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700"
            >
              {fmt}
            </span>
          ))}
          <span className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
            Max 25MB / file
          </span>
        </div>
      </div>

      {imageCount > 0 && (
        <div className="mt-4 inline-flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Click or drop more files to add to your current selection ({imageCount})</span>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
