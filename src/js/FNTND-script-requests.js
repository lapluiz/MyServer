//import axios from 'axios';
import axios from 'https://esm.sh/axios@1.6.7';


///////cNew Axios kit

// ============================================================
// O GERENCIADOR CENTRAL DE REQUISIÇÕES
// ============================================================
const activeRequests = new Map();
const DEFAULT_TIMEOUT_MS = 9000;
export async function GENAxios(config) {
    // 1. Extraímos propriedades customizadas e deixamos o resto para o axiosConfig
    // Se o dev não passar 'timeout', usa o padrão.
    // Se não passar 'requestId', geramos um único com Symbol para controle interno.
    const {
        timeout = DEFAULT_TIMEOUT_MS,
        requestId = Symbol('req_' + Date.now()),
        ...axiosConfig
    } = config;

    // 2. Cria o controlador de cancelamento e associa à requisição do Axios
    const controller = new AbortController();
    axiosConfig.signal = controller.signal;

    // 3. Registra a requisição na nossa instância de requisições ativas
    activeRequests.set(requestId, controller);

    // 4. Configura o Timeout
    let timeoutId;
    if (timeout > 0) {
        timeoutId = setTimeout(() => {
            controller.abort(`Timeout de ${timeout}ms excedido.`);
        }, timeout);
    }

    try {
        // Chama direto o axios repassando as configurações limpas
        const response = await axios(axiosConfig);
        // console.log(`[GENAxios] Sucesso na requisição (${String(requestId)}):`, response.data);
        return response.data; // retorna só os dados úteis
    } catch (error) {
        // Identifica se o erro foi causado por um abort() ou timeout
        if (axios.isCancel(error)) {
            console.warn(`[GENAxios] Requisição Cancelada (${String(requestId)}):`, error.message);
        } else {
            console.error(`[GENAxios] Erro na requisição (${String(requestId)}):`, error);
        }
        throw error;
    } finally {
        // 5. Bloco de Limpeza (Executa sempre, dando sucesso ou erro)
        // Remove o timeout para não estourar na memória e exclui da lista de ativos.
        if (timeoutId) clearTimeout(timeoutId);
        activeRequests.delete(requestId);
    }
}

// Aborta uma requisição específica pelo ID
GENAxios.abort = (requestId) => {
    if (activeRequests.has(requestId)) {
        activeRequests.get(requestId).abort("Cancelado manualmente via GENAxios.abort()");
        activeRequests.delete(requestId);
        // console.log(`[GENAxios] Requisição ${requestId} abortada com sucesso.`);
    }
};

// Aborta TODAS as requisições em andamento (Útil ao trocar de tela no SPA)
GENAxios.abortAll = () => {
    activeRequests.forEach((controller) => {
        controller.abort("Cancelamento em massa via GENAxios.abortAll()");
    });
    activeRequests.clear();
    // console.log(`[GENAxios] Todas as requisições foram abortadas.`);
};

// Retorna uma lista com os IDs das requisições em andamento (Para debug/logs)
GENAxios.getActiveRequests = () => {
    return Array.from(activeRequests.keys());
}
