// Initializes the `status` service on path `/status`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Status } from './status.class';
import hooks from './status.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'status': Status & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  // Initialize our service with any options it requires
  app.use('/status', new Status(app));

  // Get our initialized service so that we can register hooks
  const service = app.service('status');

  service.hooks(hooks);
}
