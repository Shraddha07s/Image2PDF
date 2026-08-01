import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import ImageCard from './ImageCard';
import { Trash2, Move } from 'lucide-react';
import { formatBytes } from '../../utils/fileHelpers';

const ImagePreviewGrid = ({
  images,
  onReorder,
  onRotate,
  onZoom,
  onRemove,
  onClearAll,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // minimum drag distance 5px to prevent accidental drag on click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((item) => item.id === active.id);
      const newIndex = images.findIndex((item) => item.id === over.id);
      const newOrdered = arrayMove(images, oldIndex, newIndex);
      onReorder(newOrdered);
    }
  };

  const totalRawSize = images.reduce((sum, img) => sum + (img.size || 0), 0);

  return (
    <div className="space-y-4">
      {/* Grid Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-200/50 dark:border-blue-800/50">
            {images.length} Image{images.length > 1 ? 's' : ''}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Total Raw: {formatBytes(totalRawSize)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex items-center text-xs text-slate-400 dark:text-slate-500 mr-2">
            <Move className="w-3.5 h-3.5 mr-1" />
            <span>Drag cards to change page order</span>
          </div>

          <button
            onClick={onClearAll}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200/60 dark:border-red-900/50 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* DndKit Sortable Context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <ImageCard
                key={image.id}
                image={image}
                index={index}
                onRotate={onRotate}
                onZoom={onZoom}
                onRemove={onRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ImagePreviewGrid;
