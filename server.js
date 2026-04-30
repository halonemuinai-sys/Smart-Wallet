require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { runMigration } = require('./migrate');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log koneksi database saat start
console.log("Mencoba hubungkan ke Supabase...");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) console.error("KONEKSI SUPABASE GAGAL:", err.message);
    else console.log("KONEKSI SUPABASE BERHASIL:", res.rows[0].now);
});

function renderHtml(fileName) {
    const publicPath = path.resolve(process.cwd(), 'public');
    const filePath = path.join(publicPath, `${fileName}.html`);
    if (!fs.existsSync(filePath)) return `<!-- File ${fileName}.html not found -->`;
    let content = fs.readFileSync(filePath, 'utf8');
    const includeRegex = /<\?!= include\(['"](.+?)['"]\); \?>/g;
    content = content.replace(includeRegex, (match, includeName) => renderHtml(includeName));
    return content;
}

app.post('/api/:functionName', async (req, res) => {
    const { functionName } = req.params;
    const args = req.body || [];
    console.log(`[API CALL] ${functionName}`, args);

    try {
        if (functionName === 'verifyLogin') {
            const [username, pin] = args;
            const resUser = await pool.query('SELECT * FROM users WHERE username = $1 AND pin = $2', [username, pin ? pin.toString() : '']);
            if (resUser.rows.length > 0) return res.json({ status: 'success', username: resUser.rows[0].username });
            if (username === 'admin' && pin.toString() === '123456') return res.json({ status: 'success', username: 'admin' });
            return res.json({ status: 'error', message: 'Username atau PIN salah' });
        }

        if (functionName === 'batchLoadAllData') {
            const tables = ['banks', 'transactions', 'categories', 'fixed_costs', 'subscriptions', 'budget', 'deposits', 'cryptos', 'ecommerce', 'inventory'];
            const result = {};
            
            for (const table of tables) {
                try {
                    const data = await pool.query(`SELECT * FROM ${table}`);
                    result[table === 'budget' ? 'budget' : table] = data.rows;
                } catch (e) {
                    console.warn(`Gagal ambil tabel ${table}:`, e.message);
                    result[table] = [];
                }
            }
            return res.json(result);
        }

        if (functionName === 'syncFromGAS') {
            const [gasUrl] = args;
            console.log("Memulai Sinkronisasi dari:", gasUrl);
            const response = await fetch(gasUrl);
            const jsonData = await response.json();
            
            if (jsonData.status === 'success') {
                console.log("Data dari GAS berhasil diterima, memulai migrasi ke Supabase...");
                await runMigration(jsonData.data);
                console.log("Migrasi ke Supabase SELESAI.");
                return res.json({ status: 'success', message: 'Sinkronisasi berhasil!' });
            }
            throw new Error(jsonData.message || 'Gagal sinkronisasi dari GAS');
        }

        res.json({ status: 'success', data: [] });

    } catch (err) {
        console.error('SERVER ERROR:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.get('/', (req, res) => {
    res.send(renderHtml('index'));
});

// Endpoint Debugging untuk Anda cek di browser
app.get('/debug-db', async (req, res) => {
    try {
        const test = await pool.query('SELECT NOW()');
        const tables = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        res.json({ 
            status: 'Connected', 
            time: test.rows[0].now,
            available_tables: tables.rows.map(r => r.table_name)
        });
    } catch (err) {
        res.status(500).json({ status: 'Error', message: err.message });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = app;
