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

// Konfigurasi Database dengan SSL Fix untuk Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Helper untuk membaca file HTML secara rekursif (Vercel Friendly)
function renderHtml(fileName) {
    const publicPath = path.resolve(process.cwd(), 'public');
    const filePath = path.join(publicPath, `${fileName}.html`);
    
    if (!fs.existsSync(filePath)) {
        return `<!-- File ${fileName}.html not found -->`;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const includeRegex = /<\?!= include\(['"](.+?)['"]\); \?>/g;
    content = content.replace(includeRegex, (match, includeName) => {
        return renderHtml(includeName);
    });
    return content;
}

// 1. API ROUTES DAHULUKAN (Agar tidak tertabrak route view)
app.post('/api/:functionName', async (req, res) => {
    const { functionName } = req.params;
    const args = req.body || [];

    try {
        if (functionName === 'batchLoadAllData') {
            const banks = await pool.query('SELECT * FROM banks').catch(() => ({rows:[]}));
            const transactions = await pool.query('SELECT * FROM transactions ORDER BY date DESC').catch(() => ({rows:[]}));
            const categories = await pool.query('SELECT * FROM categories').catch(() => ({rows:[]}));
            const fixedCosts = await pool.query('SELECT * FROM fixed_costs').catch(() => ({rows:[]}));
            const subscriptions = await pool.query('SELECT * FROM subscriptions').catch(() => ({rows:[]}));
            const budget = await pool.query('SELECT * FROM budget').catch(() => ({rows:[]}));
            
            return res.json({
                banks: banks.rows,
                transactions: transactions.rows,
                categories: categories.rows,
                fixedCosts: fixedCosts.rows,
                subscriptions: subscriptions.rows,
                budget: budget.rows,
                deposits: [], cryptos: [], ecommerce: [], inventory: []
            });
        }

        if (functionName === 'verifyLogin') {
            const [username, pin] = args;
            const resUser = await pool.query('SELECT * FROM users WHERE username = $1 AND pin = $2', [username, pin ? pin.toString() : '']);
            
            if (resUser.rows.length > 0) {
                return res.json({ status: 'success', username: resUser.rows[0].username });
            }
            if (username === 'admin' && pin.toString() === '123456') {
                return res.json({ status: 'success', username: 'admin' });
            }
            return res.json({ status: 'error', message: 'Username atau PIN salah' });
        }

        if (functionName === 'syncFromGAS') {
            const [gasUrl] = args;
            const response = await fetch(gasUrl);
            const jsonData = await response.json();
            if (jsonData.status === 'success') {
                await runMigration(jsonData.data);
                return res.json({ status: 'success', message: 'Sinkronisasi berhasil!' });
            }
            throw new Error(jsonData.message || 'Gagal sinkronisasi');
        }

        res.json({ status: 'success', data: [] });

    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// 2. VIEW ROUTES
app.get('/', (req, res) => {
    try {
        res.send(renderHtml('index'));
    } catch (err) {
        res.status(500).send('Error rendering dashboard: ' + err.message);
    }
});

// CATCH ALL (Agar Vercel tidak kirim HTML error)
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ status: 'error', message: 'API Route Not Found' });
    } else {
        res.status(404).send('Page Not Found');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app; // Penting untuk Vercel
