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
    account_type VARCHAR(50),
    account_no VARCHAR(50),
    initial_balance DECIMAL(15, 2) DEFAULT 0
);

CREATE TABLE transactions (
    id VARCHAR(100) PRIMARY KEY,
    bank_id VARCHAR(100) REFERENCES banks(id),
    category_name VARCHAR(100),
    type VARCHAR(20),
    amount DECIMAL(15, 2) NOT NULL,
    discount DECIMAL(15, 2) DEFAULT 0,
    date DATE NOT NULL,
    description TEXT
);

CREATE TABLE fixed_costs (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    category_id VARCHAR(100)
);

CREATE TABLE subscriptions (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    amount DECIMAL(15, 2),
    billing_cycle VARCHAR(20),
    next_billing DATE,
    category VARCHAR(100),
    bank_id VARCHAR(100) REFERENCES banks(id)
);

CREATE TABLE deposits (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100),
    bank_id VARCHAR(100) REFERENCES banks(id),
    amount DECIMAL(15, 2),
    rate DECIMAL(5, 2),
    tenor INTEGER,
    start_date DATE,
    maturity_date DATE,
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
    date DATE,
    platform VARCHAR(50),
    item_name VARCHAR(255),
    category VARCHAR(100),
    amount DECIMAL(15, 2),
    bank_id VARCHAR(100) REFERENCES banks(id)
);

CREATE TABLE inventory (
    id VARCHAR(100) PRIMARY KEY,
    item_name VARCHAR(255),
    category VARCHAR(100),
    purchase_price DECIMAL(15, 2),
    purchase_date DATE,
    lifespan_months INTEGER,
    condition VARCHAR(50),
    source VARCHAR(100)
);

CREATE TABLE budget (
    id VARCHAR(100) PRIMARY KEY,
    category_id VARCHAR(100),
    amount DECIMAL(15, 2),
    period VARCHAR(20)
);

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    pin VARCHAR(20) NOT NULL
);
