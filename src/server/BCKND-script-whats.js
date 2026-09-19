const express = require('express');
const axios = require('axios');
const router = express.Router();

// Carrega as credenciais da API do arquivo de ambiente para segurança
const WW_TOKEN = process.env.WW_TOKEN;
const WW_API_URL = process.env.WW_API_URL;

/**
 * Envia uma mensagem de texto simples via API Geniuz.
 */
async function sendTextMessage(numero, mensagem) {
    if (!numero || !mensagem) {
        throw new Error("As propriedades 'numero' e 'mensagem' são obrigatórias.");
    }
    if (!WW_TOKEN) {
        throw new Error("Token da API Geniuz não encontrado. Verifique seu arquivo .env");
    }

    const url = `${WW_API_URL}/sendMSGText`;
    const payload = {
        token: WW_TOKEN,
        txmensagem: mensagem,
        txwhatsapp: numero
    };

    try {
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        throw new Error(`Falha ao enviar mensagem de texto: ${error.response?.data?.message || error.message}`);
    }
}

/**
 * Envia uma imagem com base em uma string Base64.
 */
async function sendBase64Image(numero, mensagem, base64) {
    if (!numero || !base64) {
        throw new Error("As propriedades 'numero' e 'base64' são obrigatórias.");
    }
    if (!WW_TOKEN) {
        throw new Error("Token da API Geniuz não encontrado. Verifique seu arquivo .env");
    }

    const url = `${WW_API_URL}/sendImgBase64`;
    const payload = {
        token: WW_TOKEN,
        txmensagem: mensagem || "Segue imagem.",
        txnomearquivo: "imagem.jpg",
        txbase64: base64,
        txwhatsapp: numero
    };
    
    try {
        const response = await axios.post(url, payload);
        return response.data;
    } catch (error) {
        throw new Error(`Falha ao enviar imagem: ${error.response?.data?.message || error.message}`);
    }
}

// ===================================================================
// ROTAS
// ===================================================================

// Endpoint Webhook para receber mensagens (Post da Geniuz ou de outro serviço)
router.post('/webhook', (req, res) => {
    try {
        const payload = req.body;
        console.log('Webhook do WhatsApp recebido:', payload);
        
        // Emite o evento pelo Socket.io para o frontend
        if (req.io) {
            req.io.emit('whatsapp_receive', payload);
        }

        res.status(200).send('Webhook recebido com sucesso');
    } catch (error) {
        console.error('Erro no webhook:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// Endpoint para enviar mensagem de texto partindo do seu próprio sistema
router.post('/send', async (req, res) => {
    try {
        const { numero, mensagem } = req.body;
        const result = await sendTextMessage(numero, mensagem);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Endpoint para enviar imagem partindo do seu próprio sistema
router.post('/send-image', async (req, res) => {
    try {
        const { numero, mensagem, base64 } = req.body;
        const result = await sendBase64Image(numero, mensagem, base64);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Erro ao enviar imagem:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
