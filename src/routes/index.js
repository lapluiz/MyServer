const express = require('express');
const healthRoutes = require('./health.routes');
const crudRoutes = require('./crud.routes');

const router = express.Router();

// GET /api -> lista as rotas disponíveis
router.get('/', (req, res) => {
    res.json({
        name: 'MyServer API',
        endpoints: [
            'GET /api',
            'GET /api/health',
            'GET /api/health/db',
            'GET /api/crud/tables',
            'POST /api/crud',
        ],
    });
});

router.use('/health', healthRoutes);
router.use('/crud', crudRoutes);

module.exports = router;
