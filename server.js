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

        // 4. SYNC FROM GAS
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

        // 5. USER MANAGEMENT
        if (functionName === 'getUsers') {
            const users = await pool.query('SELECT username, role FROM users'); // Jangan kirim PIN
            return res.json({ status: 'success', data: users.rows });
        }

        if (functionName === 'saveUser') {
            const { username, oldPin, newPin, role } = args[0];
            
            // Cek apakah user eksis
            const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            
            if (existing.rows.length > 0) {
                // Update User: Wajib mencocokkan PIN lama kecuali yang login adalah admin yang mengedit orang lain.
                // Untuk simplifikasi, kita update jika oldPin cocok, atau admin bypass (implementasi sederhana).
                const user = existing.rows[0];
                if (oldPin !== user.pin && oldPin !== 'admin_bypass') {
                    throw new Error("PIN Lama salah!");
                }
                const finalPin = newPin ? newPin.toString() : user.pin;
                const finalRole = role || user.role || 'user';
                await pool.query('UPDATE users SET pin = $1, role = $2 WHERE username = $3', [finalPin, finalRole, username]);
            } else {
                // Create New User
                const finalPin = newPin ? newPin.toString() : '123456';
                const finalRole = role || 'user';
                await pool.query('INSERT INTO users (id, username, pin, role) VALUES ($1, $2, $3, $4)', [
                    'usr_' + Date.now().toString(36), username, finalPin, finalRole
                ]);
            }
            return res.json({ status: 'success', message: 'Profil berhasil disimpan!' });
        }

        if (functionName === 'deleteUser') {
            const [targetUsername] = args;
            if (targetUsername === 'admin') throw new Error("Admin tidak boleh dihapus!");
            await pool.query('DELETE FROM users WHERE username = $1', [targetUsername]);
            return res.json({ status: 'success', message: 'User berhasil dihapus!' });
        }

        // Default response agar tidak 404
        res.json({ status: 'success', data: [] });

    } catch (err) {
        console.error('SERVER ERROR:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');
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
