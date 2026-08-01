import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Cpu } from 'lucide-react';

const STEPS = [
  'Preparing images',
  'Optimizing quality',
  'Generating pages',
  'Compressing',
  'Finalizing PDF',
];

const LoadingOverlay = ({ isConverting, progress = 0 }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isConverting) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isConverting]);

  if (!isConverting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1117]/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="bg-[#151B23] border border-[rgba(255,255,255,0.12)] rounded-xl p-6 max-w-sm w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-[rgba(255,255,255,0.08)] pb-4">
          <div className="w-8 h-8 rounded-lg bg-[#1B2430] border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white">PAGEFORGE Engine</h3>
            <p className="text-[11px] text-slate-400 font-mono">Compiling document pipeline...</p>
          </div>
        </div>

        {/* Animated Progress Timeline */}
        <div className="space-y-2.5 font-mono text-xs">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div key={step} className="flex items-center space-x-3">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <span className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin shrink-0"></span>
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0"></span>
                )}
                <span
                  className={
                    isDone
                      ? 'text-slate-400 line-through'
                      : isCurrent
                      ? 'text-blue-400 font-bold'
                      : 'text-slate-600'
                  }
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Upload/Processing Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-[#0D1117] rounded-full h-1.5 overflow-hidden border border-[rgba(255,255,255,0.06)]">
            <div
              className="bg-blue-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(15, progress)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
            <span>Local process</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingOverlay;
