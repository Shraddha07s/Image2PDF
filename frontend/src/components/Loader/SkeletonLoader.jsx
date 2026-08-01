import React from 'react';

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex justify-between items-center">
            <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            <div className="w-8 h-4 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          </div>
          <div className="w-full h-44 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div className="w-1/2 h-3 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
