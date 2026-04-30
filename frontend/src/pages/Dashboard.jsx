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
    const totalDepo = (deposits || []).reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);
    const totalCrypto = (cryptos || []).reduce((s, c) => s + (parseFloat(c.current_value) || 0), 0);
    const netWorth = totalBalance + totalDepo + totalCrypto;
    const remaining = income - expense;
    const savingRate = income > 0 ? Math.round((remaining / income) * 100) : 0;
    const recentTx = [...transactions].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 6);

    return { income, expense, totalBalance, remaining, savingRate, totalDepo, totalCrypto, netWorth, recentTx };
  }, [transactions, banks, deposits, cryptos, currentMonth]);

  const fmt = (val) => formatCurrency(val, isBalanceHidden);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">Overview</h1>
          <p className="text-slate-500 font-medium text-lg">Financial snapshot for <span className="text-indigo-600 font-bold">{getMonthLabel(currentMonth)}</span></p>
        </div>
        <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1">
          <button className="px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg">Monthly</button>
          <button className="px-4 py-2 text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-50">Yearly</button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Total Net Worth Card (Large) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
          <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-black/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">Total Net Worth</span>
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              </div>
              <h2 className="text-6xl font-black tracking-tighter mb-2">{fmt(stats.netWorth)}</h2>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Liquid Cash</span>
                  <span className="text-lg font-bold">{fmt(stats.totalBalance)}</span>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Investments</span>
                  <span className="text-lg font-bold">{fmt(stats.totalDepo + stats.totalCrypto)}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex items-center justify-between">
              <div className="flex -space-x-3">
                {banks.slice(0, 3).map((b, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-xs shadow-xl">{b.name[0]}</div>
                ))}
                {banks.length > 3 && <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center font-black text-[10px] border border-white/20">+{banks.length - 3}</div>}
              </div>
              <button className="px-6 py-3 bg-white text-indigo-700 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl hover:bg-indigo-50 transition-all active:scale-95">Portfolio Details</button>
            </div>
          </div>
        </div>

        {/* Small Stats Cards */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
          <div className="bg-emerald-500 rounded-[2rem] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </div>
            <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.2em] mb-1">Monthly Income</p>
            <h3 className="text-3xl font-black tracking-tight">{fmt(stats.income)}</h3>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-emerald-400/30 rounded-lg text-[10px] font-bold">+12% vs last month</span>
            </div>
          </div>

          <div className="bg-rose-500 rounded-[2rem] p-8 text-white shadow-xl shadow-rose-100 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
            </div>
            <p className="text-[10px] font-black text-rose-100 uppercase tracking-[0.2em] mb-1">Monthly Spending</p>
            <h3 className="text-3xl font-black tracking-tight">{fmt(stats.expense)}</h3>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-rose-400/30 rounded-lg text-[10px] font-bold">Within budget</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Saving Rate Card */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm premium-card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Saving Rate</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Monthly efficiency</p>
            </div>
            <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
          </div>
          
          <div className="flex items-center justify-center py-4">
             <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * stats.savingRate / 100)} className="text-violet-600 stroke-round transition-all duration-1000" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-900">{isBalanceHidden ? '●●' : `${stats.savingRate}%`}</span>
                </div>
             </div>
          </div>
          
          <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed px-4">
            You've saved <span className="text-violet-600 font-black">{fmt(stats.remaining)}</span> this month. Great job keeping expenses low!
          </p>
        </div>

        {/* Recent Transactions Card (Wide) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm premium-card">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Your latest movements</p>
            </div>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors">View All</button>
          </div>

          <div className="space-y-3">
            {stats.recentTx.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-slate-400 text-sm font-bold">No transactions recorded yet.</p>
              </div>
            ) : stats.recentTx.map((tx, i) => (
              <div key={tx.id || i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl transition-all duration-300 ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tx.type === 'income' ? 'M12 6v6m0 0v6m0-6h6m-6 0H6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{tx.category || 'Other'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tx.date} · {tx.description || '-'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(parseFloat(tx.amount) || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
