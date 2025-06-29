// Initializes the `settings` service on path `/settings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Settings } from './settings.class';
import createModel from '../../models/settings.model';
import hooks from './settings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'settings': Settings & ServiceAddons<any>;
  }

  interface SettingsData {
    key: string
    value: SettingsValue
  }

  interface CoordinateValue {
    latitude: number
    longitude: number
  }

  type SettingsValue = null | string | number | CoordinateValue
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    id: 'key',
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/settings', new Settings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('settings');

  service.hooks(hooks);
}
