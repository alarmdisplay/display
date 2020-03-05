require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const log4js = require('log4js');

let logger = log4js.getLogger();
let debugEnabled = process.env.DEBUG === '1';
logger.level = debugEnabled ? 'debug' : 'info';

function checkEnvironment() {
    let missingEnvs = [];

    for (let env of []) {
        if (!process.env.hasOwnProperty(env)) {
            missingEnvs.push(env);
        }
    }

    if (missingEnvs.length > 0) {
        throw new Error(`The following mandatory environment variables have not been set: ${missingEnvs.join(', ')}`);
    }
}

// Catches any exception that has not been caught yet
process.setUncaughtExceptionCaptureCallback(err => {
    logger.fatal('Uncaught Exception:', err);
    process.exit(1);
});

checkEnvironment();

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

http.on('error', (err => {
    logger.error('Server error:', err);
}));
http.on('listening', () => {
    let address = http.address();
    logger.info(`Server listens on port ${address.port}`);
});
http.listen(port);
