import { GoogleGenerativeAI } from "@google/generative-ai";
import './FNTND-script-mongoCrud.js';


console.log('Main Script UI Loaded - Fix 404 & Model Normalization');

const app = document.getElementById('app');

let STATE = {
    apiKey: null,
    schemas: null,
    genAI: null,
    model: null
};

const URLS = {
    CONFIG: '/api/config',
    SCHEMAS: '/json/JSON-IASchemas.json'
};

async function init() {
    try {
        const [configRes, schemasRes] = await Promise.all([
            fetch(URLS.CONFIG),
            fetch(URLS.SCHEMAS)
        ]);

        if (!configRes.ok || !schemasRes.ok) throw new Error('Falha ao carregar dependências');

        const config = await configRes.json();
        const schemas = await schemasRes.json();

        if (!config.geminiApiKey) throw new Error('API Key ausente');

        STATE.apiKey = config.geminiApiKey;
        STATE.schemas = schemas;
        STATE.genAI = new GoogleGenerativeAI(STATE.apiKey);

        renderUI();
        bindEvents();

    } catch (error) {
        console.error('❌ Erro Fatal:', error);
        app.innerHTML = `<div style="color:red; padding:20px;">Erro ao iniciar: ${error.message}</div>`;
    }
}

function renderUI() {
    const contextOptions = Object.keys(STATE.schemas.systemInstruction).map(key =>
        `<option value="${key}">${key.toUpperCase()}</option>`
    ).join('');

    const modelOptions = Object.keys(STATE.schemas.models).map(key =>
        `<option value="${key}" ${key === 'text' ? 'selected' : ''}>Modelo: ${key.toUpperCase()}</option>`
    ).join('');

    app.innerHTML = `
    <div class="ai-interface">
        <div id="chat-history" class="chat-history">
            <div class="message system"><p>Olá! Selecione 'image' no modelo para gerar imagens.</p></div>
        </div>
        <div class="controls-area">
            <div class="toolbar">
                <div class="select-group">
                    <label>Contexto:</label>
                    <select id="sel-context">${contextOptions}</select>
                </div>
                <div class="select-group">
                    <label>Modo/Modelo:</label>
                    <select id="sel-model">${modelOptions}</select>
                </div>
            </div>
            <div class="input-wrapper">
                <textarea id="inp-prompt" placeholder="Digite seu prompt aqui..."></textarea>
                <button id="btn-send">Enviar 🚀</button>
            </div>
            <div id="status-bar" class="status-info">Aguardando...</div>
        </div>
    </div>
    <style>
        .ai-interface { display: flex; flex-direction: column; height: 90vh; max-width: 900px; margin: 0 auto; gap: 1rem; font-family: sans-serif; }
        .chat-history { flex: 1; border: 1px solid #ccc; border-radius: 8px; padding: 1rem; overflow-y: auto; background: #f9f9f9; }
        .message { margin-bottom: 1rem; padding: 0.8rem; border-radius: 6px; max-width: 80%; }
        .message.user { background: #e0e0e0; margin-left: auto; text-align: right; }
        .message.ai { background: #fff; border: 1px solid #ddd; }
        .message.system { text-align: center; font-style: italic; color: #666; max-width: 100%; }
        .controls-area { border: 2px solid #666; border-radius: 12px; padding: 1rem; background: #eee; display: flex; flex-direction: column; gap: 0.8rem; }
        .toolbar { display: flex; gap: 1rem; }
        .select-group { display: flex; flex-direction: column; flex: 1; }
        select, textarea { padding: 8px; border-radius: 6px; border: 1px solid #999; }
        .input-wrapper { display: flex; gap: 1rem; }
        textarea { flex: 1; height: 60px; resize: none; }
        button { height: 60px; padding: 0 2rem; background: #333; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
        .status-info { font-size: 0.8rem; color: #666; text-align: right; }
    </style>
    `;
}

function bindEvents() {
    document.getElementById('btn-send').addEventListener('click', () => handleSend());
    document.getElementById('inp-prompt').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') handleSend();
    });
}

