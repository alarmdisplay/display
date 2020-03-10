const log4js = require('log4js');

module.exports = class SocketController {
    constructor(io, controller) {
        this.logger = log4js.getLogger('SocketController');
        this.io = io;
        this.controller = controller;

        this.io.use((socket, next) => this.verifyNewSocket(socket, next));
        this.io.on('connection', socket => this.onConnected(socket));

        this.sockets = new Map();
    }

    onConnected(socket) {
        this.logger.debug(`Socket ${socket.id} connected`);
        socket.emit('test message', { key: 'value' });

        socket.on('error', (error) => this.logger.error(`Socket ${socket.id}`, error));
        socket.once('disconnect', (reason) => this.onDisconnect(socket, reason));

        let displayId = socket.handshake.query.displayId;
        this.sockets.set(displayId, socket);
    }

    onDisconnect(socket, reason) {
        this.logger.debug(`Socket ${socket.id} disconnected with reason ${reason}`);
        let displayId = socket.handshake.query.displayId;
        this.logger.debug('Display ID', displayId);
        this.sockets.delete(displayId);
    }

    /**
     * socket.io middleware to verify if a new socket connection should be allowed
     *
     * @param socket
     * @param next
     * @return {Promise<*>}
     */
    async verifyNewSocket(socket, next) {
        let displayId = socket.handshake.query.displayId;
        this.logger.debug(`Authenticating display with id ${displayId}`);

        let display = await this.controller.findDisplay(displayId);

        if (display === null || !display.active) {
            this.logger.warn(`Could not find a display with id ${displayId}`);
            return next({
                data: {
                    type: 'UnknownDisplay'
                }
            });
        }

        this.logger.info('All good');
        return next();
    }
};
