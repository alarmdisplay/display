// Initializes the `api-keys` service on path `/api/v1/api-keys`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { ApiKeys } from './api-keys.class';
import createModel from '../../models/api-keys.model';
import hooks from './api-keys.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/api-keys': ApiKeys & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/api-keys', new ApiKeys(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/api-keys');

  service.hooks(hooks);
}
