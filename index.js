require('dotenv').config();
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const log4js = require('log4js');

let logger = log4js.getLogger();
let debugEnabled = process.env.DEBUG === '1';
logger.level = debugEnabled ? 'debug' : 'info';

const Controller = require('./controller');

/**
 * Make sure that all required environment variables are set.
 */
function checkEnvironment() {
    let missingEnvs = [];

    for (let env of ['MONGODB_URI']) {
        if (!process.env.hasOwnProperty(env)) {
            missingEnvs.push(env);
        }
    }

    if (missingEnvs.length > 0) {
        throw new Error(`The following mandatory environment variables have not been set: ${missingEnvs.join(', ')}`);
    }
}

/**
 * socket.io middleware to verify if a new socket connection should be allowed
 *
 * @param socket
 * @param next
 * @return {Promise<*>}
 */
async function verifyNewSocket(socket, next) {
    let displayId = socket.handshake.query.displayId;
    logger.debug(`Authenticating display with id ${displayId}`);

    let display = await controller.findDisplay(displayId);

    if (display === null || !display.active) {
        logger.warn(`Could not find a display with id ${displayId}`);
        return next({
            data: {
                type: 'UnknownDisplay'
            }
        });
    }

    logger.info('All good');
    return next();
}

// Catches any exception that has not been caught yet
process.setUncaughtExceptionCaptureCallback(err => {
    logger.fatal('Uncaught Exception:', err);
    process.exit(1);
});

checkEnvironment();

let controller = new Controller();
controller.start(process.env.MONGODB_URI)
    .then(() => {
        let port = process.env.PORT || 3000;

        app.get('/', function(req, res){
            res.send('Hello World!');
        });

        const APIv1 = require('./api');
        app.use('/api/v1', new APIv1(controller).router);

        io.use(verifyNewSocket);

        io.on('connection', function(socket) {
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
    })
    .catch(reason => {
        logger.fatal('Could not start the server', reason);
        process.exit(2);
    });
