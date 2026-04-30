import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatCurrencyInput as fmtInput, cleanNumber } from '../utils/helpers';
import api from '../services/api';

const BANK_TYPES = [
  { id: 'bank', label: 'Bank', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'ewallet', label: 'E-Wallet', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { id: 'emoney', label: 'E-Money', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { id: 'cash', label: 'Tunai', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'paylater', label: 'Paylater', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z' },
  { id: 'cc', label: 'CC', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
];

const TYPE_COLORS = {
  bank: { bg: 'from-indigo-600 to-violet-700', light: 'bg-indigo-100 text-indigo-600' },
  ewallet: { bg: 'from-teal-600 to-emerald-700', light: 'bg-teal-100 text-teal-600' },
  emoney: { bg: 'from-amber-500 to-orange-600', light: 'bg-amber-100 text-amber-600' },
  cash: { bg: 'from-emerald-600 to-green-700', light: 'bg-emerald-100 text-emerald-600' },
  paylater: { bg: 'from-rose-600 to-pink-700', light: 'bg-rose-100 text-rose-600' },
  cc: { bg: 'from-slate-700 to-slate-900', light: 'bg-slate-100 text-slate-600' },
};

const Bank = () => {
  const { banks, isBalanceHidden, loadAllData } = useApp();
  const [bankType, setBankType] = useState('bank');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [saving, setSaving] = useState(false);

  const totalBalance = useMemo(() => banks.reduce((s, b) => s + (parseFloat(b.balance) || 0), 0), [banks]);
  const fmt = (v) => formatCurrency(v, isBalanceHidden);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;
    setSaving(true);
    try {
      await api.call('saveBank', { name, balance: cleanNumber(balance), type: bankType });
      setName(''); setBalance('');
      await loadAllData();
    } catch (err) { alert('Gagal: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Akun Bank & Saldo</h1>
        <p className="text-slate-500 mt-1">Kelola sumber dana — Rekening Bank, E-Wallet, atau Dompet Tunai.</p>
      </header>

      {/* Hero Balance */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-xl">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Saldo Semua Akun</p>
        <h2 className="text-3xl font-extrabold tracking-tight">{fmt(totalBalance)}</h2>
        <p className="text-xs text-slate-500 mt-1">{banks.length} akun terdaftar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">Tambah Akun Baru</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {BANK_TYPES.map(t => (
                <button key={t.id} onClick={() => setBankType(t.id)} className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 text-xs font-bold transition-all ${bankType === t.id ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-transparent bg-slate-50 text-slate-400 opacity-60 hover:opacity-100'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={t.icon} /></svg>
                  {t.label}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Nama Akun" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none" />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                <input type="text" value={balance} onChange={e => setBalance(fmtInput(e.target.value))} placeholder="Saldo Awal" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none" />
              </div>
              <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Tambah Akun'}
              </button>
            </form>
          </div>
        </div>

        {/* Bank Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {banks.length === 0 ? (
            <p className="text-slate-400 text-sm text-center col-span-2 py-12">Belum ada akun bank.</p>
          ) : banks.map((b, i) => {
            const color = TYPE_COLORS[b.type] || TYPE_COLORS.bank;
            return (
              <div key={b.id || i} className={`bg-gradient-to-br ${color.bg} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all`}>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <p className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">{b.type || 'bank'}</p>
                <h3 className="text-lg font-bold tracking-tight mb-3">{b.name}</h3>
                <p className="text-2xl font-extrabold">{fmt(parseFloat(b.balance) || 0)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bank;
