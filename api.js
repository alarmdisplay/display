const express = require('express');
const log4js = require('log4js');

module.exports = class APIv1 {
    constructor(controller) {
        this.logger = log4js.getLogger('APIv1');
        this.controller = controller;
        this.router = express.Router();
        this.router.use(express.json());

        // Register the routes and their handlers
        this.router.get('/displays', this.getDisplays);
        this.router.post('/displays', this.postDisplays);
        this.router.get('/displays/:id', this.getDisplay);
        this.router.delete('/displays/:id', this.deleteDisplay);
        this.router.put('/displays/:id', this.putDisplay);

        // Add our own error handler to override the built-in one
        this.router.use(this.errorHandler);
    }

    /**
     * Error Handler, logs the error and sends the error as HTTP response.
     *
     * @param {Error} err
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     */
    errorHandler = (err, req, res, next) => {
        this.logger.error(err);
        res.status(500).json({error: {message: err.message}});
    };

    /**
     * Returns all the Displays.
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     */
    getDisplays = async (req, res, next) => {
        try {
            let displays = await this.controller.findDisplays();
            res.json(displays);
        } catch (e) {
            return next(e);
        }
    };

    /**
     * Creates a Display.
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     */
    postDisplays = async (req, res, next) => {
        try {
            let display = await this.controller.createDisplay(req.body.identifier, req.body.active, req.body.description, req.body.location);
            let baseUrl = req.originalUrl.replace(/\/$/, '');
            let newLocation = `${baseUrl}/${display.id}`;
            res.set('Location', newLocation).status(201).json(display);
        } catch (e) {
            return next(e);
        }
    };

    /**
     * Returns a single Display.
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     */
    getDisplay = async (req, res, next) => {
        try {
            let display = await this.controller.findDisplay(req.params.id);
            if (!display) {
                return res.sendStatus(404);
            }
            res.json(display);
        } catch (e) {
            return next(e);
        }
    };

    /**
     * Deletes a single Display.
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     */
    deleteDisplay = async (req, res, next) => {
        try {
            await this.controller.deleteDisplay(req.params.id);
            res.sendStatus(204);
        } catch (e) {
            return next(e);
        }
    };

    /**
     * Updates a single Display.
     *
     * @param {e.Request} req
     * @param {e.Response} res
     * @param {e.NextFunction} next
     */
    putDisplay = async (req, res, next) => {
        try {
            let display = await this.controller.updateDisplay(req.params.id, req.body);
            res.json(display);
        } catch (e) {
            return next(e);
        }
    };
};
