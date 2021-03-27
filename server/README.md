# Display Server

The backend provides a REST API as well as WebSocket connections to notify clients about updates.
In production, it also serves the [Console](../console) and [Display](../frontend) frontends.

## Development
In order to run a development version on your local system, you need a [Node.js](https://nodejs.org/) environment, and a MariaDB instance.
- Clone the repository and run `npm install` in this folder to install all the dependencies.
- In the `config/` folder, copy the file `development.json` to `local-development.json`.
- At least set the `mysql` property of `local-development.json` to set up the database connection (e.g. `mysql://user:password@localhost:3306/database`).

Start the development server by running `npm run dev`, it will automatically restart when files have changed.
Now you can access the server on http://localhost:3031.

### Libraries and frameworks
This project uses the following libraries or frameworks, please refer to their documentation as well.
- [FeathersJS](https://feathersjs.com/)

## Deployment
At the moment, this project is not ready for deployment outside of a development environment.
