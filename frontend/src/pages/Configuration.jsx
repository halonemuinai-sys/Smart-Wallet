import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const Configuration = () => {
  const { categories, fixedCosts, loadAllData } = useApp();
  const [tab, setTab] = useState('categories');
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');
  const [saving, setSaving] = useState(false);

  const incCats = useMemo(() => categories.filter(c => c.type === 'income'), [categories]);
  const expCats = useMemo(() => categories.filter(c => c.type === 'expense'), [categories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    setSaving(true);
    try {
      await api.call('saveCategory', { name: newCatName, type: newCatType });
      setNewCatName('');
      await loadAllData();
    } catch (err) { alert('Gagal: ' + err.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header className="mb-8 hidden md:block">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Konfigurasi</h1>
        <p className="text-slate-500 mt-1">Atur kategori, biaya tetap, dan pengaturan lainnya.</p>
      </header>

      {/* Tab Selector */}
      <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
        {[{id:'categories',label:'Kategori'},{id:'fixed',label:'Biaya Tetap'}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-4">Tambah Kategori</h3>
            <form onSubmit={handleAddCategory} className="space-y-3">
              <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} required placeholder="Nama Kategori" className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none" />
              <select value={newCatType} onChange={e => setNewCatType(e.target.value)} className="w-full rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm focus:bg-white outline-none">
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
              <button type="submit" disabled={saving} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm disabled:opacity-50">{saving ? 'Menyimpan...' : 'Tambah'}</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-base font-bold text-slate-800 mb-3">Kategori Pemasukan</h3>
              <div className="flex flex-wrap gap-2">
                {incCats.length === 0 ? <p className="text-slate-400 text-sm">Kosong</p> :
                  incCats.map(c => <span key={c.id} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">{c.name}</span>)}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-base font-bold text-slate-800 mb-3">Kategori Pengeluaran</h3>
              <div className="flex flex-wrap gap-2">
                {expCats.length === 0 ? <p className="text-slate-400 text-sm">Kosong</p> :
                  expCats.map(c => <span key={c.id} className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-100">{c.name}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'fixed' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-base font-bold text-slate-800 mb-4">Biaya Tetap (Pengeluaran Rutin)</h3>
          <div className="space-y-3">
            {(fixedCosts || []).length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Belum ada biaya tetap.</p>
            ) : (fixedCosts || []).map((fc, i) => (
              <div key={fc.id || i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">{fc.name}</p>
                  <p className="text-xs text-slate-400">{fc.category || '-'}</p>
                </div>
                <span className="text-sm font-bold text-slate-700">Rp {(parseFloat(fc.amount) || 0).toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuration;
