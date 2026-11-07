const mysql = require('mysql2/promise');
require('dotenv').config();

// Support both DB_ and MDB_ prefixes for compatibility
const dbHost = process.env.DB_HOST || process.env.MDB_HOST;
const dbUser = process.env.DB_USER || process.env.MDB_USER;
const dbPass = process.env.DB_PASSWORD || process.env.MDB_PASSWORD;
const dbName = process.env.DB_NAME || process.env.MDB_NAME;
const dbPort = process.env.DB_PORT || process.env.MDB_PORT || 3306;

if (!dbHost || !dbUser || !dbName) {
	console.error(`[MySQL CRITICAL] Variáveis de ambiente faltando! Host: ${dbHost}, User: ${dbUser}, DB: ${dbName}`);
}

console.log(`[MySQL] Tentando conectar... Host: ${dbHost}, User: ${dbUser}, DB: ${dbName}`);

const pool = mysql.createPool({
	host: dbHost,
	user: dbUser,
	password: dbPass,
	database: dbName,
	port: parseInt(dbPort),
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});

async function testConnection() {
	try {
		const connection = await pool.getConnection();
		console.log('[MySQL] Pool de conexões inicializado com sucesso.');
		connection.release();
	} catch (error) {
		console.error('[MySQL ERROR] Falha na conexão:', error.message);
	}
}

module.exports = pool;
