const jsonDebug = {
    "display": "html", 
    "alllogs": { 
        "log": true, "logr": true, "logb": true, "logy": true, 
        "logo": true, "logg": true, "logp": true, "logw": true, "logins": true, 
        "logweak": true, "logfunc": true, "logmeth": true, "logstart": true 
    },
    "allkeys": {
        "STRT": false,
        "CONFIG": false,
        "CHTN": true
    },
    "palette": {
        "r": "#c0392b", "b": "#3498db", "y": "#f1c40f", "o": "#e67e22", "g": "#2ecc71",
        "p": "#9b59b6", "w": "#F79F1F", "ins": "#f39c12", "weak": "#2ecc71", "func": "#3498db",
        "meth": "#2980b9","start": "#1abc9c", "default": "#1abc9c"
    },
    "channels": [
        { "name": "log", "color": "default", "emoji": "", "tag": "" },
        { "name": "logr", "color": "r", "emoji": "", "tag": "" },
        { "name": "logb", "color": "b", "emoji": "", "tag": "" },
        { "name": "logy", "color": "y", "emoji": "", "tag": "" },
        { "name": "logo", "color": "o", "emoji": "", "tag": "" },
        { "name": "logg", "color": "g", "emoji": "", "tag": "" },
        { "name": "logp", "color": "p", "emoji": "", "tag": "" },
        { "name": "logw", "color": "w", "emoji": "", "tag": "" },
        { "name": "logins", "color": "ins", "emoji": "⭐", "tag": "ins" },
        { "name": "logweak", "color": "weak", "emoji": "🌿", "tag": "weak" },
        { "name": "logfunc", "color": "func", "emoji": "🟦", "tag": "func" },
        { "name": "logmeth", "color": "meth", "emoji": "🔹", "tag": "meth" },
        { "name": "logstart", "color": "start", "emoji": "", "tag": "start" }
    ]
};

function GENLog() {
    const { display, palette, channels, alllogs, allkeys } = jsonDebug;

    const getActiveState = (mode) => {
        if (mode === 'disable') return false;
        if (mode === 'html') return window.location.pathname.endsWith('.html');
        return true;
    };

    const globalActive = getActiveState(display);

    // Função para criar um "silenciador" que aceita qualquer sub-propriedade sem quebrar
    const createSilentProxy = () => {
        const silent = () => {};
        return new Proxy(silent, {
            get: () => createSilentProxy(), // Permite encadeamento infinito: log.KEY.TAG.SUB...
            apply: () => {}                 // Permite execução: log.KEY()
        });
    };

    channels.forEach(ch => {
        const bg = palette[ch.color] || palette.default;
        const det = ch.emoji ? `${ch.emoji} ` : '';
        
        // Estilos
        const styleCircle = `background: ${bg}; font-size: 5px; padding: 0px 6px; border-radius: 5px; line-height: 1; margin: 8px 4px 8px 0;`;
        const styleKey = `background: transparent; border: ${bg} 1px solid; color: ${bg}; font-weight: 400; font-size: 10px; padding: 2px 3px; border-radius: 3px; margin: 8px 4px 8px 0;`;
        const styleTag = `background: ${bg}; color: #fff; font-weight: 600; font-size: 11px; padding: 2px 4px; border-radius: 3px; margin: 8px 4px 8px 0;`;

        const isChannelEnabled = alllogs[ch.name] === true;

        // Base (Bolinha)
        const baseLog = (globalActive && isChannelEnabled)
            ? console.log.bind(console, `%s%c  `, det, styleCircle)
            : createSilentProxy();

        window[ch.name] = new Proxy(baseLog, {
            get: (target, prop) => {
                if (!isChannelEnabled || !globalActive) return createSilentProxy();
                
                // Métodos nativos do console
                if (prop in console && typeof console[prop] === 'function') {
                    return console[prop].bind(console);
                }

                // Validação de Chave (allkeys)
                const isKeyConfigured = allkeys && allkeys.hasOwnProperty(prop);
                if (isKeyConfigured && allkeys[prop] === false) {
                    return createSilentProxy(); // Retorna o Proxy que não quebra
                }

                // Define se usa estilo de KEY (vazado) ou TAG (preenchido)
                const currentStyle = isKeyConfigured ? styleKey : styleTag;
                const firstLevelLog = console.log.bind(console, `%s%c${prop.toUpperCase()}`, det, currentStyle);

                return new Proxy(firstLevelLog, {
                    get: (t, subTag) => {
                        // Segundo nível (log.KEY.TAG)
                        return console.log.bind(console, `%s%c${prop.toUpperCase()}%c${subTag.toUpperCase()}`, det, styleKey, styleTag);
                    }
                    // Note: Não usamos 'apply' aqui para preservar o link da linha original do console
                });
            }
        });
    });

    // Método de Escopo para IIFEs
    window.GENLog = window.GENLog || {};
    window.GENLog.display = function (params = {}) {
        const localMode = typeof params === 'string' ? params : (params.display || '');
        const isScopeActive = (display === 'disable') ? false : getActiveState(localMode);
        
        const scope = {};
        channels.forEach(ch => {
            scope[ch.name] = new Proxy(window[ch.name], {
                get: (target, prop) => isScopeActive ? target[prop] : createSilentProxy()
            });
        });
        return scope;
    };
}
GENLog();

