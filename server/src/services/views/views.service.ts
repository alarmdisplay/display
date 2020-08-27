// Initializes the `views` service on path `/api/v1/views`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Views } from './views.class';
import createModel from '../../models/views.model';
import hooks from './views.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/views': Views & ServiceAddons<any>;
  }

  interface ViewData {
    type: string
    order: number
    columns: number
    rows: number
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/views', new Views(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/views');

  service.hooks(hooks);
}
