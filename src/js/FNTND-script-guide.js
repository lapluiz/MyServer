// 1. DISSERTAÇÃO: Esta é a forma mais clássica. A função é "içada" (hoisted) para o topo do seu escopo pelo motor do JavaScript,
// o que significa que você pode chamá-la antes mesmo de sua declaração no código. Ela possui seu próprio escopo e contexto (this).
// 2. MELHORES SITUAÇÕES DE USO: Ideal para declarar funções utilitárias ou principais em um escopo global ou de módulo,
// quando a organização não exige que a função seja tratada como uma variável e a legibilidade do "içamento" é desejada.
function funcaoDeclarada() {
    console.log('Tipo: Função Declarada (Function Declaration)');
}
funcaoDeclarada();


// 1. DISSERTAÇÃO: Aqui, uma função sem nome (anônima) é atribuída a uma variável. Diferente da declarada, ela não é "içada",
// então só pode ser chamada após a linha de sua atribuição. Ela se comporta como uma variável, podendo ser passada como argumento ou retornada de outra função.
// 2. MELHORES SITUAÇÕES DE USO: Perfeita para callbacks, argumentos de outras funções (ex: em `map`, `filter`, `reduce`),
// ou quando a função precisa ser definida condicionalmente dentro de um bloco `if/else`.
const expressaoDeFuncaoAnonima = function () {
    console.log('Tipo: Expressão de Função Anônima (Anonymous Function Expression)');
};
expressaoDeFuncaoAnonima();



// 1. DISSERTAÇÃO: Similar à expressão de função anônima, mas a função tem um nome. Esse nome é útil principalmente para depuração (debugging),
// pois aparecerá em stack traces de erros, facilitando a identificação da origem do problema. O nome da função só é acessível dentro dela mesma.
// 2. MELHORES SITUAÇÕES DE USO: Ótima para fins de depuração e para criar funções recursivas onde a função precisa se referir a si mesma pelo nome.
const expressaoDeFuncaoNomeada = function minhaFuncaoInterna() {
    // console.log(minhaFuncaoInterna); // Descomente para ver que o nome é acessível aqui dentro
    console.log('Tipo: Expressão de Função Nomeada (Named Function Expression)');
};
expressaoDeFuncaoNomeada();


// 1. DISSERTAÇÃO: As Arrow Functions oferecem uma sintaxe mais curta e não possuem seu próprio `this`. Em vez disso,
// elas herdam o `this` do escopo pai no momento em que são definidas. Isso resolve muitos problemas comuns de contexto em callbacks e `event listeners`.
// 2. MELHORES SITUAÇÕES DE USO: Excelentes para funções de uma linha (com retorno implícito) e para callbacks dentro de métodos de objetos,
// onde você quer manter o `this` do objeto original sem precisar usar `.bind(this)`.
const arrowFunction = () => {
    console.log('Tipo: Função de Seta (Arrow Function)');
};
arrowFunction();


// 1. DISSERTAÇÃO: A IIFE (Immediately Invoked Function Expression) é uma função que é definida e executada imediatamente.
// O principal benefício é a criação de um escopo privado, protegendo variáveis e funções de poluírem o escopo global.
// 2. MELHORES SITUAÇÕES DE USO: Ideal para inicializar configurações, executar código de setup uma única vez e para o "Module Pattern",
// onde se cria um módulo com membros públicos e privados sem sujar o escopo global.
(function () {
    let variavelPrivada = 'Estou protegida';
    console.log('Tipo: Função Imediatamente Invocada (IIFE)');
    console.log(variavelPrivada);
})();


// 1. DISSERTAÇÃO: Esta é uma variação da IIFE. A função é executada imediatamente e o valor que ela retorna é atribuído à constante `meuModulo`.
// Isso encapsula a lógica de criação, expondo apenas o que é retornado, um conceito fundamental do "Module Pattern".
// 2. MELHORES SITUAÇÕES DE USO: Perfeito para criar "módulos" ou "singletons" (objetos únicos) em JavaScript antes do ES6 Modules.
// Você pode inicializar um objeto complexo e expor apenas uma API pública para ele.
const moduloComRetorno = (function () {
    console.log('Tipo: IIFE com atribuição de retorno a uma constante');

    function metodoPrivado() {
        return 'informação secreta';
    }

    return {
        metodoPublico: function () {
            return 'Acessando a ' + metodoPrivado();
        }
    };
})();
console.log(moduloComRetorno.metodoPublico());


// 1. DISSERTAÇÃO: Similar ao exemplo anterior, mas o resultado da IIFE é atribuído diretamente a uma propriedade do objeto global `window`.
// Isso torna o resultado (neste caso, o objeto retornado) acessível globalmente em qualquer parte do código do navegador.
// 2. MELHORES SITUAÇÕES DE USO: Usado em cenários mais antigos de desenvolvimento para criar bibliotecas ou frameworks que precisam expor uma API global
// (como o jQuery fazia com o `$`). Hoje em dia, é preferível usar módulos ES6.
window.minhaApiGlobal = (function () {
    console.log('Tipo: IIFE atribuída a uma propriedade do objeto `window`');
    return {
        versao: '1.0'
    };
})();
console.log('Versão da API Global:', window.minhaApiGlobal.versao);


