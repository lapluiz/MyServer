const express = require('express');
const router = express.Router();
const crudController = require('../server/BCKND-script-crudController');

// Main entry point for dynamic CRUD
router.post('/', crudController.handleCrudRequest);

module.exports = router;
