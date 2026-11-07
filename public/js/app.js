/**
 * Página de teste: verifica a API (/api/health) e a conexão Socket.io.
 * Usa apenas fetch nativo e o cliente global "io" (carregado em /socket.io/socket.io.js).
 */
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
    } catch (err) {
        setStatus($('server-badge'), 'offline', 'err');
        setStatus($('brand-dot'), '', 'err');
        $('server-checked').textContent = `falhou (${err.message})`;
    }
}

$('btn-health').addEventListener('click', checkHealth);
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

