import React, { useMemo } from 'react';
import { YearlyOutstanding } from '../types';

interface YearlyTableProps {
  yearlyData: YearlyOutstanding[];
  setYearlyData: React.Dispatch<React.SetStateAction<YearlyOutstanding[]>>;
}

export const YearlyTable: React.FC<YearlyTableProps> = ({ yearlyData, setYearlyData }) => {
  const handleYearChange = (id: string, field: keyof YearlyOutstanding, value: string) => {
    setYearlyData(prev => prev.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const getRowTotal = (row: YearlyOutstanding) => {
    const q1 = parseFloat(row.q1) || 0;
    const q2 = parseFloat(row.q2) || 0;
    const q3 = parseFloat(row.q3) || 0;
    const q4 = parseFloat(row.q4) || 0;
    return q1 + q2 + q3 + q4;
  };

  const formatCurrency = (val: number) => {
    if (val === 0) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const totalOutstanding = useMemo(() => {
    return yearlyData.reduce((sum, row) => sum + getRowTotal(row), 0);
  }, [yearlyData]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
           <h2 className="text-lg font-bold text-slate-800">Historical Outstanding Dues</h2>
           <p className="text-sm text-slate-500">Year-wise breakdown of uncollected commitments</p>
        </div>
        <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Total Cumulative</p>
            <p className="text-2xl font-bold text-emerald-700">{formatCurrency(totalOutstanding).replace('-', '₹0')}</p>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto p-0">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 text-xs uppercase text-slate-500 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 border-b border-slate-200">Fiscal Year</th>
              <th className="px-4 py-4 border-b border-slate-200 text-right bg-blue-50/30">Q1 (Apr-Jun)</th>
              <th className="px-4 py-4 border-b border-slate-200 text-right">Q2 (Jul-Sep)</th>
              <th className="px-4 py-4 border-b border-slate-200 text-right bg-blue-50/30">Q3 (Oct-Dec)</th>
              <th className="px-4 py-4 border-b border-slate-200 text-right">Q4 (Jan-Mar)</th>
              <th className="px-6 py-4 border-b border-slate-200 text-right font-bold text-slate-700">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {yearlyData.map((row) => {
              const rowTotal = getRowTotal(row);
              return (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-3 font-semibold text-slate-700">{row.year}</td>
                  <td className="px-4 py-3 bg-blue-50/10 group-hover:bg-blue-50/20">
                    <input
                      type="number"
                      placeholder="-"
                      className="w-full text-right bg-transparent border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded px-2 py-1.5 transition-all text-slate-600 font-mono"
                      value={row.q1}
                      onChange={(e) => handleYearChange(row.id, 'q1', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      placeholder="-"
                      className="w-full text-right bg-transparent border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded px-2 py-1.5 transition-all text-slate-600 font-mono"
                      value={row.q2}
                      onChange={(e) => handleYearChange(row.id, 'q2', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3 bg-blue-50/10 group-hover:bg-blue-50/20">
                    <input
                      type="number"
                      placeholder="-"
                      className="w-full text-right bg-transparent border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded px-2 py-1.5 transition-all text-slate-600 font-mono"
                      value={row.q3}
                      onChange={(e) => handleYearChange(row.id, 'q3', e.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      placeholder="-"
                      className="w-full text-right bg-transparent border border-transparent hover:border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded px-2 py-1.5 transition-all text-slate-600 font-mono"
                      value={row.q4}
                      onChange={(e) => handleYearChange(row.id, 'q4', e.target.value)}
                    />
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-emerald-700 bg-emerald-50/10">
                    {formatCurrency(rowTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-slate-50 font-bold text-slate-700">
             <tr>
               <td className="px-6 py-4">Grand Total</td>
               <td className="px-4 py-4 text-right"></td>
               <td className="px-4 py-4 text-right"></td>
               <td className="px-4 py-4 text-right"></td>
               <td className="px-4 py-4 text-right"></td>
               <td className="px-6 py-4 text-right text-emerald-800 text-lg border-t-2 border-slate-200">
                 {formatCurrency(totalOutstanding)}
               </td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};