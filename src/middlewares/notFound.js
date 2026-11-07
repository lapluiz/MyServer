/**
 * Captura qualquer requisição que não casou com arquivo estático nem rota.
 */
function notFound(req, res) {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({
            error: { status: 404, message: `Rota não encontrada: ${req.method} ${req.originalUrl}` },
        });
    }

    res.status(404).type('text').send('404 - Página não encontrada');
}

module.exports = notFound;

