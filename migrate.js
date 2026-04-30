require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigration(data) {
  try {
    console.log(`--- Memulai Sinkronisasi Data ---`);
    const query = (text, params) => pool.query(text, params);

    // Categories
    console.log('Sync Kategori...');
    for (const c of data.categories || []) {
      await query('INSERT INTO categories (id, name, type, icon, color) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, type = EXCLUDED.type, icon = EXCLUDED.icon, color = EXCLUDED.color', [c.id, c.name, c.type, c.icon || '', c.color || '']);
    }

    // Banks
    console.log('Sync Akun Bank...');
    for (const b of data.banks || []) {
      if (!b.id) continue;
      await query('INSERT INTO banks (id, name, account_type, account_no, initial_balance) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, initial_balance = EXCLUDED.initial_balance', [b.id, b.name, b.account_type, b.account_number || '', b.initial_balance || 0]);
    }

    // Transactions
    console.log('Sync Transaksi...');
    for (const t of data.transactions || []) {
      await query('INSERT INTO transactions (id, bank_id, type, category_name, amount, discount, date, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount, date = EXCLUDED.date', 
      [t.id, t.bank, t.type, t.category, t.amount, t.discount || 0, t.date, t.description || '']);
    }

    // Deposits
    console.log('Sync Deposits...');
    for (const d of data.deposits || []) {
      await query('INSERT INTO deposits (id, name, bank_id, amount, rate, tenor, start_date, maturity_date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING',
      [d.id, d.name, d.bank_id, d.amount, d.rate, d.tenor, d.start_date, d.maturity_date, d.status]);
    }

    // Cryptos
    console.log('Sync Cryptos...');
    for (const c of data.cryptos || []) {
      await query('INSERT INTO cryptos (id, name, quantity, value_idr) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET quantity = EXCLUDED.quantity, value_idr = EXCLUDED.value_idr',
      [c.id, c.name, c.quantity, c.value_idr]);
    }

    // Ecommerce
    console.log('Sync Ecommerce...');
    for (const e of data.ecommerce || []) {
      await query('INSERT INTO ecommerce (id, date, platform, item_name, category, amount, bank_id) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
      [e.id, e.date, e.platform, e.item_name, e.category, e.amount, e.bank_id]);
    }

    // Inventory
    console.log('Sync Inventory...');
    for (const i of data.inventory || []) {
      await query('INSERT INTO inventory (id, item_name, category, purchase_price, purchase_date, lifespan_months, condition, source) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO UPDATE SET condition = EXCLUDED.condition',
      [i.id, i.item_name, i.category, i.purchase_price, i.purchase_date, i.lifespan_months, i.condition, i.source]);
    }

    // Budget
    console.log('Sync Budget...');
    for (const b of data.budget || []) {
      await query('INSERT INTO budget (id, category_id, amount, period) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET amount = EXCLUDED.amount',
      [b.id, b.category_id || b.category, b.amount, b.period || 'monthly']);
    }

    // Users
    console.log('Sync Users...');
    for (const u of data.users || []) {
      await query('INSERT INTO users (username, pin) VALUES ($1, $2) ON CONFLICT (username) DO UPDATE SET pin = EXCLUDED.pin',
      [u.username || u.Username, u.pin || u.PIN || u.Pin]);
    }

    console.log('--- Sinkronisasi Total Berhasil! ---');
    return { success: true };

  } catch (err) {
    console.error('Kesalahan sinkronisasi:', err);
    throw err;
  }
}

module.exports = { runMigration };