window.GENSamples = (function () {
    function genlog() {
        logmeth('genlog---> Running')

        logy.GForm('GENLogSample ---> Running')
        // Exibe uma bolinha verde e a mensagem
        logg("Processamento concluído com sucesso!");

        // Exibe uma bolinha vermelha
        logr("Ocorreu um erro na validação do formulário.");

        // Exibe uma bolinha azul
        logb("Buscando dados no servidor...");

        // No caso do logins, exibe a bolinha 'ins' + a estrela ⭐
        logins("Novo usuário logado no CRM.");

        // Exibe um retângulo verde com o texto "SQL"
        logg.SQL("SELECT * FROM usuarios WHERE id = 10");

        // Exibe um retângulo vermelho com o texto "AUTH"
        logr.AUTH("Token de acesso expirado.");

        // Exibe um retângulo laranja (logo) com o texto "AVISO"
        logo.AVISO("A memória do sistema está acima de 80%");

        // Exibe um retângulo roxo (logp) com o texto "SVELTE"
        logp.SVELTE("Componente Sidebar montado.");

        // Usa o estilo de aviso do navegador (triângulo amarelo)
        logy.warn("Este recurso será descontinuado na v2.0");
        
        // Usa o estilo de aviso do navegador (triângulo amarelo)
        logb.STRT("Este recurso será descontinuado na v2.0");
        
        // Usa o estilo de aviso do navegador (triângulo amarelo)
        logy.STRT("Este recurso será descontinuado na v2.0");

        // Exibe os dados em formato de tabela
        const usuarios = [{ id: 1, nome: 'João' }, { id: 2, nome: 'Maria' }];
        logb.table(usuarios);
    }

    return {
        genlog: genlog
    }
})();
//GENSamples.genlog()

function GENLogDev() {
    // Validação de segurança via jsonDebug
    if (!jsonDebug || !jsonDebug.devconsole) return;

    const estiloMain = `color: #f1c40f; font-size: 1.2em; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #f1c40f; padding-bottom: 2px;`;
    const estiloExplica = 'color: #7f8c8d; font-style: italic; font-size: 0.85em;';

    console.groupCollapsed('%c 🛠️ GÊNLUZ ULTIMATE DEV DASHBOARD ', estiloMain);

    // --- BLOCO 1: PERFORMANCE & BOOT ---
    console.groupCollapsed('⚡ PERFORMANCE & BOOT');
    const loadTime = (performance.now() / 1000).toFixed(3);
    logg.PERF(`Tempo de Inicialização: ${loadTime}s`);

    if (performance.memory) {
        const usedMem = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
        const limitMem = (performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);
        logy.MEM(`Memória em Uso: ${usedMem}MB / ${limitMem}MB`);
    }
    console.groupEnd();

    // --- BLOCO 2: ESTRUTURA DE SCRIPTS ---
    console.groupCollapsed('📦 LOADED SCRIPTS (GEN-CORE)');
    const genScripts = Array.from(document.querySelectorAll('script[src*="GEN-script-"]'))
        .map(s => ({
            "Arquivo": s.src.split('/').pop(),
            "Async": s.async,
            "Defer": s.defer
        }));
    if (genScripts.length > 0) {
        console.table(genScripts);
    } else {
        logr.WARN('Nenhum script do núcleo GEN detectado no DOM.');
    }
    console.groupEnd();

    // --- BLOCO 3: SEO & SOCIAL (OG TAGS) ---
    console.groupCollapsed('🔍 SEO & SOCIAL (META TAGS)');
    const getMeta = (name) => {
        const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        return el ? el.getAttribute('content') : null;
    };

    const seoData = {
        "Description": getMeta('description') || '❌ Ausente',
        "OG:Title": getMeta('og:title') || '❌ Ausente',
        "OG:Image": getMeta('og:image') || '❌ Ausente',
        "OG:Type": getMeta('og:type') || '❌ Ausente',
        "Twitter:Card": getMeta('twitter:card') || '❌ Ausente',
        "Canonical": document.querySelector('link[rel="canonical"]')?.href || '❌ Ausente'
    };
    console.table(seoData);

    const ogImage = getMeta('og:image');
    if (ogImage) {
        console.groupCollapsed('🖼️ Ver Preview da Imagem OG');
        console.log('%c ', `font-size: 1px; padding: 80px 120px; background-image: url(${ogImage}); background-size: contain; background-repeat: no-repeat; border: 1px solid #333;`);
        console.log(`URL: ${ogImage}`);
        console.groupEnd();
    }
    console.groupEnd();

    // --- BLOCO 4: CONEXÃO & REDE ---
    console.groupCollapsed('🌐 CONNECTION & NETWORK');
    if (navigator.connection) {
        logb.NET('Tipo Efetivo:', navigator.connection.effectiveType);
        logb.NET('Downlink:', navigator.connection.downlink + ' Mbps');
        logb.NET('RTT:', navigator.connection.rtt + ' ms');
    }
    logb.NET('Protocolo:', location.protocol.toUpperCase());
    logb.NET('Online:', navigator.onLine ? '✅ Sim' : '❌ Não');
    console.groupEnd();

    // --- BLOCO 5: ROTEAMENTO & URL ---
    console.groupCollapsed('🔗 LOCATION & URL');
    log.URL('Caminho Atual:', location.pathname);
    log.URL('Origin:', location.origin);
    log.URL('Search Params:', location.search || 'Nenhum');
    log.URL('Referrer:', document.referrer || 'Entrada Direta');
    console.groupEnd();

    // --- BLOCO 6: DEVICE & VIEWPORT ---
    console.groupCollapsed('📱 DEVICE & VIEWPORT');
    logp.DEVICE('Resolução:', `${window.innerWidth}x${window.innerHeight} (DPR: ${window.devicePixelRatio})`);
    logp.DEVICE('Plataforma:', navigator.platform);
    logp.DEVICE('Idiomas:', navigator.languages.join(', '));
    console.groupEnd();

    // --- BLOCO 7: PERSISTÊNCIA (STORAGE) ---
    console.groupCollapsed('💾 STORAGE EXPLORER');
    logy.STORAGE(`LocalStorage: ${localStorage.length} itens`);
    logy.STORAGE(`SessionStorage: ${sessionStorage.length} itens`);

    if (localStorage.length > 0) {
        console.groupCollapsed('Visualizar LocalStorage');
        console.table(localStorage);
        console.groupEnd();
    }
    console.groupEnd();

    // --- BLOCO 8: DOCUMENTO & SEO BÁSICO ---
    console.groupCollapsed('📄 DOCUMENT METADATA');
    logg.DOC('Character Set:', document.characterSet);
    logg.DOC('Content Type:', document.contentType);
    logg.DOC('Last Modified:', document.lastModified);
    console.groupEnd();

    console.log('%cConfiguração ativa: jsonDebug.devconsole = true', estiloExplica);
    console.groupEnd();
}
GENLogDev();

