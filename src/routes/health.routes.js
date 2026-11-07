const express = require('express');
const env = require('../config/env');

const router = express.Router();

// GET /api/health -> status do servidor
router.get('/', (req, res) => {
    const io = req.app.get('io');

    res.json({
        status: 'ok',
        env: env.NODE_ENV,
        node: process.version,
        uptime: Math.round(process.uptime()),
        timestamp: new Date().toISOString(),
        sockets: io ? io.of('/').sockets.size : 0,
    });
});

module.exports = router;

