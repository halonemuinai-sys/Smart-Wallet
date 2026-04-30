/**
 * Utility functions — dipindahkan dari javascript.html
 */

export function cleanNumber(val) {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  let clean = val.toString().replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(clean) || 0;
}

export function formatCurrency(val, hidden = false) {
  if (hidden) return 'Rp ●●●●●●';
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(val);
}

export function formatCurrencyInput(value) {
  const numeric = value.replace(/\D/g, '');
  if (!numeric) return '';
  return new Intl.NumberFormat('id-ID').format(numeric);
}

export function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

export function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getMonthLabel(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + '-01');
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}
