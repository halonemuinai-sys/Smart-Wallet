require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDB() {
  try {
    console.log('--- Menyiapkan Tabel Database ---');
    const sql = fs.readFileSync('schema.sql', 'utf8');
    
    // Jalankan SQL
    await pool.query(sql);
    
    console.log('BERHASIL! Semua tabel sudah dibuat di Supabase.');
  } catch (err) {
    console.error('Gagal membuat tabel:', err.message);
  } finally {
    await pool.end();
  }
}

initDB();
