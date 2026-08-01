import React, { useState, useEffect } from 'react';
import { FileText, Sun, Moon, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkHealth } from '../../services/api';

const Navbar = ({ theme, toggleTheme }) => {
  const [isBackendHealthy, setIsBackendHealthy] = useState(null);

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
    const interval = setInterval(pingBackend, 30000); // Poll health every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 transform transition hover:scale-105">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
                Image2PDF
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Fast, Private & Offline-ready PDF Generator
            </p>
          </div>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center space-x-3">
          {/* Backend Status Indicator */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {isBackendHealthy === true ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Backend Ready</span>
              </>
            ) : isBackendHealthy === false ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span>Checking API...</span>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-600 transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
