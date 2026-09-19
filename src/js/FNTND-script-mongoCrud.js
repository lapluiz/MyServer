/**
 * Testes Básicos de CRUD do MongoDB usando a API construída.
 * Este script utiliza o modelo / wrapper GENAxios do projeto.
 */
import { GENAxios } from './FNTND-script-requests.js';

// ==========================================
// 1. CREATE - CADASTRAR PRODUTO (POST)
// ==========================================
function testMongoCreateProduct(name, price) {
    // Como estamos usando rotas REST padrão, a "action" é o "method: 'post'"
    // O backend test.routes.js espera apenas { name, price } no corpo da requisição
    const axiosObj = {
        method: 'post',
        url: 'http://localhost:3000/api/test-mongo',
        data: {
            name: name,
            price: price
        }
    };

    return GENAxios(axiosObj)
        .then(dataLoaded => {
            if (dataLoaded) {
                console.log("SUCESSO (CREATE) >>>> Produto salvo no MongoDB:", dataLoaded);
                return dataLoaded;
            } else {
                throw new Error("A requisição não retornou dados.");
            }
        })
        .catch(error => {
            console.error("FALHA (CREATE) >>>> ", error);
            throw error;
        })
        .finally(() => {
            console.log("Finalizada execução do CREATE MongoDB.");
        });
}

// ==========================================
// 2. READ - LISTAR TODOS OS PRODUTOS (GET)
// ==========================================
function testMongoGetProducts() {
    // Como estamos apenas lendo, o "method" é 'get'. A URL já define que são os produtos do mongo.
    const axiosObj = {
        method: 'get',
        url: 'http://localhost:3000/api/test-mongo',
        data: {} // GET não envia data/body, mas deixamos vazio para o seu template
    };

    return GENAxios(axiosObj)
        .then(dataLoaded => {
            if (dataLoaded) {
                console.log("SUCESSO (READ) >>>> Lista de produtos do MongoDB:", dataLoaded);
                return dataLoaded;
            } else {
                throw new Error("A requisição não retornou dados.");
            }
        })
        .catch(error => {
            console.error("FALHA (READ) >>>> ", error);
            throw error;
        })
        .finally(() => {
            console.log("Finalizada execução do READ MongoDB.");
        });
}

// Exemplo de como você vai disparar essas funções no seu UI/console:
testMongoCreateProduct("Mouse Gamer RGB", 120.50);
testMongoGetProducts();
