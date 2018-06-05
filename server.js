const ENV = require('node-env-file')(__dirname + '/.env');
// app port and host
const config = {
    host: ENV.NODE_URL,
    port: ENV.NODE_PORT,
};

const express = require('express');

var app = express();

const server = require('http').createServer(app);

const io = require('socket.io')(server);
const redisAdapter = require('socket.io-redis');
// Redis Clustering
// const Redis = require('ioredis');

// const startupNodes = [
//     {
//         port:
//     }
// ];
// End redis clustering

// all client routes is located here
app.use('/', express.static(__dirname + '/public'));

require('./routes')(app);

io.adapter(redisAdapter({host: config.host, port: 6379}));

io.on('connection', (socket) => {

    console.log('a user has connected with socketId', socket.id);
    socket.join('chat');
    socket.on('sendMessage', function(data) {
        console.log('receive a message from', this.id);
        console.log('saying:', data);
        socket.broadcast.to('chat').emit('messageReceive', data);
    });
});

server.listen(config.port, function() {
    console.log('Node development server started on', config.host, 'port', config.port);
});
