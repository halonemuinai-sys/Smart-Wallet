import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatCurrencyInput as fmtInput, cleanNumber } from '../utils/helpers';
import api from '../services/api';

const Budget = () => {
  const { budget, setBudget, transactions, categories, isBalanceHidden, loadAllData } = useApp();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const now = new Date();
  const currentPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const fmt = (v) => formatCurrency(v, isBalanceHidden);
  const expenseCats = useMemo(() => categories.filter(c => c.type === 'expense'), [categories]);
  const monthExpenses = useMemo(() => transactions.filter(t => t.type === 'expense' && t.date?.startsWith(currentPrefix)), [transactions, currentPrefix]);

  const budgetItems = useMemo(() => {
    return (budget || []).map(b => {
      const spent = monthExpenses.filter(t => t.category === b.category).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
      const limit = parseFloat(b.amount) || 0;
      const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      return { ...b, spent, pct };
    });
  }, [budget, monthExpenses]);

  const totalBudget = budgetItems.reduce((s, b) => s + (parseFloat(b.amount) || 0), 0);
  const totalSpent = budgetItems.reduce((s, b) => s + b.spent, 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    setSaving(true);
    try {
      await api.call('saveBudget', { category, amount: cleanNumber(amount) });
      setCategory(''); setAmount('');
      await loadAllData();
    } catch (err) { alert('Gagal: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Budgeting</h1>
        <p className="text-slate-500 mt-1">Kelola budget bulanan per kategori pengeluaran.</p>
      </header>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Budget</p>
          <h2 className="text-xl font-extrabold text-indigo-600">{fmt(totalBudget)}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Terpakai</p>
          <h2 className="text-xl font-extrabold text-rose-600">{fmt(totalSpent)}</h2>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Sisa</p>
          <h2 className={`text-xl font-extrabold ${totalBudget - totalSpent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmt(totalBudget - totalSpent)}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Form */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-800 mb-4">Tambah Budget</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none">
              <option value="">Pilih Kategori...</option>
              {expenseCats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
              <input type="text" value={amount} onChange={e => setAmount(fmtInput(e.target.value))} required placeholder="Limit budget" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none" />
            </div>
            <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50">{saving ? 'Menyimpan...' : 'Tambah Budget'}</button>
          </form>
        </div>

        {/* Budget List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Budget Bulan Ini</h3>
          <div className="space-y-4">
            {budgetItems.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Belum ada budget.</p>
            ) : budgetItems.map((b, i) => (
              <div key={b.id || i} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-slate-800">{b.category}</span>
                  <span className="text-xs font-bold text-slate-500">{fmt(b.spent)} / {fmt(parseFloat(b.amount) || 0)}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${b.pct > 100 ? 'bg-rose-500' : b.pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(b.pct, 100)}%` }}></div>
                </div>
                <p className={`text-xs mt-1 font-bold ${b.pct > 100 ? 'text-rose-500' : b.pct > 80 ? 'text-amber-500' : 'text-emerald-500'}`}>{b.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;
