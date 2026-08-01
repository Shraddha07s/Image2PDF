import React from 'react';
import { FileText, ShieldCheck, Zap, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Mission */}
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                Image2PDF
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Production-Ready Image to PDF Converter Application
              </p>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Secure & Private</span>
            </span>
            <span className="flex items-center space-x-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Fast Server-side Conversion</span>
            </span>
          </div>

          {/* Copyright */}
          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" />
            <span>using React & Flask</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