async function handleSend() {
    const prompt = document.getElementById('inp-prompt').value.trim();
    if (!prompt) return;

    const contextKey = document.getElementById('sel-context').value;
    const modelKey = document.getElementById('sel-model').value;

    addMessage(prompt, 'user');
    document.getElementById('inp-prompt').value = '';
    const statusEl = document.getElementById('status-bar');
    statusEl.textContent = 'Processando...';

    try {
        const responseCtx = await runGeminiFlow({ prompt, contextKey, modelKey });
        addMessage(responseCtx.text, 'ai');
        statusEl.textContent = `Latência: ${responseCtx.meta.latencyMs}ms | Custo: $${responseCtx.meta.tokens.totalcost.toFixed(4)}`;
    } catch (error) {
        let errorMsg = error.message;
        if (errorMsg.includes('404')) {
            errorMsg = `Modelo não encontrado (404). Verifique se o nome "${STATE.schemas.models[modelKey].modelname}" está correto para o AI Studio.`;
        }
        addMessage(`Erro: ${errorMsg}`, 'system');
        statusEl.textContent = 'Erro na requisição';
    }
}

function addMessage(text, type) {
    const history = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
    history.appendChild(div);
    history.scrollTop = history.scrollHeight;
}

async function runGeminiFlow({ prompt, contextKey, modelKey }) {
    const schemas = STATE.schemas;
    const modelSchema = schemas.models[modelKey];
    const mode = modelKey === 'image' ? 'image' : 'text';

    // Normalização de Nome de Modelo (Vertex para AI Studio)
    let modelName = modelSchema.modelname;
    if (mode === 'image' && modelName.includes('imagen-3.0-generate-002')) {
        console.warn('⚠️ Normalizando ID de modelo Imagen (002 -> 001) para compatibilidade com v1beta.');
        modelName = 'imagen-3.0-generate-001';
    }

    // System Instruction
    let sysInstr = "";
    if (schemas.systemInstruction[contextKey]) {
        sysInstr = schemas.systemInstruction[contextKey][mode] || schemas.systemInstruction[contextKey];
    }

    const modelConfig = { model: modelName };
    if (mode === 'text') {
        modelConfig.systemInstruction = sysInstr;
    }

    const finalPrompt = mode === 'image' ? `${sysInstr}\n\nUser request: ${prompt}` : prompt;
    const genModel = STATE.genAI.getGenerativeModel(modelConfig);

    const generationConfig = {};
    const requestOptions = {};

    if (schemas.responseSchema[contextKey] && schemas.responseSchema[contextKey][mode]) {
        const node = schemas.responseSchema[contextKey][mode];

        if (mode === 'text') {
            generationConfig.responseMimeType = "application/json";
            generationConfig.responseSchema = node;
        } else {
            const cfg = node.config;
            generationConfig.candidateCount = cfg.numberOfImages || 1;

            if (cfg.safetySetting) {
                const cats = [
                    "HARM_CATEGORY_HARASSMENT",
                    "HARM_CATEGORY_HATE_SPEECH",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "HARM_CATEGORY_DANGEROUS_CONTENT"
                ];
                requestOptions.safetySettings = cats.map(c => ({
                    category: c,
                    threshold: cfg.safetySetting
                }));
            }
        }
    }

    const startTime = Date.now();

    const payload = {
        contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
        generationConfig,
        ...requestOptions
    };

    const result = await genModel.generateContent(payload);
    const response = await result.response;

    let text = "";
    let htmlContent = "";

    try { text = response.text(); } catch (e) { }

    const candidates = response.candidates;
    if (candidates?.[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData) {
                htmlContent += `<br><img src="data:${part.inlineData.mimeType};base64,${part.inlineData.data}" style="max-width:100%; border-radius:8px; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">`;
            }
        }
    }

    const endTime = Date.now();
    const usage = response.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };

    let cost = 0;
    if (mode === 'image') {
        cost = modelSchema.cost_per_image_1k_usd || 0.03;
    } else {
        cost = ((usage.promptTokenCount / 1e6) * modelSchema.input_cost_usd_1m) +
            ((usage.candidatesTokenCount / 1e6) * modelSchema.output_cost_usd_1m);
    }

    return {
        text: text + htmlContent,
        meta: {
            latencyMs: endTime - startTime,
            tokens: { ...usage, totalcost: cost }
        }
    };
}

init();