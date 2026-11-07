/**
 * FNTND-script-mariaDB.js
 * Controla a página index_mariaDB.html para testar INSERT, SELECT, UPDATE e DELETE
 * usando o DinamicCRUD via alias 'products'.
 */
import { requestDinamicCRUD } from './FNTND-script-dinamicCrud.js';

const TABLE_ALIAS = 'products';
const $ = (id) => document.getElementById(id);

function setBadge(el, text, state) {
    el.textContent = text;
    el.classList.remove('is-ok', 'is-err');
    if (state) el.classList.add(`is-${state}`);
}

function logOperation(payload, res, elapsed) {
    setBadge($('log-badge'), `${res.status} · ${elapsed} ms`, res.ok ? 'ok' : 'err');
    $('crud-log').textContent = [
        `POST /api/crud → ${res.status} ${res.statusText} (${elapsed} ms)`,
        '',
        '▶ Payload enviado pelo Frontend:',
        JSON.stringify(payload, null, 2),
        '',
        '◀ Resposta do Backend:',
        JSON.stringify(res.body, null, 2),
    ].join('\n');
}

async function execCrud(payload) {
    const started = performance.now();
    const res = await requestDinamicCRUD(payload);
    const elapsed = Math.round(performance.now() - started);
    logOperation(payload, res, elapsed);
    return res;
}

/* ---------- Renderização da Tabela ---------- */
function renderRows(items) {
    const tbody = $('products-tbody');
    const list = Array.isArray(items) ? items : items ? [items] : [];

    setBadge($('count-badge'), `${list.length} registro(s)`, 'ok');

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--muted);">
                    Nenhum produto encontrado.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = list
        .map((item) => {
            const price = Number(item.price || 0).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            });
            const created = item.created_at
                ? new Date(item.created_at).toLocaleString('pt-BR')
                : '—';

            return `
                <tr data-id="${item.id}">
                    <td><code>#${item.id}</code></td>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${price}</td>
                    <td>${item.stock ?? 0}</td>
                    <td>${created}</td>
                    <td>
                        <div class="td-actions">
                            <button type="button" class="btn btn--sm" data-edit='${JSON.stringify({
                                id: item.id,
                                name: item.name,
                                price: item.price,
                                stock: item.stock,
                            }).replace(/'/g, '&#39;')}'>Editar</button>
                            <button type="button" class="btn btn--sm btn--danger" data-del="${item.id}">Excluir</button>
                        </div>
                    </td>
                </tr>`;
        })
        .join('');
}

function escapeHtml(str) {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/* ---------- Carregar todos (SELECT *) ---------- */
async function loadAllProducts() {
    const res = await execCrud({
        action: 'SELECT',
        table: TABLE_ALIAS,
    });
    if (res.ok) {
        renderRows(res.body);
    } else {
        setBadge($('count-badge'), 'erro ao carregar', 'err');
    }
}

/* ---------- Modo do Formulário (INSERT vs UPDATE) ---------- */
function setEditMode(product) {
    $('prod-id').value = product.id;
    $('prod-name').value = product.name;
    $('prod-price').value = product.price;
    $('prod-stock').value = product.stock;

    $('form-title').innerHTML = `Editar Produto #${product.id} <small>(UPDATE)</small>`;
    setBadge($('form-badge'), `modo: UPDATE #${product.id}`, 'ok');
    $('btn-submit').textContent = `Atualizar #${product.id} (UPDATE)`;
    $('btn-cancel').hidden = false;
    $('prod-name').focus();
}

function resetFormMode() {
    $('product-form').reset();
    $('prod-id').value = '';
    $('form-title').innerHTML = 'Novo Produto <small>(INSERT)</small>';
    setBadge($('form-badge'), 'modo: INSERT');
    $('btn-submit').textContent = 'Salvar (INSERT)';
    $('btn-cancel').hidden = true;
}

$('btn-cancel').addEventListener('click', resetFormMode);

/* ---------- Submit do Formulário (INSERT ou UPDATE) ---------- */
$('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = Number($('prod-id').value) || null;
    const name = $('prod-name').value.trim();
    const price = Number($('prod-price').value);
    const stock = Number($('prod-stock').value);

    const payload = id
        ? {
            action: 'UPDATE',
            table: TABLE_ALIAS,
            data: { id, name, price, stock },
        }
        : {
            action: 'INSERT',
            table: TABLE_ALIAS,
            data: { name, price, stock },
        };

    const res = await execCrud(payload);
    if (res.ok) {
        resetFormMode();
        await loadAllProducts();
    }
});

/* ---------- Gerar Produto Aleatório (INSERT rápido) ---------- */
$('btn-random').addEventListener('click', async () => {
    const nomes = ['Monitor Ultrawide', 'Teclado Mecânico', 'Headset Sem Fio', 'Webcam Full HD', 'SSD NVMe 1TB', 'Cadeira Gamer'];
    const sort = nomes[Math.floor(Math.random() * nomes.length)];
    const num = Math.floor(Math.random() * 900) + 100;

    const res = await execCrud({
        action: 'INSERT',
        table: TABLE_ALIAS,
        data: {
            name: `${sort} #${num}`,
            price: Number((Math.random() * 800 + 50).toFixed(2)),
            stock: Math.floor(Math.random() * 40) + 1,
        },
    });
    if (res.ok) {
        await loadAllProducts();
    }
});

/* ---------- Cliques na Tabela (Editar / Excluir linha) ---------- */
$('products-tbody').addEventListener('click', async (e) => {
    const editBtn = e.target.closest('[data-edit]');
    if (editBtn) {
        const prod = JSON.parse(editBtn.getAttribute('data-edit'));
        setEditMode(prod);
        return;
    }

    const delBtn = e.target.closest('[data-del]');
    if (delBtn) {
        const id = Number(delBtn.getAttribute('data-del'));
        const res = await execCrud({
            action: 'DELETE',
            table: TABLE_ALIAS,
            data: { id },
        });
        if (res.ok) {
            if (Number($('prod-id').value) === id) resetFormMode();
            await loadAllProducts();
        }
    }
});

/* ---------- Consultas & Ações Rápidas ---------- */
$('btn-select-all').addEventListener('click', () => {
    $('search-name').value = '';
    $('search-id').value = '';
    loadAllProducts();
});

$('btn-search-like').addEventListener('click', async () => {
    const name = $('search-name').value.trim();
    const res = await execCrud({
        action: 'SELECT',
        table: TABLE_ALIAS,
        data: name ? { name } : undefined,
    });
    if (res.ok) renderRows(res.body);
});

$('btn-search-id').addEventListener('click', async () => {
    const id = Number($('search-id').value);
    if (!id) return;
    const res = await execCrud({
        action: 'SELECT',
        table: TABLE_ALIAS,
        data: { id },
    });
    if (res.ok) renderRows(res.body);
});

$('btn-delete-id').addEventListener('click', async () => {
    const id = Number($('search-id').value);
    if (!id) return;
    const res = await execCrud({
        action: 'DELETE',
        table: TABLE_ALIAS,
        data: { id },
    });
    if (res.ok) {
        $('search-id').value = '';
        await loadAllProducts();
    }
});

$('btn-test-block').addEventListener('click', async () => {
    await execCrud({
        action: 'SELECT',
        table: 'tbl_products', // Tenta usar o nome real para demonstrar o bloqueio 403
    });
});

// Carrega a lista ao abrir a página
loadAllProducts();

