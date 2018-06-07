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

const Redis = require('ioredis');
// Redis Cluster/Sentinel
var redisType = ENV.REDIS_TYPE;

if (redisType == 'cluster') {
    const redisServers = JSON.parse(ENV.REDIS_CLUSTERS);
    // End Redis Cluster/Sentinel
    var adapter = redisAdapter({
        pubClient: new Redis.Cluster(redisServers),
        subClient: new Redis.Cluster(redisServers)
    });
} else {
    const redisServer = JSON.parse(ENV.REDIS);
    var adapter = redisAdapter(redisServer);
}

adapter.pubClient.on('error', function(err) {
    console.log('redis adapter pub client error', err);
});

adapter.subClient.on('error', function(err) {
    console.log('redis adapter sub client error', err);
});

io.adapter(adapter);

// all client routes is located here
app.use('/', express.static(__dirname + '/public'));

require('./routes')(app);

io.on('connection', (socket) => {

    console.log('a user has connected with socketId', socket.id, 'in process id', process.pid);
    socket.join('chat');
    socket.on('sendMessage', function(data) {
        console.log('receive a message from', this.id, 'in process id', process.pid);
        console.log('saying:', data);
        socket.broadcast.to('chat').emit('messageReceive', data);
    });
});

server.listen(config.port, function() {
    console.log('Node development server started on', config.host, 'port', config.port);
});
