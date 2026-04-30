import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const Subscription = () => {
  const { subscriptions, isBalanceHidden } = useApp();
  const fmt = (v) => formatCurrency(v, isBalanceHidden);
  const totalMonthly = useMemo(() => (subscriptions || []).reduce((s, sub) => s + (parseFloat(sub.cost) || 0), 0), [subscriptions]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Subscription</h1>
        <p className="text-slate-500 mt-1">Kelola langganan digital dan tagihan rutin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-xs text-violet-200 font-bold uppercase tracking-widest mb-1">Total Biaya/Bulan</p>
          <h2 className="text-2xl font-extrabold">{fmt(totalMonthly)}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Aktif</p>
          <h2 className="text-xl font-extrabold text-slate-800">{(subscriptions || []).filter(s => s.status === 'active').length}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Langganan</p>
          <h2 className="text-xl font-extrabold text-slate-800">{(subscriptions || []).length}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Daftar Langganan</h3>
        <div className="space-y-3">
          {(subscriptions || []).length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Belum ada langganan.</p>
          ) : (subscriptions || []).map((s, i) => (
            <div key={s.id || i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-violet-50/50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center font-bold text-sm">{(s.name || '?')[0]}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.category || 'Langganan'} · {s.billing_cycle || 'Bulanan'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-violet-600">{fmt(parseFloat(s.cost) || 0)}</span>
                <p className={`text-[10px] font-bold ${s.status === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>{s.status === 'active' ? 'Aktif' : 'Nonaktif'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
