import React, { useState } from 'react';
import { CommitmentTable } from './components/CommitmentTable';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { YearlyTable } from './components/YearlyTable';
import { INITIAL_YEARS } from './constants';
import { LayoutDashboard, Table2, BarChart3, Wallet, CalendarClock } from 'lucide-react';

function App() {
  const [view, setView] = useState('dashboard');
  const [rows, setRows] = useState([]);
  const [yearlyData, setYearlyData] = useState(
    INITIAL_YEARS.map(year => ({
      id: year,
      year: year,
      q1: '', q2: '', q3: '', q4: ''
    }))
  );

  const NavItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setView(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
        view === id 
          ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20' 
          : 'text-emerald-100/70 hover:bg-emerald-800/50 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-emerald-950 flex-shrink-0 flex flex-col border-r border-emerald-900">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-emerald-900/50">
           <div className="bg-emerald-500 p-2 rounded-lg text-emerald-950 mr-3">
              <Wallet size={20} />
           </div>
           <div>
              <h1 className="text-white font-bold text-lg leading-none">RecoverPro</h1>
              <p className="text-emerald-400 text-xs mt-1">Debt Management</p>
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
           <div className="px-4 py-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Main Menu</div>
           <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
           <NavItem id="tracker" label="Commitment Tracker" icon={Table2} />
           <NavItem id="financials" label="Financial Analysis" icon={BarChart3} />
        </nav>

        {/* User Profile / Bottom */}
        <div className="p-4 border-t border-emerald-900/50">
           <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-900/50 border border-emerald-800/50">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">JD</div>
              <div className="overflow-hidden">
                 <p className="text-sm font-medium text-white truncate">John Doe</p>
                 <p className="text-xs text-emerald-400 truncate">Senior Recovery Officer</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-slate-50">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between flex-shrink-0">
           <h2 className="text-xl font-bold text-slate-800">
             {view === 'dashboard' && 'Executive Dashboard'}
             {view === 'tracker' && 'Commitment Management'}
             {view === 'financials' && 'Financial Outstanding'}
           </h2>
           <div className="flex items-center gap-4 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <CalendarClock size={16} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-hidden p-6 md:p-8">
          <div className="h-full w-full max-w-[1600px] mx-auto">
            
            {/* Conditional Views */}
            {view === 'dashboard' && (
               <Dashboard rows={rows} setRows={setRows} yearlyData={yearlyData} />
            )}

            {view === 'tracker' && (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                  <div className="lg:col-span-9 h-full">
                    <CommitmentTable rows={rows} setRows={setRows} />
                  </div>
                  <div className="lg:col-span-3 h-full">
                    <Sidebar yearlyData={yearlyData} />
                  </div>
               </div>
            )}

            {view === 'financials' && (
               <YearlyTable yearlyData={yearlyData} setYearlyData={setYearlyData} />
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;