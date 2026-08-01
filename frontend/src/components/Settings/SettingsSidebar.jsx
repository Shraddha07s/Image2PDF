import React, { useState } from 'react';
import {
  Sliders,
  FileSpreadsheet,
  Compass,
  Maximize,
  SlidersHorizontal,
  Lock,
  Hash,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { calculateEstimatedPdfSize } from '../../utils/fileHelpers';

const SettingsSidebar = ({
  settings,
  updateSetting,
  resetSettings,
  images,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const estimatedSize = calculateEstimatedPdfSize(images, settings);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/80 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
              PDF Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize layout and output parameters
            </p>
          </div>
        </div>

        <button
          onClick={resetSettings}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          title="Reset to defaults"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Form Controls */}
      <div className="space-y-5">

        {/* 1. Page Size */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-500" />
            <span>Page Size</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'A4', label: 'A4' },
              { id: 'Letter', label: 'Letter' },
              { id: 'Original', label: 'Original' },
            ].map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => updateSetting('pageSize', size.id)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  settings.pageSize === size.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Orientation */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Orientation</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'portrait', label: 'Portrait' },
              { id: 'landscape', label: 'Landscape' },
            ].map((orient) => (
              <button
                key={orient.id}
                type="button"
                onClick={() => updateSetting('orientation', orient.id)}
                disabled={settings.pageSize === 'Original'}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  settings.orientation === orient.id && settings.pageSize !== 'Original'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {orient.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Margins */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
            <Maximize className="w-3.5 h-3.5 text-emerald-500" />
            <span>Margins</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'none', label: 'None' },
              { id: 'small', label: 'Small' },
              { id: 'medium', label: 'Med' },
              { id: 'large', label: 'Large' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => updateSetting('margin', m.id)}
                className={`py-1.5 px-2 text-xs font-semibold rounded-xl border transition-all ${
                  settings.margin === m.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Image Quality Preset & Compression Slider */}
        <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Image Quality</span>
            </label>
            <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">
              {settings.compressionLevel}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'high', label: 'High (92%)', val: 92 },
              { id: 'medium', label: 'Med (75%)', val: 75 },
              { id: 'low', label: 'Low (50%)', val: 50 },
            ].map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  updateSetting('quality', q.id);
                  updateSetting('compressionLevel', q.val);
                }}
                className={`py-1.5 px-2 text-[11px] font-semibold rounded-xl border transition-all ${
                  settings.compressionLevel === q.val
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={settings.compressionLevel}
            onChange={(e) => updateSetting('compressionLevel', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* 5. Custom Output Filename */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Custom PDF Filename
          </label>
          <input
            type="text"
            value={settings.filename}
            onChange={(e) => updateSetting('filename', e.target.value)}
            placeholder="converted.pdf"
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        {/* 6. Password Protection (Optional) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5 uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-purple-500" />
            <span>Protect with Password</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={settings.password}
              onChange={(e) => updateSetting('password', e.target.value)}
              placeholder="Optional PDF password"
              className="w-full px-3 py-2 pr-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 7. Automatic Page Numbers Toggle */}
        <div className="flex items-center justify-between py-1">
          <label htmlFor="pageNumbers" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-2 cursor-pointer">
            <Hash className="w-3.5 h-3.5 text-blue-500" />
            <span>Add Page Numbers</span>
          </label>
          <input
            id="pageNumbers"
            type="checkbox"
            checked={settings.pageNumbers}
            onChange={(e) => updateSetting('pageNumbers', e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700 cursor-pointer"
          />
        </div>

      </div>

      {/* Estimated Size Footer Box */}
      <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-blue-700 dark:text-blue-300 font-medium">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Estimated PDF Size:</span>
        </div>
        <span className="font-bold text-blue-800 dark:text-blue-200 font-mono">
          {estimatedSize}
        </span>
      </div>

    </div>
  );
};

export default SettingsSidebar;
