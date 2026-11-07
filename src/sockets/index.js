/**
 * Eventos do Socket.io.
 *
 * Servidor -> cliente
 *   clients:count  (number)  quantidade de clientes conectados
 *
 * Cliente -> servidor
 *   ping:client    (payload, ack)  responde com o horário do servidor (teste de latência)
 */
function setupSockets(io) {
    const broadcastCount = () => io.emit('clients:count', io.of('/').sockets.size);

    io.on('connection', (socket) => {
        console.log(`[socket] Conectado: ${socket.id}`);
        broadcastCount();

        socket.on('ping:client', (payload, ack) => {
            if (typeof ack === 'function') {
                ack({ serverTime: Date.now(), echo: payload ?? null });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`[socket] Desconectado: ${socket.id} (${reason})`);
            broadcastCount();
        });
    });
}

module.exports = setupSockets;

