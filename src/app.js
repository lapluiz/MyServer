/**
 * Monta a aplicação Express (middlewares, arquivos estáticos e rotas).
 * Não faz "listen" aqui: isso fica em server.js, o que facilita testes.
 */
const path = require('node:path');
const express = require('express');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function createApp() {
    const app = express();

    app.disable('x-powered-by');

    // Body parsers nativos do Express 5 (dispensa o pacote body-parser)
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Somente a pasta public/ é exposta ao navegador
    app.use(express.static(PUBLIC_DIR));

    // API
    app.use('/api', routes);

    // 404 e tratamento central de erros (sempre por último)
    app.use(notFound);
    app.use(errorHandler);

    return app;
}

module.exports = createApp;

