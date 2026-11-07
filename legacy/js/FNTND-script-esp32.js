// FNTND-script-esp32.js
// Script Frontend para interagir com o endpoint do ESP32 e atualizar a tela em tempo real

// Inicializa o Socket se a biblioteca estiver na tela
if (typeof io !== 'undefined') {
    const socket = io();

    socket.on('connect', () => {
        console.log('[ESP32] Conectado ao servidor Socket.io com ID:', socket.id);
        const statusEl = document.getElementById('socket-status');
        if(statusEl) {
            statusEl.textContent = '🟢 Online';
            statusEl.style.color = '#4CAF50';
        }
    });

    socket.on('disconnect', () => {
        console.log('[ESP32] Desconectado do servidor.');
        const statusEl = document.getElementById('socket-status');
        if(statusEl) {
            statusEl.textContent = '🔴 Offline';
            statusEl.style.color = '#F44336';
        }
    });

    // Escuta os dados vindos do ESP32 e atualiza a tela
    socket.on('esp32_data', (data) => {
        console.log('[ESP32] Dados recebidos em tempo real:', data);
        
        const logsContainer = document.getElementById('esp32-logs');
        if (logsContainer) {
            // Cria um novo item na lista
            const logItem = document.createElement('div');
            logItem.className = 'log-item';
            
            // Pega a hora atual
            const time = new Date().toLocaleTimeString();
            
            // Formata o JSON para ficar bonito
            logItem.innerHTML = `
                <span class="log-time">[${time}]</span>
                <span class="log-data">${JSON.stringify(data)}</span>
            `;
            
            // Adiciona no topo
            logsContainer.prepend(logItem);
        }
    });
}

// Função exportada para fazer o POST simulando o ESP32 (usando seu GENAxios ou o fetch nativo)
export async function simularEnvioESP32(dados) {
    try {
        const resposta = await fetch('/api/esp32/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        
        return await resposta.json();
    } catch (error) {
        console.error('[ESP32 Simulador] Erro ao enviar dados:', error);
        throw error;
    }
}
