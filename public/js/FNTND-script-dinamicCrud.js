/**
 * FNTND-script-dinamicCrud.js
 * Cliente Frontend para consumir o endpoint /api/crud usando Aliases de tabela.
 */
export async function requestDinamicCRUD({ action, table, data }) {
    const res = await fetch('/api/crud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, table, data }),
    });

    const body = await res.json().catch(() => null);
    return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        body,
    };
}

