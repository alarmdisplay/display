// Initializes the `locations` service on path `/api/v1/locations`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Locations } from './locations.class';
import createModel from '../../models/locations.model';
import hooks from './locations.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/locations': Locations & ServiceAddons<any>;
  }

  interface LocationData {
    id?: number
    rawText: string
    latitude?: number
    longitude?: number
    name: string
    street: string
    number: string
    detail: string
    municipality: string
    district: string
    incidentId?: number
    hubLocationId?: number
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    multi: ['remove'],
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/locations', new Locations(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/locations');

  service.hooks(hooks);
}
