import React, { useState } from 'react';

const Pengeluaran = () => {
  const [amount, setAmount] = useState('');
  const [discount, setDiscount] = useState('');
  const [category, setCategory] = useState('');
  const [bank, setBank] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');

  const formatCurrency = (val) => {
    const numeric = val.replace(/\D/g, "");
    if (!numeric) return "";
    return new Intl.NumberFormat('id-ID').format(numeric);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit Pengeluaran:", { amount, discount, category, bank, date, desc });
    alert("Fitur simpan (React) belum dihubungkan ke backend!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 p-4">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengeluaran</h1>
        <p className="text-slate-500 mt-1">Catat belanja dan pengeluaran harian Anda.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Catat Pengeluaran</h3>
                <p className="text-xs text-slate-500 font-medium">Catat belanja atau tagihan</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exp-amount" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Nominal (Bayar)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input type="text" id="exp-amount" value={amount} onChange={e => setAmount(formatCurrency(e.target.value))} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-sm text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label htmlFor="exp-discount" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Diskon / Hemat</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input type="text" id="exp-discount" value={discount} onChange={e => setDiscount(formatCurrency(e.target.value))} className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-sm text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" placeholder="0" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exp-category" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Kategori</label>
                  <select id="exp-category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Pilih...</option>
                    <option value="Makan">Makan</option>
                    <option value="Transportasi">Transportasi</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="exp-bank" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Akun</label>
                  <select id="exp-bank" value={bank} onChange={e => setBank(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Pilih...</option>
                    <option value="BCA">BCA</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exp-date" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Tanggal</label>
                  <input type="date" id="exp-date" value={date} onChange={e => setDate(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="exp-desc" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Keterangan</label>
                  <input type="text" id="exp-desc" value={desc} onChange={e => setDesc(e.target.value)} className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none transition-all" placeholder="Opsional..." />
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button type="submit" className="w-full py-3.5 px-4 rounded-xl text-white font-bold transition-all bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-600/20 text-sm flex items-center justify-center gap-2 active:scale-[0.98]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  SIMPAN PENGELUARAN
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden h-full flex flex-col">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Riwayat Pengeluaran</h3>
            <div className="flex items-center justify-center h-full text-slate-400">
              Riwayat transaksi akan tampil di sini (Mockup React)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengeluaran;
