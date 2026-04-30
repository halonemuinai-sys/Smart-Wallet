const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Daftar kolom yang valid sesuai dengan schema Supabase kita
const VALID_COLUMNS = {
    banks: ['id', 'name', 'account_number', 'account_type', 'initial_balance'],
    transactions: ['id', 'date', 'type', 'category', 'amount', 'description', 'bank', 'discount'],
    categories: ['id', 'name', 'type', 'icon', 'color'],
    fixed_costs: ['id', 'name', 'amount', 'due_date', 'category', 'bank_id', 'is_paid'],
    subscriptions: ['id', 'name', 'amount', 'billing_cycle', 'due_date', 'category', 'bank_id', 'status', 'email'],
    budget: ['id', 'category', 'limit'],
    deposits: ['id', 'name', 'bank_id', 'amount', 'rate', 'tenor', 'start_date', 'maturity_date', 'status'],
    cryptos: ['id', 'name', 'quantity', 'value_idr'],
    ecommerce: ['id', 'date', 'platform', 'item_name', 'category', 'amount', 'bank_id', 'tenor', 'txn_id'],
    inventory: ['id', 'item_name', 'category', 'purchase_price', 'current_value', 'condition', 'purchase_date', 'qty', 'status', 'ecom_id'],
    users: ['id', 'username', 'pin', 'role']
};

async function runMigration(data) {
  console.log("--- Memulai Migrasi Data ke Supabase ---");
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Pemetaan data dari Export.gs (karena penamaan json kadang berbeda dengan table)
    const mappedData = {
        banks: data.banks || [],
        transactions: data.transactions || [],
        categories: data.categories || [],
        fixed_costs: data.fixedCosts || [], // Map fixedCosts ke fixed_costs
        subscriptions: data.subscriptions || [],
        budget: data.budget || [],
        deposits: data.deposits || [],
        cryptos: data.cryptos || [],
        ecommerce: data.ecommerce || [],
        inventory: data.inventory || [],
        users: data.users || []
    };

    const tables = Object.keys(VALID_COLUMNS);
    for (const table of tables) {
        if (mappedData[table] && mappedData[table].length > 0) {
            console.log(`Membersihkan tabel ${table}...`);
            await client.query(`DELETE FROM ${table}`);
        }
    }

    const insertData = async (tableName, rows) => {
      if (!rows || rows.length === 0) return;
      console.log(`Memasukkan ${rows.length} baris ke ${tableName}...`);
      
      const allowedFields = VALID_COLUMNS[tableName];
      
      for (const row of rows) {
        // Hanya ambil field yang ada di VALID_COLUMNS
        const cleanRow = {};
        for (const field of allowedFields) {
            let val = row[field];
            if (val === "" || val === undefined) {
                val = null;
            }
            cleanRow[field] = val;
        }

        const fields = Object.keys(cleanRow);
        // Penting: tambahkan tanda kutip ganda pada nama kolom untuk menghindari masalah reserved words (seperti "limit")
        const columns = fields.map(f => `"${f}"`).join(', ');
        const values = Object.values(cleanRow);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        
        await client.query(`INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`, values);
      }
    };

    for (const table of tables) {
        await insertData(table, mappedData[table]);
    }

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
