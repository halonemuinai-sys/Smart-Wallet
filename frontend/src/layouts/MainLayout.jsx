import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useApp } from '../context/AppContext';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isBalanceHidden, toggleBalanceVisibility, isLoading, user } = useApp();
  const location = useLocation();

  return (
    <div className="flex h-screen w-full bg-[#fcfdfe] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 glass border-b border-slate-200/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden md:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Welcome back,</p>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{user?.username || 'User'} 👋</h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoading && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 shadow-sm animate-pulse">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce"></div>
                <span className="text-[10px] font-black uppercase tracking-wider">Syncing Data</span>
              </div>
            )}
            
            <button 
              onClick={toggleBalanceVisibility} 
              className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all shadow-sm group"
              title={isBalanceHidden ? 'Tampilkan Saldo' : 'Sembunyikan Saldo'}
            >
              {isBalanceHidden ? (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
              ) : (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              )}
            </button>

            <div className="w-px h-6 bg-slate-200"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                <p className="text-xs font-bold text-emerald-600 leading-none">Online</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-100 border-2 border-white">
                {(user?.username || '?')[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="p-6 md:p-10 animate-fade-in" key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
