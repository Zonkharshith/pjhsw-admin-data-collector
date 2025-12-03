import React from 'react';

export const StatusLegend: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Classification Key</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded border-2 border-red-500 bg-red-100 shrink-0"></div>
          <span className="text-sm text-slate-600">Fake Commitment</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded border-2 border-pink-500 bg-pink-100 shrink-0"></div>
          <span className="text-sm text-slate-600">Date Missed / Dishonored</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded border-2 border-blue-500 bg-blue-100 shrink-0"></div>
          <span className="text-sm text-slate-600">Partial Payment / Patch-up</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-100 shrink-0"></div>
          <span className="text-sm text-slate-600">No Dues</span>
        </div>
      </div>
    </div>
  );
};