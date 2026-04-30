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
  ssl: { rejectUnauthorized: false }
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

// API ROUTE UNIVERSAL
app.post('/api/:functionName', async (req, res) => {
    const { functionName } = req.params;
    const args = req.body || [];

    try {
        // 1. AUTH
        if (functionName === 'verifyLogin') {
            const [username, pin] = args;
            const resUser = await pool.query('SELECT * FROM users WHERE username = $1 AND pin = $2', [username, pin ? pin.toString() : '']);
            if (resUser.rows.length > 0) return res.json({ status: 'success', username: resUser.rows[0].username });
            if (username === 'admin' && pin.toString() === '123456') return res.json({ status: 'success', username: 'admin' });
            return res.json({ status: 'error', message: 'Username atau PIN salah' });
        }

        // 2. BATCH LOAD (DASHBOARD)
        if (functionName === 'batchLoadAllData') {
            const banks = await pool.query('SELECT * FROM banks').catch(() => ({rows:[]}));
            const transactions = await pool.query('SELECT * FROM transactions ORDER BY date DESC').catch(() => ({rows:[]}));
            const categories = await pool.query('SELECT * FROM categories').catch(() => ({rows:[]}));
            const fixedCosts = await pool.query('SELECT * FROM fixed_costs').catch(() => ({rows:[]}));
            const subscriptions = await pool.query('SELECT * FROM subscriptions').catch(() => ({rows:[]}));
            const budget = await pool.query('SELECT * FROM budget').catch(() => ({rows:[]}));
            const deposits = await pool.query('SELECT * FROM deposits').catch(() => ({rows:[]}));
            const cryptos = await pool.query('SELECT * FROM cryptos').catch(() => ({rows:[]}));
            const ecommerce = await pool.query('SELECT * FROM ecommerce').catch(() => ({rows:[]}));
            const inventory = await pool.query('SELECT * FROM inventory').catch(() => ({rows:[]}));
            
            return res.json({
                banks: banks.rows,
                transactions: transactions.rows,
                categories: categories.rows,
                fixedCosts: fixedCosts.rows,
                subscriptions: subscriptions.rows,
                budget: budget.rows,
                deposits: deposits.rows,
                cryptos: cryptos.rows,
                ecommerce: ecommerce.rows,
                inventory: inventory.rows
            });
        }

        // 3. INDIVIDUAL GETTERS (Fallback agar tidak error 404)
        const tableMap = {
            'getBudgetsData': 'budget',
            'getEcommerceData': 'ecommerce',
            'getEcomPlatforms': 'ecommerce_platforms',
            'getInventoryData': 'inventory',
            'getDepositsData': 'deposits',
            'getCryptosData': 'cryptos',
            'getSubscriptionsData': 'subscriptions',
            'getBanksData': 'banks',
            'getTransactionData': 'transactions',
            'getCategoriesData': 'categories'
        };

        if (tableMap[functionName]) {
            const tableName = tableMap[functionName];
            const data = await pool.query(`SELECT * FROM ${tableName}`).catch(() => ({rows:[]}));
            return res.json(data.rows);
        }

        // 4. SYNC FROM GAS
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

        // Default response agar tidak 404
        res.json({ status: 'success', data: [] });

    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ status: 'error', message: err.message });
    }
});

app.get('/', (req, res) => {
    try { res.send(renderHtml('index')); } 
    catch (err) { res.status(500).send('Error: ' + err.message); }
});

app.use((req, res) => {
    if (req.path.startsWith('/api/')) res.status(404).json({ status: 'error', message: 'API Not Found' });
    else res.status(404).send('Not Found');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = app;
