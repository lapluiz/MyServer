/**
 * Pool de conexões com o MariaDB usando mysql2/promise.
 */
const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
    host: env.DB.HOST,
    port: env.DB.PORT,
    user: env.DB.USER,
    password: env.DB.PASSWORD,
    database: env.DB.NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 3000,
});

/**
 * Testa a conexão e retorna informações do servidor MariaDB.
 */
async function checkDbConnection() {
    try {
        const [rows] = await pool.query('SELECT VERSION() AS version, DATABASE() AS db, CURRENT_USER() AS user');
        return {
            connected: true,
            host: `${env.DB.HOST}:${env.DB.PORT}`,
            database: rows[0].db,
            user: rows[0].user,
            version: rows[0].version,
        };
    } catch (err) {
        return {
            connected: false,
            host: `${env.DB.HOST}:${env.DB.PORT}`,
            database: env.DB.NAME,
            user: env.DB.USER,
            error: err.code || err.message,
        };
    }
}

module.exports = {
    pool,
    checkDbConnection,
};

