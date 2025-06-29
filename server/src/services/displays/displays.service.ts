// Initializes the `displays` service on path `/displays`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Displays } from './displays.class';
import createModel from '../../models/displays.model';
import hooks from './displays.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'displays': Displays & ServiceAddons<any>;
  }

  interface DisplayData {
    id: number
    name: string
    active: boolean
    description: string,
    type: string
    views: ViewData[]
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/displays', new Displays(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('displays');

  service.hooks(hooks);
}
