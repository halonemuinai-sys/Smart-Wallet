import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getCurrentMonth } from '../utils/helpers';

const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

const Report = () => {
  const { transactions, isBalanceHidden } = useApp();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const fmt = (v) => formatCurrency(v, isBalanceHidden);
  const prefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  const stats = useMemo(() => {
    const monthTx = transactions.filter(t => t.date && t.date.startsWith(prefix));
    const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    const net = income - expense;
    const savingRate = income > 0 ? Math.round((net / income) * 100) : 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const avgDaily = daysInMonth > 0 ? Math.round(expense / daysInMonth) : 0;

    // Category breakdown
    const catMap = {};
    monthTx.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category || 'Lainnya';
      catMap[cat] = (catMap[cat] || 0) + (parseFloat(t.amount) || 0);
    });
    const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 8);

    return { income, expense, net, savingRate, avgDaily, topCats, totalTx: monthTx.length };
  }, [transactions, prefix, year, month]);

  const years = useMemo(() => {
    const set = new Set(transactions.map(t => t.date?.slice(0, 4)).filter(Boolean));
    set.add(String(now.getFullYear()));
    return [...set].sort().reverse();
  }, [transactions]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Laporan & Analisa</h1>
          <p className="text-slate-500 mt-1">Pantau tren dan performa keuangan Anda secara mendalam.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </header>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pemasukan</p>
          <p className="text-xl font-extrabold text-emerald-600">{fmt(stats.income)}</p>
          <div className="mt-2 h-1 w-8 bg-emerald-500 rounded-full"></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-rose-200 transition-all">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pengeluaran</p>
          <p className="text-xl font-extrabold text-rose-600">{fmt(stats.expense)}</p>
          <div className="mt-2 h-1 w-8 bg-rose-500 rounded-full"></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Tabungan</p>
          <p className={`text-xl font-extrabold ${stats.net >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>{fmt(stats.net)}</p>
          <div className="mt-2 h-1 w-8 bg-indigo-500 rounded-full"></div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-200 transition-all">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saving Rate</p>
          <p className="text-xl font-extrabold text-slate-800">{isBalanceHidden ? '●●' : `${stats.savingRate}%`}</p>
          <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 transition-all" style={{ width: `${Math.min(stats.savingRate, 100)}%` }}></div></div>
        </div>
      </div>

      {/* Insight + Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <h3 className="text-lg font-bold mb-2">Insight Finansial</h3>
          <p className="text-indigo-100 text-sm leading-relaxed mb-4">
            {stats.income > 0 ? `Anda menghabiskan ${Math.round((stats.expense / stats.income) * 100)}% dari pemasukan bulan ini.` : 'Belum ada pemasukan tercatat.'}
          </p>
          <div className="flex gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Rata-rata/Hari</p>
              <p className="text-lg font-bold">{fmt(stats.avgDaily)}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <p className="text-[10px] font-bold text-indigo-200 uppercase mb-1">Transaksi</p>
              <p className="text-lg font-bold">{stats.totalTx}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Kategori Pengeluaran</h3>
          <div className="space-y-3">
            {stats.topCats.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Belum ada data.</p>
            ) : stats.topCats.map(([cat, val], i) => {
              const pct = stats.expense > 0 ? Math.round((val / stats.expense) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{cat}</span>
                    <span className="font-bold text-slate-800">{fmt(val)} <span className="text-slate-400 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
