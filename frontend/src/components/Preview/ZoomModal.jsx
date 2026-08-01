import React from 'react';
import { X, RotateCw } from 'lucide-react';
import { formatBytes } from '../../utils/fileHelpers';

const ZoomModal = ({ image, onClose, onRotate }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate max-w-md">
              {image.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Size: {formatBytes(image.size)} • Resolution: {image.width} × {image.height}px
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRotate(image.id, 'clockwise')}
              className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Rotate 90°"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* High Res View */}
        <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center min-h-[300px]">
          <img
            src={image.previewUrl}
            alt={image.name}
            style={{ transform: `rotate(${image.rotation}deg)` }}
            className="max-h-[70vh] max-w-full object-contain transition-transform duration-300 rounded-lg shadow-md"
          />
        </div>

      </div>
    </div>
  );
};

export default ZoomModal;
