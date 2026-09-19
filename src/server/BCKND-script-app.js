const express = require('express');
// const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const apiRoutes = require('../routes/api.routes');
const crudRoutes = require('../routes/crud.routes');
const testMongoRoutes = process.env.MONGO_URI
    ? require('../routes/test.routes')
    : null;
const whatsRoutes = require('./BCKND-script-whats');
const esp32Routes = require('./BCKND-script-esp32');

const app = express();
app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/')
//     .then(() => console.log('Conectado ao MongoDB!'))
//     .catch(err => console.error('Erro ao conectar:', err));

//app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../'))); // Serve root (index.html)
app.use('/css', express.static(path.join(__dirname, '../assets/css'))); // Serve CSS
app.use('/js', express.static(path.join(__dirname, '../js'))); // Serve JS Publico
app.use('/json', express.static(path.join(__dirname, '../json'))); // Serve JSON Schemas

// Pass io to routes if needed via middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/api/crud', crudRoutes);
if (testMongoRoutes) {
    app.use('/api/test-mongo', testMongoRoutes);
}
app.use('/api/whatsapp', whatsRoutes);
app.use('/api/esp32', esp32Routes);

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});



const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access: http://localhost:${PORT}`);
});

module.exports = app;
