const env = require('../config/env');

/**
 * Tratamento central de erros. No Express 5, erros lançados (inclusive em
 * funções async) chegam aqui automaticamente, sem precisar de try/catch.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    const status = err.status || err.statusCode || 500;

    if (status >= 500) {
        console.error(`[error] ${req.method} ${req.originalUrl}`, err);
    }

    const message = status >= 500 && env.NODE_ENV === 'production'
        ? 'Erro interno do servidor'
        : err.message;

    res.status(status).json({ error: { status, message } });
}

module.exports = errorHandler;

