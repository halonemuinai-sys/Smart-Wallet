DROP TABLE IF EXISTS budget;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS ecommerce;
DROP TABLE IF EXISTS cryptos;
DROP TABLE IF EXISTS deposits;
DROP TABLE IF EXISTS subscriptions;
DROP TABLE IF EXISTS fixed_costs;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS banks;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE categories (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20),
    icon VARCHAR(50),
    color VARCHAR(20)
);

CREATE TABLE banks (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50),
    account_type VARCHAR(50),
    initial_balance DECIMAL(15, 2) DEFAULT 0
);

CREATE TABLE transactions (
    id VARCHAR(100) PRIMARY KEY,
    date VARCHAR(50) NOT NULL,
    type VARCHAR(20),
    category VARCHAR(100),
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    bank VARCHAR(100),
    discount DECIMAL(15, 2) DEFAULT 0
);

CREATE TABLE fixed_costs (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    due_date VARCHAR(50),
    category VARCHAR(100),
    bank_id VARCHAR(100),
    is_paid BOOLEAN DEFAULT false
);

CREATE TABLE subscriptions (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    billing_cycle VARCHAR(20),
    due_date VARCHAR(50),
    category VARCHAR(100),
    bank_id VARCHAR(100),
    status VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE budget (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(100),
    "limit" DECIMAL(15, 2)
);

CREATE TABLE deposits (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    bank_id VARCHAR(100),
    amount DECIMAL(15, 2),
    rate DECIMAL(5, 2),
    tenor INTEGER,
    start_date VARCHAR(50),
    maturity_date VARCHAR(50),
    status VARCHAR(20)
);

CREATE TABLE cryptos (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    quantity DECIMAL(20, 8),
    value_idr DECIMAL(20, 2)
);

CREATE TABLE ecommerce (
    id VARCHAR(100) PRIMARY KEY,
    date VARCHAR(50),
    platform VARCHAR(50),
    item_name VARCHAR(255),
    category VARCHAR(100),
    amount DECIMAL(15, 2),
    bank_id VARCHAR(100),
    tenor INTEGER,
    txn_id VARCHAR(100)
);

CREATE TABLE inventory (
    id VARCHAR(100) PRIMARY KEY,
    item_name VARCHAR(255),
    category VARCHAR(100),
    purchase_price DECIMAL(15, 2),
    current_value DECIMAL(15, 2),
    condition VARCHAR(50),
    purchase_date VARCHAR(50),
    qty INTEGER,
    status VARCHAR(50),
    ecom_id VARCHAR(100)
);

CREATE TABLE users (
    id VARCHAR(100),
    username VARCHAR(50) PRIMARY KEY,
    pin VARCHAR(20) NOT NULL,
    role VARCHAR(20)
);
