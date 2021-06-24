// Initializes the `settings` service on path `/api/v1/settings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Settings } from './settings.class';
import createModel from '../../models/settings.model';
import hooks from './settings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/settings': Settings & ServiceAddons<any>;
  }

  interface SettingsData {
    key: string
    value: any
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    id: 'key',
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/settings', new Settings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/settings');

  service.hooks(hooks);
}
