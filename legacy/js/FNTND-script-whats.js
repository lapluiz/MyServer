// FNTND-script-whats.js
// Script Frontend para interagir com o Socket.io e Endpoints do WhatsApp

// Verifica se a variável global io existe (carregada pelo index.html)
if (typeof io !== 'undefined') {
    const socket = io();

    socket.on('connect', () => {
        console.log('[WhatsApp] Conectado ao servidor Socket.io com ID:', socket.id);
    });

    socket.on('whatsapp_receive', (data) => {
        console.log('[WhatsApp] Nova mensagem recebida via Webhook:', data);
        // Aqui você pode adicionar lógica para exibir no DOM (UI)
        // ex: alert('Nova mensagem recebida! ' + JSON.stringify(data));
    });

    socket.on('disconnect', () => {
        console.log('[WhatsApp] Desconectado do servidor.');
    });

} else {
    console.warn('[WhatsApp] Socket.io não foi carregado no HTML.');
}

/**
 * Função para disparar uma requisição de envio de mensagem de texto.
 * @param {string} numero - Número do WhatsApp (ex: 5511999999999)
 * @param {string} mensagem - Texto a ser enviado
 */
export async function enviaMensagemWhats(numero, mensagem) {
    try {
        const response = await fetch('/api/whatsapp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero, mensagem })
        });
        const result = await response.json();
        console.log('[WhatsApp] Resultado envio mensagem:', result);
        return result;
    } catch (error) {
        console.error('[WhatsApp] Erro ao enviar mensagem:', error);
        throw error;
    }
}

/**
 * Função para disparar uma requisição de envio de imagem base64.
 * @param {string} numero - Número do WhatsApp
 * @param {string} mensagem - Texto acompanhando a imagem
 * @param {string} base64 - Imagem em formato base64
 */
export async function enviaImagemWhats(numero, mensagem, base64) {
    try {
        const response = await fetch('/api/whatsapp/send-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero, mensagem, base64 })
        });
        const result = await response.json();
        console.log('[WhatsApp] Resultado envio imagem:', result);
        return result;
    } catch (error) {
        console.error('[WhatsApp] Erro ao enviar imagem:', error);
        throw error;
    }
}

// Expõe para a janela global caso precise chamar do console ou botões diretos sem módulo
window.enviaMensagemWhats = enviaMensagemWhats;
window.enviaImagemWhats = enviaImagemWhats;
