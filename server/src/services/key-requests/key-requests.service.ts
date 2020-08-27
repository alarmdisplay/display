// Initializes the `key-requests` service on path `/api/v1/key-requests`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { KeyRequests } from './key-requests.class';
import hooks from './key-requests.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/key-requests': KeyRequests & ServiceAddons<any>;
  }

  interface KeyRequestData {
    name: string
    granted: boolean
    requestId: string
    apiKey: string
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
    multi: ['remove']
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/key-requests', new KeyRequests(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/key-requests');

  service.hooks(hooks);
}
