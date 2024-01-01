const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const chatModel = require('./models/chatModel');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
    res.render('index');
});

// Route for chat room
app.post('/chat', (req, res) => {
    const userId = req.body.userId;
    chatModel.getAllMessages((err, messages) => {
        if (err) {
            res.status(500).send('Error retrieving messages from database');
        } else {
            res.render('chat', { userId, messages });
        }
    });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', (msg) => {
        chatModel.addMessage(msg.userId, msg.text, (err) => {
            if (err) {
                console.log('Error inserting message into database', err);
            } else {
                io.emit('chat message', msg);
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
