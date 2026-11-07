/**
 * Configuração central da aplicação.
 * Lê o arquivo .env (se existir) usando o recurso nativo do Node (sem dotenv)
 * e expõe apenas as variáveis que o app realmente usa, já validadas.
 */
const path = require('node:path');

const ENV_FILE = path.join(__dirname, '..', '..', '.env');

try {
    process.loadEnvFile(ENV_FILE);
} catch (err) {
    // Sem .env é permitido: valem os valores padrão abaixo.
    if (err.code !== 'ENOENT') throw err;
}

const PORT = Number(process.env.PORT) || 3000;

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error(`[config] PORT inválida: "${process.env.PORT}"`);
}

module.exports = Object.freeze({
    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || 'localhost',
    PORT,
});

