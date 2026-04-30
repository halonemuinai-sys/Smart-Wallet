const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Universal API Service — pengganti google.script.run
 * Semua komunikasi ke backend Node.js/Supabase lewat sini.
 */
const api = {
  async call(functionName, ...args) {
    try {
      const response = await fetch(`${API_BASE}/api/${functionName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error(`API Error (${functionName}):`, err);
      throw err;
    }
  },

  // Auth
  verifyLogin: (username, pin) => api.call('verifyLogin', username, pin),

  // Data Loading
  batchLoadAllData: () => api.call('batchLoadAllData'),

  // User Management
  getUsers: () => api.call('getUsers'),
  saveUser: (data) => api.call('saveUser', data),
  deleteUser: (username) => api.call('deleteUser', username),
};

export default api;
