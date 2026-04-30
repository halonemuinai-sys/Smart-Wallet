import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pemasukan from './components/Pemasukan';
import Pengeluaran from './components/Pengeluaran';
import Report from './pages/Report';
import Bank from './pages/Bank';
import Portofolio from './pages/Portofolio';
import Ecommerce from './pages/Ecommerce';
import Subscription from './pages/Subscription';
import Inventory from './pages/Inventory';
import Budget from './pages/Budget';
import Configuration from './pages/Configuration';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { user, isLoading } = useApp();
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">Memuat Smart Wallet...</p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user } = useApp();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="pemasukan" element={<Pemasukan />} />
        <Route path="pengeluaran" element={<Pengeluaran />} />
        <Route path="laporan" element={<Report />} />
        <Route path="bank" element={<Bank />} />
        <Route path="portofolio" element={<Portofolio />} />
        <Route path="ecommerce" element={<Ecommerce />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="budget" element={<Budget />} />
        <Route path="konfigurasi" element={<Configuration />} />
        <Route path="profil" element={<Profile />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
