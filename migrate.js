const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration(data) {
  console.log("--- Memulai Migrasi Data ke Supabase ---");
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Bersihkan data lama agar tidak duplikat (Opsional, tapi aman untuk Sync)
    const tables = ['banks', 'transactions', 'categories', 'fixed_costs', 'subscriptions', 'budget', 'deposits', 'cryptos', 'ecommerce', 'inventory', 'users'];
    for (const table of tables) {
        if (data[table] && data[table].length > 0) {
            console.log(`Membersihkan tabel ${table}...`);
            await client.query(`DELETE FROM ${table}`);
        }
    }

    // 2. Fungsi Helper untuk Insert Massal
    const insertData = async (tableName, rows) => {
      if (!rows || rows.length === 0) return;
      console.log(`Memasukkan ${rows.length} baris ke ${tableName}...`);
      
      const fields = Object.keys(rows[0]);
      const columns = fields.join(', ');
      
      for (const row of rows) {
        const values = fields.map(f => row[f]);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        await client.query(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`, values);
      }
    };

    // 3. Jalankan Insert untuk semua modul
    await insertData('categories', data.categories);
    await insertData('banks', data.banks);
    await insertData('transactions', data.transactions);
    await insertData('fixed_costs', data.fixed_costs);
    await insertData('subscriptions', data.subscriptions);
    await insertData('budget', data.budget);
    await insertData('deposits', data.deposits);
    await insertData('cryptos', data.cryptos);
    await insertData('ecommerce', data.ecommerce);
    await insertData('inventory', data.inventory);
    await insertData('users', data.users);

    await client.query('COMMIT');
    console.log("--- MIGRASI BERHASIL DISIMPAN ---");
  } catch (e) {
    await client.query('ROLLBACK');
    console.error("--- MIGRASI GAGAL (ROLLBACK) ---", e.message);
    throw e;
  } finally {
    client.release();
  }
}

module.exports = { runMigration };
