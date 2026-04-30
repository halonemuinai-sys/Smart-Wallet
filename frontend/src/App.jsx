import React, { useState } from 'react';
import Pemasukan from './components/Pemasukan';
import Pengeluaran from './components/Pengeluaran';

function App() {
  const [activeTab, setActiveTab] = useState('pengeluaran');

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              $
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">SmartWallet</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('pemasukan')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'pemasukan' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Pemasukan
            </button>
            <button 
              onClick={() => setActiveTab('pengeluaran')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'pengeluaran' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              Pengeluaran
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {activeTab === 'pemasukan' ? <Pemasukan /> : <Pengeluaran />}
      </main>
    </div>
  );
}

export default App;
