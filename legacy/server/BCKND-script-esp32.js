const express = require('express');
const router = express.Router();

// Endpoint para receber dados do ESP32 ou Simulador
// Método: POST
// Rota Final: /api/esp32/data
router.post('/data', (req, res) => {
    try {
        const payload = req.body;
        console.log('[ESP32] Dados recebidos:', payload);

        // Se o Socket.io estiver injetado no req, emitimos para o frontend
        if (req.io) {
            // Emite o evento "esp32_data" com o payload recebido
            req.io.emit('esp32_data', payload);
            console.log('[ESP32] Evento emitido via Socket.io com sucesso.');
        } else {
            console.warn('[ESP32] Socket.io não está disponível na requisição!');
        }

        // Responde de volta para o ESP32 confirmando o recebimento
        // O ESP32 costuma ter pouca memória, então retornos curtos são ideais
        res.status(200).json({ success: true, message: 'Dados recebidos pelo servidor.' });
    } catch (error) {
        console.error('[ESP32] Erro ao processar dados:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint extra só para o ESP32 testar conexão (GET)
// Método: GET
// Rota Final: /api/esp32/ping
router.get('/ping', (req, res) => {
    res.status(200).send("pong");
});

module.exports = router;
