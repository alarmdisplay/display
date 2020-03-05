require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.send('Hello World!');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.emit('test message', {key: 'value'});
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(port, function() {
    console.log(`listening on *:${port}`);
});
