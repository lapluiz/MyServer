/**
 * Ponto de entrada: cria o servidor HTTP, acopla o Socket.io, garante o schema do MariaDB e inicia o listen.
 *   npm start   -> node src/server.js
 *   npm run dev -> node --watch src/server.js (reinicia ao salvar)
 */
const http = require('node:http');
const { Server } = require('socket.io');

const env = require('./config/env');
const { ensureSchema } = require('./config/schema');
const createApp = require('./app');
const setupSockets = require('./sockets');

const app = createApp();
const server = http.createServer(app);

// Front e back na mesma origem (localhost:PORT), então não é preciso CORS.
const io = new Server(server);
app.set('io', io); // permite que rotas acessem o io via req.app.get('io')
setupSockets(io);

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`[server] A porta ${env.PORT} já está em uso. Encerre o outro processo ou altere PORT no .env.`);
        process.exit(1);
    }
    throw err;
});

ensureSchema()
    .then(() => {
        console.log('[db] Tabelas iniciais verificadas (tbl_user, tbl_products).');
    })
    .catch((err) => {
        console.warn(`[db] Não foi possível verificar as tabelas na subida: ${err.message}`);
    })
    .finally(() => {
        server.listen(env.PORT, env.HOST, () => {
            console.log(`[server] Rodando em http://localhost:${env.PORT} (${env.NODE_ENV})`);
        });
    });

// Encerramento gracioso (Ctrl+C)
function shutdown(signal) {
    console.log(`\n[server] ${signal} recebido, encerrando...`);
    io.close(() => process.exit(0)); // fecha os sockets e o servidor HTTP
    setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
