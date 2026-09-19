const express = require('express');
const router = express.Router();
// const db = require('../server/BCKND-mySQL');

// Example Route
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Example DB Test Route
// router.get('/test-db', async (req, res) => {
//     try {
//         const [rows] = await db.query('SELECT 1 + 1 AS solution');
//         res.json({ solution: rows[0].solution });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Config Route for Frontend
router.get('/config', (req, res) => {
    res.json({
        geminiApiKey: process.env.GEMINIAPIKEY
    });
});

module.exports = router;
