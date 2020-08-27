<<<<<<< HEAD
# display
=======
# Display  Backend
[![Build Status](https://travis-ci.com/alarmdisplay/display-backend.svg?branch=develop)](https://travis-ci.com/alarmdisplay/display-backend)

This component is the connection point for all Display units.
While it maintains a [Socket.IO](https://socket.io/) connection with the Displays to push updates, it also offers a REST API to manage the Displays and their contents.

## Development
In order to run a development version on your local system, you need a [Node.js](https://nodejs.org/) environment and a MariaDB instance.
Clone the repository and run `npm install` inside the project folder to install all the dependencies.
Create a file called `development.json` in the `config/` folder, which lets you override single properties of `config/default.json`.
At minimum, you will need the `mysql` property to set up the database connection.

Start the development server by running `npm run dev`, it will automatically restart when files have changed.
Now you can access the server on http://localhost:3031.

### Libraries and frameworks
This project uses the following libraries or frameworks, please refer to their documentation as well.
- [FeathersJS](https://feathersjs.com/)

## Deployment
At the moment, this project is not ready for deployment outside of a development environment.
>>>>>>> backend/master
