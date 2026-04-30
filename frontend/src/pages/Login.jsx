import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useApp();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username) return setError('Pilih atau masukkan username!');
    if (pin.length < 6) return setError('PIN harus 6 digit!');
    
    setError('');
    const success = await login(username, pin); // Mengirim Username dan PIN sesuai urutan di AppContext
    if (!success) setError('Username atau PIN salah!');
  };

  const addDigit = (d) => {
    if (pin.length < 6) setPin(pin + d);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 relative overflow-hidden font-['Outfit']">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 left-1/4 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl shadow-2xl shadow-indigo-500/20 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter mb-1">Smart Wallet</h1>
          <p className="text-slate-400 text-sm font-medium">Secured Personal Finance</p>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Account Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* PIN Input */}
            <div className="space-y-3">
              <label className="block text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Enter 6-Digit PIN</label>
              <div className="flex justify-center gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`w-10 h-14 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${pin.length > i ? 'bg-indigo-600 border-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)] scale-105' : 'bg-slate-900/50 border-slate-700'}`}>
                    {pin.length > i && <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>}
                  </div>
                ))}
              </div>
              {error && <p className="text-rose-400 text-[10px] font-bold text-center animate-bounce">{error}</p>}
            </div>

            {/* Custom PIN Pad */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} type="button" onClick={() => addDigit(n.toString())} className="h-14 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-white text-lg font-black transition-all active:scale-90 border border-white/5">{n}</button>
              ))}
              <button type="button" onClick={() => setPin('')} className="h-14 rounded-xl bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 active:scale-90 border border-rose-500/10">Clear</button>
              <button type="button" onClick={() => addDigit('0')} className="h-14 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-white text-lg font-black transition-all active:scale-90 border border-white/5">0</button>
              <button type="button" onClick={() => setPin(pin.slice(0, -1))} className="h-14 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-white flex items-center justify-center transition-all active:scale-90 border border-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
              </button>
            </div>

            <button
              type="submit"
              disabled={pin.length < 6 || !username || isLoading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-900/40 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:grayscale transition-all text-xs"
            >
              {isLoading ? 'Verifying...' : 'Unlock Wallet'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          &copy; 2026 Ares Personal Finance
        </p>
      </div>
    </div>
  );
};

export default Login;
