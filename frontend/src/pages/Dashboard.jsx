import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getCurrentMonth, getMonthLabel } from '../utils/helpers';

const Dashboard = () => {
  const { transactions, banks, isBalanceHidden, deposits, cryptos } = useApp();

  const currentMonth = getCurrentMonth();

  const stats = useMemo(() => {
    const monthTx = transactions.filter(t => t.date && t.date.startsWith(currentMonth));
    const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    const expense = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
    const totalBalance = banks.reduce((s, b) => s + (parseFloat(b.balance) || 0), 0);
    const remaining = income - expense;
    const savingRate = income > 0 ? Math.round((remaining / income) * 100) : 0;
    const totalDiscount = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.discount) || 0), 0);
    const totalDepo = (deposits || []).reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
    const totalCrypto = (cryptos || []).reduce((s, c) => s + (parseFloat(c.current_value) || 0), 0);
    const netWorth = totalBalance + totalDepo + totalCrypto;
    const recentTx = [...transactions].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 8);

    return { income, expense, totalBalance, remaining, savingRate, totalDiscount, totalDepo, totalCrypto, netWorth, recentTx };
  }, [transactions, banks, deposits, cryptos, currentMonth]);

  const fmt = (val) => formatCurrency(val, isBalanceHidden);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-6 hidden md:block">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-500 mt-0.5">Ringkasan keuangan Anda bulan <span className="font-semibold text-indigo-600">{getMonthLabel(currentMonth)}</span></p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Net Cash Flow</p>
            <p className={`text-xl font-extrabold tracking-tight ${stats.remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmt(stats.remaining)}</p>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Total Saldo */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 shadow-lg text-white relative overflow-hidden col-span-2 md:col-span-1">
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 opacity-60"></div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Saldo</p>
          <h2 className="text-xl font-extrabold tracking-tight">{fmt(stats.totalBalance)}</h2>
          <p className="text-[9px] text-slate-500 mt-1">{banks.length} Akun</p>
        </div>

        {/* Pemasukan */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-emerald-200 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pemasukan</p>
          </div>
          <h2 className="text-xl font-extrabold text-emerald-600 tracking-tight">{fmt(stats.income)}</h2>
        </div>

        {/* Pengeluaran */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-rose-200 transition-all">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pengeluaran</p>
          </div>
          <h2 className="text-xl font-extrabold text-rose-600 tracking-tight">{fmt(stats.expense)}</h2>
        </div>

        {/* Sisa Budget */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-indigo-200 transition-all">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sisa Budget</p>
          <h2 className={`text-xl font-extrabold tracking-tight ${stats.remaining >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>{fmt(stats.remaining)}</h2>
        </div>

        {/* Total Hemat */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-emerald-200 transition-all">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Hemat</p>
          <h2 className="text-xl font-extrabold text-emerald-600 tracking-tight">{fmt(stats.totalDiscount)}</h2>
        </div>

        {/* Total Hutang */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:border-rose-200 transition-all">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Hutang</p>
          <h2 className="text-xl font-extrabold text-rose-600 tracking-tight">{fmt(0)}</h2>
        </div>

        {/* Saving Rate */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 shadow-lg text-white">
          <p className="text-[9px] font-bold text-violet-200 uppercase tracking-widest mb-2">Saving Rate</p>
          <h2 className="text-2xl font-extrabold tracking-tight">{isBalanceHidden ? '●●' : `${stats.savingRate}%`}</h2>
          <p className="text-[10px] text-violet-300 mt-0.5">% tersisa dari pemasukan</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Transaksi Terakhir</h3>
        <div className="space-y-2">
          {stats.recentTx.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Belum ada transaksi.</p>
          ) : (
            stats.recentTx.map((tx, i) => (
              <div key={tx.id || i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tx.type === 'income' ? 'M12 6v6m0 0v6m0-6h6m-6 0H6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{tx.category || 'Lainnya'}</p>
                    <p className="text-xs text-slate-400">{tx.date} · {tx.description || '-'}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{fmt(parseFloat(tx.amount) || 0)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
