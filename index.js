const express = require('express');
const path = require('path');

const app = express();

// Serve automaticamente todos os arquivos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log('Servidor rodando e servindo a pasta public na porta 3000');
});