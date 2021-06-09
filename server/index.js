var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: true
    //     {
    //     origin: "http://127.0.0.1:2233",
    //     methods: ["GET", "POST"]
    // }
});

app.get('/', function (req, res) {
    res.send('<h1>Hello world</h1>');
});

//服务端接收每个客户端的实时信息（位置信息与旋转信息），并广播给其他客户端。
io.on('connection', function (socket) {
    console.log('client '+ socket.id + ' connected');
    socket.on('player', function (data) {
        data.socketid = socket.id;
        socket.broadcast.emit('player', data);
    });
    //当有某个客户端断开连接的时候，也要做一次广播。
    socket.on('disconnect', function () {
        console.log('client ' + socket.id + ' disconnected');
        socket.broadcast.emit('offline', {socketid: socket.id});
    })
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});
