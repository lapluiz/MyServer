const dynamicCrudService = require('./BCKND-serv-dinamiccrud');

exports.handleCrudRequest = async (req, res) => {
    try {
        const { action, table, data } = req.body;

        // Basic validation
        if (!action || !table) {
            return res.status(400).json({ error: 'Action and table are required.' });
        }

        const result = await dynamicCrudService.returnDinamicCRUD({ action, table, data });
        res.json(result);

    } catch (error) {
        // Handle security blocks clearly
        if (error.message.includes('[Security Block]')) {
            return res.status(403).json({ error: error.message });
        }

        res.status(500).json({ error: error.message });
    }
};
