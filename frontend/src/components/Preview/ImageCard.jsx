import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, RotateCw, RotateCcw, Maximize2, Trash2 } from 'lucide-react';
import { formatBytes } from '../../utils/fileHelpers';

const ImageCard = ({
  image,
  index,
  onRotate,
  onZoom,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'ring-2 ring-blue-500 shadow-xl' : ''
      }`}
    >
      {/* Page Badge */}
      <div className="absolute top-4 left-4 z-10 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold tracking-wider shadow">
        Page {index + 1}
      </div>

      {/* Drag Handle & Top Actions */}
      <div className="flex items-center justify-between mb-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          title="Drag to reorder page"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex items-center space-x-1">
          {/* Zoom Modal Button */}
          <button
            onClick={() => onZoom(image)}
            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 transition"
            title="Preview Image"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Rotate Counter-Clockwise */}
          <button
            onClick={() => onRotate(image.id, 'counter-clockwise')}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 transition"
            title="Rotate Left 90°"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Rotate Clockwise */}
          <button
            onClick={() => onRotate(image.id, 'clockwise')}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 transition"
            title="Rotate Right 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Remove Image */}
          <button
            onClick={() => onRemove(image.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-slate-700 transition"
            title="Remove page"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Thumbnail Container */}
      <div className="relative w-full h-44 rounded-xl bg-slate-100 dark:bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800">
        <img
          src={image.previewUrl}
          alt={image.name}
          style={{ transform: `rotate(${image.rotation}deg)` }}
          className="max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out"
        />
        {image.rotation > 0 && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white backdrop-blur-sm">
            {image.rotation}°
          </span>
        )}
      </div>

      {/* File Info Footer */}
      <div className="mt-3 px-1">
        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate" title={image.name}>
          {image.name}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          <span>{formatBytes(image.size)}</span>
          {image.width > 0 && (
            <span>
              {image.width} × {image.height}px
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
