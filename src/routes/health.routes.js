const express = require('express');
const env = require('../config/env');
const { checkDbConnection } = require('../config/db');

const router = express.Router();

// GET /api/health -> status do servidor + status do MariaDB
router.get('/', async (req, res) => {
    const io = req.app.get('io');
    const db = await checkDbConnection();

    res.json({
        status: 'ok',
        env: env.NODE_ENV,
        node: process.version,
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
        sockets: io ? io.of('/').sockets.size : 0,
        db,
    });
});

// GET /api/health/db -> testa especificamente o banco MariaDB
router.get('/db', async (req, res) => {
    const db = await checkDbConnection();
    res.status(db.connected ? 200 : 503).json(db);
});

module.exports = router;
