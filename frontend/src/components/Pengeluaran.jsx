import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrencyInput as fmtInput, formatCurrency, cleanNumber, getTodayISO } from '../utils/helpers';
import api from '../services/api';

const Pengeluaran = () => {
  const { categories, banks, transactions, isBalanceHidden, loadAllData } = useApp();
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('');
  const [bank, setBank] = useState('');
  const [date, setDate] = useState(getTodayISO());
  const [desc, setDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [filterMonth, setFilterMonth] = useState('');

  // Mengelompokkan Kategori Pengeluaran
  const groupedCategories = useMemo(() => {
    const groups = {};
    categories.filter(c => c.type === 'expense').forEach(cat => {
      const parent = cat.parent || 'Umum';
      if (!groups[parent]) groups[parent] = [];
      groups[parent].push(cat);
    });
    return groups;
  }, [categories]);

  const bankOptions = useMemo(() => banks.map(b => ({ id: b.id, name: b.name })), [banks]);

  const filteredTx = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .filter(t => !filterMonth || (t.date && t.date.startsWith(filterMonth)))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [transactions, filterMonth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !bank || !date) return alert('Lengkapi semua field!');
    setSaving(true);
    try {
      await api.call('saveTransaction', {
        type: 'expense',
        amount: cleanNumber(amount),
        discount: cleanNumber(discount),
        category,
        bank_id: bank,
        date,
        description: desc,
      });
      setAmount(''); setDiscount(''); setCategory(''); setDesc('');
      await loadAllData();
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const fmt = (v) => formatCurrency(v, isBalanceHidden);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-fade-in">
      <header className="mb-8 hidden md:block">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pengeluaran</h1>
        <p className="text-slate-500 font-medium">Lacak setiap rupiah yang Anda keluarkan hari ini.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-rose-50 text-rose-600 rounded-[1.5rem] border border-rose-100 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Catat Belanja</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Entry pengeluaran baru</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Bayar (Net)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-base">Rp</span>
                    <input type="text" value={amount} onChange={e => setAmount(fmtInput(e.target.value))} required placeholder="0" className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 pl-10 text-lg text-slate-900 font-black focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Diskon/Hemat</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-base">Rp</span>
                    <input type="text" value={discount} onChange={e => setDiscount(fmtInput(e.target.value))} placeholder="0" className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 pl-10 text-lg text-rose-600 font-black focus:bg-white outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Kategori</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm font-bold focus:bg-white outline-none cursor-pointer appearance-none">
                    <option value="">Pilih Kategori...</option>
                    {Object.entries(groupedCategories).map(([main, subs]) => (
                      <optgroup key={main} label={main.toUpperCase()} className="font-black text-slate-400 bg-white">
                        {subs.map(s => <option key={s.id} value={s.name} className="text-slate-800 font-bold">{s.name}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Bayar Dari</label>
                  <select value={bank} onChange={e => setBank(e.target.value)} required className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm font-bold focus:bg-white outline-none cursor-pointer appearance-none">
                    <option value="">Pilih Akun...</option>
                    {bankOptions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tanggal</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm font-bold focus:bg-white outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Keterangan</label>
                  <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Opsional..." className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm font-bold focus:bg-white outline-none" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-rose-100 transition-all active:scale-95 disabled:opacity-50">
                {saving ? 'Processing...' : 'Simpan Pengeluaran'}
              </button>
            </form>
          </div>
        </div>

        {/* History Column */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Riwayat</h3>
              <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 bg-slate-50 outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer" />
            </div>
            
            <div className="space-y-3 overflow-y-auto flex-1 max-h-[600px] custom-scrollbar pr-2">
              {filteredTx.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-slate-400 font-bold">Belum ada pengeluaran bulan ini.</p>
                </div>
              ) : filteredTx.map((tx, i) => (
                <div key={tx.id || i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-rose-50/50 transition-all border border-transparent hover:border-rose-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-8 bg-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{tx.category || 'Lainnya'}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tx.date} · {tx.description || '-'}</p>
                    </div>
                  </div>
                  <span className="text-base font-black text-rose-600">-{fmt(parseFloat(tx.amount) || 0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengeluaran;
