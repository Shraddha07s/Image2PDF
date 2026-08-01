import React from 'react';
import { Check, HardDrive, Cpu, Sparkles } from 'lucide-react';
import { calculateEstimatedPdfSize } from '../../utils/fileHelpers';

const StatusBar = ({ images, settings, isConverting }) => {
  const estimatedSize = calculateEstimatedPdfSize(images, settings);

  return (
    <footer className="h-7 bg-[#0D1117] border-t border-[rgba(255,255,255,0.08)] px-4 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none">
      
      {/* Left: Ready Indicator */}
      <div className="flex items-center space-x-2">
        {isConverting ? (
          <>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            <span className="text-blue-400 font-semibold">Forging PDF...</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300">Ready ✓</span>
          </>
        )}
      </div>

      {/* Center Metrics */}
      <div className="hidden sm:flex items-center space-x-4">
        <span>
          Images: <strong className="text-slate-200">{images.length}</strong>
        </span>
        <span>•</span>
        <span>
          Est. Size: <strong className="text-blue-400">{estimatedSize}</strong>
        </span>
        <span>•</span>
        <span>
          Compression: <strong className="text-slate-200">{settings.compressionLevel}%</strong>
        </span>
      </div>

      {/* Right Engine Status */}
      <div className="flex items-center space-x-2">
        <Cpu className="w-3 h-3 text-slate-500" />
        <span className="text-[10px]">Local Engine: Active</span>
      </div>

    </footer>
  );
};

export default StatusBar;
