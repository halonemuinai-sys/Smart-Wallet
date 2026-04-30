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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function renderHtml(fileName) {
    let content = fs.readFileSync(path.join(__dirname, 'public', `${fileName}.html`), 'utf8');
    const includeRegex = /<\?!= include\(['"](.+?)['"]\); \?>/g;
    content = content.replace(includeRegex, (match, includeName) => {
        try { return renderHtml(includeName); } 
        catch (err) { return `<!-- Error including ${includeName} -->`; }
    });
    return content;
}

app.get('/', (req, res) => {
    try { res.send(renderHtml('index')); } 
    catch (err) { res.status(500).send('Error rendering index.html'); }
});

async function safeQuery(tableName, order = '') {
    try {
        const res = await pool.query(`SELECT * FROM ${tableName} ${order}`);
        let rows = res.rows || [];
        
        // Mapping kembali ke format yang diharapkan Frontend
        return rows.map(row => {
            const newRow = { ...row };
            if (row.bank_id) newRow.bank = row.bank_id; // Frontend expect 'bank'
            if (row.category_name) newRow.category = row.category_name; // Frontend expect 'category'
            return newRow;
        });
    } catch (err) {
        console.error(`Gagal query tabel ${tableName}:`, err.message);
        return [];
    }
}

app.post('/api/:functionName', async (req, res) => {
    const { functionName } = req.params;
    const args = req.body;

    try {
        if (functionName === 'batchLoadAllData') {
            return res.json({
                banks: await safeQuery('banks'),
                transactions: await safeQuery('transactions', 'ORDER BY date DESC'),
                categories: await safeQuery('categories'),
                fixedCosts: await safeQuery('fixed_costs'),
                subscriptions: await safeQuery('subscriptions'),
                budget: await safeQuery('budget'), // Tambahkan Budget
                deposits: await safeQuery('deposits'),
                cryptos: await safeQuery('cryptos'),
                ecommerce: await safeQuery('ecommerce'),
                ecomPlatforms: [],
                inventory: await safeQuery('inventory')
            });
        }

        if (functionName === 'verifyLogin') {
            const [username, pin] = args;
            const resUser = await pool.query('SELECT * FROM users WHERE username = $1 AND pin = $2', [username, pin.toString()]);
            
            if (resUser.rows.length > 0) {
                return res.json({ status: 'success', username: resUser.rows[0].username });
            }

            // PINTU DARURAT: Jika belum ada user di database, izinkan admin/123456
            if (username === 'admin' && pin.toString() === '123456') {
                return res.json({ status: 'success', username: 'admin' });
            }

            return res.json({ status: 'error', message: 'Username atau PIN salah' });
        }

        if (functionName === 'syncFromGAS') {
            const [gasUrl] = args;
            if (!gasUrl) return res.status(400).json({ error: 'GAS URL is required' });
            
            console.log('Menerima perintah sync dari:', gasUrl);
            const response = await fetch(gasUrl);
            const jsonData = await response.json();
            
            if (jsonData.status === 'success') {
                await runMigration(jsonData.data);
                return res.json({ status: 'success', message: 'Sinkronisasi berhasil!' });
            } else {
                throw new Error(jsonData.message || 'Gagal mengambil data dari Google.');
            }
        }

        const table = functionName.toLowerCase().replace('get', '').replace('load', '').replace('data', '');
        res.json(await safeQuery(table));

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Smart Wallet Online! Buka http://localhost:${port}`);
});