// 1. DISSERTAÇÃO: Uma função construtora é um "molde" para criar múltiplos objetos com a mesma estrutura.
// Ela é chamada com o operador `new`, que cria um novo objeto vazio, define o `this` para esse objeto, executa o código da função e o retorna.
// 2. MELHORES SITUAÇÕES DE USO: Essencial para programação orientada a objetos no estilo "prototypal" do JavaScript.
// Use-a sempre que precisar criar múltiplas instâncias de um "tipo" de objeto (ex: `Usuario`, `Produto`).
function ConstrutoraDePessoa(nome) {
    this.nome = nome;
    console.log('Tipo: Função Construtora (Constructor Function)');
}
const pessoa = new ConstrutoraDePessoa('Carlos');
console.log('Objeto criado:', pessoa);


// 1. DISSERTAÇÃO: Uma função de callback é uma função que é passada como argumento para outra função, para ser "chamada de volta" (called back) mais tarde.
// Isso permite a execução de código assíncrono ou a customização de uma função principal.
// 2. MELHORES SITUAÇÕES DE USO: Indispensável para lidar com operações assíncronas como requisições de rede (AJAX, Fetch API),
// eventos do usuário (cliques, digitação) e em funções de arrays como `forEach`, `map`, `filter`.
function executaAlgo(funcaoCallback) {
    console.log('Executando a função principal...');
    // Simula uma espera (ex: chamada de API)
    setTimeout(function () {
        funcaoCallback();
    }, 1000); // espera 1 segundo
}

executaAlgo(function () {
    // Esta é a função callback
    console.log('Tipo: Função de Callback (Callback Function)');
});


//////////////////////// New IIFE model GENIUZ ////////////////////////////////
//////////////////////// New IIFE model GENIUZ ////////////////////////////////
//////////////////////// New IIFE model GENIUZ ////////////////////////////////

//const = sampleIIFE = (function () {...

window.sampleIIFE = (function () {
    // O que faz o "use strict" ele eliminia erros que o javascript deixa passar e que não foram corrigidos de forma obrigatória para não prejudicar códigos antigos que ja rodam sem ele, exemplos: uso de variaveis sem declaração, operações entre variaveis de tipagem diferente e etc.
    'use strict';

    //Acumulador de instâncias. a nova regra de IIFE agora também encapsula 
    const instances = {};
    function _resolveInstance(params) {
        const instanceId = params.id;

        const runAction = (actionParams) => {
            // Remove o ID dos parâmetros da ação para não ser redundante
            delete actionParams.id;
            console.group(`AÇÃO na instância [${instanceId}]`);
            console.log('--> Dados da Ação:', actionParams);
            console.groupEnd();
            // Lógica real da ação (ex: atualizar DOM, fazer requisição, etc.)
        };
        const generateHTML = (generateParams) => {
            // Possivel novo methodo para geração de html
        };
        return {
            id: instanceId,
            runAction: runAction,
            generateHTML: generateHTML
        };
    }

    function _init(params) {
        // O metodo _init tem como papel tentar resgatar um ID, para obter a instancia correspondente, caso não exista ele criará uma nova instância, mas casou também não exista um id nos parametros da chamada _init cria um novo ID e respectivamente uma nova instância. Este methodo mesmo fora de _resolveInstance é privado e sinalizado pelo (_) Underline
        let id = params.id;
        if (!id) {
            id = GENId();
            params.id = id;
        }
        if (!instances[id]) {
            instances[id] = _resolveInstance(params);
        }
        return instances[id];
    }

    function create(params = {}) {
        //Este método tem como objetivo ser um modelo onde serão aplicados os códigos de criação de elementos novos e dinâmicos não existentes no DOM.
        const instance = _init(params);
        console.log(`CREATE: Instância [${instance.id}] resolvida.`);
        return instance;
    }

    function mount(params = {}) {
        //Este método tem como objetivo ser um modelo onde serão aplicados os códigos de criação de elementos novos e dinâmicos não existentes no DOM.
        if (!params.id) { console.error('LOAD: Requer um "id".'); return; }
        const instance = _init(params);
        console.log(`LOAD: Instância [${instance.id}] carregada.`);
        return instance;
    }

    function getInstance(id) {
        return instances[id];
    }

    function delInstance(id) {
        // Verifica se a instância existe antes de deletar
        if (instances[id]) {
            delete instances[id];
            console.log(`Instância "${id}" deletada com sucesso.`);
            //return true; // Retorna true para indicar sucesso
        } else {
            console.warn(`Instância "${id}" não encontrada.`);
            //return false; // Retorna false se a instância não existia
        }
        console.log('Instances.: ', instances)
    }

    function action(params = {}) {
        const id = params.id;
        if (!id) {
            console.error('RUN_ACTION: A chamada do método requer um "id".');
            return;
        }

        const instance = getInstance(id);

        if (instance && typeof instance.runAction === 'function') {
            // Passa todos os parâmetros para o método da instância
            instance.runAction(params);
        } else {
            console.error(`RUN_ACTION: Nenhuma instância ou método de ação encontrado para o ID [${id}].`);
        }
    }

    return {
        create: create,
        mount: mount,
        action: action,
        getInstance: getInstance
    };


    ////////// Use samples

    // // 1. Criamos um componente e guardamos seu ID (não precisamos da instância inteira)
    // const componenteInfo = sampleIIFE.create({ id: 'info-panel', type: 'painel' });
    // const idDoPainel = componenteInfo.id; // Guardamos apenas o 'crachá'

    // // 2. Criamos outro componente dinamicamente
    // const idDoGrafico = sampleIIFE.create({ type: 'grafico' }).id;

    // // 3. Agora, de qualquer lugar do código, sem precisar das variáveis 'componenteInfo' ou 'const',
    // //    podemos interagir com qualquer instância usando o "Controlador Central".

    // console.log('\n--- Interagindo via Controlador Central ---');

    // sampleIIFE.runAction({
    //     id: idDoPainel,
    //     command: 'updateContent',
    //     html: '<p>Novo conteúdo do painel!</p>'
    // });

    // sampleIIFE.runAction({
    //     id: idDoGrafico,
    //     command: 'refreshData',
    //     source: '/api/v2/data'
    // });

    // sampleIIFE.runAction({
    //     id: 'id-que-nao-existe',
    //     command: 'qualquer-coisa'
    // }); // Saída: Erro, como esperado.


})();



