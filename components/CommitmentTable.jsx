import React, { useState } from 'react';
import { Plus, Trash2, Wand2, Phone, Calendar, IndianRupee, User, Briefcase } from 'lucide-react';
import { Status } from '../constants';
import { analyzeTranscript } from '../services/geminiService';

export const CommitmentTable = ({ rows, setRows, readOnly = false, filterToday = false }) => {
  const [analyzingId, setAnalyzingId] = useState(null);

  const displayRows = filterToday 
    ? rows.filter(r => {
        if (!r.date) return false;
        const today = new Date().toISOString().split('T')[0];
        return r.date === today && r.status !== Status.NO_DUES;
      })
    : rows;

  const handleAddRow = () => {
    const newRow = {
      id: crypto.randomUUID(),
      personName: '',
      transcript: '',
      contactNo: '',
      date: '',
      amount: '',
      branchOrProfile: '',
      status: Status.PENDING,
    };
    setRows([newRow, ...rows]);
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleDelete = (id) => {
    setRows(rows.filter(r => r.id !== id));
  };

  const handleAnalyze = async (row) => {
    if (!row.transcript.trim()) return;
    
    setAnalyzingId(row.id);
    const result = await analyzeTranscript(row.transcript);
    
    setRows(prev => prev.map(r => {
      if (r.id === row.id) {
        return {
          ...r,
          status: result.suggestedStatus,
          date: result.extractedDate || r.date,
          amount: result.extractedAmount ? result.extractedAmount.toString() : r.amount,
        };
      }
      return r;
    }));
    setAnalyzingId(null);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case Status.FAKE_COMMITMENT: return 'bg-red-50 border-red-200 hover:border-red-300';
      case Status.DISHONORED: return 'bg-pink-50 border-pink-200 hover:border-pink-300';
      case Status.PARTIAL_PAYMENT: return 'bg-blue-50 border-blue-200 hover:border-blue-300';
      case Status.NO_DUES: return 'bg-emerald-50 border-emerald-200 hover:border-emerald-300';
      default: return 'bg-white border-slate-200 hover:border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
          {filterToday ? "Today's Priorities" : "Commitment Ledger"}
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full border border-emerald-200">{displayRows.length}</span>
        </h2>
        {!readOnly && (
          <button 
            onClick={handleAddRow}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm active:transform active:scale-95"
          >
            <Plus size={16} />
            New Entry
          </button>
        )}
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-grow p-4 space-y-4 bg-slate-50/30">
        {displayRows.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
               <Briefcase size={24} className="text-slate-300" />
            </div>
            <p className="font-medium text-slate-600">{filterToday ? "No follow-ups scheduled for today." : "No commitments tracked yet."}</p>
            {!readOnly && <p className="text-sm mt-1">Add a row to start tracking.</p>}
          </div>
        )}

        {displayRows.map((row) => (
          <div 
            key={row.id} 
            className={`rounded-xl border p-5 transition-all duration-200 shadow-sm hover:shadow-md ${getStatusStyles(row.status)}`}
          >
            {/* Top Row: Person, Contact, Status Selector */}
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 flex gap-3">
                <div className="relative flex-1 group">
                    <User className="absolute left-3 top-2.5 text-slate-400 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Person Name"
                      readOnly={readOnly}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200/60 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-slate-400 font-semibold text-slate-800"
                      value={row.personName}
                      onChange={(e) => updateRow(row.id, 'personName', e.target.value)}
                    />
                </div>
                <div className="relative w-44 group">
                    <Phone className="absolute left-3 top-2.5 text-slate-400 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Contact No."
                      readOnly={readOnly}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200/60 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder-slate-400 text-slate-600 font-mono"
                      value={row.contactNo}
                      onChange={(e) => updateRow(row.id, 'contactNo', e.target.value)}
                    />
                </div>
              </div>

              <div className="w-full md:w-auto">
                 <div className="relative">
                   <select 
                      value={row.status}
                      disabled={readOnly}
                      onChange={(e) => updateRow(row.id, 'status', e.target.value)}
                      className={`w-full md:w-52 pl-3 pr-8 py-2 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer appearance-none transition-all
                        ${row.status === Status.PENDING ? 'border-slate-300 text-slate-600 bg-white' : ''}
                        ${row.status === Status.FAKE_COMMITMENT ? 'border-red-300 text-red-700 bg-red-50' : ''}
                        ${row.status === Status.DISHONORED ? 'border-pink-300 text-pink-700 bg-pink-50' : ''}
                        ${row.status === Status.PARTIAL_PAYMENT ? 'border-blue-300 text-blue-700 bg-blue-50' : ''}
                        ${row.status === Status.NO_DUES ? 'border-emerald-300 text-emerald-700 bg-emerald-50' : ''}
                      `}
                   >
                      <option value={Status.PENDING}>○ Pending Review</option>
                      <option value={Status.FAKE_COMMITMENT}>● Fake Commitment</option>
                      <option value={Status.DISHONORED}>● Dishonored/Missed</option>
                      <option value={Status.PARTIAL_PAYMENT}>● Partial Payment</option>
                      <option value={Status.NO_DUES}>● No Dues (Cleared)</option>
                   </select>
                   <div className="absolute right-3 top-2.5 pointer-events-none text-current opacity-50">▼</div>
                 </div>
              </div>
            </div>

            {/* Middle Row: Transcript Area */}
            <div className="relative mb-4 group/textarea">
              <textarea 
                placeholder="Call Transcript / Commitments / Reasons..."
                readOnly={readOnly}
                className="w-full p-4 pr-10 rounded-lg border border-slate-200/80 bg-white text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y text-slate-700 leading-relaxed shadow-sm"
                value={row.transcript}
                onChange={(e) => updateRow(row.id, 'transcript', e.target.value)}
              />
              {!readOnly && (
                <button 
                  onClick={() => handleAnalyze(row)}
                  disabled={!row.transcript || analyzingId === row.id}
                  className="absolute right-2 top-2 p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Analyze with AI"
                >
                  {analyzingId === row.id ? <div className="animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full" /> : <Wand2 size={16} />}
                </button>
              )}
            </div>

            {/* Bottom Row: Branch, Date, Amount, Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[200px] relative group">
                 <Briefcase className="absolute left-3 top-2.5 text-slate-400 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Problem Summary / Branch"
                    readOnly={readOnly}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200/60 bg-white/50 text-sm focus:outline-none focus:border-emerald-500 text-slate-600"
                    value={row.branchOrProfile}
                    onChange={(e) => updateRow(row.id, 'branchOrProfile', e.target.value)}
                  />
              </div>

              <div className="relative w-40 group">
                  <Calendar className="absolute left-3 top-2.5 text-slate-400 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="date" 
                    readOnly={readOnly}
                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-200/60 bg-white/50 text-sm focus:outline-none focus:border-emerald-500 text-slate-600"
                    value={row.date}
                    onChange={(e) => updateRow(row.id, 'date', e.target.value)}
                  />
              </div>

              <div className="relative w-36 group">
                  <IndianRupee className="absolute left-3 top-2.5 text-slate-400 w-4 h-4 group-focus-within:text-emerald-500 transition-colors" />
                  <input 
                    type="number" 
                    placeholder="Amount"
                    readOnly={readOnly}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200/60 bg-white/50 text-sm focus:outline-none focus:border-emerald-500 font-bold text-slate-700"
                    value={row.amount}
                    onChange={(e) => updateRow(row.id, 'amount', e.target.value)}
                  />
              </div>

              {!readOnly && (
                <button 
                  onClick={() => handleDelete(row.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto border border-transparent hover:border-red-100"
                  title="Delete Row"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};