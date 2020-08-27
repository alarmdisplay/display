# Display Console

This web application offers a user interface to manage the [Display Server](../server).

## Development
In order to run a development version on your local system, you need a [Node.js](https://nodejs.org/) environment.
Clone the repository and run `npm install` inside the project folder to install all the dependencies.

Start the development server by running `npm run serve`, it will automatically restart when files have changed.
Now you can access the server on http://localhost:8080 (may be a different port on your system, check the console output).
If you run a development Display Server on http://localhost:3031, the requests are automatically proxied there.
This allows for parallel development of the Console and the backend.

### Libraries and frameworks
This project uses the following libraries or frameworks, please refer to their documentation as well.
- [Vue.js](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [FeathersVuex](https://vuex.feathersjs.com/)
- [Font Awesome](https://fontawesome.com/)

## Deployment
Run `npm run build`, which compiles and minifies the app for production.
You find the result of the build process in a folder called `dist`.
This folder only contains HTML, CSS, and JS files, which means they can be hosted as static files.
By default, the app expects to be accessible under the path `/console/`.
You can change this behaviour by adapting the `publicPath` in [vue.config.js](vue.config.js).
