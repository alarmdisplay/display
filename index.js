require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const log4js = require('log4js');

let logger = log4js.getLogger();
let debugEnabled = process.env.DEBUG === '1';
logger.level = debugEnabled ? 'debug' : 'info';

let port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.send('Hello World!');
});

io.on('connection', function(socket){
    logger.info('a user connected');
    socket.emit('test message', {key: 'value'});
    socket.on('disconnect', function(){
        logger.info('user disconnected');
    });
});

http.listen(port, function() {
    logger.info(`listening on *:${port}`);
});
