const express = require('express');
const router = express.Router();
const Product = require('../server/BCKND-model-product');

// Rota GET - Lista todos os produtos (Para ver se gravou certinho)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota POST - Cria um novo produto no MongoDB
router.post('/', async (req, res) => {
    try {
        const { name, price } = req.body;
        
        // CUIDADO: Aqui é onde o Mongoose cria o documento no banco real!
        const novoProduto = new Product({ name, price });
        await novoProduto.save();
        
        res.status(201).json({ 
            message: 'Produto cadastrado com sucesso e salvo no MongoDB!', 
            data: novoProduto 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota GET - Pega um produto específico para teste rápido via navegador
router.get('/criar-teste', async (req, res) => {
    try {
        // Isso cria um produto fake apenas visitando a URL no navegador
        const novoProduto = new Product({ 
            name: `Produto de Teste ${Math.floor(Math.random() * 1000)}`, 
            price: (Math.random() * 100).toFixed(2)
        });
        await novoProduto.save();
        
        res.status(201).json({ 
            message: 'Criado com sucesso via GET! Abra o MongoDB Compass e atualize suas bases de dados.', 
            data: novoProduto 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
