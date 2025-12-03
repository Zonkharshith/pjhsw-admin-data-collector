import React, { useMemo } from 'react';
import { TrendingUp, AlertCircle, CheckCircle2, CalendarClock } from 'lucide-react';
import { CommitmentTable } from './CommitmentTable';
import { Status } from '../constants';

export const Dashboard = ({ rows, setRows, yearlyData }) => {
  const TARGET_AMOUNT = 40000000; // 4 Crores

  // Calculations
  const totalOutstanding = useMemo(() => {
    return yearlyData.reduce((sum, row) => {
      return sum + (parseFloat(row.q1)||0) + (parseFloat(row.q2)||0) + (parseFloat(row.q3)||0) + (parseFloat(row.q4)||0);
    }, 0);
  }, [yearlyData]);

  const progressPercentage = Math.min((totalOutstanding / TARGET_AMOUNT) * 100, 100);
  
  const activeCommitments = rows.filter(r => r.status === Status.PENDING || r.status === Status.PARTIAL_PAYMENT).length;
  const criticalIssues = rows.filter(r => r.status === Status.FAKE_COMMITMENT || r.status === Status.DISHONORED).length;
  const collectedCount = rows.filter(r => r.status === Status.NO_DUES).length;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
        notation: val > 100000 ? 'compact' : 'standard'
      }).format(val);
  };

  return (
    <div className="space-y-8 h-full flex flex-col overflow-y-auto custom-scrollbar pr-2">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pending Dues</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalOutstanding)}</h3>
                    <p className="text-xs text-emerald-600 mt-2 font-medium">+12% from last month</p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <TrendingUp size={20} />
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Issues</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{criticalIssues}</h3>
                    <p className="text-xs text-red-500 mt-2 font-medium">Needs immediate attention</p>
                </div>
                <div className="p-2 bg-red-100 rounded-lg text-red-600">
                    <AlertCircle size={20} />
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cases Solved</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{collectedCount}</h3>
                    <p className="text-xs text-slate-400 mt-2">Fully cleared dues</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <CheckCircle2 size={20} />
                </div>
            </div>

             <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Commitments</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{activeCommitments}</h3>
                    <p className="text-xs text-slate-400 mt-2">In progress</p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                    <CalendarClock size={20} />
                </div>
            </div>
        </div>

        {/* 4 Cr Visualizer */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Recovery Target Progress</h2>
                    <p className="text-sm text-slate-500">Tracking towards 4 Crore limit</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-bold text-emerald-700">{progressPercentage.toFixed(1)}%</span>
                    <span className="text-sm text-slate-400 block">of 4 Cr Target</span>
                </div>
            </div>
            
            <div className="relative h-12 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    style={{ width: `${progressPercentage}%` }}
                >
                     <div className="absolute inset-0 w-full h-full opacity-20" 
                        style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)', backgroundSize: '20px 20px' }}>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-slate-400 font-mono">
                <span>0</span>
                <span>1 Cr</span>
                <span>2 Cr</span>
                <span>3 Cr</span>
                <span>4 Cr</span>
            </div>
        </div>

        {/* Today's Follow-ups */}
        <div className="flex-grow min-h-[400px]">
            <CommitmentTable rows={rows} setRows={setRows} readOnly={true} filterToday={true} />
        </div>
    </div>
  );
};