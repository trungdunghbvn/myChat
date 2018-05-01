var express = require('express');
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

server.listen(3000);

var mangUser = {'test':'dung', 'test2':'mind'};
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
});

io.on('connection', function (socket) {
    socket.on("dk_username",function (data) {
        if(data in mangUser){
            socket.emit("dangky_thatbai");
        }else{
            socket.Username = data;
            mangUser[socket.Username] = socket;
            socket.emit("dangky_thanhcong",data)
            updateNickNames();
        }
    })

    function updateNickNames(){
        io.sockets.emit('danhsach_user', Object.keys(mangUser));
    }
    socket.on('open-chatbox', function (data) {
        mangUser[data].emit('openbox', {nick:socket.Username})
    })

    socket.on('send_message_one',function (data) {
        mangUser[data.sendto].emit('new_message', {msg:data.msg , nick: socket.Username, sendto: data.sendto});
        mangUser[socket.Username].emit('new_message', {msg:data.msg , nick: socket.Username, sendto: data.sendto})
    })

    socket.on("logout",function () {
        if(!socket.Username) return;
        delete mangUser[socket.Username];
        updateNickNames();
    });
    socket.on("send_message",function (data) {
        socket.broadcast.emit("server_send_message",{un:socket.Username, nd:data});
        socket.emit("server_send_message_me",{un:socket.Username, nd:data})
    })
    socket.on('disconnect', function (data) {
        if(!socket.Username) return;
        delete mangUser[socket.Username];
        updateNickNames();
    })
});
