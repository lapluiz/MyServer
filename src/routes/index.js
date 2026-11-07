const express = require('express');
const healthRoutes = require('./health.routes');

const router = express.Router();

// GET /api -> lista as rotas disponíveis
router.get('/', (req, res) => {
    res.json({
        name: 'MyServer API',
        endpoints: ['GET /api', 'GET /api/health'],
    });
});

router.use('/health', healthRoutes);

module.exports = router;

