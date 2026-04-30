import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const Portofolio = () => {
  const { deposits, cryptos, isBalanceHidden } = useApp();
  const fmt = (v) => formatCurrency(v, isBalanceHidden);

  const totalDepo = useMemo(() => (deposits || []).reduce((s, d) => s + (parseFloat(d.amount) || 0), 0), [deposits]);
  const totalCrypto = useMemo(() => (cryptos || []).reduce((s, c) => s + (parseFloat(c.current_value) || 0), 0), [cryptos]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Portofolio & Aset</h1>
        <p className="text-slate-500 mt-1">Kelola deposito dan aset kripto Anda.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-xs text-violet-200 font-bold uppercase tracking-widest mb-1">Total Portofolio</p>
          <h2 className="text-2xl font-extrabold">{fmt(totalDepo + totalCrypto)}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Deposito</p>
          <h2 className="text-xl font-extrabold text-violet-600">{fmt(totalDepo)}</h2>
          <p className="text-xs text-slate-400 mt-1">{(deposits || []).length} deposito</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Kripto</p>
          <h2 className="text-xl font-extrabold text-amber-600">{fmt(totalCrypto)}</h2>
          <p className="text-xs text-slate-400 mt-1">{(cryptos || []).length} aset</p>
        </div>
      </div>

      {/* Deposits List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Deposito</h3>
        <div className="space-y-3">
          {(deposits || []).length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Belum ada deposito.</p>
          ) : (deposits || []).map((d, i) => (
            <div key={d.id || i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-violet-50/50 transition-all">
              <div>
                <p className="text-sm font-bold text-slate-800">{d.bank_name || d.name || 'Deposito'}</p>
                <p className="text-xs text-slate-400">Bunga {d.rate || 0}% · Jatuh tempo {d.maturity_date || '-'}</p>
              </div>
              <span className="text-sm font-bold text-violet-600">{fmt(parseFloat(d.amount) || 0)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Crypto List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Aset Kripto</h3>
        <div className="space-y-3">
          {(cryptos || []).length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Belum ada aset kripto.</p>
          ) : (cryptos || []).map((c, i) => (
            <div key={c.id || i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-amber-50/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold text-sm">{(c.symbol || c.name || '?')[0]}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{c.name || c.symbol}</p>
                  <p className="text-xs text-slate-400">{c.amount || 0} {c.symbol || ''}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-amber-600">{fmt(parseFloat(c.current_value) || 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portofolio;
