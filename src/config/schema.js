/**
 * Inicialização do schema do MariaDB (criação automática de tabelas se não existirem).
 */
const { pool } = require('./db');

async function ensureSchema() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS tbl_user (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(160) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS tbl_products (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(150) NOT NULL,
            price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
            stock INT NOT NULL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
}

module.exports = { ensureSchema };

