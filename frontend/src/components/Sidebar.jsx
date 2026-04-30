import React from 'react';
import { NavLink } from 'react-router-dom';

const MENU = [
  { path: '/', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z', color: 'indigo' },
  { path: '/pemasukan', label: 'Pemasukan', icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', color: 'emerald' },
  { path: '/pengeluaran', label: 'Pengeluaran', icon: 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6', color: 'rose' },
  { path: '/laporan', label: 'Laporan & Analisa', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'violet' },
  { path: '/bank', label: 'Akun Bank', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', color: 'blue' },
  { path: '/portofolio', label: 'Portofolio', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'purple' },
  { path: '/ecommerce', label: 'E-Commerce', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', color: 'amber' },
  { path: '/subscription', label: 'Subscription', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', color: 'pink' },
  { path: '/inventory', label: 'Inventory Aset', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: 'teal' },
  { path: '/budget', label: 'Budgeting', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'emerald' },
  { path: '/konfigurasi', label: 'Konfigurasi', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', color: 'slate' },
  { path: '/profil', label: 'Profil Pengguna', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', color: 'slate' },
];

const colorMap = {
  indigo: 'text-indigo-600',
  emerald: 'text-emerald-600',
  rose: 'text-rose-600',
  violet: 'text-violet-600',
  blue: 'text-blue-600',
  purple: 'text-purple-600',
  amber: 'text-amber-600',
  pink: 'text-pink-600',
  teal: 'text-teal-600',
  slate: 'text-slate-600',
};

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 md:hidden" />
      )}

      <aside className={`fixed md:relative w-72 h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col z-50 shadow-2xl md:shadow-none transform transition-all duration-500 ease-out shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="p-3 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">Smart</span>
              <span className="text-xl font-black text-indigo-600 tracking-tighter leading-none">Wallet</span>
            </div>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-xl">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-3 mb-4">Menu Utama</div>
          {MENU.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-50 to-indigo-100/50 text-indigo-700 shadow-sm shadow-indigo-100/20'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-white shadow-sm scale-110' : 'bg-slate-50 group-hover:bg-white group-hover:scale-110 group-hover:shadow-sm'}`}>
                    <svg className={`w-5 h-5 ${isActive ? colorMap[item.color] : 'text-slate-400 group-hover:' + colorMap[item.color]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                    </svg>
                  </div>
                  <span className="text-sm tracking-tight">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-400 animate-pulse"></div>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-5 text-white shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
             <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">PRO VERSION</p>
             <p className="text-xs font-medium leading-relaxed">Upgrade to unlock advanced analytics.</p>
             <button className="mt-3 w-full bg-white text-indigo-700 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-indigo-50 transition-colors">Upgrade Now</button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
