const pool = require('./BCKND-mySQL');

/**
 * Whitelist de tabelas permitidas para segurança.
 */
const ALLOWED_TABLES = [
    'tbl_user',
    'tbl_products'
];

/**
 * Função principal de CRUD Dinâmico
 * @param {Object} requestObj - Objeto com { action, table, data }
 */
exports.returnDinamicCRUD = async function (requestObj) {
    const { action, table, data } = requestObj;

    // 1. Validação de Segurança (Whitelist)
    if (!ALLOWED_TABLES.includes(table)) {
        throw new Error(`[Security Block] Tabela '${table}' não permitida ou inexistente.`);
    }

    let query = '';
    let params = [];

    try {
        switch (action.toUpperCase()) {
            case 'INSERT':
                if (!data) throw new Error("Dados obrigatórios para INSERT.");

                const insertData = { ...data };
                delete insertData.id;

                const columns = Object.keys(insertData);
                const values = Object.values(insertData);
                const placeholders = columns.map(() => '?').join(', ');

                query = `INSERT INTO ?? (${columns.map(() => '??').join(', ')}) VALUES (${placeholders})`;
                params = [table, ...columns, ...values];

                const [insertResult] = await pool.query(query, params);
                return {
                    success: true,
                    id: insertResult.insertId,
                    message: 'Registro criado com sucesso.'
                };

            case 'UPDATE':
                if (!data || !data.id) throw new Error("ID obrigatório dentro de 'data' para UPDATE.");

                const updateId = data.id;
                const updateData = { ...data };
                delete updateData.id;

                if (Object.keys(updateData).length === 0) throw new Error("Nenhum dado para atualizar.");

                const assignments = Object.keys(updateData).map(() => '?? = ?').join(', ');
                const updateValues = [];

                Object.entries(updateData).forEach(([key, val]) => {
                    updateValues.push(key, val);
                });

                query = `UPDATE ?? SET ${assignments} WHERE id = ?`;
                params = [table, ...updateValues, updateId];

                const [updateRes] = await pool.query(query, params);
                return {
                    success: true,
                    affectedRows: updateRes.affectedRows,
                    message: 'Registro atualizado.'
                };

            case 'DELETE':
                if (!data || !data.id) throw new Error("ID obrigatório para DELETE.");

                query = `DELETE FROM ?? WHERE id = ?`;
                params = [table, data.id];

                const [deleteRes] = await pool.query(query, params);
                return {
                    success: true,
                    affectedRows: deleteRes.affectedRows,
                    message: 'Registro excluído.'
                };

            case 'SELECT':
                // 1. Por ID
                if (data && data.id) {
                    query = `SELECT * FROM ?? WHERE id = ?`;
                    params = [table, data.id];
                    const [rowsId] = await pool.query(query, params);
                    return rowsId[0] || null;
                }

                // 2. Com Filtros (LIKE)
                if (data && Object.keys(data).length > 0) {
                    const whereClauses = [];
                    const whereParams = [];

                    Object.entries(data).forEach(([key, val]) => {
                        whereClauses.push('?? LIKE ?');
                        whereParams.push(key, `%${val}%`);
                    });

                    query = `SELECT * FROM ?? WHERE ${whereClauses.join(' AND ')}`;
                    params = [table, ...whereParams];

                    const [rowsFilter] = await pool.query(query, params);
                    return rowsFilter;
                }

                // 3. Select Tudo
                query = `SELECT * FROM ??`;
                params = [table];
                const [rowsAll] = await pool.query(query, params);
                return rowsAll;

            default:
                throw new Error(`Ação '${action}' não reconhecida.`);
        }

    } catch (error) {
        console.error(`[DinamicCRUD Error] ${action} em ${table}:`, error);
        throw error;
    }
};
