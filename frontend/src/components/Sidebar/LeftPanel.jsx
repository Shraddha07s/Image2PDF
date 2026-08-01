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
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  GripVertical,
  RotateCw,
  Copy,
  Trash2,
  Maximize2,
  Layers,
  FileText,
} from 'lucide-react';
import { formatBytes } from '../../utils/fileHelpers';

const SortableImageItem = ({
  image,
  index,
  onRotate,
  onDuplicate,
  onRemove,
  onZoom,
  isSelected,
  onSelect,
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
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(index)}
      className={`group relative flex items-center space-x-2.5 p-2 rounded-lg border transition-all duration-150 cursor-pointer ${
        isSelected
          ? 'bg-[#1B2430] border-[#3B82F6]'
          : 'bg-[#151B23] border-[rgba(255,255,255,0.06)] hover:bg-[#1B2430]/70 hover:border-[rgba(255,255,255,0.12)]'
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-slate-300 rounded"
        title="Reorder page"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>

      {/* Page Number Badge */}
      <div className="w-5 h-5 rounded bg-[#0D1117] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono font-bold text-slate-400 flex items-center justify-center shrink-0">
        {index + 1}
      </div>

      {/* Thumbnail */}
      <div className="w-10 h-10 rounded bg-[#0D1117] border border-[rgba(255,255,255,0.08)] overflow-hidden flex items-center justify-center shrink-0 relative">
        <img
          src={image.previewUrl}
          alt={image.name}
          style={{ transform: `rotate(${image.rotation}deg)` }}
          className="max-h-full max-w-full object-contain transition-transform duration-200"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-medium text-slate-200 truncate" title={image.name}>
          {image.name}
        </h4>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
          {formatBytes(image.size)} • {image.width}×{image.height}
        </div>
      </div>

      {/* Action Buttons (Visible on hover or selection) */}
      <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRotate(image.id, 'clockwise');
          }}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded"
          title="Rotate 90°"
        >
          <RotateCw className="w-3 h-3" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(image.id);
          }}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded"
          title="Duplicate"
        >
          <Copy className="w-3 h-3" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(image.id);
          }}
          className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded"
          title="Remove"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

const LeftPanel = ({
  images,
  onReorder,
  onRotate,
  onDuplicate,
  onRemove,
  onClearAll,
  onAddFiles,
  onZoom,
  selectedPageIndex,
  onSelectPage,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
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

  const fileInputRef = React.useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="w-72 bg-[#151B23] border-r border-[rgba(255,255,255,0.08)] flex flex-col h-full select-none">
      
      {/* Panel Header */}
      <div className="p-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-500" />
          <span className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">
            Pages ({images.length})
          </span>
        </div>

        {images.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] text-slate-400 hover:text-red-400 hover:underline transition font-mono"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Images List Container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {images.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2 text-slate-500">
            <FileText className="w-8 h-8 stroke-1 text-slate-600" />
            <p className="text-xs">No pages added</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={verticalListSortingStrategy}
            >
              {images.map((image, idx) => (
                <SortableImageItem
                  key={image.id}
                  image={image}
                  index={idx}
                  onRotate={onRotate}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                  onZoom={onZoom}
                  isSelected={selectedPageIndex === idx}
                  onSelect={onSelectPage}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Pinned Bottom Add Images Button */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.08)] bg-[#151B23]">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="hover-lift w-full py-2 px-3 rounded-lg bg-[#1B2430] hover:bg-[#253244] border border-[rgba(255,255,255,0.1)] text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center space-x-2 transition"
        >
          <Plus className="w-4 h-4 text-blue-500" />
          <span>Add Images</span>
        </button>
      </div>

    </div>
  );
};

export default LeftPanel;
