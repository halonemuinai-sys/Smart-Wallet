import React, { useState } from 'react';

const Pemasukan = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [bank, setBank] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');

  const formatCurrency = (val) => {
    const numeric = val.replace(/\D/g, "");
    if (!numeric) return "";
    return new Intl.NumberFormat('id-ID').format(numeric);
  };

  const handleAmountChange = (e) => {
    setAmount(formatCurrency(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit Pemasukan:", { amount, category, bank, date, desc });
    alert("Fitur simpan (React) belum dihubungkan ke backend!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 p-4">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pemasukan</h1>
        <p className="text-slate-500 mt-1">Catat semua sumber pemasukan Anda di sini.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Catat Pemasukan</h3>
                <p className="text-xs text-slate-500 font-medium">Tambah data pemasukan baru</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
              <div>
                <label htmlFor="inc-amount" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Nominal</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input type="text" id="inc-amount" value={amount} onChange={handleAmountChange} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 pl-10 text-sm text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" placeholder="0" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inc-category" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Kategori</label>
                  <select id="inc-category" value={category} onChange={e => setCategory(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Pilih...</option>
                    <option value="Gaji">Gaji</option>
                    <option value="Bonus">Bonus</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="inc-bank" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Akun Tujuan</label>
                  <select id="inc-bank" value={bank} onChange={e => setBank(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Pilih...</option>
                    <option value="BCA">BCA</option>
                    <option value="Mandiri">Mandiri</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="inc-date" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Tanggal</label>
                  <input type="date" id="inc-date" value={date} onChange={e => setDate(e.target.value)} required className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="inc-desc" className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Keterangan</label>
                  <input type="text" id="inc-desc" value={desc} onChange={e => setDesc(e.target.value)} className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-900 font-medium focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all" placeholder="Opsional..." />
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button type="submit" className="w-full py-3.5 px-4 rounded-xl text-white font-bold transition-all bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20 text-sm flex items-center justify-center gap-2 active:scale-[0.98]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  SIMPAN PEMASUKAN
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Riwayat Pemasukan</h3>
            </div>
            <div className="flex items-center justify-center h-full text-slate-400">
              Riwayat transaksi akan tampil di sini (Mockup React)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pemasukan;
