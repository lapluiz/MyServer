/**
 * FNTND-script-app.js
 * Página de teste: verifica a API (/api/health), MariaDB, CRUD Dinâmico por Alias e Socket.io.
 */
import { requestDinamicCRUD } from './FNTND-script-dinamicCrud.js';

const $ = (id) => document.getElementById(id);

function setStatus(el, text, state) {
    el.textContent = text;
    el.classList.remove('is-ok', 'is-err');
    if (state) el.classList.add(`is-${state}`);
}

function formatUptime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return [h && `${h}h`, (h || m) && `${m}m`, `${s}s`].filter(Boolean).join(' ');
}

function updateDbCard(db) {
    if (!db) return;
    $('db-host').textContent = db.host || '—';
    $('db-name').textContent = db.database || '—';
    if (db.connected) {
        setStatus($('db-badge'), 'conectado', 'ok');
        $('db-version').textContent = db.version || '—';
        $('db-detail').textContent = db.user || 'ok';
    } else {
        setStatus($('db-badge'), 'desconectado', 'err');
        $('db-version').textContent = '—';
        $('db-detail').textContent = db.error || 'erro';
    }
}

$('origin').textContent = window.location.host;

/* ---------- Servidor (/api/health) ---------- */
async function checkHealth() {
    try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        setStatus($('server-badge'), 'online', 'ok');
        setStatus($('brand-dot'), '', 'ok');
        $('server-env').textContent = data.env;
        $('server-node').textContent = data.node;
        $('footer-node').textContent = data.node;
        $('server-uptime').textContent = formatUptime(data.uptime);
        $('server-checked').textContent = new Date().toLocaleTimeString('pt-BR');
        updateDbCard(data.db);
    } catch (err) {
        setStatus($('server-badge'), 'offline', 'err');
        setStatus($('brand-dot'), '', 'err');
        $('server-checked').textContent = `falhou (${err.message})`;
    }
}

$('btn-health').addEventListener('click', checkHealth);
$('btn-db').addEventListener('click', checkHealth);
checkHealth();
setInterval(checkHealth, 10000);

/* ---------- Socket.io ---------- */
if (typeof window.io !== 'function') {
    setStatus($('socket-badge'), 'cliente não carregado', 'err');
    $('btn-ping').disabled = true;
} else {
    const socket = window.io();

    socket.on('connect', () => {
        setStatus($('socket-badge'), 'conectado', 'ok');
        $('socket-id').textContent = socket.id;
        $('btn-ping').disabled = false;
    });

    socket.on('disconnect', (reason) => {
        setStatus($('socket-badge'), `desconectado (${reason})`, 'err');
        $('socket-id').textContent = '—';
        $('btn-ping').disabled = true;
    });

    socket.on('connect_error', () => {
        setStatus($('socket-badge'), 'erro de conexão', 'err');
    });

    socket.on('clients:count', (count) => {
        $('socket-clients').textContent = count;
    });

    $('btn-ping').addEventListener('click', () => {
        const sentAt = performance.now();
        socket.timeout(5000).emit('ping:client', { from: 'browser' }, (err) => {
            $('socket-latency').textContent = err
                ? 'sem resposta (timeout)'
                : `${Math.round(performance.now() - sentAt)} ms`;
        });
    });
}

/* ---------- Teste de API ---------- */
document.querySelectorAll('[data-url]').forEach((btn) => {
    btn.addEventListener('click', async () => {
        const url = btn.dataset.url;
        const output = $('api-output');
        output.textContent = `GET ${url} …`;

        try {
            const started = performance.now();
            const res = await fetch(url);
            const elapsed = Math.round(performance.now() - started);
            const body = await res.json().catch(() => null);

            setStatus($('api-badge'), `${res.status} · ${elapsed} ms`, res.ok ? 'ok' : 'err');
            output.textContent = `GET ${url} → ${res.status} ${res.statusText}\n\n${JSON.stringify(body, null, 2)}`;
        } catch (err) {
            setStatus($('api-badge'), 'falhou', 'err');
            output.textContent = `GET ${url} → erro: ${err.message}`;
        }
    });
});

async function callCrud(payload) {
    const output = $('api-output');
    output.textContent = `POST /api/crud …\nPayload enviado:\n${JSON.stringify(payload, null, 2)}`;
    try {
        const started = performance.now();
        const res = await requestDinamicCRUD(payload);
        const elapsed = Math.round(performance.now() - started);

        setStatus($('api-badge'), `${res.status} · ${elapsed} ms`, res.ok ? 'ok' : 'err');
        output.textContent = `POST /api/crud → ${res.status} ${res.statusText}\nPayload: ${JSON.stringify(payload)}\n\nResposta:\n${JSON.stringify(res.body, null, 2)}`;
    } catch (err) {
        setStatus($('api-badge'), 'falhou', 'err');
        output.textContent = `POST /api/crud → erro: ${err.message}`;
    }
}

$('btn-crud-insert').addEventListener('click', () => {
    const randomNum = Math.floor(Math.random() * 900) + 100;
    callCrud({
        action: 'INSERT',
        table: 'products', // Usa o ALIAS, nunca o nome real tbl_products!
        data: {
            name: `Produto Teste #${randomNum}`,
            price: Number((Math.random() * 200 + 10).toFixed(2)),
            stock: Math.floor(Math.random() * 50) + 1,
        },
    });
});

$('btn-crud-select').addEventListener('click', () => {
    callCrud({
        action: 'SELECT',
        table: 'products', // Usa o ALIAS!
    });
});

$('btn-crud-block').addEventListener('click', () => {
    callCrud({
        action: 'SELECT',
        table: 'tbl_products', // Deve bloquear! Tentando usar nome real em vez do alias
    });
});

