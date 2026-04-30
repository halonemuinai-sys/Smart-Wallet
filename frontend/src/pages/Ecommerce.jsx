import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const Ecommerce = () => {
  const { ecommerce, isBalanceHidden } = useApp();
  const fmt = (v) => formatCurrency(v, isBalanceHidden);
  const totalSpending = useMemo(() => (ecommerce || []).reduce((s, e) => s + (parseFloat(e.total) || 0), 0), [ecommerce]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">E-Commerce</h1>
        <p className="text-slate-500 mt-1">Tracking belanja marketplace Anda.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-xs text-amber-100 font-bold uppercase tracking-widest mb-1">Total Belanja</p>
          <h2 className="text-2xl font-extrabold">{fmt(totalSpending)}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Order</p>
          <h2 className="text-xl font-extrabold text-slate-800">{(ecommerce || []).length}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Platform</p>
          <h2 className="text-xl font-extrabold text-slate-800">{new Set((ecommerce || []).map(e => e.platform)).size}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Riwayat Order</h3>
        <div className="space-y-3">
          {(ecommerce || []).length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">Belum ada data e-commerce.</p>
          ) : (ecommerce || []).map((e, i) => (
            <div key={e.id || i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-amber-50/50 transition-all">
              <div>
                <p className="text-sm font-bold text-slate-800">{e.item_name || e.name || 'Order'}</p>
                <p className="text-xs text-slate-400">{e.platform || '-'} · {e.date || '-'}</p>
              </div>
              <span className="text-sm font-bold text-amber-600">{fmt(parseFloat(e.total) || 0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ecommerce;
