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

  const expenseCategories = useMemo(() => categories.filter(c => c.type === 'expense'), [categories]);
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
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengeluaran</h1>
        <p className="text-slate-500 mt-1">Catat belanja dan pengeluaran harian Anda.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Catat Pengeluaran</h3>
                <p className="text-xs text-slate-500 font-medium">Catat belanja atau tagihan</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Nominal (Bayar)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input type="text" value={amount} onChange={e => setAmount(fmtInput(e.target.value))} required placeholder="0" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-sm text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Diskon / Hemat</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input type="text" value={discount} onChange={e => setDiscount(fmtInput(e.target.value))} placeholder="0" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-sm text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Kategori</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Pilih...</option>
                    {expenseCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Akun</label>
                  <select value={bank} onChange={e => setBank(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Pilih...</option>
                    {bankOptions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Tanggal</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Keterangan</label>
                  <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Opsional..." className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" />
                </div>
              </div>

              <button type="submit" disabled={saving} className="w-full py-3.5 px-4 rounded-xl text-white font-bold transition-all bg-rose-600 hover:bg-rose-700 shadow-sm text-sm flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                {saving ? 'Menyimpan...' : 'SIMPAN PENGELUARAN'}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Riwayat Pengeluaran</h3>
              <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50 cursor-pointer" />
            </div>
            <div className="space-y-2 overflow-y-auto flex-1 max-h-[600px]">
              {filteredTx.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">Belum ada transaksi pengeluaran.</p>
              ) : filteredTx.map((tx, i) => (
                <div key={tx.id || i} className="flex items-center justify-between p-3 rounded-xl hover:bg-rose-50/50 transition-all border border-slate-50">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{tx.category || 'Lainnya'}</p>
                    <p className="text-xs text-slate-400">{tx.date} · {tx.description || '-'}</p>
                  </div>
                  <span className="text-sm font-bold text-rose-600">-{fmt(parseFloat(tx.amount) || 0)}</span>
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