function GENPerform() {
    const { display, devperform } = jsonDebug;

    const getActiveState = (mode) => {
        if (mode === 'disable') return false;
        if (mode === 'html') return window.location.pathname.endsWith('.html');
        return true;
    };

    if (!getActiveState(display) || !devperform) return;

    window.addEventListener('load', () => {
        // Pequeno delay para garantir que o navegador processou todas as medidas
        setTimeout(() => {
            const resources = performance.getEntriesByType('resource');
            const targetScripts = [
                'GEN-script-dev.js', 'GEN-script-objects.js', 'GEN-script-start.js',
                'WEB-script-config.js', 'GEN-script-common.js', 'GEN-script-functions.js',
                'GEN-script-form.js', 'GEN-script-formDinamic.js', 'GEN-script-datagrid.js',
                'GEN-script-chart.js', 'WEB-script-website.js', 'WEB-script-listeners.js'
            ];

            const metrics = resources.filter(res =>
                targetScripts.some(s => res.name.includes(s))
            );

            console.groupCollapsed('%c ⚡ GÊNLUZ PERFORMANCE: NETWORK & LOAD ', 'color: #e67e22; font-weight: bold; border-bottom: 2px solid #e67e22;');

            // 1. Métricas de Rede (Arquivos)
            if (metrics.length > 0) {
                metrics.forEach(m => {
                    const fileName = m.name.split('/').pop().split('?')[0];
                    logb.LOAD(`${fileName}`, {
                        "Duração": `${m.duration.toFixed(2)} ms`,
                        "Tamanho": `${(m.transferSize / 1024).toFixed(2)} KB`,
                        "Caminho": m.name
                    });
                });
            }

            // 2. Métricas de Execução Interna (Marks/Measures)
            const internalMeasures = performance.getEntriesByType('measure');
            if (internalMeasures.length > 0) {
                console.groupCollapsed('⚙️ INTERNAL SCRIPT EXECUTION');
                internalMeasures.forEach(meas => {
                    // Usa o detail como nome da tag do log
                    const tag = (typeof meas.detail === 'string') ? meas.detail : 'EXEC';
                    logy[tag](`${meas.name}: ${meas.duration.toFixed(2)} ms`);
                });
                console.groupEnd();
            }

            // 3. Sumário Geral
            console.groupCollapsed('📊 TOTAL SUMMARY');
            const totalLoad = (performance.now()).toFixed(2);
            logg.TOTAL(`DOM Interativo em: ${totalLoad} ms`);
            logg.TOTAL(`Scripts Monitorados: ${metrics.length}`);
            console.groupEnd();

            console.groupEnd();
        }, 300);
    });
}
GENPerform();