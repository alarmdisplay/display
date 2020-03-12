const express = require('express');
const log4js = require('log4js');

module.exports = class APIv1 {
    constructor(controller) {
        this.logger = log4js.getLogger('APIv1');
        this.controller = controller;
        this.router = express.Router();
        this.router.use(express.json());

        // Register the routes and their handlers
        let displayRoutes = require('./routes/displays')(controller);
        this.router.use('/displays', displayRoutes);

        // Add our own error handler to override the built-in one
        this.router.use((err, req, res, next) => {
            this.logger.error(err);
            res.status(500).json({error: {message: err.message}});
        });
    }
};
