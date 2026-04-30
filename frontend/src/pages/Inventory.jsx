import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';

const Inventory = () => {
  const { inventory, isBalanceHidden } = useApp();
  const fmt = (v) => formatCurrency(v, isBalanceHidden);
  const totalValue = useMemo(() => (inventory || []).reduce((s, item) => s + (parseFloat(item.value) || parseFloat(item.price) || 0), 0), [inventory]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory Aset</h1>
        <p className="text-slate-500 mt-1">Catat aset fisik dan digital yang Anda miliki.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-xs text-teal-100 font-bold uppercase tracking-widest mb-1">Total Nilai Aset</p>
          <h2 className="text-2xl font-extrabold">{fmt(totalValue)}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Jumlah Aset</p>
          <h2 className="text-xl font-extrabold text-slate-800">{(inventory || []).length}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Kategori</p>
          <h2 className="text-xl font-extrabold text-slate-800">{new Set((inventory || []).map(i => i.category)).size}</h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Daftar Aset</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(inventory || []).length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8 col-span-full">Belum ada aset.</p>
          ) : (inventory || []).map((item, i) => (
            <div key={item.id || i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-teal-50/50 transition-all">
              <p className="text-sm font-bold text-slate-800 mb-1">{item.name}</p>
              <p className="text-xs text-slate-400 mb-2">{item.category || '-'} · {item.purchase_date || '-'}</p>
              <p className="text-sm font-bold text-teal-600">{fmt(parseFloat(item.value) || parseFloat(item.price) || 0)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
