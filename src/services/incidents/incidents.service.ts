// Initializes the `incidents` service on path `/api/v1/incidents`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Incidents } from './incidents.class';
import createModel from '../../models/incidents.model';
import hooks from './incidents.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'api/v1/incidents': Incidents & ServiceAddons<any>;
  }

  interface IncidentData {
    id: number
    time: Date
    sender: string
    ref: string
    caller_name: string
    caller_number: string
    reason: string
    keyword: string
    description: string
    status: 'Actual'|'Exercise'|'Test'
    category: 'Geo'|'Met'|'Safety'|'Security'|'Rescue'|'Fire'|'Health'|'Env'|'Transport'|'Infra'|'CBRNE'|'Other'
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/api/v1/incidents', new Incidents(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('api/v1/incidents');

  service.hooks(hooks);
}
