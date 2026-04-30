import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBalanceHidden, setIsBalanceHidden] = useState(
    () => localStorage.getItem('keuangan_hide_balance') === 'true'
  );

  // Global Data State
  const [transactions, setTransactions] = useState([]);
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fixedCosts, setFixedCosts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [budget, setBudget] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [cryptos, setCryptos] = useState([]);
  const [ecommerce, setEcommerce] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Check existing session
  useEffect(() => {
    const savedUser = sessionStorage.getItem('sw_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Load all data after login
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const res = await api.batchLoadAllData();
      setTransactions(res.transactions || []);
      setBanks(res.banks || []);
      setCategories(res.categories || []);
      setFixedCosts(res.fixed_costs || []);
      setSubscriptions(res.subscriptions || []);
      setBudget(res.budget || []);
      setDeposits(res.deposits || []);
      setCryptos(res.cryptos || []);
      setEcommerce(res.ecommerce || []);
      setInventory(res.inventory || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, pin) => {
    const res = await api.verifyLogin(username, pin);
    if (res.status === 'success') {
      const userData = { username: res.username };
      setUser(userData);
      sessionStorage.setItem('sw_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('sw_user');
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(prev => {
      const next = !prev;
      localStorage.setItem('keuangan_hide_balance', next);
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      user, login, logout, isLoading,
      isBalanceHidden, toggleBalanceVisibility,
      transactions, setTransactions,
      banks, setBanks,
      categories, setCategories,
      fixedCosts, setFixedCosts,
      subscriptions, setSubscriptions,
      budget, setBudget,
      deposits, setDeposits,
      cryptos, setCryptos,
      ecommerce, setEcommerce,
      inventory, setInventory,
      loadAllData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
