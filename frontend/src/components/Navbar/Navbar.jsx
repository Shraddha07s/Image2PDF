import React, { useState, useEffect } from 'react';
import { Download, HelpCircle, HardDrive, CheckCircle2 } from 'lucide-react';
import { checkHealth } from '../../services/api';

const Navbar = ({ onConvert, canConvert, isConverting, pdfResult, onDownload }) => {
  const [isBackendHealthy, setIsBackendHealthy] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const pingBackend = async () => {
      try {
        await checkHealth();
        setIsBackendHealthy(true);
      } catch (err) {
        setIsBackendHealthy(false);
      }
    };

    pingBackend();
    const interval = setInterval(pingBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-[#151B23] border-b border-[rgba(255,255,255,0.08)] px-4 flex items-center justify-between select-none">
      
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        {/* Minimal Folded Sheet Monochrome Logo */}
        <div className="w-8 h-8 rounded-lg bg-[#1B2430] border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-white shadow-sm">
          <svg className="w-4 h-4 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm tracking-wide text-white font-mono">
              PAGEFORGE
            </span>
            <span className="text-[10px] uppercase font-mono font-medium px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-[rgba(255,255,255,0.06)]">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            Craft beautiful PDFs from your images
          </p>
        </div>
      </div>

      {/* Center Sub-tagline Badges */}
      <div className="hidden lg:flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
        <span className="flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Private</span>
        </span>
        <span>•</span>
        <span>Fast</span>
        <span>•</span>
        <span>Offline Engine</span>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center space-x-3">
        {/* Backend Status Pill */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#0D1117] text-slate-400 border border-[rgba(255,255,255,0.08)]">
          <span className={`w-2 h-2 rounded-full ${isBackendHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          <span className="hidden sm:inline">{isBackendHealthy ? 'Engine Online' : 'Connecting...'}</span>
        </div>

        {/* Help Icon Modal Trigger */}
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-[#1B2430] border border-transparent hover:border-[rgba(255,255,255,0.08)] transition"
          title="Shortcuts & Documentation"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Export / Download PDF CTA */}
        {pdfResult ? (
          <button
            onClick={onDownload}
            className="hover-lift px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/50 flex items-center space-x-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        ) : (
          <button
            onClick={onConvert}
            disabled={!canConvert || isConverting}
            className="hover-lift px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 border border-blue-500/40 flex items-center space-x-1.5 disabled:opacity-40 disabled:hover:transform-none disabled:cursor-not-allowed shadow-sm"
          >
            <span>{isConverting ? 'Exporting...' : 'Export PDF'}</span>
          </button>
        )}
      </div>

      {/* Help Drawer / Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#151B23] border border-[rgba(255,255,255,0.12)] rounded-xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[rgba(255,255,255,0.08)] pb-3">
              <h3 className="font-mono text-sm font-bold text-white">PAGEFORGE Help & Shortcuts</h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white text-xs font-mono">✕</button>
            </div>
            
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Reorder Pages</span>
                <span className="font-mono bg-[#0D1117] px-1.5 py-0.5 rounded text-[11px]">Drag Left List</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Zoom Canvas</span>
                <span className="font-mono bg-[#0D1117] px-1.5 py-0.5 rounded text-[11px]">Mouse Wheel / Controls</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Page Rotation</span>
                <span className="font-mono bg-[#0D1117] px-1.5 py-0.5 rounded text-[11px]">Rotate Button on Card</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Supported Formats</span>
                <span className="font-mono bg-[#0D1117] px-1.5 py-0.5 rounded text-[11px]">JPG, PNG, WEBP</span>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="w-full py-2 bg-[#1B2430] hover:bg-[#253244] border border-[rgba(255,255,255,0.08)] rounded-md text-xs font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
