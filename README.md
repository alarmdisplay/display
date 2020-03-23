# Display  Backend
[![Build Status](https://travis-ci.com/alarmdisplay/display-backend.svg?branch=develop)](https://travis-ci.com/alarmdisplay/display-backend)

This component is the connection point for all Display units.
While it maintains a [Socket.IO](https://socket.io/) connection with the Displays to push updates, it also offers a REST API to manage the Displays and their contents.

## Development
In order to run a development version on your local system, you need a [Node.js](https://nodejs.org/) environment and a [MongoDB](https://www.mongodb.com/) instance.
Clone the repository and run `npm install` inside the project folder to install all the dependencies.
Then create a `.env` file based on `.env.example` and adapt it to your local setup.

Start the development server by running `npm run dev`, it will automatically restart when files have changed.
Now you can access the server on http://localhost:3000 (may be a different port if you changed it in the `.env` file).

## Deployment
At the moment, this project is not ready for deployment outside of a development environment.

## API
The server offers an OpenAPI specification under `/api-docs.json` that can be used with tools like [Swagger UI](https://swagger.io/tools/swagger-ui/).
