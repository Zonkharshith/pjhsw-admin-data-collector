import React from 'react';
import { StatusLegend } from './StatusLegend';
import { PieChart } from 'lucide-react';

export const Sidebar = ({ yearlyData }) => {
  return (
    <div className="space-y-6">
      {/* Quick Summary Card */}
      <div className="bg-emerald-900 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
         <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-700 rounded-full opacity-50 blur-2xl"></div>
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 text-emerald-200">
               <PieChart size={18} />
               <span className="text-xs font-bold uppercase tracking-wider">Quick Actions</span>
            </div>
            <h3 className="text-lg font-semibold leading-tight mb-2">Review Pending Commitments</h3>
            <p className="text-emerald-100/80 text-sm">Check "Red" items for fake commitments and prioritize today's follow-ups.</p>
         </div>
      </div>

      <StatusLegend />

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
         <h3 className="text-sm font-bold text-slate-700 mb-3">Tips</h3>
         <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
            <li>Use the "Wand" icon to auto-classify transcripts.</li>
            <li>Mark "Partial Payments" in Blue to track recovery progress.</li>
            <li>Red flags indicate high-risk debtors.</li>
         </ul>
      </div>
    </div>
  );
};