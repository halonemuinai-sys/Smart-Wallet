import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, getCurrentMonth, getMonthLabel } from '../utils/helpers';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const { transactions, banks, isBalanceHidden, deposits, cryptos, categories, budget } = useApp();
  const currentMonth = getCurrentMonth();
  const [yearStr, monthStr] = currentMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;

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
    const recentTx = [...transactions].sort((a, b) => (b.date || '').localeCompare(a.date || '')).slice(0, 5);

    // Prepare Daily Chart Data
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let cumulativeNet = 0;
    const dailyChart = Array.from({length: daysInMonth}, (_, i) => {
      const d = String(i + 1).padStart(2, '0');
      const dateStr = `${currentMonth}-${d}`;
      const dayTx = monthTx.filter(t => t.date === dateStr);
      const inc = dayTx.filter(t => t.type === 'income').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
      const exp = dayTx.filter(t => t.type === 'expense').reduce((s, t) => s + (parseFloat(t.amount) || 0), 0);
      cumulativeNet += (inc - exp);
      return { day: d, Income: inc, Expense: exp, Net: cumulativeNet };
    });

    // Top Categories
    const catMap = {};
    monthTx.filter(t => t.type === 'expense').forEach(t => {
      const cat = t.category || 'Other';
      catMap[cat] = (catMap[cat] || 0) + (parseFloat(t.amount) || 0);
    });
    const topCats = Object.entries(catMap).sort((a,b) => b[1]-a[1]).slice(0, 4);

    return { income, expense, totalBalance, remaining, savingRate, totalDepo, totalCrypto, netWorth, recentTx, dailyChart, topCats };
  }, [transactions, banks, deposits, cryptos, currentMonth, year, month]);

  const fmt = (val) => formatCurrency(val, isBalanceHidden);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl text-xs font-bold text-white">
          <p className="mb-1 text-slate-400">Date: {label} {getMonthLabel(currentMonth)}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Financial Overview</h1>
          <p className="text-slate-500 font-medium text-sm">Real-time insights for <span className="text-indigo-600 font-bold">{getMonthLabel(currentMonth)}</span></p>
        </div>
      </div>

      {/* BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* 1. NET WORTH HERO (Col: 8, Row: 1) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] rounded-[2rem] p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
          {/* Decorative Ornaments */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Total Net Worth</span>
              </div>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors backdrop-blur-sm border border-white/5">
                 <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
              </button>
            </div>
            
            <div className="mt-4 mb-8">
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200 drop-shadow-lg">
                {fmt(stats.netWorth)}
              </h2>
              <div className="flex items-center gap-4 mt-6">
                <div className="px-4 py-2 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-md">
                  <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-widest mb-0.5">Liquid Cash</p>
                  <p className="text-base font-bold text-white">{fmt(stats.totalBalance)}</p>
                </div>
                <div className="px-4 py-2 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-md">
                  <p className="text-[9px] text-violet-300 font-bold uppercase tracking-widest mb-0.5">Investments</p>
                  <p className="text-base font-bold text-white">{fmt(stats.totalDepo + stats.totalCrypto)}</p>
                </div>
              </div>
            </div>

            {/* Sparkline Chart */}
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-40 mix-blend-screen pointer-events-none">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyChart}>
                  <defs>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="Net" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 2. INCOME & EXPENSE (Col: 4, Row: 1) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Income Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex-1 relative overflow-hidden group hover:border-emerald-200 transition-all premium-card">
            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Income</p>
                <h3 className="text-2xl font-black text-emerald-600 tracking-tight">{fmt(stats.income)}</h3>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                 12.5%
               </span>
               <span className="text-[10px] text-slate-400 font-bold">vs last month</span>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex-1 relative overflow-hidden group hover:border-rose-200 transition-all premium-card">
            <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Spending</p>
                <h3 className="text-2xl font-black text-rose-600 tracking-tight">{fmt(stats.expense)}</h3>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
               <div className="h-full bg-rose-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-2">65% of budget used</p>
          </div>
        </div>

        {/* 3. CASH FLOW CHART (Col: 8, Row: 2) */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 premium-card flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Cash Flow Analysis</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Income vs Expense over time</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Income</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div><span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expense</span></div>
            </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyChart} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }} />
                <Area type="monotone" dataKey="Income" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorInc)" />
                <Area type="monotone" dataKey="Expense" stroke="#fb7185" strokeWidth={3} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. SAVING RATE (Col: 4, Row: 2) */}
        <div className="lg:col-span-4 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 premium-card flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl pointer-events-none"></div>
           <h3 className="text-lg font-black text-slate-900 tracking-tight w-full text-left mb-2">Saving Rate</h3>
           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest w-full text-left mb-8">Efficiency Score</p>
           
           <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 filter drop-shadow-xl">
                {/* Background Track */}
                <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-slate-100" />
                {/* Progress */}
                <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="18" fill="transparent" strokeDasharray={540} strokeDashoffset={540 - (540 * Math.min(stats.savingRate, 100) / 100)} className="text-violet-600 stroke-round transition-all duration-1500 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center bg-white w-32 h-32 rounded-full shadow-inner border border-slate-50">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{isBalanceHidden ? '●●' : `${stats.savingRate}%`}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Saved</span>
              </div>
           </div>
           
           <p className="text-sm font-bold text-slate-600 mt-8 bg-slate-50 px-4 py-2 rounded-xl">
             You saved <span className="text-violet-600 font-black">{fmt(stats.remaining)}</span>
           </p>
        </div>

        {/* 5. TOP CATEGORIES (Col: 6, Row: 3) */}
        <div className="lg:col-span-6 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 premium-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Top Expenses</h3>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">Details</button>
          </div>
          <div className="space-y-5">
            {stats.topCats.length === 0 ? (
              <p className="text-slate-400 text-sm font-bold text-center py-6">No expenses yet.</p>
            ) : stats.topCats.map(([cat, val], i) => {
              const pct = stats.expense > 0 ? Math.round((val / stats.expense) * 100) : 0;
              return (
                <div key={cat} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-black text-slate-800">{cat}</span>
                    <div className="text-right">
                      <span className="text-sm font-black text-rose-600">{fmt(val)}</span>
                      <span className="text-[10px] font-bold text-slate-400 ml-2">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full group-hover:shadow-[0_0_10px_rgba(225,29,72,0.5)] transition-all duration-500" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. RECENT TRANSACTIONS (Col: 6, Row: 3) */}
        <div className="lg:col-span-6 bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 premium-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity</h3>
            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">View All</button>
          </div>
          <div className="space-y-1">
            {stats.recentTx.length === 0 ? (
              <p className="text-slate-400 text-sm font-bold text-center py-6">No transactions.</p>
            ) : stats.recentTx.map((tx, i) => (
              <div key={tx.id || i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white' : 'bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tx.type === 'income' ? 'M12 6v6m0 0v6m0-6h6m-6 0H6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{tx.category || 'Other'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tx.date} {tx.description ? `· ${tx.description}` : ''}</p>
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
