import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import api from '../services/api';

const Configuration = () => {
  const { categories = [], fixedCosts = [], loadAllData } = useApp(); // Default array untuk safety
  const [tab, setTab] = useState('categories');
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');
  const [parentCat, setParentCat] = useState(''); 
  const [saving, setSaving] = useState(false);

  // Mengelompokkan Kategori dengan pengecekan keamanan ekstra
  const groupedCategories = useMemo(() => {
    const groups = { income: {}, expense: {} };
    
    if (!Array.isArray(categories)) return groups;

    categories.forEach(cat => {
      let type = cat.type === 'income' ? 'income' : 'expense'; // Normalize type
      const parent = cat.parent || 'Lainnya';
      
      if (!groups[type][parent]) groups[type][parent] = [];
      groups[type][parent].push(cat);
    });
    
    return groups;
  }, [categories]);

  const mainCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    const mains = [...new Set(categories.map(c => c.parent).filter(Boolean))];
    return mains.sort();
  }, [categories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName) return;
    setSaving(true);
    try {
      await api.call('saveCategory', { 
        name: newCatName, 
        type: newCatType,
        parent: parentCat === 'Baru' ? null : (parentCat || null)
      });
      setNewCatName('');
      setParentCat('');
      await loadAllData();
    } catch (err) { 
      console.error(err);
      alert('Gagal menyimpan kategori. Silakan coba lagi.'); 
    }
    finally { setSaving(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-fade-in">
      <header className="mb-8 hidden md:block">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Konfigurasi</h1>
        <p className="text-slate-500 font-medium">Atur struktur keuangan, kategori, dan pengaturan sistem.</p>
      </header>

      {/* Premium Tab Selector */}
      <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/50">
        {[
          {id:'categories', label:'Kategori & Struktur', icon:'M4 6h16M4 12h16M4 18h16'},
          {id:'fixed', label:'Biaya Tetap', icon:'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2'}
        ].map(t => (
          <button 
            key={t.id} 
            onClick={() => setTab(t.id)} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${tab === t.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={t.icon} /></svg>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Tambah Kategori */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Tambah Kategori</h3>
              </div>
              
              <form onSubmit={handleAddCategory} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nama Kategori</label>
                  <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} required placeholder="Contoh: Makan Siang" className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tipe</label>
                    <select value={newCatType} onChange={e => setNewCatType(e.target.value)} className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm font-bold focus:bg-white outline-none cursor-pointer">
                      <option value="expense">Pengeluaran</option>
                      <option value="income">Pemasukan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Main Category</label>
                    <select value={parentCat} onChange={e => setParentCat(e.target.value)} className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-sm font-bold focus:bg-white outline-none cursor-pointer">
                      <option value="">(Jadikan Main)</option>
                      {mainCategories.map(m => <option key={m} value={m}>{m}</option>)}
                      <option value="Baru">+ Main Baru...</option>
                    </select>
                  </div>
                </div>

                {parentCat === 'Baru' && (
                  <div className="animate-fade-in">
                    <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2 ml-1">Nama Main Kategori Baru</label>
                    <input type="text" onBlur={e => setParentCat(e.target.value)} placeholder="Contoh: Makanan & Minuman" className="w-full rounded-2xl bg-indigo-50/50 border border-indigo-200 p-4 text-sm font-bold focus:bg-white outline-none transition-all" />
                  </div>
                )}

                <button type="submit" disabled={saving} className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all disabled:opacity-50 active:scale-95">
                  {saving ? 'Processing...' : 'Simpan Kategori'}
                </button>
              </form>
            </div>
          </div>

          {/* List Kategori Terstruktur */}
          <div className="lg:col-span-8 space-y-8">
            {/* Group Pengeluaran */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]"></div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Struktur Pengeluaran</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(groupedCategories.expense).length === 0 ? <p className="text-slate-400 text-sm italic col-span-2 py-4">Belum ada kategori pengeluaran.</p> : 
                 Object.entries(groupedCategories.expense).map(([main, subs]) => (
                  <div key={main} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 premium-card">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                      <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{main}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subs.map(s => (
                        <span key={s.id} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold border border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-colors cursor-default">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Group Pemasukan */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Struktur Pemasukan</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(groupedCategories.income).length === 0 ? <p className="text-slate-400 text-sm italic col-span-2 py-4">Belum ada kategori pemasukan.</p> :
                 Object.entries(groupedCategories.income).map(([main, subs]) => (
                  <div key={main} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 premium-card">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{main}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {subs.map(s => (
                        <span key={s.id} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl text-[11px] font-bold border border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-colors cursor-default">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === 'fixed' && (
        <div className="max-w-4xl animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8">Biaya Tetap (Rutin)</h3>
            <div className="space-y-4">
              {(fixedCosts || []).length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-slate-400 font-bold">Belum ada biaya tetap yang terdaftar.</p>
                </div>
              ) : (fixedCosts || []).map((fc, i) => (
                <div key={fc.id || i} className="flex items-center justify-between p-6 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-800">{fc.name}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{fc.category || 'General'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900">Rp {(parseFloat(fc.amount) || 0).toLocaleString('id-ID')}</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Per Bulan</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuration;
