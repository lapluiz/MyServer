const express = require('express');
const crudController = require('../controllers/BCKND-script-crudController');

const router = express.Router();

// GET /api/crud/tables -> lista os aliases disponíveis (sem expor o nome real da tabela)
router.get('/tables', crudController.listTableAliases);

// POST /api/crud -> recebe { action, table (alias), data }
router.post('/', crudController.handleCrudRequest);

module.exports = router;
