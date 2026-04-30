import React from 'react';
import { useApp } from '../context/AppContext';

const Profile = () => {
  const { user, logout } = useApp();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Profil Pengguna</h1>
        <p className="text-slate-500 mt-1">Kelola akun dan keamanan Anda.</p>
      </header>

      <div className="max-w-lg">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-extrabold">
              {(user?.username || '?')[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">{user?.username || 'User'}</h3>
              <p className="text-sm text-slate-400">Smart Wallet User</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Username</p>
              <p className="text-sm font-bold text-slate-800">{user?.username || '-'}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">PIN</p>
              <p className="text-sm font-bold text-slate-800">●●●●●●</p>
            </div>
          </div>

          <button onClick={logout} className="w-full mt-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Keluar (Logout)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
