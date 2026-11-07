/**
 * BCKND-script-crudController.js
 * Controller responsável por receber as requisições de CRUD dinâmico via HTTP.
 */
const { TABLE_ALIASES, returnDinamicCRUD } = require('../services/BCKND-script-dinamicCrud');

exports.handleCrudRequest = async (req, res) => {
    try {
        const { action, table, data } = req.body || {};

        if (!action || !table) {
            return res.status(400).json({ error: "Os parâmetros 'action' e 'table' (alias) são obrigatórios." });
        }

        const result = await returnDinamicCRUD({ action, table, data });
        return res.json(result);
    } catch (error) {
        if (error.message.includes('[Security Block]') || error.status === 403) {
            return res.status(403).json({ error: error.message });
        }
        return res.status(error.status || 500).json({ error: error.message });
    }
};

/**
 * Retorna apenas a lista de aliases públicos disponíveis (sem expor o nome real das tabelas).
 */
exports.listTableAliases = (req, res) => {
    res.json({
        aliases: Object.keys(TABLE_ALIASES),
    });
};

