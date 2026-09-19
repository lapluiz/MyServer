const mongoose = require('mongoose');

// Define um esquema simples para testar inserção no banco
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Cria o modelo 'Product' usando o esquema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
