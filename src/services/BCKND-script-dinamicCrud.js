/**
 * BCKND-script-dinamicCrud.js
 * Serviço de CRUD Dinâmico com mapeamento de Alias -> Tabela real no MariaDB.
 */
const { pool } = require('../config/db');

/**
 * Mapa de Aliases de Tabelas:
 * O Frontend envia apenas o alias (ex.: "user", "products"), nunca o nome real da tabela.
 * Serve simultaneamente como Whitelist de segurança e camada de abstração.
 */
const TABLE_ALIASES = Object.freeze({
    user: 'tbl_user',
    products: 'tbl_products',
});

/**
 * Resolve o alias enviado no payload para o nome real da tabela no banco.
 * @param {string} alias
 * @returns {string} Nome real da tabela
 */
function resolveTableName(alias) {
    if (!alias || typeof alias !== 'string' || !Object.prototype.hasOwnProperty.call(TABLE_ALIASES, alias)) {
        const err = new Error(`[Security Block] Alias de tabela '${alias}' não permitido ou inexistente.`);
        err.status = 403;
        throw err;
    }
    return TABLE_ALIASES[alias];
}

/**
 * Função principal de CRUD Dinâmico
 * @param {Object} requestObj - Objeto com { action, table, data } onde `table` é o alias
 */
async function returnDinamicCRUD(requestObj = {}) {
    const { action, table: tableAlias, data } = requestObj;

    if (!action || !tableAlias) {
        const err = new Error("Os parâmetros 'action' e 'table' (alias) são obrigatórios.");
        err.status = 400;
        throw err;
    }

    // 1. Validação de Segurança (Whitelist por Alias) e tradução para o nome real
    const realTable = resolveTableName(tableAlias);

    let query = '';
    let params = [];

    try {
        switch (String(action).toUpperCase()) {
            case 'INSERT': {
                if (!data || typeof data !== 'object') {
                    throw new Error('Dados obrigatórios para INSERT.');
                }

                const insertData = { ...data };
                delete insertData.id;

                const columns = Object.keys(insertData);
                if (columns.length === 0) {
                    throw new Error('Nenhum campo informado para INSERT.');
                }

                const values = Object.values(insertData);
                const placeholders = columns.map(() => '?').join(', ');

                query = `INSERT INTO ?? (${columns.map(() => '??').join(', ')}) VALUES (${placeholders})`;
                params = [realTable, ...columns, ...values];

                const [insertResult] = await pool.query(query, params);
                return {
                    success: true,
                    id: insertResult.insertId,
                    message: 'Registro criado com sucesso.',
                };
            }

            case 'UPDATE': {
                if (!data || !data.id) {
                    throw new Error("ID obrigatório dentro de 'data' para UPDATE.");
                }

                const updateId = data.id;
                const updateData = { ...data };
                delete updateData.id;

                if (Object.keys(updateData).length === 0) {
                    throw new Error('Nenhum dado para atualizar.');
                }

                const assignments = Object.keys(updateData).map(() => '?? = ?').join(', ');
                const updateValues = [];

                Object.entries(updateData).forEach(([key, val]) => {
                    updateValues.push(key, val);
                });

                query = `UPDATE ?? SET ${assignments} WHERE id = ?`;
                params = [realTable, ...updateValues, updateId];

                const [updateRes] = await pool.query(query, params);
                return {
                    success: true,
                    affectedRows: updateRes.affectedRows,
                    message: 'Registro atualizado.',
                };
            }

            case 'DELETE': {
                if (!data || !data.id) {
                    throw new Error('ID obrigatório para DELETE.');
                }

                query = 'DELETE FROM ?? WHERE id = ?';
                params = [realTable, data.id];

                const [deleteRes] = await pool.query(query, params);
                return {
                    success: true,
                    affectedRows: deleteRes.affectedRows,
                    message: 'Registro excluído.',
                };
            }

            case 'SELECT': {
                // 1. Por ID
                if (data && data.id) {
                    query = 'SELECT * FROM ?? WHERE id = ?';
                    params = [realTable, data.id];
                    const [rowsId] = await pool.query(query, params);
                    return rowsId[0] || null;
                }

                // 2. Com Filtros (LIKE)
                if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                    const whereClauses = [];
                    const whereParams = [];

                    Object.entries(data).forEach(([key, val]) => {
                        whereClauses.push('?? LIKE ?');
                        whereParams.push(key, `%${val}%`);
                    });

                    query = `SELECT * FROM ?? WHERE ${whereClauses.join(' AND ')}`;
                    params = [realTable, ...whereParams];

                    const [rowsFilter] = await pool.query(query, params);
                    return rowsFilter;
                }

                // 3. Select Tudo
                query = 'SELECT * FROM ??';
                params = [realTable];
                const [rowsAll] = await pool.query(query, params);
                return rowsAll;
            }

            default:
                throw new Error(`Ação '${action}' não reconhecida.`);
        }
    } catch (error) {
        console.error(`[DinamicCRUD Error] ${action} em alias '${tableAlias}' (${realTable}):`, error.message);
        throw error;
    }
}

module.exports = {
    TABLE_ALIASES,
    returnDinamicCRUD,
};