// modo sincrono 
/// js, gaxthen, GENAxios com then/catch/finally
function func() {

    const axiosObj = { method: 'post', url: 'https://www.meuendpoint.php/rota1', data: {} }
    return GENAxios(axiosObj).then(dataLoaded => {
        if (dataLoaded) {
            console.log("dataLoaded >>>> ", dataLoaded)
        } else {
            throw new Error("A requisição não retornou dados.")
        }
    })
        .catch(error => {
            console.error("Falha na chamada:", error);
            throw error;
        })
        .finally(() => {
            console.log("Limpeza de cache, DOM, loading e etc");
        });
}

// modo assincrono
/// js, gaxtry, GENAxios com try/catch/finally
async function start(params) {
    const axiosObj = { method: 'post', url: 'https://www.meuendpoint.php/rota1', data: {} }
    try {
        const dataLoaded = await GENAxios(axiosObj);
        if (dataLoaded) {
        } else {
            throw new Error("A requisição não retornou dados.")
        }
    } catch (error) {
        console.error("Falha na chamada:", error);
        throw error;
    } finally {
        console.log("Limpeza de cache, DOM, loading e etc");
    }
}

// modo assincrono (multiplo)
/// js, gaxtryall, GENAxios com try/catch/finally
axiosObj1 = { method: 'post', url: 'https://www.meuendpoint.php/rota1', data: {} }
axiosObj2 = { method: 'post', url: 'https://www.meuendpoint.php/rota2', data: {} }
axiosObj3 = { method: 'post', url: 'https://www.meuendpoint.php/rota3', data: {} }
async function start(params) {
    try {
        const [data1, data2, data3] = await Promise.all([
            GENAxios(axiosObj1),
            GENAxios(axiosObj2),
            GENAxios(axiosObj3)
        ]);
        if (data1 && data2 && data3) {
        } else {
            throw new Error("Uma ou mais requisições não retornaram dados.")
        }

    } catch (error) {
        // Remove o loading
        console.error("Falha na chamada assincrona multipla", error);
        throw error;
    } finally {
        // Executa sempre após o try ou o catch
        console.log("Finalizado: Esconder spinner do palco");
    }
}

// modo assincrono (multiplo em cascata)
axiosObj1 = { method: 'post', url: 'https://www.meuendpoint.php/rota1', data: {} }
axiosObj2 = { method: 'post', url: 'https://www.meuendpoint.php/rota2', data: {} }
axiosObj3 = { method: 'post', url: 'https://www.meuendpoint.php/rota3', data: {} }
async function start(params) {
    targetElement.innerHTML = `<div>Card de loading</div>`;
    try {
        const data1 = await GENAxios(axiosObj1);
        if (!data1) throw new Error("Falha ao carregar data1 (base para os demais).");

        // Aguarda o await acima
        const [data2, data3] = await Promise.all([
            GENAxios(axiosObj2),
            GENAxios(axiosObj3)
        ])
        if (data1 && data2 && data3) {
            const HTMLresult = `<div>Conteúdo construido</div>`
            targetElement.innerHTML = HTMLresult;
        } else {
            throw new Error("Uma ou mais requisições não retornaram dados.")
        }

    } catch (error) {
        // Remove o loading
        targetElement.innerHTML = `<div>Card de error</div>`
        console.error("Falha na chamada assincrona multipla em cascata", error);
        throw error;
    } finally {
        // Executa sempre após o try ou o catch
        console.log("Finalizado: Esconder spinner do palco");
    }
}
