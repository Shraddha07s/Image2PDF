import React, { useState } from 'react';
import {
  FileText,
  Sliders,
  Maximize,
  Lock,
  Hash,
  RotateCcw,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert,
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
    <div className="w-80 bg-[#151B23] border-l border-[rgba(255,255,255,0.08)] flex flex-col h-full select-none">
      
      {/* Panel Header */}
      <div className="p-3 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-blue-500" />
          <span className="font-mono text-xs font-semibold text-slate-200 uppercase tracking-wider">
            PDF Settings
          </span>
        </div>

        <button
          onClick={resetSettings}
          className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#1B2430] transition"
          title="Reset to defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Settings Options Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">

        {/* Section 1: Document */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            DOCUMENT
          </label>
          <div className="space-y-1.5">
            <span className="text-xs text-slate-300">Filename</span>
            <input
              type="text"
              value={settings.filename}
              onChange={(e) => updateSetting('filename', e.target.value)}
              placeholder="converted.pdf"
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#0D1117] text-slate-100 border border-[rgba(255,255,255,0.08)] focus:outline-none focus:border-[#3B82F6] font-mono"
            />
          </div>
        </div>

        {/* Section 2: Page Layout */}
        <div className="space-y-3 pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            PAGE LAYOUT
          </label>

          {/* Page Size Segmented Control */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-300">Page Size</span>
            <div className="segmented-control">
              {[
                { id: 'A4', label: 'A4' },
                { id: 'Letter', label: 'Letter' },
                { id: 'Original', label: 'Original' },
              ].map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => updateSetting('pageSize', size.id)}
                  className={`segmented-option ${settings.pageSize === size.id ? 'active' : ''}`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orientation Segmented Control */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-300">Orientation</span>
            <div className="segmented-control">
              {[
                { id: 'portrait', label: 'Portrait' },
                { id: 'landscape', label: 'Landscape' },
              ].map((orient) => (
                <button
                  key={orient.id}
                  type="button"
                  disabled={settings.pageSize === 'Original'}
                  onClick={() => updateSetting('orientation', orient.id)}
                  className={`segmented-option ${
                    settings.orientation === orient.id && settings.pageSize !== 'Original' ? 'active' : ''
                  }`}
                >
                  {orient.label}
                </button>
              ))}
            </div>
          </div>

          {/* Margins Segmented Control */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-300">Margin</span>
            <div className="segmented-control">
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
                  className={`segmented-option ${settings.margin === m.id ? 'active' : ''}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Compression */}
        <div className="space-y-3 pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              COMPRESSION
            </label>
            <span className="text-xs font-mono font-semibold text-blue-400">
              {settings.compressionLevel}% Quality
            </span>
          </div>

          {/* Quality Segmented Control */}
          <div className="segmented-control">
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
                className={`segmented-option ${settings.compressionLevel === q.val ? 'active' : ''}`}
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
            className="w-full h-1.5 bg-[#0D1117] rounded-lg appearance-none cursor-pointer accent-blue-500 border border-[rgba(255,255,255,0.08)]"
          />
        </div>

        {/* Section 4: Security & Options */}
        <div className="space-y-3 pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <label className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
            SECURITY & OPTIONS
          </label>

          {/* Password Protection */}
          <div className="space-y-1.5">
            <span className="text-xs text-slate-300">Password Encryption</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.password}
                onChange={(e) => updateSetting('password', e.target.value)}
                placeholder="Optional PDF Password"
                className="w-full px-3 py-1.5 pr-8 text-xs rounded-md bg-[#0D1117] text-slate-100 border border-[rgba(255,255,255,0.08)] focus:outline-none focus:border-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Page Numbers Toggle */}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-slate-300">Automatic Page Numbers</span>
            <input
              type="checkbox"
              checked={settings.pageNumbers}
              onChange={(e) => updateSetting('pageNumbers', e.target.checked)}
              className="w-4 h-4 rounded bg-[#0D1117] border-[rgba(255,255,255,0.12)] text-blue-600 focus:ring-0 cursor-pointer"
            />
          </div>
        </div>

      </div>

      {/* Pinned Estimated PDF Size Box */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.08)] bg-[#151B23] flex items-center justify-between text-xs font-mono">
        <span className="text-slate-400">Est. Size:</span>
        <span className="font-bold text-blue-400">{estimatedSize}</span>
      </div>

    </div>
  );
};

export default SettingsSidebar;
