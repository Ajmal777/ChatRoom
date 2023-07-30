const express = require('express');

const app = express();

const server = require('http').Server(app);

app.use(express.static('public'));

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('connection established', socket.id);

    socket.on('message', (data) => {
        io.emit('message', data);
    })
    socket.on('disconnect', ()=>{
        console.log(socket.id, '-> left the chat');
        io.emit('left', 'someone');
    })
    socket.on('join', (username) => {
        io.emit('join', username);
    })
})

server.listen(3000, ()=>{
    console.log("sever running on http://localhost:3000");
})